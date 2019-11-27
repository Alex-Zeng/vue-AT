// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
import {
  getElementList,
  getActionList,
  getFunctionList,
  getProjectList,
  getEquipmentList,
  getSuitStepList,
  getSuitList,
  getPageList
} from '@/api/api'
import Vue from 'vue'

const state = {
  deafultPageId: '',
  curreentPro: '',
  pageData: [],
  elementData: [],
  actionData: [],
  functionData: [],
  projectData: [],
  equipmentData: [],
  testCaseSuitData: [],
  testCaseSuitStepData: [],
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
    SET_PAGEDATA: (state, argsList) => {
    state.pageData = argsList
  },
  CHANGE_PROJECTDATA: (state, args) => {
    state.curreentPro = args
  },
  SET_EQUIPMENTDATA: (state, argsList) => {
    state.equipmentData = argsList
  },
  SET_TESTCASESUITDATA: (state, argsList) => {
    state.testCaseSuitData = argsList
  },
  SET_TESTCASESUITSTEPDATA: (state, argsList) => {
    state.testCaseSuitStepData = argsList
  },

}

const actions = {
  getProjects({commit}) {
    getProjectList().then((res) => {
      let datas = res.data.project_list
      commit('SET_PROJECTDATA', datas)
    })
  },
  getPage({commit, state}){
            getPageList(state.curreentPro.id).then(res => {
          if (res.status == 1) {
            let datas = res.data.page_list
            commit('SET_PAGEDATA', datas)
          } else {
            Vue.$message({
              message: res.message,
              type: 'error'
            })
          }
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
          v.running = v.status
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
  getTestCaseSuitStepData({commit, state},) {
    getSuitStepList(state.curreentPro.id).then(
      res => {

        if (res.data.data_list.length > 0) {
          let data_list = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalRank = v.rank //  will be used when user click the cancel botton
            v.originalCaseTitle = v.case_title
            v.originalSkip = v.skip
            v.originalInputArgs = v.input_args
            return v
          })
          commit('SET_TESTCASESUITSTEPDATA', data_list)
        } else {
          let data_list = res.data.data_list
          commit('SET_TESTCASESUITSTEPDATA', data_list)
        }

      },
      err => {
        console.log(err);
      }
    )
  },
  getTestCaseSuitData({commit, state},) {
    getSuitList(state.curreentPro.id).then(
      res => {
        let data_list = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
            v.originalRank = v.rank //  will be used when user click the cancel botton
            v.originalTestCaseSuitId = v.test_case_suit_id
            return v
          })
        commit('SET_TESTCASESUITDATA', data_list)
      },
      err => {
        console.log(err)
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
