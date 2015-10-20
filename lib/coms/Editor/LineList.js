import React, { PropTypes } from 'react'

import Line from './Line';

let LineList = React.createClass({
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.contentData !== nextProps.contentData;
    },
    render(){
        let lines = this.props.contentData.map(function(item){
            let id = item.get('id'), text = item.get('text');
            return <Line key={id} ref={id} id={id} text={text} />;
        });
        return (
            <div className="lines-ctn">{lines.toArray()}</div>
        );
    },
    getLineDOM(id) {
        return this.refs[id].getDOMNode();
    }
});

export default LineList
