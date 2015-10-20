import Immutable from 'immutable';

let {OrderedMap, Map: IMap} = Immutable;

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./constants');
var assign = require('object-assign');

import Mutation from './Helper';
let {Drange} = Mutation;

var CONTENT_CHANGE = 'content-change';

let contentStore = new OrderedMap();

let StoreHouse = IMap({
    range: {},
    content: contentStore
});


let getContent = () => StoreHouse.get('content');
// 写入初始化数据
let setInitialData = (rangeData, contentData)=>{
    contentStore = contentStore.clear();
    contentData.forEach(function(item){
        contentStore = contentStore.set(item.id, item.text);
    });
    StoreHouse = StoreHouse.set('range', rangeData).set('content', contentStore);
};
// 输入文字
let inputChars = (chars) => {
    StoreHouse = Mutation.InputChars(StoreHouse, chars);
};

// backspace 回删键
let deleteBack = () => {
    StoreHouse = Mutation.Delete(StoreHouse, 'back');
}
// delete 删除之后的一个字符
let deleteForward = () => {
    StoreHouse = Mutation.Delete(StoreHouse, 'forward');
}

// 记住range数据
let rememberRange = (rangeInfo) => {
    StoreHouse = StoreHouse.set('range', Drange(rangeInfo));
};

var Store = assign({}, EventEmitter.prototype, {
    getContent: getContent,
    getRangeData: () => StoreHouse.get('range'),

    emitChange: function(name) {
        this.emit(name);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(eventName, callback) {
        this.on(eventName, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListener(eventName, callback);
    }
});

// Register callback to handle all updates
Dispatcher.register(function(action) {
    var text;
    console.log('[store] got action:', action.actionType);

    switch(action.actionType) {
        case Constants.storeInit:
            text = action.data;
            if (text !== '') {
                setInitialData(action.range, action.content);
                Store.emitChange(CONTENT_CHANGE);
            }
            break;

        case Constants.inputChar:
            text = action.data;
            if (text !== '') {
                inputChars(text);
                Store.emitChange(CONTENT_CHANGE);
            }
            break;
        case Constants.backspace:
            deleteBack();
            Store.emitChange(CONTENT_CHANGE);
            break;
        case Constants.delete:
            deleteForward();
            Store.emitChange(CONTENT_CHANGE);
            break;
        case Constants.rememberRange:
            rememberRange(action.data);
            break;
        default:
        // no op
    }
});

module.exports = Store;
