<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
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
              <el-select clearable style="width: 100%" v-model="query.search.is_promote" placeholder="是否开启分销">
                <el-option label="开启" value="1"> </el-option>
                <el-option label="关闭" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker style="width: 100%" v-model="query.search.time" type="daterange" range-separator="To"
                start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
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
              <el-select clearable style="width: 100%" v-model="query.search.promote_type" placeholder="分销类型">
                <el-option label="所有商品都参加" value="0"> </el-option>
                <el-option label="指定商品参加" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.default_return_type" placeholder="返还类型">
                <el-option label="按固定金额" value="1"> </el-option>
                <el-option label="按售价的比例" value="0"> </el-option>
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
      <el-table-column align="center" label="是否开启分销" width="120">
        <template #default="scope">
          <p>{{ scope.row.IsPromote == 1 ? "开启" : "关闭" }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分销类型">
        <template #default="scope">
          <div v-if="scope.row.PromoteType == 0">
            <p>所有商品都参加</p>
          </div>
          <div v-if="scope.row.PromoteType == 1">
            <p>指定商品参加</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="PromoteGoodsCount" align="center" label="指定商品数量" width="160">
      </el-table-column>
      <el-table-column align="left" label="返回类型">
        <template #default="scope">
          <div v-if="scope.row.PromoteType == 0">
            <div v-if="scope.row.DefaultReturnType == 0">
              <p>按售价返还比例：{{ scope.row.DefaultReturnRate }} (%)</p>
            </div>
            <div v-if="scope.row.DefaultReturnType == 1">
              <p>固定返还金额：{{ scope.row.DefaultReturnAmt / 100 }} (元)</p>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column prop="EndTime" align="center" label="结束时间" width="160">
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
import { SeachAllPromoteUnites } from "@/api/promoteApi.js";
import { SearchMyMallSupplies, SearchMyMalls } from "@/api/index.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    is_promote: "",
    unit_id: "",
    mall_unit_id: "",
    default_return_type: "", //返还类型(0:按售价的比例;1:按固定金额)
    time: [],
    end_time_begin: "",
    end_time_end: "",
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
  query.search.end_time_begin = "";
  query.search.end_time_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.end_time_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.end_time_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SeachAllPromoteUnites({
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
const loginUser = JSON.parse(Cookie.get("User"));
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

/////////////////////////////////////////////////////////////////////////////////
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
//初始化加载下拉供应商数据
const MallUnitList = ref([]);
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
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      query.search.end_time_begin = "";
      query.search.end_time_end = "";
      if (query.search.time) {
        if (query.search.time.length > 0) {
          query.search.end_time_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[0]
          );
          query.search.end_time_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[1]
          );
        }
      }
      let res = await SeachAllPromoteUnites({
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
            "商品编码",
            "商品名称",
            "商品售价(元)",
            "佣金(元)",
            "已售数量",
            "返回类型",
            "商户编码",
            "商户名称",
          ];
          const filterVal = [
            "GoodsCode",
            "GoodsTitle",
            "GoodsSellPriceDesc",
            "PromoteAmt",
            "SoldQty",
            "GoodsTitle",
            "Qty",
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
            filename: "分销商配置" + time,
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
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "客户关系") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "客户关系"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
