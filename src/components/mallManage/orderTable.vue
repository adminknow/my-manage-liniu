<!-- 商城订单表格组件 -->
<template>
    <el-table :data="tableData" ref="elTableRef" border class="table" v-loading="tableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
        @selection-change="handleSelectionOrderChange" :row-key="row => row.OrderId" :expand-on-row-click="false"
        v-model:expand-row-keys="expandRowKeys" @expand-change="onExpandChange">
        <el-table-column type="expand">
            <template #default="props">
                <div class="child-contant">
                    <p>商品信息</p>
                    <el-table @selection-change="handleSelectionChange($event, props.row.OrderId)"
                        :data="props.row.Details" style="width: 90%" border
                        :header-cell-style="{ 'text-align': 'center' }">
                        <el-table-column align="center" :selectable="selected" type="selection" width="55" />
                        <el-table-column align="left" label="商品">
                            <template #default="scope">
                                <el-popover :width="300"
                                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                    <template #default>
                                        <el-icon v-if="!goodsInfo.GoodsDetail">
                                            <Loading />
                                        </el-icon>
                                        <p v-else v-html="goodsInfo.GoodsDetail"></p>
                                    </template>
                                    <template #reference>
                                        <el-link @mouseover="mouseoverGoods(scope.row.GoodsId)"
                                            @click="jumpGoodsClick(scope.row, props.row.OrderType)"
                                            style="color: #f56c6c; font-size: 12px" :underline="false">{{
                                                scope.row.GoodsCode + " - " + scope.row.GoodsTitle
                                            }}</el-link>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="SKU">
                            <template #default="scope">
                                <p v-if="scope.row.SkuCode">
                                    {{ scope.row.SkuCode + " - " + scope.row.SkuPropertyDesc }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Qty" align="center" label="购买数量" width="100">
                        </el-table-column>
                        <el-table-column prop="RefundQty" align="center" label="退款数量" width="100">
                        </el-table-column>
                        <el-table-column align="center" label="支付金额(元)" width="120">
                            <template #default="scope">
                                <p>{{ (scope.row.PayAmt / 100).toFixed(2) }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="退款金额(元)" width="120">
                            <template #default="scope">
                                <p>{{ (scope.row.RefundAmt / 100).toFixed(2) }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ExpressCode" align="center" label="物流信息" width="150">
                            <template #default="scope">
                                <p>{{ scope.row.ExpressTypeDesc }}</p>
                                <p>{{ scope.row.ExpressCode }}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="child-contant" v-if="props.row.FaterTicketes.length > 0">
                    <p>券信息</p>
                    <el-table :data="props.row.FaterTicketes" style="width: 90%" border
                        :header-cell-style="{ 'text-align': 'center' }">
                        <el-table-column prop="TicketTemplateCode" align="center" label="批次号">
                        </el-table-column>
                        <el-table-column prop="TicketTemplateTitle" align="center" label="名称">
                        </el-table-column>
                        <el-table-column prop="TicketCode" align="center" label="券码">
                        </el-table-column>
                        <el-table-column prop="TicketStatusDesc" align="center" label="状态">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
        </el-table-column>
        <el-table-column align="center" type="selection" :selectable="selectedApprove" width="55" />
        <el-table-column align="left" label="订单信息" width="220">
            <template #default="scope">
                <el-link :underline="false" @click="handleEdit(scope.row.OrderId)" style="color: #f56c6c">
                    {{ scope.row.OrderCode }}</el-link>
                <p>{{ scope.row.OrderTime }}</p>
                <p>{{ scope.row.UnitName }}</p>
                <p>{{ scope.row.AccountName + '--' + scope.row.MallUnitName }}</p>
            </template>
        </el-table-column>
        <el-table-column align="left" label="购买人" width="160">
            <template #default="scope">
                <p>{{ scope.row.WxxcxOpenid }}</p>
                <p>{{ scope.row.VipName }}</p>
                <p>{{ scope.row.VipCell }}</p>
                <p v-if="scope.row.OrderScene">{{ scope.row.OrderScene }}</p>
            </template>
        </el-table-column>
        <el-table-column align="left" label="收件人" width="200">
            <template #default="scope">
                <p v-if="scope.row.ContactName">
                    {{ scope.row.ContactName }}&nbsp;{{ scope.row.ContactCell }}
                </p>
                <p v-if="scope.row.ContactProvinceName">
                    {{
                        scope.row.ContactProvinceName +
                        " " +
                        scope.row.ContactCityName +
                        " " +
                        scope.row.ContactDistrictName +
                        " " +
                        scope.row.ContactAddress
                    }}
                </p>
            </template>
        </el-table-column>
        <el-table-column align="left" label="商品详情">
            <template #default="scope">
                <div v-for="(item, index) in scope.row.Details" :key="index">
                    <p>
                        {{ item.GoodsCode + "-" + item.GoodsTitle }}
                        <span style="margin-left: 10px">×{{ item.Qty }}</span>
                    </p>
                </div>
            </template>
        </el-table-column>
        <el-table-column align="left" label="支付金额(元)" width="120">
            <template #default="scope">
                <p>卡券：{{ (scope.row.TicketAmt / 100).toFixed(2) }}</p>
                <p>微信：{{ (scope.row.PayAmt / 100).toFixed(2) }}</p>
                <p>{{ scope.row.InvoiceStatusDesc }}</p>
            </template>
        </el-table-column>
        <el-table-column align="left" label="物流信息" width="170">
            <template #default="scope">
                <div v-for="(item, index) in scope.row.Expresses" :key="index">
                    <p>{{ item.ExpressTypeDesc }}</p>
                    <p>
                        {{ item.ExpressCode
                        }}<span v-if="localSearch.order_status == '31,51,40'"><el-link
                                style="color: #f56c6c; font-size: 12px; margin-left: 4px" :underline="false" @click="
                                    handleDelExpress(item.OrderExpressId, scope.row.OrderId)
                                    ">
                                删除快递</el-link></span>
                    </p>
                    <p>{{ item.ExpressTime }}</p>
                    <el-popover :width="300"
                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                        <template #default>
                            <div v-if="Logistics.data">
                                <h5>{{ Logistics.data[0].context }}</h5>
                                <p style="margin-top: 6px">{{ Logistics.data[0].time }}</p>
                                <p style="font-size: 12px; margin-top: 6px">
                                    以上为最新跟踪信息<el-link @click="viewLogisticsAll" style="color: #f56c6c; font-size: 12px"
                                        :underline="false">查看全部</el-link>
                                </p>
                            </div>
                            <el-icon v-else>
                                <Loading />
                            </el-icon>
                        </template>
                        <template #reference>
                            <el-link @mouseover="mouseover(item.OrderExpressId, scope.row.OrderId)"
                                @mouseleave="mouseleave" style="color: #f56c6c; font-size: 12px"
                                :underline="false">查看物流</el-link>
                        </template>
                    </el-popover>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="OrderStatusDesc" label="状态" align="center" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
            <template #default="scope">
                <div class="button-mgl">
                    <el-button v-if="
                        scope.row.OrderStatus == 0 &&
                        IsEditOrder &&
                        scope.row.OrderType == 0 && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)
                    " class="button-op-edit" size="small" @click="handleOrderById(scope.row.OrderId)">修改收件
                    </el-button>
                    <el-button v-if="
                        (scope.row.OrderStatus == 30 || scope.row.OrderStatus == 31) &&
                        IsExpressOrder && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)
                    " class="button-op-edit" size="small" @click="handleSend(scope.row.OrderId, 'all')">整单发货
                    </el-button>
                    <el-button v-if="
                        (scope.row.OrderStatus == 30 || scope.row.OrderStatus == 31) &&
                        IsExpressOrder && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)
                    " class="button-op-edit" size="small" @click="handleSend(scope.row.OrderId, 'single')">组合发货
                    </el-button>
                    <el-button
                        v-if="scope.row.OrderStatus == 0 && IsCancelOrder && (scope.row.UnitId == loginUser.UnitId) && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)"
                        class="button-op-del" size="small" @click="handleCannel(scope.row.OrderId)">取消
                    </el-button>
                    <el-button v-if="scope.row.OrderStatus == 0 && scope.row.OrderType == 5" class="button-op-edit"
                        size="small" @click="handleSendPay(scope.row.OrderId)">推送支付通知
                    </el-button>
                    <el-button
                        v-if="scope.row.NeedInvoice == 1 && scope.row.Invoice.InvoiceStatus == 0 && IsIssueOrderInvoice&&scope.row.UnitId==loginUser.UnitId"
                        class="button-op-edit" size="small" @click="handleInvoice(scope.row.OrderId)">准备开票
                    </el-button>

                    <el-button v-if="
                        (scope.row.OrderStatus == 20 ||
                            scope.row.OrderStatus == 30 ||
                            scope.row.OrderStatus == 31 ||
                            scope.row.OrderStatus == 40 ||
                            scope.row.OrderStatus == 100) &&
                        IsRefundOrder &&
                        scope.row.CanRefundAll && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)
                    " class="button-op-del" size="small"
                        @click="handleRefundAll(scope.row.OrderId, scope.row.PayAmt, scope.row.TicketAmt)">全额退款
                    </el-button>
                    <el-button v-if="
                        (scope.row.OrderStatus == 20 ||
                            scope.row.OrderStatus == 30 ||
                            scope.row.OrderStatus == 31 ||
                            scope.row.OrderStatus == 40 ||
                            scope.row.OrderStatus == 100) &&
                        IsRefundOrder &&
                        scope.row.CanRefundPart &&
                        scope.row.OrderType != 3 && (scope.row.UnitId == loginUser.UnitId || scope.row.MallUnitId == loginUser.UnitId)
                    " class="button-op-del" size="small" @click="handleRefund(scope.row, scope.row.OrderId)">部分退款
                    </el-button>
                    <el-button v-if="scope.row.OrderStatus == 10" class="button-op-reset" size="small"
                        @click="handleSendOrderTicket(scope.row.OrderId)">手工发放券
                    </el-button>
                    <el-button class="button-op-edit" size="small" @click="handleHistoryBtn(scope.row.OrderId)">日志
                    </el-button>
                    <el-button
                        v-if="(scope.row.MallUnitId == loginUser.UnitId||scope.row.UnitId == loginUser.UnitId) && (scope.row.OrderStatus == 20 || scope.row.OrderStatus == 10 || scope.row.OrderStatus == 30 || scope.row.OrderStatus == 31 || scope.row.OrderStatus == 51 || scope.row.OrderStatus == 40 || scope.row.OrderStatus == 100) && IsOrderPromoteFeeDeal"
                        class="button-op-edit" size="small" @click="handleManualPromoter(scope.row.OrderId)">手工佣金
                    </el-button>
                    <el-button
                        v-if="(localSearch.order_status == '31,51,40' || scope.row.OrderStatus == '100') && loginUser.UnitName == '礼牛严选'"
                        class="button-op-edit" size="small" @click="SynOrderLogClick(scope.row.OrderId)">从云中鹤同步快递单
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!-- 修改收件地址 -->
    <receive-components :visible="receiveVisible" :orderId="orderId" @CloseVisible="receiveClose"></receive-components>
    <!-- 取消订单 -->
    <cancel-components :visible="cancelVisible" :orderId="orderId" @CloseVisible="cancelClose"></cancel-components>
    <!-- 日志 -->
    <log-components :visible="logVisible" :orderId="orderId" @CloseVisible="logClose"></log-components>
    <!-- 整单退款 -->
    <full-refundComponents :visible="fullRefundVisible" :orderId="orderId" :Amt="Amt"
        @CloseVisible="fullRefundClose"></full-refundComponents>
    <!-- 部分退款 -->
    <partial-refundComponents :visible="partialRefundVisible" :info="tableInfo" :orderId="orderId"
        @CloseVisible="partialRefundClose"></partial-refundComponents>

    <!-- 整单发货或者组合发货 -->
    <shipped-components :visible="shippedVisible" :orderId="orderId" :detailsIds="selectedDetailRows"
        :type="shippedType" @CloseVisible="shippedClose"></shipped-components>


