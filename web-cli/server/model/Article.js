import baseModel, { definedValidate } from './BaseModel'
import validator from './validator'

class ArticleModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id userId content createTime updateTime'
  }
  getName() {
    return 'articles'
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true,
      },
      content: {
        type: Object,
        required: true,
        validate: definedValidate(validator.content)
      },
      ...this.baseModel()
    }
  }
}
export default new ArticleModel()

