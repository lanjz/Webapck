import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from './components/toast/index'

Vue.use(toast)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
