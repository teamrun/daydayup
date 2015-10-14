import React from 'react';
import Editor from './coms/Editor';

class App extends React.Component {
    componentDidMount() {
        setTimeout(function(){
            document.body.classList.remove('welcome');
        }, 1000);
    }
    render() {
        return (
            <div id="ctn">
                <Editor />
            </div>
        );
    }
}

// export default HelloWorld;

React.render(<App />, document.querySelector('main'));
