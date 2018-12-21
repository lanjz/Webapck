import valid from '../utils/validator'

function numBoolean(val) {
  const result = valid.numBoolean(val)
  return result ? val : false
}
function email(val) {
  const result = valid.email(val)
  return result ? val : false
}
function password(val) {
  return val
}

function sex(val) {
  const result = (val > 0 && val < 4)
  return result ? val : false
}

/**
 * 验证Users.schema
 * 返回字段中通用的属性{id, name, default, remark}
 * @param <Object> val
 * @return <Object>
 * */
function username(val) {
  return val
}
/**
 * 验证Books.schema
 * 返回字段中通用的属性{id, name, default, remark}
 * @param <Object> val
 * @return <Object>
 * */

function validCommonSchema(val) {
  let err = ''
  if(!valid.isNoTrim(val.type)) {
    err = 'type必填'
  } else if(!valid.isNoTrim(val.name) || val.name.length > 10) {
    err = 'name必填且不超过10个字符'
  } else if(val.remark && val.remark.length > 10) {
    err = 'remark不超过10个字符'
  }
  return {
    err,
    data: {
      remark: (val.remark && val.remark.trim()) || '',
      name: (val.name && val.name.trim()) || '',
      type: val.type,
      default: val.default
    }
  }
}

/**
 * 验证Books.schema.type.input字段
 * @param <Object> val
 * @return <Object>
 * */
function inputValid(val = {}) {
  const { err = '', data = '' } = validCommonSchema(val)
  return {
    err,
    data
  }
}

function isValidIdName(arr) {
  const newArr = []
  let err = ''
  arr.some((item) => {
    if(!item.id) {
      err = 'options中id属性不能为空'
      return true
    } else if(!(valid.isw(item.id) && item.id.length < 15)) {
      err = 'id只能由字母数字下划线组成，且长度小于15位'
      return true
    }
    if(!item.name) {
      err = 'options中name属性不能为空'
      return true
    } else if(!(item.name && item.name.length < 10)) {
      err = 'name只能由字母数字下划线组成，且长度小于10位'
      return true
    }
    newArr.push({ id: item.id, name: item.name })
    return false
  })
  return { err, data: newArr }
}
/**
 * 验证Books.schema.type.radio字段
 * @param <Object> val
 * @return <Object>
 * */
function radioValid(val = {}) {
  let { err = '' } = validCommonSchema(val)
  const { data } = validCommonSchema(val)
  if(err) {
    return { err, data }
  }
  const isValid = Object.prototype.toString.call(val.options) === '[object Array]'
  if(!isValid || !val.options.length) {
    return { err: 'options必需且至少有一个选项' }
  }
  const validOptions = isValidIdName(val.options)
  if (validOptions.err) {
    return { err: validOptions.err }
  }
  val.options = validOptions.data
  err = valid.isUniqueInArr(val.options, 'id') || valid.isUniqueInArr(val.options, 'name') || ''
  if(!err && data.default) {
    const isValidDefault = val.options.find(item => (item.id === data.default))
    if(!isValidDefault) {
      err = 'default的值不在options中'
    }
  }
  return {
    err,
    data: {
      ...data,
      options: val.options,
    }
  }
}
/**
 * 验证Books.schema.type.select字段
 * @param <Object> val
 * @return <Object>
 * */
function selectValid(val = {}) {
  let { err = '' } = validCommonSchema(val)
  const { data } = validCommonSchema(val)
  if(err) {
    return { err, data }
  }
  const isValid = Object.prototype.toString.call(val.options) === '[object Array]'
  if(!isValid || !val.options.length) {
    return { err: 'options必需是数组且至少有一个选项' }
  }
  const validOptions = isValidIdName(val.options)
  if (validOptions.err) {
    return { err: validOptions.err }
  }
  val.options = validOptions.data
  err = valid.isUniqueInArr(val.options, 'id') || valid.isUniqueInArr(val.options, 'name') || ''
  if(!err && val.default) {
    const isValidDefault = Object.prototype.toString.call(val.default) === '[object Array]'
    if(!isValidDefault) {
      err = 'default必需是数组'
    }
    for(let i = 0; i < val.default.length; i++) {
      const isValidDefault = val.options.find(item => (item.id === val.default[i]))
      if(!isValidDefault) {
        err = 'default的值不在options中'
        break
      }
    }
  }
  return {
    err,
    data: {
      ...data,
      options: val.options,
    }
  }
}
/**
 * 验证Books.schema.type.date字段
 * @param <Object> val
 * @return <Object>
 * */
function dateValid(val = {}) {
  let { err = '' } = validCommonSchema(val)
  const { data } = validCommonSchema(val)
  if(!err && val.default && !valid.isNumber(val.default)) {
    err = 'date的default的值应该为时间戳'
  }
  return { err, data }
}

const schemaTypeValidator = {
  input: inputValid,
  textarea: inputValid,
  radio: radioValid,
  select: selectValid,
  date: dateValid
}
/**
 * 验证Books.schema字段
 * @param <Object> val
 * @return <Object>
 * */
function validBookSchemas(val) {
  const res = { err: '', result: {} }
  if(!val) return res
  const isValid = Object.prototype.toString.call(val) === '[object Object]'
  if(!isValid) {
    res.err = 'schemas的类型应为Object'
    return res
  }
  const getKeys = Object.keys(val)
  if(!getKeys.length) return res
  for(let i = 0; i < getKeys.length; i++) {
    const keysValue = getKeys[i]
    const cur = val[keysValue]
    if(!valid.isNoTrim(cur.type)) {
      res.err = 'type不能为空'
      break
    }
    const isValidSchema = schemaTypeValidator[cur.type]
    // 如果上传了多余的字段类型，直接pass
    if(!isValidSchema) {
      continue
    }
    const { err, data = '' } = isValidSchema(cur)
    if(err) {
      res.err = err
      break
    }
    res.result[keysValue] = data
  }
  return res
}
/**
 * 验证Books.schema字段
 * @param <Object> val
 * @return <Object>
 * */
function bookSchema(schema) {
  const { err, result } = validBookSchemas(schema)
  if(err) {
    throw new Error(err)
  } else {
    return result
  }
}

export default {
  numBoolean,
  password,
  username,
  sex,
  email,
  bookSchema,
}
