// 会员中心模块路由
export default [
    {
      path: "/dapeng",
      name: "dapeng",
      redirect:'/dapeng/t1',
      children: [
        {
          path: "t1",
          name: "t1",
          component: () => import("@/views/dapeng/Api.vue"),
          // meta: { cacheable: true }
        },
      ]
    }
  ]