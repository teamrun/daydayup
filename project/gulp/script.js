var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

gulp.task('script', function(){
    return browserify({ debug: true })
        .transform(babelify)
        .require(F.script.main, { entry: true })
        .bundle()
        .pipe(source('app-bundle.js'))
        .pipe(gulp.dest(F.script.destPath));
});
