var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  entry: {
    // 'webpack-dev-server/client?http://localhost:3000',
    // 'webpack/hot/only-dev-server',
    style: './lib/style.js',
    app: './lib/app.js'
  },
  output: {
    path: path.join(__dirname, 'lib/dist'),
    filename: '[name]-bundle.js',
    publicPath: '/lib/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false,
        width: 50,
        // complete: '\u25A0',  // 纯色正方向
        // complete: '\u2234',  // 三点号(数学里的因为所以)
        complete: '✓',
        incomplete: ' ',
        renderThrottle: 50
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel?optional[]=es7.classProperties'],
      exclude: /node_modules/
    }, {
      test: /\.less?$/,
      loaders: ['style', 'css', 'less']
    }]
  }
};
