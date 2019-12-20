import Vuex from 'vuex'
import Vue from 'vue'
import tableData from './modules/tableData'
import tabViews from './modules/tabViews'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
      tableData,
      tabViews,
    }
})

export default store
