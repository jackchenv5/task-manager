// 统计模块路由
export default [
    {
      path: "/stat",
      name: "stat",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/stat/index',
      children: [
        {
          path: "index",
          name: "statIndex",
          component: () => import("@/views/stat/Index.vue"),
          meta: { cacheable: true }
        },
      ]
    }
  ]