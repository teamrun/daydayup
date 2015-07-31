import React from 'react';
import assign from 'object-assign';
import CX from 'classnames';

import TextProcessor from './helper/Richtext';
import judgeType from './helper/JudgeType';

function noBubble(e){
    e.stopPropagation();
}

function hasKeyHander(e){
    var code = e.keyCode;
    return (code === 13 || code === 8 || code === 46 || (code ===68 && e.ctrlKey === true ));
}

var keyCodeMap = {
    13: 'enter',
    8: 'backspace',
    46: 'delete',
    68: 'delete'
};

/* 数据结构
* props:
*       editInfo: id 行id
*                 text 文本内容
*                 cursorPos 鼠标定位
 */
var Input = React.createClass({
    getInitialState () {
        return {
            inputH: 0,
            value: ''
        };
    },
    componentDidMount(){
        this.input = React.findDOMNode(this.refs.input);
        this.ghost = React.findDOMNode(this.refs.ghost);
    },
    componentWillReceiveProps(nextProps) {
        var newValue;
        if(nextProps.editInfo){
            newValue = nextProps.editInfo.text || '';
        }
        else{
            newValue = '';
        }
        var cursorPos = (nextProps.editInfo.cursorPos === undefined)?  newValue.length : nextProps.editInfo.cursorPos;
        // 内容变更
        this.setState({
            value: newValue
        }, () => {
            this.reCaculHeight();
            this.input.focus();
            this.setSelection(cursorPos);
        });
    },
    render () {
        var InputStyle = {
            height: this.state.inputH
        };
        var propStyle = this.props.style;
        var ctnStyle = assign(propStyle, propStyle);
        var inputClasses = CX('composer-input', this.props.editType);

        var ghostContent = TextProcessor(this.state.value);
        var ghostClasses = CX('ghost-input', this.props.editType);
        return (
            <div className="composer-input-ctn"
                style={ctnStyle}
                onClick={noBubble}
            >
                <textarea className={ inputClasses }
                    style={InputStyle}
                    value={this.state.value}
                    ref="input"
                    onChange={this.onChange}
                    onKeyDown={this.keyDownHandler}
                    onBlur={this.blurHandler}
                    >
                </textarea>
                <div className={ ghostClasses }
                    ref="ghost"
                    dangerouslySetInnerHTML={ {__html: ghostContent} }
                    >
                </div>
            </div>
        );
    },

    onChange (e){
        // 内容变更
        var value = e.target.value;
        var curType = judgeType(this.props.editType, value);
        if(curType != this.props.editType){
            this.props.updateSelfLine({
                text: value,
                id: this.props.editInfo.id
            }, this.getSelection()[0]);
            return false;
        }
        this.setState({
            value: value
        }, this.reCaculHeight);
    },
    blurHandler (){
        if(this.state.value === this.props.editInfo.text){
            return;
        }
        var props = this.props;
        props.saveLine({
            id: props.editInfo.id,
            text: this.state.value
        });
    },
    keyDownHandler (e){
        // 是否是需要处理的按键
        if( hasKeyHander(e) ){
            var keyCode = e.keyCode;
            var props = this.props;

            var text = this.input.value;
            var sel = this.getSelection();
            props.keyHandler[keyCodeMap[keyCode]](e, {
                id: props.editInfo.id,
                text: text
            }, sel);
            return;
        }

    },
    // 文字内容变更之后, 重新计算高度
    reCaculHeight (){
        var ghostInputHeight = window.getComputedStyle(this.ghost).height;
        if(ghostInputHeight !== this.state.inputH){
            this.setState({
                inputH: ghostInputHeight
            });
        }
    },
    setSelection (start, end){
        end = end || start;
        this.input.setSelectionRange(start, end);
    },
    getSelection (){
        return [this.input.selectionStart, this.input.selectionEnd]
    }
});

export default Input
