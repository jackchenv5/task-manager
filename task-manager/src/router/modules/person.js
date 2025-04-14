// 会员中心模块路由
export default [
    {
      path: "/person",
      name: "person",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/person/index',
      children: [
        {
          path: "index",
          name: "index",
          component: () => import("@/views/person/Index.vue"),
          meta: { cacheable: true }
        },
      ]
    }
  ]