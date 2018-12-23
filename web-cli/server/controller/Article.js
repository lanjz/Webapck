import BaseCtl from './BaseCtl'
import contentModel from '../model/Article'
import modelValidtor from '../model/validator'
import hello from '../utils/hello'
import bookCtl from './Book'
import catalogCtl from './Catalog'
import validator from '../utils/validator'

class ArticleCtl extends BaseCtl {
  constructor() {
    super()
    this.contentValidator = {
      input: inputConValid,
      textarea: textConValid,
      radio: radioConValid,
      select: selectConValid,
      date: dateConValid
    }
  }
  getAlias() {
    return '文章'
  }
  getModel() {
    return contentModel
  }
  selectConValid(con, schema) {
    const res = { err: null, data: con }
    const { err } = this.validType(con, schema, validator.isArrayType)
    if(err) {
      res.err = err
      return res
    }
    if(!con.length) {
      res.err = new RangeError(`${schema.name}为空数组`)
      return res
    }
    if(schema.required && (!con || !con.length)){
      res.err = `${schema.name}必填`
      return res
    }
    if(!schema.options && !schema.options.length) {
      res.err = `未找到${schema.name}的options选项`
      return res
    }
    const isValid = Object.prototype.toString.call(con) === '[object Array]'
    if(!isValid) {
      res.err = `${schema.name}的类型应为Array`
      return res
    }
    con.every((item) => {
      const itemRes = schema.options.some(inItem => (inItem.id === item))
      if (itemRes) {
        return true
      }
      const options = {
        options: schema.options
      }
      res.err = `${schema.name}的options${JSON.stringify(options)}没找到${item}`
      return false
    })
    if(res.err){
      return res
    }
    return res
  }
  validType(con, schema, validFn) {
    const res = { err: null, data: con }
    if(schema.required && !con){
      res.err = new RangeError(`${schema.name}必填`)
      return res
    }
    const { err, data } = validFn(con)
    if (err) {
      res.err = err
      return res
    }
    res.data = data
    return res
  }
  /**
   * 根据Book的schemata来验证con的内容是否正确
   * @param <Object> con
   * @return <Object> {err, obj}
   * */
  content(con, schemata = {}) {
    console.log('con', JSON.stringify(con))
    const schemaKeys = Object.keys(schemata)
    const obj = {}
    schemaKeys.every((item) => {
      if(con[item]) {
        const { err, data } = contentValidator[schemata[item].type](con[item], schemata[item])
        if(err) {
          throw new Error(err)
        }
        obj[item] = data
      }
      return true
    })
    return obj
  }
  async filterCon(con, getSchemata) {
    let filterData = ''
    return new Promise(async(resolve) => {
      try{
        filterData = await modelValidtor.content(con, getSchemata)
        resolve({ err: '', data: filterData })
      } catch (e) {
        resolve({ err: e.message, data: filterData })
      }
    })
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
      const findCatalogParams = {
        bookId,
        _id: catalogId,
        ...this.dbQuery(ctx)
      }
      const findCatalog = await catalogCtl.Model.findOne(findCatalogParams)
      if(!findCatalog) {
        ctx.send(2, '', '未找到对应的目录')
        return
      }
      const getSchemata = findBook.schemata || {}
      if(!(Object.keys(getSchemata).length)) {
        ctx.send(2, ctx.request.body, '该Book没有schemata')
        return
      }
      if(!getParams.content) {
        ctx.send(2, '', 'content不能为空')
        return
      }
      const con = JSON.parse(JSON.stringify(getParams.content))
      const { err, data } = await this.filterCon(con, getSchemata)
      if(err) {
        ctx.send(2, ctx.request.body, err)
        return
      }
      getParams.content = data
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
