import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  catalogs: {},
}

const mutations = {
  [MUTATIONS.CATALOGS_SAVE](state, { parentId, data }) {
    console.log(parentId, data)
    state.catalogs[parentId] = data
  }
}

const actions = {
  async [ACTIONS.CATALOGS_GET]({ commit }, params) {
    const result = await fetch({
      url: '/api/catalogs',
      data: params
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.CATALOGS_SAVE, { parentId: params.parentId, data: data.list })
    }
    return result
  },
  /* eslint-disable no-unused-vars */
  async [ACTIONS.CATALOGS_POST]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalogs',
      method: 'post',
      data
    })
    return result
  },
  async [ACTIONS.CATALOGS_DELETE]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalogs',
      method: 'delete',
      data
    })
    return result
  },
  async [ACTIONS.CATALOGS_PUT]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalogs',
      method: 'put',
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
