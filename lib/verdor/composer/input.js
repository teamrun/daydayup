import assign from 'object-assign';
import TextProcessor from './rich-text-process';

function noBubble(e){
    e.stopPropagation();
}
/* 数据结构
* props:
*       editInfo: id 行id
*                 text 文本内容
*                 cursorPos 鼠标定位
*
 */

var Input = React.createClass({
    getInitialState () {
        return {
            inputH: 0,
            value: ''
        };
    },
    componentDidMount(){
        this.input = React.findDOMNode(this.refs.input);
        this.ghost = React.findDOMNode(this.refs.ghost);
    },
    componentWillReceiveProps(nextProps) {
        var newValue;
        if(nextProps.editInfo){
            newValue = nextProps.editInfo.text || '';
        }
        else{
            newValue = '';
        }
        var cursorPos = (nextProps.editInfo.cursorPos === undefined)?  newValue.length : nextProps.editInfo.cursorPos;
        // 内容变更
        this.setState({
            value: newValue
        }, () => {
            this.reCaculHeight();
            this.input.focus();
            this.setSelection(cursorPos);
        });
    },
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
    },

    onChange (e){
        // 内容变更
        this.setState({
            value: e.target.value
        }, this.reCaculHeight);
    },
    keyDownHandler (e){
        var keyCode = e.keyCode;
        var props = this.props;
        if(keyCode === 13){
            var text = this.input.value;
            var sel = this.getSelection();
            props.keyHandler.enter(e, {
                id: props.editInfo.id,
                text: text
            }, sel);
            return;
        }
        // back-space键, 向前删除
        // 如果鼠标当前在最开始, 就向前merge一行
        else if(keyCode === 8){
            var rangeArr = this.getSelection();
            if(rangeArr[0] == rangeArr[1] && rangeArr[0] === 0){
                // 将上面一行 和 当前行合并起来
                // 并把当前行删除掉
                props.mergeToPrev(props.editInfo.id, this.state.value);
                e.preventDefault();
            }
            return;
        }
        // console.log('keycode:', e.keyCode);
    },
    // 文字内容变更之后, 重新计算高度
    reCaculHeight (){
        var ghostInputHeight = window.getComputedStyle(this.ghost).height;
        if(ghostInputHeight !== this.state.inputH){
            this.setState({
                inputH: ghostInputHeight
            });
        }
    },
    setSelection (start, end){
        end = end || start;
        this.input.setSelectionRange(start, end);
    },
    getSelection (){
        return [this.input.selectionStart, this.input.selectionEnd]
    }
});

export default Input
