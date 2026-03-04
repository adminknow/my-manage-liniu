<template>
  <div class="container">
    <el-form v-loading="pageLoading" ref="formConfigRef" :model="formConfig" label-position="left">
      <p style="font-size: 18px">
        {{ loginUser.UnitName + "(" + loginUser.UnitId + ")" }}
        小程序首页地址：pages/home/index?UnitId={{ loginUser.UnitId }}
      </p>
      <!-- 基础设置 -->
      <Section-title title="基础设置"></Section-title>
      <el-row>
        <el-col :span="16" :offset="1">
          <el-form-item label="Logo" label-width="100px">
            <Logo-uploader :valueImgUrl="getConfigValue(CONFIG_KEYS.LOGO)"
              @update="(value) => updateConfig(CONFIG_KEYS.LOGO, value)"></Logo-uploader>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 旺店通配置 -->
      <SectionTitle title="旺店通" />
      <el-row>
        <el-col :span="16" :offset="1">
          <WdtConfig :switchWdt="uiState.wdtSwitch" :versionWdt="uiState.wdtVersion" :sidWdt="uiState.wdtSid"
            :shopNoWdt="uiState.wdtShopNo" :appKeyWdt="uiState.wdtAppkey" :appSecretWdt="uiState.wdtAppsecret"
            @update="handleWdtUpdate" />
        </el-col>
      </el-row>

      <!-- 商城配置 -->
      <SectionTitle title="商城" />
      <el-row>
        <el-col :span="16" :offset="1">
          <MallConfig :switchComponent="uiState.mallSwitch" :categoryLevel="uiState.mallCategoryLevel"
            :stockHide="getConfigValue(CONFIG_KEYS.MALL_STOCK_HIDE)"
            :onlyMy="getConfigValue(CONFIG_KEYS.MALL_ONLY_MY)"
            :unitType="loginUser.UnitType"
            :buyNotice="getConfigValue(CONFIG_KEYS.TICKET_BUY_NOTICE)" :disabled="true" :unitName="loginUser.UnitName"
            @update="handleMallUpdate" />
        </el-col>
      </el-row>

      <!-- 监管平台配置 -->
      <SectionTitle title="监管平台" />
      <el-row>
        <el-col :span="16" :offset="1">
          <ShmcmpConfig :switch="uiState.shmcmpSwitch" :uniqueNo="uiState.shmcmpUniqueNo" :ak="uiState.shmcmpAk"
            :sk="uiState.shmcmpSk" :privatekey="uiState.shmcmpPrivatekey" :disabled="isGiftOx"
            @update="handleShmcmpUpdate" />
        </el-col>
      </el-row>

      <!-- 券兑换配置 -->
      <SectionTitle title="券兑换" />
      <el-row>
        <el-col :span="16" :offset="1">
          <ExchangeConfig :onlineCheck="uiState.checkStockOnline" :offlineCheck="uiState.checkStockOffline"
            :prebookCheck="uiState.checkPrebook" :deliverNotice="uiState.deliverNotice"
            @update="handleExchangeUpdate" />
        </el-col>
      </el-row>

      <!-- 客服配置 -->
      <SectionTitle title="客服" />
      <el-row>
        <el-col :span="16" :offset="1">
          <KfConfig :switchKF="uiState.kfSwitch" :nickname="uiState.kfNickname" :headimg="uiState.kfHeadimg"
            @update="handleKfUpdate" />
        </el-col>
      </el-row>
      <el-row v-if="loginUser.UnitType == 2">
        <el-col :span="16" :offset="1">
          <el-form-item>
            <el-button round class="button1" :loading="btnLoading" @click="onSubmit">
              <el-icon>
                <CirclePlus />
              </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
            </el-button>
            <el-button class="button2" @click="refreshData" round>&nbsp;&nbsp;刷&nbsp;&nbsp;新&nbsp;&nbsp;</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import SectionTitle from "@/components/Basics/SectionTitle.vue";
import LogoUploader from "@/components/Basics/LogoUploader.vue";
import WdtConfig from "@/components/Basics/WdtConfig.vue";
import ShmcmpConfig from "@/components/Basics/ShmcmpConfig.vue";
import ExchangeConfig from "@/components/Basics/ExchangeConfig.vue";
import KfConfig from "@/components/Basics/KfConfig.vue";
import MallConfig from "@/components/Basics/MallConfig.vue";

