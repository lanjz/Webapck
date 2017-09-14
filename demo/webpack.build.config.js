/**
 * Created by 兰江州 on 2017/8/13.
 */
console.log("执行打包环境")
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//每次构建前清理 /dist 文件夹
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports=Merge(CommonConfig,{
/*    entry: {
        IP: './src/0ipConfig.js',
    },*/
    module:{
        rules:[
            {
                test: /(\.jsx|\.js)$/,  //生产环境分离JS
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
                },
            },
            {
                test: /\.css$/,//生产环境分离CSS
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                })
            },
        ]
    },
    plugins:[
        new ExtractTextPlugin({
            filename:'./css/style.css'
        }),
        new CleanWebpackPlugin(['dist']),   //每次构建清空dist文件夹
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                /* warnings: false,
                 drop_debugger: true,
                 drop_console: true*/
            }
        }),
/*        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest', chunks: ['vendor']  //指定的公共文件和webpack的运行文件会先被生成vendor.js，然后webpack的运行文件会被从vendor中再次抽出，生成一个manifest.js文件
        }),*/

    ],
})

