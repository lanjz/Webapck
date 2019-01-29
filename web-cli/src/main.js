import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directive from './global/directive'
import helloAlert from './components/messageBox/index'


Vue.config.devtools = true
Vue.use(directive)

Vue.prototype.$alert = helloAlert

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
