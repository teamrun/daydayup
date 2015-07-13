import TextProcessor from './rich-text-process';


var Line = React.createClass({
    componentDidMount() {
        this.dom = React.findDOMNode(this);
    },
    shouldComponentUpdate (nextProps, nextState) {
        // object是引用... 当前的props和nextProps的data是同一个引用...
        if(this.props.text == nextProps.text){
            // console.log('Line: wont render or update');
            return false;
        }
        return true;
    },
    componentDidUpdate(prevProps, prevState) {
    },
    render(){
        var text = this.props.text;
        var content = TextProcessor(text);
        return (
            <div className="compose-line"
                onClick={this.clickHandler}
                dangerouslySetInnerHTML={ {__html: content} }
                ></div>
        )
    },

    clickHandler (e){
        var props = this.props;
        props.clickHandler(e, {
            id: props.id,
            text: props.text
        });
    }
});

export default Line
