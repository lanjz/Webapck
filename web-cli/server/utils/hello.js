import * as jwt from 'jwt-simple'
import validator from './validator'
import userCtrl from '../controller/user'

/**
 * @param { Error } e
 * @param { String } tart 出错的目标名称
 * @return { String } errMsg 返回错误提示信息
 * */

function dealError(e, tart) {
  console.log('e', e.message)
  let errMsg = ''
  if(e.code === 11000) {
    errMsg = `${tart}已经存在`
  } else if(e.name === 'CastError'){
    errMsg = `${tart}不存在`
  }
  return errMsg
}

/**
 * @param { Object } params
 * @param { Object } model 根据mongoose.model过滤参数
 * @return { Object } filterData 返回过滤后的参数
 * */
function filterParams(params, model) {
  const errMsg = []
  const filterData = {}
  Object.keys(model).forEach((item, index) => {
    if(model[item].required&&!params[item]) {
      errMsg.push(`${item}不能为空`)
    } else if(model[item]['validate']&&!validator[item](params[item])) {
      errMsg.push(`${item}格式不正确`)
    } else {
      filterData[item] = params[item]
    }
  })
  return { errMsg: errMsg.join(), filterData }
}

function errorHandle(ctx, next){
  return next().catch((err) => {
    console.log('errorHandle', err)
    if (err.status === 401) {
      ctx.status = 401
      ctx.send(2, 'err.originalError ? err.originalError.message : err.message')
    } else {
      throw err
    }
  })
}

const SECRET = 'hello~'

function encodeLoginTypeJwt(data) {
  const payload = {
    ...data
  }
  const token = jwt.encode(payload, SECRET)
  return token
}
function decodeLoginTypeJwt(token) {
  const decoded = jwt.decode(token, SECRET)
  return decoded
}

async function checkAuth(ctx, next) {
  if(ctx.url.indexOf('/api') > -1) {
    const getHelloToken = ctx.cookies.get('helloToken')
    const { clientUser, clientPass } = decodeLoginTypeJwt(getHelloToken)
    console.log('clientUser', clientUser, clientPass)
    if(!clientUser||!clientPass) {
      ctx.send(2, '', 'Token无效请重新登录')
      return
    }
    try{
      const result = await userCtrl.userAuth({userName: clientUser, passWord: clientPass})
      if(!result) {
        ctx.send(2, '', 'Token无效请重新登录')
        return
      }
      ctx.state.userId = result._id
      await next()
    } catch(e) {
      ctx.send(2, '', dealError(e))
    }
  } else {
    await next()
  }
}



export default {
  dealError,
  filterParams,
  errorHandle,
  encodeLoginTypeJwt,
  decodeLoginTypeJwt,
  checkAuth
}
