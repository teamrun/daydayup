var timeArr = [];

var timer;
function echo(){
    clearTimeout(timer);
    timer = setTimeout(function(){
        var sum = timeArr.reduce(function(prev, item){
            return prev + item;
        }, 0);
        console.log('evarage time: ', (sum/timeArr.length).toFixed(3) + 'ms');
    }, 10);
}

export default function judgeType(lastType, text){
    var start = window.performance.now();
    var type;
    switch(true){
        case text.indexOf('###') === 0:
            type = 'h3';
            break;
        case text.indexOf('##') === 0:
            type = 'h2';
            break;
        case text.indexOf('#') === 0:
            type = 'h1';
            break;
        case text.indexOf('    ') === 0:
            type = 'code';
            break;
    }

    var end  = window.performance.now();
    timeArr.push(end-start);
    echo();
    return type;
}
