import hello from '../utils/hello'
import BaseCtl from './BaseCtl'
import schematasModel from '../model/Schematas'
import validator from '../utils/validator'

class SchematasCtl extends BaseCtl {
  constructor() {
    super()
    this.inputConValid = this.inputConValid.bind(this)
    this.dateConValid = this.dateConValid.bind(this)
    this.radioConValid = this.radioConValid.bind(this)
    this.selectConValid = this.selectConValid.bind(this)
    this.contentValidator = {
      input: this.inputConValid,
      markdown: this.inputConValid,
      date: this.dateConValid,
      textarea: this.inputConValid,
      radio: this.radioConValid,
      select: this.selectConValid
    }
    this.addField = this.addField.bind(this)
    this.modifyField = this.modifyField.bind(this)
  }
  getAlias() {
    return '字段'
  }
  getModel() {
    return schematasModel
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
      res.err = new RangeError(`options：${isUniqueId.err.message}`)
      return res
    }
    const isUniqueName = validator.isUniqueInArr(schema.options, 'name')
    if(isUniqueName.err) {
      res.err = new RangeError(`options：${isUniqueName.err.message}`)
      return res
    }
    schema.options = schema.options.map(item => ({ name: item.name, id: item.id }))
    if(schema.default) {
      const validType = validator.isStringType(schema.default)
      if(validType.err) {
        res.err = new TypeError(`default: ${validType.err.message}`)
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
      default: schema.default.join(','),
      type: schema.type.trim(),
      options: schema.options
    }
    return res
  }
  filterSchemata(fields) {
    const res = { err: null, data: '' }
    const arr = []
    fields.every((item) => {
      const tempFn = this.contentValidator[item.type]
      if(!tempFn) {
        return true
      }
      const { err, data } = tempFn(item)
      if(err) {
        res.err = new Error(`${err.message}`)
        return false
      }
      arr.push(data)
      return true
    })
    res.data = arr
    return res
  }
  async filterParams(arg){
    const res = { err: null, data: '' }
    const getParams = JSON.parse(JSON.stringify(arg))
    const { fields = [] }  = getParams
    const isObjResult = validator.isArrayType(fields)
    if(isObjResult.err) {
      res.err = isObjResult.err
      return res
    }
    const isUniqueName = validator.isUniqueInArr(fields, 'name', false)
    if(isUniqueName.err) {
      res.err = new RangeError(`options:${isUniqueName.err.message}`)
      return res
    }
    const filterSchemata = this.filterSchemata(fields)
    
    if(filterSchemata.err) {
      res.err = filterSchemata.err
      return res
    }
    getParams.fields = filterSchemata.data
    res.data = getParams
    const { name, userId } = getParams
    const findSchema = await this.Model.findOne({ name, userId })
    if(findSchema) {
      res.err = new Error(`${name}已存在`)
      return res
    }
    return res
  }
  // 验证并过滤提交的字段
  filterField(arg) {
    const res = { err: null, data: ''}
    const { type } = arg
    const tempFn = this.contentValidator[type]
    if(!tempFn) {
      res.err = new Error(`不支持${type}类型`)
      return res
    }
    const { err, data } = tempFn(arg)
    if(err) {
      res.err = err
      return res
    }
    res.data = data
    return res
  }
  /**
   * arr1中key是否包含在arr2中
   * @param <Array> arr1
   * @param <Array> arr2
   * @return <Object>
   * */
  valitArrInArr(arr1, arr2, key) {
    const res = { err: null, data: arr2}
    arr1.every(item => {
      const find = arr2.find(item2 => item2[key] === item[key])
      if(find) {
        return true
      }
      res.err = new Error(`${item.id}丢失`)
    })
    return res
  }
  // 添加字段
  async addField(ctx, next) {
    try{
      const { schemataId, field } = ctx.request.body
      if(!schemataId) {
        ctx.send(2, '',  'schemataId不能为空')
        return
      }
      if(!field) {
        ctx.send(2, '',  'field不能为空')
        return
      }
      const isValid = validator.isObjectType(field)
      if(isValid.err) {
        ctx.send(2, '', 'field not a object')
        return
      }
      const { err, data: getParams } = await this.filterField(field, ctx)
      if(err) {
        ctx.send(2, '', hello.dealError(err.message))
        return
      }
      const findSchema = await this.Model.findById(schemataId)
      if(!findSchema) {
        ctx.send(2, '',  `${schemataId}不存在`)
        return
      }
      console.log('schemataId', schemataId)
      console.log('this.dbQuery(ctx)', this.dbQuery(ctx))
      const findFieldInSchematas = await this.Model.findOne({
        _id: schemataId,
        fields: { $elemMatch:　{ name: getParams.name }},
        ...this.dbQuery(ctx)
      })
      console.log('findFieldInSchematas', findFieldInSchematas)
      if(findFieldInSchematas) {
        ctx.send(2, '',  `${getParams.name}已存在`)
        return
      }
      const result = await this.Model.addField({id: schemataId, ...this.dbQuery(ctx) }, getParams )
      console.log('result', result)
      ctx.send(1, result, '')
    } catch (e) {
      ctx.send(2, '', hello.dealError(e, ctx.request.body))
    }finally {
      await next()
    }
  }
  async modifyField(ctx, next) {
    try{
      const { schemataId, field } = ctx.request.body
      if(!schemataId) {
        ctx.send(2, '',  'schemataId不能为空')
        return
      }
      if(!field) {
        ctx.send(2, '',  'field不能为空')
        return
      }
      if(!field['_id']) {
        ctx.send(2, '',  'fieldId is request')
        return
      }
      const isValid = validator.isObjectType(field)
      if(isValid.err) {
        ctx.send(2, '', 'field not a object')
        return
      }
      const { err, data: getParams } = await this.filterField(field, ctx)
      if(err) {
        ctx.send(2, '', hello.dealError(err.message))
        return
      }
      const findSchema = await this.Model.findById(schemataId)
      if(!findSchema) {
        ctx.send(2, '',  `${schemataId}不存在`)
        return
      }
      const findFieldInSchematas = await this.Model.findOne(
        {
          _id: schemataId,
          fields: { $elemMatch:　{ _id: field._id }},
          ...this.dbQuery(ctx)
        },
        {"fields.$":1}
      )
      console.log('findFieldInSchematas', findFieldInSchematas)
      if(!findFieldInSchematas.fields&&findFieldInSchematas.fields.length) {
        ctx.send(2, '',  `${field._id}不存在`)
        return
      }
      const getFieldItem = findFieldInSchematas.fields[0]
      console.log('getFieldItem', getFieldItem)
      console.log('getParams', getParams)
      if(getFieldItem.type !== getParams.type) {
        ctx.send(2, '',  `type不可修改`)
        return
      }
      const validOptions = this.valitArrInArr(getFieldItem.options, getParams.options, 'id')
      if(validOptions.err) {
        ctx.send(2, '',  validOptions.err.message)
        return
      }
      const result = await this.Model.modifyField(
        {id: schemataId,
          "fields._id": field._id,
          ...this.dbQuery(ctx)
        }, {
        $set: {
          "fields.$.name": field.name,
          "fields.$.options": field.options,
          "fields.$.default": field.default,
        }
      })
      ctx.send(1, result, '')
    }catch(e) {
      ctx.send(2, '', hello.dealError(e.message, ctx.request.body))
    }finally {
      await next()
    }
  }
}
const schematasCtl = new SchematasCtl()

export default schematasCtl
