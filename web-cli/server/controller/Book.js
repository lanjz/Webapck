import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'
import hello from '../utils/hello'
import validator from '../utils/validator'

class BookCtl extends BaseCtl {
  constructor() {
    super()
    this.contentValidator = {
      input: this.inputConValid,
      date: this.dateConValid,
      textarea: this.textConValid,
      radio: this.radioConValid,
      select: this.selectConValid
    }
  }
  getAlias() {
    return '本子'
  }
  getModel() {
    return bookModel
  }
  nameValid(name) {
    const res = { err: null, data: name }
    if(!name) {
      res.err = new Error('name 不能为空')
      return res
    }
    const validType = validator.isStringType(name)
    if(validType.err) {
      res.err = validType.err
      return res
    }
    if(name.strim().length < 10) {
      res.err = new Error('name长度不能起来10位')
      return res
    }
    return res
  }
  inputConValid(schema) {
    const res = { err: null, data: schema }
    const nameValid = this.nameValid(schema.name)
    if(nameValid.err) {
      res.err = nameValid.err
      return res
    }
    if(schema.default) {
      const validType = validator.isStringType(schema.default)
      if(validType.err) {
        res.err = validType.err
        return res
      }
    }
    res.data = {
      name: schema.name,
      default: schema.default,
      type: schema.type
    }
    return res
  }
  filterSchemata(schema) {
    const schemaKeys = Object.keys(schema)
    const obj = {}
    schemaKeys.every((item) => {
      const tempFn = this.contentValidator[item.type]
      const { err, data } = tempFn(item)
      if(err) {
        throw new Error(err)
      }
      obj[item] = data
      return true
    })
    return obj
  }
  async add(ctx, next) {
    const getParams = { ...ctx.request.body, ...this.dbQuery(ctx) }
    try{
      const { schemata = {} } = getParams
      const isObjResult = validator.isObjectType(schemata)
      if(isObjResult.err) {
        ctx.send(2, ctx.request.body, `schemata:${isObjResult.err.message}`)
        return
      }
      const filterSchemata = this.filterSchemata(schemata)
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
