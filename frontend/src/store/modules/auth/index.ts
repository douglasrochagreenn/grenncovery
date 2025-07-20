import { defineStore } from "pinia";

import ApiService from "@/services/ApiService";
import { auth } from "@/services/index";

import Cookies from "js-cookie";
import { toast } from "vue-sonner";

import { User } from "@/utils";
import { errorValidator } from "@/utils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    authenticated: false as boolean,
    oldRoute: "" as string,
    openAddress: false as boolean,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    async getMe() {
   
      try {
        const result = await ApiService?.get<User>(auth.routes.getMe());
        this.setAuthenticated();
        this.setUser(result.data);
        return result;
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    },
    async logout() {
      try {
        this.user = {};
        Cookies.remove("access_token");
        this.setAuthenticated();
        toast.success("Logout realizado com sucesso!");
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    },
    setAuthenticated() {
      const cookies = Cookies.get("access_token") ? !!Cookies.get("access_token") : false;
      this.authenticated = cookies;
    },
    setOldRoute(route: string) {
      this.oldRoute = route;
    },
    async updateUser(ediUser: User) {
      try {
        if (ediUser._id) {
          const result = await ApiService?.put<User>(auth.routes.editProfile(ediUser?._id), ediUser);
          this.setUser(ediUser);
          return result;
        }
      } catch (error) {
        errorValidator(error);
        throw error;
      } finally {
        this.openAddress = false;
      }
    },
    async profilePicture(picture: File) {
      try {
        const formData = new FormData();
        formData.append("file", picture);
        const result = await ApiService?.post<User>(auth.routes.profilePicture(), formData);
        const currentUser = Object.assign({}, this.user) as User;
        currentUser.profileImage = result.data.profileImage;
        this.setUser(currentUser);
        toast.success("Avatar atualizado com sucesso!");
        return result;
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    },
  },
  getters: {
    isAuthenticated: (state): boolean =>
      state.authenticated ?? (Cookies.get("access_token") ? !!Cookies.get("access_token") : state.authenticated),
    getUser: (state): object => state.user,
    getOldRoute: (state): string => state.oldRoute,
  },
});
