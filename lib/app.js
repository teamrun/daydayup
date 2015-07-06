import Editor from './coms/Editor';

class HelloWorld extends React.Component {
    componentDidMount() {
        // setTimeout(function(){
            document.body.classList.remove('welcome');
        // }, 1000);
    }
    render() {
        return (
            <div>
                Hello, Electron...
                <Editor />
            </div>
            );
    }
}

// export default HelloWorld;

React.render(<HelloWorld />, $('main'));
