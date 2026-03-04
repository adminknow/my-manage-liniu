import axios from "../utils/request";
//分页查询券发放单的领取名单（通过名单领取）
export function SearchTicketBillTakeStaffs(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillTakeStaffs",
    method: "post",
    data,
  });
}

//分页查询券发放单
export function SearchTicketBillTakes(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillTakes",
    method: "post",
    data,
  });
}
//获取券发放单详情
export function GetTicketBillTake(data) {
  return axios({
    url: "/api/Bill/GetTicketBillTake",
    method: "post",
    data,
  });
}

//新建/修改券发放单
export function SaveTicketBillTake(data) {
  return axios({
    url: "/api/Bill/SaveTicketBillTake",
    method: "post",
    data,
  });
}

//分页查询券销售单
export function SearchTicketBillSales(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillSales",
    method: "post",
    data,
  });
}
//新建/修改销售单
export function SaveTicketBillSale(data) {
  return axios({
    url: "/api/Bill/SaveTicketBillSale",
    method: "post",
    data,
  });
}
//激活销售单/发放单下的所有券
export function ActiveTicketByTicketBill(data) {
  return axios({
    url: "/api/Bill/ActiveTicketByTicketBill",
    method: "post",
    data,
  });
}
//获取销售单详情
export function GetTicketBillSale(data) {
  return axios({
    url: "/api/Bill/GetTicketBillSale",
    method: "post",
    data,
  });
}
//审核通过销售单
export function PassTicketBillSale(data) {
  return axios({
    url: "/api/Bill/PassTicketBillSale",
    method: "post",
    data,
  });
}
//取消(审批不通过)销售单
export function CancelTicketBillSale(data) {
  return axios({
    url: "/api/Bill/CancelTicketBillSale",
    method: "post",
    data,
  });
}
//审核通过券发放单
export function PassTicketBillTake(data) {
  return axios({
    url: "/api/Bill/PassTicketBillTake",
    method: "post",
    data,
  });
}
//审核不通过券发放单
export function CancelTicketBillTake(data) {
  return axios({
    url: "/api/Bill/CancelTicketBillTake",
    method: "post",
    data,
  });
}
//给券发放单的所有人或者某个员工的手机发送领券通知短信
export function SendTicketTakeSMSNotify(data) {
  return axios({
    url: "/api/Bill/SendTicketTakeSMSNotify",
    method: "post",
    data,
  });
}
//给券发放单的所有人或者某个员工的邮箱发送领券通知邮件
export function SendTicketTakeEmailNotify(data) {
  return axios({
    url: "/api/Bill/SendTicketTakeEmailNotify",
    method: "post",
    data,
  });
}
//给券销售单的领取手机发送领券短信通知
export function SendTicketBillSaleSMSNotify(data) {
  return axios({
    url: "/api/Bill/SendTicketBillSaleSMSNotify",
    method: "post",
    data,
  });
}
//分页查询券单据下的券明细
export function SearchTicketBillDetails(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillDetails",
    method: "post",
    data,
  });
}
//获取券单据下的券模板明细
export function GetTicketBillTicketTemplateDetails(data) {
  return axios({
    url: "/api/Bill/GetTicketBillTicketTemplateDetails",
    method: "post",
    data,
  });
}
//分页查询券退还单
export function SearchTicketBillReturns(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillReturns",
    method: "post",
    data,
  });
}
//新建/修改券退还单
export function SaveTicketBillReturn(data) {
  return axios({
    url: "/api/Bill/SaveTicketBillReturn",
    method: "post",
    data,
  });
}
//获取券退还单详情
export function GetTicketBillReturn(data) {
  return axios({
    url: "/api/Bill/GetTicketBillReturn",
    method: "post",
    data,
  });
}
//审核通过券退还单
export function PassTicketBillReturn(data) {
  return axios({
    url: "/api/Bill/PassTicketBillReturn",
    method: "post",
    data,
  });
}
//取消(审批不通过)券退还单
export function CancelTicketBillReturn(data) {
  return axios({
    url: "/api/Bill/CancelTicketBillReturn",
    method: "post",
    data,
  });
}
//分页查询商品单据
export function SearchGoodsBills(data) {
  return axios({
    url: "/api/Bill/SearchGoodsBills",
    method: "post",
    data,
  });
}
//新建/修改商品单据
export function SaveGoodsBills(data) {
  return axios({
    url: "/api/Bill/SaveGoodsBills",
    method: "post",
    data,
  });
}

