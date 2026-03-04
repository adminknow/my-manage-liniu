<template>
    <div class="container">
        <el-row style="margin-top: 20px; padding-bottom: 10px">
            <el-col class="send-local" :span="20">基本信息</el-col>
            <el-col :span="4">
                <div class="button-mgl">
                    <el-button class="button1 button-float" round @click="handleOut()">
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;出&nbsp;&nbsp;
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <el-row style="padding-bottom: 6px">
            <el-col :span="24">
                <div class="order-detail">
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="8">
                            单号：{{ form.BillCode }}
                        </el-col>
                        <el-col :span="8">
                            月份：{{ form.PayMonth }}
                        </el-col>
                        <el-col :span="8">
                            时间：{{ form.CreateTime }}
                        </el-col>
                    </el-row>
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="8">
                            微信支付：{{ form.WxPayAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            微信扣除的手续费：{{ form.WxDeductAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            微信退款：{{ form.WxRefundAmt }} 元
                        </el-col>
                    </el-row>
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="8">
                            现金券支付：{{ form.CashTicketPayAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            现金券退款：{{ form.CashTicketRefundAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            储值卡支付：{{ form.CashCardPayAmt }} 元
                        </el-col>
                    </el-row>
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="8">
                            平台扣除费率：{{ form.DeductFeeRate }} %
                        </el-col>
                        <el-col :span="8">
                            平台扣除：{{ form.DeductAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            储值卡退款：{{ form.CashCardRefundAmt }} 元
                        </el-col>
                    </el-row>
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="8">
                            分销佣金：{{ form.PromoteAmt }} 元
                        </el-col>
                        <el-col :span="8">
                            券商：{{ form.UnitName }}
                        </el-col>
                        <el-col :span="8">
                            状态：{{ form.BillStatusDesc }}
                        </el-col>
                    </el-row>
                    <el-row style="padding-bottom: 6px">
                        <el-col :span="24">
                            备注：{{ form.BillRemark }}
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px; padding-bottom: 10px">
            <el-col class="send-local" :span="24">费用明细</el-col>
        </el-row>
        <el-row style="padding-bottom: 6px">
            <el-col :span="24">
                <div class="order-detail">
                    <el-table height="600" :data="form.Details.slice(
                        (query.PageStartRow - 1) * query.PageRowCount,
                        query.PageStartRow * query.PageRowCount
                    )" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                        header-cell-class-name="table-header" style="width: 100%">
                        <el-table-column prop="OrderCode" align="center" label="订单号" width="200"></el-table-column>
                        <el-table-column prop="OrderTime" align="center" width="160" label="下单时间"></el-table-column>
                        <el-table-column prop="WxPayAmt" align="center" width="120" label="微信支付(元)"></el-table-column>
                        <el-table-column prop="WxDeductAmt" align="center" width="180" label="微信扣除的手续费(元)"></el-table-column>
                        <el-table-column prop="WxRefundAmt" align="center" width="120" label="微信退款(元)"></el-table-column>
                        <el-table-column prop="CashTicketPayAmt" align="center" label="现金券支付(元)"></el-table-column>
                        <el-table-column prop="CashTicketRefundAmt" align="center" label="现金券退款(元)"></el-table-column>
                        <el-table-column prop="CashCardPayAmt" align="center" label="储值卡支付(元)"></el-table-column>
                        <el-table-column prop="CashCardRefundAmt" align="center" label="储值卡退款(元)"></el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="->,total, sizes, prev, pager, next"
                            v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                            :page-sizes="[15, 50, 100]" :total="form.Details.length" @current-change="handlePageChange"
                            @size-change="handleSizeChange"></el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
            <el-col :span="23" :offset="1">
                <el-row>
                    <el-col :span="23">
                        <el-button class="button2" round
                            @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
    
<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { GetPayBill } from "@/api/finance.js";
import common from "@/utils/common.js";
const router = useRouter();

let form = reactive({
    BillId: "",
    BillCode: "",
    UnitId: "",
    PayMonth: "",
    WxPayAmt: "",
    WxDeductAmt: "",
    WxRefundAmt: "",
    CashTicketPayAmt: "",
    CashTicketRefundAmt: "",
    CashCardPayAmt: "",
    CashCardRefundAmt: "",
    PromoteAmt:"",
    DeductFeeRate: "",
    DeductAmt: "",
    BillRemark: "",
    CreateTime: "",
    UnitName: "",
    BillStatusDesc: "",
    Details: []
});
const onReturn = async (val) => {
    common.ClosePageTag("每月费用单据详情");
    router.back();
};
//根据ID获取详情
const GetPayBillApi = async (ID) => {
    let res = await GetPayBill({
        ObjectId: ID
    })
    if (res.Code == 200) {
        form.BillId = res.DataMap.BillId;
        form.BillCode = res.DataMap.BillCode;
        form.UnitId = res.DataMap.UnitId;
        form.PayMonth = res.DataMap.PayMonth;
        form.WxPayAmt = res.DataMap.WxPayAmt.toFixed(2);
        form.WxDeductAmt = res.DataMap.WxDeductAmt.toFixed(2);
        form.WxRefundAmt = res.DataMap.WxRefundAmt.toFixed(2);
        form.CashTicketPayAmt = res.DataMap.CashTicketPayAmt.toFixed(2);
        form.CashTicketRefundAmt = res.DataMap.CashTicketRefundAmt.toFixed(2);
        form.CashCardPayAmt = res.DataMap.CashCardPayAmt.toFixed(2);
        form.CashCardRefundAmt = res.DataMap.CashCardRefundAmt.toFixed(2);
        form.PromoteAmt = res.DataMap.PromoteAmt.toFixed(2);
        form.DeductFeeRate = res.DataMap.DeductFeeRate;
        form.DeductAmt = res.DataMap.DeductAmt.toFixed(2);
        form.BillRemark = res.DataMap.BillRemark;
        form.CreateTime = res.DataMap.CreateTime;
        form.UnitName = res.DataMap.UnitName;
        form.Details = res.DataMap.Details;

        switch (res.DataMap.BillStatus) {
            case 0:
                form.BillStatusDesc = "待审批"
                break;
            case 1:
                form.BillStatusDesc = "已审批待付款"
                break;
            case 2:
                form.BillStatusDesc = "已付款"
                break;
            default:
                break;
        }
    }
};
const Init = async () => {
    if (router.currentRoute.value.query.ID) {
        GetPayBillApi(router.currentRoute.value.query.ID);
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////
const query = reactive({
    PageStartRow: 1,
    PageRowCount: 15,
});
//分页导航
const handlePageChange = (val) => {
    query.PageStartRow = val;
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
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
            var myDate = new Date();
            myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            var time =
                myDate.getFullYear() +
                "-" +
                (myDate.getMonth() + 1) +
                "-" +
                myDate.getDate();
            let OutData = JSON.parse(JSON.stringify(form.Details));
            import("../../vendor/Export2Excel").then((excel) => {
                const tHeader = [
                    "订单号",
                    "下单时间",
                    "微信支付(元)",
                    "微信扣除的手续费(元)",
                    "微信退款(元)",
                    "现金券支付(元)",
                    "现金券退款(元)",
                    "储值卡支付(元)",
                    "储值卡退款(元)",
                    "分销佣金(元)",
                    "单号",
                    "券商",
                    "支付月份",
                    "创建时间",
                ];
                const filterVal = [
                    "OrderCode",
                    "OrderTime",
                    "WxPayAmt",
                    "WxDeductAmt",
                    "WxRefundAmt",
                    "CashTicketPayAmt",
                    "CashTicketRefundAmt",
                    "CashCardPayAmt",
                    "CashCardRefundAmt",
                    "PromoteAmt",
                    "BillCode",
                    "UnitName",
                    "PayMonth",
                    "CreateTime",
                ];
                OutData.forEach(row => {
                    row.BillCode = form.BillCode;
                    row.UnitName = form.UnitName;
                    row.PayMonth = form.PayMonth;
                    row.CreateTime = form.CreateTime;
                });
                let OrderCodeDesc = "汇总：" + "\r\n" + "单号：" + form.BillCode + "\r\n" + "月份：" + form.PayMonth + "\r\n" + "时间：" + form.CreateTime + "\r\n" + "券商：" + form.UnitName + "\r\n" + "平台扣除费率：" + form.DeductFeeRate + "%" + "\r\n" + "平台扣除金额：" + form.DeductAmt + "元"+"\r\n" +"状态："+form.BillStatusDesc;
                let WxPayAmtDesc = "微信支付(元)：" + form.WxPayAmt;
                let WxDeductAmtDesc = "微信扣除的手续费(元)：" + form.WxDeductAmt;
                let WxRefundAmtDesc = "微信退款(元)：" + form.WxRefundAmt;
                let CashTicketPayAmtDesc = "现金券支付(元)：" + form.CashTicketPayAmt;
                let CashTicketRefundAmtDesc = "现金券退款(元)：" + form.CashTicketRefundAmt;
                let CashCardPayAmtDesc = "储值卡支付(元)：" + form.CashCardPayAmt;
                let CashCardRefundAmtDesc = "储值卡退款(元)：" + form.CashCardRefundAmt;
                let PromoteAmtDesc = "分销佣金(元)：" + form.PromoteAmt;
                OutData.push({
                    OrderCode: OrderCodeDesc,
                    WxPayAmt: WxPayAmtDesc,
                    WxDeductAmt: WxDeductAmtDesc,
                    WxRefundAmt: WxRefundAmtDesc,
                    CashTicketPayAmt: CashTicketPayAmtDesc,
                    CashTicketRefundAmt: CashTicketRefundAmtDesc,
                    CashCardPayAmt: CashCardPayAmtDesc,
                    CashCardRefundAmt: CashCardRefundAmtDesc,
                    PromoteAmt:PromoteAmtDesc
                })
                const data = formatJson(filterVal, OutData);
                excel.export_json_to_excel({
                    header: tHeader,
                    data: data,
                    filename: "财务费用明细导出" + time,
                    autoWidth: true,
                });
            });
        })
        .catch(() => { });
};
const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
};
Init();
</script>
    
<style scoped>
.order-detail {
    font-size: 16px;
    padding: 0 28px;
}

.icon_top {
    position: relative;
    top: 5px;
    left: 10px;
}
</style>
    