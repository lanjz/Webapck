import baseModel from './BaseModel'

class catalogModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id parentId bookId name hasChild'
  }
  getName() {
    return 'catalogs'
  }
  getFilterFields() {
    return ['hasChild']
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true
      },
      bookId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      parentId: {
        type: String,
        required: true,
      },
      hasChild: {
        type: Number,
        default: 0
      },
      ...this.baseSchema
    }
  }
}

export default catalogModel
