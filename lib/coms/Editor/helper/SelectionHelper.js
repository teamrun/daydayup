var processRects = function(rects, lineWidth){
    rects = [].slice.call(rects);
    let rectCount = rects.length;
    let ret = rects.map(function(item, index, arr){
        let w = item.width;
        // 缺陷: 原生的selection是占满整整一行的
        //      计算出来的selection 是紧紧&仅仅贴合文字的
        // 解决: 如果不是最后一行, 直接用lineWidth作为selection宽度
        if(index < rectCount-1){
            if(index === 0){
                let lineLeft = arr[index + 1].left;
                w = lineWidth - (item.left - lineLeft);
            }
            else{
                w = lineWidth;
            }
        }
        return {
            top: item.top,
            // bottom: item.bottom,

            left: item.left,
            // right: item.right,

            width: w,
            height: item.height
        };
    });
    return ret;
}

function getStyle(rect, ctnEleScrollTop, lineHeight){
    let h = Math.round(rect.height * lineHeight);
    let top = rect.top - Math.round((h - rect.height)/2);
    return {
        width: rect.width,
        height: h,
        left: rect.left,
        transform: `translateY(${top + ctnEleScrollTop}px)`
    }
}

function getSlectionStyles(rect, ctnEleScrollTop, lineWidth, lineHeight){
    return processRects(rect, lineWidth).map(function(item){
        return getStyle(item, ctnEleScrollTop, lineHeight);
    });
}

module.exports = getSlectionStyles;
