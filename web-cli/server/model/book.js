import baseModel, { definedValidate } from './BaseModel'
import validator from '../utils/validator'


class bookModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id name'
  }
  getName() {
    return 'category'
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
export default bookModel

