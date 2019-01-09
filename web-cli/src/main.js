import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directive from './global/directive'
import toast from './components/toast/index'

Vue.use(toast)
Vue.use(directive)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
