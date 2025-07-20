import { defineStore } from "pinia";

import ApiService from "@/services/ApiService";
import { auth } from "@/services/index";

import Cookies from "js-cookie";
import { toast } from "vue-sonner";

import { errorValidator, ISendLogin } from "@/utils";

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginResponseData;
}

export interface ILoginResponseData {
  user: IUser;
  token: string;
  expiresIn: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      _id: "",
      name: "",
      email: "",
      role: "",
      isActive: false,
      lastLogin: "",
      createdAt: "",
      updatedAt: "",
    } as IUser,
    authenticated: false as boolean,
    oldRoute: "" as string,
    openAddress: false as boolean,
  }),
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
    async login(data: ISendLogin) {
      try {
        const result = await ApiService?.post<ILoginResponseData>(
          auth.routes.login(),
          data
        );
        const token = result?.data.token;
        Cookies.set("access_token", token, { expires: 3 });
        toast.success("Login realizado com sucesso!");
        this.setUser(result.data.user);
        return result.data;
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    },
    async getMe() {
      try {
        const result = await ApiService?.get<ILoginResponseData>(
          auth.routes.profile()
        );
        this.setAuthenticated();
        this.setUser(result.data.user);
        return result;
      } catch (error) {
        console.error("getMe error:", error);
        errorValidator(error);
        throw error;
      }
    },
    async logout() {
      try {
        this.user = {
          _id: "",
          name: "",
          email: "",
          role: "",
          isActive: false,
          lastLogin: "",
          createdAt: "",
          updatedAt: "",
        };
        Cookies.remove("access_token");
        this.setAuthenticated();
        toast.success("Logout realizado com sucesso!");
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    },
    setAuthenticated() {
      const cookies = Cookies.get("access_token")
        ? !!Cookies.get("access_token")
        : false;
      this.authenticated = cookies;
    },
    setOldRoute(route: string) {
      this.oldRoute = route;
    },
  },
  getters: {
    isAuthenticated: (state): boolean =>
      state.authenticated ??
      (Cookies.get("access_token")
        ? !!Cookies.get("access_token")
        : state.authenticated),
    getUser: (state): IUser => state.user,
    getOldRoute: (state): string => state.oldRoute,
  },
});