import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { GetUnitConfigs, ModifyUnitConfigs } from "@/api/index.js";
import Cookie from "js-cookie";

// 常量定义
const CONFIG_KEYS = {
  WDT_SWITCH: "wdt.api.switch",
  WDT_VERSION: "wdt.api.version",
  WDT_SID: "wdt.api.sid",
  WDT_SHOP_NO: "wdt.api.shop_no",
  WDT_APPSECRET: "wdt.api.appsecret",
  WDT_APPKEY: "wdt.api.appkey",
  CHECK_STOCK_OFFLINE: "check.goods.stock.when.exchange.in.shop",
  CHECK_STOCK_ONLINE: "check.goods.stock.when.exchange.online",
  WXXCX_KF_SWITCH: "wxxcx.kf.switch",
  WXXCX_KF_HEADIMG: "wxxcx.kf.headimg.url",
  WXXCX_KF_NICKNAME: "wxxcx.kf.nickname",
  CHECK_PREBOOK: "check.prebook.when.exchange.in.shop",
  SHMCMP_AK: "shmcmp.ak",
  SHMCMP_PRIVATEKEY: "shmcmp.privatekey",
  SHMCMP_SK: "shmcmp.sk",
  SHMCMP_SWITCH: "shmcmp.switch",
  SHMCMP_UNIQUENO: "shmcmp.uniqueno",
  DELIVER_NOTICE: "deliver.notice",
  MALL_SWITCH: "mall.switch",
  MALL_CATEGORY_LEVEL: "mall.goods.category.level",
  MALL_STOCK_HIDE: "mall.goods.stock.hide",
  MALL_ONLY_MY: "mall.goods.onlymy",
  TICKET_BUY_NOTICE: "ticket.buy.notice",
  LOGO: "logo",
};
// 工厂函数
const createConfigItem = (key, value = "", desc = "") => ({
  ObjectId: "",
  ConfigKey: key,
  ConfigValue: value,
  ConfigDesc: desc,
});
// 状态管理
const loginUser = JSON.parse(Cookie.get("User"));
const btnLoading = ref(false);
const pageLoading = ref(false);
const formConfigRef = ref(null);

