// dummy component, just receive props it needs and render

let React = require('react');
import CX from 'classnames';

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
        var {x, y, h} = this.props.style;
        var style = {
            transform: `translateX(${x}px) translateY(${y}px)`,
			height: `${h}px`
        };
		let classes = CX('cursor', {blink: this.state.animate});
		return <div className={classes} style={style} />;
	}
});


module.exports = Cursor;
