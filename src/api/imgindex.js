import axios from "axios";
import md5 from "js-md5";
import Cookie from "js-cookie";

import { ElMessage, ElMessageBox } from "element-plus";
// console.log(process.env);
const service = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, //环境变量（package.json 中定义的变量）
});

// request拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  (config) => {
    // let scret = md5('cnew9hcsnzoer');
    const Token = Cookie.get("CookieToken");
    var token = "";
    if (Token) {
      token = Token;
    }
    var num = Date.parse(new Date()) / 1000;
    config.headers["Liniu-Token"] = token; // 请求头中添加tokenid
    config.headers["Content-Type"] = "application/json"; // 设置数据传输方式
    config.data.set("CallAppId", `${import.meta.env.VITE_APP_BASE_API}`);
    config.data.set("Timestamp", num);
    config.data.set("Nonce", num);
    config.headers["Liniu-Signature"] = md5(
      "CallAppId=" +
        `${import.meta.env.VITE_APP_BASE_API}` +
        "&Nonce=" +
        num +
        "&Timestamp=" +
        num +
        "&CallAppSecret=" +
        `${import.meta.env.VITE_CALL_APP_SECRET}`
    ); // 请求头中添加tokenid
    return config;
  },

  (error) => {
    Promise.reject(error);
  }
);
// response拦截器
//简单点说就是每次得到数据前都要经过这里
service.interceptors.response.use(
  (response) => {
    if (response) {
      if (response.data.Code == "10109") {
        router.push("login");
      }
      if (response.data.Code == "10103") {
        Cookie.remove("CookieToken");
        router.push("login");
      }
      return response.data;
    } else {
      Promise.reject(new Error("error"));
    }
  },
  (error) => {
    if (JSON.stringify(error).includes("10109")) {
      MesElMessagesage({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
      // alert("登录已过期，请重新登录！");
      // this.$router.push('/login');
    } else {
      alert(error);
    }
    return Promise.reject(error);
  }
);
export default service;
