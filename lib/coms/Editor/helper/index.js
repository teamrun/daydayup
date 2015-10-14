let daySelection = window.getSelection();

let performTime = (str) => {
    let start = window.performance.now();
    return () => {
        let now = window.performance.now();
        console.log( `[${str}] ${((now-start)/1000).toFixed(3)}ms`);
    }
}


let getRangeInfo = (range) => {
    // let timer = performTime('get range info');
    let {startContainer, endContainer, startOffset, endOffset} = range;
    let startId, endId;
    startId = getLineId(startContainer);
    if(startContainer === endContainer){
        endId = startId;
    }
    else{
        endId = getLineId(endContainer);
    }
    // timer();
    return {startOffset, endOffset, startId, endId};
}

let getLineId = (childNode, endLimit) => {
    let parentNode = childNode.parentNode;
    while(parentNode){
        if(parentNode.classList.contains('line')){
            return parentNode.dataset.lid;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}


module.exports = {
    daySelection,
    performTime,
    getRangeInfo
};
