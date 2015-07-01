class HelloWorld extends React.Component {
  render() {
    return <p>Hello, Electron...</p>;
  }
}

// export default HelloWorld;

React.render(<HelloWorld />, $('main'));
