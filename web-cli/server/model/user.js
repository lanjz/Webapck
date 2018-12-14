import baseModel, { definedValidate } from './BaseModel'
import validator from '../utils/validator'


class UserModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id userName email sex createTime updateTime'
  }
  getName() {
    return 'user'
  }
  getSchema() {
    return {
      userName: {
        type: String,
        unique:  true,
        required: true,
        validate: definedValidate(validator.userName)
      },
      passWord: {
        type: String,
        required: true,
        validate: definedValidate(validator.passWord)
      },
      email: {
        type: String,
        required: true,
        validate: definedValidate(validator.email)
      },
      sex: {
        type: Number,
        required: true,
        validate: definedValidate(validator.sex)
      },
      avatar: {
        type: String,
      },
      createTime: { type: Number},
      updateTime: { type: Number, default: (new Date()).getTime() },
    }
  }

  findByEmail(email) {return this.model.findOne({ email }).select(this.assectPath).exec()}



}
export default UserModel

