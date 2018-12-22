import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'
import hello from '../utils/hello';

class BookCtl extends BaseCtl {
  getAlias() {
    return '本子'
  }
  getModel() {
    return bookModel
  }
  async add(ctx, next) {
    const getParams = { ...ctx.request.body, ...this.dbQuery(ctx) }
    try{
      const { errMsg, filterData } = await hello.filterParams(getParams, this.Model.getSchema())
      console.log('filterData', JSON.stringify(filterData))
      if(errMsg) {
        ctx.send(2, ctx.request.body, errMsg)
      } else {
        const { name, userId } = getParams
        const findBooks = await this.Model.findOne({ name, userId })
        if(findBooks) {
          ctx.send(2, '', `${name}已存在`)
        } else {
          const result = await this.Model.save(filterData)
          ctx.send(1, { id: result._id }, '')
        }

      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
}
const bookCtl = new BookCtl()

export default bookCtl
