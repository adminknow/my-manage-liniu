<template>
  <!-- 上架与下架 -->
  <el-dialog title="批量操作" v-model="localGoodsApproveModal" width="38%" :show-close="false"
    :close-on-click-modal="false">
    <div style="width:100%;height: 18px;"></div>
    <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="TextareaRemark">
    </el-input>
    <template #footer>
      <span class="dialog-footer" v-if="ApproveModalType == 'putAway'">
        <div v-if="ApproveType == 'ApplyOnline'">
          <el-button class="button1" @click="ApplyOnlineBtn">确认上架</el-button>
          <el-button class="button2" @click="CloseSortModal">关 闭</el-button>
        </div>
        <div v-if="ApproveType == 'Offline'">
          <el-button class="button1" @click="OfflineBtn">确认下架</el-button>
          <el-button class="button2" @click="CloseSortModal">关 闭</el-button>
        </div>
      </span>
      <span class="dialog-footer" v-else>
        <div>
          <el-button class="button1" @click="ApproveBtn()">通过</el-button>
          <el-button class="button1" @click="RejectBtn()">拒绝</el-button>
          <el-button class="button2" @click="CloseSortModal">关 闭</el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import {
  OfflineGoodsToMall,
  ApplyOnlineGoodsToMall,
  PassGoodsToMall,
  RejectGoodsToMall,
} from "@/api/goods.js";
import { SearchUnites } from "@/api/index.js";
import { ElMessage } from "element-plus";
var msg = "";
var flag = true;
var iCount = 0;
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsIDs: Array,
  GoodsApproveModal: Boolean,
  ApproveType: String,
  ApproveUnitId: String,
  ApproveModalType: String,
});
// //使用父组件传递过来的值
const { GoodsIDs, ApproveType, ApproveUnitId, ApproveModalType } =
  toRefs(props);
const localGoodsApproveModal = ref(props.GoodsApproveModal);
let TextareaRemark = ref("");
const emit = defineEmits(["CloseApproveModal"]);

const CloseSortModal = async () => {
  flag = true;
  emit("CloseApproveModal", "cancel");
};
const ApplyOnlineBtn = async () => {
  //上架
  iCount = GoodsIDs.value.length;
  opBatch(GoodsIDs.value.length, GoodsIDs.value, ApproveType.value);
};
const OfflineBtn = async () => {
  //下架
  iCount = GoodsIDs.value.length;
  opBatch(GoodsIDs.value.length, GoodsIDs.value, ApproveType.value);
};
const ApproveBtn = async () => {
  //同意审批
  iCount = GoodsIDs.value.length;
  opBatch(GoodsIDs.value.length, GoodsIDs.value, "Pass");
};
const RejectBtn = async () => {
  //拒绝审批
  iCount = GoodsIDs.value.length;
  opBatch(GoodsIDs.value.length, GoodsIDs.value, "Reject");
};
//递归函数
const opBatch = async (iCount, List, type) => {
  if (flag && iCount > 0) {
    let res = null;
    // 判断 1 是否请求成功 2 是否到达请求次数
    var index = iCount;
    if (type == "Offline") {
      res = await OfflineGoodsToMall({
        GoodsId: List[index - 1],
        UnitId: ApproveUnitId.value,
        Remark: TextareaRemark.value,
      });
    }
    if (type == "ApplyOnline") {
      res = await ApplyOnlineGoodsToMall({
        GoodsId: List[index - 1],
        UnitId: ApproveUnitId.value,
        Remark: TextareaRemark.value,
      });
    }
    if (type == "Pass") {
      res = await PassGoodsToMall({
        GoodsId: List[index - 1],
        UnitId: ApproveUnitId.value,
        Remark: TextareaRemark.value,
      });
    }
    if (type == "Reject") {
      res = await RejectGoodsToMall({
        GoodsId: List[index - 1],
        UnitId: ApproveUnitId.value,
        Remark: TextareaRemark.value,
      });
    }
    if (res.Code == 200) {
      iCount--; //请求次数 - 1
      msg = res.Message;
      if (iCount > 0) {
        opBatch(iCount, List, type);
      }
    } else {
      flag = true;
      ElMessage.warning(res.Message);
    }
  }
  if (iCount == 0) {
    TextareaRemark.value = "";
    ElMessage.success(msg);
    emit("CloseApproveModal", "submit");
  }
};
watch(
  () => props.GoodsApproveModal,
  (newValue, oldValue) => {
    localGoodsApproveModal.value = newValue;
    if (!newValue) {
      TextareaRemark.value = "";
    }
  }
);
</script>
<style scoped></style>
