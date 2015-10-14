var Dispatcher = require('./dispatcher');
var Constants = require('./constants');

var Actions = {
    // 关于store本身的操作
    fillInitialData(range, content){
        Dispatcher.dispatch({
            actionType: Constants.storeInit,
            range,
            content
        });
    },


    // -------------- content的操作 ----------------------------
    inputChar(str){
        Dispatcher.dispatch({
            actionType: Constants.inputChar,
            data: str
        });
    },







    // -------------- range的操作 ----------------------------
    rememberRange: function(_range) {
        Dispatcher.dispatch({
            actionType: Constants.rememberRange,
            data: _range
        });
    },
};

module.exports = Actions;
