export default {
  path: "/versionReport",
  meta: {
    title: "版本周报",
    rank: 5
  },
  children: [
    {
      path: "/versionReport/index",
      name: "VersionReport",
      component: () => import("@/views/versionReport/index.vue"),
      meta: {
        title: "版本周报"
      }
    }
  ]
} as RouteConfigsTable;
