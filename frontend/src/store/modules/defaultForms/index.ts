import { defineStore } from "pinia";
import { toast } from "vue-sonner";

import ApiService from "@/services/ApiService";
import { defaultForms } from "@/services/index";

import Cookies from "js-cookie";

import { useAuthStore } from "../auth/index";

import { errorValidator, User, ILogin} from "@/utils";

export const defaultFormsStore = defineStore("defaultForms", {
  state: () => ({}),
  actions: {
    prepareDataUser(data: User) {
      const token = data.token;
      if (token) {
        Cookies.set("access_token", token, { expires: 3 });
        const authStore = useAuthStore();
        authStore.setUser(data);
      }
    },
    async login(data: ILogin) {
      try {
        const result = await ApiService?.post<User>(defaultForms.routes.login(), data);
        this.prepareDataUser(result.data);
        toast.success("Login realizado com sucesso!");
        return result.data;
      } catch (error) {
        errorValidator(error);
        throw error;
      }
    }
  },
  getters: {},
});
