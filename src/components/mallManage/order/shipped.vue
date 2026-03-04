<!-- 订单发货组件 -->
<template>
    <el-dialog title="发货" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
            v-model="textareaRemark">
        </el-input>
        <div style="width:100%;height: 18px;"></div>
        <el-form-item label="物流信息">
            <div v-for="(item, index) in Expresses" :key="index">
                <el-row style="padding-bottom: 8px">
                    <el-col :span="11">
                        <el-select v-model="item.ExpressType" filterable clearable style="width: 100%"
                            placeholder="请选择快递公司">
                            <el-option v-for="itemChild in expressList" :key="itemChild.Name" :label="itemChild.Name"
                                :value="itemChild.Code" />
                        </el-select>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-input v-model="item.ExpressCode" placeholder="输入快递单号"></el-input>
                    </el-col>
                    <el-col :span="1">
                        <el-icon v-if="index > 0" :size="18" style="position: relative; top: 5px; left: 2px"
                            @click="delExpressesBtn(index)">
                            <CloseBold />
                        </el-icon>
                        <el-icon v-else :size="18" style="position: relative; top: 5px; left: 2px"
                            @click="delExpressesBtn(index)">
                        </el-icon>
                    </el-col>
                </el-row>
            </div>
        </el-form-item>
        <div style="width: 68%; margin: 0 auto" v-if="type == 'single'">
            <el-row>
                <el-col :span="24">
                    <el-button style="width: 100%" class="button2" @click="addExpressesBtn">添 加</el-button>
                </el-col>
            </el-row>
        </div>
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
    AddOrderExpress
} from "@/api/order.js";
import {
    GetDictionaryDetailList,
} from "@/api/common.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    orderId: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "all",
    },
    detailsIds: {
        type: Array,
        default: () => [],
    },
});
// 从属性中解构
const { visible } = toRefs(props);
const textareaRemark = ref("");
const btnLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};
const Expresses = ref([{
    ExpressType: "",
    ExpressCode: "",
}]);
const expressList = ref([

]);
const onSubmit = async () => {
    if (textareaRemark.value == "") {
        ElMessage.error('请输入备注');
        return;
    }
    btnLoading.value = true;
    let ids = [];
    if (props.type == 'single') {
        //只有单独发货的时候需要处理ids
        props.detailsIds.forEach(item => {
            ids.push(item.OrderDetailId);
        });
    }
    let res = await AddOrderExpress({
        OrderDetailIds: ids,
        OrderDetailGoodsIds: [],
        Expresses: Expresses.value,
        OrderId: props.orderId,
        Remark: textareaRemark.value,
    });
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success('操作成功');
        emit("CloseVisible", 'save');
    } else {
        ElMessage.error(res.Message);
    }
};
const addExpressesBtn = () => {
    Expresses.value.push({
        ExpressType: "",
        ExpressCode: "",
    });
};
const delExpressesBtn = (Index) => {
    if (Index == 0) {
        return;
    }
    Expresses.value.forEach((row, index) => {
        if (Index == index) {
            Expresses.value.splice(index, 1);
        }
    });
};
const GetDictionaryDetailListApi = async () => {
    let res = await GetDictionaryDetailList({
        DictionaryCode: 'express_type'
    });
    if (res.Code == 200) {
        expressList.value = res.DataMap;
    }
}

// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (dialogVisible.value) {
            textareaRemark.value = "";
            Expresses.value = [{
                ExpressType: "",
                ExpressCode: "",
            }]
            GetDictionaryDetailListApi();
        }
    }
);
</script>
