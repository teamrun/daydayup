let React = require('react');
let {checkIsRangeChanger} = require('./helper/keyHandler');

import Actions from '../../store/actions';

let compositionFlag = false;

// 编辑的值应该怎么同步到行数据里去?
// 在光标出插入文字, 更新光标的位置 很简单
// 那selection类型的怎么处理? 原始的selection的范围 替换为当前的文字
// composition怎么处理?

let Input = React.createClass({
    componentDidMount: function() {
        this.dom = this.getDOMNode();
    },
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    },
    render: function(){
        return (<input type="text"
            className="hidden-input"
            onKeyDown={this.onKeyDown}
            onInput={this.onInput}

            onCompositionStart={this.startCompose}
            onCompositionUpdate={this.updateCompose}
            onCompositionEnd={this.endCompose}
            />
        );
    },
    startInput: function(){
        this.dom.focus();
    },
    clearInput: function(){
        this.dom.value = '';
    },

    startCompose: function(){
        compositionFlag = true;
        console.log('composition start');
    },
    updateCompose: function(){
        console.log('composition update');
    },
    endCompose: function(){
        console.log('composition end');
    },
    onKeyDown(e) {
        let rangeChange = checkIsRangeChanger(e);
        if(rangeChange !== false){
            this.props.changeRange(rangeChange);
            this.isCharInput = false;
        }
        else{
            this.isCharInput = true;
            // this.sendActionByKey();
        }
    },
    onInput(e){
        // if(this.isCharInput === true){
            this.sendActionByKey();
        // }
    },
    sendActionByKey(key){
        let actionName;
        switch(key){
            default:
                actionName = 'inputChar'
        }
        Actions[actionName](this.dom.value);
        this.dom.value = '';
    }

});

module.exports = Input;
