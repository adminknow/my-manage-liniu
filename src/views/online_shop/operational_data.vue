<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="" v-if="loginUser.UnitType != 2">
                            <el-select v-model="query.search.unit_id" filterable remote reserve-keyword
                                placeholder="请输入券商名称" :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading"
                                style="width: 100%" clearable>
                                <el-option v-for="(item, index) in UnitData" :key="index"
                                    :label="item.UnitCode + '-' + item.UnitName" :value="item.UnitId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" v-if="loginUser.UnitType == 2">
                            <el-date-picker style="width:100%" v-model="timeValue" type="daterange"
                                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="" v-if="loginUser.UnitType != 2">
                            <el-date-picker style="width:100%" v-model="timeValue" type="daterange"
                                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button class="button2 button-float" round @click="handleOut()">
                                <el-icon>
                                    <DocumentAdd />
                                </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;出&nbsp;&nbsp;
                            </el-button>
                            <el-button class="button1 button-float" round @click="handleSearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
            <el-table-column prop="StatDate" align="center" label="统计日期" width="90">
            </el-table-column>
            <el-table-column v-if="loginUser.UnitType != 2" prop="UnitName" label="券商" align="center" width="120">
            </el-table-column>
            <el-table-column label="券" align="left" width="180">
                <template #default="scope">
                    <p>建券：{{ scope.row.CreateTicketCnt }} (张)</p>
                    <p>兑换：{{ scope.row.ExchangeTicketCnt }} (张)</p>
                    <p>售券：{{ scope.row.SaleTicketCnt }} (张)</p>
                    <p>售券：{{ (scope.row.SaleTicketAmt ).toFixed(2) }} (元)</p>
                    <p>退券：{{ scope.row.ReturnTicketCnt }} (张)</p>
                    <p>退券：{{ (scope.row.ReturnTicketAmt ).toFixed(2) }} (元)</p>
                </template>
            </el-table-column>
            <el-table-column label="配送单" align="left" width="120">
                <template #default="scope">
                    <p>新建：{{ scope.row.DeliverOrderCnt }} (张)</p>
                </template>
            </el-table-column>
            <el-table-column label="订单新建" align="left">
                <template #default="scope">
                    <p>订单数量(含未付款的)：{{ scope.row.OrderCnt }} (张)</p>
                    <p>订单金额(含未付款的)：{{ (scope.row.OrderAmt ).toFixed(2) }} (元)</p>
                    <p>商品数量(含未付款的)：{{ scope.row.OrderGoodsQty }} (张)</p>
                    <p>商品种类(含未付款的)：{{ scope.row.OrderGoodsCnt }} </p>
                    <p>订单数量(只含付款的)：{{ scope.row.PayOrderCnt }} (张)</p>
                    <p>订单金额(只含付款的)：{{ (scope.row.PayOrderAmt ).toFixed(2) }} (元)</p>
                    <p>商品数量(只含付款的)：{{ scope.row.PayOrderGoodsQty }} (张)</p>
                    <p>商品种类(只含付款的)：{{ scope.row.PayOrderGoodsCnt }}</p>
                </template>
            </el-table-column>
            <el-table-column label="线上" align="left" width="220">
                <template #default="scope">
                    <p>微信支付：{{ (scope.row.WxPayAmt ).toFixed(2) }} (元)</p>
                    <p>现金券支付：{{ (scope.row.CashTicketPayAmt ).toFixed(2) }} (元)</p>
                    <p>储值卡支付：{{ (scope.row.CashCardPayAmt ).toFixed(2) }} (元)</p>
                    <p>微信退款：{{ (scope.row.WxRefundAmt ).toFixed(2) }} (元)</p>
                    <p>现金券退款：{{ (scope.row.CashTicketRefundAmt ).toFixed(2) }} (元)</p>
                    <p>储值卡退款：{{ (scope.row.CashCardRefundAmt ).toFixed(2) }} (元)</p>
                </template>
            </el-table-column>
            <el-table-column label="线下" align="left" width="220">
                <template #default="scope">
                    <p>储值卡支付：{{ (scope.row.CashCardShopPayAmt ).toFixed(2) }} (元)</p>
                    <p>储值卡退款：{{ (scope.row.CashCardShopRefundAmt ).toFixed(2) }} (元)</p>
                </template>
            </el-table-column>
            <el-table-column prop="StatTime" label="统计时间" align="center" width="160">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
                v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
                @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
        </div>
    </div>
</template>
    
