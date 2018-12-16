/**
 * 格式校验
 * @param {val} String || Object
 * @return Bool
 * */

function numBoolean(val) {
  return (val * 1 === 1 || val * 1 === 0)
}
function password(val) {
  return val
}

function username(val) {
  return val
}
function email(val) {
  return val
}
function sex(val) {
  return val
}
function isPrivate(val) {
  return numBoolean(val)
}
export default {
  password,
  username,
  email,
  sex,
  isPrivate
}
