function getparentLineNode(childNode){
    let pNode = childNode.parentNode;
    while(pNode !== document.body){
        if(pNode.classList.contains('line')){
            return pNode;
        }
        pNode = pNode.parentNode;
    }
    return false;
}


function getAllTextNodes(node){
    var childNodes = node.childNodes;
    var result = [];
    for(var i=0; i < childNodes.length; i++){
        var cNode = childNodes[i];
        if(cNode.nodeType === 3){
            result.push(cNode)
        }
        else if(cNode.nodeType === 1){
            result = result.concat(getAllTextNodes(cNode));
        }
        else{
            // console.log('not fit', cNode.nodeType);
        }
    }
    return result;
}

function getAllTexts(node){
    return getAllTextNodes(node).map((n) => n.textContent).join('');
}

let getNodeByOffset = (textNodes, offset) => {
    let index = 0;
    let checkedLength = 0, thisTextNode = textNodes[index];
    while(thisTextNode){
        let textLengthOfThisNode = thisTextNode.textContent.length;
        if(offset >= checkedLength && offset <= (checkedLength + textLengthOfThisNode) ){
            return {
                container: thisTextNode,
                offset: offset - checkedLength
            };
        }
        else{
            index++;
            thisTextNode = textNodes[index];
        }
    }
    return false;
}

let getRangeByData = (startNode, endNode, startOffset, endOffset) => {
    let startTextNodes = getAllTextNodes(startNode);
    let {container: _startContainer, offset: _startOffset} = getNodeByOffset(startTextNodes, startOffset);
    let _endContainer, _endOffset;
    if(startNode === endNode && startOffset === endOffset){
        _endContainer = _startContainer;
        _endOffset = _startOffset;
    }
    else{
        let endTextNodes = getAllTextNodes(endNode);
        let {container: _endContainer, offset: _endOffset} = getNodeByOffset(endTextNodes, endOffset);
    }

    let range = document.createRange();
    range.setStart(_startContainer, _startOffset);
    range.setEnd(_endContainer, _endOffset);
    return range;
}

// 所有日文韩文中文的unicode范围
const ASIA_CHAR_REG = /[\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]/;
// 找到当前行的行首的range
let getRangeAtLineStart = (lineNode, range) => {
    let prevRange = range, {startOffset} = range;

    let prevRects = prevRange.getClientRects();
    let prevFirstRect = prevRects[0];
    /*
     * 中文的换行, 不像英文需要一个空格来掐断, 每个字都是可以换行的
     * 遇到换行时, 鼠标点击生成的range, 是有两个rect的!!!!!!!! 但range.collapsed又是true!!!
     * 如果满足这些症状, 就可以直接返回了
    */
    if(range.collapsed && prevRects.length > 1){
        return range;
    }

    let _ran;
    if(startOffset === 0){
        if(range.collapsed){
            return range;
        }
        else{
            return getRangeByData(lineNode, lineNode, 0, 0);
        }
    }
    startOffset--;
    let allTexts = getAllTexts(lineNode);

    while(startOffset >= 0){
        _ran = getRangeByData(lineNode, lineNode, startOffset, startOffset);
        let rects = _ran.getClientRects();
        let rect = rects[0];
        console.log(rect.left);
        if(rect.left > prevFirstRect.left){
            if(ASIA_CHAR_REG.test(allTexts.charAt(_ran.startOffset - 1))){
                return _ran;
            }
            return prevRange;
        }
        prevRange = _ran;
        prevFirstRect = rect;
        startOffset--;
    }
    return _ran;
}

/*
 * 获取行尾的位置, 把range定在这里
 *
 * 上面提到的中文的问题.  会导致 鼠标定位会定在下一行
 * 然后 下次ctrl-e到行尾 又到了下下行...
 *
 */
let getRangeAtLineEnd = (lineNode, range) => {
    let { endOffset } = range;
    let prevRange = range;
    let prevRects = prevRange.getClientRects();
    let prevLastRect = prevRects[prevRects.length - 1];

    let _ran;

    let allTextNodes = getAllTextNodes(lineNode);
    let textLen = getAllTexts(lineNode).length;

    if(endOffset === textLen){
        if(range.collapsed){
            return range;
        }
        else{
            return getRangeByData(lineNode, lineNode, endOffset, endOffset);
        }
    }
    endOffset++;
    while(endOffset <= textLen){
        _ran = getRangeByData(lineNode, lineNode, endOffset, endOffset);
        let rects = _ran.getClientRects();
        let rect = rects[0];

        if(rect.right < prevLastRect.right){
            return prevRange;
        }
        prevRange = _ran;
        prevLastRect = rect;
        endOffset++;
    }
    return _ran;
}

module.exports = {
    getparentLineNode,
    getAllTextNodes,
    getRangeByData,
    getRangeAtLineStart,
    getRangeAtLineEnd
};
