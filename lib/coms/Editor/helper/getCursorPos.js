const CUROSR_HEIGHT = 24;

module.exports = function(ele){
    var sel = window.getSelection();
    var ran = sel.getRangeAt(0);

    var rects = ran.getClientRects();
    if (rects.length == 0) {
        return {x: 0, y:0};
    }
    // 鼠标的位置应该在selection的最后一个rect
    var rect = rects[rects.length - 1];
    // 右边
    var x = rect.right;
    // cursor底部和rect的底部平齐
    var y = rect.bottom - CUROSR_HEIGHT;

    y += ele.scrollTop;

    // var scrollPos =
    return  {x, y};
}
