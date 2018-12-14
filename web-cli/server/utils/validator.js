/**
 * 格式校验
 * @param {val} String || Object
 * @return Bool
 * */

function numBoolean(val) {
  return (val === 1 || val ===0)
}
function passWord(val) {
  return val
}

function userName(val) {
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
  passWord,
  userName,
  email,
  sex
}
