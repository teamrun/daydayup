var React = require('react');

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
            // height: item.height
        };
    });
    return ret;
}

function getStyle(rect, ctnEleScrollTop){
    return {
        width: rect.width,
        // height: rect.height,
        left: rect.left,
        transform: `translateY(${rect.top + ctnEleScrollTop}px)`
    }
}


var Selection = React.createClass({
    getInitialState: function() {
        return {
            rects: []
        };
    },

    render: function() {
        let selLines;
        let {rangeCollapsed, rects, ctnEle, lineWidth} = this.props;
        if(rangeCollapsed === true || rects.length ===0){
            selLines = undefined;
        }
        else{
            let ctnEleTop = ctnEle.scrollTop;
            selLines = processRects(rects, lineWidth).map(function(item, index){
                let style = getStyle(item, ctnEleTop);
                return (
                    <div className="sel-line"
                        key={index}
                        style={style}
                    ></div>
                );
            });
        }
        return (
            <div className="selection-ctn">
                {selLines}
            </div>
        );
    }
});

module.exports = Selection;
