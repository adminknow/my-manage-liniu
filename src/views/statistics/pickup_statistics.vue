<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px" v-if="loginUser.UnitType == 33">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.ticket_template_code"
                clearable
                placeholder="请输入券批次号"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.ticket_template_title"
                clearable
                placeholder="请输入券名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                style="width: 100%"
                v-model="query.search.time"
                :clearable="false"
                :shortcuts="shortcuts"
                type="daterange"
                range-separator="To"
                start-placeholder="提货开始日期"
                end-placeholder="提货结束日期"
              />
            </el-form-item>
          </el-col>
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
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="1px" v-else>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.ticket_template_code"
                clearable
                placeholder="请输入券批次号"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.ticket_template_title"
                clearable
                placeholder="请输入券名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.ticket_unit_id"
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
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.deliver_unit_id"
                placeholder="请选择提货点"
              >
                <el-option
                  v-for="item in List"
                  :key="item.UnitId"
                  :label="item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                style="width: 100%"
                v-model="query.search.time"
                :clearable="false"
                :shortcuts="shortcuts"
                type="daterange"
                range-separator="To"
                start-placeholder="提货开始日期"
                end-placeholder="提货结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1"> </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="tableData.length > 0">数量汇总：{{ ticketNumTotal }}</div>
    <div v-if="tableData.length > 0" style="width: 100%; height: 10px"></div>
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
        prop="pickup_date"
        align="center"
        label="提货日期"
        width="260"
      ></el-table-column>
      <el-table-column align="center" label="提货点">
        <template #default="scope">
          <p>{{ scope.row.unit_code + " - " + scope.row.unit_name }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="ticket_template_code"
        align="center"
        label="券批次号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="ticket_template_title"
        align="center"
        label="券名称"
      ></el-table-column>
      <el-table-column
        prop="cnt"
        align="center"
        label="数量"
        width="100"
      ></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[50, 100]"
        :total="pageTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { StatPickupDeliverOrderByPickup } from "@/api/order.js";
import { SearchUnites } from "../../api/index.js";

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
  {
    text: "三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const router = useRouter();
const query = reactive({
  search: {
    deliver_unit_id: "",
    ticket_template_code: "",
    ticket_template_title: "",
    pickup_date_begin: "",
    pickup_date_end: "",
    ticket_unit_id: "",
    time: [],
    search_keyword: "",
  },
  PageStartRow: 1,
  PageRowCount: 50,
});

const ticketNumTotal = ref("");
const tableLoading = ref(false);
const tableData = ref([]);
const List = ref([]); //兑换点List
const pageTotal = ref(0);
const init = async () => {
  //一个月
  const end = new Date();
  end.setHours(23, 59, 59);
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  start.setHours(0, 0, 0);
  query.search.time = [start, end];
};
init();
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.pickup_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.pickup_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    } else {
      query.search.pickup_date_begin = "";
      query.search.pickup_date_end = "";
    }
  }
  let res = await StatPickupDeliverOrderByPickup({
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap) {
      tableData.value = res.DataMap;
    } else {
      tableData.value = [];
    }
    pageTotal.value = res.DataMap.length;
    let num = 0;
    if (res.DataMap.length > 0) {
      res.DataMap.forEach((row) => {
        num = num + row.cnt;
      });
      ticketNumTotal.value = num;
    }
  } else {
    ElMessage.warning(res.Message);
  }
};
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//新增商品
const handleAdd = () => {
  router.push({
    path: "/commodity_info",
  });
};
// // 分页导航
// const handlePageChange = (val) => {
//     query.PageStartRow = val;
//     requestTableData();
// };
// const handleSizeChange = (val) => {
//     query.PageRowCount = val;
//     requestTableData();
// };
//获取兑换点下拉列表
const getPointList = async () => {
  let search = {
    unit_type: "33",
  };
  let res = await SearchUnites({
    PageStartRow: 0,
    PageRowCount: 100000,
    SearchCondition: search,
    NoPage: true,
  });
  if (res.Code == 200) {
    List.value = res.DataMap.Data;
  }
};
getPointList();
const handleOut = () => {
  //导出
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      if (query.search.time) {
        if (query.search.time.length > 0) {
          query.search.pickup_date_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[0]
          );
          query.search.pickup_date_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[1]
          );
        } else {
          query.search.pickup_date_begin = "";
          query.search.pickup_date_end = "";
        }
      }
      tableLoading.value = true;
      let res = await StatPickupDeliverOrderByPickup({
        SearchCondition: query.search,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        if (!res.DataMap) {
          ElMessage.error("当前暂无数据");
          return;
        }
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
            "提货日期",
            "提货点编码",
            "提货点名称",
            "券批次号",
            "券名称",
            "数量",
          ];
          const filterVal = [
            "pickup_date",
            "unit_code",
            "unit_name",
            "ticket_template_code",
            "ticket_template_title",
            "cnt",
          ];
          const data = formatJson(filterVal, res.DataMap);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "已提货统计数据导出-" + time,
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
</script>

<style scoped></style>
