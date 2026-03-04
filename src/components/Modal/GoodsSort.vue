<template>
  <!-- 商品排序修改 -->
  <el-dialog
    title="商品排序"
    v-model="localGoodsVisible"
    width="28%"
    :show-close="false"
    :close-on-click-modal="false"
  >
  <div style="width:100%;height: 18px;"></div>
    <el-form label-width="100px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="数值">
            <el-input
              v-model="GoodsIndex"
              clearable
              placeholder="请输入商品排序"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          :loading="modifyLoading"
          @click="ModifyGoodsIndexApi"
          >保 存</el-button
        >
        <el-button class="button2" @click="CloseSortModal">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { ModifyGoodsIndex } from "@/api/goods.js";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsID: "",
  GoodsSortModal: Boolean,
  MallUnitId: String,
  sortValue: String,
});
// //使用父组件传递过来的值
const { GoodsID, MallUnitId, sortValue } = toRefs(props);
const localGoodsVisible = ref(props.GoodsSortModal);
let GoodsIndex = ref("");

const emit = defineEmits(["CloseSortModal"]);
let modifyLoading = ref(false);
const CloseSortModal = async () => {
  emit("CloseSortModal", 1);
};
const ModifyGoodsIndexApi = async () => {
  if (GoodsIndex.value == "") {
    ElMessage.error("请输入商品排序");
    return;
  }
  modifyLoading.value = true;
  let res = await ModifyGoodsIndex({
    GoodsId: GoodsID.value,
    MallUnitId: MallUnitId.value,
    CompositeIndex: GoodsIndex.value,
  });
  modifyLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    emit("CloseSortModal", "");
  } else {
    ElMessage.error(res.Message);
  }
};

watch(
  () => props.GoodsSortModal,
  (newValue, oldValue) => {
    GoodsIndex.value = "";
    GoodsIndex.value = sortValue.value;
    localGoodsVisible.value = newValue;
  }
);
</script>
<style scoped></style>