<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchUnitStatDatas, SearchUnites } from "@/api/index.js";
const router = useRouter();
const store = useStore();
const query = reactive({
    search: {
        unit_id: "",
        stat_date_begin: "",
        stat_date_end: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const timeValue = ref([]);
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    query.search.stat_date_begin = "";
    query.search.stat_date_end = "";
    if (timeValue.value) {
        if (timeValue.value.length > 0) {
            query.search.stat_date_begin = common.dateFormat("YYYYmmdd", timeValue.value[0]);
            query.search.stat_date_end = common.dateFormat("YYYYmmdd", timeValue.value[1]);
        }
    }
    let res = await SearchUnitStatDatas({
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
/////////////////////////////////////////////////////////////////////////////////
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
        let res = await SearchUnites({
            SearchCondition: {
                search_keyword: SearchQuery,
                unit_type: 2
            },
            NoPage: true,
            PageStartRow: 0,
            PageRowCount: 100000
        });
        SelLoading.value = false;
        if (res.Code == 200) {
            UnitData.value = res.DataMap.Data ? res.DataMap.Data : [];
        }
    } else {
        UnitData.value = []
    }
};
/////////////////////////////////////////////////////////////////////////////////
//初始化
const loginUser = JSON.parse(Cookie.get("User"));
const init = async () => {
    //一个月
    const end = new Date()
    end.setHours(23, 59, 59)
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    start.setHours(0, 0, 0)
    timeValue.value = [start, end];
    query.PageStartRow = 1;
    getData();
};
////////////////////////////////////////////////////////////////////////////////////////////////
//导出
const handleOut = () => {
    ElMessageBox.confirm("是否确认导出？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async () => {
            query.search.stat_date_begin = "";
            query.search.stat_date_end = "";
            if (timeValue.value) {
                if (timeValue.value.length > 0) {
                    query.search.stat_date_begin = common.dateFormat("YYYYmmdd", timeValue.value[0]);
                    query.search.stat_date_end = common.dateFormat("YYYYmmdd", timeValue.value[1]);
                }
            }
            let res = await SearchUnitStatDatas({
                PageStartRow: 0,
                PageRowCount: 100000,
                SearchCondition: query.search,
                NoPage: true,
            });
            tableLoading.value = false;
            if (res.Code == 200) {
                if (!res.DataMap.Data) {
                    ElMessage.error("当前暂无数据");
                    return
                }
                let OutData = JSON.parse(JSON.stringify(res.DataMap.Data))
                var myDate = new Date();
                myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                myDate.getMonth(); //获取当前月份(0-11,0代表1月)
                var time =
                    myDate.getFullYear() +
                    "-" +
                    (myDate.getMonth() + 1) +
                    "-" +
                    myDate.getDate();

                import("../../vendor/Export2Excel").then((excel) => {
                    const tHeader = [
                        "统计日期",
                        "建券数量",
                        "售券数量",
                        "售券金额",
                        "退券数量",
                        "退券金额",
                        "兑换数量",
                        "新建配送单数量",
                        "新建订单数量(含未付款的)",
                        "新建订单金额(含未付款的)",
                        "新建订单的商品种类(含未付款的)",
                        "新建订单的商品数量(含未付款的)",
                        "新建订单数量(只含付款的)",
                        "新建订单金额(只含付款的)",
                        "微信支付(元)",
                        "微信退款(元)",
                        "新建订单的商品数量(只含付款的)",
                        "新建订单的商品种类(只含付款的)",
                        "现金券支付(元)",
                        "现金券退款(元)",
                        "储值卡支付(元)",
                        "计值卡退款(元)",
                        "线下储值卡支付金额(元)",
                        "线下储值卡退款金额(元)",
                        "统计时间",
                        "券商"
                    ];
                    const filterVal = [
                        "StatDate",
                        "CreateTicketCnt",
                        "SaleTicketCnt",
                        "SaleTicketAmt",
                        "ReturnTicketCnt",
                        "ReturnTicketAmt",
                        "ExchangeTicketCnt",
                        "DeliverOrderCnt",
                        "OrderCnt",
                        "OrderAmt",
                        "OrderGoodsCnt",
                        "OrderGoodsQty",
                        "PayOrderCnt",
                        "PayOrderAmt",
                        "WxPayAmt",
                        "WxRefundAmt",
                        "PayOrderGoodsQty",
                        "PayOrderGoodsCnt",
                        "CashTicketPayAmt",
                        "CashTicketRefundAmt",
                        "CashCardPayAmt",
                        "CashCardRefundAmt",
                        "CashCardShopPayAmt",
                        "CashCardShopRefundAmt",
                        "StatTime",
                        "UnitName",
                    ];
                    OutData.forEach(row => {
                        row.SaleTicketAmt = (row.SaleTicketAmt ).toFixed(2);
                        row.ReturnTicketAmt = (row.ReturnTicketAmt ).toFixed(2);
                        row.OrderAmt = (row.OrderAmt ).toFixed(2);
                        row.PayOrderAmt = (row.PayOrderAmt ).toFixed(2);

                    })
                    const data = formatJson(filterVal, OutData);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: data,
                        filename: "运营数据导出" + time,
                        autoWidth: true,
                    });
                });
            }
        })
        .catch(() => { });
};
const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
};
/////////////////////////////////////////////////////////////////////////////////
init();
/////////////////////////////////////////////////////////////////////////////////
watch(
    () => router.currentRoute.value,
    (data) => {
        let isRenovate = 0;
        store.state.tags.tagsList.forEach(row => {
            if (row.title == "运营数据") {
                isRenovate = 1
            }
        });
        if (store.state.tags.pageSaerch.Search == 1 && isRenovate == 1 && store.state.tags.pageSaerch.titlePage == "运营数据") {
            query.PageStartRow = 1;
            getData();
            store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
    },
);
</script>
    
<style scoped></style>
    