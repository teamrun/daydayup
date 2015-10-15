import React, { PropTypes } from 'react'

import Line from './Line';

let LineList = React.createClass({
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.contentData !== nextProps.contentData;
    },
    render(){
        let lines = this.props.contents.map(function(val, key){
            return <Line key={key} id={key} text={val} />;
        });
        return (
            <div className="lines-ctn">{lines.toArray()}</div>
        );
    }
});

export default LineList
