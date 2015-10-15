function findAllTextNodesUnder(node){
    var childNodes = node.childNodes;
    var result = [];
    for(var i=0; i<childNodes.length; i++){
        var cNode = childNodes[i];
        if(cNode.nodeType === 3){
            result.push(cNode)
        }
        else if(cNode.nodeType === 1){
            result = result.concat(findAllTextNodesUnder(cNode));
        }
        else{
            // console.log('not fit', cNode.nodeType);
        }
    }
    return result;
}

function getRangeByData(startNode, endNode, startOffset, endOffset){
    let {container: _startContainer, offset: _startOffset} = getTextNodeInNode(startNode, startOffset);
    let {container: _endContainer, offset: _endOffset} = getTextNodeInNode(endNode, endOffset);
    let range = document.createRange();
    range.setStart(_startContainer, _startOffset);
    range.setEnd(_endContainer, _endOffset);
    return range;
}

function getTextNodeInNode(node, offset){
    let textNodes = findAllTextNodesUnder(node);
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

module.exports = {findAllTextNodesUnder, getRangeByData};
