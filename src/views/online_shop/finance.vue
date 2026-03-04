<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.bill_code" clearable placeholder="请输入单号">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
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
                            <el-date-picker style="width:100%" v-model="timeValue" type="monthrange"
                                range-separator="To" start-placeholder="开始月份" end-placeholder="结束月份" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="" v-if="loginUser.UnitType == 2">
                            <el-select clearable style="width: 100%" v-model="query.search.bill_status" placeholder="请选择状态">
                                <el-option label="待审批" value="0">
                                </el-option>
                                <el-option label="已审批待付款" value="1">
                                </el-option>
                                <el-option label="已付款" value="2">
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
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="" v-if="loginUser.UnitType != 2">
                            <el-date-picker style="width:100%" v-model="timeValue" type="monthrange"
                                range-separator="To" start-placeholder="开始月份" end-placeholder="结束月份" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="" v-if="loginUser.UnitType != 2">
                            <el-select clearable style="width: 100%" v-model="query.search.bill_status" placeholder="请选择状态">
                                <el-option label="待审批" value="0">
                                </el-option>
                                <el-option label="已审批待付款" value="1">
                                </el-option>
                                <el-option label="已付款" value="2">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                    </el-col>
                    <el-col :span="6" :offset="1">
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
            <el-table-column align="center" label="单号" width="220">
                <template #default="scope">
                    <el-link :underline="false" @click="handleEdit(scope.row.BillId, 'View')" style="color: #f56c6c">
                        {{ scope.row.BillCode }}</el-link>
                </template>
            </el-table-column>
            <el-table-column v-if="loginUser.UnitType != 2" prop="UnitName" align="center" label="券商" width="140">
            </el-table-column>
            <el-table-column prop="PayMonth" label="支付月份" align="center" width="100"></el-table-column>
            <el-table-column label="支付(元)" align="left">
                <template #default="scope">
                    <p v-if="scope.row.WxPayAmt > 0">微信支付：{{ scope.row.WxPayAmt }} </p>
                    <p v-if="scope.row.WxDeductAmt > 0">微信扣除的手续费：{{ scope.row.WxDeductAmt }} </p>
                    <p v-if="scope.row.WxRefundAmt > 0">微信退款：{{ scope.row.WxRefundAmt }}</p>
                    <p v-if="scope.row.CashTicketPayAmt > 0">现金券支付：{{ scope.row.CashTicketPayAmt }}</p>
                    <p v-if="scope.row.CashTicketRefundAmt > 0">现金券退款：{{ scope.row.CashTicketRefundAmt }}</p>
                    <p v-if="scope.row.CashCardPayAmt > 0">储值卡支付：{{ scope.row.CashCardPayAmt }}</p>
                    <p v-if="scope.row.CashCardRefundAmt > 0">储值卡退款：{{ scope.row.CashCardRefundAmt }}</p>
                    
                </template>
            </el-table-column>
            <el-table-column prop="PromoteAmt" label="分销佣金(元)" align="center" width="120"></el-table-column>
            <el-table-column label="平台费用(元)" align="left">
                <template #default="scope">
                    <p>扣除基数：{{ scope.row.DeductBase }} </p>
                    <p>扣除费率：{{ scope.row.DeductFeeRate }} %</p>
                    <p>扣除金额：{{ scope.row.DeductAmt }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" align="center" width="160"></el-table-column>
            <el-table-column prop="BillRemark" label="备注" align="center">
            </el-table-column>
            <el-table-column prop="UnitStatusDesc" label="状态" align="center" width="80">
                <template #default="scope">
                    <p v-if="scope.row.BillStatus === 0">待审批</p>
                    <p v-if="scope.row.BillStatus === 1">已审批待付款</p>
                    <p v-if="scope.row.BillStatus === 2">已付款</p>
                </template>
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
import { SearchPayBills } from "@/api/finance.js";
import { SearchUnites } from "@/api/index.js";
const router = useRouter();
const store = useStore();
const query = reactive({
    search: {
        bill_code: "",
        unit_id: "",
        bill_status: "",
        pay_month_begin: "",
        pay_month_end: "",
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
    query.search.pay_month_begin = "";
    query.search.pay_month_end = "";
    if (timeValue.value) {
        if (timeValue.value.length > 0) {
            query.search.pay_month_begin = common.dateFormat("YYYYmm", timeValue.value[0]);
            query.search.pay_month_end = common.dateFormat("YYYYmm", timeValue.value[1]);
        }
    }
    let res = await SearchPayBills({
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

const loginUser = JSON.parse(Cookie.get("User"));
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
//编辑
const handleEdit = (ID, type) => {
    common.ClosePageTag("每月费用单据详情")
    router.push({
        path: "/finance_info",
        query: {
            ID: ID,
        },
    });
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
const changeGoodsId = async (ID) => {

}
/////////////////////////////////////////////////////////////////////////////////
//初始化
const init = async () => {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    // timeValue.value = [start, end]
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
            query.search.pay_month_begin = "";
            query.search.pay_month_end = "";
            if (timeValue.value) {
                if (timeValue.value.length > 0) {
                    query.search.pay_month_begin = common.dateFormat("YYYYmm", timeValue.value[0]);
                    query.search.pay_month_end = common.dateFormat("YYYYmm", timeValue.value[1]);
                }
            }
            let res = await SearchPayBills({
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
                tableData.value = res.DataMap.Data;
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
                        "单号",
                        "券商",
                        "支付月份",
                        "微信支付金额(元)",
                        "微信扣除的手续费(元)",
                        "微信退款金额(元)",
                        "现金券支付金额(元)",
                        "现金券退款金额(元)",
                        "储值卡支付金额(元)",
                        "分销佣金(元)",
                        "平台扣除费率",
                        "平台扣除金额",
                        "创建时间",
                        "备注",
                        "状态",
                    ];
                    const filterVal = [
                        "BillCode",
                        "UnitName",
                        "PayMonth",
                        "WxPayAmt",
                        "WxDeductAmt",
                        "WxRefundAmt",
                        "CashTicketPayAmt",
                        "CashTicketRefundAmt",
                        "CashCardPayAmt",
                        "PromoteAmt",
                        "DeductFeeRate",
                        "DeductAmt",
                        "CreateTime",
                        "BillRemark",
                        "BillStatusDesc",
                    ];
                    res.DataMap.Data.forEach(row => {
                        switch (row.BillStatus) {
                            case 0:
                                row.BillStatusDesc = "待审批"
                                break;
                            case 1:
                                row.BillStatusDesc = "已审批待付款"
                                break;
                            case 2:
                                row.BillStatusDesc = "已付款"
                                break;
                            default:
                                break;
                        }
                    })
                    const data = formatJson(filterVal, res.DataMap.Data);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: data,
                        filename: "财务管理导出" + time,
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
            if (row.title == "财务列表") {
                isRenovate = 1
            }
        });
        if (store.state.tags.pageSaerch.Search == 1 && isRenovate == 1 && store.state.tags.pageSaerch.titlePage == "财务列表") {
            query.PageStartRow = 1;
            getData();
            store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
    },
);
</script>
    
<style scoped></style>
    