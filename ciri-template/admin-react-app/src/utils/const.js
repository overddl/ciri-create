// 注意公共头路由
export const routes = [
  {
    path: "/",
    icon: "icon-home",
    text: "首页",
    component: "/home"
  },
  {
    path: "/news",
    icon: "icon-news",
    text: "新闻",
    component: "/news"
  },
  {
    path: "/user",
    icon: "icon-users",
    text: "用户列表",
    auth: "RoutePrivate",
    component: "/user/list",
    routes: [
      {
        path: "/:id",
        text: "用户详情",
        auth: "RouteAccess",
        component: "/user/detail"
      },
      {
        path: "/add",
        text: "用户添加",
        component: "/user/add"
      }
    ]
  }
]