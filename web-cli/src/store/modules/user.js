import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  userInfo: {}
}

const mutations = {
  [MUTATIONS.USER_SAVE](state, data) {
    state.userInfo = {
      ...data
    }
  }
}

const actions = {
  async [ACTIONS.USER_POST]({ commit }, data) {
    const result = await fetch({
      url: '/api/user',
      method: 'post',
      data: {
        ...data
      }
    })
    if(!result.err) {
      commit(MUTATIONS.USER_SAVE, result.data)
    }
    return result
  },
  async [ACTIONS.LOGIN_POST]({ commit }, data) {
    const result = await fetch({
      url: '/api/login',
      method: 'post',
      data: {
        ...data
      }
    })
    if(!result.err) {
      commit(MUTATIONS.USER_SAVE, result.data)
    }
    return result
  },
}
export default {
  state,
  mutations,
  actions
}
