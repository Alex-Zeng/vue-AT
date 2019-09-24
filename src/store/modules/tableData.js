// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
import {getElementList, getActionList, getFunctionList, getProjectList, } from '@/api/api'
import Vue from 'vue'

const state = {
  deafultPageId: '',
  elementData: [],
  actionData: [],
  functionData: [],
  projectData: [],
}
const getters = {}

const mutations = {

  SET_ELEMENTDATA: (state, argsList) => {
    state.elementData = argsList
  },
  SET_ACTIONDATA: (state, argsList) => {
    state.actionData = argsList
  },
  SET_FUNCTIONDATA: (state, argsList) => {
    state.functionData = argsList
  },
  SET_PROJECTDATA: (state, argsList) => {
    state.projectData = argsList
  },

}

const actions = {
  getProjects({commit}) {
    getProjectList().then((res) => {
      let datas = res.data.project_list
      commit('SET_PROJECTDATA', datas)
    })

  },



  getElementData({commit}, args) {
    getElementList(args.projectId, args.pageId).then(res => {
      if (res.status == 1) {
        let datas = res.data.data_list.map(v => {
          Vue.set(v, 'edit', false)
          v.originalTitle = v.title
          v.originalType = v.type
          v.originalLoc = v.loc
          return v
        })
        commit('SET_ELEMENTDATA', datas)
      } else {
        Vue.$message({
          message: res.msg,
          type: 'error'
        })
      }
    })
  },
  getData({commit}, args) {
    getActionList(args.projectId, args.pageId).then(res => {
        if (res.status == 1) {
          let datas = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false)
            v.originalTitle = v.title
            v.originalElementTitle = v.elementTitle
            v.originalFunctionTitle = v.functionTitle
            return v
          })
          commit('SET_ACTIONDATA', datas)
        } else {
          Vue.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }
    )
  },
  getFunctionData({commit}) {
    getFunctionList().then(res => {
        if (res.status == 1) {
          let datas = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false)
            v.originalTitle = v.title
            v.originalType = v.type
            v.originalDescription = v.description
            return v
          })
          commit('SET_FUNCTIONDATA', datas)
        } else {
          Vue.$message({
            message: res.msg,
            type: 'error'
          })
        }

      }
    )
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
