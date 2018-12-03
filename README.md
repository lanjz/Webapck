### ReadMd啊

### 命令行参数

#### cross-env

`cross-env MOCK=1 webpack-dev-server  --open --config webpack/webpack.dev.js`

在webpack配置文件中读取：

```javascript
const { MOCK } = process.env;
```

### clean-webpack-plugin is outside of the project root. skipping

```javascript
   new CleanWebpackPlugin(['dist'], {
      root: process.cwd(),
    })
```

### IE11报SecurityError问

解决方案为 Internet选项->安全->本地Internet->站点，把所有勾选取消

### devServer 不支持IE了
