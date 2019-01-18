import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'

class BookCtl extends BaseCtl {
  constructor() {
    super()
  }
  getAlias() {
    return '本子'
  }
  getModel() {
    return bookModel
  }
  async todoPreAdd(arg){
    const res = { err: null, data: arg }
    const { name, userId } = arg
    const findBooks = await this.Model.findOne({ name, userId })
    if(findBooks) {
      res.err = new Error(`${name}已存在`)
      return res
    }
    return res
  }
}
const bookCtl = new BookCtl()

export default bookCtl
