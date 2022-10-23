import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    redirect:'/home/welcome',
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('../views/Welcome.vue'),
      },
      {
        path: '/home/users',
        name: 'users',
        component: ()=> import('../views/User.vue')
      },
      {
        path: '/home/rights',
        name: 'rights',
        component: () => import('../views/power/Rights.vue'),
      },
      {
        path: '/home/roles',
        name: 'roles',
        component: () => import('../views/power/Roles.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
export default router;
