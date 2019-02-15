import Vue from 'vue'
import Router from 'vue-router'
import Bookshelve from '../pages/bookshelve.vue'
import Article from '../pages/article/index.vue'
import Schema from '../pages/schema/index.vue'
import BookList from '../pages/bookList/index.vue'
import Login from '../pages/login.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
  {
    path: '/',
    alias: '首页',
    icon: 'ios-analytics',
    name: 'Bookshelve',
    redirect: '/article',
    component: Bookshelve,
    children: [
      {
        path: '/article',
        component: Article
      },
      {
        path: '/BookList',
        component: BookList
      },
      {
        path: '/Schema',
        component: Schema
      },
      {
        path: '/Bar',
        component: Bar
      },
      {
        path: '/article/:id',
        component: Article
      }
    ]
  },
  { path: '/github', alias: 'Github', icon: 'ios-navigate', component: Foo },
  { path: '/qa', alias: 'Q&A', icon: 'ios-keypad', component: Bar },
  {
    path: '/login',
    component: Login
  },
]

Vue.use(Router)

export default new Router({
  routes
})

export {
  routes
}
