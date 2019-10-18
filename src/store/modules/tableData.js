// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
import {getElementList, getActionList, getFunctionList, getProjectList, getEquipmentList} from '@/api/api'
import Vue from 'vue'

const state = {
  deafultPageId: '',
  curreentPro: '',
  elementData: [],
  actionData: [],
  functionData: [],
  projectData: [],
  equipmentData: [],
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
    if (argsList.length > 0) {
      state.curreentPro = argsList[0]
    }
  },
  CHANGE_PROJECTDATA: (state, args) => {
    state.curreentPro = args
  },
  SET_EQUIPMENTDATA: (state, argsList) => {
    state.equipmentData = argsList
  },
}

const actions = {
  getProjects({commit}) {
    getProjectList().then((res) => {
      let datas = res.data.project_list
      commit('SET_PROJECTDATA', datas)
    })
  },

  changeProjects({commit}, args) {
    commit('CHANGE_PROJECTDATA', args)
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
          message: res.message,
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
            message: res.message,
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
            message: res.message,
            type: 'error'
          })
        }

      }
    )
  },
  getEquipmentData({commit}) {
    getEquipmentList().then(res => {
        if (res.status == 1) {
          let datas = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false)
            v.originalTitle = v.title
            v.originalSetting_args = v.setting_args
            v.originalRemoteHost = v.remoteHost
            v.originalRemotePort = v.remotePort
            return v
          })
          commit('SET_EQUIPMENTDATA', datas)
        } else {
          Vue.$message({
            message: res.message,
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
