export default {
  path: "/demand",
  meta: {
    title: "需求池"
  },
  children: [
    {
      path: "/demand/index",
      name: "Demand",
      component: () => import("@/views/demand/index.vue"),
      meta: {
        title: "需求池"
      }
    }
  ]
} as RouteConfigsTable;
