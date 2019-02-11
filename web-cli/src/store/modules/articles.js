import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  list: {},
}

const mutations = {
  [MUTATIONS.ARTICLE_LIST_SAVE](state, { data, catalogId }) {
    state.list[catalogId] = data
  }
}

const actions = {
  async [ACTIONS.ARTICLE_LIST_GET]({ state, commit }, { bookId, catalogId, force }){
    const key = `${bookId}_${catalogId}`
    if(!force && state.list[key]) {
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
  }
}
export default {
  state,
  mutations,
  actions
}
