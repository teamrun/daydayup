let React = require('react');

let LineList = require('./LineList');
let Cursor = require('./Cursor');
let Selection = require('./Selection');
let Input = require('./Input');


let Store = require('../../store');
let Actions = require('../../store/actions');

let {raf, daySelection, performTime, getRangeInfo} = require('./helper');
let getCursorStyle = require('./helper/CursorHelper');
let getSelectionStyles = require('./helper/SelectionHelper');
let {getRangeByKey} = require('./helper/keyHandler');

let DEMO_DATAS = require('./helper/_demo_data');

const DEFAULT_LINEHEIGHT = 1.35;

Actions.fillInitialData({}, DEMO_DATAS);


var Editor = React.createClass({
    getInitialState: function() {
        return {
            cursorStyle: {x: 0, y:-20, h: 0},
            selectionStyles: [],
            contentData: Store.getContent()
        };
    },
    componentDidMount: function(){
        // 防止整个页面意外放置文件导致打开文件
        document.body.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        // 页面resize
        Store.addChangeListener('content-change', this.reGetContent);

        this.domNode = this.getDOMNode();
        // trigger re-render after componentDidMount
        this.forceUpdate();
    },
    componentWillUnmount() {
        Store.removeChangeListener('content-change', this.reGetContent);
    },
    render: function(){
        let {cursorStyle, selectionStyles, contentData} = this.state;
        let CursorAndSelection = this.domNode? (
            <div>
                <Cursor
                    ref="cursor"
                    style={cursorStyle}
                />
                <Selection ref="selection"
                    styles={selectionStyles}
                />
            </div>
        ) : undefined;
        return (
            <div className="editor"
                onDragEnter={ this.dragEnterHandler }
                onDragOver={ this.dragOverHandler }
                onDrop={ this.dropHandler }
                onClick={ this.clickHandler }
                onMouseDown={ this.mouseDownHandler }
                onMouseMove={ this.mouseMoveHandler }
                onMouseUp={ this.mouseUpHandler }
                onMouseLeave={ this.mouseUpHandler }

            >
                {CursorAndSelection}

                <Input ref="input"
                    changeRange={this.changeRange}
                    changeText={this.changeText}
                />
                <LineList contents={this.state.contentData} ref="line-list"/>
            </div>
        );
    },
    reGetContent() {
        this.setState({
            contentData: Store.getContent()
        });
    },
    // 更新range相关的state数据, 渲染鼠标指针和选中区域
    updateRangeState(range){
        if(range){
            this.DOMRange = range;
        }
        else{
            if(daySelection.rangeCount <= 0){
                this.setState({rects: []});
                return;
            }
            else{
                range = this.DOMRange = daySelection.getRangeAt(0);
            }
        }

        let rangeCollapsed = range.collapsed;
        let rects = range.getClientRects();

        let ctnScrollOffset = this.domNode.scrollTop;
        let cursorStyle = getCursorStyle(range, rects, ctnScrollOffset, DEFAULT_LINEHEIGHT);
        let selectionStyles = getSelectionStyles(range, rects, ctnScrollOffset, DEFAULT_LINEHEIGHT);
        // console.log(rects);
        // console.log(range.endContainer, range.endOffset);
        var timer = performTime('range update');
        this.setState({cursorStyle, selectionStyles}, ()=>{
            timer();
        });
    },
    clickHandler: function(e){
        raf(() => {
            this.sendRememberRangeAction();
            this.refs.input.startInput();
        });
    },
    mouseDownHandler: function(e){
        this.selectionFlag = true;
        raf(() => {
            this.updateRangeState();
        });
    },
    mouseMoveHandler: function(e){
        if(this.selectionFlag){
            raf(()=>{
                this.updateRangeState();
            });
        }
    },
    mouseUpHandler: function(e){
        this.selectionFlag = false;
    },


    changeRange: function({keyCode, ctrlKey, shiftKey}){
        var newRange = getRangeByKey(this.DOMRange, keyCode, shiftKey);
        this.updateRangeState(newRange);
    },
    changeText: function(e){

    },

    sendRememberRangeAction() {
        Actions.rememberRange(getRangeInfo(this.DOMRange));
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
