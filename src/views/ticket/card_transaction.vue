<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-date-picker
                v-model="query.search.time"
                type="daterange"
                :clearable="false"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.unit_id"
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
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()"
                >导出汇总
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="handleOutDetail()"
                >导出明细</el-button
              >
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
      :data="
        tableData.slice(
          (query.PageStartRow - 1) * query.PageRowCount,
          query.PageStartRow * query.PageRowCount
        )
      "
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column
        v-if="loginUser.UnitType == 1"
        prop="ticket_unit_name"
        align="center"
        label="券商"
      >
      </el-table-column>
      <el-table-column prop="unit_code" align="center" label="门店编码">
      </el-table-column>
      <el-table-column prop="unit_name" align="center" label="门店名称">
      </el-table-column>
      <el-table-column
        prop="trans_date"
        align="center"
        label="交易日期"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="trans_type_desc"
        align="center"
        label="交易类型"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="amt"
        align="center"
        label="交易金额(元)"
        width="120"
      >
        <template #default="scope">
          <p>{{ scope.row.amt }}</p>
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
      ></el-pagination>
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
import {
  SumHandworkTransByUnitAndDate,
  GetHandworkTransDetail,
} from "@/api/vip.js";
import { SearchUnites } from "@/api/index.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    unit_id: "",
    begin_date: "",
    end_date: "",
    time: [],
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const pageTotal = ref(0);
const tableLoading = ref(false);
const tableData = ref([]);
const BillId = ref([]);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.begin_date = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.end_date = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SumHandworkTransByUnitAndDate({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap ? res.DataMap : [];
    tableData.value.forEach((row) => {
      row.amt = (row.amt / 100).toFixed(2);
    });
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

/////////////////////////////////////////////////////////////////////////////////
const init = async () => {
  //一个月
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  query.search.time = [start, end];
  getData();
};
init();
////////////////////////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
//券商
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
/////////////////////////////////////////////////////////////////////////////////
const handleOut = () => {
  ElMessageBox.confirm("确定确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
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
          "券商",
          "门店编码",
          "门店名称",
          "交易日期",
          "交易类型",
          "交易金额(元)",
        ];
        const filterVal = [
          "ticket_unit_name",
          "unit_code",
          "unit_name",
          "trans_date",
          "trans_type_desc",
          "amt",
        ];
        // tableData.value.forEach((row) => {
        //   row.amt = (row.amt / 100).toFixed(2);
        // });
        const data = formatJson(filterVal, tableData.value);
        excel.export_json_to_excel({
          header: tHeader,
          data: data,
          filename: "储值卡交易导出汇总" + time,
          autoWidth: true,
        });
        tableLoading.value = false;
      });
    })
    .catch(() => {});
};

const handleOutDetail = () => {
  ElMessageBox.confirm("确定确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
      let res = await GetHandworkTransDetail({
        SearchCondition: query.search,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        let DataList = res.DataMap;
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
            "券商",
            "门店编码",
            "门店名称",
            "储值卡账户",
            "交易时间",
            "交易类型",
            "开始金额(元)",
            "交易金额(元)",
            "剩余金额(元)",
            "备注",
            "操作人",
          ];
          const filterVal = [
            "ticket_unit_name",
            "unit_code",
            "unit_name",
            "account_alias",
            "trans_time",
            "trans_type_desc",
            "begin_amt",
            "trans_amt",
            "end_amt",
            "trans_desc",
            "create_user_name",
          ];
          DataList.forEach((row) => {
            row.begin_amt = (row.begin_amt / 100).toFixed(2);
            row.end_amt = (row.end_amt / 100).toFixed(2);
            row.trans_amt = (row.trans_amt / 100).toFixed(2);
          });
          const data = formatJson(filterVal, DataList);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "储值卡交易明细导出" + time,
            autoWidth: true,
          });
        });
      }
    })
    .catch(() => {});
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
      if (row.title == "储值卡交易") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "储值卡交易"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
