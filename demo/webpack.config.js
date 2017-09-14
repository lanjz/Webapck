/**
 * Created by 兰江州 on 2017/8/13.
 */
console.log("执行生产环境")
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports=Merge(CommonConfig,{
    module:{
        rules:[
            {
                test: /\.css$/,//生产环境分离CSS
                use: ['style-loader','css-loader']
            },
        ]
    },
    devtool: 'inline-source-map',//明确出现bug位置
    devServer: {
        // contentBase: './dist',
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(), //启用HMR 动态更新变更的模块
    ],
})

