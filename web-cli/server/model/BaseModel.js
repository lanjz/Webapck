import * as mongoose from 'mongoose';
import dbModel from '../db/index'
import { VALIDA_ERR_MSG } from '../utils/CONST'

class baseModel {
  constructor() {
    this.name = this.getName()
    this.schema = new mongoose.Schema(this.getSchema())
    this.schema.pre('save', function (next){
      if(!this.createTime) this.createTime = (new Date()).getTime()
      next()
    })
    this.model = dbModel(this.name, this.schema)
    this.baseSchema = {
      createTime: { type: Number },
      updateTime: { type: Number, default: (new Date()).getTime() },
    }
  }
  /**
   * 获取collection的schema结构
   */
  getSchema() {
    console.log('Model Class need getSchema function', 'error');
  }

  getName() {
    console.log('Model Class need name', 'error');
  }
  listCount(query) {
    return this.model.countDocuments(query);
  }
  save(data) {
    const model = new this.model(data)
    const error = model.validateSync()
    if (error) {
      return Promise.reject(error.message)
    }
    return model.save()
  }

  findOne(query) {
    return this.model.findOne(query)
  }
  updateOne(id, data) {
    return this.model.updateOne({ _id: id }, data);
  }
  findOneAndUpdate(id, data, query = {}) {
    return this.model.findOneAndUpdate({ _id: id, ...query }, data, { new: true })
      .select(this.assectPath).exec();
  }
  list() {
    return this.model.find().select(this.assectPath).exec()
  }
  listWithPaging(start = 0, limit = 0, query = {}) {
    start = parseInt(start);
    limit = parseInt(limit);
    return this.model.find(query)
      .sort({ _id: -1 })
      .skip(start)
      .limit(limit)
      .select(this.assectPath)
      .exec()
  }
  findById(id, query) {
    return this.model.findOne({ _id: id, ...query }).select(this.assectPath).exec()
  }
  del(id, query) {
    return this.model.deleteOne({ _id: Object(id), ...query })
  }
  delMany(ids, query) {
    return this.model.deleteMany({ _id: { $in: ids }, ...query })
  }
}

/**
 * @param {Function} f 校验函数
 * @return <Object> mongoose.Schema.validate
 * */
export function definedValidate(f) {
  return {
    validator(v) {
      return f(v)
    },
    message: VALIDA_ERR_MSG
  }
}

export default baseModel
