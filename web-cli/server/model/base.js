import * as mongoose from 'mongoose';
import dbModel from '../db/index'
import { VALIDA_ERR_MSG } from '../utils/CONST'

class baseModel {
  constructor() {
    this.name = this.getName()
    this.schema = new mongoose.Schema(this.getSchema())
    this.schema.pre('save', function(next){
      if(!this.createTime) this.createTime = (new Date()).getTime()
      next()
    })
    this.model = dbModel(this.name, this.schema)
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
  save(data) {
    const model = new this.model(data)
    const error = model.validateSync()
    if (error) {
      return Promise.reject(error.message)
    }
    return model.save()
  }
  del(id) {
    return this.model.deleteOne({ _id: Object(id) });
  }
  findOneAndUpdate(id, data) {
    return this.model.findOneAndUpdate({ _id: id }, data, { new: true })
      .select(this.assectPath).exec();
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
