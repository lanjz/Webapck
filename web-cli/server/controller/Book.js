import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'
import hello from "../utils/hello";

class BookCtl extends BaseCtl {
  constructor() {
    super()
    this.defaultBook = {
      _id: 'default',
      name: '默认',
      isPrivate: 0
    }
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
    if(name === this.defaultBook.name || name === this.defaultBook._id) {
      res.err = new Error(`${name}不可使用`)
      return res
    }
    const findBooks = await this.Model.findOne({ name, userId })
    if(findBooks) {
      res.err = new Error(`${name}已存在`)
      return res
    }
    return res
  }
  async find(ctx, next) {
    const { start = 0, limit = 0 } = ctx.request.query
    const dbQuery = this.dbQuery(ctx)
    // 如果没有提供start和limit则查找全部
    const findFn = this.Model.listWithPaging(start, limit, dbQuery)
    try{
      const result = await Promise.all([findFn, this.Model.listCount(dbQuery)])
      let bookList = result[0] || []
      console.log('bookList', bookList)
      bookList.unshift(this.defaultBook)
      ctx.send(1, {
        data: bookList,
        count: result[1] + 1
      }, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    }finally {
      await next()
    }
  }
}
const bookCtl = new BookCtl()

export default bookCtl
