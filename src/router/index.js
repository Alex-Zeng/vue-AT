import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Function from '@/components/function/Function'
import Pages from '@/components/project/Pages'
import Case from '@/components/project/Case'
import caseSuit from '@/components/project/caseSuit'
import Cookies from 'js-cookie'
import {get} from '@/api/index.js'

Vue.use(Router)
Vue.prototype.$cookies = Cookies

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/home',
      // component: Home,
      // meta: {
      //   requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
      // }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: '首页',
        requireAuth: true
      },
      children: [
        {
          path: 'projects/:id/pages/:page_id',
          component: Pages,
          name: 'page',
          props: true,
        },
        {
          path: 'projects/:id/cases/:case_id',
          component: Case,
          name: 'case',
          props: true,
        },
                {
          path: 'projects/:id/suit/:suit_id',
          component: caseSuit,
          name: 'suit',
          props: true,
        },
        {
          path: '/function',
          component: Function,
          name: 'function',
          props: true,
          // children: []
        },
      ]
    },

  ]
})


export default router