// 配置数据
const formConfig = reactive({
  UnitId: "",
  UnitType: "2",
  Configs: [
    createConfigItem(CONFIG_KEYS.WDT_SWITCH, "", "开关(on:打开)"),
    createConfigItem(
      CONFIG_KEYS.WDT_VERSION,
      "qyb",
      "版本(qjb:旗舰版;qyb:企业版;空默认为企业版)"
    ),
    createConfigItem(
      CONFIG_KEYS.WDT_SID,
      "",
      "卖家账号，接口请求的公共参数sid"
    ),
    createConfigItem(
      CONFIG_KEYS.WDT_SHOP_NO,
      "",
      "店铺编号，接口请求时的业务参数shop_no"
    ),
    createConfigItem(
      CONFIG_KEYS.WDT_APPSECRET,
      "",
      "接口秘钥，接口请求的参数appsecret"
    ),
    createConfigItem(
      CONFIG_KEYS.WDT_APPKEY,
      "",
      "接口账号，接口请求的公共参数appkey"
    ),
    createConfigItem(
      CONFIG_KEYS.CHECK_STOCK_OFFLINE,
      "",
      "线下门店兑换券时，是否校验商品的库存(1:是)"
    ),
    createConfigItem(
      CONFIG_KEYS.CHECK_STOCK_ONLINE,
      "",
      "线上兑换券时，是否校验商品的库存(1:是)"
    ),
    createConfigItem(
      CONFIG_KEYS.WXXCX_KF_SWITCH,
      "",
      "【微信小程序客服】开关(on:打开)"
    ),
    createConfigItem(
      CONFIG_KEYS.WXXCX_KF_HEADIMG,
      "",
      "【微信小程序客服】头像URL"
    ),
    createConfigItem(
      CONFIG_KEYS.WXXCX_KF_NICKNAME,
      "",
      "【微信小程序客服】昵称"
    ),
    createConfigItem(
      CONFIG_KEYS.CHECK_PREBOOK,
      "",
      "线下门店兑换券时，如果券设置了需要提前预约，是否需要校验(1:是)"
    ),
    createConfigItem(
      CONFIG_KEYS.SHMCMP_AK,
      "",
      "【上海市商务委单用途预付卡协同监管平台】AK"
    ),
    createConfigItem(
      CONFIG_KEYS.SHMCMP_PRIVATEKEY,
      "",
      "【上海市商务委单用途预付卡协同监管平台】私钥"
    ),
    createConfigItem(
      CONFIG_KEYS.SHMCMP_SK,
      "",
      "【上海市商务委单用途预付卡协同监管平台】SK"
    ),
    createConfigItem(
      CONFIG_KEYS.SHMCMP_SWITCH,
      "",
      "【上海市商务委单用途预付卡协同监管平台】开关(on:打开)"
    ),
    createConfigItem(
      CONFIG_KEYS.SHMCMP_UNIQUENO,
      "",
      "【上海市商务委单用途预付卡协同监管平台】联网发行唯一标识"
    ),
    createConfigItem(CONFIG_KEYS.DELIVER_NOTICE, "", "快递发货通知"),
    createConfigItem(CONFIG_KEYS.MALL_SWITCH, "", "【商城】开关(on:打开)"),
    createConfigItem(
      CONFIG_KEYS.MALL_CATEGORY_LEVEL,
      "",
      "【商城】商品分类的层级"
    ),
    createConfigItem(
      CONFIG_KEYS.MALL_STOCK_HIDE,
      "",
      "券商小程序类型是私域时，不显示礼牛商城(1:不显示)"
    ),
    createConfigItem(
      CONFIG_KEYS.MALL_ONLY_MY,
      "0",
      "【商城】在私有商城里是否只有自己的商品(0:不是)"
    ),
    createConfigItem(
      CONFIG_KEYS.TICKET_BUY_NOTICE,
      "",
      "从我的卡券点击购买跳转至商品详情页的提示"
    ),
    createConfigItem(CONFIG_KEYS.LOGO, "", "Logo图片"),
  ],
});

// 计算属性
const isGiftOx = computed(() => loginUser.UnitName === "礼牛网");

const uiState = computed(() => {
  const findConfig = (key) =>
    formConfig.Configs.find((c) => c.ConfigKey === key);
  console.log(formConfig);
  return {
    wdtSwitch: findConfig(CONFIG_KEYS.WDT_SWITCH)?.ConfigValue === "on",
    wdtVersion: findConfig(CONFIG_KEYS.WDT_VERSION)?.ConfigValue || "qyb",
    wdtSid: findConfig(CONFIG_KEYS.WDT_SID)?.ConfigValue || "",
    wdtShopNo: findConfig(CONFIG_KEYS.WDT_SHOP_NO)?.ConfigValue || "",
    wdtAppsecret: findConfig(CONFIG_KEYS.WDT_APPSECRET)?.ConfigValue || "",
    wdtAppkey: findConfig(CONFIG_KEYS.WDT_APPKEY)?.ConfigValue || "",

    checkStockOffline:
      findConfig(CONFIG_KEYS.CHECK_STOCK_OFFLINE)?.ConfigValue === "1",
    checkStockOnline:
      findConfig(CONFIG_KEYS.CHECK_STOCK_ONLINE)?.ConfigValue === "1",
    checkPrebook: findConfig(CONFIG_KEYS.CHECK_PREBOOK)?.ConfigValue === "1",

    kfSwitch: findConfig(CONFIG_KEYS.WXXCX_KF_SWITCH)?.ConfigValue === "on",
    kfNickname: findConfig(CONFIG_KEYS.WXXCX_KF_NICKNAME)?.ConfigValue || "",
    kfHeadimg: findConfig(CONFIG_KEYS.WXXCX_KF_HEADIMG)?.ConfigValue || "",

    shmcmpSwitch: findConfig(CONFIG_KEYS.SHMCMP_SWITCH)?.ConfigValue === "on",
    shmcmpAk: findConfig(CONFIG_KEYS.SHMCMP_AK)?.ConfigValue || "",
    shmcmpSk: findConfig(CONFIG_KEYS.SHMCMP_SK)?.ConfigValue || "",
    shmcmpPrivatekey:
      findConfig(CONFIG_KEYS.SHMCMP_PRIVATEKEY)?.ConfigValue || "",
    shmcmpUniqueNo: findConfig(CONFIG_KEYS.SHMCMP_UNIQUENO)?.ConfigValue || "",

    mallSwitch: findConfig(CONFIG_KEYS.MALL_SWITCH)?.ConfigValue === "on",
    mallCategoryLevel:
      findConfig(CONFIG_KEYS.MALL_CATEGORY_LEVEL)?.ConfigValue || "",

    deliverNotice: findConfig(CONFIG_KEYS.DELIVER_NOTICE)?.ConfigValue || "",
  };
});

