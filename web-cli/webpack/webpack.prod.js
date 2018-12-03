const merge = require('webpack-merge')
const webapckCommon = require('./webpack.common')
module.exports = merge(webapckCommon, {
  mode: 'production',
  devtool: 'source-map', // 可看到源码
})
