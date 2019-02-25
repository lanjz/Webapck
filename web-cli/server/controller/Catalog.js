import BaseCtl from './BaseCtl'
import Catalog from '../model/Catalog'
import hello from '../utils/hello'
import bookCtl from './Book'

class CatalogCtl extends BaseCtl {
  constructor() {
    super()
    this.findAllCatalog = []
  }
  getAlias() {
    return '目录'
  }
  getModel() {
    return new Catalog()
  }
  async todoPreModify(arg, ctx) {
    return new Promise(async (resolve) => {
      try{
        const getParams = JSON.parse(JSON.stringify(arg))
        const { bookId, parentId, name } = getParams
        const { userId } = arg
        if(!name) {
          return Promise.resolve({ err: new Error('name不能为空') })
        }
        let promiseArr = []
        // 查询当前目录下是否已经存要添加的目录
        const findCatalog = this.findOneByQuery({ name, userId, parentId })
        promiseArr.push(findCatalog)
        if(bookId) {
          const findBook = bookId === bookCtl.defaultBook._id ?
            Promise.resolve(true) :
            bookCtl.findOneByQuery({ _id: bookId, userId }) // 查询是否存在本子
          promiseArr.push(findBook)
        }
        if(parentId) {
          const findParentCatalog = parentId === 'root' ? // 查询是否存在父级目录
            Promise.resolve('root') :
            this.findOneByQuery({ _id: parentId, userId })
          promiseArr.push(findParentCatalog)
        }
        
        const result = await Promise.all(promiseArr)
        if(result[0]){
          resolve({ err: new Error(`当前目录已经存在'${name}'`) })
          return
        }
        if(bookId&&!result[1]){
          resolve({ err: new Error(`不存在id为${bookId}的本子`) })
          return
        }
        if(parentId&&!result[2]){
          resolve({ err: new Error(`不存在parentId为${parentId}的目录`) })
          return
        }
        resolve({ err: null, data: getParams })
      } catch (e) {
        resolve({ err: e, data: '' })
      }
    })
  }
  async todoPreAdd(arg, ctx) {
    const getParams = JSON.parse(JSON.stringify(arg))
    const { bookId, parentId, name } = getParams
    if(!bookId) {
      return Promise.resolve({ err: new Error('bookId不能为空') })
    }
    if(!parentId) {
      return Promise.resolve({ err: new Error('parentId不能为空') })
    }
    if(!name) {
      return Promise.resolve({ err: new Error('name不能为空') })
    }
    const { userId } = arg
    return new Promise(async (resolve) => {
      try{
        const findBook = bookId === bookCtl.defaultBook._id ?
          Promise.resolve(true) :
          bookCtl.findOneByQuery({ _id: bookId, userId }) // 查询是否存在本子
        const findParentCatalog = parentId === 'root' ? // 查询是否存在父级目录
          Promise.resolve('root') :
          this.findOneByQuery({ _id: parentId, userId })
        // 查询当前目录下是否已经存要添加的目录
        const findCatalog = this.findOneByQuery({ name, userId, parentId })
        const result = await Promise.all([findBook, findParentCatalog, findCatalog])
        if(!result[0]){
          resolve({ err: new Error(`不存在id为${bookId}的本子`) })
          return
        }
        if(!result[1]){
          resolve({ err: new Error(`不存在parentId为${parentId}的目录`) })
          return
        }
        if(result[2]){
          resolve({ err: new Error(`当前目录已经存在'${name}'`) })
          return
        }
        resolve({ err: null, data: getParams })
      } catch (e) {
        resolve({ err: e, data: '' })
      }
    })
  }
  async isHasChild(parentId, bookId, dbQuery, index) {
    const res = { }
    const result = await this.Model.list({ parentId, bookId, ...dbQuery })
    res.index = index
    res.result = result
    return res
  }
  async find(ctx, next) {
    const { parentId, bookId } = ctx.request.query
    const dbQuery = this.dbQuery(ctx)
    try{
      const result = await this.Model.listLean({ parentId, bookId, ...dbQuery })
      const findHasChild = []
      result.forEach((item, index) => {
        findHasChild.push(this.isHasChild(item._id, bookId, dbQuery, index))
      })
      await Promise.all(findHasChild)
        .then(res => {
          result.forEach((item, index) => {
            const { result: hasC } = res[index]
            result[index]['hasChild'] = hasC && hasC.length ? 1 : 0
          })
          ctx.send(1, result, '')
        })
        .catch(err => {
          throw err
        })
    } catch (e) {
      ctx.send(2, '', hello.dealError(e))
    }finally {
      await next()
    }
  }
  /**
   * 根据ID查找所有有关联的类别
   * @Params {String} id
   * @Return {Promise}
  * */
  async findAllCatalogs(ctx, next, id) {
    return new Promise(async (resolve) => {
      const dbQuery = this.dbQuery(ctx)
      const result = await this.Model.list({ parentId: id, ...dbQuery })
      const promiseList = []
      if(result&&result.length) {
        result.forEach((item, index) => {
          this.findAllCatalog.push(item._id)
          promiseList.push(this.findAllCatalogs(ctx, next, item._id))
        })
        await Promise.all(promiseList)
        resolve(resolve)
      } else {
        resolve(true)
      }
    })
  }
  async deleteById(ctx, next) {
    const { id } = ctx.request.body
    const dbQuery = this.dbQuery(ctx)
    if(!id) {
      ctx.send(2, '', 'id不能为空')
      return
    }
    try{
      this.findAllCatalog = []
      this.findAllCatalog.push()
      await this.findAllCatalogs(ctx, next, id)
      const result = await this.Model.delMany(this.findAllCatalog, dbQuery)
      if(result.n){
        ctx.send(1, result, this.findAllCatalog.join()+'已经删除')
      } else {
        ctx.send(2, '', `没有要删除的${this.alias}`)
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    }finally {
      this.findAllCatalog = []
      await next()
    }
  }
}

const catalogCtl = new CatalogCtl()
export default catalogCtl
