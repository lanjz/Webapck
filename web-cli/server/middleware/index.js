import * as bodyParser from 'koa-bodyparser'
import router from '../router'
import sent from '../utils/ret'
import hello from '../utils/hello.js'

export default function (app) {
  app.use(bodyParser())
  app.use(sent())
  app.use(hello.errorHandle)
  app.use(hello.checkAuth)
  app.use(router.routes()).use(router.allowedMethods())
}
