import baseModel  from './BaseModel'


class BookModel extends baseModel{
  constructor() {
    super()
    this.assectPath = ''
    // this.assectPath = '_id name isPrivate'
  }
  getName() {
    return 'schematas'
  }
  banUpdateFields() {
    return ['userId', 'fields']
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      fields: {
        type: Array,
        default: [],
      },
      ...this.baseModel()
    }
  }
}

export default new BookModel()

