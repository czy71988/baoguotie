import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
// import yewujieshao from '../components/content/yewujieshao.vue'
// import dailibaobei from '../components/content/dailibaobei.vue'
// import kehubaobei from '../components/content/kehubaobei.vue'
// import zhikebaobei from '../components/content/zhikebaobei.vue'
import zhixingbaobei from '../components/content/zhixingbaobei.vue'
import device from '@/utils/device'
// import { Form } from 'vant'
// import zhikeReportBatchAdd from '@/components/batchOperateComponents/ZhikeReportBatchAdd.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'enter', redirect: device.isMobile ? '/mb/login' : '/login' },
    { path: '/index',
      component: Index,
      name: 'index',
      children: [
        { path: 'yewujieshao', component: () => import('@/components/content/yewujieshao'), name: 'yewujieshao' },
        { path: 'dailibaobei', component: () => import('@/components/content/dailibaobei'), name: 'dailibaobei' },
        { path: 'kehubaobei', component: () => import('@/components/content/kehubaobei'), name: 'kehubaobei' },
        { path: 'zhikebaobei', component: () => import('@/components/content/zhikebaobei'), name: 'zhikebaobei' },
        { path: 'expressCarReport', component: () => import('@/views/report/ExpressCarReport.vue'), name: 'expressCarReport' },
        { path: 'zhikeReportBatchAdd', component: () => import('@/components/batchOperateComponents/ZhikeReportBatchAdd.vue'), name: 'zhikeReportBatchAdd' },
        { path: 'yewuReportBatchAdd', component: () => import('@/components/batchOperateComponents/YewuReportBatchAdd.vue'), name: 'yewuReportBatchAdd' },
        // { path: 'zhikeReportBatchAdd', component: () => import('@/components/batchOperateComponents/ZhikeReportBatchAdd.vue'), name: 'zhikeReportBatchAdd' },
        { path: 'zhixingbaobei', component: zhixingbaobei, name: 'zhixingbaobei' }
      ]
    },
    // { path: '/zhikeReportBatchAdd', component: zhikeReportBatchAdd, name: 'zhikeReportBatchAdd' },
    // { path: '/zhikeReportBatchAdd', component: () => import('@/components/batchOperateComponents/ZhikeReportBatchAdd.vue'), name: 'zhikeReportBatchAdd' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/mb',
      component: () => import('@/App.vue'),
      name: 'mb',
      redirect: '/mb/login',
      children: [
        { path: 'login', component: () => import('@/views/LoginMb.vue'), name: 'loginMb' },
        { path: 'updatepwd', component: () => import('@/views/UpdatePwdMb.vue'), name: 'updatePwdMb' },
        { path: 'register', component: () => import('@/views/RegisterMb.vue'), name: 'registerMb' },
        { path: 'index', component: () => import('@/views/IndexMb.vue'), name: 'indexMb' },
        { path: 'expressCardReport', component: () => import('@/views/mb/ExpressCarReportMb.vue'), name: 'expressCarReportMb' }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (from.path === '/' && to.name === 'loginMb') {
    if (localStorage.getItem('phone')) {
      next({ name: 'indexMb', replace: true })
      return
    }
  } else if (from.path === '/' && to.name === 'login') {
    if (sessionStorage.getItem('uid')) {
      next({ name: 'index', replace: true })
    }
  }
  next()
})

// 创建一个理由对象
export default router
