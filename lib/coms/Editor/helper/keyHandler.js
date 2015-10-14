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

// 带有ctrl键实现的move, 映射到箭头键
const ctrlMoveMap = {
    80: 38,
    78: 40,
    70: 37,
    66: 39,
};

// 枚举出所有的操作range的命令
const rangeTransforms = [
    // 来到selection的最前 或 最后
    'go-to-start',
    'go-to-end',
    // 向 最前/最后 挪一个char 或上下 一行
    'move-start',
    'move-end',
    'move-top',
    'move-bottom',
    // ------------ with shift key ------------------------
    // 扩张 当前的selection 向 前/后 增加一个char, 向 上下 增加一行
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

let checkIsRangeChanger = (keyEvent) => {
    let keyCode = keyEvent.keyCode;
    console.log('input key', keyCode);
    if(arrowCodes.indexOf(keyCode) >= 0){
        return {keyCode};
    }
    else if(withCtrlCodes.indexOf(keyCode) >= 0 && keyEvent.ctrlKey === true){
        return {keyCode, ctrlKey: true, shiftKey: true};
    }
    else{
        return false;
    }
}

let getRangeByKey = (oldRange, key, ctrlKey, shiftKey) => {
    let ran = document.createRange();
    // 将带有ctrl的移动键 转化为普通的箭头键
    if(ctrlKey){
        key = ctrlMoveMap[key];
    }

    let cmd = getCMDByKey(oldRange, key, shiftKey);
    let {startNode, starOffset, endNode, endOffset} = getRangeByCMD(oldRange, cmd);

    ran.setStart(startNode, starOffset);
    ran.setEnd(endNode, endOffset);
    return ran;
}

// 通过key, 得出将要执行的range命令
let getCMDByKey = (oldRange, keyCode, shiftKey) => {
    let collapsed = oldRange.collapsed;
    let rangeCmd;
    switch (keyCode) {
        case 37:
            rangeCmd = ((collapsed === true)? 'move-' : 'go-to-') + 'start';
            break;
        case 39:
            rangeCmd = ((collapsed === true)? 'move-' : 'go-to-') + 'end';
            break;
        case 38:
            rangeCmd = 'move-top';
            break;
        case 40:
            rangeCmd = 'move-bottom';
            break;
        default:
    }
    return rangeCmd;
}

// 通过命令, 计算出新的range所需的参数
let getRangeByCMD = (oldRange, cmd) => {
    let startNode, starOffset, endNode, endOffset;
    switch(cmd) {
        case 'go-to-start':
            startNode = endNode = oldRange.startContainer;
            starOffset = endOffset = oldRange.startOffset;
            break;
        case 'go-to-end':
            startNode = endNode = oldRange.endContainer;
            starOffset = endOffset = oldRange.endOffset;
            break;
        case 'move-start':
            startNode = endNode = oldRange.startContainer;
            starOffset = endOffset = oldRange.startOffset - 1;
            break;
        case 'move-end':
            startNode = endNode = oldRange.endContainer;
            starOffset = endOffset = oldRange.endOffset + 1;
            break;
        // case 'go-to-start':
        //     startNode = endNode = oldRange.startContainer;
        //     starOffset = endOffset = oldRange.startOffset;
        //     break;
    }
    
    return {startNode, starOffset, endNode, endOffset};
}



module.exports = {checkIsRangeChanger, getRangeByKey};
