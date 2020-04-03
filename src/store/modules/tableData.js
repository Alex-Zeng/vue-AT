// 如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
import {
  getElementList,
  getActionList,
  getFunctionList,
  getProjectList,
  getEquipmentList,
  getSuitStepList,
  getSuitList,
  getPageList,
  getCaseList,
  putCase,
  putPage,
  putSuit,
  deleteSuit,
  deletePage,
  deleteCase,
  postPage,
  postCase,
  postSuit,
  getESList,
  getLog,
} from '@/api/api'
import Vue from 'vue'

const state = {
  visible: 1,
  deafultPageId: '',
  curreentPro: '',
  curreentProId: '',
  asideTitle: '',
  pageData: [],
  asideTreeData: [],
  caseData: [],
  elementData: [],
  actionData: [],
  functionData: [],
  projectData: [],
  equipmentData: [],
  testCaseSuitData: [],
  testCaseSuitStepData: [],
  equipmentTestCaseSuitData: [],
  logData: [],
  logCount: [],
  asideDrawer:false,
  reportBreadcrumbData: {"suit": {}, "case": {}, "step": {}},
}
const getters = {}

const mutations = {
  SET_VISIBLE_NAV: (state, nav) => {
    switch (nav) {
      case 'page':
        state.visible = 1
        state.asideTitle = '页面对象PO'
        break;
      case 'case':
        state.visible = 2
        state.asideTitle = '用例'
        break;
      case 'suit':
        state.visible = 3
        state.asideTitle = '用例集'
        break;
      default:
        state.visible = 0
        break;
    }
  },

  SET_ELEMENTDATA: (state, argsList) => {
    state.elementData = argsList
  },
  SET_ACTIONDATA: (state, argsList) => {
    state.actionData = argsList
  },
  SET_ASIDETREEDATA: (state, argsList) => {
    state.asideTreeData = argsList
  },
  SET_FUNCTIONDATA: (state, argsList) => {
    state.functionData = argsList
  },
  SET_PROJECTDATA: (state, argsList) => {
    state.projectData = argsList
    if (argsList.length > 0) {
      state.curreentPro = argsList[0]
      state.curreentProId = argsList[0].id
    }
  },
  SET_PAGEDATA: (state, argsList) => {
    state.pageData = argsList
    if (state.visible == 1) {
      state.asideTreeData = argsList
    }
  },
  SET_CASEDATA: (state, argsList) => {
    state.caseData = argsList
    if (state.visible == 2) {
      state.asideTreeData = argsList
    }
  },
  CHANGE_PROJECTDATA: (state, args) => {
    state.curreentPro = args
  },
  SET_EQUIPMENTDATA: (state, argsList) => {
    state.equipmentData = argsList
  },
  SET_TESTCASESUITDATA: (state, argsList) => {
    state.testCaseSuitData = argsList
    if (state.visible == 3) {
      state.asideTreeData = argsList
    }
  },
  SET_TESTCASESUITSTEPDATA: (state, argsList) => {
    state.testCaseSuitStepData = argsList
  },
  SET_ESDATA: (state, argsList) => {
    state.equipmentTestCaseSuitData = argsList
  },
  SET_LOGDATA: (state, argsList) => {
    state.logData = argsList
  },
  SET_LOCOUNT: (state, argsList) => {
    state.logCount = argsList
  },
  SET_RB: (state, argsList) => {
    state.reportBreadcrumbData = argsList
  },
}

