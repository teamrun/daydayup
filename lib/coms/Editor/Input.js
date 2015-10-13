let React = require('react');
let {checkIsRangeChanger} = require('./helper/keyHandler');

let compositionFlag = false;

// 编辑的值应该怎么同步到行数据里去?
// 在光标出插入文字, 更新光标的位置 很简单
// 那selection类型的怎么处理? 原始的selection的范围 替换为当前的文字
// composition怎么处理?

let Input = React.createClass({
    componentDidMount: function() {
        this.dom = this.getDOMNode();
    },
    render: function(){
        return (<input type="text"
            className="hidden-input"
            onKeyDown={this.onKeyDown}

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
        }
        else{
            console.log('start input');
        }
    }

});

module.exports = Input;