// 工具函数
const getConfigValue = (key) => {
  const config = formConfig.Configs.find((c) => c.ConfigKey === key);
  return config?.ConfigValue || "";
};

const updateConfig = (key, value) => {
  const config = formConfig.Configs.find((c) => c.ConfigKey === key);
  if (config) {
    config.ConfigValue = value;
  }
};

// 数据处理器
const configDataProcessor = {
  // 从API响应处理配置数据
  processApiResponse: (dataMap) => {
    const configMap = new Map();

    dataMap.forEach((item) => {
      if (
        item.ConfigKey == CONFIG_KEYS.WDT_SWITCH ||
        item.ConfigKey === CONFIG_KEYS.WXXCX_KF_SWITCH ||
        item.ConfigKey === CONFIG_KEYS.SHMCMP_SWITCH
      ) {
        item.ConfigValue = item.ConfigValue === "on" ? "on" : "off";
      }
      configMap.set(item.ConfigKey, item.ConfigValue);
    });

    // 更新配置数组
    formConfig.Configs.forEach((config) => {
      if (configMap.has(config.ConfigKey)) {
        config.ConfigValue = configMap.get(config.ConfigKey);
      }
    });
  },

  // 验证配置数据
  validateConfigs: () => {
    const errors = [];

    // 旺店通配置验证
    if (uiState.value.wdtSwitch) {
      if (!uiState.value.wdtSid) errors.push("请输入卖家账号");
      if (!uiState.value.wdtShopNo) errors.push("请输入店铺编号");
      if (!uiState.value.wdtAppsecret) errors.push("请输入接口秘钥");
      if (!uiState.value.wdtAppkey) errors.push("请输入接口账号");
    }

    // 客服配置验证
    if (uiState.value.kfSwitch) {
      if (!uiState.value.kfNickname) errors.push("请输入客服昵称");
      if (!uiState.value.kfHeadimg) errors.push("请选择客服头像");
    }

    return errors;
  },

  // 准备提交数据
  prepareSubmitData: () => {
    // 更新开关类型配置
    updateConfig(
      CONFIG_KEYS.WDT_SWITCH,
      uiState.value.wdtSwitch ? "on" : "off"
    );
    updateConfig(CONFIG_KEYS.WDT_VERSION, uiState.value.wdtVersion);
    updateConfig(
      CONFIG_KEYS.CHECK_STOCK_OFFLINE,
      uiState.value.checkStockOffline ? "1" : "0"
    );
    updateConfig(
      CONFIG_KEYS.CHECK_STOCK_ONLINE,
      uiState.value.checkStockOnline ? "1" : "0"
    );
    updateConfig(
      CONFIG_KEYS.CHECK_PREBOOK,
      uiState.value.checkPrebook ? "1" : "0"
    );
    updateConfig(
      CONFIG_KEYS.WXXCX_KF_SWITCH,
      uiState.value.kfSwitch ? "on" : "off"
    );
    updateConfig(
      CONFIG_KEYS.SHMCMP_SWITCH,
      uiState.value.shmcmpSwitch ? "on" : "off"
    );
    updateConfig(
      CONFIG_KEYS.MALL_SWITCH,
      uiState.value.mallSwitch ? "on" : "off"
    );

    if (uiState.value.mallSwitch) {
      updateConfig(
        CONFIG_KEYS.MALL_CATEGORY_LEVEL,
        uiState.value.mallCategoryLevel
      );
    }
  },
};

