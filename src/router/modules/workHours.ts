export default {
  path: "/workHours",
  meta: {
    title: "工时统计",
    rank: 4
  },
  children: [
    {
      path: "/workHours/index",
      name: "WorkHours",
      component: () => import("@/views/workHours/index.vue"),
      meta: {
        title: "工时统计"
      }
    }
  ]
} as RouteConfigsTable;
