<template>
  <!-- 商品列表弹窗 -->
  <el-dialog title="售卖商品" v-model="GoodsVisible" width="68%" :show-close="false" :close-on-click-modal="false">
    <div style="width:100%;height: 18px;"></div>
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form label-width="1px">
        <el-row>
          <!-- 关键词搜索 -->
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="queryParams.search.search_keyword" clearable placeholder="请输入编码/名称/品牌">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 分类搜索 -->
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-tree-select v-model="queryParams.search.goods_category_id" clearable :data="categoryList"
                check-strictly :render-after-expand="false" style="width: 100%" placeholder="请选择商品分类" />
            </el-form-item>
          </el-col>
          <!-- 商品来源 -->
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="queryParams.search.goods_src" placeholder="请选择商品来源">
                <el-option label="境内" value="0"> </el-option>
                <el-option label="保税" value="1"> </el-option>
              </el-select> </el-form-item></el-col>
          <!-- 查询按钮 -->
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button1 button-float" round @click="handleSearch" :loading="tableLoading">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-select :clearable="true" v-model="queryParams.search.goods_type" placeholder="请选择类型"
                style="width: 100%">
                <el-option label="普通商品" value="2" />
                <el-option label="组合装商品" value="3" />
                <el-option label="电子券商品" value="1" />
                <el-option label="虚拟商品" value="4" />

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select v-model="queryParams.search.create_unit_id" filterable remote reserve-keyword
                placeholder="请输入供应商名称" :remote-method="searchUnits" remote-show-suffix :loading="unitSearchLoading"
                style="width: 100%" clearable>
                <el-option v-for="(item, index) in unitList" :key="index"
                  :label="`${item.Unit.UnitCode}-${item.Unit.UnitName}`" :value="item.UnitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 商品表格 -->
    <el-table height="350" :data="tableData" @selection-change="handleSelectionChange" border class="table"
      v-loading="tableLoading" ref="goodsTableRef" :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header" style="width: 100%">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="{ row }">
          <img :src="row.Goods.ListImg" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="商品信息">
        <template #default="{ row }">
          <p><span>{{ row.Goods.BrandName }}</span> <span>{{ row.Goods.GoodsTypeDesc }}</span> <span
              v-if="row.Goods.SkuCount > 0">有sku</span> <span>{{ row.Goods.GoodsSrc == 0 ? '境内' : '保税' }}</span></p>
          <p>{{ row.Goods.GoodsCode + ' - ' + row.Goods.GoodsTitle }}</p>
          <div v-if="row.Categories.length > 0" style="display: flex;flex-wrap: wrap;">
            分类：<p v-for="(item, index) in row.Categories" :key="index" style="margin-left: 6px;">
              <span>{{ item.Code + "-" +
                item.PathName }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="商城价格(元)" width="160">
        <template #default="{ row }">
          <p>原价：{{ formatPrice(row.Price.OrgPrice) }}</p>
          <p>售价：{{ formatPrice(row.Price.SellPrice) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="{ row }">
          <p>库存：{{ row.Goods.TotalQty }}</p>
          <p>已售：{{ row.Goods.SoldQty }}</p>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="160">
        <template #default="{ row }">
          <p>{{ row.Goods.CreateUnitName }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="queryParams.PageStartRow" v-model:page-size="queryParams.PageRowCount"
        :page-sizes="[15, 50, 100]" :total="pageTotal" @current-change="handlePageChange"
        @size-change="handleSizeChange"></el-pagination>
    </div>
    <!-- 按钮区域 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button1" @click="confirmSelection" :disabled="!hasSelection">确定</el-button>
        <el-button class="button2" @click="closeModal">关 闭</el-button>
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
  nextTick,
  computed,
  onMounted,
} from "vue";

import { SearchGoodMalls, GetGoodsCategoryList } from "@/api/goods.js";
import { SearchMyMallSupplies } from "@/api/index.js";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";

// 组件属性
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsVisible: Boolean,
  QrCodeUrl: String,
  QrTitle: String,
  list: Object,
});
// 从属性中解构
const { GoodsVisible, QrCodeUrl, list } = toRefs(props);
// 用户信息
const loginUser = JSON.parse(Cookie.get("User") || "{}");
// 事件
const emit = defineEmits(["CloseVisible", "ConFirm"]);

// 状态变量
const goodsTableRef = ref(null);
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const selectedGoods = ref([]);
const categoryList = ref([]);

// 查询参数
const queryParams = reactive({
  search: {
    goods_category_id: "",
    search_keyword: "",
    goods_src: "",
    goods_type: "",
    get_my_goods: 1,
    create_unit_id: "",
    goods_status: "1",
    mall_unit_id: loginUser.UnitId,
    mall_status: "10",
    not_get_mall_info: 1, //获取每个商品的商品分类(自有和公域礼牛商城),1、不查
    not_get_property_info: 1, //获取每个商品的规格属性(自有和公域礼牛商城),1、不查
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

// 券商查询相关
const unitSearchLoading = ref(false);
const unitList = ref([]);

const hasSelection = computed(() => {
  return selectedGoods.value.length > 0;
});

// 格式化价格 (分->元)
const formatPrice = (price) => {
  return (price / 100).toFixed(2);
};

// 查询商品数据
const fetchGoodsData = async () => {
  if (tableLoading.value) return; // 防止重复请求
  try {
    tableLoading.value = true;

    // 根据用户类型设置查询条件
    // if (loginUser.UnitType == 1) {
    //   queryParams.search.mall_status = 10;
    // }
    const searchParams = {
      PageStartRow: (queryParams.PageStartRow - 1) * queryParams.PageRowCount,
      PageRowCount: queryParams.PageRowCount,
      SearchCondition: { ...queryParams.search },
      NoPage: true,
    };

    const res = await SearchGoodMalls(searchParams);
    if (res.Code == 200) {
      tableData.value = res.DataMap.Data || [];
      pageTotal.value = res.DataMap.ToalCount || 0;
    } else {
      handleRequestError(res.Msg || "获取商品数据失败");
    }
  } catch (error) {
    handleRequestError("获取商品列表失败", error);
  } finally {
    tableLoading.value = false;
  }
};
// 统一错误处理
const handleRequestError = (message, error = null) => {
  if (error) console.error(message, error);
  ElMessage.error(message);
  tableData.value = [];
  pageTotal.value = 0;
};
// 搜索券商
const searchUnits = async (queryString) => {
  if (!queryString) {
    unitList.value = [];
    return;
  }

  try {
    unitSearchLoading.value = true;
    const res = await SearchMyMallSupplies({
      SearchCondition: {
        search_keyword: queryString,
        apply_status: 10,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });

    if (res.Code == 200) {
      unitList.value = res.DataMap.Data || [];
    } else {
      ElMessage.warning("获取券商列表失败");
      unitList.value = [];
    }
  } catch (error) {
    console.error("搜索券商出错:", error);
    unitList.value = [];
  } finally {
    unitSearchLoading.value = false;
  }
};

// 预加载用于默认值
const preloadUnits = async () => {
  try {
    unitSearchLoading.value = true;
    const res = await SearchMyMallSupplies({
      SearchCondition: { apply_status: 10 },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 50,
    });
    if (res.Code === 200) {
      unitList.value = res.DataMap.Data || [];
      if (!queryParams.search.create_unit_id && unitList.value.length > 0) {
        queryParams.search.create_unit_id = unitList.value[0].UnitId;
      }
    }
  } finally {
    unitSearchLoading.value = false;
  }
};

// 获取商品分类
const fetchCategoryList = async () => {
  try {
    const res = await GetGoodsCategoryList({});
    if (res.Code == 200) {
      categoryList.value = formatCategoryData(res.DataMap);
    } else {
      ElMessage.warning("获取商品分类失败");
      categoryList.value = [];
    }
  } catch (error) {
    console.error("获取商品分类出错:", error);
    categoryList.value = [];
  }
};

// 格式化分类数据为树形结构
const formatCategoryData = (data) => {
  return data.map((category) => ({
    value: category.GoodsCategoryId,
    label: category.GoodsCategoryName,
    children: category.SubGoodsCategories.map((subCategory) => ({
      value: subCategory.GoodsCategoryId,
      label: subCategory.GoodsCategoryName,
      children: subCategory.SubGoodsCategories.map((thirdCategory) => ({
        value: thirdCategory.GoodsCategoryId,
        label: thirdCategory.GoodsCategoryName,
      })),
    })),
  }));
};

// 表格选择变化
const handleSelectionChange = (val) => {
  selectedGoods.value = val.map(item => ({
    GoodsId: item.Goods.GoodsId,
    GoodsTitle: item.Goods.GoodsTitle,
    GoodsCode: item.Goods.GoodsCode,
    CreateUnitName: item.Goods.CreateUnitName,
    ListImg: item.Goods.ListImg,
    OrgPrice: formatPrice(item.Price.OrgPrice),
    SellPrice: formatPrice(item.Price.SellPrice),
    GoodsSubTitle: item.Goods.GoodsSubTitle,
  }));
};

// 确认选择
const confirmSelection = () => {
  if (selectedGoods.value.length === 0) {
    ElMessage.warning("请先选择商品");
    return;
  }

  // 合并已选择的和新选择的商品，并去重
  const existingGoods = list.value.data || [];
  const allSelectedGoods = [...selectedGoods.value, ...existingGoods];

  // 去重处理
  const uniqueGoods = [];
  const goodsIdMap = new Map();

  allSelectedGoods.forEach((item) => {
    if (!goodsIdMap.has(item.GoodsId)) {
      goodsIdMap.set(item.GoodsId, true);
      uniqueGoods.push({
        GoodsId: item.GoodsId,
        GoodsTitle: item.GoodsTitle,
        GoodsCode: item.GoodsCode,
        CreateUnitName: item.CreateUnitName,
        ListImg: item.ListImg,
        OrgPrice: item.OrgPrice,
        SellPrice: item.SellPrice,
        GoodsSubTitle: item.GoodsSubTitle,
      });
    }
  });

  emit("ConFirm", uniqueGoods);
};

// 页码变化
const handlePageChange = (val) => {
  queryParams.PageStartRow = val;
  fetchGoodsData();
};

// 每页条数变化
const handleSizeChange = (val) => {
  queryParams.PageRowCount = val;
  fetchGoodsData();
};

// 处理搜索
const handleSearch = () => {
  queryParams.PageStartRow = 1;
  fetchGoodsData();
};

// 关闭弹窗
const closeModal = () => {
  emit("CloseVisible", false);
};

// 初始化数据
const initData = () => {
  fetchCategoryList();
  // fetchGoodsData();
};

// 监听弹窗显示状态
watch(
  () => props.GoodsVisible,
  (newValue) => {
    if (newValue) {
      selectedGoods.value = [];
      if (loginUser.UnitType == 2) {
        queryParams.search.create_unit_id = loginUser.UnitId;
        preloadUnits();
      }
      initData();
    }
  }
);
// 组件挂载时初始化
onMounted(() => {

});
</script>
<style scoped>
.search-container {
  margin-bottom: 20px;
}
</style>
