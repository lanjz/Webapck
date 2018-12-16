import BaseCtl from './BaseCtl'
import Catalog from '../model/Catalog'
import hello from '../utils/hello'
import bookCtl from './Book'

class CatalogCtl extends BaseCtl {
  getAlias() {
    return '目录'
  }
  getModel() {
    return new Catalog()
  }
  async beforeAdd(ctx) {
    const getParams = { ...ctx.request.body, ...this.dbQuery(ctx) }
    const { bookId, parentId, name } = getParams
    const { _id } = ctx.state.curUser
    return new Promise(async (resolve, reject) => {
      try{
        const findBook = bookCtl.findOneByQuery({ _id: bookId, userId: _id }) // 查询是否在本子
        const findParentCatalog = parentId === 'root' ? // 查询是否存在父级目录
          Promise.resolve('root') :
          this.findOneByQuery({ _id: parentId, userId: _id })
        // 查询当前目录下是否已经存要添加的目录
        const findCatalog = this.findOneByQuery({ name, userId: _id, parentId })
        const result = await Promise.all([findBook, findParentCatalog, findCatalog])
        if(!result[0]){
          resolve({ err: `不存在id为${bookId}的本子` })
          return
        }
        if(!result[1]){
          resolve({ err: `不存在parentId为${bookId}的目录` })
          return
        }
        if(result[2]){
          resolve({ err: `当前目录已经存在'${name}'` })
          return
        }
        resolve({ err: '', result })
      } catch (e) {
        reject(e)
      }
    })
  }
  async add(ctx, next) {
    const getParams = { ...ctx.request.body, ...this.dbQuery(ctx) }
    try{
      const { err, result } = await this.beforeAdd(ctx)
      if(err) {
        ctx.send(2, '', err)
        return
      }
      const parentCatalog = result[1]
      const { errMsg, filterData } = hello.filterParams(getParams, this.Model.getSchema())
      if(errMsg) {
        ctx.send(2, ctx.request.body, errMsg)
      } else {
        let updateParentCatalog = Promise.resolve(parentCatalog)
        if(parentCatalog !== 'root' && !parentCatalog.hasChild){
          updateParentCatalog = this.Model
            .findOneAndUpdate(parentCatalog._id, { hasChild: 1 }, this.dbQuery(ctx))
        }
        const saveCatalog = this.Model.save(filterData)
        await Promise.all([saveCatalog, updateParentCatalog])
        ctx.send(1, { id: result[0]._id }, '')
      }
    } catch (e) {
      ctx.send(2, e, hello.dealError(e))
    }finally {
      await next()
    }
  }
  async find(ctx, next) {
    const { parentId, bookId } = ctx.request.query
    const dbQuery = this.dbQuery(ctx)
    try{
      const result = await this.Model.list({ parentId, bookId, ...dbQuery })
      ctx.send(1, result, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    }finally {
      await next()
    }
  }
}

const catalogCtl = new CatalogCtl()
export default catalogCtl
