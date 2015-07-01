class HelloWorld extends React.Component {
    componentDidMount() {
        setTimeout(function(){
            document.body.classList.remove('welcome');
        }, 1000);
    }
    render() {
        return <p>Hello, Electron...</p>;
    }
}

// export default HelloWorld;

React.render(<HelloWorld />, $('main'));
