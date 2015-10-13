let React = require('react');
import CX from 'classnames';

const CUROSR_HEIGHT = 22;
const defaultPos = {
	y: -100,
	x: 0
};

let Cursor = React.createClass({
	getInitialState: function() {
		return {
			animate: true
		};
	},
	// 刚接收到新props时是没有blink的
	componentWillReceiveProps(nextProps) {
		clearTimeout(this.timer);
		this.setState({animate: false})
	},
	// 更新完成后 定时开启 blink
	componentDidUpdate(prevProps, prevState) {
		this.timer = setTimeout(()=>{
			this.setState({animate: true})
		}, 500);
	},
	render: function(){
        var {x, y} = this.getStyleFromProps();
        var style = {
            transform: `translateX(${x}px) translateY(${y}px)`
        }
		let classes = CX('cursor', {blink: this.state.animate});
		return <div className={classes} style={style} />;
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
