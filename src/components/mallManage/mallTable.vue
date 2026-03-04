<!-- 我的商城表格组件 -->
<template>
    <el-table :data="tableData" border class="table" v-loading="tableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column align="left" label="商城信息">
            <template #default="scope">
                <p>{{ scope.row.MallUnit.UnitCode+'-'+scope.row.MallUnit.UnitName }}</p>
                 <p>联系人：{{ scope.row.MallUnit.UnitContact }}</p>
                <p>联系电话：{{ scope.row.MallUnit.UnitTel }}</p>
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
        <el-table-column  align="center" label="操作" width="160" v-if="loginUser.UnitType!=1">
            <template #default="scope">
                <div class="button-mgl">
                    <el-button v-if="(scope.row.ApplyStatus === 0||scope.row.ApplyStatus === 10) && scope.row.MallUnitId != loginUser.UnitId"
                        class="button-op-del" size="small" @click="takeDownClick(scope.row.MallUnitId)">关闭
                    </el-button>
                </div>
            </template></el-table-column>
    </el-table>
</template>
<script setup>
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
import { ElMessage, ElMessageBox } from "element-plus";
import { OnlineMyMall, OfflineFromMall } from "@/api/index.js";
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
//直接把供应商下架
const takeDownClick = (ID) => {
    ElMessageBox.confirm("确认下架该商城？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await OfflineFromMall({
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
</script>
