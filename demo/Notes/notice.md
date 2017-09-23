### ES6转ES5

目前在IE浏览器下，不支持ES6语法

```javascript
npm install --save-dev babel-core babel-preset-es2015 babel-loader

//添加 loader
loaders: [{    
      test: /\.js$/,    
      exclude: /node_modules/,    
      loader: 'babel-loader'    
  }]  
```
