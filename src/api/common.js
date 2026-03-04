import axios from "../utils/request";
//--------------------------公共接口----------------------------------------//
//获取省列表
export function GetProvinceList(data) {
  return axios({
    url: "/api/Common/GetProvinceList",
    method: "post",
    data,
  });
}
//获取对象的文件列表
export function GetObjectFileList(data) {
  return axios({
    url: "/api/Common/GetObjectFileList",
    method: "post",
    data,
  });
}

//获取城市列表
export function GetCityList(data) {
  return axios({
    url: "/api/Common/GetCityList",
    method: "post",
    data,
  });
}
//获取区列表
export function GetDistrictList(data) {
  return axios({
    url: "/api/Common/GetDistrictList",
    method: "post",
    data,
  });
}
//获取应用系统列表
export function GetDictionaryDetailList(data) {
  return axios({
    url: "/api/Common/GetDictionaryDetailList",
    method: "post",
    data,
  });
}
//获取省/市/区列表
export function GetAreaList(data) {
  return axios({
    url: "/api/Common/GetAreaList",
    method: "post",
    data,
  });
}
//修改本人的登录密码
export function ModifyPwd(data) {
  return axios({
    url: "/api/User/ModifyPwd",
    method: "post",
    data,
  });
}

//重置某人的登录密码
export function ResetPwd(data) {
  return axios({
    url: "/api/User/ResetPwd",
    method: "post",
    data,
  });
}

//查询协议
export function GetAgreementList(data) {
  return axios({
    url: "/api/Common/GetAgreementList",
    method: "post",
    data,
  });
}

//获取协议详情(查看/修改协议时调用)
export function GetAgreement(data) {
  return axios({
    url: "/api/Common/GetAgreement",
    method: "post",
    data,
  });
}

//新建/修改协议
export function SaveAgreement(data) {
  return axios({
    url: "/api/Common/SaveAgreement",
    method: "post",
    data,
  });
}
//设置某个协议为当前类型的当前版本（一个类型只允许一个版本的协议为当前版本）
export function SaveCurrentAgreement(data) {
  return axios({
    url: "/api/Common/SaveCurrentAgreement",
    method: "post",
    data,
  });
}
//发送短信验证码
export function SendSMSCode(data) {
  return axios({
    url: "/api/Common/SendSMSCode",
    method: "post",
    data,
  });
}
//绑定手机号
export function BindCell(data) {
  return axios({
    url: "/api/User/BindCell",
    method: "post",
    data,
  });
}
//获取绑定后台登录帐号/直接通过后台门店帐号登录的小程序码
export function GetPageWxxcxQRCode(data) {
  return axios({
    url: "/api/Unit/GetPageWxxcxQRCode",
    method: "post",
    data,
  });
}
//查询品牌(用下拉搜索)
export function GetBrandList(data) {
  return axios({
    url: "/api/Common/GetBrandList",
    method: "post",
    data,
  });
}
//获取礼牛商城的分类与云中鹤的商品分类的映射
export function GetHaoxinyGoodsCategoryMaps(data) {
  return axios({
    url: "/api/Common/GetHaoxinyGoodsCategoryMaps",
    method: "post",
    data,
  });
}
//获取礼牛商城的分类与云中鹤的虚拟商品分类的映射
export function GetHaoxinyVirtualGoodsCategoryMaps(data) {
  return axios({
    url: "/api/Common/GetHaoxinyVirtualGoodsCategoryMaps",
    method: "post",
    data,
  });
}
//获取对象的评论列表
export function GetCommentes(data) {
  return axios({
    url: "/api/Common/GetCommentes",
    method: "post",
    data,
  });
}
