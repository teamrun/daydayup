#!/usr/bin/env node
var co = require('co');
var thunkify = require('thunkify');
var fse = require('fs-extra');
var path = require('path');

var APP_PATH = '/Applications/DayDayUp.app/';

var RES_DEST = APP_PATH + '/Contents/Resources/app/';
var RES_SOURCE = path.resolve(__dirname, '../../');

var copyR = thunkify(fse.copy);

function padWithSpace(str){
    return str + ' '.repeat(3-str.length);
}

function echoDoing(){
    var count = 0;
    var charArr = ['\\', '|', '/', '-'];
    return setInterval(function(){
        // process.stdout.write('copy ing ' + charArr[count%(charArr.length)] + '\r');
        // \r的参数要求每次的字符串都一样 或者是一直增加, 不能减少
        // 因此此处用空格补齐
        process.stdout.write('copy ing ' + padWithSpace('.'.repeat(count%4)) + '\r');
        count++;
    }, 333);
}

function packDev(){
    co(function*(){
        var timer = echoDoing();
        yield copyR(RES_SOURCE, RES_DEST, {
            clobber: true,
        });
        clearInterval(timer);
        process.stdout.write('\n');
        console.log('pack up dev done');
    });
}

packDev();
