import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directive from './global/directive'
import filters from './global/filters'
import helloAlert from './components/messageBox/index'
import helloLoading from './components/loading/index'
import helloToast from './components/toast/index'


Vue.config.devtools = true
Vue.use(directive)
Vue.use(filters)

Vue.prototype.$alert = helloAlert
Vue.prototype.$showLoading = helloLoading.show
Vue.prototype.$hideLoading = helloLoading.hide
Vue.prototype.$toast = helloToast

/* eslint-disable no-new */
const instance = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

export default instance
