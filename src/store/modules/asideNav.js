const state = {
  caseVisible: false,
  pageVisible: false,
  caseSuitVisible: false,
}

const mutations = {
  SET_VISIBLE_NAV: (state, nav) => {
    switch (nav) {
      case 'page':
        state.pageVisible = true
        state.caseVisible = false
        state.caseSuitVisible = false
        break;
      case 'case':
        state.caseVisible = true
        state.pageVisible = false
        state.caseSuitVisible = false
        break;
      case 'suit':
        state.caseSuitVisible = true
        state.caseVisible = false
        state.pageVisible = false
        break;
    }
  }
}

const actions = {
  setNavVisible({commit}, nav) {
    commit('SET_VISIBLE_NAV', nav)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
