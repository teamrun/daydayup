class Input extends React.Component {
    constructor () {
        super();
        this.state = {};
    }
    componentDidMount(){
        this.dom = React.findDOMNode(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({
                value: nextProps.data.text
            });
        }
        else{
            this.setState({
                value: ''
            });
            // console.log('input will receive props');
        }
    }
    render () {
        var style = this.props.style;
        return (
            <textarea className="composer-input"
                style={style}
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.keyDownHandler}
                >
            </textarea>
        );
    }

    onChange=(e) => {
        this.setState({
            value: e.target.value
        })
    }

    keyDownHandler=(e) => {
        if(e.keyCode == 13){
            var text = this.dom.value;
            // this.dom.value = '';
            this.props.submitHandler(text);
            e.preventDefault();
        }
    }
}

export default Input