</template>
<script setup>
import receiveComponents from "@/components/mallManage/order/receive.vue";//修改收件地址
import cancelComponents from "@/components/mallManage/order/cancel.vue";//取消订单
import logComponents from "@/components/mallManage/order/log.vue";//日志
import fullRefundComponents from "@/components/mallManage/order/fullRefund.vue";//整单退款
import partialRefundComponents from "@/components/mallManage/order/partialRefund.vue";//部分退款
import shippedComponents from "@/components/mallManage/order/shipped.vue";//整单发货或者组合发货
import { IsOpenPromote, ManualPromoterOrderDetail } from "@/api/promoteApi.js";
import { usePayApi } from "@/composables/order/usePayApi.js";
import common from "@/utils/common.js";
import { useRouter } from "vue-router";
const router = useRouter();
import { ref, reactive, watch, toRefs, } from "vue";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
import { ElMessage, ElMessageBox } from "element-plus";
import {
    GetDeliverOrderExpressDetail,
} from "@/api/order.js";
import { GetGoods } from "@/api/goods.js";
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
    IsApproveOrder: {
        type: Boolean,
        default: false,
    },
    IsEditOrder: {
        type: Boolean,
        default: false,
    },
    IsCancelOrder: {
        type: Boolean,
        default: false,
    },
    IsExpressOrder: {
        type: Boolean,
        default: false,
    },
    IsForceCancelOrder: {
        type: Boolean,
        default: false,
    },
    IsIssueOrderInvoice: {
        type: Boolean,
        default: false,
    },
    IsRefundOrder: {
        type: Boolean,
        default: false,
    },
    IsOrderPromoteFeeDeal: {
        type: Boolean,
        default: false,
    },

    search: { type: Object, default: () => ({}) },     // 具名 v-model:search
});
const {
    SendPayTicketOrderPayNotifyApi,
    PrepareIssueOrderInvoiceApi,
    loading
} = usePayApi();
// 本地副本，避免直接改 props

