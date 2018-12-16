import baseModel, { definedValidate } from './BaseModel'
import validator from '../utils/validator'


class UserModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id username email sex createTime updateTime'
    this.findByEmail = this.findByEmail.bind(this)
  }
  getName() {
    return 'users'
  }
  getSchema() {
    return {
      username: {
        type: String,
        unique: true,
        required: true,
        validate: definedValidate(validator.username)
      },
      password: {
        type: String,
        required: true,
        validate: definedValidate(validator.password)
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
      createTime: { type: Number },
      updateTime: { type: Number, default: (new Date()).getTime() },
    }
  }

  findByEmail(email) {
    return this.model.findOne({ email }).select(this.assectPath).exec()
  }
}
export default UserModel

