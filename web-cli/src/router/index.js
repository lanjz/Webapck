import Vue from 'vue'
import Router from 'vue-router'
import Article from '../pages/article/index.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
  {
    path: '/',
    alias: '首页',
    icon: 'ios-analytics',
    name: 'Article',
    component: Article
  },
  { path: '/github', alias: 'Github', icon: 'ios-navigate', component: Foo },
  { path: '/qa', alias: 'Q&A', icon: 'ios-keypad', component: Bar },
]

Vue.use(Router)

export default new Router({
  routes
})

export {
  routes
}
