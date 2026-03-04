import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import Cookie from "js-cookie";
import { SearchOrders, SearchDeliverOrders } from "@/api/order.js";
import { SearchMySellGoodses } from "@/api/goods.js";
import { SearchBrands, SearchTicketes } from "@/api/ticket.js";
import { SearchUnites, TopSellGoods } from "@/api/index.js";
import { SearchWxxcxFanses } from "@/api/wxxcx.js";
import { SearchVips } from "@/api/vip.js";
const loginUser = JSON.parse(Cookie.get("User"));
//品牌导出钩子
// 该钩子用于处理品牌数据的导出功能，包括数据格式化和Excel导出
export function useBrandExport() {
  // 导出表头配置
  const EXPORT_HEADERS = ["图片", "名称", "创建时间", "创建单位", "创建人"];

  const FIELD_MAPPING = [
    "BrandLogo",
    "BrandName",
    "CreateTime",
    "CreateUnitName",
    "CreateUserName",
  ];

  // 处理导出数据
  const processExportData = (data) => { };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchBrands({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      await exportToExcel(res.DataMap.Data);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `品牌列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
//券商导出钩子
export function useUnitExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "编码",
    "名称",
    "客户类型",
    "联系人",
    "联系电话",
    "客服电话",
    "登陆帐号",
    "已建券总量",
    "客户状态",
    "最多可创建多少张券(0:不控制)",
    "最多可兑换多少张券(0:不控制)",
    "创建商品时，是否自动提交为通过",
    "创建券模板时，是否自动提交为通过",
    "额度开始日期",
    "额度结束日期",
  ];

  const FIELD_MAPPING = [
    "UnitCode",
    "UnitName",
    "UnitTypeDesc",
    "UnitContact",
    "UnitTel",
    "CustomerServiceTel",
    "DefaultUserAccount",
    "CreatedTicketCount",
    "UnitStatusDesc",
    "MaxCreateTicketCount",
    "MaxFreeExchangeTicketCount",
    "AutoSubmitWhenCreateGoodsDesc",
    "AutoSubmitWhenCreateTicketDesc",
    "PaidBeginDate",
    "PaidEndDate",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    let outData = JSON.parse(JSON.stringify(data));
    outData.forEach((row) => {
      let JsonConfig = {};
      if (row.UnitConfig) {
        JsonConfig = JSON.parse(row.UnitConfig);
        row.MaxCreateTicketCount = JsonConfig.MaxCreateTicketCount;
        row.MaxFreeExchangeTicketCount = JsonConfig.MaxFreeExchangeTicketCount;
        row.AutoSubmitWhenCreateGoodsDesc = JsonConfig.AutoSubmitWhenCreateGoods
          ? "自动"
          : "不自动";
        row.AutoSubmitWhenCreateTicketDesc =
          JsonConfig.AutoSubmitWhenCreateTicket ? "自动" : "不自动";
        row.PaidBeginDate = JsonConfig.PaidBeginDate
          ? JsonConfig.PaidBeginDate
          : "";
        row.PaidEndDate = JsonConfig.PaidEndDate ? JsonConfig.PaidEndDate : "";
        // row.CanExchangeTicketOnlyAfterSoldDesc = JsonConfig.CanExchangeTicketOnlyAfterSold ? "是" : "否";
      }
    });
    return outData;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchUnites({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `券商列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
//粉丝导出钩子
export function useFansExport() {
  // 导出表头配置
  let EXPORT_HEADERS = [
    "小程序",
    "openid",
    "Unionid",
    "昵称",
    "创建时间",
    "会员姓名",
    "会员电话",
    "会员绑定时间",
  ];

  let FIELD_MAPPING = [
    "AppName",
    "Openid",
    "Unionid",
    "Nickname",
    "InTime",
    "VipName",
    "VipCell",
    "VipBindTime",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
      VipName: row.Vip?.VipName || "",
      VipCell: row.Vip?.VipCell || "",
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };
  // 处理时间范围查询条件
  const processTimeCondition = (query) => {
    const searchCondition = { ...query.search };

    // 重置时间条件
    searchCondition.in_date_begin = "";
    searchCondition.in_date_end = "";

    // 处理时间范围
    if (query.search.time?.length === 2) {
      searchCondition.in_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      searchCondition.in_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }

    return searchCondition;
  };
  // 获取动态导出配置
  const getExportConfig = () => {
    const headers = [...EXPORT_HEADERS];
    const fields = [...FIELD_MAPPING];

    // 根据用户类型动态添加列
    if (loginUser.UnitType === 1) {
      headers.push("最后访问券商");
      fields.push("LastUnitName");
    }

    return { headers, fields };
  };
  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = processTimeCondition(query);

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchWxxcxFanses({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const { headers, fields } = getExportConfig();
    const formattedData = formatJson(fields, data);
    const timestamp = new Date().toISOString().slice(0, 10);
    excel.export_json_to_excel({
      header: headers,
      data: formattedData,
      filename: `小程序粉丝列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}

//会员导出钩子
export function useVipExport() {
  // 导出表头配置
  let EXPORT_HEADERS = [
    "会员姓名",
    "会员电话",
    "会员性别",
    "会员等级",
    "平台小程字openid",
    "私域小程序openid",
    "卡券小程序openid",
    "福采小程序openid",
    "创建时间",
  ];

  let FIELD_MAPPING = [
    "VipName",
    "VipCell",
    "VipGender",
    "VipTypeName",
    "Openid",
    "WxxcxOpenid2",
    "WxxcxOpenid3",
    "WxxcxOpenid4",
    "CreateTime",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
      Openid: row.WxxcxFans.Openid,
      VipGender: row.VipGender == 0 ? "未知" : row.VipGender == 1 ? "男" : "女",
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };
  // 处理时间范围查询条件
  const processTimeCondition = (query) => {
    const searchCondition = { ...query.search };

    // 重置时间条件
    searchCondition.in_date_begin = "";
    searchCondition.in_date_end = "";

    // 处理时间范围
    if (query.search.time?.length === 2) {
      searchCondition.in_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      searchCondition.in_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }

    return searchCondition;
  };
  // 获取动态导出配置
  const getExportConfig = () => {
    const headers = [...EXPORT_HEADERS];
    const fields = [...FIELD_MAPPING];
    return { headers, fields };
  };
  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = processTimeCondition(query);

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchVips({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const { headers, fields } = getExportConfig();
    const formattedData = formatJson(fields, data);
    const timestamp = new Date().toISOString().slice(0, 10);
    excel.export_json_to_excel({
      header: headers,
      data: formattedData,
      filename: `会员数据导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
//热门商品导出钩子
export function useBestSellersExport() {
  // 导出表头配置
  let EXPORT_HEADERS = ["券商", "商品编码", "商品名称", "浏览人数", "浏览次数"];

  let FIELD_MAPPING = ["unit_name", "goods_code", "goods_title", "uv", "pv"];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };
  // 处理时间范围查询条件
  const processTimeCondition = (query) => {
    const searchCondition = { ...query.search };
    return searchCondition;
  };
  // 获取动态导出配置
  const getExportConfig = () => {
    const headers = [...EXPORT_HEADERS];
    const fields = [...FIELD_MAPPING];
    return { headers, fields };
  };
  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = processTimeCondition(query);

      // 获取导出数据
      tableLoading.value = true;

      const res = await TopSellGoods({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }
      if (res.DataMap.ToalCount == 0) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const { headers, fields } = getExportConfig();
    const formattedData = formatJson(fields, data);
    const timestamp = new Date().toISOString().slice(0, 10);
    excel.export_json_to_excel({
      header: headers,
      data: formattedData,
      filename: `热门商品数据导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
//订单导出
export function useOrderExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "小程序",
    "券商",
    "状态",
    "订单号",
    "商城",
    "下单时间",
    "卡券支付金额(元)",
    "微信支付金额(元)",
    "商品编码",
    "商品名称",
    "商品数量",
    "商品价格",
    "SKU编码",
    "SKU属性",
    "券批次号",
    "券名称",
    "券码",
    "券状态",
    "OpenID",
    "寄件人",
    "寄件人电话",
    "下单场景",
    "收件人",
    "收件人电话",
    "省份",
    "城市",
    "区域",
    "收件人地址",
    "订单备注",
    "快递信息",
    "发票号",
    "发票代码",
    "抬头",
    "纳税人识别号",
    "公司地址",
    "公司联系人",
    "公司电话",
    "公司开户银行",
    "公司开户银行帐号",
  ];

  const FIELD_MAPPING = [
    "AccountName",
    "UnitName",
    "OrderStatusDesc",
    "OrderCode",
    "MallUnitName",
    "OrderTime",
    "TicketAmt",
    "PayAmt",
    "GoodsCode",
    "GoodsTitle",
    "Qty",
    "OrgPrice",
    "SkuCode",
    "SkuPropertyDesc",
    "TicketTemplateCode",
    "TicketTemplateTitle",
    "TicketCode",
    "TicketStatusDesc",
    "WxxcxOpenid",
    "VipName",
    "VipCell",
    "OrderScene",
    "ContactName",
    "ContactCell",
    "ContactProvinceName",
    "ContactCityName",
    "ContactDistrictName",
    "ContactAddress",
    "OrderRemark",
    "ExpressTypeList",
    "InvoiceNo",
    "InvoiceCode",
    "InvoiceTitle",
    "CompanyTaxno",
    "CompanyAddress",
    "CompanyContact",
    "CompanyTel",
    "CompanyBank",
    "CompanyBankAccount",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    let OutData = [];
    data.forEach((row) => {
      row.Details.forEach((rowDetail) => {
        let ObjData = {
          SkuCode: "",
          SkuPropertyDesc: "",
          TicketStatusDesc: "", //券状态
          TicketTemplateCode: "", //券批次
          TicketCode: "", //券号
          TicketTemplateTitle: "",
          ExpressTypeList: "", //快递信息
          //发票信息弄进去
          InvoiceTypeDesc: "", //发票类型(0:普票;1:专票;)
          InvoiceStatusDesc: "", //发票状态
          InvoiceNo: "", //发票号
          InvoiceCode: "", //发票代码
          InvoiceTitle: "", //抬头
          CompanyTaxno: "", //纳税人识别号
          CompanyAddress: "", //公司地址
          CompanyContact: "", //公司联系人
          CompanyTel: "", //公司电话
          CompanyBank: "", //公司开户银行
          CompanyBankAccount: "", //公司开户银行帐号
        };
        ObjData.AccountName = row.AccountName;
        ObjData.OrderCode = row.OrderCode;
        ObjData.OrderTypeDesc = row.OrderTypeDesc;
        ObjData.TicketAmt = row.TicketAmt / 100;
        ObjData.PayAmt = row.PayAmt / 100;
        ObjData.OrderTime = row.OrderTime;
        ObjData.UnitName = row.UnitName;
        ObjData.WxxcxOpenid = row.WxxcxOpenid;
        ObjData.VipName = row.VipName;
        ObjData.VipCell = row.VipCell;
        ObjData.ContactName = row.ContactName;
        ObjData.OrderScene = row.OrderScene;
        ObjData.ContactCell = row.ContactCell;
        ObjData.ContactProvinceName = row.ContactProvinceName;
        ObjData.ContactCityName = row.ContactCityName;
        ObjData.ContactDistrictName = row.ContactDistrictName;
        ObjData.ContactAddress = row.ContactAddress;
        ObjData.OrderRemark = row.OrderRemark;
        ObjData.OrderStatusDesc = row.OrderStatusDesc;
        if (row.Expresses.length > 0) {
          row.Expresses.forEach((rowExpresses, index) => {
            if (index > 0) {
              ObjData.ExpressTypeList =
                ObjData.ExpressTypeList +
                "," +
                `${rowExpresses.ExpressTypeDesc
                  ? rowExpresses.ExpressTypeDesc
                  : ""
                } - ${rowExpresses.ExpressCode ? rowExpresses.ExpressCode : ""
                } - ${rowExpresses.ExpressTime ? rowExpresses.ExpressTime : ""
                }`;
            } else {
              ObjData.ExpressTypeList = `${rowExpresses.ExpressTypeDesc ? rowExpresses.ExpressTypeDesc : ""
                } - ${rowExpresses.ExpressCode ? rowExpresses.ExpressCode : ""
                } - ${rowExpresses.ExpressTime ? rowExpresses.ExpressTime : ""}`;
            }
          });
        }
        if (row.Invoice != null) {
          ObjData.InvoiceTypeDesc = row.Invoice.InvoiceTypeDesc;
          ObjData.InvoiceStatusDesc = row.Invoice.InvoiceStatusDesc;
          ObjData.InvoiceNo = row.Invoice.InvoiceNo;
          ObjData.InvoiceCode = row.Invoice.InvoiceCode;
          ObjData.InvoiceTitle = row.Invoice.InvoiceTitle;
          ObjData.CompanyTaxno = row.Invoice.CompanyTaxno;
          ObjData.CompanyAddress = row.Invoice.CompanyAddress;
          ObjData.CompanyContact = row.Invoice.CompanyContact;
          ObjData.CompanyTel = row.Invoice.CompanyTel;
          ObjData.CompanyBank = row.Invoice.CompanyBank;
          ObjData.CompanyBankAccount = row.Invoice.CompanyBankAccount;
        }
        ObjData.GoodsCode = rowDetail.GoodsCode;
        ObjData.GoodsTitle = rowDetail.GoodsTitle;
        ObjData.OrgPrice = rowDetail.OrgPrice / 100;
        ObjData.Qty = rowDetail.Qty;
        if (rowDetail.SkuId != "") {
          //代表当前有sku
          ObjData.SkuCode = rowDetail.SkuCode;
          ObjData.SkuPropertyDesc = rowDetail.SkuPropertyDesc;
        }
        if (rowDetail.Ticketes.length > 0) {
          rowDetail.Ticketes.forEach((rowTickets) => {
            ObjData.TicketStatusDesc = rowTickets.TicketStatusDesc;
            ObjData.TicketTemplateCode = rowTickets.TicketTemplateCode;
            ObjData.TicketCode = rowTickets.TicketCode;
            ObjData.TicketTemplateTitle = rowTickets.TicketTemplateTitle;
          });
          OutData.push(ObjData);
        } else {
          OutData.push(ObjData);
        }
      });
    });
    return OutData;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };
      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchOrders({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `订单列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
//商城我的商品导出
export function useProductExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "类型", //GoodsTypeDesc
    "品牌", //BrandName
    "编码", //GoodsCode
    "名称", //GoodsTitle
    "条码", //GoodsBarcode
    "商品分类", //CategoriesDesc
    "关联的券", //ticketDesc
    "原价(元)", //OrgPriceDesc
    "零售价(元)", //SellPriceDesc
    "批发价(元)", //WholesaleBeginQtyDesc
    "境外商品的未税价", //JtglobleUntaxPrice
    "境外商品的税率(%)", //JtglobleTaxRate
    "库存", //TotalQty
    "已售", //SoldQty
    "排序", //CompositeIndexDesc
    "商品状态", //GoodsStatusDesc
    "创建单位", //CreateUnitName
    "创建人", //CreateUserName
    "创建时间", //CreateTime

  ];

  const FIELD_MAPPING = [
    "GoodsTypeDesc",
    "BrandName",
    "GoodsCode",
    "GoodsTitle",
    "GoodsBarcode",
    "CategoriesDesc",
    "ticketDesc",
    "OrgPriceDesc",
    "SellPriceDesc",
    "WholesaleBeginQtyDesc",
    "JtglobleUntaxPrice",
    "JtglobleTaxRate",
    "TotalQty",
    "SoldQty",
    "CompositeIndexDesc",
    "GoodsStatusDesc",
    "CreateUnitName",
    "CreateUserName",
    "CreateTime",

  ];

  // 处理导出数据
  const processExportData = (data) => {
    let OutData = [];
    data.forEach((row) => {
      if (row.GoodsTypeDesc == "兑换券商品") {
        row.ticketDesc =
          row.TicketTemplate.TicketTemplateCode +
          "-" +
          row.TicketTemplate.TicketTemplateTitle;
      }
      if (row.GoodsStatus == 1) {
        row.GoodsStatusDesc = "正常";
      } else {
        row.GoodsStatusDesc = "停用";
      }
      //商品sku
      if (row.SkuCount > 0) {
        row.GoodsProperties.forEach((sku, SkuIndex) => {
          if (SkuIndex == 0) {
            row.GoodsPropertiesDesc = sku.Name;
          } else {
            row.GoodsPropertiesDesc =
              row.GoodsPropertiesDesc + "," + sku.Name;
          }
        });
      }

      //分类数据整理
      if (row.Malls.length > 0) {
        //商城状态
        for (let i = 0; i < row.Malls.length; i++) {
          const el = row.Malls[i];
          if (el.UnitId == 1) {
            //礼牛平台
            row.CategoriesLiNiuDesc = "";
            el.Categories.forEach((CategoriesRow) => {
              row.CategoriesLiNiuDesc += CategoriesRow.PathName + ",";
            });
            //价格
            if (el.Price) {
              row.OrgPriceLiNiuDesc = (el.Price.OrgPrice / 100).toFixed(
                2
              );
              row.SellPriceLiNiuDesc = (el.Price.SellPrice / 100).toFixed(
                2
              );
              row.WholesaleBeginQtyLiNiuDesc =
                "满" +
                el.Price.WholesaleBeginQty +
                "件,每件" +
                (el.Price.WholesalePrice / 100).toFixed(2);
            }

          } else if (el.UnitId == 2) {
            //礼牛平台
            row.CategoriesFuCaiDesc = "";
            el.Categories.forEach((CategoriesRow) => {
              row.CategoriesFuCaiDesc += CategoriesRow.PathName + ",";
            });
            //价格
            if (el.Price) {
              row.OrgPriceFuCaiDesc = (el.Price.OrgPrice / 100).toFixed(
                2
              );
              row.SellPriceFuCaiDesc = (el.Price.SellPrice / 100).toFixed(
                2
              );
              row.WholesaleBeginQtyFuCaiDesc =
                "满" +
                el.Price.WholesaleBeginQty +
                "件,每件" +
                (el.Price.WholesalePrice / 100).toFixed(2);
            }

          } else {
            row.CategoriesDesc = "";
            el.Categories.forEach((CategoriesRow) => {
              row.CategoriesDesc += CategoriesRow.PathName + ",";
            });
          }
        }
      }
      row.CompositeIndexDesc = row.Index.CompositeIndex;
      if (row.GoodsSrc == 1) {
        //说明是全球购商品，需要单独导出未税价和税率
        if (row.GoodsConfig) {
          let GoodsConfigJsonData = JSON.parse(row.GoodsConfig);
          row.JtglobleUntaxPrice = GoodsConfigJsonData.JtglobleUntaxPrice
            ? GoodsConfigJsonData.JtglobleUntaxPrice
            : "";
          row.JtglobleUntaxPrice = (row.JtglobleUntaxPrice / 100).toFixed(
            2
          );
          row.JtglobleTaxRate = GoodsConfigJsonData.JtglobleTaxRate
            ? GoodsConfigJsonData.JtglobleTaxRate
            : "";
        }
      }
      row.OrgPriceDesc = (row.OrgPrice / 100).toFixed(2);
      row.SellPriceDesc = (row.OrgPrice / 100).toFixed(2);

      if (row.WholesaleBeginQty > 0) {
        row.WholesaleBeginQtyDesc =
          "满" +
          row.WholesaleBeginQty +
          "件,每件" +
          (row.WholesalePrice / 100).toFixed(2);
      }
      OutData.push(row);
    });
    return OutData;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchMySellGoodses({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `我的商品列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}

//客户列表导出
export function useCustomerExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "客户编码",
    "客户名称",
    "客户类型",
    "销售折扣",
    "联系人",
    "联系电话",
    "登陆帐号",
    "客户状态",];

  const FIELD_MAPPING = [
    "UnitCode",
    "UnitName",
    "UnitTypeDesc",
    "GoodsDiscount",
    "UnitContact",
    "UnitTel",
    "DefaultUserAccount",
    "UnitStatusDesc",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    data.forEach((row) => {
      if (row.UnitConfig) {
        row.GoodsDiscount = JSON.parse(row.UnitConfig).GoodsDiscount;
      }
    });
    return data;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchUnites({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `客户列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}

//券明细数据导出
export function useTicketDetailExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "券码",
    "有效期开始",
    "有效期结束",
    "配送期开始",
    "配送期结束",
    "所属券包券码",
    "所属客户",
    "领取人姓名",
    "领取人电话",
    "销售单",
    "销售时间",
    "配送单",
    "兑换时间",
    "密码",
    "后付款姓名",
    "后付款电话",
    "后付款金额(元)",
    "后付款状态",
    "挂起",
    "状态",
    "二维码",
    "批次号",
    "名称",
    "面值(元)",
    "客服电话"];

  const FIELD_MAPPING = [
    "TicketCode",
    "ValidBeginDate",
    "ValidEndDate",
    "ExchangeBeginDate",
    "ExchangeEndDate",
    "PackageTicketCode",
    "CurrentUnitName",
    "TakeVipName",
    "TakeVipCell",
    "SaleBillCode",
    "SaleTime",
    "DeliverOrderCode",
    "DeliverOrderTime",
    "TicketPwd",
    "PayerVipName",
    "PayerVipCell",
    "PayPrice",
    "PayStatusDesc",
    "IsSuspendDesc",
    "TicketStatusDesc",
    "QrTicketCode",
    "TicketTemplateCodeDesc",
    "TicketTemplateTitleDesc",
    "OrgPriceDesc",
    "CustomerServiceTelDesc",
  ];

  // 处理导出数据
  const processExportData = (formData, data) => {
    data.forEach((row) => {
      row.OrgPriceDesc = (formData.OrgPrice / 100).toFixed(2);
      row.PayPrice = (row.PayPrice / 100).toFixed(2);
      row.CustomerServiceTelDesc = formData.CustomerServiceTel;
      row.TicketTemplateCodeDesc = formData.TicketTemplateCode; //批次号
      row.TicketTemplateTitleDesc = formData.TicketTemplateTitle; //名称
      if (row.TakeVipAccountId) {
        row.TakeVipAccountAmt = (row.TakeVipAccountAmt / 100).toFixed(2); //可用余额
      } else {
        row.TakeVipAccountAmt = (formData.OrgPrice / 100).toFixed(2); //显示面值
      }
    });
    return data;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (formData, query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };
      if (formData.TicketTemplateType == 6) {
        //如果当前卡券是储值卡的话才导出可用余额
        EXPORT_HEADERS.push("储值卡余额(元)");
        FIELD_MAPPING.push("TakeVipAccountAmt");
      }
      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchTicketes({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出

      const exportData = processExportData(formData, res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `券明细列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}

//配送订单导出
export function useDeliverOrderExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "小程序",
    "券商",
    "状态",
    "订单号",
    "下单时间",
    "商品编码",
    "商品名称",
    "商品数量",
    "商品价格(元)",
    "组合商品编码",
    "组合商品名称",
    "SKU编码",
    "SKU属性",
    "券批次号",
    "券名称",
    "券码",
    "OpenID",
    "后付款单号",
    "后付款姓名",
    "后付款电话",
    "后付款金额",
    "后付款状态",
    "寄件人",
    "寄件人电话",
    "收件人",
    "收件人电话",
    "省份",
    "城市",
    "区域",
    "收件人地址",
    "快递信息",
    "快递费",
    "快递支付状态",
    "快递费信息",
    "商品描述详情",
  ];

  const FIELD_MAPPING = [
    "AccountName",
    "DeliverUnitName",
    "OrderStatusDesc",
    "OrderCode",
    "OrderTime",
    "GoodsCode",
    "GoodsTitle",
    "GoodsQty",
    "GoodsOrgPrice",
    "PackageGoodsCode",
    "PackageGoodsTitle",
    "SkuCode",
    "SkuPropertyDesc",
    "Code",
    "Title",
    "TicketCode",
    "Openid",
    "PayOrderCode",
    "PayerVipName",
    "PayerVipCell",
    "PayPrice",
    "PayStatusDesc",
    "VipName",
    "VipCell",
    "ContactName",
    "ContactCell",
    "ContactProvinceName",
    "ContactCityName",
    "ContactDistrictName",
    "ContactAddress",
    "ExpressTypeList",
    "ExpressFee",
    "ExpressFeeStatusDesc",
    "expressDelivery",
    "GoodsDetail",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    let OutData = [];
    data.forEach((row) => {
      row.Details.forEach((rowDetails) => {
        rowDetails.ExchangeGoods.forEach((rowGoods) => {
          let ObjData = {
            PackageGoodsCode: "",
            PackageGoodsTitle: "",
            DisplayTitle: "",
            ExpressTypeList: "",
            SkuCode: "",
            SkuPropertyDesc: "",
            GoodsDetail: "",
            DeliverUnitName: "",
          };
          ObjData.GoodsCode = rowGoods.GoodsCode;
          ObjData.GoodsTitle = rowGoods.GoodsTitle;
          ObjData.GoodsQty = rowGoods.GoodsQty;
          ObjData.GoodsOrgPrice = rowGoods.GoodsOrgPrice / 100;
          if (rowGoods.PackageGoodsQty > 0) {
            //只有组合装的时候就会显示
            ObjData.PackageGoodsCode = rowGoods.PackageGoodsCode;
            ObjData.PackageGoodsTitle = rowGoods.PackageGoodsTitle;
          }
          if (rowGoods.SkuId != "") {
            ObjData.SkuCode = rowGoods.SkuCode;
            ObjData.SkuPropertyDesc = rowGoods.SkuPropertyDesc;
          }
          ObjData.Code = rowDetails.VipTicket.TicketTemplate.Code;
          ObjData.TicketCode = rowDetails.VipTicket.TicketCode;
          ObjData.Title = rowDetails.VipTicket.TicketTemplate.Title;
          //后付款
          ObjData.PayerVipName = rowDetails.PayerVipName;
          ObjData.PayerVipCell = rowDetails.PayerVipCell;
          ObjData.PayPrice = (rowDetails.PayPrice / 100).toFixed(2);
          ObjData.PayStatusDesc = rowDetails.PayStatusDesc;
          ObjData.PayOrderCode = rowDetails.PayOrderCode;
          ObjData.DeliverUnitName = row.DeliverUnitName;
          ObjData.OrderCode = row.OrderCode;
          ObjData.AccountName = row.AccountName;
          ObjData.OrderTime = row.OrderTime;
          ObjData.GoodsCode = rowGoods.GoodsCode;
          ObjData.VipName = row.VipName;
          ObjData.Openid = row.Openid;
          ObjData.VipCell = row.VipCell;
          ObjData.ContactName = row.ContactName;
          ObjData.ContactCell = row.ContactCell;
          ObjData.ContactProvinceName = row.ContactProvinceName;
          ObjData.ContactCityName = row.ContactCityName;
          ObjData.ContactDistrictName = row.ContactDistrictName;
          ObjData.ContactAddress = row.ContactAddress;
          ObjData.OrderStatusDesc = row.OrderStatusDesc;
          ObjData.ExpressFee = (row.ExpressFee / 100).toFixed(2);//快递费
          ObjData.ExpressFeeStatusDesc = row.ExpressFeeStatusDesc;//快递支付状态

          ObjData.expressDelivery = ``;
          if (row.Pays.length > 0) {
            row.Pays.forEach(PaysRow => {
              ObjData.expressDelivery += `微信支付单号：${PaysRow.PayRelNo1} 时间：${PaysRow.CreateTime}`;
            })
          }
          if (row.Refunds.length > 0) {
            row.Refunds.forEach(RefundsRow => {
              ObjData.expressDelivery += `微信退款单号：${RefundsRow.RefundRelNo1} 时间：${RefundsRow.CreateTime}`;
            })
          }
          if (row.Expresses.length > 0) {
            row.Expresses.forEach((rowExpresses, index) => {
              if (index > 0) {
                ObjData.ExpressTypeList =
                  ObjData.ExpressTypeList +
                  "," +
                  `${rowExpresses.ExpressTypeDesc
                    ? rowExpresses.ExpressTypeDesc
                    : ""
                  } - ${rowExpresses.ExpressCode
                    ? rowExpresses.ExpressCode
                    : ""
                  } - ${rowExpresses.ExpressTime
                    ? rowExpresses.ExpressTime
                    : ""
                  }`;
              } else {
                ObjData.ExpressTypeList = `${rowExpresses.ExpressTypeDesc
                  ? rowExpresses.ExpressTypeDesc
                  : ""
                  } - ${rowExpresses.ExpressCode ? rowExpresses.ExpressCode : ""
                  } - ${rowExpresses.ExpressTime ? rowExpresses.ExpressTime : ""
                  }`;
              }
            });
          }
          if (rowGoods.GoodsDetail) {
            ObjData.GoodsDetail = rowGoods.GoodsDetail.replace(
              /<[^<>]+>/g,
              ""
            ).replace(/&nbsp;/gi, "");
          }
          OutData.push(ObjData);
        });
      });
    });
    return OutData;
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query.search };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchDeliverOrders({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap.Data) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap.Data);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `配送订单列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}

