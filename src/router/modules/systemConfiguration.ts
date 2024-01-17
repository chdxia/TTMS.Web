export default {
  path: "/systemConfiguration",
  meta: {
    title: "系统配置",
    rank: 9
  },
  children: [
    {
      path: "/systemConfiguration/userManagement",
      name: "UserManagement",
      component: () =>
        import("@/views/systemConfiguration/userManagement/index.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "/systemConfiguration/groupManagement",
      name: "GroupManagement",
      component: () =>
        import("@/views/systemConfiguration/groupManagement/index.vue"),
      meta: {
        title: "分组管理"
      }
    },
    {
      path: "/systemConfiguration/authorityManagement",
      name: "AuthorityManagement",
      component: () =>
        import("@/views/systemConfiguration/authorityManagement/index.vue"),
      meta: {
        title: "权限管理"
      }
    }
  ]
} as RouteConfigsTable;
