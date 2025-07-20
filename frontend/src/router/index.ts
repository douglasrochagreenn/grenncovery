import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "../router/middleware/index";

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
    path: "/abandoned-cart",
    name: "AbandonedCart",
    component: () => import("@/views/AbandonedCart.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/q&a",
    name: "Q&A",
    component: () => import("@/views/Q&A.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/whatsapp-config",
    name: "WhatsAppConfig",
    component: () => import("@/views/WhatsAppConfig.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/message-history/:id/:client_cellphone",
    name: "MessageHistory",
    component: () => import("@/views/MessageHistory.vue"),
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
