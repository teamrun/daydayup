let React = require('react');

const CUROSR_HEIGHT = 24;
const defaultPos = {
	y: -100,
	x: 0
};

let Cursor = React.createClass({
	getInitialState: function() {
		return {
			pos: this.props.pos
		};
	},
	render: function(){
        var pos = this.state.pos;
        var style = {
            transform: `translateX(${pos.x}px) translateY(${pos.y}px)`
        }
		return <div className="cursor blink" style={style} />;
	},
	sync: function(ctnEle, selection, range){
		if(range){

		}
		else{
			if(selection.rangeCount <= 0){
				return false;
			}
			range = selection.getRangeAt(0)
		}
		if(range.collapsed !== true){
			this.setState({
				pos: defaultPos
			});
            return true;
		}

		var rects = range.getClientRects();
        if (rects.length === 0) {
			this.setState({
				pos: {x: 0, y:0}
			});
            return true;
        }
        // 鼠标的位置应该在selection的最后一个rect
        var rect = rects[rects.length - 1];
        // 右边
        var x = rect.right;
        // cursor底部和rect的底部平齐
        var y = rect.bottom - CUROSR_HEIGHT;

        y += ctnEle.scrollTop;

		this.setState({
			pos: {x, y}
		});
		return true;
	}
});


module.exports = Cursor;
