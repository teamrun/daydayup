// dummy component, just receive props it needs and render
var React = require('react');

var Selection = React.createClass({
    getInitialState: function() {
        return {
            rects: []
        };
    },
    render: function() {
        let selLines;
        let {styles} = this.props;
        if(styles.length ===0){
            selLines = undefined;
        }
        else{
            selLines = styles.map(function(item, index){
                return (
                    <div className="sel-line"
                        key={index}
                        style={item}
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
