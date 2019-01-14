import Vue from 'vue'
import Router from 'vue-router'
import Bookshelve from '../pages/bookshelve.vue'
import Article from '../pages/article/index.vue'
import Schema from '../pages/schema/index.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
  {
    path: '/',
    alias: '首页',
    icon: 'ios-analytics',
    name: 'Bookshelve',
    component: Bookshelve,
    children: [
      {
        path: '',
        component: Schema
      },
      {
        path: '/Bar',
        component: Bar
      }
    ]
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
