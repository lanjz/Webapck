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
    this.addContent = this.addContent.bind(this)
    this.addContentBefore = this.addContentBefore.bind(this)
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
    const findBook = bookId === bookCtl.defaultBook._id ?
      bookCtl.defaultBook :
      bookCtl.Model.findById(bookId, this.dbQuery(ctx))
    // 查找catalog
    const findCatalogParams = { bookId, _id: catalogId, ...this.dbQuery(ctx) }
    const findCatalog = catalogCtl.Model.findOne(findCatalogParams)
    // 查看schema
    const findBuiltInSchema = schematasCtl.buitInSchema.find(item => item._id === schemaId)
    const findSchema = findBuiltInSchema ?
      Promise.resolve(findBuiltInSchema) :
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
  async add(ctx, next) {
    try{
      const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
      const { err, data: getParams } = await this.todoPreAdd(merge, ctx)
      if(err) {
        ctx.send(2, ctx.request.body, err.message)
        return
      }
      const helloRes = await hello.filterParams(getParams, {
        ...this.Model.getSchema(),
        content: {}
      })
      if(helloRes.err) {
        ctx.send(2, ctx.request.body, helloRes.err.message)
      } else {
        if(helloRes.data.content) {
          helloRes.data.content._id = hello.createObjectId()
          helloRes.data.content.createTime = (new Date()).getTime()
          helloRes.data.content.updateTime = (new Date()).getTime()
        }
        helloRes.data.contents = helloRes.data.content ? [helloRes.data.content] : []
        const result = await this.Model.save(helloRes.data)
        // const infoResult = await this.Model.findById(result._id)
        // ctx.send(1, infoResult, '')
        // ctx.send(1, { id: result._id }, '')
        await this.doAfterAdd(ctx, next, result)
      }
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
  async addContentBefore(ctx) {
    const res = { err: null, data: '' }
    const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
    const isObj = validator.isObjectType(merge.content)
    if(isObj.err) {
      res.err = isObj.err
      return res
    }
    if(!Object.keys(merge.content).length){
      res.err = new Error('content无内容')
      return res
    }
    if(!merge._id) {
      res.err = new Error('缺少_id(article)')
      return res
    }
    const findArticle = await this.Model.findById(merge._id)
    if(!findArticle) {
      res.err = new Error(`${merge._id}不存在`)
      return res
    }
    const findBuiltInSchema = schematasCtl.buitInSchema
      .find(item => item._id === findArticle.schemaId)
    const findSchema = findBuiltInSchema ? findBuiltInSchema :
      await schematasCtl.Model.findById(findArticle.schemaId, this.dbQuery(ctx))
    const { err, data } = await this.filterCon(merge.content, findSchema.fields)
    if(err) {
      res.err = err
      return res
    }
    res.data = data
    return res
  }
  async addContent(ctx, next) {
    try{
      const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
      const { err, data: getParams } = await this.addContentBefore(ctx)
      if(err) {
        ctx.send(2, '', hello.dealError(err))
        return
      }
      getParams._id = hello.createObjectId()
      getParams.createTime = (new Date()).getTime()
      getParams.updateTime = (new Date()).getTime()

      const result = await this.Model.update(
        {
          _id: merge._id,
          ...this.dbQuery(ctx)
        },
        {
          $push: {
            contents: getParams
          }
        }
      )
      if(!result.ok) {
        ctx.send(2, result, '添加失败')
      }
      ctx.send(1, result, '添加成功')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
  async modifyContent(ctx, next) {
    try{
      const merge = { ...ctx.request.body, ...this.dbQuery(ctx) }
      const { err, data: getParams } = await this.addContentBefore(ctx)
      if(err) {
        ctx.send(2, '', hello.dealError(err))
        return
      }
      if(!merge.content._id) {
        ctx.send(2, '', '缺少_id(content)')
        return
      }
      const findContent = await this.Model.findOne({
        _id: merge._id,
        contents: { $elemMatch: { _id: merge.content._id }},
        ...this.dbQuery(ctx)
      },
        { "contents.$": 1 }
        )
      if(!findContent) {
        ctx.send(2, '',  `${merge.content._id}不存在`)
        return
      }
      const mergeContent = {
        ...findContent,
        ...merge.content
      }
      mergeContent.updateTime = (new Date()).getTime()
      
      const result = await this.Model.update(
        {
          _id: merge._id,
          "fields": {
            $elemMatch: {_id: merge.content._id}
          },
          ...this.dbQuery(ctx)
        },
        {
          $set: mergeContent
        }
      )
      if(!result.ok) {
        ctx.send(2, result, '没有需要修改的数据'))
      }
      ctx.send(1, result, '修改成功')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body.username))
    }finally {
      await next()
    }
  }
}
const articleCtl = new ArticleCtl()

export default articleCtl
