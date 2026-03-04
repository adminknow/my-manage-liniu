import axios from "../utils/request";
//分页查询商城营销活动
export function SearchMallActes(data) {
  return axios({
    url: "/api/Market/SearchMallActes",
    method: "post",
    data,
  });
}
//新建/修改商城营销活动
export function SaveMallAct(data) {
  return axios({
    url: "/api/Market/SaveMallAct",
    method: "post",
    data,
  });
}
//获取商城营销活动详情
export function GetMallAct(data) {
  return axios({
    url: "/api/Market/GetMallAct",
    method: "post",
    data,
  });
}
//审核通过商城营销活动
export function PassMallAct(data) {
  return axios({
    url: "/api/Market/PassMallAct",
    method: "post",
    data,
  });
}
//取消(审批不通过)商城营销活动
export function CancelMallAct(data) {
  return axios({
    url: "/api/Market/CancelMallAct",
    method: "post",
    data,
  });
}
//暂停审批通过的商城营销活动
export function PauseMallAct(data) {
  return axios({
    url: "/api/Market/PauseMallAct",
    method: "post",
    data,
  });
}
//恢复暂停的商城营销活动至审批通过
export function RestoreMallAct(data) {
  return axios({
    url: "/api/Market/RestoreMallAct",
    method: "post",
    data,
  });
}
