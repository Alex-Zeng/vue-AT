// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {post, get} from './api/index'
import '@/assets/style/reset.css'
Vue.use(ElementUI)
import router from './router'
// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

