import * as mongoose from 'mongoose'

const DBURL = 'mongodb://127.0.0.1:27017/test'
mongoose.connect(DBURL, { useNewUrlParser: true })

import validator from '../utils/validator'

const VALIDA_ERR_MSG = '{PATH} = {VALUE} : Format error'

function test() {}

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

class UserModel {
  constructor() {
    this.name = 'user'
    this.schema = new mongoose.Schema(this.getSchema())
    this.model = mongoose.model(this.name, this.schema)
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
    console.log('this.model', this.model)
    this.model.save(data)
  }

}

async function add() {
  const user = new UserModel()
  const result = user.save({
    userName: 'lanjz',
    passWord: '1234',
    email: 'lanjz',
    sex: 1
  })
  console.info(result)
}

export default {
  add
}

