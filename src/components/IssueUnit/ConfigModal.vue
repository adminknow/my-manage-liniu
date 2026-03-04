<template>
  <el-dialog 
    title="配置信息" 
    v-model="dialogVisible" 
    width="38%" 
 :show-close="false"
    :close-on-click-modal="false"
  >
    <div style="width:100%;height: 18px;"></div>
    <el-form 
      ref="formConfigRef" 
      :model="formConfig" 
      label-width="160px"
    >
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <!-- 旺店通标签页 -->
        <el-tab-pane label="旺店通" name="first">
          <el-form-item label="对接">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.switch"
              inline-prompt 
              active-text="开" 
              inactive-text="关" 
            />
          </el-form-item>
          <el-form-item label="版本" v-if="formConfig.switch">
            <el-radio-group 
              v-model="formConfig.version" 
              :disabled="isAdminDisabled"
            >
              <el-radio label="qyb">企业版</el-radio>
              <el-radio label="qjb">旗舰版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卖家账号(sid)" v-if="formConfig.switch">
            <el-input 
              v-model="formConfig.sid" 
              :disabled="isAdminDisabled"
              style="width: 74%" 
              @input="updateConfigValue(2, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺编号(shop_no)" v-if="formConfig.switch">
            <el-input 
              v-model="formConfig.shop_no" 
              style="width: 74%"
              :disabled="isAdminDisabled" 
              @input="updateConfigValue(3, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="接口账号(appkey)" v-if="formConfig.switch">
            <el-input 
              v-model="formConfig.appkey" 
              style="width: 74%"
              :disabled="isAdminDisabled" 
              @input="updateConfigValue(5, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="接口秘钥(appsecret)" v-if="formConfig.switch">
            <el-input 
              v-model="formConfig.appsecret" 
              style="width: 74%"
              :disabled="isAdminDisabled" 
              @input="updateConfigValue(4, $event)"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
        
        <!-- 平台标签页 -->
        <el-tab-pane label="平台" name="second">
          <el-form-item label="扣除费率" label-width="200px">
            <el-input 
              v-model="formConfig.deduct" 
              style="width: 74%" 
              @input="updateConfigValue(6, $event)"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="使用的小程序类型" label-width="200px">
            <el-select 
              v-model="formConfig.Configs[12].ConfigValue" 
              clearable 
              style="width: 74%" 
              placeholder="请选择"
            >
              <el-option label="平台公域" value="0"></el-option>
              <el-option label="平台私域" value="1"></el-option>
              <el-option label="礼牛卡券兑换" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="私域时可以跳转礼牛商城" label-width="200px">
            <el-select 
              v-model="formConfig.Configs[22].ConfigValue" 
              clearable 
              style="width: 74%" 
              placeholder="请选择"
            >
              <el-option label="否" value="1"></el-option>
              <el-option label="是" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        
        <!-- 库存标签页 -->
        <el-tab-pane label="库存" name="three">
          <el-form-item label="线下兑换，校验商品的库存" label-width="220px">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.InventorySwitch"
              inline-prompt 
              active-text="是" 
              inactive-text="否" 
            />
          </el-form-item>
          <el-form-item label="线上兑换，校验商品的库存" label-width="220px">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.InventorySwitch1"
              inline-prompt 
              active-text="是" 
              inactive-text="否" 
            />
          </el-form-item>
          <el-form-item label="线下兑换，校验商品提前预约" label-width="220px">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.InventorySwitch2"
              inline-prompt 
              active-text="是" 
              inactive-text="否" 
            />
          </el-form-item>
          <el-form-item label="发货通知" label-width="220px">
            <el-input 
              :disabled="isAdminDisabled" 
              v-model="formConfig.deliverNotice"
              style="width: 80%" 
              maxlength="200" 
              show-word-limit 
              :rows="2" 
              type="textarea"
            >
            </el-input>
          </el-form-item>
        </el-tab-pane>
        
        <!-- 小程序客服标签页 -->
        <el-tab-pane label="小程序客服" name="four">
          <el-form-item label="开关">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.wxxcxKfSwitch"
              inline-prompt 
              active-text="开" 
              inactive-text="关" 
            />
          </el-form-item>
          <div v-if="formConfig.wxxcxKfSwitch">
            <el-form-item 
              v-for="(item, index) in LabelList" 
              :key="index" 
              :label="item.labelDesc" 
              label-width="340px"
            >
              <el-input v-model="item.value" style="width: 80%" disabled></el-input>
            </el-form-item>
          </div>
          <el-form-item label="客服昵称" v-if="formConfig.wxxcxKfSwitch">
            <el-input v-model="formConfig.wxxcxKfNickname" style="width: 80%" disabled></el-input>
          </el-form-item>
          <el-form-item label="客服头像" v-if="formConfig.wxxcxKfSwitch">
            <div class="kf1-uploader">
              <img :src="formConfig.wxxcxKfHeadimgUrl" class="kf1-uploader-avatar" />
            </div>
          </el-form-item>
        </el-tab-pane>
        
        <!-- 监管平台标签页 -->
        <el-tab-pane label="监管平台" name="five">
          <el-form-item label="开关">
            <el-switch 
              :disabled="isAdminDisabled" 
              v-model="formConfig.shmcmpSwitchDesc"
              inline-prompt 
              active-text="开" 
              inactive-text="关" 
            />
          </el-form-item>
          <el-form-item label="联网发行唯一标识" v-if="formConfig.shmcmpSwitchDesc">
            <el-input 
              v-model="formConfig.shmcmpUniqueNo" 
              :disabled="isAdminDisabled"
              style="width: 74%" 
              @input="updateConfigValue(18, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="AK" v-if="formConfig.shmcmpSwitchDesc">
            <el-input 
              v-model="formConfig.shmcmpAk" 
              :disabled="isAdminDisabled"
              style="width: 74%" 
              @input="updateConfigValue(14, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="SK" v-if="formConfig.shmcmpSwitchDesc">
            <el-input 
              v-model="formConfig.shmcmpSk" 
              :disabled="isAdminDisabled"
              style="width: 74%" 
              @input="updateConfigValue(16, $event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="私钥" v-if="formConfig.shmcmpSwitchDesc">
            <el-input 
              v-model="formConfig.shmcmpPrivatekey" 
              :disabled="isAdminDisabled"
              style="width: 74%" 
              :autosize="{ minRows: 2, maxRows: 4 }" 
              type="textarea"
              @input="updateConfigValue(15, $event)"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
        
        <!-- 商城标签页 -->
        <el-tab-pane label="商城" name="six">
          <el-form-item label="开关" label-width="180px">
            <el-switch 
              v-model="formConfig.mallSwitchDesc" 
              inline-prompt 
              active-text="开" 
              inactive-text="关" 
            />
          </el-form-item>
          <el-form-item label="商品分类的层级" v-if="formConfig.mallSwitchDesc" label-width="180px">
            <el-select 
              style="width: 50%" 
              v-model="formConfig.mallGoodsCategoryLevel" 
              placeholder="请选择层级"
            >
              <el-option label="小类(1级)" value="1"> </el-option>
              <el-option label="中类-小类(2级)" value="2"> </el-option>
              <el-option label="大类-中类-小类(3级)" value="3"> </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item 
                label="商城是否开放外部供应商" 
                v-if="formConfig.mallSwitchDesc" 
                label-width="210px"
              >
                <el-select 
                  style="width: 100%" 
                  disabled 
                  v-model="formConfig.Configs[25].ConfigValue"
                  placeholder="请选择是否"
                >
                  <el-option label="否" value="1"> </el-option>
                  <el-option label="是" value="0"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否隐藏商品库存" v-if="formConfig.mallSwitchDesc" label-width="180px">
            <el-select 
              style="width: 50%" 
              v-model="formConfig.Configs[23].ConfigValue" 
              placeholder="请选择是否"
            >
              <el-option label="是" value="1"> </el-option>
              <el-option label="否" value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="从券跳转至购买的提示" label-width="180px">
            <el-input 
              v-model="formConfig.Configs[24].ConfigValue" 
              disabled 
              style="width: 50%" 
              maxlength="200"
              show-word-limit 
              :rows="2" 
              type="textarea" 
              placeholder="商城跳转说明提示"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button 
          class="button1" 
          :loading="ConfigLoading" 
          @click="handleSave"
        >
          保 存
        </el-button>
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 券商配置弹窗组件
 * 功能：配置券商的旺店通对接、平台设置、库存管理、小程序客服、监管平台和商城设置
 */

