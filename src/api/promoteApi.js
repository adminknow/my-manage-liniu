import axios from "../utils/request";
//分页查询分销员
export function SearchPromoters(data) {
  return axios({
    url: "/api/Promote/SearchPromoters",
    method: "post",
    data,
  });
}

//分页查询分销员下的客户
export function SearchCustomersByPromoter(data) {
  return axios({
    url: "/api/Promote/SearchCustomersByPromoter",
    method: "post",
    data,
  });
}

//分页查询分销客户
export function SearchPromoterCustomers(data) {
  return axios({
    url: "/api/Promote/SearchPromoterCustomers",
    method: "post",
    data,
  });
}

//分页查询分销订单
export function SearchPromoterOrderDetails(data) {
  return axios({
    url: "/api/Promote/SearchPromoterOrderDetails",
    method: "post",
    data,
  });
}
//获取当前券商的分销配置
export function GetPromoteUnit(data) {
  return axios({
    url: "/api/Promote/GetPromoteUnit",
    method: "post",
    data,
  });
}

//新建/修改当前券商的分销配置
export function SavePromoteUnit(data) {
  return axios({
    url: "/api/Promote/SavePromoteUnit",
    method: "post",
    data,
  });
}

//分页查询当前券商下的指定商品的分销配置
export function SearchUnitPromoteGoodses(data) {
  return axios({
    url: "/api/Promote/SearchUnitPromoteGoodses",
    method: "post",
    data,
  });
}
//批量添加当前券商下的指定商品的分销配置
export function BatchAddUnitPromoteGoods(data) {
  return axios({
    url: "/api/Promote/BatchAddUnitPromoteGoods",
    method: "post",
    data,
  });
}
//批量删除当前券商下的指定商品的分销配置
export function BatchDeleteUnitPromoteGoods(data) {
  return axios({
    url: "/api/Promote/BatchDeleteUnitPromoteGoods",
    method: "post",
    data,
  });
}
//强制删除某个分销员下的所有客户
export function DeleteAllCustomersByPromoter(data) {
  return axios({
    url: "/api/Promote/DeleteAllCustomersByPromoter",
    method: "post",
    data,
  });
}
//删除会员的所属分销员
export function DeletePromoterByVip(data) {
  return axios({
    url: "/api/Promote/DeletePromoterByVip",
    method: "post",
    data,
  });
}

//查询某个客户的分销员绑定历史
export function GetPromoterBindHisList(data) {
  return axios({
    url: "/api/Promote/GetPromoterBindHisList",
    method: "post",
    data,
  });
}
//分页查询所有可分销的商品(只有礼牛才能查询)
export function SeachAllPromoteGoodses(data) {
  return axios({
    url: "/api/Promote/SeachAllPromoteGoodses",
    method: "post",
    data,
  });
}

//分页查询分销商的分销配置(只有礼牛才能查询)
export function SeachAllPromoteUnites(data) {
  return axios({
    url: "/api/Promote/SeachAllPromoteUnites",
    method: "post",
    data,
  });
}
//删除分销员
export function DeletePromoter(data) {
  return axios({
    url: "/api/Promote/DeletePromoter",
    method: "post",
    data,
  });
}
//判断券商是否在某个商城下开启了分销
export function IsOpenPromote(data) {
  return axios({
    url: "/api/Promote/IsOpenPromote",
    method: "post",
    data,
  });
}
//手工处理订单的佣金（增加或者删除）
export function ManualPromoterOrderDetail(data) {
  return axios({
    url: "/api/Promote/ManualPromoterOrderDetail",
    method: "post",
    data,
  });
}