const actions = {
  getProjects({commit}) {
    getProjectList().then((res) => {
      let datas = res.data.project_list
      commit('SET_PROJECTDATA', datas)
    })
  },
  setNavVisible({dispatch, commit, state}, nav) {
    state.asideDrawer = true
    commit('SET_VISIBLE_NAV', nav)
    switch (nav) {
      case 'page':
        dispatch('getPage')
        break;
      case 'case':
        dispatch('getCaseData')
        break;
      case 'suit':
        dispatch('getTestCaseSuitData')
        break;
      default:
        state.asideDrawer = false
        break;
    }
  },
  getPage({commit, state}) {
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
  getCaseData({commit, state}) {
    getCaseList(state.curreentPro.id).then(
      res => {
        let datas = res.data.data_list
        commit('SET_CASEDATA', datas)
      },
      err => {
        console.log(err)
      }
    )
  },
  editSelectData({dispatch, state}, args) {
    let proId = state.curreentProId
    if (state.visible == 1) {
      putPage(proId, args.edit_id, {"parentId": args.parentId, "title": args.title}).then(
        res => {
          dispatch('getPage')
        }
      )
    } else if (state.visible == 2) {
      putCase(proId, args.edit_id, {"parentId": args.parentId, "title": args.title}).then(
        res => {
          dispatch('getCaseData')
        }
      )
    } else if (state.visible == 3) {
      putSuit(proId, args.edit_id, {"parentId": args.parentId, "title": args.title}).then(
        res => {
          dispatch('getTestCaseSuitData')
        }
      )
    }
  },
  addAsideTreeData({dispatch, state}, args) {
    let proId = state.curreentProId
    if (state.visible == 1) {
      postPage(proId, args).then(
        res => {
          dispatch('getPage')
        }
      )
    } else if (state.visible == 2) {
      postCase(proId, args).then(
        res => {
          dispatch('getCaseData')
        }
      )
    } else if (state.visible == 3) {
      postSuit(proId, args).then(
        res => {
          dispatch('getTestCaseSuitData')
        }
      )
    }
  },
  deleteSelectData({dispatch, state}, delete_id) {
    let proId = state.curreentProId
    if (state.visible == 1) {
      deletePage(proId, delete_id).then(
        res => {
          dispatch('getPage')
        }
      )
    } else if (state.visible == 2) {
      deleteCase(proId, delete_id).then(
        res => {
          dispatch('getCaseData')
        }
      )
    } else if (state.visible == 3) {
      deleteSuit(proId, delete_id).then(
        res => {
          dispatch('getTestCaseSuitData')
        }
      )
    }
  },
  getElementData({commit}, args) {
    getElementList(args.projectId, args.pageId).then(res => {
      if (res.status == 1) {
        let datas = res.data.data_list.map(v => {
          Vue.set(v, 'edit', false)
          v.originalTitle = v.title
          v.originalTypeAndroid = v.type_for_android
          v.originalLocAndroid = v.loc_for_android
          v.originalTypeIos = v.type_for_ios
          v.originalLocIos = v.loc_for_ios
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
  getActionData({commit, state}, pageId) {
    getActionList(state.curreentProId, pageId).then(res => {
        if (res.status == 1) {
          let datas = res.data.data_list.map(v => {
            Vue.set(v, 'edit', false)
            v.originalTitle = v.title
            v.originalElementTitle = v.ele_title
            v.originalFunctionTitle = v.fun_title
            return v
          })
          commit('SET_ACTIONDATA', datas)
        }
      }
    )
  },
  getFunctionData({commit, state}) {
    getFunctionList().then(res => {
        if (res.status == 1) {
          let datas = res.data.data_list.map(v => {
            v.edit = v.false
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
  getTestCaseSuitStepData({commit, state}, suitId) {
    getSuitStepList(state.curreentPro.id, suitId).then(
      res => {
        if (res.status == 1) {
          let data_list = res.data.data_list.map(v => {
            v.edit = false //  will be used when user click the cancel botton
            v.originalRank = v.rank
            v.originalCaseTitle = v.case_title
            v.originalSkip = v.skip
            v.originalInputArgs = v.input_args
            v.originalInputKeys = v.input_keys
            return v
          })
          commit('SET_TESTCASESUITSTEPDATA', data_list)
        }
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
            v.edit = false
            v.originalTitle = v.title
            v.originalSetting_args = v.setting_args
            v.originalRemoteHost = v.remoteHost
            v.originalRemotePort = v.remotePort
            v.originalCronTimes = v.cron_times
            v.originalCronStatus = v.cron_status
            return v
          })
          commit('SET_EQUIPMENTDATA', datas)
        }
      }
    )
  },
  getESData({commit}, EId) {
    getESList(EId).then((res) => {
      let data = res.data.data_list.map(v => {
        v.originalRank = v.rank //  will be used when user click the cancel botton
        v.edit = false
        v.originalTestCaseSuitId = v.test_case_suit_id
        return v
      })
      commit('SET_ESDATA', data)
    })
  },
  getESLogData({commit}, args) {

    getLog(args.type, args.id).then((res) => {
      let data = res.data.data_list
      let dataCount = res.data.data_count
      commit('SET_LOGDATA', data)
      commit('SET_LOCOUNT', dataCount)
    })
  },
  setrb({commit,state}, args) {
    let name = args.name
    let id = args.id
    switch (name) {
      case 'suit':
        state.reportBreadcrumbData.suit.map(v => {
          v.id = id
          return v
        } )
    }

    commit('SET_RB', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
