import axios from "../utils/request";
//登陆
export function Login(data) {
  return axios({
    url: "/api/User/Login",
    method: "post",
    data,
  });
}
//--------------------------权限接口----------------------------------------//
export function GetMyMenuList(data) {
  return axios({
    url: "/api/Right/GetMyMenuList",
    method: "post",
    data,
  });
}
//判断当前人是否拥有某个权限
export function HasRight(data) {
  return axios({
    url: "/api/Right/HasRight",
    method: "post",
    data,
  });
}
//判断当前人是否拥有某个权限(可以传多个值)
export function HasRightes(data) {
  return axios({
    url: "/api/Right/HasRightes",
    method: "post",
    data,
  });
}

//选择角色
export function SelectLoginRole(data) {
  return axios({
    url: "/api/User/SelectLoginRole",
    method: "post",
    data,
  });
}
export function GetUserLoginRoleList(data) {
  return axios({
    url: "/api/User/GetUserLoginRoleList",
    method: "post",
    data,
  });
}
export function GetAppList(data) {
  return axios({
    url: "/api/Right/GetAppList",
    method: "post",
    data,
  });
}
export function GetMyRole(data) {
  return axios({
    url: "/api/Right/GetMyRole",
    method: "post",
    data,
  });
}
export function GetSubRightList(data) {
  return axios({
    url: "/api/Right/GetSubRightList",
    method: "post",
    data,
  });
}
export function SaveRight(data) {
  return axios({
    url: "/api/Right/SaveRight",
    method: "post",
    data,
  });
}
export function GetRight(data) {
  return axios({
    url: "/api/Right/GetRight",
    method: "post",
    data,
  });
}
export function GetRole(data) {
  return axios({
    url: "/api/Right/GetRole",
    method: "post",
    data,
  });
}
export function SaveRole(data) {
  return axios({
    url: "/api/Right/SaveRole",
    method: "post",
    data,
  });
}
//启用角色
export function EnableRole(data) {
  return axios({
    url: "/api/Right/EnableRole",
    method: "post",
    data,
  });
}
//停用角色
export function DisableRole(data) {
  return axios({
    url: "/api/Right/DisableRole",
    method: "post",
    data,
  });
}
//--------------------------系统配置----------------------------------------//
//分页查询系统配置
export function SearchConfigs(data) {
  return axios({
    url: "/api/Common/SearchConfigs",
    method: "post",
    data,
  });
}
//新建/修改系统配置
export function SaveConfig(data) {
  return axios({
    url: "/api/Common/SaveConfig",
    method: "post",
    data,
  });
}
//--------------------------任务----------------------------------------//
export function SearchCrontabs(data) {
  return axios({
    url: "/api/Job/SearchCrontabs",
    method: "post",
    data,
  });
}
export function GetCrontab(data) {
  return axios({
    url: "/api/Job/GetCrontab",
    method: "post",
    data,
  });
}
export function SaveCrontab(data) {
  return axios({
    url: "/api/Job/SaveCrontab",
    method: "post",
    data,
  });
}
//接口名称
export function GetInterfaceList(data) {
  return axios({
    url: "/api/Job/GetInterfaceList",
    method: "post",
    data,
  });
}
//新建/修改定时任务的接口
export function SaveCrontabIf(data) {
  return axios({
    url: "/api/Job/SaveCrontabIf",
    method: "post",
    data,
  });
}
//分页查询定时任务的执行历史
export function SearchCrontabHises(data) {
  return axios({
    url: "/api/Job/SearchCrontabHises",
    method: "post",
    data,
  });
}
//获取某个任务某个执行批次的接口历史列表
export function GetCrontabIfHisList(data) {
  return axios({
    url: "/api/Job/GetCrontabIfHisList",
    method: "post",
    data,
  });
}

