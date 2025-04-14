import { createRouter, createWebHistory } from 'vue-router'
import { checkLogin } from '@/api/login/login'
import { getDataApi } from '@/api/data/data'

import BaseLayout from '@/layouts/Base.vue'
// 使用Vite的glob特性动态加载模块
const modules = import.meta.glob('./modules/*.js', { eager: true })
const baseRoutes = []
console.log('modules',modules)  
Object.values(modules).forEach(mod => {
  baseRoutes.push(...mod.default)
})

console.log(baseRoutes)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: BaseLayout,
    },
    ...baseRoutes,
    // 404路由需放在最后
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/error/404.vue'),
      meta: { hidden: true }
    }
  ]
})

// 注册路由守卫，作为权限验证使用
router.beforeEach(async (to, from, next) => {
  const  isAuthenticated = true
  const perm = {}

  console.log('checkLogin1',checkLogin)
  console.log('getDataApi1',getDataApi)
  // checkLogin()
  getDataApi()

  console.log('进入路由守卫,来自|访问',from.path,to.path)
  // 1. 检查登录状态（推荐从 Vuex 获取）
  // 1.先从store 中检查是否登陆
        // 已登录 跳过
        // 未登录，跳转登陆界面
  // 3. 处理未登录访问受保护路由
  
  if (!isAuthenticated) {
    // 重定向到登陆界面
  } 
  // 5. 正常放行
 else {
    next()
  }
})

export default router