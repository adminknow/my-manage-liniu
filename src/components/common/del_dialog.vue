<!-- 操作组件 -->
<template>
  <el-dialog :title="OpTitle" v-model="Visible" width="38%" :show-close="false" :close-on-click-modal="false">
    <!-- 针对笔记批量审批需要增加一个标签 -->
    <div v-if="OpType == 'BJApprove'">
      <el-select v-model="selTagValue" multiple placeholder="请选择标签" style="width: 100%">
        <el-option v-for="item in tagList" :key="item.TagName" :label="item.TagName" :value="item.TagId" />
      </el-select>
    </div>
    <div style="width: 100%; height: 10px"></div>
    <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="TextareaRemark">
    </el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button1" :loading="BtnLoading" @click="DelPromoterBtn">确 认</el-button>
        <el-button class="button2" @click="closeVisible">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
var iCount = 0;
var msg = "";
import { ref, reactive, toRefs, watch } from "vue";
import {
  DeleteAllCustomersByPromoter,
  DeletePromoter,
  DeletePromoterByVip,
} from "@/api/promoteApi.js";
import { GetTagListByGroupId } from "@/api/shopApi.js";
import { PassNote, DeleteMyNote, RemoveMyNote } from "@/api/vip.js";
import { PassGoodsBill, CancelGoodsBill } from "@/api/bill.js";
import {
  PassMallAct,
  CancelMallAct,
  PauseMallAct,
  RestoreMallAct,
} from "@/api/market.js";

import { BatchOfflineMallGoods } from "@/api/goods.js";
import { CancelAddTicket } from "@/api/ticket.js";
import { ElMessage } from "element-plus";
import { array } from "js-md5";
const props = defineProps({
  //子组件接收父组件传递过来的值
  IDs: array, //ID值
  OpType: "", //具体需要做什么操作
  BillType: "", //单据类型
  Visible: Boolean,
});
// //使用父组件传递过来的值
const { Visible, IDs, OpType, BillType } = toRefs(props);

const TextareaRemark = ref("");
const BtnLoading = ref(false);
const OpTitle = ref("");

watch(
  () => props.Visible,
  (newValue, oldValue) => {
    //监控操作数据，用来更是视图
    if (newValue) {
      TextareaRemark.value = "";
    }
    if (BillType.value == "xj") {
      //商品下架
      OpTitle.value = "下架";
    }
    if (BillType.value == "fx") {
      OpTitle.value = "删除";
    }
    if (BillType.value == "删除卡券") {
      OpTitle.value = "取消某个人添加的单张券";
    }

    if (BillType.value == "rk") {
      //入库
      if (OpType.value == "Approve") {
        OpTitle.value = "审核";
      }
      if (OpType.value == "Cancel") {
        OpTitle.value = "取消";
      }
    }

    if (BillType.value == "MK") {
      //商城营销活动
      if (OpType.value == "MKApprove") {
        OpTitle.value = "审核";
      }
      if (OpType.value == "MKCancel") {
        OpTitle.value = "取消";
      }
      if (OpType.value == "MKPause") {
        OpTitle.value = "暂停";
      }
      if (OpType.value == "MKRestore") {
        OpTitle.value = "恢复";
      }
    }
    if (BillType.value == "BJ") {
      //针对笔记管理
      if (OpType.value == "BJApprove") {
        OpTitle.value = "审批";
      }
      if (OpType.value == "BJDel") {
        OpTitle.value = "删除";
      }
      if (OpType.value == "BJRemove") {
        OpTitle.value = "下架";
      }
    }
  }
);
const emit = defineEmits(["CloseVisible", "RefreshData"]);

const DelPromoterBtn = async () => {
  switch (OpType.value) {
    case 1:
      //直接删除分销员
      DeletePromoterApi();
      break;
    case 2:
      //直接删除分销员下的客户（单个删除）
      DeletePromoterByVipApi();
      break;
    case 3:
      //强制删除某个分销员下的所有客户
      DeleteAllCustomersByPromoterApi();
      break;
    case "Approve":
      //入库单审核
      PassGoodsBillApi();
      break;
    case "Cancel":
      //入库单取消
      CancelGoodsBillApi();
      break;
    case "ScKq":
      //取消某个人添加的单张券
      CancelAddTicketApi();
      break;
    case "MKApprove":
      //商城营销活动审核（通过）
      PassMallActApi();
      break;
    case "MKCancel":
      //商城营销活动审核（取消）
      CancelMallActApi();
      break;
    case "MKPause":
      //商城营销活动审核（暂停）
      PauseMallActApi();
      break;
    case "MKRestore":
      //商城营销活动审核（恢复）
      RestoreMallActApi();
      break;
    case "xj":
      //商品下架
      BatchOfflineMallGoodsApi();
      break;
    case "BJApprove":
      //笔记管理批量审批
      iCount = IDs.value.length;
      PassNoteApi(iCount, IDs.value);
      break;
    case "BJDel":
      //笔记管理删除
      DeleteMyNoteApi();
      break;
    case "BJRemove":
      //笔记管理下架
      RemoveMyNoteApi();
      break;
    default:
      break;
  }
};
const closeVisible = async () => {
  selTagValue.value = [];
  emit("CloseVisible", false);
};

