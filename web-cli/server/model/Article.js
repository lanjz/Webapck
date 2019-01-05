import baseModel from './BaseModel'

class ArticleModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id userId bookId catalogId content createTime updateTime'
  }
  getName() {
    return 'articles'
  }
  banUpdateFields() {
    return ['userId']
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true,
      },
      bookId: {
        type: String,
        required: true
      },
      catalogId: {
        type: String,
        required: true
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

