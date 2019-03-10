function timestampToTime(stamps, format) {
  if(!stamps){
    return ''
  }
  let fmt=format?format:"YYYY-MM-DD hh:mm:ss"
//                var getDate=stamps==''||!stamps?new Date():new Date(stamps)
  const getDate=new Date(stamps * 1);
  const o = {
    "M+": getDate.getMonth() + 1, //月份
    "D+": getDate.getDate(), //日
    "h+": getDate.getHours(), //小时
    "m+": getDate.getMinutes(), //分
    "s+": getDate.getSeconds(), //秒
    "q+": Math.floor((getDate.getMonth() + 3) / 3), //季度
    "S": getDate.getMilliseconds() //毫秒
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default {
  install(Vue, options) {
    Vue.filter('timestampToTime', function (stamps, format) {
      return timestampToTime(stamps, format)
    })
    Vue.filter('timestampToBriefTime', function (stamps, format) {
      const getDate =  timestampToTime(stamps, 'YYYY.MM.DD')
      return getDate ? getDate.substring(2) : ''
    })
  }
}
