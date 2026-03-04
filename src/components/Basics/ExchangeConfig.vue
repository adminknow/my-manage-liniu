<template>
  <el-form-item label="线上兑换，校验商品的库存">
    <el-switch v-model="onlineCheck" @update:model-value="updateOnline" inline-prompt active-text="开"
      inactive-text="关" />
  </el-form-item>
  <el-form-item label="线下兑换，校验商品的库存">
    <el-switch v-model="offlineCheck" @update:model-value="updateOffline" inline-prompt active-text="开"
      inactive-text="关" />
  </el-form-item>
  <el-form-item label="线下兑换，校验预约日期">
    <el-switch v-model="prebookCheck" @update:model-value="updatePrebook" inline-prompt active-text="开"
      inactive-text="关" />
  </el-form-item>
  <el-form-item label="发货通知">
    <el-input v-model="deliverNotice" style="width: 50%" maxlength="200" show-word-limit :rows="2" type="textarea"
      @update:model-value="updateDeliverNotice">
    </el-input>
  </el-form-item>
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  onlineCheck: {
    type: Boolean,
    default: false
  },
  offlineCheck: {
    type: Boolean,
    default: false
  },
  prebookCheck: {
    type: Boolean,
    default: false
  },
  deliverNotice: String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const { onlineCheck, offlineCheck, prebookCheck,deliverNotice } = toRefs(props);
// 计算属性
const switchValue = ref(false);
// 封装数据更新函数
const emitUpdate = (key, value) => {
  emit("update", { [key]: value });
};

// 各个字段的更新方法
const updateOnline = (value) => {
  emitUpdate("online-check", value);
};

const updateOffline = (value) => {
  emitUpdate("offline-check", value);
};

const updatePrebook = (value) => {
  emitUpdate("prebook-check", value);
};

const updateDeliverNotice = (value) => {
  emitUpdate("deliver-notice", value);
};
// 监听弹窗显示状态
watch(
  () => props.onlineCheck,
  (newValue) => {
  }
);
////////////////////////////////////////////////////////////////
</script>
