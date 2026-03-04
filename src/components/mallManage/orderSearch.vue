<!-- 订单搜索组件 -->
<template>
    <div class="handle-box">
        <el-form label-width="1px">
            <!-- 第一行 -->
            <el-row>
                <el-col :span="5">
                    <el-form-item label="">
                        <el-input v-model="localSearch.order_code" clearable placeholder="请输入订单号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1"> <el-form-item label="">
                        <el-date-picker style="width: 100%" v-model="localSearch.time" type="daterange"
                            :shortcuts="shortcuts" range-separator="To" start-placeholder="开始日期"
                            end-placeholder="结束日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-form-item label="">
                        <el-input v-model="localSearch.contact_cell" clearable placeholder="请输入收件人电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                    <div class="button-mgl">
                        <el-button class="button2 button-float" round @click="handleIn()">
                            导入发货
                        </el-button>
                        <el-button class="button2 button-float" round @click="handleOut()">
                            导&nbsp;&nbsp;出
                        </el-button>
                        <el-button class="button1 button-float" round @click="emitSearch()">
                            <el-icon>
                                <Search />
                            </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 第二行（默认显示：券码 / 券商 / 收件人电话） -->
            <el-row>
                <el-col :span="5">
                    <el-form-item label="">
                        <el-input v-model="localSearch.ticket_code" clearable placeholder="请输入券码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-form-item label="">
                        <el-select clearable filterable v-model="localSearch.unit_id" placeholder="请选择供应商"
                            style="width:100%">
                            <el-option v-for="item in UnitList" :key="item.UnitId" :label="item.Unit.UnitName"
                                :value="item.UnitId" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="5" :offset="1">
                    <el-form-item label="">
                        <el-select clearable filterable v-model="localSearch.mall_unit_id" placeholder="请选择商城"
                            style="width:100%">
                            <el-option v-for="item in MallUnitList" :key="item.MallUnitId"
                                :label="item.MallUnit.UnitName" :value="item.MallUnitId" />
                        </el-select>
                        <el-button link style="color: #f56c6c" class="more1-btn" @click="toggleExpand">
                            {{ isExpanded ? "收起" : "更多条件" }}
                            <el-icon style="margin-left: 4px; transition: transform 0.25s" :style="{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                    </el-form-item>

                </el-col>
                <el-col :span="6" :offset="1">
                    <div class="button-mgl">
                        <el-button class="button2 button-float" round @click="handleApprove()" v-if="IsApproveOrder">
                            <el-icon>
                                <DocumentAdd />
                            </el-icon>&nbsp;&nbsp;批量审核
                        </el-button>
                        <el-button class="button2 button-float" round @click="importInvoice()">
                            <el-icon>
                                <DocumentAdd />
                            </el-icon>&nbsp;&nbsp;导入开票
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <!-- 第三行（展开后显示：商品名称和编码 / 发票状态 / openid） -->
            <transition name="expand-fade">
                <div v-show="isExpanded">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="">
                                <el-input v-model="localSearch.goods_name" clearable
                                    placeholder="请输入商品名称或编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1">
                            <el-form-item label="">
                                <el-select clearable style="width: 100%" v-model="localSearch.invoice_status"
                                    placeholder="请选择发票状态">
                                    <el-option label="全部" value=""> </el-option>
                                    <el-option label="待开票" value="0"> </el-option>
                                    <el-option label="开票中" value="1"> </el-option>
                                    <el-option label="已开票" value="10"> </el-option>
                                    <el-option label="不开票" value="-10"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1">
                            <el-form-item label="">
                                <el-input v-model="localSearch.order_id" clearable placeholder="请输入订单ID"></el-input>
                            </el-form-item> </el-col>
                        <!-- <el-col :span="5" :offset="1">
                            <el-form-item label="">
                                <el-input v-model="localSearch.wxxcx_openid" clearable
                                    placeholder="请输入OpenID"></el-input>
                            </el-form-item>
                        </el-col> -->

                    </el-row>
                </div>
            </transition>


        </el-form>
    </div>
    <!-- 开票导入 -->
    <import-invoicing :visible="importInvoicingVisible" @CloseVisible="importInvoicingClose"></import-invoicing>
    <!-- 导入发货 -->
    <import-shipment :visible="importShipmentVisible" @CloseVisible="importShipmentClose"></import-shipment>
</template>

<script setup>
import ImportInvoicing from "@/components/mallManage/order/ImportInvoicing.vue";//开票导入
import ImportShipment from "@/components/mallManage/order/ImportShipment.vue";//导入发货
import { SearchMyMallSupplies, SearchMyMalls } from "@/api/index.js";
import { ref, reactive, watch, computed } from "vue";
import { ElMessage } from "element-plus";

// 日期快捷选项
const shortcuts = [
    {
        text: "上周",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
        },
    },
    {
        text: "上个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
        },
    },
];
/**
 * 使用具名 v-model：v-model:search
 */
const props = defineProps({
    IsApproveOrder: { type: Boolean, default: false }, // 是否显示批量审核按钮
    modelValue: { type: Object, default: () => ({}) }, // 兼容 v-model 默认写法，可写可不写
    search: { type: Object, default: () => ({}) },     // 具名 v-model:search
});
const emit = defineEmits(["update:search", "update:modelValue", "search", 'handleApprove', 'handleOut']);
const handleApprove = () => {
    emit("batchApprove", {});
};
const handleOut = () => {
    emit("handleOut", {});
};
// 本地副本，避免直接改 props
const localSearch = reactive({ ...props.search });

//初始化加载下拉供应商数据
const MallUnitList = ref([]);
const UnitList = ref([]);
const GetUnitListAPi = async () => {
    let res = await SearchMyMallSupplies({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: {
        },
    });
    if (res.Code == 200) {
        UnitList.value = res.DataMap.Data;
    }
};
const GetMallUnitListApi = async () => {
    let res = await SearchMyMalls({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: {
        },
    })
    if (res.Code == 200) {
        MallUnitList.value = res.DataMap.Data;
    }
}
GetUnitListAPi();
GetMallUnitListApi();

// 父 -> 子：当父更新 search 时同步到本地
watch(
    () => props.search,
    (val) => Object.assign(localSearch, val || {}),
    { deep: true }
);
// 子 -> 父 实时同步（关键修复）
watch(
    localSearch,
    (val) => {
        emit("update:search", { ...val });
    },
    { deep: true }
);

// 子 -> 父：将变更回写
const syncToParent = () => {
    emit("update:search", { ...localSearch });
    // 若父用了默认 v-model（不带参数）也兼容
    emit("update:modelValue", { ...localSearch });
};

const emitSearch = () => {
    syncToParent();
    emit("search");
};
//导入发货
const importShipmentVisible = ref(false);
const handleIn = () => {
    importShipmentVisible.value = true;
};
const importShipmentClose = (op) => {
    importShipmentVisible.value = false;
    if (op == 'save') {
        emitSearch();
    }

};



//导入开票
const importInvoicingVisible = ref(false);
const importInvoice = () => {
    importInvoicingVisible.value = true;
};
const importInvoicingClose = (op) => {
    importInvoicingVisible.value = false;
    if (op == 'save') {
        emitSearch();
    }

};
const isExpanded = ref(false);
const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};


const reset = () => {
    localSearch.search_keyword = "";
    localSearch.apply_status = "";
    syncToParent();
    emit("search");
};
</script>

<style scoped>
.order-search {
    padding: 10px 0;
}

.more1-btn {
    position: absolute;
    right: -90px;
    z-index: 1;
}
</style>

<style lang="less">
.search-order {
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