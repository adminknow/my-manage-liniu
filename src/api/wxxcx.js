import axios from "../utils/request";
//分页查询小程序Appid列表
export function GetAllAccount(data) {
  return axios({
    url: "/api/Wxxcx/GetAllAccount",
    method: "post",
    data,
  });
}
//分页查询小程序客服
export function SearchKfes(data) {
  return axios({
    url: "/api/Wxxcx/SearchKfes",
    method: "post",
    data,
  });
}
//新增小程序客服
export function SaveKf(data) {
  return axios({
    url: "/api/Wxxcx/SaveKf",
    method: "post",
    data,
  });
}
//删除小程序客服
export function DeleteKf(data) {
  return axios({
    url: "/api/Wxxcx/DeleteKf",
    method: "post",
    data,
  });
}
//分页查询小程序粉丝
export function SearchWxxcxFanses(data) {
  return axios({
    url: "/api/Wxxcx/SearchWxxcxFanses",
    method: "post",
    data,
  });
}
//设置/取消某个小程序客服为客服管理员
export function SetKfAdmin(data) {
  return axios({
    url: "/api/Wxxcx/SetKfAdmin",
    method: "post",
    data,
  });
}
//创建活动的小程序码
export function CreateActScene(data) {
  return axios({
    url: "/api/Wxxcx/CreateActScene",
    method: "post",
    data,
  });
}
//分页查询活动小程序码
export function SearchActScenes(data) {
  return axios({
    url: "/api/Wxxcx/SearchActScenes",
    method: "post",
    data,
  });
}
//启用活动的场景码
export function EnableActScene(data) {
  return axios({
    url: "/api/Wxxcx/EnableActScene",
    method: "post",
    data,
  });
}
//停用活动的场景码
export function DisableActScene(data) {
  return axios({
    url: "/api/Wxxcx/DisableActScene",
    method: "post",
    data,
  });
}
