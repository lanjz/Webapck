import BaseCtl from './BaseCtl'
import bookModel from '../model/Book'

class BookCtl extends BaseCtl {
  getAlias() {
    return '本子'
  }
  getModel() {
    return bookModel
  }
}
const bookCtl = new BookCtl()

export default bookCtl