//删除定时任务的接口
export function DeleteCrontabIf(data) {
  return axios({
    url: "/api/Job/DeleteCrontabIf",
    method: "post",
    data,
  });
}
//停用定时任务
export function DisableCrontab(data) {
  return axios({
    url: "/api/Job/DisableCrontab",
    method: "post",
    data,
  });
}
//启用定时任务
export function EnableCrontab(data) {
  return axios({
    url: "/api/Job/EnableCrontab",
    method: "post",
    data,
  });
}
//--------------------------用户----------------------------------------//
//分页查询用户
export function SearchUsers(data) {
  return axios({
    url: "/api/User/SearchUsers",
    method: "post",
    data,
  });
}
//获取单个用户信息
export function GetUser(data) {
  return axios({
    url: "/api/User/GetUser",
    method: "post",
    data,
  });
}
//新建/修改用户
export function SaveUser(data) {
  return axios({
    url: "/api/User/SaveUser",
    method: "post",
    data,
  });
}
//删除用户
export function DeleteUser(data) {
  return axios({
    url: "/api/User/DeleteUser",
    method: "post",
    data,
  });
}
//启用用户
export function EnableUser(data) {
  return axios({
    url: "/api/User/EnableUser",
    method: "post",
    data,
  });
}
//解绑用户与粉丝的映射
export function UnbindUserFans(data) {
  return axios({
    url: "/api/User/UnbindUserFans",
    method: "post",
    data,
  });
}
//获取某个用户与粉丝的映射列表
export function GetUserFansMapList(data) {
  return axios({
    url: "/api/User/GetUserFansMapList",
    method: "post",
    data,
  });
}
//停用用户
export function DisableUser(data) {
  return axios({
    url: "/api/User/DisableUser",
    method: "post",
    data,
  });
}
//重置密码
export function ResetPwd(data) {
  return axios({
    url: "/api/User/ResetPwd",
    method: "post",
    data,
  });
}
//--------------------------单位----------------------------------------//
//组织
export function GetUnitList(data) {
  return axios({
    url: "/api/Unit/GetUnitList",
    method: "post",
    data,
  });
}
//获取绑定后台登录帐号的小程序码
export function GetUnitWxxcxQRCode(data) {
  return axios({
    url: "/api/Unit/GetUnitWxxcxQRCode",
    method: "post",
    data,
  });
}

export function SearchUnites(data) {
  return axios({
    url: "/api/Unit/SearchUnites",
    method: "post",
    data,
  });
}
//查询公司详情
export function GetUnit(data) {
  return axios({
    url: "/api/Unit/GetUnit",
    method: "post",
    data,
  });
}
export function EnableUnit(data) {
  return axios({
    url: "/api/Unit/EnableUnit",
    method: "post",
    data,
  });
}
export function DisableUnit(data) {
  return axios({
    url: "/api/Unit/DisableUnit",
    method: "post",
    data,
  });
}
//获取单个单位的配置信息
export function GetUnitConfigs(data) {
  return axios({
    url: "/api/Unit/GetUnitConfigs",
    method: "post",
    data,
  });
}
//修改单位的配置
export function ModifyUnitConfigs(data) {
  return axios({
    url: "/api/Unit/ModifyUnitConfigs",
    method: "post",
    data,
  });
}
export function SaveUnit(data) {
  return axios({
    url: "/api/Unit/SaveUnit",
    method: "post",
    data,
  });
}
//分页查询券商的每天的运营数据
export function SearchUnitStatDatas(data) {
  return axios({
    url: "/api/Unit/SearchUnitStatDatas",
    method: "post",
    data,
  });
}

export function CreateDefaultUser(data) {
  return axios({
    url: "/api/Unit/CreateDefaultUser",
    method: "post",
    data,
  });
}

