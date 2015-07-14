import shortid from 'shortid';
import assign from 'object-assign';


// 对象数组, 根据id获取匹配到的对象的索引号
function getIndex(id, arr){
    var index;
    var hasItem = arr.some(function(item, i){
        index = i;
        return item.id == id;
    });
    return index;
}
function updateTextOfData(text, id, arr){
    var line = arr[getIndex(id, arr)];
    line.text = text;
}

export default {
    // 按键处理
    keyHandler: {
        // enter键, 回删键, 删除后面键
        /*
        * e: react的合成事件
        * editInfo: 编辑行的id, input里面的value
        * sel: 当前的鼠标选中区域
        *
        */
        enter (e, editInfo, sel){
            e.preventDefault();
            var wholeText = editInfo.text;
            var curLineText = wholeText.slice(0, sel[0]);
            var nextLineText = wholeText.slice(sel[1]);
            // console.log(curLineText);
            // console.log(nextLineText);
            var doneEditLine = {
                id: editInfo.id,
                text: curLineText
            };
            var newLine = {
                id: shortid.generate(),
                text: nextLineText
            };
            this.saveLine(doneEditLine);
            this.insertLineAfter(editInfo.id, newLine);
            var editData = assign({}, newLine, {cursorPos: 0});
            this.editLine(editData);
        },
        backspace (e, editInfo, selectionInfo){

        },
        delete (e, editInfo, selectionInfo){

        },
    },
    insertLineAfter (afterId, lineInfo){
        var state = this.state;
        var insertIndex = getIndex(afterId, state.data) + 1;
        this.state.data.splice(insertIndex, 0, lineInfo);
        this.setState({
            data: this.state.data
        });
    },
    // 新增 和 编辑保存, 都调用同样的
    // 因为id一直存在
    saveLine: function(lineInfo){
        updateTextOfData(lineInfo.text, lineInfo.id, this.state.data);
        // 附加一个新行,
        // 在当前位置之下
        // var emptyNewLine = { id: shortid.generate(), text: ''};
        // this.state.data.push(emptyNewLine);
        // console.log(this.state.data);
        this.setState({
            data: this.state.data
        });
        // }, () => this.updateInputPos(emptyNewLine.id) );
    },
    // 编辑一行: 将行数据传给input, 计算input的位置
    editLine: function(lineData){
        var lineComs = this.state.data.map((l) => {
            return this.refs[l.id];
        });
        this.setState({
            editData: lineData
        });
        this.updateInputPos(lineData.id);
    },
    // 将当前行和前一行合并起来
    mergeToPrev: function(curId, curText){
        // 鼠标会定位在mergeTo的末尾
        var arr = this.state.data;
        var curLineIndex = getIndex(curId, arr);
        if(curLineIndex <= 0){
            return;
        }
        var prevIndex = curLineIndex-1;
        var lineM = arr[prevIndex];
        var oldText = lineM.text;
        lineM.text = lineM.text + curText;
        arr.splice(curLineIndex, curLineIndex+1);

        this.setState({
            data: arr,
            editData: assign({}, lineM, {cursorPos: oldText.length})
        }, ()=>{
            this.updateInputPos(lineM.id);
        });
    }
};
