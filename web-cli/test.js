const Koa = require('koa')
const Router = require('koa-router');
const app = new Koa()
const router = new Router()
const main = ctx => {
  ctx.response.body = 'Hello World';
};

const welcome = (ctx, name) => {
  ctx.response.body = 'Hello ' + name;
};
router.get('/', main)
router.get('/:name', welcome)
app.use(router.routes());

app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n')
})
