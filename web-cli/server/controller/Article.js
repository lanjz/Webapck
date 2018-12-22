import BaseCtl from './BaseCtl'
import contentModel from '../model/Article'
import hello from '../utils/hello'
import bookCtl from './Book'
import catalogCtl from './Catalog'

class ArticleCtl extends BaseCtl {
  getAlias() {
    return '文章'
  }
  getModel() {
    return contentModel
  }
  async add(ctx, next) {
    const getParams = { ...ctx.request.body, ...this.dbQuery(ctx) }
    try{
      const { bookId, catalogId } = getParams
      if(!bookId) {
        ctx.send(2, '', 'bookId不能为空')
        return
      }
      if(!catalogId) {
        ctx.send(2, '', 'catalogId不能为空')
        return
      }
      const findBook = await bookCtl.Model.findById(bookId, this.dbQuery(ctx))
      if(!findBook) {
        ctx.send(2, '', '未找到对应的Book')
        return
      }
      const findCatalog = await catalogCtl.Model.findById(catalogId, this.dbQuery(ctx))
      if(!findCatalog) {
        ctx.send(2, '', '未找到对应的Book')
        return
      }
      if(!getParams.content) {
        ctx.send(2, '', 'content不能为空')
        return
      }
      getParams.content.schemata = findBook.schemata
      const { errMsg, filterData } = await hello.filterParams(getParams, this.Model.getSchema())
      if(errMsg) {
        ctx.send(2, ctx.request.body, errMsg)
      } else {
        const result = await this.Model.save(filterData)
        ctx.send(1, { id: result._id }, '')
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
}
const articleCtl = new ArticleCtl()

export default articleCtl
