// 后台管理模块路由
export default [
    {
      path: "/admin",
      name: "AdminLayout",
      component: () => import("@/layouts/Base.vue"),
      meta: { requiresAuth: true, title: "管理后台" },
      children: [
        {
          path: "user",
          name: "user",
          component: () => import("@/views/admin/User.vue"),
          meta: { icon: "dashboard" }
        },
      ]
    }
  ]