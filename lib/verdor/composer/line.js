function preProcessContent(content){
    // 保留空格
    // 有必要用pre标签么...
    return content.replace(/\ /g, '\u00A0');
}


class Line extends React.Component {
    componentDidMount() {
        this.dom = React.findDOMNode(this);
    }
    shouldComponentUpdate (nextProps, nextState) {
        if(this.props.data.text == nextProps.data.text){
            return false;
        }
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render(){
        var text = this.props.data.text;
        var content = preProcessContent(text);
        return (
            <div className="compose-line">{content}</div>
        )
    }
}

export default Line
