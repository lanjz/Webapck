/**
 * Created by 兰江州 on 2017/8/13.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  //打包时自动生成文件
module.exports = {
    entry: {
        app: './src/index.js',
        // IP: './src/0ipConfig.js',
        // 'vendor': ['./src/0ipConfig.js']   //指定公共文件
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        rules:[

            {
                test: /\.(png|svg|jpg|gif)$/,
                // use:['file-loader'],
                loader:"url-loader?limit=8192&name=img/[name][hash:8].[ext]"
            },
            {
                test:/\.(woff|woff2|eot|otf)$/,
                loader:"url-loader?limit=8192&name=fonts/[name][hash:8].[ext]"
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html', //通过模板生成的文件名
            template:'index.html',//模板路径
            inject:true, //是否自动在模板文件添加 自动生成的js文件链接
            title:'这个是WebPack Demo',
            minify:{
                removeComments:true //是否压缩时 去除注释
            }
        }),

    ],
};