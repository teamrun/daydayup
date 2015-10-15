let getCursorPos = (range, rects, ctnOffset, lineHeight) => {
    // range不collapsed的时候 先不显示cursor
    if(!range.collapsed){
        return {x: 0, y: -20, h: 0};
    }

    // 鼠标的位置应该在selection的最后一个rect
    var rect = rects[rects.length - 1];
    // 右边
    var x = rect.right;

    var h = Math.round(rect.height * lineHeight);
    var y = rect.top - Math.round((h - rect.height)/2);

    y += ctnOffset;

    return {x, y, h};
}

module.exports = getCursorPos;