const localSearch = reactive({ ...props.search });
const emit = defineEmits(["OpBtn"]);

const orderId = ref("");
const elTableRef = ref();
const selectedDetailRows = ref([]);
////////////////////////////////////////
// 监听勾选变化
const handleSelectionChange = (rows) => {
    if (rows.length == 0) {
        selectedDetailRows.value = [];
        return;
    }
    selectedDetailRows.value = rows;
    selectedDetailRows.value.forEach(row => { row.select = true; });
    console.log("selectedDetailRows", selectedDetailRows.value);
};
// // 暴露给父组件的全选方法
// const selectAll = (rows = props.tableData) => {
//     // 清空选择
//     elTableRef.value?.clearSelection?.();
//     // 批量勾选
//     rows.forEach((row) => {
//         elTableRef.value?.toggleRowSelection?.(row, true);
//     });
// };
//查看物流
const Logistics = ref([]);
const mouseover = async (OrderExpressId, OrderId) => {
    let res = await GetDeliverOrderExpressDetail({
        OrderExpressId: OrderExpressId,
        OrderId: OrderId,
    });
    if (res.Code == 200) {
        Logistics.value = res.DataMap;
    }
};
//获取商品详细信息
const goodsInfo = ref({});
const mouseoverGoods = async (GoodsId) => {
    goodsInfo.value = {};
    let res = await GetGoods({
        ObjectId: GoodsId,
    });
    if (res.Code == 200) {
        goodsInfo.value = res.DataMap;
    }
};
//兑换的商品是否允许check
const selected = (row) => {
    //如果有值，说明已经发货了
    if (row.OrderExpressId) {
        return false; //可选择
    } else {
        return true; //不可选择
    }
};
//判断check是否可以选择（根据状态来判断)
const selectedApprove = (row, index) => {
    if (row.OrderStatus == 20) {
        // 根据你的条件来设置
        return true; //可选择
    } else {
        return false; //不可选择
    }
};

