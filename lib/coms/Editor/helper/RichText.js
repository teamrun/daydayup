module.exports = (str) => {
    // 多个空格 每两个中间的第二个替换为&nbsp;
    return str.replace(/\ {2}/g, ' &nbsp;').replace(/\n/g, '<br/>');
}
