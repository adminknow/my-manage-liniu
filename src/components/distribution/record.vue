<!-- 交易流水弹窗 -->
<template>
    <el-dialog title="交易流水" v-model="dialogVisible" width="58%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false" class="evaluate-dialog">
        <div style="width:100%;height: 18px;"></div>
        <el-table :data="tableData" border class="table" v-loading="tableLoading"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="TransTime" label="交易时间" align="center"></el-table-column>
            <el-table-column prop="TransDesc" align="left" label="描述"></el-table-column>
            <el-table-column label="交易走向" align="center">
                <template #default="scope">
                    <p>
                        {{ (scope.row.BeginAmt / 100).toFixed(2) }}>
                        <span v-if="scope.row.BeginAmt > scope.row.EndAmt">-</span><span
                            v-if="scope.row.BeginAmt < scope.row.EndAmt">+</span><span :style="{
                                color:
                                    scope.row.BeginAmt > scope.row.EndAmt
                                        ? '#ff6666'
                                        : '#14ee00',
                            }">{{ (scope.row.TransAmt / 100).toFixed(2) }}</span>
                        > {{ (scope.row.EndAmt / 100).toFixed(2) }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="CreateUserName" align="center" label="交易人员姓名" width="160"></el-table-column>
            <el-table-column prop="CreateUnitName" align="center" label="供应商" width="160"></el-table-column>
        </el-table>
        <!-- 主表格分页 -->
        <common-pagination v-model:current-page="parameterQuery.PageStartRow"
            v-model:page-size="parameterQuery.PageRowCount" :total="pageTotal" :page-sizes="[15, 50, 100]"
            @page-change="handlePageChange" @size-change="handleSizeChange" />
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button2" @click="handleClose(2)">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import CommonPagination from "@/components/common/CommonPagination.vue";
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
import { ElMessage } from "element-plus";
import { SearchVipPromoteAccountTrans } from "@/api/vip.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    vipId: {
        type: String,
        default: "",
    },
    mallUnitId: {
        type: String,
        default: "",
    },
});
// 从属性中解构
const { visible, vipId, mallUnitId } = toRefs(props);
const tableData = ref([]);
const pageTotal = ref(0);
const parameterQuery = reactive({
    search: {
        mall_unit_id: mallUnitId.value,
        vip_id: vipId.value,
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const tableLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};
const SearchVipPromoteAccountTransApi = async () => {
    const res = await SearchVipPromoteAccountTrans({
        PageStartRow: (parameterQuery.PageStartRow - 1) * parameterQuery.PageRowCount,
        PageRowCount: parameterQuery.PageRowCount,
        SearchCondition: parameterQuery.search,
    })
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotal.value = res.DataMap.ToalCount;
    }
}
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        pageTotal.value = 0;
        tableData.value = [];
        if (newValue) {
            parameterQuery.search.mall_unit_id = props.mallUnitId;
            parameterQuery.search.vip_id = props.vipId;
            SearchVipPromoteAccountTransApi()
        }
    }
);
</script>
