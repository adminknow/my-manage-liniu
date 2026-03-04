<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.promoter_name" clearable placeholder="请输入分销员姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.promoter_vip_cell" clearable placeholder="请输入分销员手机">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker style="width: 100%" v-model="query.search.time" type="daterange" :shortcuts="shortcuts"
                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
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
              <el-input v-model="query.search.order_code" clearable placeholder="请输入订单号">
              </el-input>
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
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable filterable v-model="query.search.unit_id" placeholder="请选择供应商" style="width:100%">
                <el-option v-for="item in UnitList" :key="item.UnitId" :label="item.Unit.UnitName"
                  :value="item.UnitId" />
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
      <el-table-column align="left" label="订单号">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.OrderId)" style="color: #f56c6c">
            {{ scope.row.OrderCode }}</el-link>
          <p>{{ scope.row.AddTime }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="购买信息">
        <template #default="scope">
          <p>下单人姓名：{{ scope.row.OrderVipName }}</p>
          <p v-if="scope.row.OrderVipCell != ''">
            下单人手机：{{ scope.row.OrderVipCell }}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="分销员">
        <template #default="scope">
          <p>姓名：{{ scope.row.PromoterName }}</p>
          <p>手机：{{ scope.row.PormoterVipCell }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="商品">
        <template #default="scope">
          <p>供应商：{{ scope.row.GoodsCreateUnitName }}</p>
          <p>{{ scope.row.GoodsTitle }}</p>
          <p>数量：{{ scope.row.Qty }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="金额" width="200">
        <template #default="scope">
          <p>订单金额：{{ scope.row.Amt / 100 }} (元)</p>
          <p>佣金：{{ scope.row.ReturnAmt / 100 }}</p>
          <p v-if="scope.row.ReturnRate">
            比例：{{ scope.row.ReturnRate }}%
          </p>
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
import { SearchMyMallSupplies, SearchMyMalls } from "@/api/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchPromoterOrderDetails } from "@/api/promoteApi.js";
import { SearchUnites } from "@/api/index.js";
////////////////////////////////////////////////////////////////////////////////////////////////
const shortcuts = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "上个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];
////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    order_code: "",//订单号
    promoter_name: "",
    promoter_vip_cell: "",
    time: [],
    add_date_begin: "",
    add_date_end: "",
    unit_id: "",//供应商
    mall_unit_id: "",//商城
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
  query.search.add_date_begin = "";
  query.search.add_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.add_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.add_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchPromoterOrderDetails({
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

// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
//查看订单详情
const handleEdit = (ID) => {
  common.ClosePageTag("订单详情");
  router.push({
    path: "/order_info",
    query: {
      Type: "",
      ID: ID,
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      query.search.add_date_begin = "";
      query.search.add_date_end = "";
      if (query.search.time) {
        if (query.search.time.length > 0) {
          query.search.add_date_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[0]
          );
          query.search.add_date_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[1]
          );
        }
      }
      let res = await SearchPromoterOrderDetails({
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
            "订单号",
            "下单人姓名",
            "下单人手机",
            "分销员",
            "分销员手机",
            "商品名称",
            "商品数量",
            "订单金额(元)",
            "佣金(元)",
            "比例",
            "券商",
            "下单时间",
          ];
          const filterVal = [
            'MallUnitName',
            "OrderCode",
            "OrderVipName",
            "OrderVipCell",
            "PromoterName",
            "PormoterVipCell",
            "GoodsTitle",
            "Qty",
            "AmtDesc",
            "ReturnAmtDesc",
            "ReturnRate",
            "GoodsCreateUnitName",
            "AddTime",
          ];
          res.DataMap.Data.forEach((row) => {
            row.AmtDesc = row.Amt / 100;
            row.ReturnAmtDesc = row.ReturnAmt / 100;
          });
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "分销订单导出" + time,
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//初始化加载下拉供应商数据
const MallUnitList = ref([]);
const UnitList = ref([]);
const GetUnitListAPi = async () => {
  let res = await SearchMyMallSupplies({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
    SearchCondition: {
      apply_status: 10,//状态
    },
  });
  if (res.Code == 200) {
    UnitList.value = res.DataMap.Data;
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


/////////////////////////////////////////////////////////////////////////////////
const init = () => {
  //一个月
  const end = new Date();
  end.setHours(23, 59, 59);
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  start.setHours(0, 0, 0);
  query.search.time = [start, end];
  query.PageStartRow = 1;
  query.search.mall_unit_type = router.currentRoute.value.query.type;//0:礼牛网;1:券商私域商城
  GetUnitListAPi();
  GetMallUnitListApi();
  getData();
};
init();
/////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    if (data.meta.title == "券商分销订单" || data.meta.title == "分销订单") {
      query.PageStartRow = 1;
      query.search.mall_unit_type = data.query.type;//0:礼牛网;1:券商私域商城
      getData();
    }

  }
);
</script>

<style scoped></style>