//修改收件
const receiveVisible = ref(false);
const handleOrderById = (id) => {
    receiveVisible.value = true;
    orderId.value = id;
};
const receiveClose = (op) => {
    receiveVisible.value = false;
    emit("OpBtn", op);
};
const handleSendPay = async (id) => {
    const res = await SendPayTicketOrderPayNotifyApi(id);
    if (res.Code == 200) {
        ElMessage.success("推送成功");
    }
}
const handleInvoice = async (id) => {
    const res = await PrepareIssueOrderInvoiceApi(id);
    if (res.Code == 200) {
        ElMessage.success("操作成功");
        emit("OpBtn", 'save');
    }
}
//取消订单
const cancelVisible = ref(false);
const handleCannel = (id) => {
    cancelVisible.value = true;
    orderId.value = id;
};
const cancelClose = (op) => {
    cancelVisible.value = false;
    emit("OpBtn", op);
};
//查看订单详情
const handleEdit = (ID) => {
    common.ClosePageTag("订单详情");
    router.push({
        path: "/order_info",
        query: {
            Type: "",
            ID: ID,
        },
    });
};
//跳转到商品详情
const jumpGoodsClick = (row, OrderType) => {
    if (OrderType == 5) {
        //后付款订单，直接跳转到券查询界面
        common.ClosePageTag("券码查询");
        router.push({
            path: "/find_no",
            query: {
                No: row.GoodsCode,
            },
        });
    } else {
        common.ClosePageTag("售卖详情");
        router.push({
            path: "/selling_goods_info",
            query: {
                ID: row.GoodsId,
                Type: "View",
            },
        });
    }

}
//日志
const logVisible = ref(false);
const handleHistoryBtn = (id) => {
    logVisible.value = true;
    orderId.value = id;
};
const logClose = () => {
    logVisible.value = false;
};
//手工佣金
const handleManualPromoter = async (ID) => {
    let res = await ManualPromoterOrderDetail({
        ObjectId: ID
    })
    if (res.Code == 200) {
        ElMessage.success("操作成功！");
    }
}

