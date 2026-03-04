<!-- 我的商城申请组件 -->
<template>
    <el-dialog :title="desc" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false" class="evaluate-dialog">
        <div style="width:100%;height: 18px;"></div>
        <el-form :model="applyForm" label-width="120px">
            <el-form-item :label="mallTitle">
                <el-select clearable filterable v-model="applyForm.unitId" placeholder="请选择券商" style="width:80%">
                    <el-option v-for="item in MallUnitList" :key="item.UnitId" :label="item.UnitName"
                        :value="item.UnitId" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p v-if="opType == 'activate'">开 通</p>
                    <p v-else>申 请</p>
                </el-button>
                <el-button class="button2" @click="handleClose(2)">关 闭</el-button>
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
import { ApplyOnlineMall, GetMallUnitList, OnlineMyMall, GetTicketBrokerUnitList } from "@/api/index.js";
// 定义组件属性
const props = defineProps({
    Visible: Boolean,
    desc: {
        type: String,
        default: "",
    },
    opType: {
        type: String,
        default: "",
    },
});
// 从属性中解构，这行代码的作用是将组件接收到的属性解构为独立的响应式引用，以便在 JS 逻辑中更方便
const { Visible, desc, opType } = toRefs(props);
const mallTitle = computed(() => opType.value == 'activate' ? "供应商" : "商城");
const btnLoading = ref(false);
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
        handleClose(1);
    } else {
        ElMessage({
            message: res.Message,
            type: 'error',
            duration: 2000
        });
    }
}
const OnlineMyMallApi = async () => {
    let res = await OnlineMyMall({
        UnitId: applyForm.unitId
    })
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage({
            message: '开通成功',
            type: 'success',
            duration: 2000
        });
        handleClose(1);
    } else {
        ElMessage({
            message: res.Message,
            type: 'error',
            duration: 2000
        });
    }
}
const MallUnitList = ref([]);
const GetMallUnitListApi = async () => {
    let res = await GetMallUnitList({
        SearchCondition: { can_apply: "1", },
    })
    if (res.Code == 200) {
        MallUnitList.value = res.DataMap;
    }
}
const GetUnitListAPi = async () => {
    let res = await GetTicketBrokerUnitList({
        SearchCondition: {
            unit_status: 1,
        },
    });
    if (res.Code == 200) {
        MallUnitList.value = res.DataMap;
    }
};
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};
const applyForm = reactive({
    unitId: ""
})
const onSubmit = () => {
    if (!applyForm.unitId) {
        ElMessage({
            message: '请选择商城',
            type: 'warning',
            duration: 2000
        });
        return;
    }
    btnLoading.value = true;
    if (opType.value === "apply") {
        ApplyOnlineMallApi()
    } else if (opType.value === "activate") {
        OnlineMyMallApi();
    }

}


// 监听弹窗显示状态;
watch(
    () => props.Visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (opType.value == 'activate') {
            GetUnitListAPi();
        } else {
            GetMallUnitListApi();
        }
    }
);
</script>
