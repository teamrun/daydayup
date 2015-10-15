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

module.exports = {findAllTextNodesUnder};
