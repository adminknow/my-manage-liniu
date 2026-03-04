<template>
  <!-- 关闭订单 -->
  <el-dialog
    title="关闭订单"
    v-model="localGoodsVisible"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="" style="padding: 0 20px">
      <el-form
        ref="ruleFormRef"
        :model="param"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="备注" prop="Remark">
          <el-input
            v-model="param.Remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button1" :loading="saveLoading" @click="submitForm()"
          >提 交</el-button
        >
        <el-button class="button2" @click="CloseVisible1">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { CancelGiftPackageOrder } from "@/api/order.js";
import {
  ref,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
} from "vue";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
const props = defineProps({
  //子组件接收父组件传递过来的值
  OrderCloseVisible: Boolean,
  OrderID: String,
});
// //使用父组件传递过来的值
const { OrderID } = toRefs(props);
const localGoodsVisible = ref(props.OrderCloseVisible);

const emit = defineEmits(["closeOrderVisible"]);
const saveLoading = ref(false);
const ruleFormRef = ref(null);
const param = reactive({
  OrderId: "",
  Remark: "",
});
const rules = {
  Remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
};
const submitForm = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      param.OrderId = OrderID.value;
      saveLoading.value = true;
      let { Code, Message } = await CancelGiftPackageOrder(param);
      saveLoading.value = false;
      if (Code == 200) {
        ElMessage.success("操作成功");
        setTimeout(() => {
          ruleFormRef.value.resetFields();
          emit("closeOrderVisible", true);
        }, 2000);
      } else {
        ElMessage.error(Message);
        return false;
      }
    } else {
      return false;
    }
  });
};
const CloseVisible1 = async () => {
  emit("closeOrderVisible", false);
};

watch(
  () => props.OrderCloseVisible,
  (newValue, oldValue) => {
    localGoodsVisible.value = newValue;
  }
);
</script>
<style scoped></style>
