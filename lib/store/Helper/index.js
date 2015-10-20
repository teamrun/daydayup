let replaceBetween = (str, start, end, what) => {
    return str.substring(0, start) + what + str.substring(end);
};

let findPrevId = (_omap, id) => {
    let result;
    let keyIter = _omap.keys();
    let item = keyIter.next();
    while(item.done === false){
        let _k = item.value;
        if( _k === id){
            return result;
        }
        result = item.value;
        item = keyIter.next();
    }
    return result;
}

let findNextId = (_omap, id) => {
    let result;
    let keyIter = _omap.keys();
    let item = keyIter.next();
    while(item.done === false){
        let _k = item.value;
        if( _k === id){
            item = keyIter.next();
            break;
        }
        item = keyIter.next();
    }
    if(item.done === true){
        return undefined;
    }
    else{
        return item.value;
    }
}

let logString = (stat, str) => {
    console.info(`[${stat}] ${str.trim()? str : '空格*'+str.length}`);
}


/* customize range object, 自定义的range类型 */
function Drange(opt){
    if(!(this instanceof Drange)){
        return new Drange(opt);
    }
    this.startId = opt.startId;
    this.endId = opt.endId;
    this.startOffset = opt.startOffset;
    this.endOffset = opt.endOffset;

    Object.defineProperty(this, "collapsed", {
        get:() => {
            return (this.startId === this.endId && this.startOffset === this.endOffset);
        }
    });
    return this;
}


/*
 * @param {contentData} Immutable.Map 文本数据
 * @param {rangeInfo} Object 选中区域数据
 */

let replaceContent = (contentData, startId, endId, startOffset, endOffset, replacer) => {
    if(startId === endId){
        let oldText = contentData.get(startId);
        let newText = replaceBetween(oldText, startOffset, endOffset, replacer);
        return contentData.set(startId, newText);
    }
    else{
        let betweenStartAndEnd;
        // 移除star和end之间的item, 不够优化
        // TODO: 优化遍历
        contentData.map(function(val, key){
            if(key === startId){
                betweenStartAndEnd = true;
            }
            else if(key === endId){
                betweenStartAndEnd = false;
            }
            // 将在start和end之间的内容都删除掉
            else if(betweenStartAndEnd){
                contentData = contentData.delete(key);
            }
        });
        let oldStartText = contentData.get(startId), oldEndText = contentData.get(endId);
        let newText = replaceBetween(oldStartText + oldEndText, startOffset, (oldStartText.length + endOffset), replacer);
        return contentData.delete(endId).set('startId', newText);
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
    let content = Store.get('content');
    let {startId, endId, startOffset, endOffset} = range;

    let replaceStart, relplaceEnd;

    // range是闭合的 删除 前面 或 后面 的一个字符
    if(range.collapsed){
        if(direction === 'back'){
            replaceStart = startOffset - 1;
            relplaceEnd = startOffset;
        }
        else{
            replaceStart = endOffset;
            relplaceEnd = endOffset + 1;
        }
    }
    else{
        replaceStart = startOffset;
        relplaceEnd = endOffset;
    }
    let newContent = replaceContent(content, startId, endId, replaceStart, relplaceEnd, '');
    // 无论何种情况, 处理完之后 range都是闭合的
    // startId为原来的startId, offset都是replaceStart的位置
    let newDrange = Drange({
        startId, endId,
        startOffset: replaceStart,
        endOffset: replaceStart
    });

    return Store.set('content', newContent)
            .set('range', newDrange);
}

module.exports = {
    findPrevId,
    findNextId,
    Drange,
    InputChars,
    Delete
};
