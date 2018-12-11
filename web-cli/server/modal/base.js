import * as mongoose from 'mongoose';
import dbModel from '../db/index'

class baseModel{
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
  getSchema(){
    console.log('Model Class need getSchema function', 'error');
  }

  getName(){
    console.log('Model Class need name', 'error');
  }
}

export default baseModel
