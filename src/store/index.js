import { createStore } from "vuex";

import global from "./modules/global.js";
import user from "./modules/user.js";
import tags from "./modules/tags.js";
import ticket from "./modules/ticket.js";

export default createStore({
  // 公共模板直接在这里展开就可以
  ...global,
  modules: {
    user,
    tags,
    ticket
  },
});
