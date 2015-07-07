global.gulp = require('gulp');
global.$ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

global.taskName = process.argv[2];

global.F = {
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
        main: './index.html',
        destFile: './dist/index.html'
    },
    img: {
        loadingBg: './img/loading.jpg'
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

global.reload = browserSync.reload;

gulp.task('verdor', function(){
    gulp.src(F.verdor.main)
        .pipe(gulp.dest(F.verdor.destPath))
});

require('./project/gulp/html');
require('./project/gulp/script');
require('./project/gulp/watch');


gulp.task('less', function(){
    gulp.src(F.css.main)
        .pipe($.less({
            dumpLineNumbers: 'comments'
        }))
        .pipe(gulp.dest(F.css.destPath))
        .pipe(reload({stream: true}))
})

gulp.task('watch', ['verdor', 'html', 'script', 'less', 'src-watch', 'reload-watch']);
