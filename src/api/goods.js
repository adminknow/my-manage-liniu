import axios from "../utils/request";

//给商品增加可售数量
export function AddGoodsTotalQty(data) {
  return axios({
    url: "/api/Goods/AddGoodsTotalQty",
    method: "post",
    data,
  });
}
//获取商品分类列表(级联)私域使用
export function GetGoodsCategoryList(data) {
  return axios({
    url: "/api/Goods/GetGoodsCategoryList",
    method: "post",
    data,
  });
}
//新建/修改商品分类
export function SaveGoodsCategory(data) {
  return axios({
    url: "/api/Goods/SaveGoodsCategory",
    method: "post",
    data,
  });
}
//停用商品分类
export function DisableGoodsCategory(data) {
  return axios({
    url: "/api/Goods/DisableGoodsCategory",
    method: "post",
    data,
  });
}
//启用商品分类
export function EnableGoodsCategory(data) {
  return axios({
    url: "/api/Goods/EnableGoodsCategory",
    method: "post",
    data,
  });
}
//获取单个商品分类信息
export function GetGoodsCategory(data) {
  return axios({
    url: "/api/Goods/GetGoodsCategory",
    method: "post",
    data,
  });
}

//分页查询可售商品
export function SearchSellGoodses(data) {
  return axios({
    url: "/api/Goods/SearchSellGoodses",
    method: "post",
    data,
  });
}
//新建/修改可售商品
export function SaveSellGoods(data) {
  return axios({
    url: "/api/Goods/SaveSellGoods",
    method: "post",
    data,
  });
}
//分页查询商品
export function SearchGoodses(data) {
  return axios({
    url: "/api/Goods/SearchGoodses",
    method: "post",
    data,
  });
}
//启用商品
export function EnableGoods(data) {
  return axios({
    url: "/api/Goods/EnableGoods",
    method: "post",
    data,
  });
}
//停用商品
export function DisableGoods(data) {
  return axios({
    url: "/api/Goods/DisableGoods",
    method: "post",
    data,
  });
}
//新建/修改商品
export function SaveGoods(data) {
  return axios({
    url: "/api/Goods/SaveGoods",
    method: "post",
    data,
  });
}
//新建/修改兑换商品1
export function SaveExchangeGoods(data) {
  return axios({
    url: "/api/Goods/SaveExchangeGoods",
    method: "post",
    data,
  });
}
//查询单个商品
export function GetGoods(data) {
  return axios({
    url: "/api/Goods/GetGoods",
    method: "post",
    data,
  });
}
//查询多个商品（不分页）
export function GetGoodsList(data) {
  return axios({
    url: "/api/Goods/GetGoodsList",
    method: "post",
    data,
  });
}
//查询绑定了某个商品的组合商品列表
export function GetBindGoodsList(data) {
  return axios({
    url: "/api/Goods/GetBindGoodsList",
    method: "post",
    data,
  });
}
//分页查询商品的属性
export function SearchProperties(data) {
  return axios({
    url: "/api/Goods/SearchProperties",
    method: "post",
    data,
  });
}
//查询单个商品的属性
export function GetPropertyById(data) {
  return axios({
    url: "/api/Goods/GetPropertyById",
    method: "post",
    data,
  });
}
//新建/修改商品的属性
export function SaveProperty(data) {
  return axios({
    url: "/api/Goods/SaveProperty",
    method: "post",
    data,
  });
}
//新建/修改商品的属性明细
export function SavePropertyDetail(data) {
  return axios({
    url: "/api/Goods/SavePropertyDetail",
    method: "post",
    data,
  });
}
//查询单个商品的SKU
export function GetSkuById(data) {
  return axios({
    url: "/api/Goods/GetSkuById",
    method: "post",
    data,
  });
}
//新建/修改商品的SKU
export function SaveSku(data) {
  return axios({
    url: "/api/Goods/SaveSku",
    method: "post",
    data,
  });
}
//停用商品的SKU
export function DisableSku(data) {
  return axios({
    url: "/api/Goods/DisableSku",
    method: "post",
    data,
  });
}
//启用商品的SKU
export function EnableSku(data) {
  return axios({
    url: "/api/Goods/EnableSku",
    method: "post",
    data,
  });
}
//不分页查询商品的属性列表
export function GetPropertyList(data) {
  return axios({
    url: "/api/Goods/GetPropertyList",
    method: "post",
    data,
  });
}
//获取兑换差异模板列表
export function GetExchangeTemplateList(data) {
  return axios({
    url: "/api/Goods/GetExchangeTemplateList",
    method: "post",
    data,
  });
}
//分页查询商品的库存变动历史
export function SearchGoodsQtyChangeHises(data) {
  return axios({
    url: "/api/Goods/SearchGoodsQtyChangeHises",
    method: "post",
    data,
  });
}
//获取单个兑换差异模板信息
export function GetExchangeTemplate(data) {
  return axios({
    url: "/api/Goods/GetExchangeTemplate",
    method: "post",
    data,
  });
}
//新建/修改兑换差异模板
export function SaveExchangeTemplate(data) {
  return axios({
    url: "/api/Goods/SaveExchangeTemplate",
    method: "post",
    data,
  });
}
//分页查询兑换差异模板
export function SearchExchangeTemplates(data) {
  return axios({
    url: "/api/Goods/SearchExchangeTemplates",
    method: "post",
    data,
  });
}
//启用兑换差异模板
export function EnableExchangeTemplate(data) {
  return axios({
    url: "/api/Goods/EnableExchangeTemplate",
    method: "post",
    data,
  });
}
//停用兑换差异模板
export function DisableExchangeTemplate(data) {
  return axios({
    url: "/api/Goods/DisableExchangeTemplate",
    method: "post",
    data,
  });
}

