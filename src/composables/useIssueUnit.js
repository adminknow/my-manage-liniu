import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import {
  SearchUnites,
  GetUnit,
  SaveUnit,
  DisableUnit,
  EnableUnit,
  HasRight,
  GetUnitConfigs,
  ModifyUnitConfigs,
  GetUnitWxxcxQRCode,
  ResetPwd,
} from "@/api/index.js";
import { SearchBrands } from "@/api/ticket.js";
import { GetAllAccount } from "@/api/wxxcx.js";
import { useUnitExport } from "@/hooks/use-export.js";

/**
 * 券商管理组合式函数
 * 封装券商相关的API调用和业务逻辑
 */
export function useIssueUnit() {
  // ==================== 响应式数据 ====================
  const tableLoading = ref(false);
  const tableData = ref([]);
  const pageTotal = ref(0);
  const IsRight = ref(false);
  const BrandList = ref([]);
  const AllAccountList = ref([]);
  const loginUser = ref(JSON.parse(Cookie.get("User")));
  
  // 导出功能
  const { handleExport } = useUnitExport();
  
  // 查询参数
  const query = reactive({
    search: {
      unit_type: "2",
      unit_type_filter: "",
      search_keyword: "",
      unit_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
  });

  // ==================== 数据处理方法 ====================
  
  /**
   * 获取表格数据
   * @returns {Promise<void>}
   */
  const getData = async () => {
    tableLoading.value = true;
    try {
      const res = await SearchUnites({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
      });
      
      if (res.Code === 200) {
        if (res.DataMap.Data) {
          // 处理配置数据
          res.DataMap.Data.forEach((row) => {
            processUnitConfig(row);
          });
        }
        
        tableData.value = res.DataMap.Data || [];
        pageTotal.value = res.DataMap.ToalCount;
      } else {
        ElMessage.error(res.Message || "获取数据失败");
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      ElMessage.error("获取数据失败，请重试");
    } finally {
      tableLoading.value = false;
    }
  };
  
  /**
   * 处理券商配置数据
   * @param {Object} row - 券商数据行
   */
  const processUnitConfig = (row) => {
    if (row.UnitConfig) {
      try {
        const JsonConfig = JSON.parse(row.UnitConfig);
        row.MaxCreateTicketCount = JsonConfig.MaxCreateTicketCount;
        row.MaxFreeExchangeTicketCount = JsonConfig.MaxFreeExchangeTicketCount;
        row.MaxUserCount = JsonConfig.MaxUserCount;
        row.AutoSubmitWhenCreateGoodsDesc = JsonConfig.AutoSubmitWhenCreateGoods ? "自动" : "不自动";
        row.AutoSubmitWhenCreateTicketDesc = JsonConfig.AutoSubmitWhenCreateTicket ? "自动" : "不自动";
        row.PaidBeginDate = JsonConfig.PaidBeginDate || "";
        row.PaidEndDate = JsonConfig.PaidEndDate || "";
      } catch (error) {
        console.error("解析配置数据失败:", error);
      }
    }
  };
  
  /**
   * 根据ID获取券商详情
   * @param {string} ID - 券商ID
   * @returns {Promise<Object|null>}
   */
  const GetUnitById = async (ID) => {
    try {
      const res = await GetUnit({ ObjectId: ID });
      if (res.Code === 200) {
        const data = res.DataMap;
        // 处理品牌数据
        if (data.Brands && data.Brands.length > 0) {
          data.BrandsDesc = data.Brands.map(row => row.Id);
        }
        // 处理配置数据
        if (data.UnitConfig) {
          try {
            const JsonConfig = JSON.parse(data.UnitConfig);
            data.MaxCreateTicketCount = JsonConfig.MaxCreateTicketCount;
            data.MaxFreeExchangeTicketCount = JsonConfig.MaxFreeExchangeTicketCount;
            data.MaxUserCount = JsonConfig.MaxUserCount;
            data.AutoSubmitWhenCreateGoods = JsonConfig.AutoSubmitWhenCreateGoods;
            data.AutoSubmitWhenCreateGoodsDesc = JsonConfig.AutoSubmitWhenCreateGoods ? 1 : 0;
            data.AutoSubmitWhenCreateTicket = JsonConfig.AutoSubmitWhenCreateTicket;
            data.AutoSubmitWhenCreateTicketDesc = JsonConfig.AutoSubmitWhenCreateTicket ? 1 : 0;
            data.CanExchangeTicketOnlyAfterSold = JsonConfig.CanExchangeTicketOnlyAfterSold;
            data.CanExchangeTicketOnlyAfterSoldDesc = JsonConfig.CanExchangeTicketOnlyAfterSold ? 1 : 0;
            data.PaidTime = [];
            if (JsonConfig.PaidBeginDate && JsonConfig.PaidEndDate) {
              data.PaidTime = [
                JsonConfig.PaidBeginDate.toString(),
                JsonConfig.PaidEndDate.toString(),
              ];
            }
          } catch (error) {
            console.error("解析配置数据失败:", error);
          }
        }
        return data;
      } else {
        ElMessage.error(res.Message);
        return null;
      }
    } catch (error) {
      console.error("获取券商详情失败:", error);
      ElMessage.error("获取券商详情失败");
      return null;
    }
  };

  // ==================== 权限和基础数据方法 ====================
  
  /**
   * 检查权限
   * @returns {Promise<void>}
   */
  const checkRight = async () => {
    try {
      const res = await HasRight({ RightCode: "reset-pwd" });
      if (res.Code === 200) {
        IsRight.value = res.DataMap;
      } else {
        ElMessage.warning(res.Message || "检查权限失败");
      }
    } catch (error) {
      console.error("检查权限失败:", error);
    }
  };
  
  /**
   * 获取品牌列表
   * @returns {Promise<void>}
   */
  const getBrandList = async () => {
    try {
      const res = await SearchBrands({
        PageStartRow: 0,
        PageRowCount: 100000,
        SearchCondition: query.search,
        NoPage: true,
      });
      if (res.Code === 200) {
        BrandList.value = res.DataMap.Data || [];
      } else {
        ElMessage.warning(res.Message || "获取品牌列表失败");
      }
    } catch (error) {
      console.error("获取品牌列表失败:", error);
    }
  };
  
  /**
   * 获取所有账号列表
   * @returns {Promise<void>}
   */
  const getAllAccountList = async () => {
    try {
      const res = await GetAllAccount({});
      if (res.Code === 200) {
        AllAccountList.value = res.DataMap;
      } else {
        ElMessage.warning(res.Message || "获取账号列表失败");
      }
    } catch (error) {
      console.error("获取账号列表失败:", error);
    }
  };

  // ==================== 券商状态管理方法 ====================
  
  /**
   * 启用券商
   * @param {string} ID - 券商ID
   * @returns {Promise<boolean>}
   */
  const handleEnable = async (ID) => {
    return await updateUnitStatus(ID, EnableUnit, "启用");
  };
  
  /**
   * 停用券商
   * @param {string} ID - 券商ID
   * @returns {Promise<boolean>}
   */
  const handleDel = async (ID) => {
    return await updateUnitStatus(ID, DisableUnit, "停用");
  };
  
  /**
   * 更新券商状态
   * @param {string} ID - 券商ID
   * @param {Function} apiMethod - API方法
   * @param {string} action - 操作名称
   * @returns {Promise<boolean>}
   */
  const updateUnitStatus = async (ID, apiMethod, action) => {
    try {
      await ElMessageBox.confirm(`确定要${action}吗？`, "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      });
      
      const res = await apiMethod({ ObjectId: ID });
      if (res.Code === 200) {
        ElMessage.success(`${action}成功`);
        query.PageStartRow = 1;
        await getData();
        return true;
      } else {
        ElMessage.warning(res.Message);
        return false;
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error(`${action}操作失败:", error`);
        ElMessage.error(`${action}失败，请重试`);
      }
      return false;
    }
  };

  // ==================== 配置管理方法 ====================
  
  /**
   * 获取券商配置信息
   * @param {string} ID - 券商ID
   * @returns {Promise<Object|null>}
   */
  const getUnitConfigs = async (ID) => {
    try {
      const res = await GetUnitConfigs({ ObjectId: ID });
      if (res.Code === 200) {
        return formatConfigData(res.DataMap, ID);
      } else {
        ElMessage.error(res.Message);
        return null;
      }
    } catch (error) {
      console.error("获取配置信息失败:", error);
      ElMessage.error("获取配置信息失败");
      return null;
    }
  };
  
  /**
   * 格式化配置数据
   * @param {Array} configList - 配置列表
   * @param {string} unitId - 券商ID
   * @returns {Object} 格式化后的配置数据
   */
  const formatConfigData = (configList, unitId) => {
    const formConfig = {
      UnitId: unitId,
      UnitType: "2",
      Configs: [
        {
          ObjectId: "",
          ConfigKey: "wdt.api.switch",
          ConfigValue: "",
          ConfigDesc: "开关(on:打开)",
        },
        {
          ObjectId: "",
          ConfigKey: "wdt.api.version",
          ConfigValue: "qyb",
          ConfigDesc: "版本(qjb:旗舰版;qyb:企业版;空默认为企业版)",
        },
        {
          ObjectId: "",
          ConfigKey: "wdt.api.sid",
          ConfigValue: "",
          ConfigDesc: "卖家账号，接口请求的公共参数sid",
        },
        {
          ObjectId: "",
          ConfigKey: "wdt.api.shop_no",
          ConfigValue: "",
          ConfigDesc: "店铺编号，接口请求时的业务参数shop_no",
        },
        {
          ObjectId: "",
          ConfigKey: "wdt.api.appsecret",
          ConfigValue: "",
          ConfigDesc: "接口秘钥，接口请求的参数appsecret",
        },
        {
          ObjectId: "",
          ConfigKey: "wdt.api.appkey",
          ConfigValue: "",
          ConfigDesc: "接口账号，接口请求的公共参数appkey",
        },
        {
          ObjectId: "",
          ConfigKey: "order.fee.deduct.rate",
          ConfigValue: "",
          ConfigDesc: "订单费用的平台扣除比例(%)",
        },
        {
          ObjectId: "",
          ConfigKey: "check.goods.stock.when.exchange.in.shop",
          ConfigValue: "",
          ConfigDesc: "线下门店兑换券时，是否校验商品的库存(1:是)",
        },
        {
          ObjectId: "",
          ConfigKey: "check.goods.stock.when.exchange.online",
          ConfigValue: "",
          ConfigDesc: "线上兑换券时，是否校验商品的库存(1:是)",
        },
        {
          ObjectId: "",
          ConfigKey: "wxxcx.kf.headimg.url",
          ConfigValue: "",
          ConfigDesc: "【微信小程序客服】头像URL",
        },
        {
          ObjectId: "",
          ConfigKey: "wxxcx.kf.nickname",
          ConfigValue: "",
          ConfigDesc: "【微信小程序客服】昵称",
        },
        {
          ObjectId: "",
          ConfigKey: "wxxcx.kf.switch",
          ConfigValue: "",
          ConfigDesc: "【微信小程序客服】开关(on:打开)",
        },
        {
          ObjectId: "",
          ConfigKey: "wxxcx.ticket.broker",
          ConfigValue: "",
          ConfigDesc: "是否启用券商私域小程序(1:是)",
        },
        {
          ObjectId: "",
          ConfigKey: "check.prebook.when.exchange.in.shop",
          ConfigValue: "",
          ConfigDesc: "线下门店兑换券时，如果券设置了需要提前预约，是否需要校验(1:是)",
        },
        {
          ObjectId: "",
          ConfigKey: "shmcmp.ak",
          ConfigValue: "",
          ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】AK",
        },
        {
          ObjectId: "",
          ConfigKey: "shmcmp.privatekey",
          ConfigValue: "",
          ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】私钥",
        },
        {
          ObjectId: "",
          ConfigKey: "shmcmp.sk",
          ConfigValue: "",
          ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】SK",
        },
        {
          ObjectId: "",
          ConfigKey: "shmcmp.switch",
          ConfigValue: "",
          ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】开关(on:打开)",
        },
        {
          ObjectId: "",
          ConfigKey: "shmcmp.uniqueno",
          ConfigValue: "",
          ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】联网发行唯一标识",
        },
        {
          ObjectId: "",
          ConfigKey: "deliver.notice",
          ConfigValue: "",
          ConfigDesc: "快递发货通知",
        },
        {
          ObjectId: "",
          ConfigKey: "mall.switch",
          ConfigValue: "",
          ConfigDesc: "【商城】开关(on:打开)",
        },
        {
          ObjectId: "",
          ConfigKey: "mall.goods.category.level",
          ConfigValue: "",
          ConfigDesc: "【商城】商品分类的层级(1级:小类;2级:中类-小类;3级:大类-中类-小类)",
        },
        {
          ObjectId: "",
          ConfigKey: "liniu.mall.hide",
          ConfigValue: "0",
          ConfigDesc: "券商小程序类型是私域时，不显示礼牛商城(1:不显示)",
        },
        {
          ObjectId: "",
          ConfigKey: "mall.goods.stock.hide",
          ConfigValue: "0",
          ConfigDesc: "【商城】是否隐藏商品的库存(1:是)",
        },
        {
          ObjectId: "",
          ConfigKey: "ticket.buy.notice",
          ConfigValue: "",
          ConfigDesc: "从我的卡券点击购买跳转至商品详情页的提示",
        },
        {
          ObjectId: "",
          ConfigKey: "mall.goods.onlymy",
          ConfigValue: "0",
          ConfigDesc: "【商城】在私有商城里是否只有自己的商品(0:不是)",
        },
      ],
      switch: false,
      version: "qyb",
      sid: "",
      shop_no: "",
      appsecret: "",
      appkey: "",
      deduct: "",
      InventorySwitch: false,
      InventorySwitch1: false,
      InventorySwitch2: false,
      wxxcxKfSwitch: false,
      wxxcxKfNickname: "",
      wxxcxKfHeadimgUrl: "",
      wxxcxKfBusinessId: "",
      wxxcxTicketBrokerSwitch: false,
      shmcmpAk: "",
      shmcmpPrivatekey: "",
      shmcmpSk: "",
      shmcmpSwitchDesc: false,
      shmcmpUniqueNo: "",
      mallSwitchDesc: false,
      mallGoodsCategoryLevel: "",
      deliverNotice: "",
      configList: configList // 原始配置列表
    };
    
    // 填充配置数据
    configList.forEach((row) => {
      const configIndex = formConfig.Configs.findIndex(item => item.ConfigKey === row.ConfigKey);
      if (configIndex !== -1) {
        formConfig.Configs[configIndex].ConfigValue = row.ConfigValue;
        formConfig.Configs[configIndex].ObjectId = row.ObjectId;
      }
      
      // 特殊处理
      updateFormConfigByKey(formConfig, row.ConfigKey, row.ConfigValue);
      
      // 处理客服子商户ID
      if (row.ConfigKey.indexOf("business_id") !== -1) {
        if (formConfig.wxxcxKfBusinessId) {
          formConfig.wxxcxKfBusinessId += " ; " + row.ConfigValue;
        } else {
          formConfig.wxxcxKfBusinessId = row.ConfigValue;
        }
      }
    });
    
    return formConfig;
  };
  
  /**
   * 根据配置键更新表单配置
   * @param {Object} formConfig - 表单配置对象
   * @param {string} configKey - 配置键
   * @param {string} configValue - 配置值
   */
  const updateFormConfigByKey = (formConfig, configKey, configValue) => {
    switch (configKey) {
      case "wdt.api.switch":
        formConfig.switch = configValue === "on";
        break;
      case "wdt.api.version":
        formConfig.version = configValue || "qyb";
        break;
      case "wdt.api.sid":
        formConfig.sid = configValue;
        break;
      case "wdt.api.shop_no":
        formConfig.shop_no = configValue;
        break;
      case "wdt.api.appsecret":
        formConfig.appsecret = configValue;
        break;
      case "wdt.api.appkey":
        formConfig.appkey = configValue;
        break;
      case "order.fee.deduct.rate":
        formConfig.deduct = configValue;
        break;
      case "check.goods.stock.when.exchange.in.shop":
        formConfig.InventorySwitch = configValue === "1";
        break;
      case "check.goods.stock.when.exchange.online":
        formConfig.InventorySwitch1 = configValue === "1";
        break;
      case "check.prebook.when.exchange.in.shop":
        formConfig.InventorySwitch2 = configValue === "1";
        break;
      case "wxxcx.kf.nickname":
        formConfig.wxxcxKfNickname = configValue;
        break;
      case "wxxcx.kf.headimg.url":
        formConfig.wxxcxKfHeadimgUrl = configValue;
        break;
      case "wxxcx.kf.switch":
        formConfig.wxxcxKfSwitch = configValue === "on";
        break;
      case "shmcmp.switch":
        formConfig.shmcmpSwitchDesc = configValue === "on";
        break;
      case "shmcmp.ak":
        formConfig.shmcmpAk = configValue;
        break;
      case "shmcmp.privatekey":
        formConfig.shmcmpPrivatekey = configValue;
        break;
      case "shmcmp.sk":
        formConfig.shmcmpSk = configValue;
        break;
      case "shmcmp.uniqueno":
        formConfig.shmcmpUniqueNo = configValue;
        break;
      case "deliver.notice":
        formConfig.deliverNotice = configValue;
        break;
      case "mall.switch":
        formConfig.mallSwitchDesc = configValue === "on";
        break;
      case "mall.goods.category.level":
        formConfig.mallGoodsCategoryLevel = configValue;
        break;
      case "wxxcx.ticket.broker":
        formConfig.wxxcxTicketBrokerSwitch = configValue === "1";
        break;
    }
  };

  // ==================== 二维码管理方法 ====================
  
  /**
   * 获取券商二维码
   * @param {string} unitId - 券商ID
   * @returns {Promise<Object>}
   */
  const getQrCode = async (unitId) => {
    try {
      const res = await GetUnitWxxcxQRCode({
        UnitId: unitId,
        Appid: "",
        QRCodeType: 2,
      });
      if (res.Code === 200) {
        return {
          url: res.DataMap,
          success: true
        };
      } else {
        ElMessage.error(res.Message);
        return {
          success: false
        };
      }
    } catch (error) {
      console.error("获取二维码失败:", error);
      ElMessage.error("获取二维码失败");
      return {
        success: false
      };
    }
  };
  
  /**
   * 重置密码
   * @param {string} unitId - 券商ID
   * @param {string} password - 新密码
   * @returns {Promise<boolean>}
   */
  const resetPassword = async (unitId, password) => {
    try {
      const res = await ResetPwd({
        UnitId: unitId,
        Password: password,
      });
      if (res.Code === 200) {
        ElMessage.success("密码重置成功");
        return true;
      } else {
        ElMessage.error(res.Message);
        return false;
      }
    } catch (error) {
      console.error("密码重置失败:", error);
      ElMessage.error("密码重置失败，请重试");
      return false;
    }
  };

  // ==================== 导出和分页方法 ====================
  
  /**
   * 导出数据
   * @returns {Promise<void>}
   */
  const handleOut = () => {
    handleExport(query, tableLoading);
  };
  
  /**
   * 分页处理
   * @param {number} val - 页码
   */
  const handlePageChange = (val) => {
    query.PageStartRow = val;
    getData();
  };
  
  /**
   * 每页条数变化
   * @param {number} val - 每页条数
   */
  const handleSizeChange = (val) => {
    query.PageRowCount = val;
    getData();
  };
  
  /**
   * 搜索
   */
  const handleSearch = () => {
    query.PageStartRow = 1;
    getData();
  };

  // ==================== 初始化方法 ====================
  
  /**
   * 初始化数据
   * @returns {Promise<void>}
   */
  const init = async () => {
    await getData();
    await checkRight();
    await getBrandList();
    await getAllAccountList();
  };
  
  // ==================== 返回数据和方法 ====================
  return {
    // 响应式数据
    tableLoading,
    tableData,
    pageTotal,
    IsRight,
    BrandList,
    AllAccountList,
    loginUser,
    query,
    
    // 方法
    getData,
    GetUnitById,
    checkRight,
    handleEnable,
    handleDel,
    getBrandList,
    getAllAccountList,
    getUnitConfigs,
    getQrCode,
    resetPassword,
    handleOut,
    handlePageChange,
    handleSizeChange,
    handleSearch,
    init
  };
}
