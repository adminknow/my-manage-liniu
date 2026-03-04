import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/css/icon.css";
import "./assets/css/main.css";
import "./assets/css/color-dark.css";
import "./assets/icon/iconfont.css";

/*自建公用js */
import common from "./utils/common";

const app = createApp(App);
installElementPlus(app);
app.config.globalProperties.$common = common;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
import { ElMessage, ElMessageBox } from "element-plus";
app.use(store).use(router).mount("#app");
