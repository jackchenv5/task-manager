import { createRouter, createWebHistory } from 'vue-router'

import BaseLayout from '@/layouts/Base.vue'

import { useUserStore } from '@/stores/user'

// 使用Vite的glob特性动态加载模块
const modules = import.meta.glob('./modules/*.js', { eager: true })
const baseRoutes = []
 
Object.values(modules).forEach(mod => {
  baseRoutes.push(...mod.default)
})

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

  // 检查登录状态
  // 1.先从store 中检查是否登陆
        // 已登录 跳过
        // 未登录，会自动重定向到登陆界面
  const userStore = useUserStore()
  userStore.checkLoginAndStore()
  // 本地记录当前用户信息  
  next()
})

export default router