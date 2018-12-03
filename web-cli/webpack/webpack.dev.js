const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack');
const webpackCommon = require('./webpack.common')
const cwd = process.cwd()


module.exports = merge(webpackCommon, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(cwd, 'dist'),
    // host: "10.5.23.",
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 启动热更新
  ],
  optimization: {
    usedExports: true
  },
})
