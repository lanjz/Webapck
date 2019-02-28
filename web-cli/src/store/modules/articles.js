import fetch from '../../util/fetch/fetch.js'
import constKey from '../../util/const.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  catalogMapArticles: {},
  list: {},
  cusArticle: ''
}

const mutations = {
  [MUTATIONS.ARTICLE_LIST_SAVE](state, { data, catalogId }) {
    state.catalogMapArticles = {
      ...state.catalogMapArticles,
      [catalogId]: data
    }
  },
  [MUTATIONS.ARTICLE_DES_SAVE](state, data) {
    state.list[data._id] = data
  },
  [MUTATIONS.ARTICLE_CUS_SAVE](state, data) {
    state.cusArticle = data
  },
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
    if(!err && data.list.length) {
      commit(MUTATIONS.ARTICLE_LIST_SAVE, { data: data.list, catalogId: key })
    }
    return result
  },
  async [ACTIONS.ARTICLE_RECENTLY_LIST_GET]({ state, commit }){
    const result = await fetch({
      url: '/api/recently_articles',
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.ARTICLE_LIST_SAVE, {
        data: data.list, catalogId: constKey.recentlyArticlesKey
      })
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
  async [ACTIONS.ARTICLE_POST]({ rootState, dispatch }, data) {
    const result = await fetch({
      url: '/api/article',
      method: 'post',
      data: {
        ...data,
        bookId: rootState.books.curBook
      }
    })
    if(!result.err) {
      dispatch(ACTIONS.ARTICLE_LIST_GET, {
        bookId: rootState.books.curBook,
        catalogId: data.catalogId,
        force: true
      })
      dispatch(ACTIONS.ARTICLE_RECENTLY_LIST_GET)
    }
    return result
  },
  async [ACTIONS.ARTICLE_PUT]({ state, commit, dispatch }, data) {
    const result = await fetch({
      url: '/api/article',
      method: 'put',
      data
    })
    if(!result.err) {
      const { bookId, catalogId } = state.list[data._id]
      dispatch(ACTIONS.ARTICLE_LIST_GET, { bookId, catalogId, force: true })
      dispatch(ACTIONS.ARTICLE_RECENTLY_LIST_GET)
    }
    return result
  },
  async [ACTIONS.ARTICLE_DELETE]({ dispatch }, id) {
    const result = await fetch({
      url: '/api/article',
      method: 'delete',
      data: {
        _id: id
      }
    })
    if(!result.err) {
      const { bookId, catalogId } = state.list[id]
      dispatch(ACTIONS.ARTICLE_LIST_GET, { bookId, catalogId, force: true })
      dispatch(ACTIONS.ARTICLE_RECENTLY_LIST_GET)
    }
    return result
  },
}
export default {
  state,
  mutations,
  actions
}
