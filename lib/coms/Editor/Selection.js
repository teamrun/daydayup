var React = require('react');

var genRects = function(rects){
    var ret = [].slice.call(rects).map(function(item){
        return {
            top: item.top,
            bottom: item.bottom,

            left: item.left,
            // right: item.right,

            width: item.width,
            height: item.height
        };
    });
    // console.table(ret);
    return ret;
}

// 缺陷: 原生的selection是占满整整一行的
//      计算出来的selection 是紧紧&仅仅贴合文字的
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
    // sync: function(){
        // var selection = window.getSelection();
        // if(selection.rangeCount > 0){
        //     var range = selection.getRangeAt(0);
        //     if(range.collapsed){
        //         return false;
        //     }
        //     else{
        //         var rects = range.getClientRects();
        //         console.log(rects);
        //     }
        // }
    // },
    sync: function(){
        var selection = window.getSelection();
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
                this.setState({
                    rects: genRects(rects)
                });
            }
        }
    }

});

module.exports = Selection;
