////////////////////////////////////////////
//商城
import axios from "../utils/request";


//批量添加标签下的对象(字符型)
export function BatchAddObject(data) {
  return axios({
    url: "/api/Tag/BatchAddObject",
    method: "post",
    data,
  });
}
//批量移除标签下的对象(字符型)
export function BatchRemoveObject(data) {
  return axios({
    url: "/api/Tag/BatchRemoveObject",
    method: "post",
    data,
  });
}
//移动一个标签下的对象(字符型)
export function MoveObject(data) {
  return axios({
    url: "/api/Tag/MoveObject",
    method: "post",
    data,
  });
}
//分页查询广告
export function SearchAds(data) {
  return axios({
    url: "/api/Common/SearchAds",
    method: "post",
    data,
  });
}

//启用广告
export function EnableAd(data) {
  return axios({
    url: "/api/Common/EnableAd",
    method: "post",
    data,
  });
}
//停用广告
export function DisableAd(data) {
  return axios({
    url: "/api/Common/DisableAd",
    method: "post",
    data,
  });
}
//获取广告详情(查看/修改广告时调用)
export function GetAd(data) {
  return axios({
    url: "/api/Common/GetAd",
    method: "post",
    data,
  });
}
//新建/修改广告
export function SaveAd(data) {
  return axios({
    url: "/api/Common/SaveAd",
    method: "post",
    data,
  });
}
//删除广告
export function DeleteAd(data) {
  return axios({
    url: "/api/Common/DeleteAd",
    method: "post",
    data,
  });
}


//获取单个标签组
export function GetTaggroup(data) {
  return axios({
    url: "/api/Tag/GetTaggroup",
    method: "post",
    data,
  });
}
//查询标签下的标签列表
export function GetTagListByGroupId(data) {
  return axios({
    url: "/api/Tag/GetTagListByGroupId",
    method: "post",
    data,
  });
}
//新建/修改标签
export function SaveTag(data) {
  return axios({
    url: "/api/Tag/SaveTag",
    method: "post",
    data,
  });
}
//停用标签
export function DisableTag(data) {
  return axios({
    url: "/api/Tag/DisableTag",
    method: "post",
    data,
  });
}
//启用标签
export function EnableTag(data) {
  return axios({
    url: "/api/Tag/EnableTag",
    method: "post",
    data,
  });
}
//获取单个标签
export function GetTag(data) {
  return axios({
    url: "/api/Tag/GetTag",
    method: "post",
    data,
  });
}
