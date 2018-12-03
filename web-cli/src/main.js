import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { userIView } from './components/iView/index.js'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
console.log('process.env.MOCK', process.env.MOCK)
console.log('process.env', process.env)

userIView(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
