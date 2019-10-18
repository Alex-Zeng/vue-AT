import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Function from '@/components/function/Function'
import Equipment from '@/components/equipment/Equipment'
import Pages from '@/components/project/Pages'
import Case from '@/components/project/Case'
import tabViews from '@/components/common/tabViews'
import caseSuit from '@/components/project/caseSuit'
import Cookies from 'js-cookie'

Vue.use(Router)
Vue.prototype.$cookies = Cookies

export const constantRoutes = [
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
        meta: {title: '页面'}
      },
      {
        path: 'projects/:id/cases/:case_id',
        component: Case,
        name: 'case',
        props: true,
        meta: {title: '用例'}
      },
      {
        path: 'function',
        component: Function,
        name: 'function',
        props: true,
        meta: {title: '操作方法'}
      },
      {
        path: 'equipment',
        component: Equipment,
        name: 'equipment',
        props: true,
        meta: {title: '设备列表'}
      },
      {
        path: 'projects/:id/suit/:suit_id',
        component: caseSuit,
        name: 'suit',
        props: true,
        meta: {title: '用例集'}
      },
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
