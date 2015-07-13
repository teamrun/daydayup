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
    // 新增 和 编辑保存, 都调用同样的
    // 因为id一直存在
    saveLine: function(lineInfo){
        updateTextOfData(lineInfo.text, lineInfo.id, this.state.data);
        // 附加一个新行,
        // 在当前位置之下
        var emptyNewLine = { id: shortid.generate(), text: ''};
        this.state.data.push(emptyNewLine);
        // console.log(this.state.data);
        this.setState({
            data: this.state.data,
            editData: emptyNewLine
        }, () => this.updateInputPos(emptyNewLine.id) );
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
