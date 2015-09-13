module.exports = function(ele){
    var sel = window.getSelection();
    var ran = sel.getRangeAt(0);

    var rects = ran.getClientRects();
    if (rects.length > 0) {
        var rect = rects[0];
    }
    var x = rect.left;
    var y = rect.top;

    y += ele.scrollTop;

    // var scrollPos = 
    return  {x, y};
}