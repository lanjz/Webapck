import baseModel from './BaseModel'

class catalogModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id parentId bookId name hasChild'
  }
  getName() {
    return 'catalogs'
  }
  banUpdateFields() {
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
      ...this.baseSchema
    }
  }
}

export default catalogModel
