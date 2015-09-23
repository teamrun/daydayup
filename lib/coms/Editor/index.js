let React = require('react');

let Line = require('./Line');
let Cursor = require('./Cursor');
let Selection = require('./Selection');
let Input = require('./Input');

let Helper = require('./helper');

let DEMO_DATAS = require('./helper/_demo_data');

function echoSelectionStatus(){
    let sel = window.getSelection();
    if(sel.rangeCount > 0){
        let ran = sel.getRangeAt(0);
        if(ran.collapsed){
            console.log('range collapse');
            console.log(Date.now());
        }
        else{
            console.log('no');
        }
    }
    else{
        console.log('no range');
    }
}

var raf = window.requestAnimationFrame.bind(window);


var Editor = React.createClass({
    getInitialState: function() {
        return {
            cursorPos: {x: -20, y: 0}
        };
    },
    componentDidMount: function(){
        // 防止整个页面意外放置文件导致打开文件
        document.body.addEventListener('dragover', function(e){
            e.preventDefault();
        });
    },
    render: function(){
        var lines = DEMO_DATAS.map(function(item){
            return <Line key={item.id} text={item.text}/>
        });
        return (
            <div className="editor"
                onDragEnter={ this.dragEnterHandler }
                onDragOver={ this.dragOverHandler }
                onDrop={ this.dropHandler }
                onClick={ this.clickHandler }
                onMouseDown={ this.mouseDownHandler }
                onMouseMove={ this.mouseMoveHandler }
                onMouseUp={ this.mouseUpHandler }

            >
                <Cursor pos={ this.state.cursorPos } />
                <Selection ref="selection" />

                <Input ref="input"/>
                {lines}
            </div>
        );
    },
    clickHandler: function(e){
        raf(() => {
            this.refs.selection.sync();
            this.refs.input.startInput();
        });
    },
    updateEditPos: function(e){
        var pos = Helper.getCursorPos(this.getDOMNode());
        this.setState({
            cursorPos: pos
        });
    },
    mouseDownHandler: function(e){
        this.selectionFlag = true;
        raf(() => {
            this.updateEditPos(e)
        });
    },
    mouseMoveHandler: function(e){
        if(this.selectionFlag){
            raf(()=>{
                this.updateEditPos(e);
                this.refs.selection.sync();
            });
        }
    },
    mouseUpHandler: function(e){
        this.selectionFlag = false;
        // this.refs.input.startInput();
    },




    dragEnterHandler: function(e){

    },
    // 绑定dragover并阻止默认事件, 是不显示鼠标+和放开文件不默认打开的关键
    dragOverHandler: function(e){
        e.preventDefault();
    },
    dropHandler: function(e){
        e.preventDefault();
        console.log(this);
        var file = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(){
            // console.log(arguments);
            console.log(reader.result);
        }
        reader.readAsDataURL(file);
    }
});

export default Editor;
