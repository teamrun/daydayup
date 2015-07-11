import TextProcessor from './rich-text-process';


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
        var content = TextProcessor(text);
        return (
            <div className="compose-line"
                onClick={this.clickHandler}
                dangerouslySetInnerHTML={ {__html: content} }
                ></div>
        )
    }

    clickHandler=(e) => {
        this.props.clickHandler(e, this.props);
    }
}

export default Line
