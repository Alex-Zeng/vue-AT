import Vuex from 'vuex'
import Vue from 'vue'
import tableData from './modules/tableData'
import tabViews from './modules/tabViews'
import asideNav from './modules/asideNav'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
      tableData,
      tabViews,
      asideNav
    }
})

export default store
