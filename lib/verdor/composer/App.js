import React from 'react';
import shortid from 'shortid';
import assign from 'object-assign';

import Input from './Input';
import Line  from './Line';

import LineOperation from './helper/LineOp';
import judgeType from './helper/JudgeType';


// 需要在line渲染之后 计算所有line的高度
// 然后去定位input的位置
function inputShouldBe(lineComs, datas, targetId){
    // 如果有目标要编辑的targetId, 就把合计的lines截取一下
    if(datas && targetId){
        var targetIndex = datas.length;
        var hasTarget = datas.some(function(d, i){
            targetIndex = i;
            return d.id == targetId;
        });

        lineComs = lineComs.slice(0, targetIndex);
    }

    var totalHeight = 0;
    totalHeight = lineComs.reduce(function(prev, item){
        var dom = React.findDOMNode(item);
        var style = window.getComputedStyle(dom);
        var height = Number(style.height.slice(0, style.height.length-2));
        return prev + height;
    }, 0);
    console.log('lines total height: ', totalHeight);
    return totalHeight;
}

function bindHelper(obj, bindTo, ctx){
    for(var i in obj){
        if(obj[i] instanceof Function){
            bindTo[i] = obj[i].bind(ctx);
        }
        else if(typeof obj[i] == 'object'){
            bindTo[i] = {};
            bindHelper(obj[i], bindTo[i], ctx);
        }
    }
}

// line的tag类型是实时计算的, 不放在state中
// 存储为一个对象, 方便通过id获取
// Input传props时, 传:
//      editData: id, text, cursorPos
//      editType: 当前id对应的type
// Input在键入过程中, type发生变化 及时更新

var Composer  = React.createClass({
    getInitialState (){
        // 初始化时新建一个空行
        var initEmptyLine = {
            id: shortid.generate(),
            text: ''
        };

        // 将行操作函数们绑定到组件
        bindHelper(LineOperation, this, this);

        return {
            data: [initEmptyLine],
            inputPos: 0,
            editData: initEmptyLine
        };
    },
    componentDidMount () {
        this.dom = React.findDOMNode(this.refs.composer);
    },
    componentDidUpdate (prevProps, prevState) {
        // console.log('Index updated');
    },
    render (){
        this.lineTypes = {};
        var lastType = 'empty';
        var lines = this.state.data.map((l, index)=> {
            var thisType = judgeType(lastType, l.text);
            this.lineTypes[l.id] = thisType;
            lastType = thisType;
            return (
                <Line ref={l.id} key={l.id}
                    text={l.text}
                    id={l.id}
                    type={thisType}
                    clickHandler={this.lineClickHandler}
                />
            );
        });
        var inputStyle = {
            transform: 'translateY('+this.state.inputPos+'px)'
        };
        return (
            <div className="composer" ref="composer"
                onClick={this.emptyAreaHandler}
                >
                <a className="btn btn-primary" id="see-preview"
                    onClick={this.openPreview}
                >预览</a>

                {lines}
                <Input
                    keyHandler={this.keyHandler}
                    saveLine={this.saveLine}
                    updateSelfLine={this.updateSelfLine}

                    editInfo={this.state.editData}
                    editType={this.lineTypes[this.state.editData.id]}
                    style={inputStyle}
                />
            </div>
        )
    },
    // 点击整个编辑器的空白处的时候, 定位到最后一行
    emptyAreaHandler (e){
        if(e.target == this.dom){
            var lastLine = this.state.data[this.state.data.length - 1];
            this.editLine(lastLine);
        }
    },
    lineClickHandler (e, lineData){
        this.editLine(lineData);
        e.stopPropagation();
        // console.time('click line and edit');
    },
    // 根据lineId 更新input的位置
    updateInputPos (lineId){
        var lineComs = this.state.data.map((l) => {
            return this.refs[l.id];
        });
        this.setState({
            inputPos: inputShouldBe(lineComs, this.state.data, lineId)
        });
    },
    updateSelfLine: function(lineData, cursorPos){
        this.saveLine(lineData);
        var editData = assign({}, lineData, {
            cursorPos: cursorPos
        });
        this.setState({
            editData: editData
        });
    },

    openPreview (e){
        this.BrowserWindowProxy = window.open('http://localhost:3000/dist/md-preview.html');
        // window.open('http://baidu.com');
        e.stopPropagation();
    }
});

export default Composer
