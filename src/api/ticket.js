import axios from "../utils/request";

export function SearchTicketes(data) {
  return axios({
    url: "/api/Ticket/SearchTicketes",
    method: "post",
    data,
  });
}
//获取单张券的详情
export function GetTicket(data) {
  return axios({
    url: "/api/Ticket/GetTicket",
    method: "post",
    data,
  });
}
//获取单张券的密码
export function GetTicketPass(data) {
  return axios({
    url: "/api/Ticket/GetTicketPass",
    method: "post",
    data,
  });
}
//获取单张券的操作历史
export function GetTicketOpHises(data) {
  return axios({
    url: "/api/Ticket/GetTicketOpHises",
    method: "post",
    data,
  });
}

//批量激活/作废/挂起/恢复券
export function BatchOpTicketes(data) {
  return axios({
    url: "/api/Ticket/BatchOpTicketes",
    method: "post",
    data,
  });
}

//分页查询券模板
export function SearchTicketTemplates(data) {
  return axios({
    url: "/api/Ticket/SearchTicketTemplates",
    method: "post",
    data,
  });
}
//分页查询券模板批次
export function SearchTicketTemplateBatchs(data) {
  return axios({
    url: "/api/Ticket/SearchTicketTemplateBatchs",
    method: "post",
    data,
  });
}
//获取单个券模板批次信息
export function GetTicketTemplateBatch(data) {
  return axios({
    url: "/api/Ticket/GetTicketTemplateBatch",
    method: "post",
    data,
  });
}
//新建/修改券模板批次
export function SaveTicketTemplateBatch(data) {
  return axios({
    url: "/api/Ticket/SaveTicketTemplateBatch",
    method: "post",
    data,
  });
}
//获取单个券模板信息
export function GetTicketTemplateById(data) {
  return axios({
    url: "/api/Ticket/GetTicketTemplateById",
    method: "post",
    data,
  });
}
//给券模板增发数量
export function AddTicketTemplateCount(data) {
  return axios({
    url: "/api/Ticket/AddTicketTemplateCount",
    method: "post",
    data,
  });
}
//新建/修改券模板(非商品)
export function SaveTicketTemplate(data) {
  return axios({
    url: "/api/Ticket/SaveTicketTemplate",
    method: "post",
    data,
  });
}

//停用券模板
export function DisableTicketTemplate(data) {
  return axios({
    url: "/api/Ticket/DisableTicketTemplate",
    method: "post",
    data,
  });
}
//删除券模板
export function DeleteTicketTemplate(data) {
  return axios({
    url: "/api/Ticket/DeleteTicketTemplate",
    method: "post",
    data,
  });
}
//获取券模板列表(不分页,只返回ID和标题)
export function GetTicketTemplateList(data) {
  return axios({
    url: "/api/Ticket/GetTicketTemplateList",
    method: "post",
    data,
  });
}
//获取有效的券模板列表(不分页,只返回ID和标题)
export function GetMyValidTicketTemplateList(data) {
  return axios({
    url: "/api/Ticket/GetMyValidTicketTemplateList",
    method: "post",
    data,
  });
}

//--------------------------品牌------------------------------------//
//分页查询品牌
export function SearchBrands(data) {
  return axios({
    url: "/api/Common/SearchBrands",
    method: "post",
    data,
  });
}
//启用品牌
export function EnableBrand(data) {
  return axios({
    url: "/api/Common/EnableBrand",
    method: "post",
    data,
  });
}
//停用品牌
export function DisableBrand(data) {
  return axios({
    url: "/api/Common/DisableBrand",
    method: "post",
    data,
  });
}
//获取品牌详情(查看/修改品牌时调用)
export function GetBrand(data) {
  return axios({
    url: "/api/Common/GetBrand",
    method: "post",
    data,
  });
}
//新建/修改品牌
export function SaveBrand(data) {
  return axios({
    url: "/api/Common/SaveBrand",
    method: "post",
    data,
  });
}
//删除品牌
export function DeleteBrand(data) {
  return axios({
    url: "/api/Common/DeleteBrand",
    method: "post",
    data,
  });
}
//--------------------------配送模板------------------------------------//
//获取配送模板列表
export function GetExpressTemplateList(data) {
  return axios({
    url: "/api/Unit/GetExpressTemplateList",
    method: "post",
    data,
  });
}
//获取单个配送模板信息
export function GetExpressTemplate(data) {
  return axios({
    url: "/api/Unit/GetExpressTemplate",
    method: "post",
    data,
  });
}
//新建/修改配送模板
export function SaveExpressTemplate(data) {
  return axios({
    url: "/api/Unit/SaveExpressTemplate",
    method: "post",
    data,
  });
}
//启用配送模板
export function EnableExpressTemplate(data) {
  return axios({
    url: "/api/Unit/EnableExpressTemplate",
    method: "post",
    data,
  });
}
//停用配送模板
export function DisableExpressTemplate(data) {
  return axios({
    url: "/api/Unit/DisableExpressTemplate",
    method: "post",
    data,
  });
}
//--------------------------发券------------------------------------//

//根据券码获取单张券的详情
export function GetTicketByCode(data) {
  return axios({
    url: "/api/Ticket/GetTicketByCode",
    method: "post",
    data,
  });
}
//线下兑换券
export function PickupTicketByCode(data) {
  return axios({
    url: "/api/Ticket/PickupTicketByCode",
    method: "post",
    data,
  });
}
//店员线下批量兑换券
export function BatchPickupTicketes(data) {
  return axios({
    url: "/api/Ticket/BatchPickupTicketes",
    method: "post",
    data,
  });
}
//店员线下批量兑换券(带SKU)
export function BatchPickupTicketesWithSku(data) {
  return axios({
    url: "/api/Ticket/BatchPickupTicketesWithSku",
    method: "post",
    data,
  });
}

//查询含有某个兑换商品的多选券列表
export function GetTicketTemplateListByExchangeGoods(data) {
  return axios({
    url: "/api/Ticket/GetTicketTemplateListByExchangeGoods",
    method: "post",
    data,
  });
}

//分页查询储值卡的交易流水
export function SearchAccountTransesByTicket(data) {
  return axios({
    url: "/api/Ticket/SearchAccountTransesByTicket",
    method: "post",
    data,
  });
}

//分页查询券模板的数量
export function SearchTicketTemplateQty(data) {
  return axios({
    url: "/api/Ticket/SearchTicketTemplateQty",
    method: "post",
    data,
  });
}
//用户电话批量兑换券(带SKU)
export function BatchExchangeTicketesWithSkuByCell(data) {
  return axios({
    url: "/api/Ticket/BatchExchangeTicketesWithSkuByCell",
    method: "post",
    data,
  });
}

//获取某张券包的券下的券明细列表
export function GetTicketesByPackageTicketId(data) {
  return axios({
    url: "/api/Ticket/GetTicketesByPackageTicketId",
    method: "post",
    data,
  });
}
//取消某个人添加的单张券
export function CancelAddTicket(data) {
  return axios({
    url: "/api/Ticket/CancelAddTicket",
    method: "post",
    data,
  });
}
//更新单张券的有效期和兑换期
export function UpdateTicketDate(data) {
  return axios({
    url: "/api/Ticket/UpdateTicketDate",
    method: "post",
    data,
  });
}
//批量转移券
export function BatchMoveTicketes(data) {
  return axios({
    url: "/api/Ticket/BatchMoveTicketes",
    method: "post",
    data,
  });
}
