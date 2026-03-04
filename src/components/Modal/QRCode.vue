<template>
  <!-- 小程序二维码 -->
  <el-dialog
    :title="QrTitle"
    v-model="QrCodeVisible"
    width="38%"
    :show-close="false"
  >
    <div style="width: 100%; text-align: center">
      <img :src="QrCodeUrl" style="width: 300px" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button2" @click="closeVisible">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  QrCodeVisible: Boolean,
  QrCodeUrl: "",
  QrTitle: "",
});
// //使用父组件传递过来的值
const { QrCodeVisible, QrCodeUrl } = toRefs(props);
const emit = defineEmits([]);
const closeVisible = async () => {
  emit("CloseVisible", false);
};
watch(
  () => props.QrCodeVisible,
  (newValue, oldValue) => {
    if (newValue) {
    }
  }
);
</script>
<style scoped></style>
