import assign from 'object-assign';
import TextProcessor from './rich-text-process';

function noBubble(e){
    e.stopPropagation();
}

class Input extends React.Component {
    constructor () {
        super();
        this.state = {
            inputH: 0,
            value: ''
        };
    }
    componentDidMount(){
        this.input = React.findDOMNode(this.refs.input);
        this.ghost = React.findDOMNode(this.refs.ghost);
    }
    componentWillReceiveProps(nextProps) {
        var newValue;
        if(nextProps.editInfo){
            newValue = nextProps.editInfo.text || '';
        }
        else{
            newValue = '';
        }
        // 内容变更
        this.setState({
            value: newValue
        }, this.reCaculHeight);
    }
    render () {
        var InputStyle = {
            height: this.state.inputH
        };
        var propStyle = this.props.style;
        var ctnStyle = assign(propStyle, propStyle);

        var ghostContent = TextProcessor(this.state.value);
        return (
            <div className="composer-input-ctn" style={ctnStyle}
                onClick={noBubble}
            >
                <textarea className="composer-input"
                    style={InputStyle}
                    value={this.state.value}
                    ref="input"
                    onChange={this.onChange}
                    onKeyDown={this.keyDownHandler}
                    >
                </textarea>
                <div className="ghost-input"
                    ref="ghost"
                    dangerouslySetInnerHTML={ {__html: ghostContent} }
                    >
                </div>
            </div>
        );
    }

    onChange=(e) => {
        // 内容变更
        this.setState({
            value: e.target.value
        }, this.reCaculHeight);
    }

    keyDownHandler=(e) => {
        if(e.keyCode == 13){
            var text = this.input.value;
            // this.input.value = '';
            this.props.submitHandler({
                id: this.props.editInfo.id,
                text: text
            });
            e.preventDefault();
        }
    }
    // 文字内容变更之后, 重新计算高度
    reCaculHeight =() => {
        var ghostInputHeight = window.getComputedStyle(this.ghost).height;
        if(ghostInputHeight !== this.state.inputH){
            this.setState({
                inputH: ghostInputHeight
            });
        }
    }
}

export default Input
