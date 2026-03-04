<!-- 订单日志组件 -->
<template>
    <el-dialog title="日志" v-model="dialogVisible" width="48%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-table :header-cell-style="{ 'text-align': 'center' }" v-loading="tableLoading" border
            :data="tableHistoryData" style="width: 100%">
            <el-table-column align="left" label="操作人" width="140">
                <template #default="scope">
                    <p v-if="scope.row.OpUserName">姓名：{{ scope.row.OpUserName }}</p>
                    <p v-if="scope.row.OpRoleName">角色：{{ scope.row.OpRoleName }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="OpTime" align="center" label="时间" width="180">
            </el-table-column>
            <el-table-column prop="OpTypeDesc" align="center" label="类型" width="120">
            </el-table-column>
            <el-table-column prop="FromStatusDesc" align="center" label="前置状态=>后置状态" width="220">
                <template #default="scope">
                    <p>
                        <text v-if="scope.row.FromStatusDesc">{{ scope.row.FromStatusDesc }}=></text>
                        {{ scope.row.ToStatusDesc }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="OpRemark" align="center" label="备注">
            </el-table-column>
        </el-table>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
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
    computed
} from "vue";
import { ElMessage } from "element-plus";
import {
    GetBillOperateHises
} from "@/api/order.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    orderId: {
        type: String,
        default: "",
    },
});
// 从属性中解构
const { visible } = toRefs(props);
const tableLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
const tableHistoryData = ref([]);
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};
const GetBillOperateHisesApi = async () => {
    tableLoading.value = true;
    let res = await GetBillOperateHises({
        BillId: props.orderId,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        tableHistoryData.value = res.DataMap || [];
    } else {
        ElMessage({
            message: res.Message,
            type: 'error',
            duration: 2000
        });
    }
}
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (dialogVisible.value) {
            GetBillOperateHisesApi();
        }
    }
);
</script>