//全额退款
const Amt = ref(0);
const fullRefundVisible = ref(false);
const handleRefundAll = (id, PayAmt, TicketAmt) => {
    fullRefundVisible.value = true;
    Amt.value = Number(PayAmt + TicketAmt);
    orderId.value = id;
}
const fullRefundClose = (op) => {
    fullRefundVisible.value = false;
    emit("OpBtn", op);
}

//部分退款
const partialRefundVisible = ref(false);
const tableInfo = ref({});
const handleRefund = (rowData, id) => {
    partialRefundVisible.value = true;
    tableInfo.value = rowData;
    orderId.value = id;
}
const partialRefundClose = (op) => {
    partialRefundVisible.value = false;
    emit("OpBtn", op);
}

//组合发货
const shippedVisible = ref(false);
const shippedType = ref("");
const handleSend = (id, type) => {
    orderId.value = id;
    shippedType.value = type;
    if (type == 'all') {
        //整单发货
    } else {
        //组合发货
        if (selectedDetailRows.value.length == 0) {
            ElMessage.warning("请先选择要发货的商品！");
            return;
        }
    }

    shippedVisible.value = true;
}
const shippedClose = (op) => {
    shippedVisible.value = false;
    emit("OpBtn", op);
}

// 仅允许展开一个
const expandRowKeys = ref([]);

// 当展开/收起变化时，仅保留当前展开的一个 key
const onExpandChange = (row, expandedRows) => {
    if (!row || !row.OrderId) return;
    // expandedRows 为当前已展开的行数组
    if (expandedRows?.length) {
        // 只保留当前行的 key
        expandRowKeys.value = [row.OrderId];
    } else {
        // 当前行被收起

        expandRowKeys.value = [];
    }
    selectedDetailRows.value = [];
};

// 如需获取当前已选
// 监听勾选变化
const selectedRows = ref([]);
const handleSelectionOrderChange = (rows) => {
    selectedRows.value = rows;
};
const getSelected = () => selectedRows.value;
defineExpose({
    // selectAll,
    getSelected
});
////////////////////////////////////////
</script>
<style lang="css" scoped>
.child-contant {
    margin: 20px;
    margin-top: 0;
    padding-left: 90px;
}
</style>