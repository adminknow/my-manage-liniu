<template>
  <el-dialog 
    :title="dialogTitle" 
    v-model="dialogVisible" 
    width="38%" 
    :show-close="false" 
    :close-on-click-modal="false"
  >
    <div style="width: 100%; text-align: center">
      <img :src="qrCodeUrl" style="width: 300px" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 券商二维码弹窗组件
 * 功能：显示券商的二维码图片
 */

import { ref, watch, computed } from "vue";

// 定义props
const props = defineProps({
  /**
   * 弹窗可见性
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * 弹窗标题
   */
  title: {
    type: String,
    default: ""
  },
  /**
   * 二维码图片URL
   */
  qrCodeUrl: {
    type: String,
    default: ""
  }
});

// 定义emit
const emit = defineEmits([
  /**
   * 关闭弹窗事件
   */
  "close"
]);

// 响应式数据
const dialogVisible = ref(false);

/**
 * 计算弹窗标题
 * @returns {string} 弹窗标题
 */
const dialogTitle = computed(() => {
  return props.title || '券商二维码';
});

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit("close");
};
</script>