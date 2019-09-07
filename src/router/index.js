import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Function from '@/components/Function'
import Pages from '@/components/Menu/Pages'
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
          path: 'projects/:id',
          component: resolve => require(['@/components/menu/projectList'], resolve),
          name: 'project',
          children: [{
            path: 'pages',
            component: Pages,
            name: 'pages',
            props: true,
          }, {
            path: 'pages/:page_id',
            component: Pages,
            name: 'page',
            props: true,
          },]
        },

      ]
    },
    {
      path: '/function',
      component: Function,
      name: 'function'
    },
  ]
})

router.beforeEach((to, from, next) => {
  /* 页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  /* 判断该路由是否需要登录权限 */
  if (to.matched.some(record => record.meta.requireAuth)) {
    //是否登录
    get('/admin/islogin')
      .then(function (response) {
        //未登录
        if (response.status == 2) {
          next({
            path: '/login',
          })
        } else {
          //已登录
          next()
        }
      })
      .catch(function (error) {
        // Toast(error.data.msg);
      });

  }
  next();
})

export default router
