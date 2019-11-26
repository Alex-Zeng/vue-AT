const state = {
  visitedViews: [],
  cachedViews: [],
  editableTabsValue: 0,  // 当前选中的tab
  initIndex: 0,
}

const mutations = {
  ADD_VISITED_VIEW: (state, params) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (params.route.path === v.path) {
        state.editableTabsValue = v.index
        return
      }
    }

    state.initIndex++
    state.visitedViews.push(
      // 合并两个对象
      Object.assign({}, params.route, {
        title: params.route.meta.title + params.title || 'no-name',
        index: state.initIndex
      })
    )
    //每次新增的时候都跳转到新增tab
    state.editableTabsValue = state.initIndex

  },

  CHANGE_VIEW: (state, viewIndex) => {
    state.editableTabsValue = viewIndex
  },

  DEL_VISITED_VIEW: (state, viewIndex) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.index === parseInt(viewIndex)) {
        state.visitedViews.splice(i, 1)

        // 如果删除的是当前选中的页面,则重新定位到后面一个或者前面一个
        if (state.editableTabsValue == viewIndex) {
          if (state.visitedViews[i]) {
            state.editableTabsValue = state.visitedViews[i].index
          } else if (state.visitedViews[i - 1]) {
            state.editableTabsValue = state.visitedViews[i - 1].index
          }
        }
        break
      }
    }

  },
  DELETE_ALL_VIEWS: (state) => {
    state.visitedViews = []

  },
  DELETE_OTHER_VIEWS:(state,view) => {
    state.visitedViews=[]
    state.visitedViews.push(view)
    state.editableTabsValue = view.index

  },

}

const actions = {
  addView({commit}, view) {
    commit('ADD_VISITED_VIEW', view)
  },

  delView({commit}, viewIndex) {
    commit('DEL_VISITED_VIEW', viewIndex)
  },
  changeView({commit}, viewIndex) {
    commit('CHANGE_VIEW', viewIndex)
  },
  delAllViews({commit}) {
    commit('DELETE_ALL_VIEWS')
  },
  delOthersViews({commit},view) {
    commit('DELETE_OTHER_VIEWS',view)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
