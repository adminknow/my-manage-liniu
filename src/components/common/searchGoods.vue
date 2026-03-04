<template>
  <el-dialog
    class="product-top"
    title="添加商品"
    v-model="dialogVisibled"
    :show-close="false"
    width="68%"
    :close-on-click-modal="false"
  >
    <div class="">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入编码/名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
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
      height="350"
      :data="
        tableData.slice(
          (query.PageStartRow - 1) * query.PageRowCount,
          query.PageStartRow * query.PageRowCount
        )
      "
      @selection-change="handleSelectionChange"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 80px" />
        </template>
      </el-table-column>

      <el-table-column align="left" label="商品信息">
        <template #default="scope">
          <p v-if="scope.row.BrandName">{{ scope.row.BrandName }}</p>
          <p>编码：{{ scope.row.GoodsCode }}</p>
          <p>名称：{{ scope.row.GoodsTitle }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="价格(元)" width="160">
        <template #default="scope">
          <p>原价：{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
          <p>售价：{{ (scope.row.SellPrice / 100).toFixed(2) }}</p>
          <p>采购价：{{ (scope.row.PurchasePrice / 100).toFixed(2) }}</p>
          <p>进货价：{{ (scope.row.BuyPrice / 100).toFixed(2) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="scope">
          <p>库存：{{ scope.row.TotalQty }}</p>
          <p>已售：{{ scope.row.SoldQty }}</p>
        </template>
      </el-table-column>
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
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="tableData.length"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <el-form-item>
      <el-button class="button1 button-float" @click="confirm">确定</el-button>
      <el-button class="button2 button-float" @click="close">关闭</el-button>
    </el-form-item>
  </el-dialog>
</template>
<script>
import { ref, reactive, watch, defineComponent, computed, nextTick } from "vue";
import { SearchSellGoodses } from "@/api/goods.js";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "searchGoods",
  props: {
    show: Boolean,
  },
  // 注册自定义事件
  emits: ["closeModal", "CheckTableData"],
  setup(props, ctx) {
    const query = reactive({
      search: {
        search_keyword: "",
        create_unit_id: "",
        mall_status: "10",
      },
      PageStartRow: 1,
      PageRowCount: 15,
    });
    const tableLoading = ref(false);
    const tableData = ref([]);
    const SearchSellGoodsesApi = async () => {
      //保存添加的商品
      tableLoading.value = true;
      let res = await SearchSellGoodses({
        PageStartRow: 0,
        PageRowCount: 100000,
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
      }
    };
    const handleSearch = () => {
      SearchSellGoodsesApi();
    };
    SearchSellGoodsesApi();
    const multipleSelection = ref([]);
    const handleSelectionChange = (val) => {
      nextTick(() => {
        multipleSelection.value = val;
      });
    };
    const handleSizeChange = (val) => {
      requestTableData();
    };
    const handlePageChange = (val) => {
      requestTableData();
    };
    const multipleTable = ref(null);
    const requestTableData = () => {
      nextTick(() => {
        if (multipleSelection.value.length > 0) {
          tableData.value.forEach(function (item, i) {
            multipleSelection.value.forEach(function (multItem, j) {
              if (
                tableData.value[i].GoodsId == multipleSelection.value[j].GoodsId
              ) {
                multipleTable.value.toggleRowSelection(
                  tableData.value[i],
                  true
                ); //这步操作是让  页面显示选中的数据
              }
            });
          });
        }
      });
    };
    const confirm = () => {
      //保存添加的商品
      if (multipleSelection.value.length == 0) {
        ElMessage.warning(`请先选择好商品`);
        return;
      }
      ctx.emit("CheckTableData", multipleSelection.value);
    };
    const dialogVisibled = computed(() => {
      return props.show;
    });
    const close = () => {
      ctx.emit("closeModal", false);
    };
    watch(
      () => props.show,
      (newValue, oldValue) => {},
      {
        // 页面加载会先执行一次
        immediate: true,
      }
    );
    return {
      query,
      tableLoading,
      tableData,
      SearchSellGoodsesApi,
      handleSearch,
      handleSelectionChange,
      handleSizeChange,
      handlePageChange,
      requestTableData,
      confirm,
      close,
      dialogVisibled,
    };
  },
});
</script>
