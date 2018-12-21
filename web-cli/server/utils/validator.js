function isNoTrim(val) {
  return val&&val.trim()
}
function isw(val) {
  const reg = (/\W/g).test(val)
  return !reg
}
function isNumber(val) {
  const reg = (/\D/g).test(val)
  return !reg
}
function numBoolean(val) {
  return (val * 1 === 1 || val * 1 === 0)
}

function email(val) {
  return val
}

/**
 * 判断name的值在arr中是否唯一
 * @param <Array> arr
 * @param <String> arr
 * @return <String> err
 * */
function isUniqueInArr(arr, name) {
  const isValid = Object.prototype.toString.call(arr) === '[object Array]'
  let err = ''
  if(!isValid || !arr.length) {
    err = 'options必需是数组且至少有一个选项'
  }
  const map = new Map()
  for(let i = 0; i < arr.length; i++) {
    if(map.get(arr[i][name])) {
      err = 'id或name不唯一'
      break
    } else {
      map.set(arr[i][name], true)
    }
  }
  return err
}


export default {
  isUniqueInArr,
  email,
  numBoolean,
  isNoTrim,
  isw,
  isNumber
}
