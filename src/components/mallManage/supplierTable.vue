<!-- 我的供应商表格组件 -->
<template>
    <el-table :data="tableData" border class="table" v-loading="tableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column align="left" label="供应商">
            <template #default="scope">
                <p>{{ scope.row.Unit.UnitCode + '-' + scope.row.Unit.UnitName }}</p>
                <p>联系人：{{ scope.row.Unit.UnitContact }}</p>
                <p>联系电话：{{ scope.row.Unit.UnitTel }}</p>
            </template>
        </el-table-column>

        <el-table-column align="left" label="商品信息" width="200">
            <template #default="scope">
                <p>上架中：{{ scope.row.OnlineGoodsCount }}</p>
                <p>待审核：{{ scope.row.WaitApprovingGoodsCount }}</p>
            </template>
        </el-table-column>
        <el-table-column align="left" label="创建信息" width="200">
            <template #default="scope">
                <p>{{ scope.row.CreateUserName }}</p>
                <p>{{ scope.row.CreateTime }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="ApplyStatusDesc" align="center" label="状态" width="160">
        </el-table-column>
        <el-table-column prop="BillStatusDesc" align="center" label="操作" width="160">
            <template #default="scope">
                <div class="button-mgl">
                    <el-button v-if="scope.row.ApplyStatus === -1 && scope.row.UnitId != loginUser.UnitId"
                        class="button-op-edit" size="small" @click="activateClick(scope.row.UnitId)">开通
                    </el-button>
                    <el-button v-if="scope.row.ApplyStatus === 10 && scope.row.UnitId != loginUser.UnitId"
                        class="button-op-del" size="small" @click="closeClick(scope.row.UnitId)">关闭
                    </el-button>
                    <!-- <el-button v-if="scope.row.ApplyStatus === 10 && scope.row.UnitId != loginUser.UnitId"
                        class="button-op-edit" size="small" @click="takeDownClick(scope.row.UnitId)">下架商城
                    </el-button> -->
                    <el-button v-if="scope.row.ApplyStatus === 0 && (scope.row.MallUnitId == loginUser.UnitId)"
                        class="button-op-edit" size="small" @click="approvalPassClick(scope.row.UnitId)">审批通过
                    </el-button>
                    <el-button v-if="scope.row.ApplyStatus === 0 && (scope.row.MallUnitId == loginUser.UnitId)"
                        class="button-op-del" size="small" @click="approvalNoPassClick(scope.row.UnitId)">审批不通过
                    </el-button>
                </div>
            </template></el-table-column>
    </el-table>
</template>
<script setup>
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
import { ElMessage, ElMessageBox } from "element-plus";
import { OnlineMyMall, ApproveOnlineMyMallApply, OfflineFromMall, OfflineMyMall } from "@/api/index.js";
// 定义组件属性
const props = defineProps({
    // 表格加载数据
    tableData: {
        type: Array,
        default: () => [],
    },
    // 搜索等待状态
    tableLoading: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["OpBtn"]);
const approvalPassClick = (ID) => {
    ElMessageBox.confirm("审核通过？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await ApproveOnlineMyMallApply({
            UnitId: ID,
            IsPass: true,
        });
        if (res.Code == 200) {
            emit("OpBtn", "");
            ElMessage.success("操作成功");
        } else {
            ElMessage.warning(res.Message);
        }
    });
};
const approvalNoPassClick = (ID) => {
    ElMessageBox.confirm("审核不通过？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await ApproveOnlineMyMallApply({
            UnitId: ID,
            IsPass: false,
        });
        if (res.Code == 200) {
            emit("OpBtn", "");
            ElMessage.success("操作成功");
        } else {
            ElMessage.warning(res.Message);
        }
    });
};

//关闭供应商
const closeClick = (ID) => {
    ElMessageBox.confirm("确认关闭该供应商？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await OfflineMyMall({
            UnitId: ID,
        });
        if (res.Code == 200) {
            emit("OpBtn", "");
            ElMessage.success("操作成功");
        } else {
            ElMessage.warning(res.Message);
        }
    });
};
//开通商城
const activateClick = (ID) => {
    ElMessageBox.confirm("确认开通？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await OnlineMyMall({
            UnitId: ID,
        });
        if (res.Code == 200) {
            emit("OpBtn", "");
            ElMessage.success("操作成功");
        } else {
            ElMessage.warning(res.Message);
        }
    });
}
</script>
