function params(ctx) {
  console.log('ctx', ctx)
}

function render(retCode = 0, json = '', retMsg = '成功') {
  this.set('Content-Type', 'application/json')
  this.body = JSON.stringify({
    retCode: retCode,
    retMsg: retMsg,
    data: json
  })
}

export default () => {
  return async (ctx, next) => {
    ctx.send = render.bind(ctx)
    await next()
  }
}

export {
  params
}
