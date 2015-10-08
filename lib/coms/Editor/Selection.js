var React = require('react');

var genRects = function(rects, pianyiTop, lineWidth){
    let rectCount = rects.length;
    let ret = [].slice.call(rects).map(function(item, index, arr){
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
            top: item.top + pianyiTop,
            bottom: item.bottom,

            left: item.left,
            // right: item.right,

            width: w,
            height: item.height
        };
    });
    // console.table(ret);
    return ret;
}

function getStyle(rect){
    return {
        width: rect.width,
        // height: rect.height,
        left: rect.left,
        transform: `translateY(${rect.top}px)`
    }
}


var Selection = React.createClass({
    getInitialState: function() {
        return {
            rects: []
        };
    },

    render: function() {
        var selLines = this.state.rects.map(function(item, index){
            return (
                <div className="sel-line"
                    key={index}
                    style={getStyle(item)}
                ></div>
            );
        });
        return (
            <div className="selection-ctn">
                {selLines}
            </div>
        );
    },
    sync: function(ctnEle, selection){
        if(selection.rangeCount > 0){
            var range = selection.getRangeAt(0);
            if(range.collapsed){
                this.setState({
                    rects: []
                });
                return false;
            }
            else{
                var rects = range.getClientRects();
                let ctnScrollTop = ctnEle.scrollTop;
                this.setState({
                    rects: genRects(rects, ctnScrollTop, this.props.lineWidth)
                });
            }
        }
    }

});

module.exports = Selection;
