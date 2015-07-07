import Input from './input';
import Line  from './line';

// 需要在line渲染之后 计算所有line的高度
// 然后去定位input的位置
function inputShouldBe(lineComs){
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
            console.log(l);
            return <Line content={l} key={index} ref={index}/>;
        });
        var inputStyle = {
            transform: 'translateY('+this.state.inputPos+'px)'
        };
        return (
            <div className="composer">
                {lines}
                <Input submitHandler={this.createLine} style={inputStyle}/>
            </div>
        )
    }

    createLine = (text) => {
        this.state.data.push(text);
        this.setState({
            data: this.state.data
        }, () => {
            var lineComs = this.state.data.map((content, index) => {
                return this.refs[index];
            });
            this.setState({
                inputPos: inputShouldBe(lineComs)
            });
        });
    }
}

export default Composer
