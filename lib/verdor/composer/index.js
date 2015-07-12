import Input from './input';
import Line  from './line';

import shortid from 'shortid';

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

function updateTextOfData(text, id, arr){
    var line;
    var hasItem = arr.some(function(item){
        line = item;
        return item.id == id;
    });
    line.text = text;
    return hasItem;
}

class Composer extends React.Component {
    constructor(props) {
        super(props);
        // 初始化时新建一个空行
        var initEmptyLine = {
            id: shortid.generate(),
            text: ''
        };
        this.state = {
            data: [initEmptyLine],
            inputPos: 0,
            editData: initEmptyLine
        };
    }
    componentDidMount() {
        this.dom = React.findDOMNode(this.refs['composer']);
    }
    componentDidUpdate (prevProps, prevState) {
        // console.log('Index updated');
    }
    render () {
        var lines = this.state.data.map((l, index)=> {
            return <Line ref={l.id} key={l.id}
                text={l.text} id={l.id}
                clickHandler={this.lineClickHandler}
            />;
        });
        var inputStyle = {
            transform: 'translateY('+this.state.inputPos+'px)'
        };
        return (
            <div className="composer" ref="composer"
                onClick={this.emptyAreaHandler}
                >
                {lines}
                <Input submitHandler={this.saveLine} editInfo={this.state.editData} style={inputStyle}/>
            </div>
        )
    }
    // 点击整个编辑器的空白处的时候, 定位到最后一行
    emptyAreaHandler= (e) => {
        if(e.target == this.dom){
            var lastLine = this.state.data[this.state.data.length - 1];
            this.editLine(lastLine);
        }
    }

    // 新增 和 编辑保存, 都调用同样的
    // 因为id一直存在
    saveLine = (lineInfo) => {
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
    }
    // 编辑一行: 将行数据传给input, 计算input的位置
    editLine=(lineData) =>{
        var lineComs = this.state.data.map((l) => {
            return this.refs[l.id];
        });
        this.setState({
            editData: lineData
        });
        this.updateInputPos(lineData.id);
    }

    lineClickHandler=(e, lineData)=>{
        // console.log(lineProps.data.id);
        this.editLine(lineData);
        e.stopPropagation();
    }
    // 根据lineId 更新input的位置
    updateInputPos = (lineId) => {
        var lineComs = this.state.data.map((l) => {
            return this.refs[l.id];
        });
        this.setState({
            inputPos: inputShouldBe(lineComs, this.state.data, lineId)
        });
    }
}

export default Composer
