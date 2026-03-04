<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.mchid" clearable placeholder="请输入商户号">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-date-picker style="width:100%" v-model="timeValue" type="daterange"
                                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select clearable style="width: 100%" v-model="query.search.process_status"
                                placeholder="请选择状态">
                                <el-option label="成功" value="0">
                                </el-option>
                                <el-option label="失败" value="1">
                                </el-option>
                            </el-select>
                        </el-form-item>
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
            <el-table-column prop="Mchid" align="center" label="商户号" width="120">
            </el-table-column>
            <el-table-column prop="TradeDate" align="center" label="交易日期" width="120">
            </el-table-column>
            <el-table-column prop="TradeCnt" align="center" label="总交易单数" width="120">
            </el-table-column>
            <el-table-column align="left" label="金额信息" width="250">
                <template #default="scope">
                    <p>应结订单总金额: {{ scope.row.PayOrderAmt }} (元)</p>
                    <p>退款总金额: {{ scope.row.RefundAmt }} (元)</p>
                    <p>充值券退款总金额: {{ scope.row.TicketRefundAmt }} (元)</p>
                    <p>手续费总金额: {{ scope.row.DeductAmt }} (元)</p>
                    <p>订单总金额: {{ scope.row.OrderAmt }} (元)</p>
                    <p>申请退款总金额: {{ scope.row.ApplyRefundAmt }} (元)</p>
                </template>
            </el-table-column>
            <el-table-column prop="TotalCnt" align="center" label="总条数" width="100">
            </el-table-column>
            <el-table-column prop="SuccessCnt" align="center" label="处理成功条数" width="120">
            </el-table-column>
            <el-table-column prop="FailCnt" align="center" label="处理失败条数" width="120">
            </el-table-column>
            <el-table-column align="center" label="处理状态" width="90">
                <template #default="scope">
                    <p v-if="scope.row.ProcessStatus === 0">成功</p>
                    <p v-if="scope.row.ProcessStatus === 1">失败</p>
                </template>
            </el-table-column>
            <el-table-column prop="ProcessMsg" align="center" label="处理消息">
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
import common from "@/utils/common.js";
import { SearchMerchantTradeBills } from "@/api/vip.js";
const router = useRouter();
const store = useStore();
const query = reactive({
    search: {
        mchid: "",
        trade_date_begin: "",
        trade_date_end: "",
        process_status: ""
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
    query.search.trade_date_begin = "";
    query.search.trade_date_end = "";
    if (timeValue.value) {
        if (timeValue.value.length > 0) {
            query.search.trade_date_begin = common.dateFormat("YYYYmmdd", timeValue.value[0]);
            query.search.trade_date_end = common.dateFormat("YYYYmmdd", timeValue.value[1]);
        }
    }
    let res = await SearchMerchantTradeBills({
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
//初始化
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
            query.search.trade_date_begin = "";
            query.search.trade_date_end = "";
            if (timeValue.value) {
                if (timeValue.value.length > 0) {
                    query.search.trade_date_begin = common.dateFormat("YYYYmmdd", timeValue.value[0]);
                    query.search.trade_date_end = common.dateFormat("YYYYmmdd", timeValue.value[1]);
                }
            }
            let res = await SearchMerchantTradeBills({
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
                        "商户号",
                        "交易日期",
                        "总交易单数",
                        "应结订单总金额(元)",
                        "退款总金额(元)",
                        "充值券退款总金额(元)",
                        "手续费总金额(元)",
                        "订单总金额(元)",
                        "申请退款总金额(元)",
                        "总条数",
                        "处理成功条数",
                        "处理失败条数",
                        "处理状态",
                        "处理消息",
                    ];
                    const filterVal = [
                        "Mchid",
                        "TradeDate",
                        "TradeCnt",
                        "PayOrderAmt",
                        "RefundAmt",
                        "TicketRefundAmt",
                        "DeductAmt",
                        "OrderAmt",
                        "ApplyRefundAmt",
                        "TotalCnt",
                        "SuccessCnt",
                        "FailCnt",
                        "ProcessStatusDesc",
                        "ProcessMsg",

                    ];
                    OutData.forEach(row => {
                        if (row.ProcessStatus == 0) {
                            row.ProcessStatusDesc = "成功"
                        } else {
                            row.ProcessStatusDesc = "失败"
                        }

                    })
                    const data = formatJson(filterVal, OutData);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: data,
                        filename: "微信账单数据导出" + time,
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
            if (row.title == "微信账单") {
                isRenovate = 1
            }
        });
        if (store.state.tags.pageSaerch.Search == 1 && isRenovate == 1 && store.state.tags.pageSaerch.titlePage == "微信账单") {
            query.PageStartRow = 1;
            getData();
            store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
    },
);
</script>
    
<style scoped></style>
    