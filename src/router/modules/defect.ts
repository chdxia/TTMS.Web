export default {
  path: "/defect",
  meta: {
    title: "BUG管理",
    rank: 2
  },
  children: [
    {
      path: "/defect/index",
      name: "Defect",
      component: () => import("@/views/defect/index.vue"),
      meta: {
        title: "BUG管理"
      }
    }
  ]
} as RouteConfigsTable;
