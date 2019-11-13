const state = {
  visible: 1,
}

const mutations = {
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
      case 'execute':
        state.visible = 4
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
