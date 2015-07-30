#!/usr/bin/env node
var path = require('path');

var fse = require('fs-extra');
var co = require('co');
var thunkify = require('thunkify');
var webpack = require('webpack');

var packCode = function(callback){
    webpack(require('../../webpack.config'), callback);
}

var APP_PATH = '/Applications/DayDayUp.app/';

var RES_DEST = APP_PATH + '/Contents/Resources/app/';
var RES_SOURCE = path.resolve(__dirname, '../../');

var copyR = thunkify(fse.copy);

function padWithSpace(str){
    return str + ' '.repeat(20-str.length);
}

function echoDoing(str){
    var count = 0;
    var charArr = ['\\', '|', '/', '-'];
    return setInterval(function(){
        // process.stdout.write('copy ing ' + charArr[count%(charArr.length)] + '\r');
        // \r的参数要求每次的字符串都一样 或者是一直增加, 不能减少
        // 因此此处用空格补齐
        process.stdout.write(str + padWithSpace('.'.repeat(count%4)) + '\r');
        count++;
    }, 333);
}

function packDev(){
    co(function*(){
        var timer = echoDoing('packing code');
        yield packCode;
        clearInterval(timer);
        timer = echoDoing('coping file');
        yield copyR(RES_SOURCE, RES_DEST, {
            clobber: true,
        });
        clearInterval(timer);
        process.stdout.write('\n');
        console.log('pack up dev done');
    });
}

packDev();
