<!-- 我要上架页面launch和审批review页面公用，通过pageType来区分， -->
<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.search_keyword" clearable
                                placeholder="请输入编码/名称/条码/品牌"></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- 状态选择 -->
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select style="width: 100%" clearable v-model="query.search.mall_status"
                                placeholder="请选择状态">
                                <el-option label="待审核" value="0" v-if="query.search.type == 'review'"> </el-option>
                                <el-option label="上架中" value="10"> </el-option>
                                <el-option label="上架待审核" value="0" v-if="query.search.type == 'launch'"> </el-option>
                                <el-option label="未上架" value="-1"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="" v-if="query.search.type == 'review'">
                            <el-select v-model="query.search.page_unit" filterable remote reserve-keyword
                                placeholder="请输入供应商" :remote-method="remoteMethod" remote-show-suffix
                                :loading="SelLoading" style="width: 100%" clearable>
                                <el-option v-for="(item, index) in UnitData" :key="index"
                                    :label="`${item.Unit.UnitCode}-${item.Unit.UnitName}`" :value="item.UnitId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" v-if="query.search.type == 'launch'">
                            <el-select clearable filterable v-model="query.search.page_unit" placeholder="请选择商城"
                                style="width:100%">
                                <el-option v-for="item in MallUnitList" :key="item.MallUnitId" :label="item.MallUnit.UnitName"
                                    :value="item.MallUnitId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <div class="button-mgl">
                            <el-button v-if="query.search.type == 'review'" class="button2 button-float" round
                                @click="handleBatch('review')">批量审核
                            </el-button>
                            <el-button v-if="query.search.type == 'launch'" class="button2 button-float" round
                                @click="handleBatch('launch')">批量上架或下架
                            </el-button>
                            <el-button class="button1 button-float" round @click="handleSearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-select clearable style="width: 100%" v-model="query.search.has_sku" placeholder="有无SKU">
                                <el-option label="有" value="1"> </el-option>
                                <el-option label="无" value="0"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select clearable v-model="query.search.goods_type" placeholder="请选择类型"
                                style="width: 100%">
                                <el-option label="普通商品" value="2" />
                                <el-option label="组合装商品" value="3" />
                                <el-option label="电子券商品" value="1" />
                                <el-option label="虚拟商品" value="4" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select clearable style="width: 100%" v-model="query.search.goods_status"
                                placeholder="商品状态">
                                <el-option label="正常" value="1"> </el-option>
                                <el-option label="停用" value="0"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 表格数据 -->
        <data-table ref="dataTableRef" :tableData="tableData" :tableLoading="tableLoading" :pageCode="query.search.type"
            @OpBtn="OpBtn" @approvalOrShelves="approvalOrShelves"></data-table>
        <!-- 主表格分页 -->
        <common-pagination v-model:current-page="query.PageStartRow" v-model:page-size="query.PageRowCount"
            :total="pageTotal" :page-sizes="[15, 50, 100]" @page-change="handlePageChange"
            @size-change="handleSizeChange" />
        <goods-approve @CloseApproveModal="CloseApproveModal" :GoodsIDs="GoodsIDs" :ApproveUnitId="ApproveUnitId"
            :ApproveType="ApproveType" :GoodsApproveModal="GoodsApproveModal" :ApproveModalType="ApproveModalType">
        </goods-approve>
        <batch-approve :ids="items" :Visible="batchApproveModal" :documentType="query.search.type"
            @CloseVisible="CloseVisible"></batch-approve>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import dataTable from "@/components/mallManage/dataTable.vue";