import { ref, reactive, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import { ModifyUnitConfigs } from "@/api/index.js";

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  unitId: {
    type: Number,
    default: 0
  },
  configData: {
    type: Object,
    default: () => ({})
  },
  AllAccountList: {
    type: Array,
    default: () => []
  },
  loginUser: {
    type: Object,
    default: () => ({})
  }
});

// 定义emit
const emit = defineEmits(["close", "save"]);

// 响应式数据
const dialogVisible = ref(false);
const activeName = ref("first");
const formConfigRef = ref(null);
const ConfigLoading = ref(false);
const LabelList = ref([]);

// 计算属性
const isAdminDisabled = computed(() => {
  return props.loginUser?.UnitName === '礼牛网';
});

// 表单数据
const formConfig = reactive({
  UnitId: "",
  UnitType: "2",
  Configs: [
    {
      // 0: 旺店通开关
      ObjectId: "",
      ConfigKey: "wdt.api.switch",
      ConfigValue: "",
      ConfigDesc: "开关(on:打开)",
    },
    {
      // 1: 旺店通版本
      ObjectId: "",
      ConfigKey: "wdt.api.version",
      ConfigValue: "qyb",
      ConfigDesc: "版本(qjb:旗舰版;qyb:企业版;空默认为企业版)",
    },
    {
      // 2: 旺店通sid
      ObjectId: "",
      ConfigKey: "wdt.api.sid",
      ConfigValue: "",
      ConfigDesc: "卖家账号，接口请求的公共参数sid",
    },
    {
      // 3: 旺店通shop_no
      ObjectId: "",
      ConfigKey: "wdt.api.shop_no",
      ConfigValue: "",
      ConfigDesc: "店铺编号，接口请求时的业务参数shop_no",
    },
    {
      // 4: 旺店通appsecret
      ObjectId: "",
      ConfigKey: "wdt.api.appsecret",
      ConfigValue: "",
      ConfigDesc: "接口秘钥，接口请求的参数appsecret",
    },
    {
      // 5: 旺店通appkey
      ObjectId: "",
      ConfigKey: "wdt.api.appkey",
      ConfigValue: "",
      ConfigDesc: "接口账号，接口请求的公共参数appkey",
    },
    {
      // 6: 扣除费率
      ObjectId: "",
      ConfigKey: "order.fee.deduct.rate",
      ConfigValue: "",
      ConfigDesc: "订单费用的平台扣除比例(%)",
    },
    {
      // 7: 线下库存校验
      ObjectId: "",
      ConfigKey: "check.goods.stock.when.exchange.in.shop",
      ConfigValue: "",
      ConfigDesc: "线下门店兑换券时，是否校验商品的库存(1:是)",
    },
    {
      // 8: 线上库存校验
      ObjectId: "",
      ConfigKey: "check.goods.stock.when.exchange.online",
      ConfigValue: "",
      ConfigDesc: "线上兑换券时，是否校验商品的库存(1:是)",
    },
    {
      // 9: 客服头像
      ObjectId: "",
      ConfigKey: "wxxcx.kf.headimg.url",
      ConfigValue: "",
      ConfigDesc: "【微信小程序客服】头像URL",
    },
    {
      // 10: 客服昵称
      ObjectId: "",
      ConfigKey: "wxxcx.kf.nickname",
      ConfigValue: "",
      ConfigDesc: "【微信小程序客服】昵称",
    },
    {
      // 11: 客服开关
      ObjectId: "",
      ConfigKey: "wxxcx.kf.switch",
      ConfigValue: "",
      ConfigDesc: "【微信小程序客服】开关(on:打开)",
    },
    {
      // 12: 小程序类型
      ObjectId: "",
      ConfigKey: "wxxcx.ticket.broker",
      ConfigValue: "",
      ConfigDesc: "是否启用券商私域小程序(1:是)",
    },
    {
      // 13: 预约校验
      ObjectId: "",
      ConfigKey: "check.prebook.when.exchange.in.shop",
      ConfigValue: "",
      ConfigDesc: "线下门店兑换券时，如果券设置了需要提前预约，是否需要校验(1:是)",
    },
    {
      // 14: 监管平台AK
      ObjectId: "",
      ConfigKey: "shmcmp.ak",
      ConfigValue: "",
      ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】AK",
    },
    {
      // 15: 监管平台私钥
      ObjectId: "",
      ConfigKey: "shmcmp.privatekey",
      ConfigValue: "",
      ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】私钥",
    },
    {
      // 16: 监管平台SK
      ObjectId: "",
      ConfigKey: "shmcmp.sk",
      ConfigValue: "",
      ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】SK",
    },
    {
      // 17: 监管平台开关
      ObjectId: "",
      ConfigKey: "shmcmp.switch",
      ConfigValue: "",
      ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】开关(on:打开)",
    },
    {
      // 18: 监管平台唯一标识
      ObjectId: "",
      ConfigKey: "shmcmp.uniqueno",
      ConfigValue: "",
      ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】联网发行唯一标识",
    },
    {
      // 19: 发货通知
      ObjectId: "",
      ConfigKey: "deliver.notice",
      ConfigValue: "",
      ConfigDesc: "快递发货通知",
    },
    {
      // 20: 商城开关
      ObjectId: "",
      ConfigKey: "mall.switch",
      ConfigValue: "",
      ConfigDesc: "【商城】开关(on:打开)",
    },
    {
      // 21: 商城分类层级
      ObjectId: "",
      ConfigKey: "mall.goods.category.level",
      ConfigValue: "",
      ConfigDesc: "【商城】商品分类的层级(1级:小类;2级:中类-小类;3级:大类-中类-小类)",
    },
    {
      // 22: 礼牛商城隐藏
      ObjectId: "",
      ConfigKey: "liniu.mall.hide",
      ConfigValue: "0",
      ConfigDesc: "券商小程序类型是私域时，不显示礼牛商城(1:不显示)",
    },
    {
      // 23: 隐藏库存
      ObjectId: "",
      ConfigKey: "mall.goods.stock.hide",
      ConfigValue: "0",
      ConfigDesc: "【商城】是否隐藏商品的库存(1:是)",
    },
    {
      // 24: 商城购买提示
      ObjectId: "",
      ConfigKey: "ticket.buy.notice",
      ConfigValue: "",
      ConfigDesc: "从我的卡券点击购买跳转至商品详情页的提示",
    },
    {
      // 25: 仅显示自己商品
      ObjectId: "",
      ConfigKey: "mall.goods.onlymy",
      ConfigValue: "0",
      ConfigDesc: "【商城】在私有商城里是否只有自己的商品(0:不是)",
    },
  ],
  switch: false, // 旺店通开关
  version: "qyb",
  sid: "", // 卖家账号
  shop_no: "", // 店铺编号
  appsecret: "", // 接口秘钥
  appkey: "", // 接口账号
  deduct: "", // 扣除比例
  InventorySwitch: false, // 线下库存验证
  InventorySwitch1: false, // 线上库存验证
  InventorySwitch2: false, // 预约验证
  wxxcxKfSwitch: false, // 客服开关
  wxxcxKfNickname: "", // 昵称
  wxxcxKfHeadimgUrl: "", // 头像
  wxxcxKfBusinessId: "",
  wxxcxTicketBrokerSwitch: false, // 是否启用券商私域小程序
  shmcmpAk: "", // 监管平台AK
  shmcmpPrivatekey: "", // 监管平台私钥
  shmcmpSk: "", // 监管平台SK
  shmcmpSwitchDesc: false, // 监管平台开关
  shmcmpUniqueNo: "", // 监管平台唯一标识
  mallSwitchDesc: false, // 商城开关
  mallGoodsCategoryLevel: "", // 商品分类等级
  deliverNotice: "", // 快递发货通知
});

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

