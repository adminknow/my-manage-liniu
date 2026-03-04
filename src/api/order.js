import axios from "../utils/request";

// 配送单
//分页查询配送单
export function SearchDeliverOrders(data) {
  return axios({
    url: "/api/Order/SearchDeliverOrders",
    method: "post",
    data,
  });
}
//查询单个配送单的详情
export function GetDeliverOrderById(data) {
  return axios({
    url: "/api/Order/GetDeliverOrderById",
    method: "post",
    data,
  });
}
//更新单个配送单的收货信息和备注
export function SaveDeliverOrder(data) {
  return axios({
    url: "/api/Order/SaveDeliverOrder",
    method: "post",
    data,
  });
}
//给配送单添加快递单号,准备发货
export function AddDeliverOrderExpress(data) {
  return axios({
    url: "/api/Order/AddDeliverOrderExpress",
    method: "post",
    data,
  });
}
//修改配送单里的兑换券的兑换商品
export function ModifyDeliverOrderTicketExchangeGoods(data) {
  return axios({
    url: "/api/Order/ModifyDeliverOrderTicketExchangeGoods",
    method: "post",
    data,
  });
}
//批量审批配送单
export function ApproveDeliverOrders(data) {
  return axios({
    url: "/api/Order/ApproveDeliverOrders",
    method: "post",
    data,
  });
}

//获取单据的操作历史
export function GetBillOperateHises(data) {
  return axios({
    url: "/api/Bill/GetBillOperateHises",
    method: "post",
    data,
  });
}
//--------------------------兑换点API----------------------------------------//
//分页查询券模板的线下提货点
export function SearchTicketTemplatePickupUnites(data) {
  return axios({
    url: "/api/Ticket/SearchTicketTemplatePickupUnites",
    method: "post",
    data,
  });
}
//给券模板增加线下提货点
export function AddTicketTemplatePickupUnites(data) {
  return axios({
    url: "/api/Ticket/AddTicketTemplatePickupUnites",
    method: "post",
    data,
  });
}
//删除券模板的线下提货点
export function DeleteTicketTemplatePickupUnites(data) {
  return axios({
    url: "/api/Ticket/DeleteTicketTemplatePickupUnites",
    method: "post",
    data,
  });
}

//分页查询线下提货单
export function SearchPickupDeliverOrders(data) {
  return axios({
    url: "/api/Order/SearchPickupDeliverOrders",
    method: "post",
    data,
  });
}
//获取快递单的物流详情
export function GetDeliverOrderExpressDetail(data) {
  return axios({
    url: "/api/Order/GetDeliverOrderExpressDetail",
    method: "post",
    data,
  });
}

//线下对提货单进行发货
export function PickupDeliverOrder(data) {
  return axios({
    url: "/api/Order/PickupDeliverOrder",
    method: "post",
    data,
  });
}

//取消配送单
export function CancelDeliverOrder(data) {
  return axios({
    url: "/api/Order/CancelDeliverOrder",
    method: "post",
    data,
  });
}

//按日期、门店、券统计线下提货数据
export function StatPickupDeliverOrderByPickup(data) {
  return axios({
    url: "/api/Order/StatPickupDeliverOrderByPickup",
    method: "post",
    data,
  });
}
//按日期、门店、券、兑换商品统计线下预约提货数据
export function StatPickupDeliverOrderByPrebookPickup(data) {
  return axios({
    url: "/api/Order/StatPickupDeliverOrderByPrebookPickup",
    method: "post",
    data,
  });
}
//查询某个兑换商品的未发货的配送单数量
export function CountExpressDeliverOrderByUndeliverGoods(data) {
  return axios({
    url: "/api/Order/CountExpressDeliverOrderByUndeliverGoods",
    method: "post",
    data,
  });
}
//缺货商品调换（配送单）
export function ModifyExpressDeliverOrderExchangeGoodsByOutofStock(data) {
  return axios({
    url: "/api/Order/ModifyExpressDeliverOrderExchangeGoodsByOutofStock",
    method: "post",
    data,
  });
}
//查询某个兑换商品的未发货的提货单数量
export function CountPickupDeliverOrderByUndeliverGoods(data) {
  return axios({
    url: "/api/Order/CountPickupDeliverOrderByUndeliverGoods",
    method: "post",
    data,
  });
}

//缺货商品调换（提货单）
export function ModifyPickupDeliverOrderExchangeGoodsByOutofStock(data) {
  return axios({
    url: "/api/Order/ModifyPickupDeliverOrderExchangeGoodsByOutofStock",
    method: "post",
    data,
  });
}

//手工关闭已收货的配送单
export function CloseDeliverOrder(data) {
  return axios({
    url: "/api/Order/CloseDeliverOrder",
    method: "post",
    data,
  });
}

