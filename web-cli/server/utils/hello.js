import * as jwt from 'jwt-simple'
import * as mongoose from 'mongoose'
import * as path from 'path';
import * as fs from 'fs';
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

/**
 * 检测路径是否存在，不存在则创建，支持递归创建
 * @param {String} dirname 目录路径
 * @return {Boolean} 创建结果
 * */

function mkdirsSync( dirname ) {
  if(fs.existsSync(dirname)) {
    return true
  }
  console.log(path.sep, dirname)
  dirname
    .split(path.sep)
    .reduce((currentPath, folder) => {
      currentPath += folder + path.sep
      console.log('currentPath', currentPath, fs.existsSync(currentPath))
      if(!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath)
      }
      return currentPath
    }, '') // 第二参数 设置初始值
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

function passValidAuth(ctx = {}) {
  const passPath = {
    get: [''],
    post: ['/api/login', '/api/user']
  }
  const getMethod = ctx.method.toLowerCase()
  if(!getMethod || !passPath[getMethod]) {
    return false
  }
  return passPath[getMethod].indexOf(ctx.url) > -1 ? true : false
}

async function checkAuth(ctx, next) {
  try{
    if(!passValidAuth(ctx)) {
      const getHelloToken = ctx.cookies.get('helloToken')
      if(!getHelloToken) {
        ctx.send(4, '', '请登录')
        return
      }
      const { clientUser } = decodeLoginTypeJwt(getHelloToken)
      if(!clientUser) {
        ctx.send(4, '', 'token无效请重新登录')
        return
      }
      const result = await userCtrl.userAuth(clientUser)
      if(!result) {
        ctx.send(4, result, `请重新登录`)
        return
      }
      ctx.state.curUser = result
      await next()
    } else {
      await next()
    }
  } catch(e) {
    ctx.send(2, '', dealError(e))
  }
}

function createObjectId () {
  return mongoose.Types.ObjectId()
}

function strToObjectId (str) {
  return mongoose.Types.ObjectId(str)
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
  strToObjectId,
  promiseToAwait,
  mkdirsSync
}
