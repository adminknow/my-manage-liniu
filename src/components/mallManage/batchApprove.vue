<!-- 我的商城批量操作组件 -->
<template>
    <el-dialog title="批量操作" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false" class="evaluate-dialog">
        <div style="width:100%;height: 18px;"></div>
        <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
            v-model="TextareaRemark">
        </el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" v-if="documentType == 'launch'" :loading="btnLoading"
                    @click="onSubmit('up')">上架</el-button>
                <el-button class="button1" v-if="documentType == 'launch'" :loading="btnLoading"
                    @click="onSubmit('down')">下架</el-button>
                <el-button class="button1" v-if="documentType == 'review'" :loading="btnLoading"
                    @click="approveSubmit('pass')">审批通过</el-button>
                <el-button class="button1" v-if="documentType == 'review'" :loading="btnLoading"
                    @click="approveSubmit('reject')">审批不通过</el-button>
                <el-button class="button2" @click="handleClose">关 闭</el-button>
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
} from "vue";
import { ElMessage } from "element-plus";
import { PassGoodsToMall,RejectGoodsToMall, ApplyOnlineGoodsToMall, OfflineGoodsToMall } from "@/api/goods.js";
// 定义组件属性
const props = defineProps({
    Visible: Boolean,
    ids: Array,
    documentType: String,//当前单据类型 review：审核，launch：上架
});
var msg = "";
var flag = true;
var iCount = 0;
// 从属性中解构
const { Visible, ids, documentType } = toRefs(props);
const btnLoading = ref(false);
const TextareaRemark = ref("");
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
const ApplyOnlineMallApi = async () => {
    let res = await ApplyOnlineMall({
        MallUnitId: applyForm.unitId
    })
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage({
            message: '申请成功',
            type: 'success',
            duration: 2000
        });
        handleClose();
    } else {
        ElMessage({
            message: res.Message,
            type: 'error',
            duration: 2000
        });
    }
}
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = () => {
    emit("CloseVisible", false);
};
const applyForm = reactive({
    unitId: ""
})
const onSubmit = (type) => {
    // 仅处理状态为 0 的数据
    const filtered = (ids.value || []).filter(item => item?.status === -1);
    if (filtered.length === 0) {
        ElMessage.warning("没有可操作的记录");
        return;
    }
    iCount = filtered.length;
    // 上架或下架
    opBatch(filtered.length, filtered, type);
}
//批量审批确认
const approveSubmit = async (type) => {
    const filtered = (ids.value || []).filter(item => item?.status === 0);
    if (filtered.length === 0) {
        ElMessage.warning("没有可操作的记录");
        return;
    }
    //拒绝审批
    iCount = filtered.length;
    opBatch(filtered.length, filtered, type);
};
//递归函数
const opBatch = async (iCount, List, type) => {
    if (flag && iCount > 0) {
        let res = null;
        // 判断 1 是否请求成功 2 是否到达请求次数
        var index = iCount;
        if (type == "up") {
            res = await ApplyOnlineGoodsToMall({
                GoodsId: List[index - 1].GoodsId,
                UnitId: List[index - 1].UnitId,
                Remark: TextareaRemark.value,
            });
        }
        if (type == "down") {
            res = await OfflineGoodsToMall({
                GoodsId: List[index - 1].GoodsId,
                UnitId: List[index - 1].UnitId,
                Remark: TextareaRemark.value,
            });
        }
        if (type == "pass") {
            res = await PassGoodsToMall({
                GoodsId: List[index - 1].GoodsId,
                UnitId: List[index - 1].UnitId,
                Remark: TextareaRemark.value,
            });
        }
        if (type == "Reject") {
            res = await RejectGoodsToMall({
                GoodsId: List[index - 1].GoodsId,
                UnitId: List[index - 1].UnitId,
                Remark: TextareaRemark.value,
            });
        }
        if (res.Code == 200) {
            iCount--; //请求次数 - 1
            msg = res.Message;
            if (iCount > 0) {
                opBatch(iCount, List, type);
            }
        } else {
            flag = true;
            ElMessage.warning(res.Message);
        }
    }
    if (iCount == 0) {
        TextareaRemark.value = "";
        ElMessage.success(msg);
        emit("CloseVisible", "submit");
    }
};
// 监听弹窗显示状态;
watch(
    () => props.Visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (newValue) {
            TextareaRemark.value = "";
        }
    }
);
</script>
