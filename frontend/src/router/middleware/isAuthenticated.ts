/* eslint-disable no-unused-vars */
import { RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/store";
import Cookies from "js-cookie";

export function isAuthenticated(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: (override?: string | false) => void
) {
  const cookie = Cookies.get("access_token");
  const authStore = useAuthStore();

  function proceed() {
    if (cookie && !authStore.isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  }

  if (cookie && !authStore.isAuthenticated) {
    // If there's a token but the user isn't authenticated, fetch user data
    authStore.getMe().finally(proceed);
  } else {
    proceed();
  }
}