//分页查询门店的兑换商品的当前库存
export function SearchGoodsQtyUnites(data) {
  return axios({
    url: "/api/Goods/SearchGoodsQtyUnites",
    method: "post",
    data,
  });
}
//分页查询兑换商品的当前库存（含线上和线下）
export function SearchGoodsQtyes(data) {
  return axios({
    url: "/api/Goods/SearchGoodsQtyes",
    method: "post",
    data,
  });
}
//取消商品的兑换差异模板
export function CancelGoodsExchangeTemplate(data) {
  return axios({
    url: "/api/Goods/CancelGoodsExchangeTemplate",
    method: "post",
    data,
  });
}
//修改商品的指数
export function ModifyGoodsIndex(data) {
  return axios({
    url: "/api/Goods/ModifyGoodsIndex",
    method: "post",
    data,
  });
}
//获取公域礼牛商城的商品分类列表(级联)
export function GetPublicGoodsCategoryList(data) {
  return axios({
    url: "/api/Goods/GetPublicGoodsCategoryList",
    method: "post",
    data,
  });
}
//申请将商品上架至公域礼牛商城
export function BatchApplyOnlineGoods(data) {
  return axios({
    url: "/api/Goods/BatchApplyOnlineGoods",
    method: "post",
    data,
  });
}
//批量审批通过商品上架至公域礼牛商城
export function BatchApproveMallGoods(data) {
  return axios({
    url: "/api/Goods/BatchApproveMallGoods",
    method: "post",
    data,
  });
}

//批量拒绝商品上架至公域礼牛商城
export function BatchRejectMallGoods(data) {
  return axios({
    url: "/api/Goods/BatchRejectMallGoods",
    method: "post",
    data,
  });
}
//批量将商品从公域礼牛商城下架
export function BatchOfflineMallGoods(data) {
  return axios({
    url: "/api/Goods/BatchOfflineMallGoods",
    method: "post",
    data,
  });
}
//删除商品分类
export function DeleteGoodsCategory(data) {
  return axios({
    url: "/api/Goods/DeleteGoodsCategory",
    method: "post",
    data,
  });
}
//从景彤同步商品至礼牛自营
export function SynGoodsFromJtgloble(data) {
  return axios({
    url: "/api/Goods/SynGoodsFromJtgloble",
    method: "post",
    data,
  });
}
//上移下移
export function MoveGoodsInCategory(data) {
  return axios({
    url: "/api/Goods/MoveGoodsInCategory",
    method: "post",
    data,
  });
}
//设置商品在某个商城的价格
export function SaveGoodsMallPrice(data) {
  return axios({
    url: "/api/Goods/SaveGoodsMallPrice",
    method: "post",
    data,
  });
}
//查询单个商城下的商品(主要是价格是商城下的价格,指数是商城下的指数)
export function GetMallGoods(data) {
  return axios({
    url: "/api/Goods/GetMallGoods",
    method: "post",
    data,
  });
}
export function SearchMallGoodses(data) {
  return axios({
    url: "/api/Goods/SearchMallGoodses",
    method: "post",
    data,
  });
}
//将商品从礼牛商城/福采商城下架
export function OfflineGoodsToMall(data) {
  return axios({
    url: "/api/Goods/OfflineGoodsToMall",
    method: "post",
    data,
  });
}
//将商品上架至礼牛商城/福采商城
export function ApplyOnlineGoodsToMall(data) {
  return axios({
    url: "/api/Goods/ApplyOnlineGoodsToMall",
    method: "post",
    data,
  });
}
//批量给商品添加某个商城的分类
export function BatchAddCategoryOfGoods(data) {
  return axios({
    url: "/api/Goods/BatchAddCategoryOfGoods",
    method: "post",
    data,
  });
}
//设置商品在某个商城的信息（分类、价格、指数等）
export function SaveGoodsMallInfo(data) {
  return axios({
    url: "/api/Goods/SaveGoodsMallInfo",
    method: "post",
    data,
  });
}
//审批通过商品上架至礼牛商城的申请
export function PassGoodsToMall(data) {
  return axios({
    url: "/api/Goods/PassGoodsToMall",
    method: "post",
    data,
  });
}
//审批不通过商品上架至礼牛商城的申请
export function RejectGoodsToMall(data) {
  return axios({
    url: "/api/Goods/RejectGoodsToMall",
    method: "post",
    data,
  });
}
//从云中鹤获取某个编码的商品信息
export function GetGoodsFromHaoxiny(data) {
  return axios({
    url: "/api/Goods/GetGoodsFromHaoxiny",
    method: "post",
    data,
  });
  //分页查询我的可售商品
} export function SearchMySellGoodses(data) {
  return axios({
    url: "/api/Goods/SearchMySellGoodses",
    method: "post",
    data,
  });
}
//分页查询某个分类下的商品
export function SearchMallGoodsByCategory(data) {
  return axios({
    url: "/api/Goods/SearchMallGoodsByCategory",
    method: "post",
    data,
  });
}
//获取商城的商品分类列表(级联)
export function GetMallGoodsCategoryList(data) {
  return axios({
    url: "/api/Goods/GetMallGoodsCategoryList",
    method: "post",
    data,
  });
}
//分页查询某商城的商品
export function SearchGoodMalls(data) {
  return axios({
    url: "/api/Goods/SearchGoodMalls",
    method: "post",
    data,
  });
}
