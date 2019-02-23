import valid from '../utils/validator'

function numBoolean(val) {
  const result = valid.numBoolean(val)
  return result ? true : false
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

export default {
  numBoolean,
  password,
  username,
  sex,
  email,
}
