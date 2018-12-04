import axios from 'axios'
import { HOST_CONFIG as hostConfig, ret} from './fetchConifg'

// 模拟环境变量
const process = {}

function fetchData(options) {
  let { url } = options
  if (!url) {
    return ret({
      retCode: -1,
      errMsg: '没有请求地址'
    })
  }
  if (process.Mock) {
    url = `https://apicloud.myscrm.cn/mock/5a9ccd2b625e005f6cd56dfc${url}`
  } else {
    const env = process.DEV
    url = `${hostConfig[env]}${url}`
  }
  options.url = url
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  if (options.method.toLowerCase() === 'post') {
    options.headers = { 'Content-Type': 'multipart/form-data' }
    const formData = new FormData();
    const forDataKeys = Object.keys(options.data)
    forDataKeys.forEach((value) => {
      formData.append(value, options.data[value]);
    })
    options.data = formData
  }
  return axios(options)
}

const doFetchData = function (options) {
  return fetchData(options)
    .then((res) => {
      if (res.data.status === '-1000102') {
        login()
      }
      if (res.data.status === '-1000104') {
        alert('您无权限访问')
        throw new Error('您无权限访问')
      }
      if (res.data.status === '-1000105') {
        alert('非法登录')
        throw new Error('非法登录')
      }
      return res.data
    })
    .catch((err) => {
      alert(`访问接口：${options.url}出现错误：${err}`)
      throw new Error(err)
    })
}


export default {
  doFetchData
}

