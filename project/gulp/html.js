var fs = require('fs');
var path = require('path');

// 读取loading文件
// 插入到html页面中
gulp.task('html', function(){
    var imgPath = path.join(__dirname, '../../', F.img.loadingBg);
    // console.log(imgPath);
    var imgUrl = '';
    try{
        var imgBase64 = fs.readFileSync(imgPath, 'base64');
        imgUrl = 'data:image/jpg;base64,'+imgBase64;
    }
    catch(e){
        imgUrl = 'http://7xk260.com1.z0.glb.clouddn.com/@/daydayup/9e26e77bbe8d8f6259766b1fe3b7d321.jpeg';
    }
    var styleStr = 'background-image: url('+imgUrl+')';
    gulp.src(F.html.main)
        .pipe($.replace(/"\.\//g, '"../'))
        .pipe($.replace('{{style}}', styleStr))
        .pipe(gulp.dest(F.verdor.destPath))
});
