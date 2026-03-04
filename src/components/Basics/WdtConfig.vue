<template>
  <el-form-item label="对接">
    <el-switch v-model="switchWdt" @update:model-value="updateSwitch" inline-prompt active-text="开" inactive-text="关" />
  </el-form-item>
  <el-form-item label="版本" v-if="switchWdt">
    <el-radio-group v-model="versionWdt" @update:model-value="updateVersion">
      <el-radio label="qyb">企业版</el-radio>
      <el-radio label="qjb">旗舰版</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="卖家账号(sid)" v-if="switchWdt">
    <el-input v-model="sidWdt" style="width: 40%" @update:model-value="updateSid"></el-input>
  </el-form-item>
  <el-form-item label="店铺编号(shop_no)" v-if="switchWdt">
    <el-input v-model="shopNoWdt" style="width: 40%" @update:model-value="updateShopNo"></el-input>
  </el-form-item>
  <el-form-item label="接口账号(appkey)" v-if="switchWdt">
    <el-input v-model="appKeyWdt" style="width: 40%" @update:model-value="updateAppKey"></el-input>
  </el-form-item>
  <el-form-item label="接口秘钥(appsecret)" v-if="switchWdt">
    <el-input v-model="appSecretWdt" style="width: 40%" @update:model-value="updateAppSecret"></el-input>
  </el-form-item>
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  switchWdt: {
    type: String,
    default: "",
  },
  versionWdt: {
    type: String,
    default: "qyb",
  },
  sidWdt: String,
  shopNoWdt: String,
  appKeyWdt: String,
  appSecretWdt: String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const { switchWdt ,versionWdt,sidWdt,shopNoWdt,appKeyWdt,appSecretWdt} = toRefs(props);
// 计算属性

// 封装数据更新函数
const emitUpdate = (key, value) => {
  emit("update", { [key]: value });
};

// 各个字段的更新方法
const updateSwitch = (value) => {
  emitUpdate("switch", value ? "on" : "");
};

const updateVersion = (value) => {
  emitUpdate("version", value);
};

const updateSid = (value) => {
  emitUpdate("sid", value);
};

const updateShopNo = (value) => {
  emitUpdate("shop_no", value);
};

const updateAppKey = (value) => {
  emitUpdate("appkey", value);
};

const updateAppSecret = (value) => {
  emitUpdate("appsecret", value);
};

////////////////////////////////////////////////////////////////
</script>
<style scoped>
.logo-uploader-avatar {
  width: 100%;
}
</style>
