// 会员中心模块路由
export default [
    {
      path: "/test",
      name: "test",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/test/api',
      children: [
        {
          path: "api",
          name: "teatApi",
          component: () => import("@/views/test/Api.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]