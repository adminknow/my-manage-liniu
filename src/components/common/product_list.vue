<!-- 分页查询兑换商品组件 -->
<template>
  <div class="">
    <el-dialog
      title="兑换商品列表"
      v-model="openModal"
      width="48%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-table
        height="300"
        :data="tableData"
        border
        class="table"
        v-loading="tableLoading"
        ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="40" />
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
        <el-table-column
          prop="GoodsCode"
          align="center"
          label="商品编码"
          width="100"
        ></el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="标题">
        </el-table-column>
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
          prop="GoodsBarcode"
          label="条形码"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="80">
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
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="BtnLoading" @click="selBtn"
            >确 认</el-button
          >
          <el-button class="button2" @click="closeVisible">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { SearchGoodses } from "@/api/goods.js";

const props = defineProps({
  //子组件接收父组件传递过来的值
  openModal: Boolean,
});
// //使用父组件传递过来的值
const { openModal } = toRefs(props);

watch(
  () => props.openModal,
  (newValue, oldValue) => {
    if (newValue) {
      getData();
    }
  }
);
const emit = defineEmits([]);
const multipleSelection = ref([]);
const BtnLoading = ref(false);

const query = reactive({
  search: {},
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchGoodses({
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

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
//确认选择商品
const selBtn = () => {};

////////////////////////////////////////////////////////////////
</script>
<style scoped></style>
