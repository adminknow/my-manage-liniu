<template>
  <!-- 财务线下付款 -->
  <el-dialog
    title="财务线下付款"
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
        <el-form-item label="收款银行" prop="BankName">
          <el-input v-model="param.BankName" clearable />
        </el-form-item>
        <el-form-item label="公司名称" prop="BankAccountName">
          <el-input v-model="param.BankAccountName" clearable />
        </el-form-item>
        <el-form-item label="公司帐号" prop="BankAccountNo">
          <el-input v-model="param.BankAccountNo" clearable />
        </el-form-item>
        <el-form-item label="流水号" prop="BankSerialNo">
          <el-input v-model="param.BankSerialNo" clearable />
        </el-form-item>
        <el-form-item label="金额" prop="Amount">
          <el-input v-model="param.Amount" type="number" />
        </el-form-item>
        <el-form-item label="支付日期">
          <el-date-picker
            style="width: 100%"
            v-model="param.PayDate"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="备注">
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
import { GiftPackageOrderPayByEbank } from "@/api/order.js";
import common from "@/utils/common.js";
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
  OrderPayVisible: Boolean,
  OrderID: String,
});
// //使用父组件传递过来的值
const { OrderID } = toRefs(props);
const localGoodsVisible = ref(props.OrderPayVisible);

const emit = defineEmits(["closeOrderPayVisible"]);
const saveLoading = ref(false);
const ruleFormRef = ref(null);
const param = reactive({
  OrderId: "",
  BankName: "",
  BankAccountName: "",
  BankAccountNo: "",
  BankSerialNo: "",
  Amount: "",
  PayDate: "",
  Remark: "",
});
const rules = {
  BankName: [
    {
      required: true,
      message: "请输入收款银行",
      trigger: "blur",
    },
  ],
  BankAccountName: [
    { required: true, message: "请输入收款银行的公司名称", trigger: "blur" },
  ],
  BankAccountNo: [
    { required: true, message: "请输入收款银行的公司帐号", trigger: "blur" },
  ],
  BankSerialNo: [
    { required: true, message: "请输入收款银行的流水号", trigger: "blur" },
  ],
  Amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
};
const submitForm = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true;
      param.OrderId = OrderID.value;
      param.PayDate = common.dateFormat("YYYY-mm-dd", param.PayDate);
      let { Code, Message } = await GiftPackageOrderPayByEbank(param);
      saveLoading.value = false;
      if (Code == 200) {
        ElMessage.success("操作成功");
        setTimeout(() => {
          ruleFormRef.value.resetFields();
          emit("closeOrderPayVisible", true);
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
  emit("closeOrderPayVisible", false);
};

watch(
  () => props.OrderPayVisible,
  (newValue, oldValue) => {
    localGoodsVisible.value = newValue;
  }
);
</script>
<style scoped></style>