// 事件处理器
const handleWdtUpdate = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    const configKey = `wdt.api.${key}`;
    updateConfig(configKey, value);
  });
};

const handleMallUpdate = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === "switch") {
      updateConfig(CONFIG_KEYS.MALL_SWITCH, value ? "on" : "off");
    } else if (key === "categoryLevel") {
      updateConfig(CONFIG_KEYS.MALL_CATEGORY_LEVEL, value);
    } else if (key === "stockHide") {
      updateConfig(CONFIG_KEYS.MALL_STOCK_HIDE, value);
    } else if (key === "buyNotice") {
      updateConfig(CONFIG_KEYS.TICKET_BUY_NOTICE, value);
    }else if (key === "onlyMy") {
      //【商城】在私有商城里是否只有自己的商品(0:不是)
      updateConfig(CONFIG_KEYS.MALL_ONLY_MY, value);
    }
  });
};

const handleShmcmpUpdate = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === "switch") {
      updateConfig(CONFIG_KEYS.SHMCMP_SWITCH, value ? "on" : "off");
    } else {
      const configKey = `shmcmp.${key.toLowerCase()}`;
      updateConfig(configKey, value);
    }
  });
};

const handleExchangeUpdate = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === "online-check") {
      updateConfig(CONFIG_KEYS.CHECK_STOCK_ONLINE, value ? "1" : "0");
    } else if (key === "offline-check") {
      updateConfig(CONFIG_KEYS.CHECK_STOCK_OFFLINE, value ? "1" : "0");
    } else if (key === "prebook-check") {
      updateConfig(CONFIG_KEYS.CHECK_PREBOOK, value ? "1" : "0");
    } else if (key === "deliver-notice") {
      updateConfig(CONFIG_KEYS.DELIVER_NOTICE, value);
    }
  });
};

const handleKfUpdate = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === "switch-kf") {
      updateConfig(CONFIG_KEYS.WXXCX_KF_SWITCH, value ? "on" : "off");
    } else if (key === "nickname") {
      updateConfig(CONFIG_KEYS.WXXCX_KF_NICKNAME, value);
    } else if (key === "headimg") {
      updateConfig(CONFIG_KEYS.WXXCX_KF_HEADIMG, value);
    }
  });
};

// API 调用
const loadConfigs = async () => {
  try {
    pageLoading.value = true;
    const res = await GetUnitConfigs({ ObjectId: loginUser.UnitId });

    if (res.Code === 200) {
      configDataProcessor.processApiResponse(res.DataMap);
    } else {
      ElMessage.error(res.Message || "获取配置失败");
    }
  } catch (error) {
    ElMessage.error("网络错误，请稍后重试");
  } finally {
    pageLoading.value = false;
  }
};

const refreshData = () => {
  loadConfigs();
};

const onSubmit = async () => {
  try {
    const valid = await formConfigRef.value.validate();
    if (!valid) return;

    // 验证配置
    const errors = configDataProcessor.validateConfigs();
    if (errors.length > 0) {
      ElMessage.error(errors[0]);
      return;
    }

    // 准备提交数据
    configDataProcessor.prepareSubmitData();

    btnLoading.value = true;
    const res = await ModifyUnitConfigs({
      ObjectType: 2,
      ObjectId: loginUser.UnitId,
      Configs: formConfig.Configs,
    });

    if (res.Code === 200) {
      ElMessage.success("保存成功");
      await loadConfigs();
    } else {
      ElMessage.error(res.Message || "保存失败");
    }
  } catch (error) {
    ElMessage.error("保存失败，请稍后重试");
  } finally {
    btnLoading.value = false;
  }
};

// 生命周期
onMounted(() => {
  loadConfigs();
});
</script>

<style>
.kf-uploader {
  width: 150px;
  height: 150px;
}

.kf-uploader .el-upload {
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.kf-uploader-avatar {
  width: 100%;
}

.logo-uploader {
  width: 190px;
  height: 80px;
}

.logo-uploader .el-upload {
  width: 190px !important;
  height: 80px !important;
  line-height: 80px !important;
}
</style>
