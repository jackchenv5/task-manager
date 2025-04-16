// 会员中心模块路由
export default [
    {
      path: "/project",
      name: "project",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/project/index',
      children: [
        {
          path: "index",
          name: "ProjectIndex",
          component: () => import("@/views/project/Index.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]