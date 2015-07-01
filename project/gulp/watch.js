var browserSync = require('browser-sync');

var reload = browserSync.reload;
// 如果是watch 开启reload服务
// 开启服务一定要放在gulp.watch的任务之外
if(taskName == 'watch'){
    browserSync({
        notify: false,
        logPrefix: 'sync',
        server: './',
        // 打开浏览器中url的路径
        startPath: '/dist',
        reloadOnRestart: true
    });
}

gulp.task('src-watch', function(){
    gulp.watch(F.css.watch, ['less']);
    gulp.watch(F.html.watch, ['html']);
    gulp.watch(F.script.watch, ['script']);
});
gulp.task('reload-watch', function(){
    gulp.watch(F.reloadWatch, [reload]);
});
