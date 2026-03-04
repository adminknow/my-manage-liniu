<!-- 部分退款组件 -->
<template>
    <el-dialog title="退款信息" v-model="dialogVisible" width="54%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="handleSelectionRefundChange"
            :data="GoodsDetailData" style="width: 100%">
            <el-table-column type="selection" :selectable="selectedIsCheck" align="center" width="40" />
            <el-table-column align="left" label="商品信息">
                <template #default="scope">
                    {{ scope.row.GoodsCode + " - " + scope.row.GoodsTitle }}
                    <div v-if="
                        scope.row.JoinMallAct != null &&
                        scope.row.JoinMallAct.Ticketes.length > 0
                    ">
                        <div v-for="(item, index) in scope.row.JoinMallAct.Ticketes" :key="item.index" :index="index">
                            <p>
                                <el-checkbox style="position: relative; top: 2px" v-model="item.selected"
                                    @change="SelTicketIndex1($event, scope.$index, index)" label="" />
                                {{ item.TicketCode + " - " + item.TicketTemplateTitle }}
                            </p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="isTicketShow" align="left" label="券信息">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.Ticketes" :key="item.index" :index="index">
                        <p>
                            <el-checkbox v-if="scope.row.Ticketes.length >= 1" v-model="item.selected"
                                :disabled="item.TicketStatus != 2" label="" />
                            {{
                                item.TicketTemplateCode +
                                " " +
                                item.TicketCode +
                                " - " +
                                item.TicketTemplateTitle
                            }}
                        </p>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="售价(元)" width="80">
                <template #default="scope">
                    <p v-if="scope.row.RealQty != 0">
                        {{
                            (scope.row.RealPayAmt / scope.row.RealQty / 100).toFixed(2)
                        }}
                    </p>
                    <p v-else>0</p>
                </template>
            </el-table-column>
            <el-table-column prop="RealQty" align="center" label="可退数量" width="80"></el-table-column>
            <el-table-column label="退款数量" align="center" width="120">
                <template #default="scope">
                    <el-input v-model="scope.row.ApplyRefundQty"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="退款金额" align="center" width="150">
                <template #default="scope">
                    <el-input v-model="scope.row.ApplyRefundAmt">
                        <template #append>元</template></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="width: 100%; height: 10px"></div>
        <!-- 使用的折扣券，储值卡等数据 -->
        <el-table v-if="isShowPaysListCount > 0" :header-cell-style="{ 'text-align': 'center' }" :data="PaysList"
            style="width: 100%" @selection-change="handleSelectionPaysRefundChange">
            <el-table-column type="selection" align="center" width="40" />
            <el-table-column prop="PayTypeDesc" align="center" label="方式" width="80"></el-table-column>
            <el-table-column prop="CreateTime" align="center" label="下单时间" width="160"></el-table-column>
            <el-table-column label="单号" align="center">
                <template #default="scope">
                    <p v-if="scope.row.PayType == 'wx'">
                        {{ scope.row.PayRelNo1 }}
                    </p>
                    <p v-else>{{ scope.row.PayRelNo3 }}</p>
                </template>
            </el-table-column>
            <el-table-column label="可退金额" align="center" width="100">
                <template #default="scope">
                    <p>
                        {{
                            ((scope.row.PayAmt - scope.row.RefundAmt) / 100).toFixed(2)
                        }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="退款金额" align="center" width="150">
                <template #default="scope">
                    <el-input :disabled="scope.row.PayType == 'cash_ticket' ||
                        scope.row.PayType == 'discount_ticket'
                        " v-model="scope.row.ApplyRefundAmt">
                        <template #append>元</template></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="width: 100%; height: 10px"></div>
        <el-input v-model="textareaCancel" placeholder="请输入备注" maxlength="100" :rows="4" show-word-limit
            type="textarea">
        </el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
import { ElMessage } from "element-plus";
import {
    RefundOrder, GetOrderById
} from "@/api/order.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    orderId: {
        type: String,
        default: "",
    },
    info: { type: Object, default: {} }
});
// 从属性中解构
const { visible } = toRefs(props);
const textareaCancel = ref("");
const btnLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};

