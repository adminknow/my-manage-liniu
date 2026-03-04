<!-- 订单审核组件 -->
<template>
    <el-dialog title="订单审核" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
            v-model="textareaApprove">
        </el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import {
    ref,
    toRefs,
    watch,
} from "vue";
import { ElMessage } from "element-plus";
import {
    ApproveOrders
} from "@/api/order.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    orderIds: {
        type: Array,
        default: () => [],
    },
});
const Msg = ref("");
const flag = ref(true);
const passLoading = ref(false);
// 从属性中解构
const { visible } = toRefs(props);
const textareaApprove = ref("");
const btnLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};

const onSubmit = async () => {
    // if (textareaApprove.value == "") {
    //     ElMessage.error('请输入取消原因');
    //     return;
    // }
    btnLoading.value = true;
    let res = await ApproveOrders({
        OrderIds: props.orderIds,
        Remark: textareaApprove.value,
    });
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success('操作成功');
        emit("CloseVisible", 'save');
    } else {
        ElMessage.error(res.Message);
    }
};

// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (dialogVisible.value) {
            textareaApprove.value = "";
            Msg.value = "";
            flag.value = true;
            passLoading.value = false;

        }
    }
);
</script>
