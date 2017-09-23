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

### IE下不支持Promise 解决方法

```javascript
npm install --save-dev babel-polyfill

//main.js 头部import babel-polyfill
import 'babel-polyfill'
```
