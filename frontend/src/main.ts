import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store/store";
import PhosphorIcons from "@phosphor-icons/vue";
import { createHead } from "@vueuse/head";
import "./assets/index.css";

import layoutHome from "@/layout/LayoutHome.vue";
import layoutForm from "@/layout/LayoutForm.vue";
import layoutDashboard from "@/layout/LayoutDashboard.vue";

const app = createApp(App);
const head = createHead();

app.component("layoutHome", layoutHome);
app.component("layoutForm", layoutForm);
app.component("layoutDashboard", layoutDashboard);

app.use(router);
app.use(pinia);
app.use(PhosphorIcons);
app.use(head);

app.mount("#app");
