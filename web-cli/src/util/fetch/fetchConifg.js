const HOST_CONFIG = {
  DEV: 'http://10.5.216.251:8088',
  PRO: 'http://dataview.myscrm.cn/api',
}

function ret(response) {
  return {
    retCode: 0,
    errMsg: '',
    data:{},
    ...response
  }
}

export {
  HOST_CONFIG,
  ret
}
