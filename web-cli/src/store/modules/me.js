import MUTATIONS from '../const/mutaions'

const state = {
  bookList: new Map(),
  bookCount: 0,
  curBook: {}
}

const mutations = {
  [MUTATIONS.BOOK_LIST_SAVE](state, data, start) {
    if(start) {

    }

  },
  addAge(state) {
    state.age += 1
  }
}

export default {
  state,
  mutations
}
