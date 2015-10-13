let React = require('react');

const CUROSR_HEIGHT = 22;
const defaultPos = {
	y: -100,
	x: 0
};

let Cursor = React.createClass({
	render: function(){
        var {x, y} = this.getStyleFromProps();
        var style = {
            transform: `translateX(${x}px) translateY(${y}px)`
        }
		return <div className="cursor blink" style={style} />;
	},
	getStyleFromProps() {
		var {rangeCollapsed, rects, ctnEle} = this.props;
		if(rects.length > 0){
			if(rangeCollapsed !== true){
	            return defaultPos;
			}
			else{
				// 鼠标的位置应该在selection的最后一个rect
		        var rect = rects[rects.length - 1];
		        // 右边
		        var x = rect.right;
		        // cursor底部和rect的底部平齐
		        var y = rect.bottom - CUROSR_HEIGHT;

		        y += ctnEle.scrollTop;

				return {x, y};
			}
		}
		else{
			return defaultPos;
		}
	}
});


module.exports = Cursor;
