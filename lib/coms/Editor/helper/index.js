let daySelection = window.getSelection();

let performTime = (str) => {
    let start;
    if(Math.random() < 0.1){
        start = window.performance.now();
    }
    return () => {
        if(start){
            let now = window.performance.now();
            console.info( `[${str}] ${(now - start).toFixed(3)}ms`);
        }
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

let getLineId = (containerNode, endLimit) => {
    let parentNode;
    if(containerNode.nodeType === 1){
        parentNode = containerNode;
    }
    else{
        parentNode = containerNode.parentNode;
    }

    while(parentNode){
        if(parentNode.classList.contains('line')){
            return parentNode.dataset.lid;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}

let raf = window.requestAnimationFrame.bind(window);

module.exports = {
    raf,
    daySelection,
    performTime,
    getRangeInfo
};
