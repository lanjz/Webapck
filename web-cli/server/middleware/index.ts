import * as bodyParser from 'koa-bodyparser'
import router from '../router'
// import sent from '../util/ret'

export default function (app) {
  app.use(bodyParser())
  // app.use(sent())
  app.use(router.routes()).use(router.allowedMethods())
}
