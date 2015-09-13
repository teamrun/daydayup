module.exports = (str) => {
    return str.replace(/\ /g, '&nbsp;').replace(/\n/g, '<br/>');
}
