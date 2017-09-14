### 报错：Cannot assign to read only property 'exports' of object '#<Object>'

因为webpack不允许import和module.exports一起使用，即下面这种情况

```javascript
import ipConfig from './0ipConfig.js'
module.export={
    install(Vue,options){
        Vue.prototype.$dataIp=ipConfig
    }
}
```

**解决方式一：使用require导入模块**

```javascript
var ipConfig = require('./0ipConfig.js');
module.export={
    install(Vue,options){
        Vue.prototype.$dataIp=ipConfig
    }
}
```

**解决方式二： 统一使用ES6方式**

```javascript
import ipConfig from './0ipConfig.js'
export default{
    install(Vue,options){
        Vue.prototype.$dataIp=ipConfig
    }
}
```
### 需求：希望打包出来的工程中单独分离一个IP设置的JS文件，以便客户部署的时候修改

假设要分离的文件：0ipConfig.js

```javascript
//0ipConfig.js
const dataIp= 'http://192.168.1.116:8080'
export default dataIp
```

**方式一：作为入口文件（有问题）** 

```javascript
// webpack.config.js
module.exports={
      entry: {
            app: './src/index.js',
            IP: './src/0ipConfig.js',  //额外分离出0ipConfig
        },
}
```

```javascript
// global.js
引入Oipconfig.js
var ipConfig = require('./0ipConfig.js');
```

**方式二： 使用ES6异步导入方式**

```javascript
// global.js
async function getComponent(){
    return await import(/** webpackChunkName: "print" **/ './0ipConfig.js');
}
var abc=''
getComponent().then(component=>{
     abc= component.default
})
export default{
    install(Vue,options){
        Vue.prototype.getIP=function () {
            console.log(abc)
        }
    }
}
```

**方式三： 使用ES5require.ensure异步导入方式**

```javascript
// global.js
export default{
    install(Vue,options){
        require.ensure(['./0ipConfig.js'], function(require) {
            Vue.prototype.dataIp= require('./0ipConfig.js')
        }.bind(this),'0ipConfig')

    }
}
```

**方式四：** 将配置项写在index.html里挂在window全局变量中

**无论是方式2还是方式三，使用异步实现总感觉不方便，而且存在一个很大弊端就是由于是异步获取，导致一开始并没有拿到这个IP的值,
但是如果不需要一开始就显示的话，异步方式还是可以正常使用的**

### VUE-CLI中入口文件配置在 webpack.base.conf.js中