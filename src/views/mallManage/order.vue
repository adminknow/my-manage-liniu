<!-- 我的商城订单页面 -->
<template>
    <div class="container">
        <!-- 将 search 双向绑定给子组件 -->
        <order-search v-model:search="query.search" @search="handleSearch" :IsApproveOrder="IsApproveOrder"
            @batchApprove="handleBatchApprove" @handleOut="handleOut"></order-search>
        <!-- 订单状态标签组件 -->
        <order-tags :tagList="statusList" :statData="StatData" @chooseTag="handleChooseTag"></order-tags>
        <div style="width:100%;height: 10px;"></div>
        <!-- 订单列表表格 -->
        <order-table ref="dataTableRef" v-model:search="query.search" :tableData="tableData"
            :tableLoading="tableLoading" :IsApproveOrder="IsApproveOrder" :IsEditOrder="IsEditOrder"
            :IsExpressOrder="IsExpressOrder" :IsCancelOrder="IsCancelOrder" :IsForceCancelOrder="IsForceCancelOrder"
            :IsIssueOrderInvoice="IsIssueOrderInvoice" :IsRefundOrder="IsRefundOrder"
            :IsOrderPromoteFeeDeal="IsOrderPromoteFeeDeal" @OpBtn="OpBtn"></order-table>
        <!-- 主表格分页 -->
        <common-pagination v-model:current-page="query.PageStartRow" v-model:page-size="query.PageRowCount"
            :total="pageTotal" :page-sizes="[15, 50, 100]" @page-change="handlePageChange"
            @size-change="handleSizeChange" />
        <!-- 日志 -->
        <approve-components :visible="approveVisible" :orderIds="orderItems"
            @CloseVisible="approveClose"></approve-components>
    </div>
</template>