//查询自己创建的或者系统默认的领券样式
export function GetTakeThemeList(data) {
  return axios({
    url: "/api/Unit/GetTakeThemeList",
    method: "post",
    data,
  });
}
//--------------------------页面装修----------------------------------------//
export function SavePage(data) {
  return axios({
    url: "/api/Unit/SavePage",
    method: "post",
    data,
  });
}
export function GetPage(data) {
  return axios({
    url: "/api/Unit/GetPage",
    method: "post",
    data,
  });
}
export function SearchPages(data) {
  return axios({
    url: "/api/Unit/SearchPages",
    method: "post",
    data,
  });
}
//启用页面
export function EnablePage(data) {
  return axios({
    url: "/api/Unit/EnablePage",
    method: "post",
    data,
  });
}
//停用页面
export function DisablePage(data) {
  return axios({
    url: "/api/Unit/DisablePage",
    method: "post",
    data,
  });
}
//复制页面
export function CopyPage(data) {
  return axios({
    url: "/api/Unit/CopyPage",
    method: "post",
    data,
  });
}
//分页查询我的商城的供应商
export function SearchMyMallSupplies(data) {
  return axios({
    url: "/api/Unit/SearchMyMallSupplies",
    method: "post",
    data,
  });
}
//获取开通商城且允许上架商品的单位列表
export function GetMallUnitList(data) {
  return axios({
    url: "/api/Unit/GetMallUnitList",
    method: "post",
    data,
  });
}
//分页查询我开通的商城
export function SearchMyMalls(data) {
  return axios({
    url: "/api/Unit/SearchMyMalls",
    method: "post",
    data,
  });
}
//申请开通某个商城（作为商城的供应商） 
export function ApplyOnlineMall(data) {
  return axios({
    url: "/api/Unit/ApplyOnlineMall",
    method: "post",
    data,
  });
}
//直接开通某个券商作为我的商城的供应商
export function OnlineMyMall(data) {
  return axios({
    url: "/api/Unit/OnlineMyMall",
    method: "post",
    data,
  });
}
//直接关闭作为我的商城的某个供应商（券商）的上架权限   
///UnitId
export function OfflineMyMall(data) {
  return axios({
    url: "/api/Unit/OfflineMyMall",
    method: "post",
    data,
  });
}
//供应商（券商）自己直接从某个商城下架 
///UnitId
export function OfflineFromMall(data) {
  return axios({
    url: "/api/Unit/OfflineFromMall",
    method: "post",
    data,
  });
}
//对券商开通作为我的商城的供应商的申请进行审批（通过/不通过）  
/// <summary>
/// 是否通过 //IsPass 
/// ID //UnitId 
/// </summary>

export function ApproveOnlineMyMallApply(data) {
  return axios({
    url: "/api/Unit/ApproveOnlineMyMallApply",
    method: "post",
    data,
  });
}

//--------------------------角色----------------------------------------//
export function SearchRoles(data) {
  return axios({
    url: "/api/Right/SearchRoles",
    method: "post",
    data,
  });
}

//--------------------------数据----------------------------------------//
//标量数据统计
export function StatSingle(data) {
  return axios({
    url: "/api/DataStat/StatSingle",
    method: "post",
    data,
  });
}
//销售商品排行
export function TopSellGoods(data) {
  return axios({
    url: "/api/DataStat/TopSellGoods",
    method: "post",
    data,
  });
}
//--------------------------花名册----------------------------------------//
//分页查询花名册
export function SearchRosters(data) {
  return axios({
    url: "/api/Unit/SearchRosters",
    method: "post",
    data,
  });
}
//获取单个花名册信息
export function GetRoster(data) {
  return axios({
    url: "/api/Unit/GetRoster",
    method: "post",
    data,
  });
}
//启用花名册
export function EnableRoster(data) {
  return axios({
    url: "/api/Unit/EnableRoster",
    method: "post",
    data,
  });
}
//停用花名册
export function DisableRoster(data) {
  return axios({
    url: "/api/Unit/DisableRoster",
    method: "post",
    data,
  });
}
//新建/修改花名册
export function SaveRoster(data) {
  return axios({
    url: "/api/Unit/SaveRoster",
    method: "post",
    data,
  });
}
//获取单个花名册信息（含名单详情）
export function GetRosterDetail(data) {
  return axios({
    url: "/api/Unit/GetRosterDetail",
    method: "post",
    data,
  });
}
//获取券商列表
export function GetTicketBrokerUnitList(data) {
  return axios({
    url: "/api/Unit/GetTicketBrokerUnitList",
    method: "post",
    data,
  });
}
//判断当前单位是否开通了商城
//ObjectId 无符号整型对象id
export function IsMallOpen(data) {
  return axios({
    url: "/api/Unit/IsMallOpen",
    method: "post",
    data,
  });
}
