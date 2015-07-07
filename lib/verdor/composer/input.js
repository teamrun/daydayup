class Input extends React.Component {
    componentDidMount(){
        this.dom = React.findDOMNode(this);
    }
    render () {
        var style = this.props.style;
        return (
            <textarea className="composer-input"
                style={style}
                onKeyDown={this.keyDownHandler}
                >
            </textarea>
        );
    }

    keyDownHandler=(e) => {
        if(e.keyCode == 13){
            var text = this.dom.value;
            this.dom.value = '';
            this.props.submitHandler(text);
            e.preventDefault();
        }
    }
}

export default Input
