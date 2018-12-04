import modalUser from '../modal/user'
async function add(ctx, next) {
  ctx.send(0, '测试', ctx.request.query)
}

export default {
  add
}
