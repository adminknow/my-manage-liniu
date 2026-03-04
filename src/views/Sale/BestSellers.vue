<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5"> </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()"
                >导&nbsp;&nbsp;出
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="order_tags">
      <ul>
        <li
          @click="choosetag(index)"
          class="order_tags-li"
          v-for="(item, index) in statusList"
          :class="{
            active: item.active,
          }"
          :key="index"
        >
          <text>{{ item.key }}</text>
        </li>
      </ul>
    </div>
    <div style="width: 100%; height: 10px"></div>
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
      <el-table-column prop="unit_name" align="left" label="券商">
      </el-table-column>
      <el-table-column prop="goods_code" align="left" label="商品编码">
      </el-table-column>
      <el-table-column prop="goods_title" align="left" label="商品名称">
      </el-table-column>
      <el-table-column prop="uv" align="center" label="浏览人数" width="120">
      </el-table-column>
      <el-table-column prop="pv" align="center" label="浏览次数" width="120">
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
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, watch } from "vue";
import { TopSellGoods } from "@/api/index.js";
import { useBestSellersExport } from "@/hooks/use-export.js";
////////////////////////////////////////////////////////////////////////////////////////////////
let statusList = ref([
  {
    value: "1",
    key: "今天",
    active: true,
  },
  {
    value: "2",
    key: "昨天",
    active: false,
  },
  {
    value: "3",
    key: "一周",
    active: false,
  },
  {
    value: "4",
    key: "一个月（31天）",
    active: false,
  },
]);
const query = reactive({
  search: {
    date_type: "1",
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
  let res = await TopSellGoods({
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
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};

const choosetag = (valIndex) => {
  statusList.value.forEach((row) => {
    row.active = false;
  });
  statusList.value[valIndex].active = true;
  query.search.date_type = statusList.value[valIndex].value;
  getData();
};
/////////////////////////////////////////////////////////////////////////////////
const Init = () => {
  getData();
};
Init();
// 使用导出Hook
const { handleExport } = useBestSellersExport();
const handleOut = () => {
  //导出
  handleExport(query, tableLoading);
};
/////////////////////////////////////////////////////////////////////////////////
</script>

<style scoped lang="less">
.order_tags {
  position: relative;
  height: 34px;
  overflow: hidden;
}

.order_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #e9eaec;
}
.order_tags-li.active {
  color: #f56c6c;
  font-weight: 500;
  background-color: #fff;
  border-bottom: 1px solid #fff;
  border-top: 2px solid #f56c6c !important;
  border-left: 1px solid #e9eaec;
  border-right: 1px solid #e9eaec;
}

.order_tags-li.Highlight {
  color: #f56c6c;
  font-weight: 500;
  background-color: #fff;
  border-bottom: 1px solid #fff;
  border-top: 2px solid #e9eaec;
  border-left: 1px solid #e9eaec;
  border-right: 1px solid #e9eaec;
}

.order_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.order_tags-li {
  float: left;
  font-size: 14px;
  width: 140px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  height: 33px;
  line-height: 26px;
  background: #fff;
  vertical-align: middle;
  color: #666;
}
</style>
