import baseModel from './BaseModel'


class noteCategoryModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id name parentId'
  }
  getName() {
    return 'category'
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
      parentId: {
        type: String,
        required: true,
        default: 'root'
      },
      category: {
        type: String,
        default: 'notes'
      },
      createTime: { type: Number },
      updateTime: { type: Number, default: (new Date()).getTime() },
    }
  }

  list(userId, parentId) {
    return this.model.find({ userId, parentId, category: 'notes' }).select(this.assectPath).exec()  // 显示id name email role
  }


}
export default noteCategoryModel

