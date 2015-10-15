/*
    跨越两个段落的的selection生成的rect好奇怪...
    此时生成的selection 包含的rects, 会比真正的多出一个来,
    多出来的这一个 会将下面的那个段落全部包裹住
    这个多余的rect的特征是: 将下面的那个段落全部包裹, 导致它的bottom不在它之前的和之后的两个rect的bottom之间
    用这个特征来将它踢出吧

    还有 当selection刚刚触及到下一个段落时, 这时是没办法用prevOne & nextOne判定的
    用别的办法: 此时的range的endContainer不是textNode, endOffset为0, 以此为判断
    双管齐下, 比原生的选中高亮还要准确!!!!
*/




function removeWholeParagraphRects(rects, rangeEndOffset){
    let needRemove = [], lastBottom;
    for(var i=0; i<rects.length; i++){
        let item = rects[i];
        if(i === 0){
            lastBottom = item.bottom;
            continue;
        }
        if(i === rects.length - 1){
            if(rangeEndOffset === 0){
                needRemove.push(i);
            }
            continue;
        }
        let notBottomBetween = !( (item.bottom > lastBottom) && ( item.bottom <= rects[i+1].bottom));
        if(notBottomBetween){
            needRemove.push(i)
        }
        else{
            lastBottom = item.bottom;
        }
    }

    console.log(needRemove);
    if(needRemove.length > 0){
        for(var j=needRemove.length - 1; j>=0; j--){
            rects.splice(needRemove[j], 1);
        }
    }
    return rects;
}

var processRects = function(rects, rangeEndOffset){
    rects = [].slice.call(rects);
    let rectCount = rects.length;
    let ret = removeWholeParagraphRects(rects, rangeEndOffset).map(function(item, index, arr){
        let w = item.width;
        // 缺陷: 原生的selection是占满整整一行的
        //      计算出来的selection 是紧紧&仅仅贴合文字的
        // 解决: 如果不是将所有的空格都换成&nsp;就不会有这个问题
        //      先在是每两个空格 replace成一个空格一个&nbsp;
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

function getSlectionStyles(rect, ctnEleScrollTop, lineHeight, rangeEndContainer, rangeEndOffset){
    return processRects(rect, rangeEndOffset).map(function(item){
        return getStyle(item, ctnEleScrollTop, lineHeight);
    });
}

module.exports = getSlectionStyles;
