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
}

export default new BookModel()

