import * as crypto from 'crypto'

const SALT = 'haha'
function createHash(test) {
  const md5 = crypto.createHash('md5')
  md5.update('123')
  let result = md5.digest('hex')
  const md52 = crypto.createHash('md5')
  md52.update(result)
  md52.update(SALT)
  result = md52.digest('hex')
  return result
}

export default {
  createHash
}
