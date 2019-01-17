import * as mongoose from 'mongoose';
import baseModel  from './BaseModel'


class BookModel extends baseModel{
  constructor() {
    super()
    this.assectPath = ''
    // this.assectPath = '_id name isPrivate'
  }
  getName() {
    return 'schematas'
  }
  banUpdateFields() {
    return ['userId', 'fields']
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      fields: [
        {
          name: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          default: {
            type: String
          },
          options: {
            type: Array
          }
        }
      ],
      ...this.baseModel()
    }
  }
  // 向某个schema中添加字段
  addField({ id, userId }, field) {
    return this.Model.update(
      { _id: id, userId },
      {
        $push: {
          fields: field
        }
    })
  }
  // 向某个schema中添加字段
  modifyField(query, projection) {
    return this.Model.update(
      query,
      projection)
  }
}

export default new BookModel()

