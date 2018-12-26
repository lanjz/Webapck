import baseModel, { definedValidate } from './BaseModel'
import validator from './validator'


class BookModel extends baseModel{
  constructor() {
    super()
    this.assectPath = ''
    // this.assectPath = '_id name isPrivate'
  }
  getName() {
    return 'books'
  }
  getFilterFields() {
    return ['userId']
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
        validate: definedValidate(validator.numBoolean)
      },
      schemata: {
        type: Object,
        default: {},
      },
      ...this.baseModel()
    }
  }
}

export default new BookModel()

