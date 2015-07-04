// 自动重新载入到3000端口, 那里有browser-sync
if(window.location.protocol == 'file:'){
    var reloadingUrl = 'http://localhost:3000/dist/index.html';
    fetch(reloadingUrl).then(function(){
        window.location.href = reloadingUrl;
    }, function(e){
        console.log(e);
        if(e.stack && e.stack.indexOf('native') >= 0){
            window.location.href = reloadingUrl;
        }
    });
}


var $ = document.querySelector.bind(document);
window.onload = function(){
    if(window.process){
        var div = document.createElement('div');
        div.classList.add('foot-tip')
        div.innerHTML = 'we are in electron!';
        $('main').appendChild(div);
    }
}
