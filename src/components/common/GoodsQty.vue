<!-- 分页查询商品的库存变动历史 -->
<template>
    <div class="">
        <p> {{ GoodsInfo.GoodsCode + " - " + GoodsInfo.GoodsTitle }}</p>
        <div style="width:100%;height:10px"></div>
        <el-table height="300" :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
            <el-table-column prop="ChangeTime" label="变更时间" align="center" width="160"></el-table-column>
            <el-table-column label="总数量" align="center" width="160">
                <template #default="scope">
                    <p v-if="scope.row.TotalQtyChange!= 0">{{ scope.row.TotalQtyBegin }} > <text style="color: #ff6666 ;">{{
                        scope.row.TotalQtyChange
                    }}</text> > {{ scope.row.TotalQtyEnd }}</p>
                    <p v-else>{{ scope.row.TotalQtyBegin }}</p>
                </template>
            </el-table-column>
            <el-table-column label="销售数量" align="center" width="160">
                <template #default="scope">
                    <p v-if="scope.row.SoldQtyChange != 0">{{ scope.row.SoldQtyBegin }} > <text style="color: #ff6666 ;">{{
                        scope.row.SoldQtyChange }}</text>
                        > {{ scope.row.SoldQtyEnd }}</p>
                    <p v-else>{{ scope.row.SoldQtyBegin }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="ChangeDesc" label="描述" align="center"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
                v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
                @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
        </div>
    </div>
</template>
    
<script setup>
import { ref, reactive, toRefs,  watch } from "vue";
import { GetGoods,SearchGoodsQtyChangeHises } from "@/api/goods.js";
import common from "@/utils/common.js";

const props = defineProps({
    //子组件接收父组件传递过来的值
    goodID: "",
    skuID: "",
    openModal: Boolean,
})
// //使用父组件传递过来的值
const { openModal, goodID, skuID } = toRefs(props)

watch(
    () => props.openModal,
    (newValue, oldValue) => {
        if (newValue) {
            query.search.goods_id = props.goodID;
            query.search.sku_id = props.skuID;
            GetGoodsApi(props.goodID);
            getData();
        }
    },
);
const emit = defineEmits(['clickChild'])
const multipleTable = ref(null);

const query = reactive({
    search: {
        sku_id: skuID.value,
        goods_id: goodID.value
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
    let res = await SearchGoodsQtyChangeHises({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        if (res.DataMap.Data) {
            tableData.value = res.DataMap.Data;
        } else {
            tableData.value = []
        }

        pageTotal.value = res.DataMap.ToalCount;
    }
};
getData();

// 查询操作
const handleSearch = () => {
    query.PageStartRow = 1;
    getData();
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
////////////////////////////////////////////////////////////////
const GoodsInfo = reactive({
    GoodsCode: "",
    GoodsTitle: "",
    GoodsSubTitle: ""
});
//获取商品详情
const GetGoodsApi = async (ID) => {
    let res = await GetGoods({
        ObjectId: ID
    })
    if (res.Code == 200) {
        if (skuID.value != "") {
            res.DataMap.Skus.forEach(row => {
                if (skuID.value == row.SkuId) {
                    GoodsInfo.GoodsCode = row.SkuCode;
                    GoodsInfo.GoodsTitle = row.PropertyDesc;
                }
            })
        } else {
            GoodsInfo.GoodsCode = res.DataMap.GoodsCode;
            GoodsInfo.GoodsTitle = res.DataMap.GoodsTitle;
            GoodsInfo.GoodsSubTitle = res.DataMap.GoodsSubTitle;
        }

    }
};
GetGoodsApi(goodID.value);
////////////////////////////////////////////////////////////////
</script>
<style scoped></style>