import batchApprove from "@/components/mallManage/batchApprove.vue";
import GoodsApprove from "@/components/Modal/GoodsApprove.vue";
import CommonPagination from "@/components/common/CommonPagination.vue";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
import { useRouter } from "vue-router";
const router = useRouter();
import {
    SearchGoodMalls,
} from "@/api/goods.js";
import {
    SearchMyMallSupplies,
    SearchMyMalls
} from "@/api/index.js";
const query = reactive({
    search: {
        type: router.currentRoute.value.query.type || "",
        search_keyword: "",
        create_unit_id: "",//商品创建券商ID
        page_unit: "",
        mall_unit_id: "",
        has_sku: "",
        goods_status: "1",
        mall_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
// 获取表格数据
const SearchGoodMallsApi = async () => {
    tableLoading.value = true;
    if (query.search.type == 'review') {
        //审核页面查询条件
        query.search.create_unit_id = query.search.page_unit;
        query.search.mall_unit_id = loginUser.UnitId;
    }
    if (query.search.type == 'launch') {
        //上架页面查询条件
        query.search.mall_unit_id = query.search.page_unit;
        query.search.create_unit_id = loginUser.UnitId;
    }

    const res = await SearchGoodMalls({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
    });
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data;
        pageTotal.value = res.DataMap.ToalCount;
    } else {
        tableData.value = [];
        pageTotal.value = 0;
    }
    tableLoading.value = false;
};
// 分页导航
const handlePageChange = (val) => {
    query.PageStartRow = val;
    SearchGoodMallsApi();
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
    SearchGoodMallsApi();
};
//表格操作回调
const OpBtn = (val) => {
    //操作完成后刷新列表
    handleSearch();
};

const handleSearch = () => {
    query.PageStartRow = 1;
    SearchGoodMallsApi();
};
////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
const remoteMethod = async (query) => {
    if (query) {
        let SearchQuery = "";
        if (query !== "") {
            SearchQuery = query;
        } else {
            return;
        }
        SelLoading.value = true;
        let res = await SearchMyMallSupplies({
            SearchCondition: {
                unit_name: SearchQuery,
            },
            NoPage: true,
            PageStartRow: 0,
            PageRowCount: 100000,
        });
        SelLoading.value = false;
        if (res.Code == 200) {
            UnitData.value = res.DataMap.Data ? res.DataMap.Data : [];
        }
    } else {
        UnitData.value = [];
    }
};
const MallUnitList = ref([]);
const GetMallUnitListApi = async () => {
    let res = await SearchMyMalls({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: {
        },
    });
    if (res.Code == 200) {
        MallUnitList.value = res.DataMap.Data;
    }
}
////////////////////////////////////////////////////////////////
const Init = async () => {
    //初始化的时候需要给一个默认的状态
    if (query.search.type == 'launch') {
        query.search.mall_status = '-1'; //上架中
        GetMallUnitListApi();
    }
    if (query.search.type == 'review') {
        query.search.mall_status = '0'; //待审核
    }
    SearchGoodMallsApi()
};
Init();
////////////////////////////////////////////////////////////////
const dataTableRef = ref(null);
const items = ref([]);
const batchApproveModal = ref(false);
//批量全选上架
const handleBatch = () => {
    // 全选当前页所有数据
    // dataTableRef.value?.selectAll(tableData.value);
    // 若需要立刻处理选中项，可在此读取子组件暴露的 selectedRows
    const selected = dataTableRef.value?.getSelected?.();
    items.value = selected
        .filter(item => item && item.Goods && item.Goods.GoodsId && item.UnitId)
        .map(item => ({
            GoodsId: item.Goods.GoodsId,
            UnitId: item.UnitId,
            status: item.MallStatus
        }));
    batchApproveModal.value = true;
};
const CloseVisible = () => {
    batchApproveModal.value = false;
    handleSearch();
}
////////////////////////////////////////////////////////////////

//单独下架与上架
let GoodsIDs = ref([]);
const ApproveUnitId = ref('');
const multipleSelection = ref([]);
let GoodsApproveModal = ref(false);
let ApproveType = ref("");
let ApproveModalType = ref(""); //putAway
//表格上架与下架
const approvalOrShelves = (value) => {
    let row = value.row;
    let type = value.type;
    ApproveModalType.value = "putAway";//上架下架
    ApproveUnitId.value = row.UnitId;
    GoodsIDs.value = []; //先把数据清空
    GoodsIDs.value.push(row.Goods.GoodsId);
    if (type == "ApplyOnline") {
        //上架
        GoodsApproveModal.value = true;
        ApproveType.value = "ApplyOnline";
    } else {
        //下架
        GoodsApproveModal.value = true;
        ApproveType.value = "Offline";
    }
}
const CloseApproveModal = (type) => {
    GoodsApproveModal.value = false;
    if (type != "cancel") {
        handleSearch();
    }
};
////////////////////////////////////////////////////////////////
watch(
    () => router.currentRoute.value,
    (data) => {
        query.search.type = data.query.type;
        if (data.meta.title == "我要审核" || data.meta.title == "我要上架") {
            query.search.page_unit = "";
            Init()
        }

    }
);
////////////////////////////////////////////////////////////////////////////////////////////////////

</script>

<style scoped></style>
