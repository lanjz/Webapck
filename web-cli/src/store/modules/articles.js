import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  catalogMapArticles: {},
  list: {}
}

const mutations = {
  [MUTATIONS.ARTICLE_LIST_SAVE](state, { data, catalogId }) {
    state.catalogMapArticles[catalogId] = data
  },
  [MUTATIONS.ARTICLE_DES_SAVE](state, data) {
    state.list[data._id] = data
  }
}

const actions = {
  async [ACTIONS.ARTICLE_LIST_GET]({ state, commit }, { bookId, catalogId, force }){
    const key = `${bookId}_${catalogId}`
    if(!force && state.catalogMapArticles[key]) {
      return { err: null, data: { list: Object.values(state.list)} }
    }
    const result = await fetch({
      url: '/api/articles',
      data: {
        bookId,
        catalogId
      }
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.ARTICLE_LIST_SAVE, { data: data.list, catalogId: key })
    }
    return result
  },
  async [ACTIONS.ARTICLE_DES_GET]({ state, commit }, { _id, force }) {
    if(!force && state.list[_id]) {
      return { err: null, data: state.article[_id]}
    }
    const result = await fetch({
      url: `/api/article/${_id}`
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.ARTICLE_DES_SAVE, data)
    }
    return result
  },
  async [ACTIONS.ARTICLE_POST]({ state, commit, rootState }, data) {
    const result = await fetch({
      url: '/api/article',
      method: 'post',
      data: {
        ...data,
        bookId: rootState.books.curBook
      }
    })
    return result
  },
  async [ACTIONS.ARTICLE_PUT]({ state, commit }, data) {
    const result = await fetch({
      url: '/api/article',
      method: 'post',
      data
    })
    return result
  }
}
export default {
  state,
  mutations,
  actions
}
