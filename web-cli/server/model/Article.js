import baseModel from './BaseModel'

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
        required: true
      },
      ...this.baseModel()
    }
  }
}
export default new ArticleModel()