//强制取消配送单(已审批的/已发货的/已收货的)
export function ForceCancelDeliverOrder(data) {
  return axios({
    url: "/api/Order/ForceCancelDeliverOrder",
    method: "post",
    data,
  });
}
//删除快递单号
export function DeleteDeliverOrderExpress(data) {
  return axios({
    url: "/api/Order/DeleteDeliverOrderExpress",
    method: "post",
    data,
  });
}
//批量退回审批配送单
export function RejectApproveDeliverOrders(data) {
  return axios({
    url: "/api/Order/RejectApproveDeliverOrders",
    method: "post",
    data,
  });
}
//按日期、门店、券、兑换商品统计线下预约提货数据
export function StatPickupGoodsDeliverOrderByPickup(data) {
  return axios({
    url: "/api/Order/StatPickupGoodsDeliverOrderByPickup",
    method: "post",
    data,
  });
}

//批量审批订单
export function ApproveOrders(data) {
  return axios({
    url: "/api/Order/ApproveOrders",
    method: "post",
    data,
  });
}
//查询单个的详情
export function GetOrderById(data) {
  return axios({
    url: "/api/Order/GetOrderById",
    method: "post",
    data,
  });
}
//更新订单的收货信息和备注
export function ModifyOrderContactInfo(data) {
  return axios({
    url: "/api/Order/ModifyOrderContactInfo",
    method: "post",
    data,
  });
}
//给订单添加快递单号,准备发货
export function AddOrderExpress(data) {
  return axios({
    url: "/api/Order/AddOrderExpress",
    method: "post",
    data,
  });
}
//订单退款
export function RefundOrder(data) {
  return axios({
    url: "/api/Order/RefundOrder",
    method: "post",
    data,
  });
}
//更新订单的发票信息
export function UpdateOrderInvoice(data) {
  return axios({
    url: "/api/Order/UpdateOrderInvoice",
    method: "post",
    data,
  });
}
//删除快递单号
export function DeleteOrderExpress(data) {
  return axios({
    url: "/api/Order/DeleteOrderExpress",
    method: "post",
    data,
  });
}

//分页查询订单
export function SearchOrders(data) {
  return axios({
    url: "/api/Order/SearchOrders",
    method: "post",
    data,
  });
}
//关闭未付款的订单
export function CancelOrder(data) {
  return axios({
    url: "/api/Order/CancelOrder",
    method: "post",
    data,
  });
}
//给付款成功但未拿到全部券的订单手工发放券
export function SendOrderTicket(data) {
  return axios({
    url: "/api/Order/SendOrderTicket",
    method: "post",
    data,
  });
}
//按客户、券、兑换日期统计数据
export function StatByCustomerAndTicketTemplate(data) {
  return axios({
    url: "/api/Order/StatByCustomerAndTicketTemplate",
    method: "post",
    data,
  });
}
export function StatTotalByCustomerAndTicketTemplate(data) {
  return axios({
    url: "/api/Order/StatTotalByCustomerAndTicketTemplate",
    method: "post",
    data,
  });
}
//分页查询礼盒订单
export function SearchGiftPackageOrders(data) {
  return axios({
    url: "/api/Order/SearchGiftPackageOrders",
    method: "post",
    data,
  });
}
//财务在线下收到客户的付款后，登记付款信息。
export function GiftPackageOrderPayByEbank(data) {
  return axios({
    url: "/api/Order/GiftPackageOrderPayByEbank",
    method: "post",
    data,
  });
}
//关闭未付款的礼盒订单
export function CancelGiftPackageOrder(data) {
  return axios({
    url: "/api/Order/CancelGiftPackageOrder",
    method: "post",
    data,
  });
}
//从云中鹤同步订单的快递单
export function SynOrderLogisticsFromHaoxiny(data) {
  return axios({
    url: "/api/Order/SynOrderLogisticsFromHaoxiny",
    method: "post",
    data,
  });
}
//从云中鹤同步订单的卡密
export function SynOrderCardFromHaoxiny(data) {
  return axios({
    url: "/api/Order/SynOrderCardFromHaoxiny",
    method: "post",
    data,
  });
}
//给兑换券的支付订单的支付人推送支付通知
export function SendPayTicketOrderPayNotify(data) {
  return axios({
    url: "/api/Order/SendPayTicketOrderPayNotify",
    method: "post",
    data,
  });
}
//准备给订单开票，此时锁定订单的开票信息，不允许修改
export function PrepareIssueOrderInvoice(data) {
  return axios({
    url: "/api/Order/PrepareIssueOrderInvoice",
    method: "post",
    data,
  });
}
