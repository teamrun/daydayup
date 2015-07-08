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

class Composer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inputPos: 0
        };
    }
    render () {
        var lines = this.state.data.map((l, index)=> {
            // console.log(l);
            return <Line data={l} key={l.id} ref={l.id} clickHandler={this.lineClickHandler}/>;
        });
        var inputStyle = {
            transform: 'translateY('+this.state.inputPos+'px)'
        };
        return (
            <div className="composer">
                {lines}
                <Input submitHandler={this.createLine} data={this.state.editData} style={inputStyle}/>
            </div>
        )
    }

    createLine = (text) => {
        var newLine = {
            id: shortid.generate(),
            text: text
        };
        this.state.data.push(newLine);
        this.setState({
            data: this.state.data
        }, () => {
            var lineComs = this.state.data.map((l) => {
                return this.refs[l.id];
            });
            this.setState({
                inputPos: inputShouldBe(lineComs)
            });
        });
    }
    editLine=(lineData) =>{
        var lineComs = this.state.data.map((l) => {
            return this.refs[l.id];
        });

        this.setState({
            editData: lineData,
            inputPos: inputShouldBe(lineComs, this.state.data, lineData.id)
        });
    }

    lineClickHandler=(e, lineProps)=>{
        console.log(lineProps.data.id);
        this.editLine(lineProps.data);
    }
}

export default Composer
