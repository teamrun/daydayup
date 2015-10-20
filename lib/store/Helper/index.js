import shitId from 'shortid';
import Immutable from 'immutable';

import Drange from './drange';

let {List, Map: IMap} = Immutable;

let replaceBetween = (str, start, end, what) => {
    return str.substring(0, start) + what + str.substring(end);
};

let findMatchedIndex = (list, id) => {
    let matchedIndex;
    list.some((item, index) => {
        if(item.get('id') === id){
            matchedIndex = index;
            return true;
        }
        return false;
    });
    return matchedIndex;
}

let findPrevItem = (list, id) => {
    let result;
    let matchedIndex = findMatchedIndex(list, id);
    if(matchedIndex === undefined){
        return undefined
    }
    else{
        if(matchedIndex === 0){
            return undefined
        }
        else{
            return list.get(matchedIndex - 1);
        }
    }
}

let findNextItem = (list, id) => {
    let result;
    let matchedIndex = findMatchedIndex(list, id);
    if(matchedIndex === undefined){
        return undefined
    }
    else{
        if(matchedIndex === (list.length - 1)){
            return undefined
        }
        else{
            return list.get(matchedIndex + 1);
        }
    }
}

let logString = (stat, str) => {
    console.info(`[${stat}] ${str.trim()? str : '空格*'+str.length}`);
}



/*
 * @param {listData} Immutable.Map 文本数据
 * @param {rangeInfo} Object 选中区域数据
 */

let replaceContent = (listData, startId, endId, startOffset, endOffset, replacer) => {
    // 如果是同一行, 直接操作当前行的text就行
    if(startId === endId){
        let startItemIndex = findMatchedIndex(listData, startId);
        let startItem = listData.get( startItemIndex );
        let oldText = startItem.get('text');
        let newText = replaceBetween(oldText, startOffset, endOffset, replacer);
        return listData.set(startItemIndex, startItem.set('text', newText));
    }
    // 如果不是同一行, 将之间的行 和 end一行 都删除掉
    // 而且end一行合并到start行
    else{
        let startItemIndex = findMatchedIndex(listData, startId),
            endItemIndex = findMatchedIndex(listData, endId);
        let startItem = listData.get(startItemIndex);
        let oldStartText = startItem.get('text'),
            oldEndText = listData.get(endItemIndex).get('text');

        for(let i=startItemIndex+1; i<=endItemIndex; i++){
            listData = listData.splice(i, 1);
        }
        let newText = replaceBetween(oldStartText + oldEndText, startOffset, (oldStartText.length + endOffset), replacer);
        // 替换startId处的那一行
        return listData.splice(startItemIndex, 1, startItem.set('text', newText));
    }
}

/*
 * 输入
 * @param {Store} Immutable.Map Store对象
 * @param {chars} string 输入的字符串
 */
let InputChars = (Store, chars) => {
    let {startId, endId, startOffset, endOffset} = Store.get('range');

    let newEndOffset, newStartOffset;
    newEndOffset = newStartOffset = startOffset + (chars.length);
    let contentData = Store.get('content');

    return Store
        .set('content', replaceContent(contentData, startId, endId, startOffset, endOffset, chars))
        .set('range', Drange({
            startId,
            endId,
            startOffset: newStartOffset,
            endOffset: newEndOffset
        }));
}

/*
 * 回删 backspace
 * @param {Store} Immutable.Map Store对象
 * @param {direction} string 删除的方向, back, forward
 */

/*
 * 本质是 将cursor前面或后面的字符删掉
 *      或 将range内的内容删除掉
 * TODO: 还没有考虑极限情况:
 *      collapsed时 两行合并
 *
 */
let Delete = (Store, direction) => {
    let range = Store.get('range');
    let contentData = Store.get('content');
    let {startId, endId, startOffset, endOffset} = range;

    let replaceStart, relplaceEnd;

    // range是闭合的 删除 前面 或 后面 的一个字符
    if(range.collapsed){
        if(direction === 'back'){
            replaceStart = startOffset - 1;
            relplaceEnd = startOffset;

            // backspace 在行首再一次触发时
            if(replaceStart < 0){
                let prevLine = findPrevItem(contentData, startId);
                let prevLineText = prevLine.get('text');

                replaceStart = prevLineText.length + (replaceStart + 1);
                startId = prevLine.get('id');
            }
        }
        else{
            replaceStart = endOffset;
            relplaceEnd = endOffset + 1;

            // delete 在行尾再一次触发时
            let thisLine = contentData.get(findMatchedIndex(contentData, startId));
            if(relplaceEnd > thisLine.get('text').length){
                let nextLine = findNextItem(contentData, startId);
                relplaceEnd = 0;
                endId = nextLine.get('id');
            }
        }
    }
    else{
        replaceStart = startOffset;
        relplaceEnd = endOffset;
    }
    let newContent = replaceContent(contentData, startId, endId, replaceStart, relplaceEnd, '');
    // 无论何种情况, 处理完之后 range都是闭合的
    // startId为原来的startId, offset都是replaceStart的位置
    let newDrange = Drange({
        startId,
        endId: startId,
        startOffset: replaceStart,
        endOffset: replaceStart
    });

    return Store.set('content', newContent)
            .set('range', newDrange);
}

/*
 * 在一行之后创建另一行
 *
 *
 *
 */
let createLine = (Store) => {
    // 先将内容replace为空
    Store = InputChars(Store, '');
    let {startId, endId, startOffset, endOffset} = Store.get('range');
    // 将cursor之后的内容换行
    let contentData = Store.get('content');
    let curLineIndex = findMatchedIndex(contentData, startId);
    let curLine = contentData.get(curLineIndex);
    let texts = curLine.get('text');
    let curLineText = texts.slice(0, startOffset);
    let newLineText = texts.slice(endOffset);
    curLine = curLine.set('text', curLineText);

    let newLineId = shitId.generate();
    let newLine = IMap({id: newLineId, text: newLineText});

    contentData = contentData.splice(curLineIndex, 1, curLine, newLine);
    return Store.set('content', contentData).set('range', Drange({
        startId: newLineId,
        endId: newLineId,
        startOffset: 0,
        endOffset: 0
    }));
}

module.exports = {
    findPrevItem,
    findNextItem,
    Drange,
    InputChars,
    Delete,
    createLine
};
