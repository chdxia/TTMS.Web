export default {
  path: "/autoTestLog",
  meta: {
    title: "自动化测试日志",
    rank: 6
  },
  children: [
    {
      path: "/autoTestLog/index",
      name: "AutoTestLog",
      component: () => import("@/views/autoTestLog/index.vue"),
      meta: {
        title: "自动化测试日志"
      }
    }
  ]
} as RouteConfigsTable;