/**
 * 整理客服数据
 * @param {Array} listPost - 配置列表
 */
const ArrangeList = (listPost) => {
  LabelList.value = [];
  for (let j = 0; j < props.AllAccountList.length; j++) {
    for (let i = 0; i < listPost.length; i++) {
      if (
        listPost[i].ConfigKey.indexOf(props.AllAccountList[j].AppId) !== -1 &&
        listPost[i].ConfigDesc === "【微信小程序客服】子商户ID"
      ) {
        // 匹配上了appid
        LabelList.value.push({
          labelDesc: 
            props.AllAccountList[j].AppName +
            "子商户(" +
            props.AllAccountList[j].AppId +
            ")",
          value: listPost[i].ConfigValue,
        });
      }
    }
  }
};

// 监听configData变化
watch(() => props.configData, (newVal) => {
  if (newVal) {
    // 复制配置数据
    Object.assign(formConfig, newVal);
    // 整理客服数据
    ArrangeList(newVal.configList || []);
  }
}, { deep: true, immediate: true });

/**
 * 处理标签点击
 */
const handleClick = () => {
  // 标签切换时的处理逻辑
};

/**
 * 更新配置值
 * @param {number} index - 配置项索引
 * @param {string} value - 配置值
 */
const updateConfigValue = (index, value) => {
  formConfig.Configs[index].ConfigValue = value;
};

