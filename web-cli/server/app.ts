import * as Koa from 'koa'
import middleware from './middleware'

import  mon from './db/mon.js'

// const webpack = require('webpack')
// const devMiddleware = require('./middleware/webpackConfig');
// const hotMiddleware = require('./middleware/hotMiddleware')
// const config = process.env.DEV === '1' ? require('../webpack/webpack.dev') : require('../webpack/webpack.prod')
// const compiler = webpack(config)
const app = new Koa()

// app.use(devMiddleware(compiler, {
//   publicPath: config.output.publicPath
// }))
// app.use(hotMiddleware(compiler))

middleware(app)
// mon()

app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n')
})
