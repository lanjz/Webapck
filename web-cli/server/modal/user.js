import baseModel from './base'
import validator from '../utils/validator'

const VALIDA_ERR_MSG = '{PATH} = {VALUE} : Format error'

/**
 * @param {Function} f 校验函数
 * @return <Object> mongoose.Schema.validate
 * */
function definedValidate(f) {
  return {
    validator(v) {
      return f(v)
    },
    message: VALIDA_ERR_MSG
  }
}

class UserModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id userName email sex'
  }
  getName() {
    return 'user'
  }
  getSchema() {
    return {
      userName: {
        type: String,
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
      createDate: { type: Date, default: Date.now },
      updateDate: { type: Date, default: Date.now },
    }
  }
  save(data) {
    const user = new this.model(data)
    const error = user.validateSync()
    if (error) {
      return Promise.reject(error.message)
    }
    return user.save()
  }
  listCount() {
    return this.model.countDocuments();
  }
  findByEmail(email) {
    return this.model.findOne({ email })
  }

  findById(id) {
    return this.model.findOne({
      _id: id
    });
  }
  list() {
    return this.model.find().select(this.assectPath).exec();  //显示id name email role
  }
  listWithPaging(page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model.find().sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).select(this.assectPath).exec();
  }
  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  update(id, data) {
    return this.model.update({
      _id: id
    }, data);
  }
}
export default UserModel

