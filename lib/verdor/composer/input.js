import assign from 'object-assign';
import TextProcessor from './rich-text-process';

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
        if(nextProps.data){
            this.setState({
                value: nextProps.data.text || ''
            });
        }
        else{
            this.setState({
                value: ''
            });
        }
    }
    render () {
        var InputCtnHeight = {
            height: this.state.inputH
        };
        var style = this.props.style;
        style = assign(style, InputCtnHeight);

        var ghostContent = TextProcessor(this.state.value);
        return (
            <div className="composer-input-ctn" style={InputCtnHeight}>
                <textarea className="composer-input"
                    style={style}
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
        this.setState({
            value: e.target.value
        }, () => {
            // 文字内容变更之后, 重新计算高度
            var ghostInputHeight = window.getComputedStyle(this.ghost).height;
            if(ghostInputHeight !== this.state.inputH){
                this.setState({
                    inputH: ghostInputHeight
                });
            }
        });
    }

    keyDownHandler=(e) => {
        if(e.keyCode == 13){
            var text = this.input.value;
            // this.input.value = '';
            this.props.submitHandler(text);
            e.preventDefault();
        }
    }
}

export default Input
