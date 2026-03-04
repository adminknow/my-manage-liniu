<!-- 操作组件 -->
<template>
  <el-dialog
    title="文件导入"
    v-model="localVisible"
    width="38%"
    :show-close="false"
    :close-on-click-modal="false"
    class="file-upload-dialog"
  >
    <div class="file-detail" :style="autoHeight()">
      <el-form-item
        style="margin-bottom: 8px"
        v-if="fileType == 'HaoxinyGoodsCategoryMap'"
        label="是否虚拟商品分类"
      >
        <el-switch
          inline-prompt
          @change="changeVirtuale"
          v-model="IsVirtual"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item
        style="margin-bottom: 8px"
        v-if="fileType == 'HaoxinySellGoods'"
        label="如果云中鹤中该编码的商品不存在，不导入该商品"
      >
        <el-switch
          inline-prompt
          @change="changeCode"
          v-model="IgnoreNotExistsCode"
          active-text="开"
          inactive-text="关"
        />
      </el-form-item>
      <el-form-item
        style="margin-bottom: 8px"
        v-if="fileType == 'HaoxinySellGoods'"
        label="如果云中鹤中该编码的商品已下架，不导入该商品"
      >
        <el-switch
          inline-prompt
          @change="changeOffline"
          v-model="IgnoreOffline"
          active-text="开"
          inactive-text="关"
        />
      </el-form-item>
      <el-upload
        v-model:file-list="fileList"
        :limit="1"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
        class="file-uploader"
        action="#"
        :http-request="SuccessFile"
        :auto-upload="true"
      >
        <el-button class="button1" round>
          <el-icon>
            <DocumentAdd />
          </el-icon>
          &nbsp;&nbsp;上传文件
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            <el-link
              v-if="fileType == 'HaoxinyGoodsCategoryMap'"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/云中鹤商品分类与礼牛商城商品分类映射导入模板.xlsx"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
            <el-link
              v-if="fileType == 'SellGoods'"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/批量导入售卖商品.xlsx?v=1"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
            <el-link
              v-if="fileType == 'HaoxinySellGoods'"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/云中鹤商品导入模板.xlsx?v=2"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
            <el-link
              v-if="fileType == 'GoodsCategory' && mallGoodsCategoryLevel == 3"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/分类导入模板1.xlsx"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
            <el-link
              v-if="fileType == 'GoodsCategory' && mallGoodsCategoryLevel == 2"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/分类导入模板2.xlsx"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
            <el-link
              v-if="fileType == 'GoodsCategory' && mallGoodsCategoryLevel == 1"
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/分类导入模板1.xlsx"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
          </div>
          <div class="el-upload__tip">支持上传excel文件</div>
        </template>
      </el-upload>
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
import { ElMessage } from "element-plus";
import { Import } from "@/api/imgapi.js";
const props = defineProps({
  //子组件接收父组件传递过来的值
  IDs: "", //ID值
  mallGoodsCategoryLevel: "", //商品分类层级
  fileType: "", //上传文件操作类型
  fileUploadVisible: Boolean,
});
const localVisible = ref(props.fileUploadVisible);
// //使用父组件传递过来的值
const { fileType } = toRefs(props);
const fileList = ref([]); //文件列表
const IgnoreNotExistsCode = ref(false); //导入条件，如果云中鹤中该编码的商品不存在，不导入该商品
const IgnoreOffline = ref(true); //导入条件，如果云中鹤中该编码的商品已下架，不导入该商品
const IsVirtual = ref(false); //导入条件，是否虚拟商品 0否 1是否认是：否

const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
};

const changeCode = (val) => {
  IgnoreNotExistsCode.value = val;
};
const changeVirtuale = (val) => {
  IsVirtual.value = val;
};

const changeOffline = (val) => {
  IgnoreOffline.value = val;
};
const handleUpload = async (file) => {
  const isExcel =
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.warning("请上传excel文件");
    return false;
  }
  return true;
};
const handleRemove = async (param) => {
  fileList.value = [];
};
const SuccessFile = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  fd.append("DataType", fileType.value);
  if (fileType.value == "HaoxinySellGoods") {
    //只有云中鹤需要传这个
    fd.append("IgnoreNotExistsCode", IgnoreNotExistsCode.value ? 1 : 0); //传状态
    fd.append("IgnoreOffline", IgnoreOffline.value ? 1 : 0); //传状态
  }

  if (fileType.value == "HaoxinyGoodsCategoryMap") {
    fd.append("IsVirtual", IsVirtual.value ? 1 : 0); //传状态,//是否虚拟商品 0否 1是
  }

  let res = await Import(fd);
  if (res.Code == 200) {
    ElMessage.success("导入成功");
    fileList.value = [];
    emit("closeUploadVisible", true);
  } else {
    ElMessage.warning({
      message: res.Message + ",请重新导入文件",
      duration: 5000, // 显示5秒钟，您可以根据需要调整这个值
    });
    fileList.value = [];
  }
};
const closeVisible = () => {
  localVisible.value = false;
  fileList.value = [];
  emit("closeUploadVisible", false);
};
const autoHeight = () => {
  let heightValue = "";
  if (fileType.value == "HaoxinySellGoods") {
    heightValue = "150px";
  } else if (fileType.value == "HaoxinyGoodsCategoryMap") {
    heightValue = "120px";
  } else {
    heightValue = "82px";
  }
  return {
    height: heightValue,
  };
};
watch(
  () => props.fileUploadVisible,
  (newValue, oldValue) => {
    localVisible.value = newValue;
    if (newValue) {
    }
  }
);
const emit = defineEmits(["closeUploadVisible"]);

////////////////////////////////////////////////////////////////
</script>
<style lang="less">
.file-upload-dialog {
  .el-dialog__body {
    padding-top: 20px !important;
  }
  .file-uploader {
    width: 100%;
    height: 0;
  }
  .file-uploader .el-upload {
    width: 100%;
    height: auto;
    border: none !important;
    justify-content: start !important;
  }
}
</style>
