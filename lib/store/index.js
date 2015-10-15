import Immutable from 'immutable';

let {OrderedMap, Map: IMap} = Immutable;

var Dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./constants');
var assign = require('object-assign');

var CONTENT_CHANGE = 'content-change';
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};

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
let inputChar = (chars) => {
    let {startId, endId, startOffset, endOffset} = StoreHouse.get('range');
    if(startId === endId){
        let contentData = StoreHouse.get('content');
        let oldText = contentData.get(startId);
        let newText = oldText.replaceBetween(startOffset, endOffset, chars);
        StoreHouse = StoreHouse.set('content', contentData.set(startId, newText));
        // console.log(StoreHouse.get('content').get(startId));
    }
};
let rememberRange = (rangeInfo) => {
    StoreHouse = StoreHouse.set('range', rangeInfo);
};

var Store = assign({}, EventEmitter.prototype, {
    getContent: getContent,


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
                inputChar(text);
                Store.emitChange(CONTENT_CHANGE);
            }
            break;

        case Constants.rememberRange:
            rememberRange(action.data);
            break;
        default:
        // no op
    }
});

module.exports = Store;