/**
 * 保存配置
 */
const handleSave = async () => {
  if (!formConfigRef.value) return;
  
  formConfigRef.value.validate(async (valid) => {
    if (valid) {
      // 更新配置项
      formConfig.Configs[0].ConfigValue = formConfig.switch ? "on" : "off";
      
      if (formConfig.switch) {
        formConfig.Configs[1].ConfigValue = formConfig.version;
        
        // 验证必填项
        if (formConfig.sid === "") {
          ElMessage.error("请输入卖家账号");
          return;
        }
        if (formConfig.shop_no === "") {
          ElMessage.error("请输入店铺编号");
          return;
        }
        if (formConfig.appsecret === "") {
          ElMessage.error("请输入接口秘钥");
          return;
        }
        if (formConfig.appkey === "") {
          ElMessage.error("请输入接口账号");
          return;
        }
        if (formConfig.deduct === "") {
          ElMessage.error("请输入扣除比例");
          return;
        }
      }
      
      // 更新库存配置
      formConfig.Configs[7].ConfigValue = formConfig.InventorySwitch ? "1" : "0";
      formConfig.Configs[8].ConfigValue = formConfig.InventorySwitch1 ? "1" : "0";
      formConfig.Configs[13].ConfigValue = formConfig.InventorySwitch2 ? "1" : "0";
      
      // 更新客服配置
      if (formConfig.wxxcxKfSwitch) {
        formConfig.Configs[11].ConfigValue = "on";
      }
      
      // 更新监管平台配置
      formConfig.Configs[17].ConfigValue = formConfig.shmcmpSwitchDesc ? "on" : "off";
      
      // 更新发货通知
      formConfig.Configs[19].ConfigValue = formConfig.deliverNotice;
      
      // 更新商城配置
      formConfig.Configs[20].ConfigValue = formConfig.mallSwitchDesc ? "on" : "off";
      if (formConfig.mallSwitchDesc) {
        formConfig.Configs[21].ConfigValue = formConfig.mallGoodsCategoryLevel;
      }
      
      // 提交保存
      ConfigLoading.value = true;
      try {
        const res = await ModifyUnitConfigs({
          ObjectType: 2,
          ObjectId: formConfig.UnitId,
          Configs: formConfig.Configs,
        });
        
        if (res.Code === 200) {
          ElMessage.success("保存成功");
          emit("save");
          handleClose();
        } else {
          ElMessage.error(res.Message);
        }
      } catch (error) {
        console.error("保存配置失败:", error);
        ElMessage.error("保存失败，请重试");
      } finally {
        ConfigLoading.value = false;
      }
    }
  });
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit("close");
};

