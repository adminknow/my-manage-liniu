<!-- 订单导入开票组件 -->
<template>
    <el-dialog title="导入开票" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <div class="invoicing-order">
            <el-row>
                <el-col :span="24">
                    <el-steps class="handlerSteps" :active="activeInvoiceIndex" align-center>
                        <el-step title="上传文件" />
                        <el-step title="数据预览" />
                        <el-step title="导入完成" />
                    </el-steps>
                </el-col>
            </el-row>
            <el-row v-if="activeInvoiceIndex == 0">
                <div v-if="!isInvoiceDataError">
                    <el-col :span="24">
                        <div class="out-bg">
                            <el-row>
                                <el-col :span="4">
                                    <img src="../../../assets/imgs/order_out1.png"
                                        style="width: 100px; height: 100px" />
                                </el-col>
                                <el-col :span="19" :offset="1">
                                    <div class="out-bg1 flex-col justify-center">
                                        <div>填写导入数据信息</div>
                                        <div>
                                            请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，多运单号'，'分开
                                        </div>
                                        <div>
                                            <el-link :underline="false"
                                                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/开票导入模板.xlsx"
                                                style="color: #f56c6c">
                                                下载模板</el-link>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="out-bg">
                            <el-row>
                                <el-col :span="4">
                                    <img src="../../../assets/imgs/order_out2.png"
                                        style="width: 100px; height: 100px" />
                                </el-col>
                                <el-col :span="19" :offset="1">
                                    <div class="out-bg1 flex-col justify-center">
                                        <div>上传填好的信息表</div>
                                        <div>
                                            文件后缀名必须为xls 或xlsx
                                            （即Excel格式）和以制表符分隔的文本文件，文件大小不得大于10M，最多支持导入3000条数据
                                        </div>
                                        <div class="file-detail">
                                            <el-upload v-model:file-list="fileInvoiceList" :limit="1"
                                                :on-remove="handleInvoiceRemove" class="file-order-uploader" action="#"
                                                :http-request="SuccessInvoiceFile" :auto-upload="true"
                                                :before-upload="beforeInvoiceAvatarUpload">
                                                <el-link :underline="false" style="color: #f56c6c">
                                                    上传文件</el-link>
                                            </el-upload>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </div>
                <el-col v-else :span="24">
                    <div class="out-error-bg">
                        <el-row>
                            <el-col :span="24">
                                <div class="" style="background-color: #f8f8f8; overflow-y: scroll">
                                    <p>错误信息:</p>
                                    <p v-html="htmlInvoiceValue"></p>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="activeInvoiceIndex == 1">
                <el-table :data="tableModalInvoiceData" border class="table" ref="multipleTable"
                    :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                    <el-table-column prop="OrderCode" align="center" label="订单号">
                    </el-table-column>
                    <el-table-column prop="InvoiceCode" label="发票代码" align="center"></el-table-column>
                    <el-table-column prop="InvoiceNo" label="发票号码" align="center"></el-table-column>
                    <el-table-column prop="InvoiceNo" label="发票号码" align="center"></el-table-column>
                    <el-table-column prop="InvoiceUrl" label="发票下载地址" align="center" width="120"></el-table-column>
                </el-table>
            </el-row>
            <el-row v-if="activeInvoiceIndex == 3">
                <div style="width: 100%; margin: 0 auto">
                    <el-result icon="success" title="导入成功" :sub-title="subTitle">
                    </el-result>
                </div>
            </el-row>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <div v-if="activeInvoiceIndex == 0">
                    <el-button v-if="isInvoiceDataError" class="button1"
                        @click="isInvoiceDataError = false">重新上传</el-button>
                    <el-button class="button1" @click="onNextOneInvoiceBtn">下一步</el-button>
                    <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
                </div>
                <div v-if="activeInvoiceIndex == 1">
                    <el-button class="button1" @click="onNextTwoInvoiceBtn">确认</el-button>
                    <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
                </div>

            </span>
        </template>
        <!-- <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
            </span>
        </template> -->
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
import { GetFileData, Import } from "@/api/imgapi.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
});
// 从属性中解构
const { visible } = toRefs(props);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};


//开票导出
const activeInvoiceIndex = ref(0);
const subTitle = ref("");
const isInvoiceDataError = ref(false);
const tableModalInvoiceData = ref([]);
const fileInvoiceList = ref([]);
const fileInvoiceParam = ref([]);
const htmlInvoiceValue = ref("");
const SuccessInvoiceFile = async (param) => {
    fileInvoiceParam.value = param;
};
const handleInvoiceRemove = async (param) => {
    fileInvoiceParam.value = {};
};
const beforeInvoiceAvatarUpload = async (file) => {
    const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/plain"; // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (!isExcel) {
        ElMessage.warning(
            `当前只能上传xls或xlsx类型文件（即Excel表格)和以制表符分隔的文本文件`
        );
    }
    return isExcel;
};
//导入文件第一步
const onNextOneInvoiceBtn = async () => {
    if (fileInvoiceParam.value.file) {
        let fd = new FormData();
        fd.append("file", fileInvoiceParam.value.file); //传文件
        fd.append("DataType", "OrderInvoice"); //传文件
        let res = await GetFileData(fd);
        if (res.Code == 200) {
            activeInvoiceIndex.value = 1;
            tableModalInvoiceData.value = res.DataMap;
        } else {
            isInvoiceDataError.value = true;
            htmlInvoiceValue.value = res.Message.replaceAll("\r\n", "</br>");
            // ElMessage.warning(`${res.Message}`)
        }
    } else {
        ElMessage.warning(`请先上传文件`);
    }
};
//导入文件第二步
const onNextTwoInvoiceBtn = async () => {
    let fd = new FormData();
    fd.append("file", fileInvoiceParam.value.file); //传文件
    fd.append("DataType", "OrderInvoice"); //传文件
    let res = await Import(fd);
    if (res.Code == 200) {
        activeInvoiceIndex.value = 3;
        subTitle.value = res.DataMap;
        emit("CloseVisible", 'save');
    } else {
        activeInvoiceIndex.value = 0;
        fileInvoiceParam.value = [];
        fileInvoiceList.value = [];
        ElMessage.warning(`${res.Message}`);
    }
};

// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (dialogVisible.value) {
            activeInvoiceIndex.value = 0;
            isInvoiceDataError.value = false;
            tableModalInvoiceData.value = [];
            fileInvoiceList.value = [];
            fileInvoiceParam.value = [];
            htmlInvoiceValue.value = "";
        }
    }
);
</script>
<style lang="less">
.invoicing-order {
    .handlerSteps {
        .el-step__icon {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            font-size: 14px;
        }

        .el-step__title {
            font-size: 14px;
        }

        .el-step__head.is-finish {
            color: #fff;
            border-color: #ff8686;
        }

        .el-step__icon.is-text {
            border-radius: 33%;
        }

        .el-step.is-horizontal .el-step__line {
            top: 9px;
        }

        .is-process .el-step__icon {
            background-color: #ff8686;
            color: #fff;
            border-color: #ff8686;
        }

        .is-finish .el-step__icon {
            background-color: #ff8686;
        }

        .el-step__title.is-finish {
            color: #000;
        }

        .el-step__description.is-finish {
            color: #bbbbbb;
        }

        .el-step__description.is-process {
            color: #bbbbbb;
        }

        .el-step__title is-wait {
            color: #747474;
        }
    }

    .file-detail {
        position: relative;
    }

    .file-order-uploader {
        width: auto;
        height: 20px;
    }

    .file-order-uploader .el-upload {
        width: auto !important;
        height: 20px !important;
        border: none !important;
    }
}
</style>