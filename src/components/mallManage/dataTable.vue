<!-- 上架与审核组件 -->
<template>
    <el-table :data="tableData" ref="elTableRef" border class="table" v-loading="tableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" :selectable="rowSelectable" width="55" />
        <el-table-column label="类型" align="center" width="100">
            <template #default="scope">
                <p>{{ scope.row.Goods.GoodsTypeDesc }}</p>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品图片" width="160">
            <template #default="scope">
                <img :src="scope.row.Goods.ListImg" style="width: 120px" />
            </template>
        </el-table-column>
        <el-table-column align="left" label="商品信息">
            <template #default="scope">
                <p v-if="scope.row.Goods.BrandId > 0">{{ scope.row.Goods.BrandName }}</p>
                <p>编码：{{ scope.row.Goods.GoodsCode }}</p>
                <p v-if="scope.row.Goods.GoodsBarcode">
                    条码：{{ scope.row.Goods.GoodsBarcode }}
                </p>
                <el-link :underline="false" @click="handleEdit(scope.row.Goods.GoodsId, 'View')" style="color: #f56c6c">
                    名称：{{ scope.row.Goods.GoodsTitle }}</el-link>
                <p v-if="scope.row.Goods.GoodsType == '1'">
                    关联的券：{{
                        scope.row.Goods.TicketTemplate.TicketTemplateCode +
                        "-" +
                        scope.row.Goods.TicketTemplate.TicketTemplateTitle
                    }}
                </p>
                <p v-if="scope.row.Goods.SkuCount > 0">含有sku</p>
                <p><span v-if="scope.row.Goods.GoodsStatus == 0">停用</span> <span
                        v-if="scope.row.Goods.GoodsStatus == 1">正常</span></p>
            </template>
        </el-table-column>
        <el-table-column label="库存" align="left" width="100">
            <template #default="scope">
                <p v-if="scope.row.Goods.TotalQty > 0">库存：{{ scope.row.Goods.TotalQty }}</p>
                <p v-if="scope.row.Goods.SoldQty > 0">已售：{{ scope.row.Goods.SoldQty }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="" align="left" label="商品价格(元)" width="190">
            <template #default="scope">
                <p>
                    原价：{{ (scope.row.Goods.OrgPrice / 100).toFixed(2) }}
                </p>
                <p>
                    零售价：{{ (scope.row.Goods.SellPrice / 100).toFixed(2) }}
                </p>
                <p v-if="scope.row.Goods.WholesalePrice > 0">
                    批发价：满{{ scope.row.Goods.WholesaleBeginQty }}件,每件{{
                        (scope.row.Goods.WholesalePrice / 100).toFixed(2)
                    }}
                </p>
            </template>
        </el-table-column>

        <el-table-column prop="" align="left" label="商城">
            <template #default="scope">
                <p v-if="pageCode == 'launch'">{{ scope.row.UnitName }}</p>
                <p>{{ scope.row.MallStatusDesc }}</p>
                <p>
                    原价：{{ (scope.row.Price.OrgPrice / 100).toFixed(2) }}
                </p>
                <p>
                    零售价：{{ (scope.row.Price.SellPrice / 100).toFixed(2) }}
                </p>
                <p v-if="scope.row.Price.WholesalePrice > 0">
                    批发价：满{{ scope.row.Price.WholesaleBeginQty }}件,每件{{
                        (scope.row.Price.WholesalePrice / 100).toFixed(2)
                    }}
                </p>
                <div v-if="scope.row.Categories.length > 0" style="display: flex;flex-wrap: wrap;">
                    分类：<p v-for="(item, index) in scope.row.Categories" :key="index" style="margin-left: 6px;">
                        <span>{{ item.Code + "-" +
                            item.PathName }}</span>
                    </p>
                </div>
                <p v-if="scope.row.MallStatus == 10">
                    {{ `/pages/productDetail/index_new?UnitId=${scope.row.UnitId}&id=${scope.row.Goods.GoodsId}` }}</p>

            </template>
        </el-table-column>
        <el-table-column v-if="pageCode == 'review'" align="center" label="创建信息" width="180">
            <template #default="scope">
                <p>{{ scope.row.Goods.CreateUnitName }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="BillStatusDesc" align="center" label="操作" width="160">
            <template #default="scope">
                <div class="button-mgl">
                    <el-button
                        v-if="pageCode == 'launch' && loginUser.UnitId != scope.row.UnitId && scope.row.MallStatus == -1"
                        class="button-op-edit" size="small" @click="approvalOrShelvesClick(scope.row, 'ApplyOnline')">上架
                    </el-button>
                    <!-- 我自己的商城，可以随时对上架的商品进行下架 -->
                    <el-button v-if="scope.row.MallStatus == 0 || scope.row.MallStatus == 10" class="button-op-edit"
                        size="small" @click="approvalOrShelvesClick(scope.row, 'Offline')">下架
                    </el-button>
                    <el-button
                        v-if="pageCode == 'launch' && loginUser.UnitId != scope.row.UnitId && scope.row.MallStatus == -1"
                        class="button-op-edit" size="small"
                        @click="setGoodsPrice(scope.row.Goods.GoodsId, scope.row.UnitId)">设置
                    </el-button>
                    <!-- <el-button v-if="pageCode == 'review'&& scope.row.MallStatus == 0" class="button-op-edit" size="small"
                        @click="approveClick(scope.row.UnitId)">审核
                    </el-button> -->
                    <el-button v-if="scope.row.Goods.SkuCount > 0" class="button-op-view" size="small"
                        @click="SkuDetail(scope.row.Goods.GoodsId, scope.row.UnitId)">规格
                    </el-button>
                </div>

            </template></el-table-column>
    </el-table>
    <goods-price @CloseVisible="ClosePriceVisible" :GoodsID="GoodsID" :CreateUnitId="goodsUnitId" :SkuID="SkuID"
        :GoodsVisible="modifyGoodsPriceModal"></goods-price>
</template>
<script setup>
import common from "@/utils/common.js";
import { useRouter } from "vue-router";
const router = useRouter();
import { ref, reactive, watch } from "vue";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
import { ElMessage, ElMessageBox } from "element-plus";
import GoodsPrice from "@/components/Modal/GoodsPrice.vue";
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
    //页面类型，launch上架，review审核
    pageCode: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(["OpBtn", "approvalOrShelves"]);

const elTableRef = ref();
const selectedRows = ref([]);
////////////////////////////////////////
//设置当前商品价格
const GoodsID = ref('');
const SkuID = ref('');
const goodsUnitId = ref('');
const modifyGoodsPriceModal = ref(false);
const setGoodsPrice = (goodsId, unitId) => {
    GoodsID.value = goodsId;
    goodsUnitId.value = unitId;
    modifyGoodsPriceModal.value = true;
}
const ClosePriceVisible = () => {
    modifyGoodsPriceModal.value = false;
    emit("OpBtn", "");
};
//编辑
const handleEdit = (ID, type) => {
    common.ClosePageTag("售卖详情");
    router.push({
        path: "/selling_goods_info",
        query: {
            Type: "View",
            ID: ID,
        },
    });
};
//规格
const SkuDetail = (GoodsId, unitId) => {
    common.ClosePageTag("规格");
    router.push({
        path: "/sku",
        query: {
            ID: GoodsId,
            UnitID: unitId, //type==1 礼牛，type==2，福彩
            type: "public",//上架商品页面跳转，能修改商城价格
        },
    });
};
const approvalOrShelvesClick = (row, type) => {
    emit("approvalOrShelves", { row: row, type: type });
};
// 监听勾选变化
const handleSelectionChange = (rows) => {

    selectedRows.value = rows;
};
// 暴露给父组件的全选方法
const selectAll = (rows = props.tableData) => {
    // 清空选择
    elTableRef.value?.clearSelection?.();
    // 批量勾选
    rows.forEach((row) => {
        elTableRef.value?.toggleRowSelection?.(row, true);
    });
};
const rowSelectable = (row) => {
    if (props.pageCode === 'launch') {
        // 根据业务调整可选条件
        return true;
    }
    if (props.pageCode === 'review') {
        // 根据业务调整可选条件
        return row.MallStatus === 0;
    }
    return true;
};
// 如需获取当前已选
const getSelected = () => selectedRows.value;
defineExpose({
    selectAll,
    getSelected
});
////////////////////////////////////////
</script>
