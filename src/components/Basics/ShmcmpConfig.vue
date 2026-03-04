<template>
  <el-form-item label="对接">
    <el-switch
      v-model="switchValue"
      @update:model-value="updateSwitch"
      inline-prompt
      active-text="开"
      inactive-text="关"
    />
  </el-form-item>
  <el-form-item label="标识" v-if="switchValue" label-width="80px">
    <el-input
      v-model="uniqueNo"
      style="width: 40%"
      placeholder="联网发行唯一标识"
      @update:model-value="updateUniqueNo"
    ></el-input>
  </el-form-item>
  <el-form-item label="AK" v-if="switchValue" label-width="80px">
    <el-input
      v-model="ak"
      style="width: 40%"
      @update:model-value="updateAk"
    ></el-input>
  </el-form-item>
  <el-form-item label="SK" v-if="switchValue" label-width="80px">
    <el-input
      v-model="sk"
      style="width: 40%"
      @update:model-value="updateSk"
    ></el-input>
  </el-form-item>
  <el-form-item label="私钥" v-if="switchValue" label-width="80px">
    <el-input
      v-model="privatekey"
      style="width: 40%"
      @update:model-value="updatePrivatekey"
    ></el-input>
  </el-form-item>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  switch: {
    type: String,
    default: "",
  },
  uniqueNo: {
    type: String,
    default: "",
  },
  ak: String,
  sk: String,
  privatekey: String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const {uniqueNo,ak,sk,privatekey} = toRefs(props);
// 计算属性
const switchValue = ref(false);
// 封装数据更新函数
const emitUpdate = (key, value) => {
  emit("update", { [key]: value });
};

// 各个字段的更新方法
const updateSwitch = (value) => {
  emitUpdate("switch", value ? "on" : "");
};

const updateUniqueNo = (value) => {
  emitUpdate("uniqueno", value);
};

const updateAk = (value) => {
  emitUpdate("ak", value);
};

const updateSk = (value) => {
  emitUpdate("sk", value);
};

const updatePrivatekey = (value) => {
  emitUpdate("privatekey", value);
};

// 监听弹窗显示状态
watch(
  () => props.switch,
  (newValue) => {
    switchValue.value = newValue === "on";
  }
);
////////////////////////////////////////////////////////////////
</script>
<style scoped>
.logo-uploader-avatar {
  width: 100%;
}
</style>
