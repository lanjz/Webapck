import * as mongoose from 'mongoose'

const DBURL = 'mongodb://127.0.0.1:27017/test'
const VALIDA_ERR_MSG = '{PATH} = {VALUE} : Format error'
function idNum(val) {
  return val > 10
}
function validator(fn) {
  return {
    validator(v) {
      return fn(v)
    },
    message: VALIDA_ERR_MSG
  }
}

mongoose.connect(DBURL, { useNewUrlParser: true })
function mon() {
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    const kittyScheme = mongoose.Schema({
      name: {
        type: Number,
        validate: validator(idNum)
      }
    }, { autoIndex: false })
    kittyScheme.methods.speak = () => {
      const greeting = kittyScheme.name ? `Meow name is${kittyScheme.name}` : "I don't have a name "
    }
    const Kitten = mongoose.model('Kitten', kittyScheme)
    const silence = new Kitten({ name: 5 })
    const error = silence.validateSync()
    if (error) {
      console.log('error', error)
      return
    }
    console.log(silence.name)
    const fluffy = new Kitten({ name: 'fluffy' });
    fluffy.save((err, fluffy) => {
      if (err) console.error(err)
      fluffy.speak()
    })
    Kitten.find((err, kittens) => {
      if (err) return console.error(err);
      return console.log(kittens)
    })
  })
}

export default function () {
  mon()
}
