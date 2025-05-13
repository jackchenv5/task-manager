// 会员中心模块路由
export default [
    {
      path: "/system",
      name: "system",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/system/index',
      children: [
        {
          path: "index",
          name: "systemIndex",
          component: () => import("@/views/system/Index.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]