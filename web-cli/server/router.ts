import * as Router from 'koa-router'
import userCtl from './controller/User'
import noteCategoryCtl from './controller/noteCategory'
import bookCtl from './controller/noteCategory'
console.log('userCtl222222', userCtl.find())
const router = new Router({prefix: '/api'})

router.post('/login', userCtl.login)
router.get('/user', userCtl.getModel)
router.get('/user/:id', userCtl.findById)
router.delete('/user', userCtl.deleteById)
router.put('/user', userCtl.modify)
router.post('/user', userCtl.add)

router.get('/book', bookCtl.find)
router.delete('/book', bookCtl.deleteById)
router.put('/book', bookCtl.modify)
router.post('/book', bookCtl.add)

router.get('/noteCategory', noteCategoryCtl.find)
router.delete('/noteCategory', noteCategoryCtl.deleteById)
router.put('/noteCategory', noteCategoryCtl.modify)
router.post('/noteCategory', noteCategoryCtl.add)

router.get('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.get('/qa/:id', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.delete('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.put('/qa/:id', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})
router.post('/qa', async (ctx, next) => {
  ctx.body = 'Hello World2222!'
})

export default router
