import db from '../db'

async function add(userInfo) {
  return await db.insertOne('user', userInfo)
}

export default {
  add
}
