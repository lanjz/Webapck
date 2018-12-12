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
  findByEmail(email) {return this.model.findOne({ email }).select(this.assectPath).exec()}

  findById(id) {
    return this.model.findOne({ _id: id }).select(this.assectPath).exec();
  }
  list() {
    return this.model.find().select(this.assectPath).exec();  //显示id name email role
  }
  listWithPaging(start=0, limit=10) {
    console.log('134')
    start = parseInt(start);
    limit = parseInt(limit);
    return this.model.find().sort({ _id: -1 }).skip(start).limit(limit).select(this.assectPath).exec();
  }
  del(id) {
    return this.model.deleteOne({ _id: id });
  }
  findOne(query) {
    return this.model.findOne(query)
  }
  updateOne(id, data) {
    return this.model.updateOne({ _id: id }, data);
  }
  // 会有提示，所以暂时不用这个方法了
  findOneAndUpdate(id, data) {
    return this.model.findOneAndUpdate({ _id: id }, data, { new: true }).select(this.assectPath).exec();
  }
}
export default UserModel

