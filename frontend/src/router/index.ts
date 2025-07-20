import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import {
  isAuthenticated,
} from "../router/middleware/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
