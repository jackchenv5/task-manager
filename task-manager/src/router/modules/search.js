// 会员中心模块路由
export default [
    {
      path: "/search",
      name: "search",
      component: () => import("@/layouts/Base.vue"),
      redirect:'/search/index',
      children: [
        {
          path: "index",
          name: "searchIndex",
          component: () => import("@/views/search/Index.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]