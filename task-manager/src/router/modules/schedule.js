// 会员中心模块路由
export default [
    {
      path: "/schedule",
      name: "schedule",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/schedule/index',
      children: [
        {
          path: "index",
          name: "ScheduleIndex",
          component: () => import("@/views/schedule/Index.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]