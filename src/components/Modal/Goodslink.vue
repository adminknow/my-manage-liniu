<template>
  <!-- 商品小程序链接 -->
  <el-dialog
    title="小程序链接"
    v-model="localGoodsVisible"
    width="38%"
    :show-close="false"
    :close-on-click-modal="false"
  >
  <div style="width:100%;height:10px"></div>
    <div class="" style="padding: 0 20px">
      <el-form>
        <el-row>
          <el-col :span="20">
            <el-form-item label="自有商城链接">
              <el-input disabled v-model="link"></el-input> </el-form-item
          ></el-col>
          <el-col :span="3" :offset="1">
            <el-form-item label="">
              <el-link
                type="primary"
                @click="copyToClipboard(link)"
                style="color: #f56c6c"
                >复制</el-link
              ></el-form-item
            >
          </el-col>
        </el-row>
        <el-row v-if="link2 != ''">
          <el-col :span="20">
            <el-form-item label="礼牛商城链接">
              <el-input disabled v-model="link2"></el-input> </el-form-item
          ></el-col>
          <el-col :span="3" :offset="1">
            <el-form-item label="">
              <el-link
                type="primary"
                @click="copyToClipboard(link2)"
                style="color: #f56c6c"
                >复制</el-link
              ></el-form-item
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button2" @click="CloseVisible1">关 闭</el-button>
      </span>
    </template>
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
} from "vue";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";
const { proxy } = getCurrentInstance();
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsLinkVisible: Boolean,
  link: String,
  link2: String,
  link3: String,
});
// //使用父组件传递过来的值
const { link, link2, link3 } = toRefs(props);
const localGoodsVisible = ref(props.GoodsLinkVisible);

const loginUser = JSON.parse(Cookie.get("User"));
const emit = defineEmits(["CloseVisible"]);
const CloseVisible1 = async () => {
  emit("CloseVisible", false);
};
const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success("复制成功！");
  } catch (err) {
    ElMessage.success("复制失败");
  }
};
watch(
  () => props.GoodsLinkVisible,
  (newValue, oldValue) => {
    localGoodsVisible.value = newValue;
  }
);
</script>
<style scoped></style>
