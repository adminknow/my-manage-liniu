<template>
    <el-dialog class="transfer-dialog" v-model="visible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <p>卡券转移</p>
                <div style="width:100%;height: 10px;"></div>
                <p style="font-size: 12px;color: red;">只能转移未激活、未挂起、未销售、未领取、未兑换的券</p>
            </div>
        </template>
        <div style="width:100%;height: 18px;"></div>
        <el-form :model="submitForm" label-width="120px">
            <el-form-item label="券序号">
                <el-row>
                    <el-col :span="10">
                        <el-input v-model="submitForm.FromIndex" number clearable placeholder="请输入券的起始序号">
                        </el-input>
                    </el-col>
                    --
                    <el-col :span="10">
                        <el-input v-model="submitForm.ToIndex" number clearable placeholder="请输入券的结束序号">
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="转移至">
                <el-select style="width:80%" v-model="submitForm.ToTicketTemplateId" filterable remote reserve-keyword
                    placeholder="请输入券模板名称" :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading"
                    clearable>
                    <el-option v-for="(item, index) in TicketTemplateItems" :key="index"
                        :label="item.TicketTemplateTitle" :value="item.TicketTemplateId">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p>确 定</p>
                </el-button>
                <el-button class="button2" @click="handleClose('cancel')">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import Cookie from "js-cookie"
import {
    ref,
    reactive,
    toRefs,
    watch,
} from "vue";
import { ElMessage } from "element-plus";
import {
    GetTicketTemplateList,
    BatchMoveTicketes
} from "@/api/ticket.js";
// Props
const props = defineProps({
    visible: Boolean,
    fromTicketTemplateId: String
})
const btnLoading = ref(false);
// 从属性中解构
const { visible, fromTicketTemplateId } = toRefs(props);
const emit = defineEmits(["CloseVisible"]);
//保存数据
const submitForm = reactive({
    FromTicketTemplateId: fromTicketTemplateId.value,
    ToTicketTemplateId: "",
    FromIndex: 0,//要转移的券的起始序号
    ToIndex: 0,//要转移的券的结束序号

})
const TicketTemplateItems = ref([]);
const remoteMethod = async (query) => {
    if (query) {
        let res = await GetTicketTemplateList({
            SearchCondition: { search_keyword: query },
        });
        if (res.Code === 200) {
            if (res.DataMap.ToalCount == 0) {
                TicketTemplateItems.value = [];
            } else {
                TicketTemplateItems.value = res.DataMap;
            }
        }
    } else {
        TicketTemplateItems.value = [];
    }
};
const onSubmit = async () => {
    btnLoading.value = true;
    let res = await BatchMoveTicketes({
        FromTicketTemplateId: submitForm.FromTicketTemplateId,
        ToTicketTemplateId: submitForm.ToTicketTemplateId,
        FromIndex: submitForm.FromIndex,//要转移的券的起始序号
        ToIndex: submitForm.ToIndex,//要转移的券的结束序号
    })
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success('操作成功')
        emit("CloseVisible", 'save');
    } else {
        ElMessage.error(res.Message)
    }

}
const handleClose = (op) => {
    emit("CloseVisible", op);
}
// Data
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            submitForm.ToTicketTemplateId = "";
            submitForm.FromIndex = 0;//要转移的券的起始序号
            submitForm.ToIndex = 0;//要转移的券的结束序号
        }
    }
);
</script>

<style lang="less">
.transfer-dialog {
    .el-dialog__header {
        padding-bottom: 4px !important;
    }

}
</style>