const path = require('path');
const HtmlWbpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const jquery = require('jquery')

module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use:  [
          {
            loader: 'style-loader',
            options: {
              transform: './transform.js'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {//*
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            useRelativePath: true
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.md$/,
        use: [ 'json-loader', 'yaml-frontmatter-loader' ]
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]

  },
  plugins: [
    new HtmlWbpackPlugin({
      title: 'Output Management'
    }),
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]

}
