<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.goods_code" clearable placeholder="请输入商品编码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.goods_title" clearable placeholder="请输入商品名称">
              </el-input> </el-form-item></el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.return_type" placeholder="返还类型">
                <el-option label="按固定金额" value="1"> </el-option>
                <el-option label="按售价的比例" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()">
                <el-icon>
                  <DocumentAdd />
                </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;出&nbsp;&nbsp;
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-select v-model="query.search.unit_id" filterable remote reserve-keyword placeholder="请输入供应商名称、编码"
                :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading" style="width: 100%" clearable>
                <el-option v-for="(item, index) in UnitData" :key="index"
                  :label="item.Unit.UnitCode + '-' + item.Unit.UnitName" :value="item.UnitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable filterable v-model="query.search.mall_unit_id" placeholder="请选择商城"
                style="width:100%">
                <el-option v-for="item in MallUnitList" :key="item.MallUnitId" :label="item.MallUnit.UnitName"
                  :value="item.MallUnitId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1"> </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column prop="MallUnitName" align="center" label="商城">
      </el-table-column>
      <el-table-column align="center" label="供应商">
        <template #default="scope">
          <p>{{ scope.row.UnitCode + '-' + scope.row.UnitName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="GoodsCode" align="center" label="商品编码" width="160">
      </el-table-column>
      <el-table-column prop="GoodsTitle" align="center" label="商品名称">
      </el-table-column>
      <el-table-column align="center" label="商品售价(元)" width="120">
        <template #default="scope">
          <p>{{ scope.row.GoodsSellPrice / 100 }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="佣金(元)" width="100">
        <template #default="scope">
          <p>{{ scope.row.PromoteAmt }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="SoldQty" align="center" label="已售数量" width="100">
      </el-table-column>
      <el-table-column align="left" label="返回类型">
        <template #default="scope">
          <div v-if="scope.row.ReturnType == 0">
            <p>按售价返还比例：{{ scope.row.ReturnRate }} (%)</p>
          </div>
          <div v-if="scope.row.ReturnType == 1">
            <p>固定返还金额：{{ scope.row.ReturnAmt / 100 }} (元)</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SeachAllPromoteGoodses } from "@/api/promoteApi.js";
import { SearchMyMallSupplies, SearchMyMalls } from "@/api/index.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    goods_code: "",
    goods_title: "",
    unit_id: "",
    mall_unit_id: "",
    return_type: "", //返还类型(0:按售价的比例;1:按固定金额)
    mall_unit_type: "",
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
  let res = await SeachAllPromoteGoodses({
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
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
////////////////////////////////////////////////////////////////////////////////////////////////
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await SeachAllPromoteGoodses({
        PageStartRow: 0,
        PageRowCount: 100000,
        SearchCondition: query.search,
        NoPage: true,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        if (!res.DataMap.Data) {
          ElMessage.error("当前暂无数据");
          return;
        }
        tableData.value = res.DataMap.Data;
        var myDate = new Date();
        myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var time =
          myDate.getFullYear() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          myDate.getDate();

        import("../../vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "商城",
            "供应商",
            "商品编码",
            "商品名称",
            "商品售价(元)",
            "佣金(元)",
            "已售数量",
            "返回类型",
          ];
          const filterVal = [
            "MallUnitName",
            "UnitName",
            "GoodsCode",
            "GoodsTitle",
            "GoodsSellPriceDesc",
            "PromoteAmt",
            "SoldQty",
            "ReturnTypeDesc",
          ];
          res.DataMap.Data.forEach((row) => {
            row.GoodsSellPriceDesc = row.GoodsSellPrice / 100;
            row.ReturnTypeDesc =
              row.ReturnType == 0
                ? "按售价的比例：" + row.ReturnRate + " (%)"
                : "按固定金额：" + row.ReturnAmt / 100 + " (元)";
          });
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "可分销商品导出" + time,
            autoWidth: true,
          });
        });
      }
    })
    .catch(() => { });
};
const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
/////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
const MallUnitList = ref([]);
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await SearchMyMallSupplies({
      SearchCondition: {
        search_keyword: SearchQuery,
        apply_status: 10,//状态
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
const GetMallUnitListApi = async () => {
  let res = await SearchMyMalls({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
    SearchCondition: {
      apply_status: 10,//状态
    },
  })
  if (res.Code == 200) {
    MallUnitList.value = res.DataMap.Data;
  }
}
GetMallUnitListApi();
/////////////////////////////////////////////////////////////////////////////////
const init = async () => {
  query.search.mall_unit_type = router.currentRoute.value.query.type;//0:礼牛网;1:券商私域商城
  getData();
  const loginUser = JSON.parse(Cookie.get("User"));
};
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    if (data.meta.title == "券商可分销商品" || data.meta.title == "可分销商品") {
      query.PageStartRow = 1;
      query.search.mall_unit_type = data.query.type;//0:礼牛网;1:券商私域商城
      getData();
    }
  }
);
</script>

<style scoped>
::v-deep(.dataTable-promoter .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
