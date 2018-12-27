import BaseCtl from './BaseCtl'
import contentModel from '../model/Article'
import bookCtl from './Book'
import catalogCtl from './Catalog'
import validator from '../utils/validator'

class ArticleCtl extends BaseCtl {
  constructor() {
    super()
    this.stringConValid = this.stringConValid.bind(this)
    this.textConValid = this.stringConValid.bind(this)
    this.dateConValid = this.dateConValid.bind(this)
    this.radioConValid = this.radioConValid.bind(this)
    this.selectConValid = this.selectConValid.bind(this)
    this.contentValidator = {
      input: this.stringConValid,
      date: this.dateConValid,
      textarea: this.stringConValid,
      radio: this.radioConValid,
      select: this.selectConValid
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
    if(schema.required && !con){
      res.err = `${schema.name}不能为空`
      return res
    }
    if(!schema.options && !schema.options.length) {
      res.err = `未找到${schema.name}的options选项`
      return res
    }
    const itemRes = schema.options.some(inItem => (inItem.id === con))
    if (!itemRes) {
      res.err = new Error(`${schema.name}的options${JSON.stringify(schema.options)}没找到${con}`)
      return res
    }
    return res
  }
  selectConValid(con, schema) {
    const res = { err: null, data: con }
    console.log('this', this)
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
      res.err = new Error(`${schema.name}的options${JSON.stringify(options)}没找到${item}`)
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
    const schemaKeys = Object.keys(schemata)
    const obj = {}
    const res = { err: null, data: '' }
    schemaKeys.every((item) => {
      if(con[item]) {
        const tempFn = this.contentValidator[schemata[item].type]
        const { err, data } = tempFn(con[item], schemata[item])
        if(err) {
          res.err = err
          return false
        }
        obj[item] = data
      }
      return true
    })
    res.data = obj
    return res
  }
  async filterCon(con, getSchemata) {
    let filterData = ''
    return new Promise(async (resolve) => {
      try{
        filterData = await this.content(con, getSchemata)
        resolve({ err: filterData.err, data: filterData.data })
      } catch (e) {
        resolve({ err: e, data: filterData })
      }
    })
  }
  async filterParams(arg, ctx){
    const res = { err: null, data: '' }
    const getParams = JSON.parse(JSON.stringify(arg))
    const { bookId, catalogId } = getParams
    if(!bookId) {
      res.err = new Error('bookId不能为空')
      return res
    }
    if(!catalogId) {
      res.err = new Error('catalogId不能为空')
      return res
    }
    const findBook = await bookCtl.Model.findById(bookId, this.dbQuery(ctx))
    if(!findBook) {
      res.err = new Error('未找到对应的Book')
      return res
    }
    const findCatalogParams = { bookId, _id: catalogId, ...this.dbQuery(ctx) }
    const findCatalog = await catalogCtl.Model.findOne(findCatalogParams)
    if(!findCatalog) {
      res.err = new Error('未找到对应的目录')
      return res
    }
    const getSchemata = findBook.schemata || {}
    if(!(Object.keys(getSchemata).length)) {
      res.err = new Error('该Book没有schemata')
      return res
    }
    if(!getParams.content) {
      res.err = new Error('content不能为空')
      return res
    }
    const isObj = validator.isObjectType(getParams.content)
    if(isObj.err) {
      res.err = isObj.err
      return res
    }
    const con = JSON.parse(JSON.stringify(getParams.content))
    const { err, data } = await this.filterCon(con, getSchemata)
    if(err) {
      res.err = err
      return res
    }
    getParams.content = data
    res.data = getParams
    return res
  }
}
const articleCtl = new ArticleCtl()

export default articleCtl
