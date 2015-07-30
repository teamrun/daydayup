var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    // 'webpack-dev-server/client?http://localhost:3000',
    // 'webpack/hot/only-dev-server',
    style: './lib/style.js',
    app: './lib/app.js'
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name]-bundle.js',
    publicPath: '/lib/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
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
