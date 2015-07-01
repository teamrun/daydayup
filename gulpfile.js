var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

var browserSync = require('browser-sync');



var reload = browserSync.reload;

var taskName = process.argv[2];

var F = {
    css: {
        watch: './style/**/*.less',
        main: './style/layout.less',
        destFile: './dist/layout.css',
        destPath: './dist'
    },
    script: {
        watch: './lib/**/*.js',
        main: './lib/app.js',
        destPath: './dist'
    },
    html: {
        watch: './index.html',
        destFile: './index.html'
    },
    verdor: {
        main: ['node_modules/react/dist/react-with-addons.js'],
        destPath: './dist'
    }
};
// 哪些文件变更之后触发reload
F.reloadWatch = [];
for(var i in F){
    if(F[i].destFile){
        F.reloadWatch.push(F[i].destFile);
    }
}

gulp.task('verdor', function(){
    gulp.src(F.verdor.main)
        .pipe(gulp.dest(F.verdor.destPath))
});

gulp.task('script', function(){
    return browserify({ debug: true })
        .transform(babelify)
        .require(F.script.main, { entry: true })
        .bundle()
        .pipe(source('app-bundle.js'))
        .pipe(gulp.dest(F.script.destPath));
});

gulp.task('less', function(){
    gulp.src(F.css.main)
        .pipe(less({
            dumpLineNumbers: 'comments'
        }))
        .pipe(gulp.dest(F.css.destPath));
})
// 如果是watch 开启reload服务
// 开启服务一定要放在gulp.watch的任务之外
if(taskName == 'watch'){
    browserSync({
        notify: false,
        logPrefix: 'sync',
        server: './'
    });
}

gulp.task('src-watch', function(){
    gulp.watch(F.css.watch, ['less']);
    gulp.watch(F.script.watch, ['script']);
});
gulp.task('reload-watch', function(){
    gulp.watch(F.reloadWatch, [reload]);
});

gulp.task('watch', ['verdor', 'script', 'less', 'src-watch', 'reload-watch']);
