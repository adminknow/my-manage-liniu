<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <!-- 关键词搜索 -->
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入编码/名称/条码/品牌"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 状态选择 -->
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                style="width: 100%"
                v-model="query.search.mall_status"
                placeholder="请选择状态"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option
                  label="待审核"
                  value="0"
                  v-if="query.search.mall_unit_id == 1"
                >
                </el-option>
                <el-option label="上架中" value="10"> </el-option>
                <el-option label="未上架" value="-1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 券商选择 -->
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.create_unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入券商名称"
                :remote-method="remoteMethod"
                remote-show-suffix
                :loading="SelLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in UnitData"
                  :key="index"
                  :label="`${item.UnitCode}-${item.UnitName}`"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" v-else>
              <el-select
                clearable
                v-model="query.search.goods_type"
                placeholder="请选择类型"
                style="width: 100%"
              >
                <el-option label="普通商品" value="2" />
                <el-option label="组合装商品" value="3" />
                <el-option label="电子券商品" value="1" />
                <el-option label="虚拟商品" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 主要按钮组 -->
          <el-col :span="7">
            <div class="button-mgl">
              <el-button
                v-if="canSetCategories"
                class="button2 button-float"
                round
                @click="batchAddCategoryBtn()"
                >批量设置分类
              </el-button>
              <el-button
                v-if="canApproveGoods"
                class="button2 button-float"
                round
                @click="BatchApproveBtn"
                >批量审核
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="BatchOfflineBtn()"
                >批量下架
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="BatchApplyOnlineBtn()"
                >批量上架
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.has_sku"
                placeholder="有无SKU"
              >
                <el-option label="有" value="1"> </el-option>
                <el-option label="无" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.goods_status"
                placeholder="商品状态"
              >
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                clearable
                v-model="query.search.goods_type"
                placeholder="请选择类型"
                style="width: 100%"
              >
                <el-option label="普通商品" value="2" />
                <el-option label="组合装商品" value="3" />
                <el-option label="电子券商品" value="1" />
                <el-option label="虚拟商品" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="2">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut"
                >导&nbsp;&nbsp;出
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        prop="GoodsTypeDesc"
        label="类型"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="商品信息">
        <template #default="scope">
          <p v-if="scope.row.BrandName">{{ scope.row.BrandName }}</p>
          <p>编码：{{ scope.row.GoodsCode }}</p>
          <p v-if="scope.row.GoodsBarcode">
            条码：{{ scope.row.GoodsBarcode }}
          </p>
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.GoodsId, 'View')"
            style="color: #f56c6c"
          >
            名称：{{ scope.row.GoodsTitle }}</el-link
          >
          <p v-if="scope.row.GoodsType == '1'">
            关联的券：{{
              scope.row.TicketTemplate.TicketTemplateCode +
              "-" +
              scope.row.TicketTemplate.TicketTemplateTitle
            }}
          </p>
          <div v-for="(item, index) in scope.row.Malls" :key="index">
            <div v-if="item.UnitId == 1 && query.search.mall_unit_id == 1">
              <p v-if="item.Categories && item.Categories.length > 0">
                分类：<span
                  v-for="(item, index) in item.Categories"
                  :key="index"
                  >{{ item.Code + "-" + item.PathName }},</span
                >
              </p>
            </div>
            <div v-if="item.UnitId == 2 && query.search.mall_unit_id == 2">
              <p v-if="item.Categories && item.Categories.length > 0">
                分类：<span
                  v-for="(item, index) in item.Categories"
                  :key="index"
                  >{{ item.Code + "-" + item.PathName }},</span
                >
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="scope">
          <p>库存：{{ scope.row.TotalQty }}</p>
          <p>已售：{{ scope.row.SoldQty }}</p>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" align="center" width="100">
        <template #default="scope">
          <p v-if="scope.row.GoodsStatus == 0">停用</p>
          <p v-if="scope.row.GoodsStatus == 1">正常</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="80">
        <template #default="scope">
          <p v-if="scope.row.Index.CompositeIndex > 0">
            <span style="font-size: 10px; color: #f56c6c"></span
            >{{ scope.row.Index.CompositeIndex }}
          </p>
        </template></el-table-column
      >
      <el-table-column
        prop=""
        align="left"
        label="价格(元)"
        width="190"
        v-if="query.search.mall_unit_id == 1"
      >
        <template #default="scope">
          <div v-for="(item, index) in scope.row.Malls" :key="index">
            <div v-if="item.UnitId == 1">
              <p v-if="item.Price && item.Price.OrgPrice > 0">
                原价：{{ (item.Price.OrgPrice / 100).toFixed(2) }}
              </p>
              <p v-if="item.Price && item.Price.SellPrice > 0">
                零售价：{{ (item.Price.SellPrice / 100).toFixed(2) }}
              </p>
              <p v-if="item.Price && item.Price.WholesalePrice > 0">
                批发价：满{{ item.Price.WholesaleBeginQty }}件,每件{{
                  (item.Price.WholesalePrice / 100).toFixed(2)
                }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        align="left"
        label="价格(元)"
        width="190"
        v-if="query.search.mall_unit_id == 2"
      >
        <template #default="scope">
          <div v-for="(item, index) in scope.row.Malls" :key="index">
            <div v-if="item.UnitId == 2">
              <p v-if="item.Price && item.Price.OrgPrice > 0">
                原价：{{ (item.Price.OrgPrice / 100).toFixed(2) }}
              </p>
              <p v-if="item.Price && item.Price.SellPrice > 0">
                零售价：{{ (item.Price.SellPrice / 100).toFixed(2) }}
              </p>
              <p v-if="item.Price && item.Price.WholesalePrice > 0">
                批发价：满{{ item.Price.WholesaleBeginQty }}件,每件{{
                  (item.Price.WholesalePrice / 100).toFixed(2)
                }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="query.search.mall_unit_id == 1"
        prop=""
        label="状态"
        align="center"
        width="100"
      >
        <template #default="scope">
          <div v-if="scope.row.Malls.length >= 2">
            <div v-for="(item, index) in scope.row.Malls" :key="index">
              <div v-if="item.UnitId == 1">
                <p v-if="item.MallStatus == 0">待审核</p>
                <p v-if="item.MallStatus == -1">未上架</p>
                <p v-if="item.MallStatus == 10">上架中</p>
              </div>
            </div>
          </div>
          <p v-else>未上架</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="query.search.mall_unit_id == 2"
        prop=""
        label="状态"
        align="center"
        width="100"
      >
        <template #default="scope">
          <div v-if="scope.row.Malls.length >= 2">
            <div v-for="(item, index) in scope.row.Malls" :key="index">
              <div v-if="item.UnitId == 2">
                <p v-if="item.MallStatus == 0">待审核</p>
                <p v-if="item.MallStatus == -1">未上架</p>
                <p v-if="item.MallStatus == 10">上架中</p>
              </div>
            </div>
          </div>
          <p v-else>未上架</p>
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="券商" width="180">
        <template #default="scope">
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-del"
              size="small"
              v-if="
                (scope.row.MallStatus == -1 &&
                  (loginUser.UnitId == 1 || loginUser.UnitId == 2)) ||
                scope.row.CreateUnitId == loginUser.UnitId
              "
              @click="approvalOrShelvesClick(scope.row, 'ApplyOnline')"
              >上架
            </el-button>
            <el-button
              class="button-op-view"
              size="small"
              v-if="
                (scope.row.MallStatus == 10 &&
                  (loginUser.UnitId == 1 || loginUser.UnitId == 2)) ||
                scope.row.CreateUnitId == loginUser.UnitId
              "
              @click="approvalOrShelvesClick(scope.row, 'Offline')"
              >下架
            </el-button>
            <!-- 福彩和券商可以有设置按钮 -->
            <el-button
              v-if="loginUser.UnitId != 1"
              class="button-op-view"
              size="small"
              @click="setGoodsPrice(scope.row.GoodsId)"
              >设置
            </el-button>
            <!-- 只有平台的可以操作排序 -->
            <el-button
              v-if="
                loginUser.UnitId == 1 ||
                (loginUser.UnitId == 2 && query.search.mall_unit_id == 2)
              "
              class="button-op-view"
              size="small"
              @click="ModifyGoodsIndexClick(scope.row.GoodsId)"
              >排序
            </el-button>
            <el-button
              v-if="scope.row.GoodsPropertyCount > 0"
              class="button-op-view"
              size="small"
              @click="SkuDetail(scope.row.GoodsId)"
              >规格
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>

    <!-- 商品申请上架公域商城 -->
    <el-dialog
      title="批量商品分类"
      v-model="applicationVisible"
      width="38%"
      :show-close="false"
    >
      <div style="width:100%;height: 18px;"></div>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="商品分类" style="position: relative">
              <el-tree-select
                v-model="GoodsCategoriesValue"
                :data="GoodsCategoriesList"
                multiple
                show-checkbox
                :render-after-expand="false"
                style="width: 100%"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="applicationLoading"
            @click="ApplyOnlineMallGoodsBtn"
            >确 定</el-button
          >
          <el-button class="button2" @click="applicationVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>

    <GoodsPrice
      @CloseVisible="ClosePriceVisible"
      :GoodsID="GoodsID"
      :CreateUnitId="CreateUnitId"
      :SkuID="SkuID"
      :GoodsVisible="modifyGoodsPriceModal"
    ></GoodsPrice>
    <GoodsSort
      @CloseSortModal="CloseSortModal"
      :GoodsID="GoodsID"
      :MallUnitId="query.search.mall_unit_id"
      :GoodsSortModal="ModifyModal"
      :sortValue="sortValue"
    ></GoodsSort>
    <GoodsApprove
      @CloseApproveModal="CloseApproveModal"
      :GoodsIDs="GoodsIDs"
      :ApproveUnitId="query.search.mall_unit_id"
      :ApproveType="ApproveType"
      :GoodsApproveModal="GoodsApproveModal"
      :ApproveModalType="ApproveModalType"
    ></GoodsApprove>
  </div>
</template>
<script setup>
import GoodsPrice from "@/components/Modal/GoodsPrice.vue";
import GoodsApprove from "@/components/Modal/GoodsApprove.vue";
import GoodsSort from "@/components/Modal/GoodsSort.vue";
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchUnites, HasRightes } from "@/api/index.js";
import {
  SearchMallGoodses,
  BatchAddCategoryOfGoods,
  GetPublicGoodsCategoryList,
} from "@/api/goods.js";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
////////////////////////////////////////////////////////////////
// 判断当前用户是否可以审核商品
const canApproveGoods = computed(() => {
  return (
    (query.search.mall_unit_id == 1 && loginUser.UnitId == 1) ||
    (query.search.mall_unit_id == 2 && loginUser.UnitId == 2)
  );
});

// 判断当前用户是否可以设置分类
const canSetCategories = computed(() => {
  return (
    (query.search.mall_unit_id == 1 && loginUser.UnitId != 1) ||
    (query.search.mall_unit_id == 2 && loginUser.UnitId == 2)
  );
});
////////////////////////////////////////////////////////////////
//商品列表
const query = reactive({
  search: {
    search_keyword: "",
    create_unit_id: "",
    mall_status: "10",
    mall_unit_id: "",
    has_sku: "",
    goods_status: "",
    goods_type: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchMallGoodses({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }
    pageTotal.value = res.DataMap.ToalCount;
  }
};
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
////////////////////////////////////////////////////////////////
//权限控制
const IsRight = ref(false);
const BoolRight = async () => {
  let arr = ["edit_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goods;
  }
};

////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await SearchUnites({
      SearchCondition: {
        search_keyword: SearchQuery,
        unit_type: 2,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      UnitData.value = res.DataMap.Data ? res.DataMap.Data : [];
    }
  } else {
    UnitData.value = [];
  }
};
////////////////////////////////////////////////////////////////
//规格
const SkuDetail = (GoodsId) => {
  common.ClosePageTag("规格");
  router.push({
    path: "/sku",
    query: {
      ID: GoodsId,
      UnitID: query.search.mall_unit_id, //type==1 礼牛，type==2，福彩
      type: "public",
    },
  });
};
//修改商品价格
let modifyGoodsPriceModal = ref(false);
let SkuID = ref("");
let GoodsID = ref("");
let CreateUnitId = ref("");
const setGoodsPrice = (goodsID) => {
  GoodsID.value = goodsID;
  CreateUnitId.value = query.search.mall_unit_id;
  modifyGoodsPriceModal.value = true;
};
const ClosePriceVisible = (value) => {
  if (value == 1) {
    handleSearch();
  }
  modifyGoodsPriceModal.value = false;
};
//排序
let ModifyModal = ref(false);
let sortValue = ref("");
const ModifyGoodsIndexClick = (GoodsIDValue) => {
  GoodsID.value = GoodsIDValue;
  tableData.value.forEach((row) => {
    if (row.GoodsId == GoodsIDValue) {
      sortValue.value = row.Index.CompositeIndex;
    }
  });
  ModifyModal.value = true;
};
const CloseSortModal = (value) => {
  if (value != 1) {
    handleSearch();
  }
  ModifyModal.value = false;
};

//单独下架与上架
let GoodsIDs = ref([]);
const multipleTable = ref(null);
let GoodsApproveModal = ref(false);
let ApproveType = ref("");
let ApproveModalType = ref(""); //putAway
const approvalOrShelvesClick = async (PostRow, type) => {
  ApproveModalType.value = "putAway";
  multipleSelection.value.forEach((row) => {
    //取消所有选中
    multipleTable.value.toggleRowSelection(row, false);
  });
  multipleSelection.value = [];
  //把当前的选中
  multipleTable.value.toggleRowSelection(PostRow, true);
  GoodsIDs.value = []; //先把数据清空
  GoodsIDs.value.push(PostRow.GoodsId);
  if (type == "ApplyOnline") {
    //上架
    GoodsApproveModal.value = true;
    ApproveType.value = "ApplyOnline";
  } else {
    //下架
    GoodsApproveModal.value = true;
    ApproveType.value = "Offline";
  }
};
const CloseApproveModal = (type) => {
  GoodsApproveModal.value = false;
  if (type != "cancel") {
    handleSearch();
  }
};
//批量审批
const BatchApproveBtn = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  //审批
  GoodsIDs.value = []; //先把数据清空
  multipleSelection.value.forEach((row) => {
    GoodsIDs.value.push(row.GoodsId);
  });
  GoodsApproveModal.value = true;
  ApproveModalType.value = "";
  ApproveType.value = "ExamineApprove";
};
//批量上架
const BatchApplyOnlineBtn = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  //上架
  GoodsIDs.value = []; //先把数据清空
  multipleSelection.value.forEach((row) => {
    GoodsIDs.value.push(row.GoodsId);
  });
  GoodsApproveModal.value = true;
  ApproveModalType.value = "putAway";
  ApproveType.value = "ApplyOnline";
};
//批量下架
const BatchOfflineBtn = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  //上架
  GoodsIDs.value = []; //先把数据清空
  multipleSelection.value.forEach((row) => {
    GoodsIDs.value.push(row.GoodsId);
  });
  GoodsApproveModal.value = true;
  ApproveModalType.value = "putAway";
  ApproveType.value = "Offline";
};
//批量分类
const applicationVisible = ref(false); //申请上架弹框
const applicationLoading = ref(false);
const GoodsCategoriesList = ref([]);
const GoodsCategoriesValue = ref([]);
const batchAddCategoryBtn = async () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  applicationVisible.value = true;
};
//保存商品分类
const ApplyOnlineMallGoodsBtn = async () => {
  applicationLoading.value = true;
  let list = [];
  GoodsCategoriesValue.value.forEach((row) => {
    list.push({
      Id: row,
    });
  });
  let GoodsIds = [];
  multipleSelection.value.forEach((row) => {
    GoodsIds.push(row.GoodsId);
  });
  let res = await BatchAddCategoryOfGoods({
    MallUnitId: query.search.mall_unit_id,
    GoodsCategories: list,
    DeleteOldCategory: true,
    GoodsIds: GoodsIds,
  });
  applicationLoading.value = false;
  if (res.Code == 200) {
    applicationVisible.value = false;
    GoodsCategoriesValue.value = [];
    ElMessage.success("操作成功");
    handleSearch();
  } else {
    ElMessage.error(res.Message);
    return;
  }
};
// 获取分类下拉数据
const GetGoodsCategoryListApi = async () => {
  try {
    const unitId = query.search.mall_unit_id;
    // 显示加载状态
    tableLoading.value = true;

    // 简化API调用 - 使用单一API调用来根据unitId获取数据
    const res = await GetPublicGoodsCategoryList({ UnitId: unitId });

    if (res.Code !== 200) {
      ElMessage.error(res.Message || "获取商品分类失败");
      GoodsCategoriesList.value = [];
      return;
    }

    // 构建分类树
    const categoryTree = buildCategoryTree(res.DataMap);
    GoodsCategoriesList.value = categoryTree;
  } catch (error) {
    console.error("获取商品分类出错:", error);
    ElMessage.error("获取商品分类失败，请稍后重试");
    GoodsCategoriesList.value = [];
  } finally {
    tableLoading.value = false;
  }
};
// 将分类数据转换为树形结构
const buildCategoryTree = (categoriesData) => {
  if (!categoriesData || !Array.isArray(categoriesData)) {
    return [];
  }

  return categoriesData.map((category) => {
    // 构建一级分类节点(大类)
    const firstLevelNode = {
      value: category.GoodsCategoryId,
      label: category.GoodsCategoryName,
      children: [],
    };

    // 处理二级分类(中类)
    if (
      category.SubGoodsCategories &&
      Array.isArray(category.SubGoodsCategories)
    ) {
      firstLevelNode.children = category.SubGoodsCategories.map(
        (subCategory) => {
          // 构建二级分类节点
          const secondLevelNode = {
            value: subCategory.GoodsCategoryId,
            label: subCategory.GoodsCategoryName,
            children: [],
          };

          // 处理三级分类(小类)
          if (
            subCategory.SubGoodsCategories &&
            Array.isArray(subCategory.SubGoodsCategories)
          ) {
            secondLevelNode.children = subCategory.SubGoodsCategories.map(
              (thirdCategory) => ({
                value: thirdCategory.GoodsCategoryId,
                label: thirdCategory.GoodsCategoryName,
              })
            );
          }

          return secondLevelNode;
        }
      );
    }

    return firstLevelNode;
  });
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
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// 商城状态常量
const MALL_STATUS = {
  PENDING: 0, // 待审核
  ONLINE: 10, // 上架中
  OFFLINE: -1, // 未上架
};

// 商品状态常量
const GOODS_STATUS = {
  DISABLED: 0, // 停用
  NORMAL: 1, // 正常
};

// 格式化日期，确保月份和日期是两位数
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 格式化价格，将分转为元并保留两位小数
const formatPrice = (price) => {
  return (price / 100).toFixed(2);
};

// 处理商品数据，为导出准备数据
const processGoodsData = (goodsList, mallUnitId) => {
  return goodsList.map((row) => {
    const processedRow = { ...row };

    // 处理兑换券商品
    if (row.GoodsTypeDesc === "兑换券商品") {
      processedRow.ticketDesc = `${row.TicketTemplate.TicketTemplateCode}-${row.TicketTemplate.TicketTemplateTitle}`;
    }

    // 处理商城相关数据
    if (row.Malls && row.Malls.length > 0) {
      for (const el of row.Malls) {
        if (el.UnitId == mallUnitId) {
          // 处理分类信息
          processedRow.CategoriesDesc = "";
          if (el.Categories) {
            processedRow.CategoriesDesc = el.Categories.map(
              (cat) => cat.PathName
            ).join(",");
          }

          // 处理价格信息
          if (el.Price) {
            processedRow.OrgPriceDesc = formatPrice(el.Price.OrgPrice);
            processedRow.SellPriceDesc = formatPrice(el.Price.SellPrice);

            // 处理批发价信息
            processedRow.WholesaleBeginQtyDesc = "";
            if (el.Price.WholesaleBeginQty > 0) {
              processedRow.WholesaleBeginQtyDesc = `满${
                el.Price.WholesaleBeginQty
              }件,每件${formatPrice(el.Price.WholesalePrice)}`;
            }
          }

          // 处理商城状态
          processedRow.MallStatusDesc = "";
          switch (el.MallStatus) {
            case MALL_STATUS.PENDING:
              processedRow.MallStatusDesc = "待审核";
              break;
            case MALL_STATUS.ONLINE:
              processedRow.MallStatusDesc = "上架中";
              break;
            case MALL_STATUS.OFFLINE:
              processedRow.MallStatusDesc = "未上架";
              break;
          }

          break;
        }
      }
    }

    // 处理商品排序和状态
    processedRow.CompositeIndexDesc = row.Index.CompositeIndex;

    switch (row.GoodsStatus) {
      case GOODS_STATUS.DISABLED:
        processedRow.GoodsStatusDesc = "停用";
        break;
      case GOODS_STATUS.NORMAL:
        processedRow.GoodsStatusDesc = "正常";
        break;
    }

    return processedRow;
  });
};

// 导出Excel
const exportToExcel = async (data, mallUnitId) => {
  try {
    const currentDate = formatDate(new Date());
    const fileName =
      mallUnitId == 1
        ? `礼牛商城商品数据导出${currentDate}`
        : `福采商城商品数据导出${currentDate}`;

    const tHeader = [
      "类型",
      "品牌",
      "编码",
      "名称",
      "条码",
      "关联的券",
      "分类",
      "库存数量",
      "已售数量",
      "排序",
      "原价(元)",
      "零售价(元)",
      "批发价(元)",
      "商城状态",
      "商品状态",
      "创建单位",
      "创建时间",
    ];

    const filterVal = [
      "GoodsTypeDesc",
      "BrandName",
      "GoodsCode",
      "GoodsTitle",
      "GoodsBarcode",
      "ticketDesc",
      "CategoriesDesc",
      "TotalQty",
      "SoldQty",
      "CompositeIndexDesc",
      "OrgPriceDesc",
      "SellPriceDesc",
      "WholesaleBeginQtyDesc",
      "MallStatusDesc",
      "GoodsStatusDesc",
      "CreateUnitName",
      "CreateTime",
    ];

    const exportData = formatJson(filterVal, data);

    const excel = await import("../../vendor/Export2Excel");
    excel.export_json_to_excel({
      header: tHeader,
      data: exportData,
      filename: fileName,
      autoWidth: true,
    });

    return true;
  } catch (error) {
    console.error("导出Excel失败:", error);
    ElMessage.error("导出失败，请稍后重试");
    return false;
  }
};

// 导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      try {
        tableLoading.value = true;
        // 1. 获取数据
        const res = await SearchMallGoodses({
          PageStartRow: 0,
          PageRowCount: 100000,
          NoPage: true,
          SearchCondition: query.search,
        });

        if (res.Code != 200) {
          ElMessage.error(res.Message || "获取数据失败");
          return;
        }

        // 2. 处理数据
        const processedData = processGoodsData(
          res.DataMap.Data,
          query.search.mall_unit_id
        );

        // 3. 导出Excel
        await exportToExcel(processedData, query.search.mall_unit_id);
      } catch (error) {
        console.error("导出过程出错:", error);
        ElMessage.error("导出失败，请稍后重试");
      } finally {
        tableLoading.value = false;
      }
    })
    .catch(() => {
      // 用户取消，不做任何处理
    });
};

const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
////////////////////////////////////////////////////////////////
const init = () => {
  //列表查询
  if (router.currentRoute.value.query.type) {
    //type==1 礼牛，type==2，福彩
    query.search.mall_unit_id = router.currentRoute.value.query.type;
    getData();
    //审批权限控制
    BoolRight();
    GetGoodsCategoryListApi();
  }
};
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    // GroupID.value = data.query.type;
    if (data.query.type) {
      query.search.mall_unit_id = data.query.type;
      getData();
    }
  }
);
</script>
<style scoped></style>
