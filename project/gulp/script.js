var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

gulp.task('script', function(){
    return browserify({ debug: true })
        .transform(babelify.configure({
            optional: ["es7.classProperties"]
        }))
        .require(F.script.main, { entry: true })
        .bundle()
        .on('error', function(e){
            $.util.beep();
            $.util.log(e.message);
            var stackLines = e.stack.split('\n');
            // 只输出12行, 多了也没用
            $.util.log(stackLines.slice(0, 12).join('\n'));
        })
        .pipe(source('app-bundle.js'))
        .pipe(gulp.dest(F.script.destPath))
        .pipe(reload({stream: true}))
});
