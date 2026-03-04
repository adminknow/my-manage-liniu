<template>
  <div class="container">
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
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;添加商品
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
    >
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
        label="面值(元)"
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
              @click="handleDel(scope.row.GoodsId)"
              >删除</el-button
            >
            <el-button
              class="button-op-del"
              size="small"
              v-if="scope.$index > 0"
              @click="Move(scope.row.GoodsId, 'up')"
              >上移</el-button
            >
            <el-button
              class="button-op-del"
              size="small"
              v-if="scope.$index < tableGoodsData.length - 1"
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
            <el-col :span="5" :offset="1"> </el-col>
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
        :data="tableGoodsData"
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
        <el-table-column prop="CreateUnitName" align="center" label="创建人">
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
import { ref, reactive, watch, nextTick, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import {
  BatchAddObject,
  BatchRemoveObject,
  MoveObject,
} from "@/api/shopApi.js";
import { SearchSellGoodses } from "@/api/goods.js";

// 路由和状态管理
const router = useRouter();
const store = useStore();
const TagID = ref("");

// 主表格数据和状态
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const query = reactive({
  search: {
    search_keyword: "",
    goods_tag_id: "",
    is_sell: 1,
    not_get_mall_info: 1, //获取每个商品的商品分类(自有和公域礼牛商城),1、不查
    not_get_property_info: 1, //获取每个商品的规格属性(自有和公域礼牛商城),1、不查
    not_get_qty_info: 1, //商品有SKU，则库存和已售统计所有SKU的(自有和公域礼牛商城),1、不查
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

// 商品弹窗数据和状态
const GoodVisible = ref(false);
const tableGoodsLoading = ref(false);
const tableGoodsData = ref([]);
const pageGoodsTotal = ref(0);
const multipleTableRef = ref([]);
const multipleTableGoods = ref(null);
const queryGoods = reactive({
  search: {
    search_keyword: "",
    goods_status: "1",
    not_get_mall_info: 1, //获取每个商品的商品分类(自有和公域礼牛商城),1、不查
    not_get_property_info: 1, //获取每个商品的规格属性(自有和公域礼牛商城),1、不查
    not_get_qty_info: 1, //商品有SKU，则库存和已售统计所有SKU的(自有和公域礼牛商城),1、不查
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

// 主表格数据加载
const getData = async () => {
  try {
    tableLoading.value = true;
    const res = await SearchSellGoodses({
      PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
      PageRowCount: query.PageRowCount,
      SearchCondition: query.search,
    });

    if (res.Code === 200) {
      tableData.value = res.DataMap.Data || [];
      pageTotal.value = res.DataMap.ToalCount;
    } else {
      ElMessage.warning(res.Message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("系统异常，请稍后重试");
  } finally {
    tableLoading.value = false;
  }
};

// 主表格操作方法
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};

const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};

const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
// 商品弹窗操作方法
const handleAdd = () => {
  GoodVisible.value = true;
  queryGoods.PageStartRow = 1;
  getGoodsData();
};

//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: { Type: type, ID: ID },
  });
};

//删除
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    try {
      const res = await BatchRemoveObject({
        TagId: 1,
        ObjectType: "goods",
        ObjectIds: [ID],
      });

      if (res.Code === 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("删除成功");
      } else {
        ElMessage.warning(res.Message || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      ElMessage.error("系统异常，请稍后重试");
    }
  });
};
//启用
const Move = async (ID, Type) => {
  try {
    const res = await MoveObject({
      ObjectId: ID,
      TagId: 1,
      ObjectType: "goods",
      IsUp: Type === "up",
    });

    if (res.Code === 200) {
      query.PageStartRow = 1;
      getData();
      ElMessage.success("移动成功");
    } else {
      ElMessage.warning(res.Message || "移动失败");
    }
  } catch (error) {
    console.error("移动失败:", error);
    ElMessage.error("系统异常，请稍后重试");
  }
};

const handleSearchModal = () => {
  queryGoods.PageStartRow = 1;
  getGoodsData();
};

// 分页导航
const handlePageGoodsChange = (val) => {
  queryGoods.PageStartRow = val;
  getGoodsData();
};
const handleSizeGoodsChange = (val) => {
  queryGoods.PageRowCount = val;
  getGoodsData();
};
// 获取表格数据
const getGoodsData = async () => {
  try {
    tableGoodsLoading.value = true;
    const res = await SearchSellGoodses({
      PageStartRow: (queryGoods.PageStartRow - 1) * queryGoods.PageRowCount,
      PageRowCount: queryGoods.PageRowCount,
      SearchCondition: queryGoods.search,
    });

    if (res.Code === 200) {
      tableGoodsData.value = res.DataMap.Data || [];
      pageGoodsTotal.value = res.DataMap.ToalCount;
    } else {
      ElMessage.warning(res.Message || "获取商品数据失败");
    }
  } catch (error) {
    console.error("获取商品数据失败:", error);
    ElMessage.error("系统异常，请稍后重试");
  } finally {
    tableGoodsLoading.value = false;
  }
};
const handleSelectionChange = (val) => {
  multipleTableRef.value = val;
};
//把选中的商品保存到列表标签
const CheckGoods = async () => {
  if (multipleTableRef.value.length === 0) {
    ElMessage.warning("请至少选择一个商品");
    return;
  }
  try {
    const ObjectIds = multipleTableRef.value.map((row) => row.GoodsId);
    const res = await BatchAddObject({
      TagId: TagID.value,
      ObjectType: "goods",
      ObjectIds: ObjectIds,
    });

    if (res.Code === 200) {
      GoodVisible.value = false;
      ElMessage.success("添加成功");
      handleSearch();
    } else {
      ElMessage.warning(res.Message || "添加失败");
    }
  } catch (error) {
    console.error("添加失败:", error);
    ElMessage.error("系统异常，请稍后重试");
  }
};
////////////////////////////////////////////////////////////////
const Init = async () => {
  if (router.currentRoute.value.query.TagId) {
    TagID.value = router.currentRoute.value.query.TagId;
    query.search.goods_tag_id = TagID.value;
  }
};
onMounted(() => {
  Init();
  getData();
});
// 路由变化监听
watch(
  () => router.currentRoute.value,
  () => {
    const isRenovate = store.state.tags.tagsList.some(
      (row) => row.title === "热卖商品"
    )
      ? 1
      : 0;
    if (
      store.state.tags.pageSaerch.Search === 1 &&
      isRenovate === 1 &&
      store.state.tags.pageSaerch.titlePage === "热卖商品"
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
