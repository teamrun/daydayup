import React from 'react';
import shortid from 'shortid';
import assign from 'object-assign';

import Input from './Input';
import Line  from './Line';

import judgeType from './helper/JudgeType';
import {inputShouldBe, getIndex, updateTextOfData} from './helper/util';

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

        return {
            data: [initEmptyLine],
            inputPos: 0,
            editData: initEmptyLine
        };
    },
    componentDidMount () {
        this.dom = React.findDOMNode(this.refs.composer);
        window.dataState = this.state.data;
        window.editState = this.state.editData;
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
                    keyHandler={{
                        enter: this.keyHandlerEnter,
                        backspace: this.keyHandlerBackspace,
                        delete: this.keyHandlerDelete
                    }}
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
    },

    // *************************** 按键 行/input操作 ***************************
    // ------ 按键处理 ------
    // enter键, 回删键, 删除后面键
    /*
    * e: react的合成事件
    * editInfo: 编辑行的id, input里面的value
    * sel: 当前的鼠标选中区域
    *
    */
    keyHandlerEnter: function(e, editInfo, sel){
        e.preventDefault();
        var cursorPos = 0;
        var wholeText = editInfo.text;
        var curLineText = wholeText.slice(0, sel[0]);
        var nextLineText = wholeText.slice(sel[1]);
        var doneEditLine = {
            id: editInfo.id,
            text: curLineText
        };
        var newLine = {
            id: shortid.generate(),
            text: nextLineText
        };
        if(this.lineTypes[doneEditLine.id] === 'code'){
            newLine.text = ' '.repeat(4) + newLine.text;
            cursorPos = 4;
        }
        // 保存行, 在其后插入行, 指定编辑信息
        this.saveLine(doneEditLine);
        this.insertLineAfter(editInfo.id, newLine);
        var editData = assign({}, newLine, {cursorPos});

        this.editLine(editData);

        this.updatePreview();
    },
    // 回删的时候 如果光标已经在最开始了
    keyHandlerBackspace (e, editInfo, sel){
        if(sel[0] === sel[1] && sel[0] === 0){
            var arr = this.state.data;
            var curLineId = editInfo.id;
            var mergeToIndex = getIndex(curLineId, arr) - 1;
            if(mergeToIndex >= 0){
                this.mergeTo(arr[mergeToIndex], editInfo);
            }
            // 避免到上一行之后把最后一个字符删掉
            e.preventDefault();
        }
    },
    keyHandlerDelete (e, editInfo, sel){
        if(sel[0] === sel[1] && sel[0] === editInfo.text.length){
            var arr = this.state.data;
            var curLineId = editInfo.id;
            var mergeLineIndex = getIndex(curLineId, arr) + 1;
            var mergeToLine = editInfo, mergeLine = arr[mergeLineIndex];
            this.mergeTo(mergeToLine, mergeLine);
            // 避免到上一行之后把最后一个字符删掉
            e.preventDefault();
        }
    },
    // ------ 行处理 ------
    /*
     * 在某一行后插入一行
     */
    insertLineAfter (afterId, lineInfo){
        var state = this.state;
        var insertIndex = getIndex(afterId, state.data) + 1;
        this.state.data.splice(insertIndex, 0, lineInfo);
        this.setState({
            data: this.state.data
        });
    },
    // 只做单纯的一行数据保存的操作
    saveLine: function(lineInfo){
        updateTextOfData(lineInfo.text, lineInfo.id, this.state.data);
        this.setState({
            data: this.state.data
        });
    },
    // 编辑一行: 将行数据传给input, 计算input的位置
    editLine: function(lineData){
        console.log(lineData.text);
        this.setState({
            editData: lineData
        });
        this.updateInputPos(lineData.id);
    },
    // 将当前行和前一行合并起来
    mergeTo: function(mergeToL, mergeL){
        // 鼠标会定位在mergeTo的末尾
        var arr = this.state.data;
        var mergeText = mergeL.text;
        var mergeIndex = getIndex(mergeL.id, arr);

        var oldText = mergeToL.text;
        mergeToL.text = mergeToL.text + mergeText;
        // mergeL被合并之后, 就把它删掉
        arr.splice(mergeIndex, 1);

        var editData = assign({}, mergeToL, {cursorPos: oldText.length});
        this.setState({
            data: arr,
            editData: editData
        });
        this.editLine(editData);
    },

    updatePreview(){
        if(this.BrowserWindowProxy){
            var linesStr = this.state.data.map(function(d){
                return d.text;
            }).join('\n');
            console.log('gonna send:', linesStr);
            this.BrowserWindowProxy.postMessage(linesStr, '*');
        }
    }
});

export default Composer
