const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
console.log('path.resolve(__dirname, \'../\')', path.resolve(__dirname, '../'))
console.log('process.env.MOCK', process.env.MOCK)
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    filename: '[id].bundle.js',
    path: path.resolve('dist'),
    chunkFilename: '[name].[chunkhash].js', // 非入口导出名
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd(),
    }),
    new HtmlWebpackPlugin({
      tile: 'web-cli',
      template: './index.html'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.DEV ? JSON.stringify('development') : JSON.stringify('production'),
      'process.env.MOCK': process.env.MOCK,
    })
  ],
  optimization: { // 指定公共 bundle 的名称。
    runtimeChunk: {
      name: 'manifest'
    },
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          'vue-style-loader',
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader'
          },
          'less-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, '../src/assets/styles/global.less'),
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'url-loader'
        ]
      },
      // 解析vue中的ts
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/], // 设置vue文件可以使用ts
            }
          }
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: { appendTsxSuffixTo: [/\.vue$/] }
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.(vue|js|jsx)$/,
        // loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['.tsx', '.ts', '.js', '.vue']
  }
}
