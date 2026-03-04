<!-- 商品分类页面 -->
<template>
    <div class="container">
        <div class="handle-box" style="padding: 12px 0 0">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="商城" label-width="auto">
                            <el-select v-model="selUnitId" filterable placeholder="券商下拉列表" style="width: 240px"
                                @change="handleUnitChange">
                                <el-option v-for="item in selUnitList" :key="item.UnitId" :label="item.UnitName"
                                    :value="item.UnitId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1"></el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button v-if="loginUser.UnitId == selUnitId" class="button2 button-float" round
                                @click="handleAddClassification()">
                                添加分类
                            </el-button>
                            <el-button class="button1 button-float" round @click="handleSearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-row>
            <el-col :span="5">
                <el-row style="padding-bottom: 10px">
                    <el-col class="send-local flex-row items-center" :span="20">分类</el-col>
                </el-row>

                <div v-if='selUnitId' class="left" style="margin: 2px; border: solid 1px white">
                    <el-tree :data="treeData" :props="defaultProps" ref="tree" @node-click="handleNodeClick">
                        <template #default="{ node, data }">
                            <span class="custom-tree-node">
                                <el-popover trigger="hover" v-if="data.SubGoodsCategories.length == 0">
                                    <template #reference>
                                        <span>{{
                                            data.GoodsCategoryCode + "-" + data.GoodsCategoryName
                                        }}</span>
                                    </template>
                                    <template #default>
                                        <el-image style="width: 100px; height: 100px" :src="data.ListImg" fit="fill" />
                                    </template>
                                </el-popover>
                                <span v-else>{{
                                    data.GoodsCategoryCode + "-" + data.GoodsCategoryName
                                }}</span>
                                <el-tooltip style="" v-if="loginUser.UnitId == selUnitId" effect="dark" content="编辑"
                                    placement="top-start">
                                    <span style="position: relative; top: 2px; left: 10px">
                                        <el-icon :size="14" @click.stop="edit(node, data)">
                                            <Edit />
                                        </el-icon>
                                    </span>
                                </el-tooltip>
                                <el-tooltip style="" v-if="loginUser.UnitId == selUnitId" effect="dark" content="删除"
                                    placement="top-start">
                                    <span style="position: relative; top: 2px; left: 20px">
                                        <el-icon :size="14" @click.stop="remove(node, data)">
                                            <Delete />
                                        </el-icon>
                                    </span>
                                </el-tooltip>
                                <el-tooltip style="" v-if="
                                    data.GoodsCategoryStatus == 1 && loginUser.UnitId == selUnitId
                                " effect="dark" content="停用" placement="top-start">
                                    <el-image @click="handleDisable(data.GoodsCategoryId)" style="
                      width: 14px;
                      height: 14px;
                      position: relative;
                      top: 2px;
                      left: 30px;
                      color: #417bd5;
                    " src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/treeDisable.png?v=1"
                                        fit="fit" />
                                </el-tooltip>
                                <el-tooltip style="" v-if="
                                    data.GoodsCategoryStatus == 0 && loginUser.UnitId == selUnitId
                                " effect="dark" content="启用" placement="top-start">
                                    <el-image @click="handleEnable(data.GoodsCategoryId)" style="
                      width: 14px;
                      height: 14px;
                      position: relative;
                      top: 2px;
                      left: 30px;
                      color: #417bd5;
                    " src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/treeEnable.png?v=1" fit="fit" />
                                </el-tooltip>
                            </span>
                        </template>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="19">
                <el-row style="padding-bottom: 10px">
                    <el-col class="send-local flex-row items-center" :span="20">商品 <p
                            style="color: #f56c6c;padding-left: 10px;">{{
                                classificationDesc }}</p> </el-col>
                </el-row>
                <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
                    :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                    style="width: 100%">
                    <el-table-column align="center" label="商品图片" width="100">
                        <template #default="scope">
                            <img :src="scope.row.Goods.ListImg" style="width: 60px" />
                        </template>
                    </el-table-column>
                    <el-table-column align="left" label="商品信息">
                        <template #default="scope">
                            <p>{{ scope.row.Goods.GoodsTypeDesc }} </p>
                            <el-link :underline="false" @click="handleEdit(scope.row.Goods.GoodsId, 'View')"
                                style="color: #f56c6c">
                                {{ scope.row.Goods.GoodsCode + '-' + scope.row.Goods.GoodsTitle }}</el-link>
                            <p>状态：<span v-if="scope.row.Goods.GoodsStatus == 0">停用</span><span
                                    v-if="scope.row.Goods.GoodsStatus == 1">正常</span></p>

                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="left" label="商品价格(元)" width="160">
                        <template #default="scope">
                            <p>原价:{{ (scope.row.Goods.OrgPrice / 100).toFixed(2) }}</p>
                            <p>售价:{{
                                (scope.row.Goods.SellPrice / 100).toFixed(2) }}</p>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="MallStatusDesc" align="center" label="商城状态" width="100">
                    </el-table-column>
                    <el-table-column align="left" label="商城价格(元)" width="160">
                        <template #default="scope">
                            <div>
                                <p>原价:{{ (scope.row.Price.OrgPrice / 100).toFixed(2) }}</p>
                                <p>售价:{{
                                    (scope.row.Price.SellPrice / 100).toFixed(2) }}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" align="left" label="创建信息" width="180">
                        <template #default="scope">
                            <p>{{ scope.row.Goods.CreateUnitName }}</p>
                            <p>{{ scope.row.Goods.CreateTime }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template #default="scope">
                            <div class="button-mgl">
                                <el-button v-if="
                                    scope.row.sort > 0 && canEditCategory && loginUser.UnitId == selUnitId
                                " size="small" class="button-op-del"
                                    @click="handleModalAdTop(scope.row)">上移</el-button>
                                <el-button v-if="
                                    scope.row.sort < tableData.length - 1 &&
                                    canEditCategory &&
                                    loginUser.UnitId == selUnitId
                                " size="small" class="button-op-del"
                                    @click="handleModalAdDown(scope.row)">下移</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="->,total, sizes, prev, pager, next"
                        v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                        :page-sizes="[15, 50, 100]" :total="tableData.length"></el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import {
    GetMallGoodsCategoryList,
    SearchMallGoodsByCategory,
    DeleteGoodsCategory,
    DisableGoodsCategory,
    MoveGoodsInCategory
} from "@/api/goods.js";
import { useRights } from "@/hooks/useRights.js";
import { GetMallUnitList, IsMallOpen } from "@/api/index.js";
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage, ElMessageBox } from "element-plus";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
////////////////////////////////////////////////////////////////////////////////////////////////////