//审核通过商品单据
export function PassGoodsBill(data) {
  return axios({
    url: "/api/Bill/PassGoodsBill",
    method: "post",
    data,
  });
}

//取消(审批不通过)商品单据
export function CancelGoodsBill(data) {
  return axios({
    url: "/api/Bill/CancelGoodsBill",
    method: "post",
    data,
  });
}
//获取商品单据的详情
export function GetGoodsBills(data) {
  return axios({
    url: "/api/Bill/GetGoodsBills",
    method: "post",
    data,
  });
}

//--------------------------申请单据接口----------------------------------------//
//分页查询申请单据
export function SearchApplyBills(data) {
  return axios({
    url: "/api/Bill/SearchApplyBills",
    method: "post",
    data,
  });
}
//关闭申请单据
export function CloseApplyBill(data) {
  return axios({
    url: "/api/Bill/CloseApplyBill",
    method: "post",
    data,
  });
}
//根据库存盘点单生成入库单，出库单
export function GenGoodsInOutBillByCheck(data) {
  return axios({
    url: "/api/Bill/GenGoodsInOutBillByCheck",
    method: "post",
    data,
  });
}
//分页查询券活动领取单
export function SearchTicketBillActes(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillActes",
    method: "post",
    data,
  });
}
//获取券活动领取单详情
export function GetTicketBillAct(data) {
  return axios({
    url: "/api/Bill/GetTicketBillAct",
    method: "post",
    data,
  });
}
//新建/修改券活动领取单
export function SaveTicketBillAct(data) {
  return axios({
    url: "/api/Bill/SaveTicketBillAct",
    method: "post",
    data,
  });
}
//审核通过券活动领取单
export function PassTicketBillAct(data) {
  return axios({
    url: "/api/Bill/PassTicketBillAct",
    method: "post",
    data,
  });
}
//取消(审批不通过)券活动领取单
export function CancelTicketBillAct(data) {
  return axios({
    url: "/api/Bill/CancelTicketBillAct",
    method: "post",
    data,
  });
}
//获取券活动领取单的领取小程序码
export function GetTicketBillActWxxcxQRCode(data) {
  return axios({
    url: "/api/Bill/GetTicketBillActWxxcxQRCode",
    method: "post",
    data,
  });
}
//分页查询点卡充值单
export function SearchTicketBillRecharges(data) {
  return axios({
    url: "/api/Bill/SearchTicketBillRecharges",
    method: "post",
    data,
  });
}
//获取点卡充值单详情
export function GetTicketBillRecharge(data) {
  return axios({
    url: "/api/Bill/GetTicketBillRecharge",
    method: "post",
    data,
  });
}
//新建/修改点卡充值单
export function SaveTicketBillRecharge(data) {
  return axios({
    url: "/api/Bill/SaveTicketBillRecharge",
    method: "post",
    data,
  });
}
//审核通过券发放单
export function PassTicketBillRecharge(data) {
  return axios({
    url: "/api/Bill/PassTicketBillRecharge",
    method: "post",
    data,
  });
}
//取消(审批不通过)券发放单
export function CancelTicketBillRecharge(data) {
  return axios({
    url: "/api/Bill/CancelTicketBillRecharge",
    method: "post",
    data,
  });
}
//给券销售单的重置领取暗码
export function ResetTicketBillSaleTakePass(data) {
  return axios({
    url: "/api/Bill/ResetTicketBillSaleTakePass",
    method: "post",
    data,
  });
}
