import { GetSign } from "@/utils/signature";
import axios from "../utils/request";
//分页查询某个会员的券
export function SearchVipTicketes(data) {
  return axios({
    url: "/api/Vip/SearchVipTicketes",
    method: "post",
    data,
  });
}
//分页查询会员
export function SearchVips(data) {
  return axios({
    url: "/api/Vip/SearchVips",
    method: "post",
    data,
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////

//分页查询会员帐户的提现记录
export function SearchVipAccountWithdrawRecords(data) {
  return axios({
    url: "/api/Vip/SearchVipAccountWithdrawRecords",
    method: "post",
    data,
  });
}
//查询某个会员的帐户列表(不分页)
export function GetVipAccountList(data) {
  return axios({
    url: "/api/Vip/GetVipAccountList",
    method: "post",
    data,
  });
}
//分页查询某个会员的某个帐户的交易流水
export function SearchVipAccountTranses(data) {
  return axios({
    url: "/api/Vip/SearchVipAccountTranses",
    method: "post",
    data,
  });
}
//分页查询会员的转赠批次
export function SearchGiveBatches(data) {
  return axios({
    url: "/api/Vip/SearchGiveBatches",
    method: "post",
    data,
  });
}

//获取某个转赠批次的券明细
export function GetGiveBatchDetails(data) {
  return axios({
    url: "/api/Vip/GetGiveBatchDetails",
    method: "post",
    data,
  });
}

//获取某个转赠批次的领取历史
export function GetGiveBatchTailHises(data) {
  return axios({
    url: "/api/Vip/GetGiveBatchTailHises",
    method: "post",
    data,
  });
}
//分页查询微信支付商户号下的交易帐单
export function SearchMerchantTradeBills(data) {
  return axios({
    url: "/api/Wxpay/SearchMerchantTradeBills",
    method: "post",
    data,
  });
}

//按日期统计某段时间内，统计每个门店的线下收款和付款金额
export function SumHandworkTransByUnitAndDate(data) {
  return axios({
    url: "/api/Vip/SumHandworkTransByUnitAndDate",
    method: "post",
    data,
  });
}
//查询某段时间内的线下收款和付款明细
export function GetHandworkTransDetail(data) {
  return axios({
    url: "/api/Vip/GetHandworkTransDetail",
    method: "post",
    data,
  });
}
//分页查询会员等级
export function SearchVipTypes(data) {
  return axios({
    url: "/api/Common/SearchVipTypes",
    method: "post",
    data,
  });
}
//查询会员等级
export function GetVipTypeList(data) {
  return axios({
    url: "/api/Common/GetVipTypeList",
    method: "post",
    data,
  });
}
//启用会员等级
export function EnableVipType(data) {
  return axios({
    url: "/api/Common/EnableVipType",
    method: "post",
    data,
  });
}
//停用会员等级
export function DisableVipType(data) {
  return axios({
    url: "/api/Common/DisableVipType",
    method: "post",
    data,
  });
}
//获取会员等级详情(查看/修改会员等级时调用)
export function GetVipType(data) {
  return axios({
    url: "/api/Common/GetVipType",
    method: "post",
    data,
  });
}
//新建/修改会员等级
export function SaveVipType(data) {
  return axios({
    url: "/api/Common/SaveVipType",
    method: "post",
    data,
  });
}
//手工调整某个会员的某个帐户的余额
export function AdjustVipAccountAmount(data) {
  GetSign("AdjustVipAccountAmount", data);
  return axios({
    url: "/api/Vip/AdjustVipAccountAmount",
    method: "post",
    data,
  });
}
//分页查询笔记
export function SearchNotes(data) {
  return axios({
    url: "/api/Vip/SearchNotes",
    method: "post",
    data,
  });
}
//获取单个笔记的详情
export function GetNote(data) {
  return axios({
    url: "/api/Vip/GetNote",
    method: "post",
    data,
  });
}
//审批通过一条笔记
export function PassNote(data) {
  return axios({
    url: "/api/Vip/PassNote",
    method: "post",
    data,
  });
}
//审批不通过一条笔记
export function UnpassNote(data) {
  return axios({
    url: "/api/Vip/UnpassNote",
    method: "post",
    data,
  });
}
//删除一条笔记
export function DeleteMyNote(data) {
  return axios({
    url: "/api/Vip/DeleteMyNote",
    method: "post",
    data,
  });
}
//下架一条笔记
export function RemoveMyNote(data) {
  return axios({
    url: "/api/Vip/RemoveMyNote",
    method: "post",
    data,
  });
}
//分页查询某个会员的某个帐户的交易流水
export function SearchVipPromoteAccountTrans(data) {
  return axios({
    url: "/api/Vip/SearchVipPromoteAccountTrans",
    method: "post",
    data,
  });
}
