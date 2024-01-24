export default {
  path: "/versionInfo",
  meta: {
    title: "版本管理",
    rank: 3
  },
  children: [
    {
      path: "/versionInfo/index",
      name: "VersionInfo",
      component: () => import("@/views/versionInfo/index.vue"),
      meta: {
        title: "版本管理"
      }
    }
  ]
} as RouteConfigsTable;
