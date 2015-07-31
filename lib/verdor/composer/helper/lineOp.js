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

function updatePreview(){
    if(this.BrowserWindowProxy){
        var linesStr = this.state.data.map(function(d){
            return d.text;
        }).join('\n');
        console.log('gonna send:', linesStr);
        this.BrowserWindowProxy.postMessage(linesStr, '*');
    }
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
            // 保存行, 在其后插入行, 指定编辑信息
            this.saveLine(doneEditLine);
            this.insertLineAfter(editInfo.id, newLine);
            var editData = assign({}, newLine, {cursorPos: 0});
            this.editLine(editData);

            updatePreview.call(this);
        },
        // 回删的时候 如果光标已经在最开始了
        backspace (e, editInfo, sel){
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
        delete (e, editInfo, sel){
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
    },
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
        console.log(lineData);
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
        arr.splice(mergeIndex-1, 1);

        var editData = assign({}, mergeToL, {cursorPos: oldText.length});
        this.setState({
            data: arr,
            editData: editData
        });
        this.editLine(editData);
    }
};
