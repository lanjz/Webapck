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
    return ['userId']
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
      schemata: {
        type: Object,
        default: {},
      },
      ...this.baseModel()
    }
  }
}

export default new BookModel()