const DeletePromoterByVipApi = async () => {
  BtnLoading.value = true;
  let res = await DeletePromoterByVip({
    VipIds: [IDs.value[0].vip],
    MallUnitId: IDs.value[0].mallId,
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 2);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const DeletePromoterApi = async () => {
  BtnLoading.value = true;
  let res = await DeletePromoter({
    VipId: IDs.value[0].vip,
    MallUnitId: IDs.value[0].mallId,
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const DeleteAllCustomersByPromoterApi = async () => {
  BtnLoading.value = true;
  let res = await DeleteAllCustomersByPromoter({
    VipId: IDs.value[0].vip,
    MallUnitId: IDs.value[0].mallId,
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    ElMessage.success("操作成功");
    emit("RefreshData", 1);
  } else {
    ElMessage.warning(res.Message);
  }
};

const PassGoodsBillApi = async () => {
  BtnLoading.value = true;
  let res = await PassGoodsBill({
    BillId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const CancelGoodsBillApi = async () => {
  BtnLoading.value = true;
  let res = await CancelGoodsBill({
    BillId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const CancelAddTicketApi = async () => {
  if (TextareaRemark.value == "") {
    ElMessage.info("请先输入备注");
    return;
  }
  BtnLoading.value = true;
  let res = await CancelAddTicket({
    TicketId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};

const PassMallActApi = async () => {
  BtnLoading.value = true;
  let res = await PassMallAct({
    ActId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};

const PauseMallActApi = async () => {
  if (TextareaRemark.value == "") {
    ElMessage.info("请先输入备注");
    return;
  }
  BtnLoading.value = true;
  let res = await PauseMallAct({
    ActId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const RestoreMallActApi = async () => {
  BtnLoading.value = true;
  let res = await RestoreMallAct({
    ActId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const CancelMallActApi = async () => {
  BtnLoading.value = true;
  let res = await CancelMallAct({
    ActId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const BatchOfflineMallGoodsApi = async () => {
  BtnLoading.value = true;
  let res = await BatchOfflineMallGoods({
    GoodsIds: [IDs.value[0]],
    Remark: TextareaRemark.value,
  });
  BtnLoading.value = false;
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", "");
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const PassNoteApi = async (iCount, list) => {
  if (iCount > 0) {
    //当前还有值，那么请继续调用接口
    let res = await PassNote({
      NoteId: list[iCount - 1],
      Remark: TextareaRemark.value,
      TagIds: selTagValue.value,
    });
    if (res.Code == 200) {
      iCount--; //请求次数 - 1
      msg = res.Message;
      if (iCount > 0) {
        PassNoteApi(iCount, list);
      }
    } else {
      ElMessage.warning(res.Message);
    }
  }
  if (iCount == 0) {
    ElMessage.success("操作成功");
    emit("CloseVisible", false);
    emit("RefreshData", "");
  }
};
const DeleteMyNoteApi = async () => {
  let res = await DeleteMyNote({
    NoteId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const RemoveMyNoteApi = async () => {
  let res = await RemoveMyNote({
    NoteId: IDs.value[0],
    Remark: TextareaRemark.value,
  });
  if (res.Code == 200) {
    emit("CloseVisible", false);
    emit("RefreshData", 1);
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
////////////////////////////////////////////////////////////////
const tagList = ref([]);
const selTagValue = ref([]);
selTagValue;
const GetTagListByGroupIdApi = async () => {
  let res = await GetTagListByGroupId({
    GroupId: 4,
  });
  if (res.Code == 200) {
    tagList.value = res.DataMap;
  }
};
GetTagListByGroupIdApi();
////////////////////////////////////////////////////////////////
</script>
