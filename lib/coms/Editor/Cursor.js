let React = require('react');

let Cursor = React.createClass({
	render: function(){
        var pos = this.props.pos;
        var style = {
            transform: `translateX(${pos.x}px) translateY(${pos.y}px)`
        }
		return <div className="cursor blink" style={style} />;
	}
});


module.exports = Cursor;