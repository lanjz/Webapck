/**
 * Created by 兰江州 on 2017/8/13.
 */
import './style.css';
import img from './safe_u500.png';
// import printMe from './print.js';
import Vue from 'vue'
import App from './App.vue'
import global from "./global.js"
//光引入没用，还得使用他
Vue.use(global)
function getComponent(){
    var element=document.createElement("div");
    element.innerHTML="HELLO WEBPACK";
    var cImg=new Image()
    cImg.src=img;
    element.appendChild(cImg);
    var btn = document.createElement('button');
    btn.innerHTML = 'Click me and check the console!';
    // var par=await import(/* webpackChunkName: "print" */ './print.js');
 /*   btn.onclick = e => import(/!* webpackChunkName: "print" *!/ './print').then(module => {
        var print = module.default;
        print();
    });*/
/*    btn.onclick=function () {
       return import(/!* webpackChunkName: "print" *!/ './print').then(module => {
            var print = module.default;
            print();
        });
    }*/

    element.appendChild(btn);
    return element;

}

document.body.appendChild(getComponent());
new Vue({
    el:'#app',
    render:h=>h(App)
})