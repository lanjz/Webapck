### vue模板script标签中设置 lang="ts" ，报错

webpack module配置中添加如下配置

```sh
    {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/], //设置vue文件可以使用ts
            }
          }
        ],
      }
```

### Experimental support for decorators is a feature that is subject to change in a future release. Set the ‘experimentalDecorators’ option to remove this warning
    
tsconfig.json中添加如下配置

```sh
    "compilerOptions": {
        "experimentalDecorators": true,
        "allowJs": true
    }
```

###  "startTs": "tsc && node dist/app.js"

tsc 命令会根据 tsconfig.json中配置，对我们 ts 文件进行编译，并将生成的文件放入  dist目录下。然后我们使用 node server.js命令，启动服务

https://www.jianshu.com/p/1a91f36e5153
