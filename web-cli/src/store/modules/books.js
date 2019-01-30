import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  list: {},
  curBook: {}
}

const mutations = {
  [MUTATIONS.BOOK_LIST_SAVE](state, data, start) {
    const newMap = start ? state.list : {}
    data.forEach(item => newMap[item._id] = item)
    state.list = newMap
  },
  [MUTATIONS.BOOK_LIST_UPDATE](state, data) {
    state.list[data._id] = data
  }
}

const actions = {
  async [ACTIONS.BOOK_LIST_GET]({ state, commit }, limit = 0, start = 0) {
    if(limit === -1 && Object.keys(state.list).length){
      return { err: null, data: state.list}
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
      commit(MUTATIONS.BOOK_LIST_SAVE, data.list, start)
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
  actions
}
