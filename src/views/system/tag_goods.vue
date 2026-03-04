<template>
  <div class="container">
    <p>所属标签：{{ TagName }}</p>
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入编码/名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.goods_status"
                placeholder="请选择状态"
              >
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
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
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                v-if="tagType != 'view'"
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;添加商品
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="handleDelAll()"
                >批量删除
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
      @selection-change="handleSelectionChangeMain"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="GoodsCode"
        align="center"
        label="商品编码"
        width="100"
      ></el-table-column>
      <el-table-column prop="GoodsTitle" align="center" label="商品名称">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.GoodsId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.GoodsTitle }}</el-link
          >
        </template>
      </el-table-column>
      <!-- <el-table-column prop="GoodsSubTitle" align="center" label="规格" width="100"></el-table-column> -->
      <el-table-column
        prop="OrgPrice"
        align="center"
        label="价格(元)"
        width="80"
      >
        <template #default="scope">
          {{ (scope.row.OrgPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="GoodsTypeDesc"
        label="类型"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="UnitStatusDesc"
        label="状态"
        align="center"
        width="80"
      >
        <template #default="scope">
          {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="180">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-del"
              size="small"
              v-if="tagType != 'view'"
              @click="handleDel(scope.row.GoodsId)"
              >删除</el-button
            >
            <el-button
              class="button-op-del"
              size="small"
              v-if="scope.$index > 0 && tagType != 'view'"
              @click="Move(scope.row.GoodsId, 'up')"
              >上移</el-button
            >
            <el-button
              class="button-op-del"
              size="small"
              v-if="
                scope.$index < tableGoodsData.length - 1 && tagType != 'view'
              "
              @click="Move(scope.row.GoodsId, 'down')"
              >下移</el-button
            >
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
    <!-- 商品组 -->
    <el-dialog id="goodsModal" title="商品" v-model="GoodVisible" width="60%">
      <div class="handle-box">
        <el-form label-width="1px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="">
                <el-input
                  v-model="queryGoods.search.search_keyword"
                  clearable
                  placeholder="请输入编码/名称"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="">
                <el-select
                  v-model="queryGoods.search.create_unit_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入券商名称"
                  :remote-method="remoteMethod1"
                  remote-show-suffix
                  :loading="SelLoading"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in UnitData"
                    :key="index"
                    :label="item.UnitCode + '-' + item.UnitName"
                    :value="item.UnitId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1"></el-col>
            <el-col :span="6" :offset="1">
              <div class="button-mgl">
                <el-button
                  class="button1 button-float"
                  round
                  @click="handleSearchModal()"
                >
                  <el-icon> <Search /> </el-icon
                  >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        height="400"
        :data="
          tableGoodsData.slice(
            (queryGoods.PageStartRow - 1) * queryGoods.PageRowCount,
            queryGoods.PageStartRow * queryGoods.PageRowCount
          )
        "
        border
        class="table"
        v-loading="tableGoodsLoading"
        ref="multipleTableGoods"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column align="center" label="商品图片" width="160">
          <template #default="scope">
            <img :src="scope.row.ListImg" style="width: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="GoodsCode" align="center" label="编码">
        </el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="主标题">
        </el-table-column>
        <el-table-column prop="CreateUnitName" align="center" label="创建单位">
        </el-table-column>
        <el-table-column align="center" label="状态" width="180">
          <template #default="scope">
            {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
          </template></el-table-column
        >
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="queryGoods.PageStartRow"
          v-model:page-size="queryGoods.PageRowCount"
          :page-sizes="[15, 50, 100]"
          :total="pageGoodsTotal"
          @current-change="handlePageGoodsChange"
          @size-change="handleSizeGoodsChange"
        ></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="CheckGoods">确 定</el-button>
          <el-button class="button2" @click="GoodVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import {
  BatchAddObject,
  BatchRemoveObject,
  MoveObject,
  GetTag,
} from "../../api/shopApi.js";
import { SearchSellGoodses } from "@/api/goods.js";
import { SearchUnites } from "@/api/index.js";
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    goods_tag_id: "",
    create_unit_id: "",
    is_sell: 1,
    not_get_mall_info:1,//获取每个商品的商品分类(自有和公域礼牛商城),1、不查
    not_get_property_info:1,//获取每个商品的规格属性(自有和公域礼牛商城),1、不查
    not_get_qty_info:1,//商品有SKU，则库存和已售统计所有SKU的(自有和公域礼牛商城),1、不查
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
  let res = await SearchSellGoodses({
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

const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//新增商品
const handleAdd = () => {
  GoodVisible.value = true;
  queryGoods.PageStartRow = 1;
  getGoodsData();
};
const handleDelAll = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning(`请先选择数据！`);
    return;
  }
  let ObjectIds = [];
  multipleSelection.value.forEach((row) => {
    ObjectIds.push(row.GoodsId);
  });
  ElMessageBox.confirm("确定要全部删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await BatchRemoveObject({
      TagId: TagID.value,
      ObjectType: "goods",
      ObjectIds: ObjectIds,
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

// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
const multipleSelection = ref([]);
const handleSelectionChangeMain = (val) => {
  multipleSelection.value = val;
};
//删除
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await BatchRemoveObject({
      TagId: TagID.value,
      ObjectType: "goods",
      ObjectIds: [ID],
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
//启用
const Move = async (ID, Type) => {
  let res = await MoveObject({
    ObjectId: ID,
    TagId: TagID.value,
    ObjectType: "goods",
    IsUp: Type == "up" ? true : false,
  });
  if (res.Code == 200) {
    query.PageStartRow = 1;
    getData();
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
const GoodVisible = ref(false);

const handleSearchModal = () => {
  queryGoods.PageStartRow = 1;
  getGoodsData();
};
const queryGoods = reactive({
  search: {
    search_keyword: "",
    create_unit_id: "",
    mall_status: "",
    goods_status: "1",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableGoodsLoading = ref(false);
const tableGoodsData = ref([]);
const pageGoodsTotal = ref(0);
// 分页导航
const handlePageGoodsChange = (val) => {
  queryGoods.PageStartRow = val;
  requestTableData();
};
const handleSizeGoodsChange = (val) => {
  queryGoods.PageRowCount = val;
  requestTableData();
};
// 获取表格数据
const getGoodsData = async () => {
  if (loginUser.UnitName == "礼牛网") {
    queryGoods.search.mall_status = "10";
  }
  let res = await SearchSellGoodses({
    PageStartRow: 0,
    PageRowCount: 100000,
    SearchCondition: queryGoods.search,
    NoPage: true,
  });
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableGoodsData.value = res.DataMap.Data;
    } else {
      tableGoodsData.value = [];
    }
    pageGoodsTotal.value = res.DataMap.ToalCount;
  }
};
const multipleTableRef = ref([]);
const handleSelectionChange = (val) => {
  nextTick(() => {
    multipleTableRef.value = val;
  });
};
//把选中的商品保存到列表标签
const CheckGoods = async () => {
  let ObjectIds = [];
  multipleTableRef.value.forEach((row) => {
    ObjectIds.push(row.GoodsId);
  });
  let res = await BatchAddObject({
    TagId: TagID.value,
    ObjectType: "goods",
    ObjectIds: ObjectIds,
  });
  if (res.Code == 200) {
    GoodVisible.value = false;
    ElMessage.success("操作成功");
    handleSearch();
  } else {
    ElMessage.warning(res.Message);
  }
};

const multipleTableGoods = ref(null);
const requestTableData = () => {
  nextTick(() => {
    if (multipleTableRef.value.length > 0) {
      tableGoodsData.value.forEach(function (item, i) {
        multipleTableRef.value.forEach(function (multItem, j) {
          if (
            tableGoodsData.value[i].GoodsId == multipleTableRef.value[j].GoodsId
          ) {
            multipleTableGoods.value.toggleRowSelection(
              tableGoodsData.value[i],
              true
            ); //这步操作是让  页面显示选中的数据
          }
        });
      });
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////
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

const remoteMethod1 = async (query) => {
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
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const TagID = ref("");
const tagType = ref("");

const TagName = ref("");
const Init = async () => {
  if (router.currentRoute.value.query.tagID) {
    TagID.value = router.currentRoute.value.query.tagID;
    tagType.value = router.currentRoute.value.query.tagType;
    query.search.goods_tag_id = TagID.value;
    getData();
    let res = await GetTag({
      ObjectId: TagID.value,
    });
    if (res.Code == 200) {
      TagName.value = res.DataMap.TagName;
    }
  }
};

Init();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "标签商品") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "标签商品"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
<style>
#goodsModal .el-dialog__body {
  padding-top: 0 !important;
}
</style>
