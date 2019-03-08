import * as Koa from 'koa'
import * as favicon from 'koa-favicon'
import middleware from './middleware/index.js'
import { STATIC_PATH } from './utils/CONST'

const app = new Koa()
app.use(favicon(STATIC_PATH + '/favicon.ico'))
if(!process.env.JUSTNODE) {
  const webpack = require('webpack')
  const devMiddleware = require('./middleware/webpackConfig');
  const hotMiddleware = require('./middleware/hotMiddleware')
  const config = process.env.DEV === '1' ? require('../webpack/webpack.dev') : require('../webpack/webpack.prod')
  const compiler = webpack(config)
  app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))
  app.use(hotMiddleware(compiler))
}


middleware(app)
// mon()

app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n')
})
