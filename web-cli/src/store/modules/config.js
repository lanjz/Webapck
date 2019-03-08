import * as MUTATIONS from '../const/mutaions'

const showDir = window.localStorage.getItem('showDir') === '0' ? false : true
const showBrief = window.localStorage.getItem('showBrief') === '0' ? false : true
const state = {
  showDir,
  showBrief
}

const mutations = {
  [MUTATIONS.CONFIG_TOGGLE_SAVE] (state, { tar, val} ) {
    state[tar] = val
    const temVar = val ? '1' : '0'
    window.localStorage.setItem(tar, temVar)
  }
}

export default {
  state,
  mutations
}
