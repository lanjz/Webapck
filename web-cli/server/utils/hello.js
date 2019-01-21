import * as jwt from 'jwt-simple'
import * as mongoose from 'mongoose'
import userCtrl from '../controller/User'

/**
 * @param { Error } e
 * @param { String } tart 出错的目标名称
 * @return { String } errMsg 返回错误提示信息
 * */

function dealError(e, tart) {
  console.log('dealError', e)
  let errMsg = e.message
  if(e.code === 11000) {
    errMsg = `${tart}已经存在`
  } else if(e.name === 'CastError'){
    errMsg = e.stringValue ? `${e.stringValue}不存在` : `${tart}不存在`
  }
  return errMsg
}

/**
 * @param { Object } params
 * @param { Object } model 根据mongoose.model过滤参数
 * @return { Object } filterData 返回过滤后的参数
 * */
function filterParams(params, model) {
  const deepCopyParams = JSON.parse(JSON.stringify(params))
  const errMsg = []
  const filterData = {}
  return new Promise((resolve) => {
    try{
      Object.keys(model).forEach((item) => {
        const { required, validate } = model[item]
        if(required && !deepCopyParams[item]) {
          errMsg.push(`${item}不能为空`)
        } else if(validate){
          const result = validate.validator(deepCopyParams[item])
          if(!result) {
            errMsg.push(`${item}格式不正确`)
            filterData[item] = params[item]
          } else {
            filterData[item] = result
          }
        } else {
          filterData[item] = params[item]
        }
      })
      if(errMsg.length) {
        resolve({ err: new Error(errMsg.join()), data: filterData })
      } else {
        resolve({ err: null, data: filterData })
      }
    } catch (e) {
      resolve({ err: e, data: filterData })
    }
  })
}

function errorHandle(ctx, next){
  return next().catch((err) => {
    console.log('errorHandle', err)
    if (err.status === 401) {
      ctx.status = 401
      ctx.send(2, `${err.originalError ? err.originalError.message : err.message}`)
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
  if(ctx.url!=='/api/login'&&ctx.url!=='/api/user'&&ctx.url.indexOf('/api') > -1) {
    const getHelloToken = ctx.cookies.get('helloToken') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRVc2VyIjoibGFubGFuMiIsImNsaWVudFBhc3MiOiJsYW5sYW4ifQ.e9ZdIOH-4Km2aiBt4CoVPcnpP9_AMQKfxCGca0odtic'
    if(!getHelloToken) {
      ctx.send(4, '', '请登录')
      return
    }
    const { clientUser, clientPass } = decodeLoginTypeJwt(getHelloToken)
    if(!clientUser || !clientPass) {
      ctx.send(2, '', 'token无效请重新登录')
      return
    }
    try{
      const result = await userCtrl.userAuth({ username: clientUser, password: clientPass })
      if(!result) {
        ctx.send(2, result, `${clientUser}无效请重新登录`)
        return
      }
      ctx.state.curUser = result
      await next()
    } catch(e) {
      ctx.send(2, '', dealError(e))
    }
  } else {
    await next()
  }
}

function createObjectId() {
  return mongoose.Types.ObjectId()
}

function promiseToAwait(fn) {
  const res = { err: null, data: '' }
  return new Promise((resolve, reject) => {
    fn
      .then(res => {
        res.data = res
        resolve(res)
      })
      .catch(err => {
        res.err = err
        resolve(res)
      })
  })
}


export default {
  dealError,
  filterParams,
  errorHandle,
  encodeLoginTypeJwt,
  decodeLoginTypeJwt,
  checkAuth,
  createObjectId,
  promiseToAwait
}
