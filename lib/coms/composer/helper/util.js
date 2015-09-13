import React from 'react';

// 需要在line渲染之后 计算所有line的高度
// 然后去定位input的位置
function inputShouldBe(lineComs, datas, targetId){
    // 如果有目标要编辑的targetId, 就把合计的lines截取一下
    if(datas && targetId){
        var targetIndex = datas.length;
        var hasTarget = datas.some(function(d, i){
            targetIndex = i;
            return d.id == targetId;
        });

        lineComs = lineComs.slice(0, targetIndex);
    }

    var totalHeight = 0;
    totalHeight = lineComs.reduce(function(prev, item){
        var dom = React.findDOMNode(item);
        var style = window.getComputedStyle(dom);
        var height = Number(style.height.slice(0, style.height.length-2));
        return prev + height;
    }, 0);
    console.log('lines total height: ', totalHeight);
    return totalHeight;
}

// 对象数组, 根据id获取匹配到的对象的索引号
function getIndex(id, arr){
    var index;
    var hasItem = arr.some(function(item, i){
        index = i;
        return item.id == id;
    });
    return index;
}

function updateTextOfData(text, id, arr){
    var line = arr[getIndex(id, arr)];
    line.text = text;
}

module.exports = {
    inputShouldBe,
    getIndex,
    updateTextOfData
}
