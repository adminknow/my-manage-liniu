<!-- 添加供应商组件 -->
<template>
    <el-dialog title="供应商" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-table @selection-change="handleSelectionChange" :data="tableData" border class="table"
            v-loading="tableLoading" :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="编码">
                <template #default="scope">
                    <p>{{ scope.row.UnitCode || scope.row.Unit?.UnitCode }}</p>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称">
                <template #default="scope">
                    <p>{{ scope.row.UnitName || scope.row.Unit?.UnitName }}</p>
                </template>
            </el-table-column>
        </el-table>
        <!-- 主表格分页 -->
        <common-pagination v-model:current-page="queryParams.PageStartRow" v-model:page-size="queryParams.PageRowCount"
            :total="pageTotal" :page-sizes="[15, 50, 100]" @page-change="handlePageChange"
            @size-change="handleSizeChange" />
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">确 认</el-button>
                <el-button class="button2" @click="handleClose(2)">关 闭</el-button>
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
    onMounted,
    computed,
} from "vue";
import CommonPagination from "@/components/common/CommonPagination.vue";
import { SearchMyMallSupplies } from "@/api/index.js";

import { ElMessage } from "element-plus";
const props = defineProps({
    visible: Boolean,
    // 已经选择的数据
    selItemsOld: {
        type: Array,
        default: () => [],
    },
});
// //使用父组件传递过来的值
// 从属性中解构
const { visible, selItemsOld } = toRefs(props);
const selectedUnits = ref([]);
const dialogVisible = ref(false);
const btnLoading = ref(false);
const emit = defineEmits(["closeVisible", 'conFirm']);

//保存数据
const onSubmit = () => {
    // 合并已选择的和新选择的商品，并去重
    const selOldItems = selItemsOld.value || [];
    const allSelectedUnits = [...selectedUnits.value, ...selOldItems];
    // 去重处理
    const uniqueUnits = [];
    const unitsIdMap = new Map();

    allSelectedUnits.forEach((item) => {
        if (!unitsIdMap.has(item.UnitId)) {
            unitsIdMap.set(item.UnitId, true);
            uniqueUnits.push({
                UnitId: item.UnitId,
                UnitCode: item.UnitCode,
                UnitName: item.UnitName,
            });
        }
    });
    emit("conFirm", uniqueUnits);
};
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("closeVisible", op);
};
const tableData = ref([]);
const tableLoading = ref(false);
const queryParams = reactive({
    PageStartRow: 1,
    PageRowCount: 15,
    SearchCondition: {
        apply_status: 10,
    },
});
const pageTotal = ref(0);
// 初始化数据
const initData = async () => {
    //初始化数据
    let res = await SearchMyMallSupplies({
        PageStartRow: (queryParams.PageStartRow - 1) * queryParams.PageRowCount,
        PageRowCount: queryParams.PageRowCount,
        SearchCondition: queryParams.SearchCondition,
    });
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotal.value = res.DataMap.ToalCount;
    }
}
// 分页导航
const handlePageChange = (val) => {
    queryParams.PageStartRow = val;
    initData();
};
const handleSizeChange = (val) => {
    queryParams.PageRowCount = val;
    initData();
};

// 表格选择变化
const handleSelectionChange = (val) => {
    selectedUnits.value = val.map(item => ({
        UnitId: item.UnitId || item.Unit?.UnitId,
        UnitCode: item.UnitCode || item.Unit?.UnitCode,
        UnitName: item.UnitName || item.Unit?.UnitName,
    }));
};
// 组件挂载时加载数据
onMounted(() => {
    initData();
});
// 监听弹窗显示状态
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (newValue) {
            initData();
        }
    }
);
</script>
<style lang="less"></style>
