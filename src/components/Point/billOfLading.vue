<template>
  <!-- 发货 -->
  <el-dialog
    title="发货"
    v-model="localGoodsVisible"
    width="38%"
    :show-close="false"
    :close-on-click-modal="false"
  >
  <div style="width:100%;height: 18px;"></div>
    <el-input
      type="textarea"
      maxlength="100"
      :rows="4"
      show-word-limit
      placeholder="请输入发货备注"
      v-model="textareaSend"
    >
    </el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          :loading="sendLoading"
          @click="sendModalBtn(orderIds.length, orderIds)"
          >确 认</el-button
        >
        <el-button class="button2" @click="CloseVisible">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { PickupDeliverOrder } from "@/api/order.js";
import { ElMessage } from "element-plus";
const props = defineProps({
  //子组件接收父组件传递过来的值
  orderIds: [],
  Visible: Boolean,
});
// //使用父组件传递过来的值
const {} = toRefs(props);
const localGoodsVisible = ref(props.Visible);
const emit = defineEmits(["close-send-visible", "success-visible"]);
const textareaSend = ref("");
const sendLoading = ref(false);
const CloseVisible = async () => {
  emit("close-send-visible");
};
const PickupDeliverOrderApi = async (icount, List) => {
  if (icount > 0) {
    let index = icount;
    let OrderId = List[index - 1];
    let res = await PickupDeliverOrder({
      OrderId: OrderId,
      Remark: textareaSend.value,
    });
    if (res.Code == 200) {
      icount--;
      if (icount > 0) {
        PickupDeliverOrderApi(icount, List);
      }
    } else {
      ElMessage.error(res.Message);
    }
  }
  if (icount == 0) {
    emit("success-visible");
  }
};
const sendModalBtn = (icount, List) => {
  PickupDeliverOrderApi(icount, List);
};
watch(
  () => props.Visible,
  (newValue, oldValue) => {
    localGoodsVisible.value = newValue;
    textareaSend.value = "";
  }
);
</script>
<style scoped></style>