const loginUser = JSON.parse(Cookie.get("User"));
////////////////////////////////////////////////////////////////////////////////////////////////////
const queryGoods = reactive({
    search: {
        mall_unit_id: "",
        goods_category_id: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const selUnitId = ref(loginUser.UnitId);//选中的券商
const selUnitList = ref([]);//券商下拉列表
const selUnitName = ref("");
const classificationDesc = ref("");//分类描述
//左侧分类树节点
let treeData = ref([]);
const defaultProps = {
    children: "SubGoodsCategories",
    label: "GoodsCategoryName",
};

const pageTotal = ref(0);
const tableData = ref([]);
const tableLoading = ref(false);
const query = reactive({
    search: {
        search_keyword: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const GetMallGoodsCategoryListApi = async () => {
    let res = await GetMallGoodsCategoryList({
        UnitId: selUnitId.value,
    })
    if (res.Code == 200) {
        treeData.value = res.DataMap;
    }
}
const GetUnitListApi = async () => {
    let res = await GetMallUnitList({
        SearchCondition: {},
    });
    if (res.Code == 200) {
        selUnitList.value = res.DataMap;
        if (isMall.value) {
            // 循环拿到名称
            for (let i = 0; i < res.DataMap.length; i++) {
                const element = res.DataMap[i];
                if (element.UnitId == selUnitId.value) {
                    selUnitName.value = element.UnitName;
                    break;
                }
            }
        } else {
            if (res.DataMap.length > 0) {
                selUnitId.value = res.DataMap[0].UnitId;
            } else {
                selUnitId.value = "";
            }

        }
        GetMallGoodsCategoryListApi()
    }
};
const handleUnitChange = (value) => {
    selUnitId.value = value;
    for (let i = 0; i < selUnitList.value.length; i++) {
        const element = selUnitList.value[i];
        if (element.UnitId == selUnitId.value) {
            selUnitName.value = element.UnitName;
            break;
        }
    }
    //下拉框改变时，清空表格数据和分类树数据，重新获取分类树数据
    tableData.value = [];
    GetMallGoodsCategoryListApi();
}
////////////////////////////////////////////////////////////////
//查询
const handleSearch = () => {
    query.PageStartRow = 1;
    SearchMallGoodsByCategoryApi();
}
const handleNodeClick = (data) => {
    classificationDesc.value = data.GoodsCategoryCode + '-' + data.GoodsCategoryName;
    queryGoods.search.goods_category_id = data.GoodsCategoryId;
    queryGoods.search.mall_unit_id = selUnitId.value;
    SearchMallGoodsByCategoryApi();
};

//上移下移
const handleModalAdTop = async (key) => {
    MoveGoodsInCategoryApi(key.Goods.GoodsId, queryGoods.search.goods_category_id, true);
};
const handleModalAdDown = async (key) => {
    MoveGoodsInCategoryApi(key.Goods.GoodsId, queryGoods.search.goods_category_id, false);
};
const MoveGoodsInCategoryApi = async (GoodsId, GoodsCategoryId, IsUp) => {
    let res = await MoveGoodsInCategory({
        GoodsId: GoodsId,
        GoodsCategoryId: GoodsCategoryId,
        IsUp: IsUp,
    });
    if (res.Code == 200) {
        handleSearch();
    }
};
const SearchMallGoodsByCategoryApi = async () => {
    tableLoading.value = true;
    let res = await SearchMallGoodsByCategory({
        PageStartRow: (queryGoods.PageStartRow - 1) * queryGoods.PageRowCount,
        PageRowCount: queryGoods.PageRowCount,
        SearchCondition: queryGoods.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap.Data || [];
        tableData.value.forEach((row, index) => {
            row.sort = index;
        });
        pageTotal.value = res.DataMap.ToalCount || 0;
    }
};
const edit = (node, data) => {
    //data.GoodsCategoryId
    common.ClosePageTag("我的分类详情");
    router.push({
        path: "/my_category_info",
        query: {
            Type: "edit",
            mall: 1,
            ID: data.GoodsCategoryId,
        },
    });
};
//编辑
const handleEdit = (ID, type) => {
    common.ClosePageTag("售卖详情");
    router.push({
        path: "/selling_goods_info",
        query: {
            Type: type,
            ID: ID,
        },
    });
};

//停用
const handleDisable = (ID) => {
    ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await DisableGoodsCategory({
            ObjectId: ID,
        });
        if (res.Code == 200) {
            query.PageStartRow = 1;
            getData();
            ElMessage.success("操作成功");
        } else {
            ElMessage.warning(res.Message);
        }
    });
};
//删除
const remove = (node, data) => {
    ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async () => {
            let res = await DeleteGoodsCategory({
                ObjectId: data.GoodsCategoryId,
            });
            if (res.Code == 200) {
                query.PageStartRow = 1;
                getData();
                ElMessage.success("操作成功");
            } else {
                ElMessage.warning(res.Message);
            }
        })
        .catch(() => { });
};
//添加分类
const handleAddClassification = () => {
    common.ClosePageTag("我的分类详情");
    router.push({
        path: "/my_category_info",
        query: {
            Type: "Add",
            mall: 1,
        },
    });
}
//权限控制
const rightCodes = ref(["edit_goodscategory"]);
const { hasRight } = useRights(rightCodes);

// 单个结果
const canEditCategory = computed(() => hasRight("edit_goodscategory"));

// 同时都需要
// const IsRight = computed(() => hasAllRights(["edit_goodscategory","edit_order"]));

// 只要其一
// const AnyRight = computed(() => hasAnyRights(["edit_goodscategory","edit_order"]));

//判断当前券商是否开通了商城
const isMall = ref(false);
const IsMallOpenAPi = async () => {
    let res = await IsMallOpen({
        ObjectId: loginUser.UnitId,
    });
    if (res.Code == 200) {
        isMall.value = res.DataMap;
        GetUnitListApi()
    } else {
        ElMessage.error(res.Message);
    }
}
////////////////////////////////////////////////////////////////
const init = async () => {
    IsMallOpenAPi();


};
init()
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
    () => router.currentRoute.value,
    (data) => {
        if (data.meta.title == "商品分类") {
            init()
        }
    }
);
</script>

<style scoped></style>