<script setup>
let statusList = ref([
    {
        value: "",
        key: "全部",
        active: false,
    },
    {
        value: "0",
        key: "待付款",
        active: false,
    },
    {
        value: "20",
        key: "待审核",
        active: true,
    },
    {
        value: "10,30,31",
        key: "待发货",
        active: false,
    },
    {
        value: "31,51,40",
        key: "已发货",
        active: false,
    },
    {
        value: "100",
        key: "已完成",
        active: false,
    },
    {
        value: "-1",
        key: "已取消",
        active: false,
    },
    {
        value: "300",
        key: "近三个月订单",
        active: false,
    },
]);
import approveComponents from "@/components/mallManage/order/approve.vue";//日志
import CommonPagination from "@/components/common/CommonPagination.vue";
import orderSearch from "@/components/mallManage/orderSearch.vue";
import orderTags from "@/components/mallManage/orderTags.vue";
import orderTable from "@/components/mallManage/orderTable.vue";
import { ref, reactive, watch, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import { SearchOrders } from "@/api/order.js";
import { SearchMyMalls, OnlineMyMall, StatSingle } from "@/api/index.js";
import Cookie from "js-cookie";
import { useRights } from "@/hooks/useRights.js";
import { useOrderExport } from "@/hooks/use-export.js";

const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();

const query = reactive({
    search: {
        order_code: "",
        order_status: "20", //状态 (0:全部;1:待付款;2:已完成;)
        contact_cell: "", //联系电话
        contact_name: "", //联系人
        wxxcx_openid: "",//OpenID
        express_code: "", //物流单号
        goods_name: "", //商品名称
        ticket_code: "", //券码
        order_id: "",//订单id针对于 礼牛
        invoice_status: "", //发票状态（0:待开票;1:开票中;10:已开票;-10 不开票）
        time: [],
        order_date_begin: "",
        order_date_end: "",
        unit_id: "", //券商ID
        mall_unit_id: "",
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
    if (query.search.time) {
        if (query.search.time.length > 0) {
            query.search.order_date_begin = common.dateFormat(
                "YYYY-mm-dd",
                query.search.time[0]
            );
            query.search.order_date_end = common.dateFormat(
                "YYYY-mm-dd",
                query.search.time[1]
            );
        } else {
            query.search.order_date_begin = "";
            query.search.order_date_end = "";
        }
    } else {
        query.search.order_date_begin = "";
        query.search.order_date_end = "";
    }
    let res = await SearchOrders({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        tableData.value.forEach((row) => {
            row.FaterTicketes = [];
            row.Details.forEach((DetailRow) => {
                if (DetailRow.Ticketes && DetailRow.Ticketes.length > 0) {
                    row.FaterTicketes = row.FaterTicketes.concat(DetailRow.Ticketes);
                }
            });
        });
        pageTotal.value = res.DataMap.ToalCount;
    } else {
        pageTotal.value = 0;
        tableData.value = [];
        ElMessage.error(res.Message);
    }
};
// 获取标签汇总数据
//统计数量
const StatData = reactive({
    wait_pay_cnt: "", //待付款
    pay_wait_ticket_cnt: "", //待发券
    wait_approve_cnt: "",
    wait_deliver_cnt: "",
});
const StatSingleData = async () => {
    //获取头部数据
    let res = await StatSingle({
        StatType: 8,
    });
    if (res.Code == 200) {
        StatData.wait_pay_cnt = res.DataMap.wait_pay_cnt;
        StatData.pay_wait_ticket_cnt = res.DataMap.pay_wait_ticket_cnt;
        StatData.wait_approve_cnt = res.DataMap.wait_approve_cnt;
        StatData.wait_deliver_cnt = res.DataMap.wait_deliver_cnt;
        //
        if (res.DataMap.pay_wait_ticket_cnt > 0) {
            if (statusList.value.length < 9) {
                statusList.value.splice(2, 0, {
                    value: "10",
                    key: "已付款待发券",
                    active: false,
                });
            }
        }
    }
};
StatSingleData();

//页面权限设置
//按钮权限控制
const rightCodes = ref([
    "approve_order",
    "edit_order",
    "express_order",
    "force_cancel_order",
    "cancel_order",
    "refund_order",
    "order_promote_fee_deal",
    "issue_order_invoice"]);
const { hasRight } = useRights(rightCodes);
const IsApproveOrder = computed(() => hasRight("approve_order"));
const IsEditOrder = computed(() => hasRight("edit_order"));
const IsExpressOrder = computed(() => hasRight("express_order"));
const IsCancelOrder = computed(() => hasRight("cancel_order"));
const IsForceCancelOrder = computed(() => hasRight("force_cancel_order"));
const IsIssueOrderInvoice = computed(() => hasRight("issue_order_invoice"));
const IsRefundOrder = computed(() => hasRight("refund_order"));
const IsOrderPromoteFeeDeal = computed(() => hasRight("order_promote_fee_deal"));
const dataTableRef = ref(null);
const handleSearch = () => {
    console.log("searchValue", query);
    query.PageStartRow = 1;
    getData();
    StatSingleData();
};
const handleChooseTag = (index) => {
    query.search.order_status = statusList.value[index].value;
    if (statusList.value[index].value == 300) {
        query.search.order_status = "";
        //三个月
        const end = new Date();
        end.setHours(23, 59, 59);
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        start.setHours(0, 0, 0);
        query.search.time = [start, end];
    } else if (statusList.value[index].value == "") {
        //点击全部就只查询一个月的
        const end = new Date();
        end.setHours(23, 59, 59);
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        start.setHours(0, 0, 0);
        query.search.time = [start, end];
        pageTotal.value = 0;
        tableData.value = [];
    } else {
        query.search.time = [];
    }
    query.PageStartRow = 1;
    getData();
};

const OpBtn = (op) => {
    if (op == "save") {
        handleSearch()
    }
    if (op.type == 'approve') {
        const orderid = op.orderId;
    }
};
const approveVisible = ref(false);
const approveClose = (op) => {
    approveVisible.value = false;
    if (op == "save") {
        handleSearch();
    }
}
const orderItems = ref([]);
const handleBatchApprove = () => {
    //批量审批
    let selected = dataTableRef.value?.getSelected?.();
    orderItems.value = selected
        .filter(item => item && item.OrderId)
        .map(item => String(item.OrderId));
    console.log("idArray", orderItems.value);
    if (orderItems.value.length == 0) {
        ElMessage.warning("请选择要审核的订单");
        return;
    }
    approveVisible.value = true;
};


////////////////////////////////////////////////////////////////////////////////////////////////
//数据导出
const { handleExport } = useOrderExport();
const handleOut = () => {
    handleExport(query, tableLoading);
};
////////////////////////////////////////////////////////////////////////////////////////////////

// 分页导航
const handlePageChange = (val) => {
    query.PageStartRow = val;
    getData();
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
    getData();
};
const init = async () => {

    getData();
};
init();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
    () => router.currentRoute.value,
    (data) => {
        if (data.meta.title == "订单管理") {
            query.PageStartRow = 1;
            getData();
        }
    }
);
</script>

<style scoped></style>
