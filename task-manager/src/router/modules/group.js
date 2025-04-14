// 会员中心模块路由
export default [
    {
      path: "/group",
      name: "group",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/group/index',
      children: [
        {
          path: "index",
          name: "GroupIndex",
          component: () => import("@/views/group/Index.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]