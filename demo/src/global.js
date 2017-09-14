const path = require('path');
console.log(window.userConfig);
/*async function getComponent(){
    return await import(/!* webpackChunkName: "print" *!/ './0ipConfig.js');
}
var abc='aaa'
getComponent().then(component=>{
    console.log(component)
    abc= component.default

})*/


// import dataIp from './0ipConfig.js';
// var ipConfig = require('./0ipConfig.js');
// console.log(dataIp.dataIp)

export default{
    install(Vue,options){
        require.ensure(['./0ipConfig.js'], function(require) {
            Vue.prototype.$dataIp2= require('./0ipConfig.js')

        }.bind(this),'0ipConfig')
/*        getComponent().then(component=>{
            console.log(component)
            abc= component.dataIp

        })*/
        Vue.prototype.$dataIp2= 134134
        // Vue.prototype.$dataIp2=ipConfig
        Vue.prototype.getIP=function () {
            console.log(this.$dataIp2)
        }

        Vue.prototype.$dateClass='pickedClass';
        Vue.prototype.$onePageLine=15;
    }
}