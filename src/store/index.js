import Vuex from 'vuex'
import Vue from 'vue'
import tableData from './modules/tableData'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
      tableData
    }
})

export default store
