import baseModel, { definedValidate } from './BaseModel'
import validator from '../utils/validator'

class NotesModel extends baseModel{
  constructor() {
    super()
    this.assectPath = '_id userId title content category createTime updateTime'
  }
  getName() {
    return 'notes'
  }
  getSchema() {
    return {
      userId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
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
  findOneAndUpdate(id, data) {
    return this.model.findOneAndUpdate({ _id: id }, data, { new: true }).select(this.assectPath).exec();
  }
}
export default NotesModel

