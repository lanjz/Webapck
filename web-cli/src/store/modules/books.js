import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const defaultBook = {
  default:{
    _id: 'default',
    name: '默认'
  }
}
const state = {
  list: defaultBook,
  curBook: 'default'
}
const getters = {
  curBookInfo: state => {
    return state.list[state.curBook]
  }
}
const mutations = {
  [MUTATIONS.BOOK_LIST_SAVE](state, { data, start }) {
    const newMap = start ? state.list : { ...defaultBook }
    data.forEach((item) => {
      newMap[item._id] = item
    })
    state.list = newMap
  },
  [MUTATIONS.BOOK_LIST_UPDATE](state, data) {
    state.list[data._id] = data
  },
  [MUTATIONS.BOOK_CUR_UPDATE](state, data) {
    state.curBook = data
  }
}

const actions = {
  /**
   * @params <Object> force 是否强制重新获取数据
   * */
  async [ACTIONS.BOOK_LIST_GET]({ state, commit }, arg = {}) {
    const { limit = 0, start = 0, force = false } = arg
    if(!force && Object.keys(state.list).length > 1){
      return { err: null, data: { list: state.list } }
    }
    const result = await fetch({
      url: '/api/books',
      data: {
        limit,
        start
      }
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.BOOK_LIST_SAVE, { data: data.list, start })
    }
    return result
  },
  /* eslint-disable no-unused-vars */
  async [ACTIONS.BOOK_LIST_POST]({ commit }, book) {
    const result = await fetch({
      url: '/api/book',
      method: 'post',
      data: book
    })
    return result
  },
  async [ACTIONS.BOOK_LIST_DELETE]({ commit }, book) {
    const result = await fetch({
      url: '/api/book',
      method: 'delete',
      data: book
    })
    return result
  },
  async [ACTIONS.BOOK_LIST_PUT]({ commit }, book) {
    const result = await fetch({
      url: '/api/book',
      method: 'put',
      data: book
    })
    return result
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
