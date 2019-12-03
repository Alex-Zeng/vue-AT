// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)

const state = {
  pageData: [],
  visible: 1,
}

const mutations = {
  SET_PAGEDATA: (state, argsList) => {
    state.pageData = argsList
  },
  SET_VISIBLE_NAV: (state, nav) => {
    switch (nav) {
      case 'page':
        state.visible = 1

        break;
      case 'case':
        state.visible = 2

        break;
      case 'suit':
        state.visible = 3
        break;
      default:
        state.visible = 0
        break;
    }
  }
}

const actions = {

  setNavVisible({commit, dispatch,rootState}, nav) {
    // const rootState = store.rootState
    console.log(rootState.tableData.curreentProId)
    commit('SET_VISIBLE_NAV', nav)
    dispatch('tableData/getPage', {}, {root: true})
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
