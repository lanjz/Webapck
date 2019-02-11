import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const state = {
  list: {
    root: []
  },
  curCatalog: {}
}
const getters = {
  treeChainList: state => {
    const tempArr = []
    let curTree = state.curCatalog
    if(!curTree._id) return []
    tempArr.unshift(curTree._id)
    while (curTree.parentId) {
      tempArr.unshift(curTree.parentId)
      curTree = state.list[curTree.parentId]
    }
    return tempArr
  }
}
const mutations = {
  [MUTATIONS.CATALOGS_SAVE](state, { curNode, data }) {
    state.list = {
      ...state.list,
      ...{ [curNode._id]: {
          ...curNode,
          childNodes: data
        } }
    }
  },
  [MUTATIONS.CATALOGS_CUR_SAVE](state, { data = {} }) {
    state.curCatalog = { ...data }
  },
  /**
   * 创建临时的目录
   * @param <String> parentId
   * */
  [MUTATIONS.CATALOGS_TEMPLATE_CREATE](state, id) {
    const newDir = {
      name: '新建文件夹',
      isNew: true,
      parentId: id
    }
    // 将临时目录插入到目标文件夹最前面，并更新state
    const getCatalog = state.list[id] ? state.list[id] : []
    const addCatalog = [ newDir, ...getCatalog ]
    state.list = {
      ...state.list,
      ...{ [id]: addCatalog }
    }
  }
}

const actions = {
  async [ACTIONS.CATALOGS_GET]({ commit }, params) {
    console.log('params', JSON.stringify(params))
    const result = await fetch({
      url: '/api/catalogs',
      data: {
        parentId: params._id
      }
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.CATALOGS_SAVE, { curNode: params, data: data.list })
    }
    return result
  },
  /* eslint-disable no-unused-vars */
  async [ACTIONS.CATALOGS_POST]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalog',
      method: 'post',
      data
    })
    return result
  },
  async [ACTIONS.CATALOGS_DELETE]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalog',
      method: 'delete',
      data
    })
    return result
  },
  async [ACTIONS.CATALOGS_PUT]({ commit }, data) {
    const result = await fetch({
      url: '/api/catalog',
      method: 'PUT',
      data
    })
    return result
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
