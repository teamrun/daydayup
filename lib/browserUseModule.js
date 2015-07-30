// 自动重新载入到3000端口, 那里有browser-sync
if(window.location.protocol == 'file:'){
    var reloadingUrl = 'http://localhost:3000/';
    var http = require('http');
    http.get(reloadingUrl, function(res){
        if(res.statusCode === 200){
            window.location.href = reloadingUrl;
        }
    });
}


window.$ = require('jquery');
window.onload = function(){
    if(window.process){
        var div = document.createElement('div');
        div.classList.add('foot-tip')
        div.innerHTML = 'we are in electron!';
        $('main').append(div);
    }
}