/**
 * 初始化表单数据
 */
const initForm = () => {
  // 重置表单数据
  formConfig.UnitId = "";
  formConfig.switch = false;
  formConfig.version = "qyb";
  formConfig.sid = "";
  formConfig.shop_no = "";
  formConfig.appsecret = "";
  formConfig.appkey = "";
  formConfig.deduct = "";
  formConfig.InventorySwitch = false;
  formConfig.InventorySwitch1 = false;
  formConfig.InventorySwitch2 = false;
  formConfig.wxxcxKfSwitch = false;
  formConfig.wxxcxKfNickname = "";
  formConfig.wxxcxKfHeadimgUrl = "";
  formConfig.wxxcxKfBusinessId = "";
  formConfig.wxxcxTicketBrokerSwitch = false;
  formConfig.shmcmpAk = "";
  formConfig.shmcmpPrivatekey = "";
  formConfig.shmcmpSk = "";
  formConfig.shmcmpSwitchDesc = false;
  formConfig.shmcmpUniqueNo = "";
  formConfig.mallSwitchDesc = false;
  formConfig.mallGoodsCategoryLevel = "";
  formConfig.deliverNotice = "";
  
  // 重置配置项
  formConfig.Configs.forEach(item => {
    item.ConfigValue = item.ConfigKey === 'wdt.api.version' ? 'qyb' : '';
  });
  
  LabelList.value = [];
};

// 暴露方法
defineExpose({
  initForm
});
</script>

<style scoped>
.kf1-uploader {
  width: 100px;
  height: 100px;
  line-height: 100px !important;
}

.kf1-uploader-avatar {
  width: 100%;
}
</style>