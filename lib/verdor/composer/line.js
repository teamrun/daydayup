import React from 'react';
import TextProcessor from './helper/Richtext';

function getCursorPos(){
    var selection = window.getSelection();
    if(selection.rangeCount > 0){
        var range = selection.getRangeAt(0);
        return [range.startOffset, range.endOffset];
    }
    else{
        return false;
    }
}

var Line = React.createClass({
    componentDidMount() {
        this.dom = React.findDOMNode(this);
    },
    shouldComponentUpdate (nextProps, nextState) {
        // object是引用... 当前的props和nextProps的data是同一个引用...
        if(this.props.text == nextProps.text){
            // console.log('Line: wont render or update');
            return false;
        }
        return true;
    },
    componentDidUpdate(prevProps, prevState) {
    },
    render(){
        var text = this.props.text;
        var content = TextProcessor(text);
        return (
            <div className="compose-line"
                onClick={this.clickHandler}
                dangerouslySetInnerHTML={ {__html: content} }
                ></div>
        )
    },

    clickHandler (e){
        var props = this.props;
        var rangeData = getCursorPos();
        props.clickHandler(e, {
            id: props.id,
            text: props.text,
            // 粗暴的获取鼠标位置, 先不管非collapse的range
            cursorPos: rangeData? rangeData[0] : undefined
        });
    }
});

export default Line
