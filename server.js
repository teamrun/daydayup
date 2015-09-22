var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var port = 3000;
// for hot replacement
var extraEntrys = [
    'webpack-dev-server/client?http://localhost:'+port,
    'webpack/hot/only-dev-server'
];
for( var i in config.entry ){
    var entryItem = config.entry[i];
    if(Array.isArray(entryItem)){
        config.entry[i] = config.entry[i].concat(extraEntrys);
    }
    else if(typeof entryItem == 'string'){
        config.entry[i] = [entryItem].concat(extraEntrys);
    }
}
// 600ms左右,  sourcemap要1600ms
// config.devtool = 'cheap-module-source-map';
config.devtool = 'source-map';

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
        aggregateTimeout: 100,
        poll: 200
    },
    stats: {
        hash: false,
        cached: false,
        cachedAssets: false,
        colors: true
    }
}).listen(port, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at localhost:3000');
});
