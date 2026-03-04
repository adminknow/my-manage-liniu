<!-- 我的供应商页面 -->
<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.search_keyword" clearable placeholder="请输入名称、编码"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5" :offset="1">
                        <el-select clearable v-model="query.search.apply_status" placeholder="状态" style="width:80%">
                            <el-option label="开通" value="10"> </el-option>
                            <el-option label="关闭" value="-1"> </el-option>
                            <el-option label="待审核" value="0"> </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" :offset="7">
                        <div class="button-mgl">
                            <el-button class="button2 button-float" round @click="handleActivateMall()">
                                添加
                            </el-button>
                            <el-button class="button1 button-float" round @click="handleSearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                            </el-button>

                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 表格数据 -->
        <supplier-table :tableData="tableData" :tableLoading="tableLoading" @OpBtn="OpBtn"></supplier-table>
        <!-- 主表格分页 -->
        <common-pagination v-model:current-page="query.PageStartRow" v-model:page-size="query.PageRowCount"
            :total="pageTotal" :page-sizes="[15, 50, 100]" @page-change="handlePageChange"
            @size-change="handleSizeChange" />
        <apply-modal :Visible="modal" @CloseVisible="close" :desc="'添加供应商'" :opType="'activate'"></apply-modal>
    </div>
</template>

<script setup>
import CommonPagination from "@/components/common/CommonPagination.vue";
import supplierTable from "@/components/mallManage/supplierTable.vue";
import applyModal from "@/components/mallManage/applyModal.vue";
import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import {
    SearchMyMallSupplies, GetMallUnitList
} from "@/api/index.js";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const query = reactive({
    search: {
        mall_unit_id: loginUser.UnitId,
        apply_status: "",//状态
        sum_goods_cnt: 1,
        search_keyword: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    let res = await SearchMyMallSupplies({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotal.value = res.DataMap.ToalCount;
    }
};
// 分页导航
const handlePageChange = (val) => {
    query.PageStartRow = val;
    getData();
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
    getData();
};
const OpBtn = async () => {
    handleSearch()
};
const init = async () => {
    getData()
};
const handleSearch = () => {
    query.PageStartRow = 1;
    getData();
};

// 开通商城点击确认之后，页面刷新
const modal = ref(false);
const handleActivateMall = () => {
    modal.value = true;
}
const close = (value) => {
    modal.value = false;
    if (value == 1) {
        handleSearch();
    }
}
init();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
    () => router.currentRoute.value,
    (data) => {
        if (data.meta.title == "我的供应商") {
            handleSearch()
        }
    }
);

</script>

<style scoped></style>
