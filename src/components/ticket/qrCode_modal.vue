<template>
  <el-dialog
    title="二维码"
    v-model="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="qrcode-container">
      <div class="qrcode-wrapper">
        <canvas ref="qrCodeCanvas" class="qrcode-canvas"></canvas>
        <div v-if="!qrCodeUrl" class="loading-text">生成二维码中...</div>
      </div>
      <div class="qrcode-info">
        <p class="qrcode-text">{{ qrCodeText }}</p>
        <div class="qrcode-actions">
          <el-button  class="button2 "  @click="downloadQRCode"
            >下载二维码</el-button
          >
          <el-button class="button2 " @click="copyQRCodeText">复制链接</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  computed,
} from "vue";

import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
import QRCode from "qrcode";
const props = defineProps({
  Visible: Boolean,
  qrCode: {
    type: String,
    default: "",
  },
});
// 从属性中解构
const { Visible, billID,qrCode } = toRefs(props);

const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
const qrCodeCanvas = ref(null);
const qrCodeUrl = ref("");
const qrCodeText = ref("");

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = () => {
  emit("CloseVisible", false);
};
// 生成二维码
const generateQRCode = async () => {
  if (!qrCode.value) {
    ElMessage.warning("二维码内容不能为空");
    return;
  }

  try {
    qrCodeText.value = qrCode.value;

    // 等待DOM更新
    await nextTick();

    if (qrCodeCanvas.value) {
      // 生成二维码到canvas
      await QRCode.toCanvas(qrCodeCanvas.value, qrCode.value, {
        width: 300,
        height: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      // 生成base64图片URL用于下载
      qrCodeUrl.value = qrCodeCanvas.value.toDataURL("image/png");
    }
  } catch (error) {
    console.error("生成二维码失败:", error);
    ElMessage.error("生成二维码失败");
  }
};
// 下载二维码
const downloadQRCode = () => {
  if (!qrCodeUrl.value) {
    ElMessage.warning("请先生成二维码");
    return;
  }

  const link = document.createElement("a");
  link.download = `qrcode-${Date.now()}.png`;
  link.href = qrCodeUrl.value;
  link.click();
};
// 复制二维码文本
const copyQRCodeText = async () => {
  if (!qrCodeText.value) {
    ElMessage.warning("没有可复制的内容");
    return;
  }

  try {
    await navigator.clipboard.writeText(qrCodeText.value);
    ElMessage.success("链接已复制到剪贴板");
  } catch (error) {
    // 降级处理
    const textArea = document.createElement("textarea");
    textArea.value = qrCodeText.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    ElMessage.success("链接已复制到剪贴板");
  }
};
// 初始化数据
const initData = () => {
  qrCodeUrl.value = "";
  qrCodeText.value = "";
  generateQRCode();
};
// 监听弹窗显示状态
watch(
  () => props.Visible,
  (newValue) => {
    dialogVisible.value = newValue;
    if (newValue) {
      initData();
    }
  }
);
// 监听二维码内容变化
watch(
  () => props.qrCode,
  (newValue) => {
    if (newValue && dialogVisible.value) {
      generateQRCode();
    }
  }
);
</script>
<style lang="less">
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qrcode-wrapper {
  position: relative;
  margin-bottom: 20px;

  .qrcode-canvas {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
  }

  .loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #909399;
    font-size: 14px;
  }
}

.qrcode-info {
  text-align: center;

  .qrcode-text {
    margin-bottom: 15px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    max-width: 400px;
  }

  .qrcode-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}
</style>
