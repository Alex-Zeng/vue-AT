import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Function from '@/components/function/Function'
import Equipment from '@/components/equipment/Equipment'
import ExecuteTest from '@/components/executeTest/ExecuteTest'
import Pages from '@/components/project/Pages'
import Case from '@/components/project/Case'
import tabViews from '@/components/common/tabViews'
import caseSuit from '@/components/project/caseSuit'
import Report from '@/components/report/Report'
import SuitLog from '@/components/report/SuitLog'
import Cookies from 'js-cookie'
import TestLog from "../components/report/TestLog";
import CaseLog from "../components/report/CaseLog";
import StepLog from "../components/report/StepLog";

Vue.use(Router)
Vue.prototype.$cookies = Cookies
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
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
    name: 'home',
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
        meta: {title: 'PO'}
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
        meta: {title: '设备列表'},

      },
      {
        path: 'projects/:id/suit/:suit_id',
        component: caseSuit,
        name: 'suit',
        props: true,
        meta: {title: '用例集'}
      },
      {
        path: 'equipment/:e_id/executeTest',
        component: ExecuteTest,
        name: 'executeTest',
        props: true,
        meta: {title: '测试执行'}
      },
      {
        path: 'report',
        component: Report,
        name: 'report',
        redirect: 'report/testLog',
        props: true,
        meta: {title: '测试报告'}
      },
      {
        path: 'report/testLog',
        component: TestLog,
        name: 'testLog',
        props: true,
        meta: {title: '测试报告'}
      },
      {
        path: 'testLog/:id/SuitLod',
        component: SuitLog,
        name: 'suitLog',
        props: true,
        meta: {title: '测试报告'}
      },
      {
        path: 'testLog/:id/SuitLod/:suitId/CaseLog',
        component: CaseLog,
        name: 'caseLog',
        props: true,
        meta: {title: '测试报告'}
      },
      {
        path: 'testLog/:id/SuitLod/:suitId/CaseLog/:caseId/StepLog',
        component: StepLog,
        name: 'stepLog',
        props: true,
        meta: {title: '测试报告'}
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


export default router
