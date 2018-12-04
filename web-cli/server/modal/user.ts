import db from '../db'

async function add(userInfo) {
  const result = db.insert('user', userInfo)
  return result
}

export default {
  add
}
