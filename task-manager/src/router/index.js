import { createRouter, createWebHistory } from 'vue-router'

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

export default router