import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'
import validator from '../utils/validator'

class BookCtl extends BaseCtl {
  constructor() {
    super()
    this.inputConValid = this.inputConValid.bind(this)
    this.dateConValid = this.dateConValid.bind(this)
    this.radioConValid = this.radioConValid.bind(this)
    this.selectConValid = this.selectConValid.bind(this)
    this.contentValidator = {
      input: this.inputConValid,
      date: this.dateConValid,
      textarea: this.inputConValid,
      radio: this.radioConValid,
      select: this.selectConValid
    }
    this.add = this.add.bind(this)
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
    console.log('name', name)
    if(name.trim().length > 10) {
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
      name: schema.name.trim(),
      default: schema.default ? schema.default.trim() : '',
      type: schema.type.trim()
    }
    return res
  }
  dateConValid(schema) {
    const res = { err: null, data: schema }
    const nameValid = this.nameValid(schema.name)
    if(nameValid.err) {
      res.err = nameValid.err
      return res
    }
    if(schema.default) {
      const validType = validator.isTypeNumber(schema.default)
      if(validType.err) {
        res.err = validType.err
        return res
      }
    }
    res.data = {
      name: schema.name,
      default: schema.default,
      type: schema.type.trim()
    }
    return res
  }
  radioConValid(schema) {
    const res = { err: null, data: schema }
    const nameValid = this.nameValid(schema.name)
    if(nameValid.err) {
      res.err = nameValid.err
      return res
    }
    const isValid = validator.isArrayType(schema.options)
    if(isValid.err || !schema.options.length) {
      res.err = new TypeError('options必需是数组且至少有一个选项')
      return res
    }
    const isUniqueId = validator.isUniqueInArr(schema.options, 'id')
    if(isUniqueId.err) {
      res.err = new RangeError(`options${isUniqueId.err.message}`)
      return res
    }
    const isUniqueName = validator.isUniqueInArr(schema.options, 'name')
    if(isUniqueName.err) {
      res.err = new RangeError(`options${isUniqueName.err.message}`)
      return res
    }
    schema.options = schema.options.map(item => ({ name: item.name, id: item.id }))
    if(schema.default) {
      const validType = validator.isStringType(schema.default)
      if(validType.err) {
        res.err = validType.err
        return res
      }
      const isValidDefault = schema.options.find(item => (item.id === schema.default))
      if(!isValidDefault) {
        res.err = new RangeError('default的值不在options中')
        return res
      }
    }
    res.data = {
      name: schema.name,
      default: schema.default,
      type: schema.type.trim(),
      options: schema.options
    }
    return res
  }
  selectConValid(schema) {
    const res = { err: null, data: schema }
    const nameValid = this.nameValid(schema.name)
    if(nameValid.err) {
      res.err = nameValid.err
      return res
    }
    const isValid = validator.isArrayType(schema.options)
    if(isValid.err || !schema.options.length) {
      res.err = new TypeError('options必需是数组且至少有一个选项')
      return res
    }
    const isUniqueId = validator.isUniqueInArr(schema.options, 'id')
    if(isUniqueId.err) {
      res.err = new RangeError(`options${isUniqueId.err.message}`)
      return res
    }
    const isUniqueName = validator.isUniqueInArr(schema.options, 'name')
    if(isUniqueName.err) {
      res.err = new RangeError(`options${isUniqueName.err.message}`)
      return res
    }
    schema.options = schema.options.map(item => ({ name: item.name, id: item.id }))
    if(schema.default) {
      const validType = validator.isArrayType(schema.default)
      if(validType.err) {
        res.err = validType.err
        return res
      }
      const isValidDefault = schema.default
        .every(item => (schema.options.find(inItem => inItem.id === item)))
      if(!isValidDefault) {
        res.err = new RangeError('default的值不在options中')
        return res
      }
    }
    res.data = {
      name: schema.name,
      default: schema.default,
      type: schema.type.trim(),
      options: schema.options
    }
    return res
  }
  filterSchemata(schema) {
    const res = { err: null, data: '' }
    const schemaKeys = Object.keys(schema)
    const obj = {}
    schemaKeys.every((item) => {
      const tempFn = this.contentValidator[schema[item].type]
      const { err, data } = tempFn(schema[item])
      if(err) {
        res.err = new Error(`${item}:${err.message}`)
        return false
      }
      obj[item] = data
      return true
    })
    return res
  }
  async filterParams(arg){
    const res = { err: null, data: '' }
    const getParams = JSON.parse(JSON.stringify(arg))
    const { schemata = {} } = getParams
    const isObjResult = validator.isObjectType(schemata)
    if(isObjResult.err) {
      res.err = isObjResult.err
      return res
    }
    const filterSchemata = this.filterSchemata(schemata)
    if(filterSchemata.err) {
      res.err = filterSchemata.err
      return res
    }
    getParams.schemata = filterSchemata
    res.data = getParams
    const { name, userId } = getParams
    const findBooks = await this.Model.findOne({ name, userId })
    if(findBooks) {
      res.err = new Error(`${name}已存在`)
      return res
    }
    return res
  }
}
const bookCtl = new BookCtl()

export default bookCtl
