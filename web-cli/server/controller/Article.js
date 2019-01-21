import BaseCtl from './BaseCtl'
import contentModel from '../model/Article'
import bookCtl from './Book'
import catalogCtl from './Catalog'
import schematasCtl from './SchematasCtl'
import validator from '../utils/validator'
import hello from "../utils/hello";

class ArticleCtl extends BaseCtl {
  constructor() {
    super()
    this.stringConValid = this.stringConValid.bind(this)
    this.dateConValid = this.dateConValid.bind(this)
    this.radioConValid = this.radioConValid.bind(this)
    this.selectConValid = this.selectConValid.bind(this)
    this.contentValidator = {
      input: this.stringConValid,
      date: this.dateConValid,
      textarea: this.stringConValid,
      markdown: this.stringConValid,
      radio: this.radioConValid,
      select: this.selectConValid
    }
    this.defaultSchema = {
      is_markdown: {
      
      }
    }
  }
  getAlias() {
    return '文章'
  }
  getModel() {
    return contentModel
  }
  stringConValid(con, schema) {
    return this.validType(con, schema, validator.isStringType)
  }
  dateConValid(con, schema) {
    return this.validType(con, schema, validator.isTypeNumber)
  }
  radioConValid(con, schema) {
    const res = { err: null, data: con }
    const { err } = this.validType(con, schema, validator.isStringType)
    if(err) {
      res.err = err
      return res
    }
    if(!schema.options && !schema.options.length) {
      res.err = `未找到${schema.name}的options选项`
      return res
    }
    if(con) {
      const itemRes = schema.options.some(inItem => (inItem.id === con))
      if (!itemRes) {
        res.err = new Error(`${schema.name}的options${JSON.stringify(schema.options)}没找到${con}`)
        return res
      }
    }
 
    return res
  }
  selectConValid(con = [], schema) {
    const res = { err: null, data: con }
    const { err } = this.validType(con, schema, validator.isArrayType)
    if(err) {
      res.err = err
      return res
    }
    if(!schema.options && !schema.options.length) {
      res.err = `未找到${schema.name}的options选项`
      return res
    }
    const isArrayValid = validator.isArrayType(con)
    if(!isArrayValid.err) {
      res.err = `${schema.name}${isArrayValid.err}`
      return res
    }
    if(con && con.length) {
      con.every((item) => {
        const itemRes = schema.options.some(inItem => (inItem.id === item))
        if (itemRes) {
          return true
        }
        const options = {
          options: schema.options
        }
        res.err = new Error(`${schema.name}的options${JSON.stringify(options)}没找到${item}`)
        return false
      })
    }
    if(res.err){
      return res
    }
    return res
  }
  validType(con, schema, validFn) {
    const res = { err: null, data: con }
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
  content(con, schemata = []) {
    const obj = {}
    const res = { err: null, data: con }
    schemata.every((item) => {
      if(con[item._id]) {
        const tempFn = this.contentValidator[item.type]
        const { err, data } = tempFn(con[item._id], item)
        if(err) {
          res.err = err
          return false
        }
        obj[item._id] = data
      }
      return true
    })
    res.data = obj
    return res
  }
  async filterCon(con, getSchemata) {
    let filterData = con
    return new Promise(async (resolve) => {
      try{
        filterData = await this.content(con, getSchemata)
        resolve({ err: filterData.err, data: filterData.data })
      } catch (e) {
        resolve({ err: e, data: filterData })
      }
    })
  }
  async todoPreModify(arg, ctx) {
    return this.todoPreAdd(arg, ctx)
  }
  async todoPreAdd(arg, ctx){
    const res = { err: null, data: '' }
    const getParams = JSON.parse(JSON.stringify(arg))
    const { bookId, catalogId, schemaId } = getParams
    if(!bookId) {
      res.err = new Error('bookId不能为空')
      return res
    }
    if(!catalogId) {
      res.err = new Error('catalogId不能为空')
      return res
    }
    if(!schemaId) {
      res.err = new Error('schemaId不能为空')
      return res
    }
    // 查看Book
    const findBook = bookCtl.Model.findById(bookId, this.dbQuery(ctx))
    // 查找catalog
    const findCatalogParams = { bookId, _id: catalogId, ...this.dbQuery(ctx) }
    const findCatalog = catalogCtl.Model.findOne(findCatalogParams)
    // 查看schema
    const isDefaultSchema = schemaId.indexOf('is_') && this.defaultSchema
    const findSchema = isDefaultSchema ?
      Promise.resolve(true) :
      schematasCtl.Model.findById(schemaId, this.dbQuery(ctx))
    const response = await Promise.all([findBook, findCatalog, findSchema])
    if(!response[0]) {
      res.err = new Error('未找到对应的Book')
    } else if(!response[1]) {
      res.err = new Error(`${response[0].name}下未找到对应的目录`)
    } else if(!response[2]) {
      res.err = new Error('未找到对应的Schema')
    }
    if(res.err) {
      return res
    }
  
    if(!getParams.name) {
      res.err = new Error('name不能为空')
      return res
    }
    if(!getParams.content) {
      getParams.content = {}
    }
    const isObj = validator.isObjectType(getParams.content)
    if(isObj.err) {
      res.err = isObj.err
      return res
    }
    const con = JSON.parse(JSON.stringify(getParams.content))
    const getSchemata = response[2].fields
    const { err, data } = await this.filterCon(con, getSchemata)
    if(err) {
      res.err = err
      return res
    }
    getParams.content = data
    res.data = getParams
    return res
  }
  async findById(ctx, next) {
    const { id } = ctx.params
    if(!id) {
      ctx.send(2, '', 'id不能为空')
      return
    }
    try{
      const dbQuery = this.dbQuery(ctx)
      const result = await this.Model.findByIdLean(id, dbQuery)
      if(result.schemaId) {
        const findSchema = await schematasCtl.Model.findById(result.schemaId, this.dbQuery(ctx))
        result.schema = findSchema
      }
      ctx.send(1, result, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, id))
    } finally {
      await next()
    }
  }
}
const articleCtl = new ArticleCtl()

export default articleCtl
