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

### Module not found: Error: Can't resolve '@babel/runtime/helpers/interopRequireDefault' 

Everyone probably already has @babel/runtime as dependencies. Unfortunately Babel has removed the builtin helpers since v7.0.0-beta.56 (3 days ago). Since npm doesn't automatically update most people won't have this problem.

Try installing v7.0.0-beta.55, this fixes your problem:

```json
 "@babel/runtime": "7.0.0-beta.55",
```

### webpack+babel+transform-runtime, IE下提示Promise未定义的解决方法

http://www.php.cn/js-tutorial-380204.html

当使用了webpack的异步加载时，webpack要求原生支持Promise

`在js文件开头添加window.Promise = Promise`
