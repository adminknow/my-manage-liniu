import axios from "@/api/index";
//登录
export function login(data) {
  return axios({
    url: "/api/wf/manage/login",
    method: "post",
    data,
  });
}
