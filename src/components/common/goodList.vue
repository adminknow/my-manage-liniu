<!-- 销售商品列表组件 -->
<template>
  <div class="">
    <div class="handle-box" style="padding: 0 0 2px">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入编码/名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select :clearable="false" v-model="query.search.goods_type" placeholder="请选择类型" style="width: 100%">
                <el-option label="普通商品" value="2" />
                <el-option label="组合装商品" value="3" />
                <el-option label="电子券商品" value="1" />
                <el-option label="虚拟商品" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleSel()">&nbsp;&nbsp;确&nbsp;&nbsp;认&nbsp;&nbsp;
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table height="400" @selection-change="multipleCheckTable" :data="tableData" border class="table"
      v-loading="tableLoading" ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header" style="width: 100%">
      <el-table-column type="selection" align="center" width="55" fixed />
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="{ row }">
          <img :src="row.Goods.ListImg" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="商品信息">
        <template #default="{ row }">
          <p v-if="row.Goods.BrandName">{{ row.Goods.BrandName }}</p>
          <p>编码：{{ row.Goods.GoodsCode }}</p>
          <p>名称：{{ row.Goods.GoodsTitle }}</p>
          <p>{{ row.Goods.GoodsTypeDesc }}</p>
          <p>创建单位:{{ row.Goods.CreateUnitName }}</p>

          <div v-if="row.Categories.length > 0" style="display: flex;flex-wrap: wrap;">
            分类：<p v-for="(item, index) in row.Categories" :key="index" style="margin-left: 6px;">
              <span>{{ item.Code + "-" +
                item.PathName }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="价格(元)" width="200">
        <template #default="{ row }">
          <p>原价：{{ formatPrice(row.Goods.OrgPrice) }}</p>
          <p>售价：{{ formatPrice(row.Goods.SellPrice) }}</p>
          <p>商城原价：{{ formatPrice(row.Price.OrgPrice) }}</p>
          <p>商城售价：{{ formatPrice(row.Price.SellPrice) }}</p>
          <p>采购价：{{ formatPrice(row.Goods.PurchasePrice) }}</p>
          <p>平台进货价：{{ formatPrice(row.Goods.BuyPrice) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="{ row }">
          <p>库存：{{ row.Goods.TotalQty }}</p>
          <p>已售：{{ row.Goods.SoldQty }}</p>
        </template>
      </el-table-column>
      <el-table-column v-if="loginUser.UnitType == 1" label="创建信息" align="left" width="160">
        <template #default="{ row }">
          <p>{{ row.Goods.CreateUnitName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="{ row }">
          {{ row.Goods.GoodsStatus === 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { SearchGoodMalls } from "@/api/goods.js";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const props = defineProps({
  //子组件接收父组件传递过来的值
  openModal: Boolean,
});
// //使用父组件传递过来的值
const { openModal, goodID, skuID } = toRefs(props);

watch(
  () => props.openModal,
  (newValue, oldValue) => {
    if (newValue) {
      getData();
    }
  }
);
const emit = defineEmits(["clickChild"]);
const multipleTableData = ref([]);
const query = reactive({
  search: {
    search_keyword: "",
    get_my_goods: 1,
    goods_status: "1",
    mall_status: "10",
    mall_unit_id: loginUser.UnitId,
    not_get_mall_info: 1, //获取每个商品的商品分类(自有和公域礼牛商城),1、不查
    not_get_property_info: 1, //获取每个商品的规格属性(自有和公域礼牛商城),1、不查
    goods_type: "", //商品类型
  },
  PageStartRow: 1,
  PageRowCount: 50,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  if (loginUser.UnitType == 1) {
    //说明当前登录人是礼牛网

  }
  let res = await SearchGoodMalls({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
    NoPage: true,
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
// 格式化价格 (分->元)
const formatPrice = (price) => {
  return (price / 100).toFixed(2);
};
getData();

// 查询操作
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
////////////////////////////////////////////////////////////////
//多选
const multipleCheckTable = (val) => {
  multipleTableData.value = val;
};
////////////////////////////////////////////////////////////////
//确认选择
const handleSel = () => {
  let goodList = [];
  multipleTableData.value.forEach((item) => {
    goodList.push({
      SellPrice: item.Goods.SellPrice,
      OrgPrice: item.Goods.OrgPrice,
      GoodsCode: item.Goods.GoodsCode,
      GoodsTitle: item.Goods.GoodsTitle,
      GoodsId: item.Goods.GoodsId,
    });
  });
  emit("SaveTable", goodList);
};
////////////////////////////////////////////////////////////////
</script>
<style scoped></style>
