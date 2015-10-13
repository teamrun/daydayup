const arrowCodes = [
    38, // arrow up
    40, // arrow down

    37, // arrow left
    39  // arrow right
]

const withCtrlCodes = [
    80, // p   ctrl+p previous line
    78, // n   ctrl+n next line

    70, // f   ctrl+f forward char
    66  // b   ctrl+b backward char
]

function checkIsRangeChanger(keyEvent){
    let keyCode = keyEvent.keyCode;
    console.log('input key', keyCode);
    if(arrowCodes.indexOf(keyCode) >= 0){
        return {keyCode};
    }
    else if(withCtrlCodes.indexOf(keyCode) >= 0 && keyEvent.ctrlKey === true){
        return {keyCode, shiftKey: keyEvent.shiftKey};
    }
    else{
        return false;
    }
}

let getRangeByKey = (range, key, shiftKey) => {
    let ran = document.createRange();
    let startNode, starOffset, endNode, endOffset;
    switch (key) {
        case 37:
            startNode = endNode = range.startContainer;
            starOffset = endOffset = range.startOffset - 1;
            break;
        case 39:
            startNode = endNode = range.endContainer;
            starOffset = endOffset = range.endOffset + 1;
            break;
        default:
    }

    ran.setStart(startNode, starOffset);
    ran.setEnd(endNode, endOffset);
    return ran;
}

let rangeTransforms = [
    // 来到selection的最前 或 最后
    'go-to-start',
    'go-to-end',
    // 向 最前/最后 挪一个char 或上下 一行
    'move-start',
    'move-end',
    'move-top',
    'move-bottom',
    // ------------ with shift key ------------------------
    // 扩张当前的selection 向 前/后 增加一个char, 向 上下 增加一行
    'extend-start',
    'extend-end',
    'extend-top',
    'extend-bottom',
    // 缩水 同上
    'shrink-start',
    'shrink-end',
    'shrink-top',
    'shrink-bottom'
];

module.exports = {checkIsRangeChanger, getRangeByKey};
