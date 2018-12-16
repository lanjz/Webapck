import baseModel, { definedValidate } from './BaseModel'
import validator from '../utils/validator'


class BookModel extends baseModel{
  constructor() {
    super()
    this.assectPath = ''
    // this.assectPath = '_id name isPrivate'
  }
  getName() {
    return 'books'
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
      isPrivate: {
        type: Number,
        required: true,
        default: 1,
        validate: definedValidate(validator.isPrivate)
      },
      createTime: { type: Number },
      updateTime: { type: Number, default: (new Date()).getTime() },
    }
  }
}

export default new BookModel()

