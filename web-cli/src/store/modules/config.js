import * as MUTATIONS from '../const/mutaions'

const state = {
  showDir: true,
  showBrief: true
}

const mutations = {
  [MUTATIONS.CONFIG_TOGGLE_SAVE] (state, { tar, val} ) {
    state[tar] = val
  }
}

export default {
  state,
  mutations
}
