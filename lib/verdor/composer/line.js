class Line extends React.Component {
    componentDidMount() {
        this.dom = React.findDOMNode(this);
    }
    shouldComponentUpdate (nextProps, nextState) {
        if(this.props.content == nextProps.content){
            return false;
        }
    }
    componentDidUpdate(prevProps, prevState) {
    }
    render(){
        var content = this.props.content;
        return (
            <div className="compose-line">{content}</div>
        )
    }
}

export default Line
