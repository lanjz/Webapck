import * as mongoose from 'mongoose'

const DBURL = 'mongodb://127.0.0.1:27017/test'

mongoose.connect(DBURL, { useNewUrlParser: true })

function dbModel(tar, schema) {
  if (schema instanceof mongoose.Schema === false) {
    schema = new mongoose.Schema(schema);
  }
  return mongoose.model(tar, schema)

}

export default dbModel