const onSubmit = async () => {
    if (textareaCancel.value == "") {
        ElMessage.error('请输入备注');
        return;
    }

    let AmtValue = 0;//退款金额
    if (multipleRefundSelection.value.length == 0) {
        ElMessage.error("请选择要退款的商品！");
        return;
    }
    let JSONList = JSON.parse(JSON.stringify(multipleRefundSelection.value));
    for (let i = 0; i < JSONList.length; i++) {
        const row = JSONList[i];
        if (row.Ticketes && row.Ticketes.length > 0) {
            let TicketesNew = [];
            //判断当前含有券信息，那么去循环是否勾选了券信息
            let isSel = false; //默认是没有勾选的
            for (let j = 0; j < row.Ticketes.length; j++) {
                if (row.Ticketes[j].selected) {
                    //认为你是勾选了券信息
                    isSel = true;
                    TicketesNew.push(row.Ticketes[j]);
                }
            }
            row.Ticketes = JSON.parse(JSON.stringify(TicketesNew));
            row.ApplyRefundActGiveTicketes = JSON.parse(JSON.stringify(TicketesNew));
            if (!isSel) {
                //当前商品没有勾选券信息
                ElMessage.error(
                    "商品名称：" +
                    row.GoodsCode +
                    "-" +
                    row.GoodsTitle +
                    " 请先勾选券信息"
                );
                return;
            }
        }
        if (row.JoinMallAct) {
            //如果不是赠品那么就需要输入退款金额，赠品的话 退款金额默认就是0
            if (row.GiveQty == 0) {
                if (row.ApplyRefundAmt == "") {
                    ElMessage.error("请输入退款金额");
                    return;
                }
            }
        }
        if (row.RealQty == 0) {
            ElMessage.error("当前商品数量为0，无法退款");
            return;
        }
        AmtValue = row.ApplyRefundAmt * 100 + AmtValue;
        row.ApplyRefundAmt = row.ApplyRefundAmt * 100;
    }
    let JSONPaysList = JSON.parse(
        JSON.stringify(multiplePaysRefundSelection.value)
    );
    for (let i = 0; i < JSONPaysList.length; i++) {
        const row = JSONPaysList[i];
        row.ApplyRefundAmt = row.ApplyRefundAmt * 100;
    }
    btnLoading.value = true;
    let res = await RefundOrder({
        OrderId: props.orderId,
        Amt: AmtValue,
        Details: JSONList,
        Pays: JSONPaysList,
        Remark: textareaCancel.value,
    });
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success('操作成功');
        emit("CloseVisible", 'save');
    } else {
        ElMessage.error(res.Message);
    }
};

const GoodsDetailData = ref([]);//表格数据
const PaysList = ref([]);//付款优惠券表格数据

const isShowPaysListCount = ref(0); //是否显示退款储值卡/现金卡
const multipleRefundSelection = ref([]);//选中的数据
const multiplePaysRefundSelection = ref([]); //退款支付信息选择
const handleSelectionRefundChange = (val) => {
    multipleRefundSelection.value = val;
};
const handleSelectionPaysRefundChange = (val) => {
    for (let i = 0; i < val.length; i++) {
        if (val[i].PayType == "cash_ticket") {
            val[i].ApplyRefundAmt = (val[i].PayAmt / 100).toFixed(2);
        }
    }
    multiplePaysRefundSelection.value = val;
};
const isTicketShow = ref(false);
//显示选择框按钮
const selectedIsCheck = (row) => {
    if (isTicketShow.value) {
        //如果是券商品
        if (row.RealQty > 0) {
            //只要可退数量大于0就表示可以退
            return true; //可以选择
        } else {
            return false; //不可选择
        }
    } else {
        //如果有值，说明已经发货了
        if (row.OrderExpressId) {
            return false; //不可选择
        } else {
            if (row.RefundQty == row.Qty) {
                return false; //不可选择
            } else {
                return true; //可选择
            }
        }
    }
};

//商品信息选择
const SelTicketIndex1 = (event, FIdx, Idx) => {
    if (multipleRefundSelection.value.length == 0) {
        GoodsDetailData.value[FIdx].JoinMallAct.Ticketes[Idx].selected = false;
        return;
    }
    multipleRefundSelection.value.forEach((row, index) => {
        if (row.OrderDetailId == GoodsDetailData.value[FIdx].OrderDetailId) {
            row.Ticketes[Idx].selected = event;
        }
    });
};

const GetOrderByIdApi = async () => {
    console.log("打开弹窗")
    let res = await GetOrderById({
        ObjectId: props.orderId,
    })
    if (res.Code == 200) {
        let PaysListNew = [];
        isShowPaysListCount.value = res.DataMap.Pays.length;
        res.DataMap.Pays.forEach((row) => {
            if (row.PayAmt > row.RefundAmt || row.PayType == "discount_ticket") {
                PaysListNew.push(row);
            }
        });
        res.DataMap.Details.forEach((row) => {
            row.Amt = "";
            if (row.ApplyRefundAmt) {
                row.ApplyRefundAmt = (row.ApplyRefundAmt / 100).toFixed(2);
            }
            if (row.JoinMallAct == null) {
                //说明当前这个是赠送的
                row.GoodsTitle = row.GoodsTitle + "(赠送)";
            }
            if (row.JoinMallAct != null && row.JoinMallAct.Ticketes.length > 0) {
                for (let i = 0; i < row.JoinMallAct.Ticketes.length; i++) {
                    const element = row.JoinMallAct.Ticketes[i];
                    element.selected = false;
                }
            }
            if (row.Ticketes) {
                row.Ticketes.forEach(ticketRow => {
                    ticketRow.selected = false;
                })
            }

        });
        GoodsDetailData.value = JSON.parse(JSON.stringify(res.DataMap.Details));
        PaysList.value = PaysListNew;
    }
}
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;

        if (props.info.OrderType == 1) {
            isTicketShow.value = true;
        } else {
            isTicketShow.value = false;
        }
        if (dialogVisible.value) {
            textareaCancel.value = "";
            GetOrderByIdApi();


        }
    }
);
</script>
