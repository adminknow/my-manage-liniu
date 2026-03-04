<template>
  <div class="container">
    <!-- 使用查询子组件 -->
    <ticket-transfer-search-form
      v-model="query.search"
      @search="handleSearch"
      @export="handleOut"
      ref="searchFormRef"
    />
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
      <el-table-column
        prop="GiveTypeDesc"
        align="center"
        label="类型"
        width="90"
      ></el-table-column>
      <el-table-column align="left" label="转赠人">
        <template #default="scope">
          <p v-if="scope.row.AccountName && scope.row.Openid">
            {{ scope.row.AccountName + " - " + scope.row.Openid }}
          </p>
          <p>{{ scope.row.VipName + " - " + scope.row.VipCell }}</p>
        </template></el-table-column
      >
      <el-table-column
        prop="GiveTime"
        align="center"
        label="转赠时间"
        width="160"
      ></el-table-column>
      <el-table-column align="left" label="备注">
        <template #default="scope">
          <p>祝福语：{{ scope.row.GiveWish }}</p>
          <p>备注：{{ scope.row.GiveRemark }}</p>
        </template></el-table-column
      >
      <el-table-column
        prop="TicketQty"
        align="center"
        label="卡券数量"
        width="90"
      ></el-table-column>
      <el-table-column align="left" label="转给群时" width="190">
        <template #default="scope">
          <div v-if="scope.row.GiveType == 2">
            <p>每人领取张数：{{ scope.row.EveryoneTakeCount }}</p>
            <p>每人领取概率：{{ scope.row.EveryoneTakeProbability }}</p>
          </div>
        </template></el-table-column
      >
      <el-table-column
        prop="GiveStatusDesc"
        align="center"
        label="状态"
        width="80"
      ></el-table-column>

      <el-table-column width="100" label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              size="small"
              @click="ViewDetail(scope.row.BatchId)"
              >明细
            </el-button>
          </div>
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
    <!-- 交易流水弹出框 -->
    <el-dialog
      class="datatable-ticket"
      title="转赠明细"
      v-model="DetailVisible"
      width="58%"
      :show-close="false"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="券明细">
          <el-table
            :data="
              tableData1.slice(
                (query1.PageStartRow - 1) * query1.PageRowCount,
                query1.PageStartRow * query1.PageRowCount
              )
            "
            border
            class="table"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
            style="width: 100%"
          >
            <el-table-column
              prop="TicketTemplateCode"
              align="center"
              label="批次号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="TicketCode"
              align="center"
              label="券号"
            ></el-table-column>
            <el-table-column
              prop="TicketTemplateTitle"
              align="center"
              label="券名称"
            ></el-table-column>
            <el-table-column
              prop="TakeStatusDesc"
              align="center"
              label="状态"
              width="100"
            ></el-table-column>
            <el-table-column align="center" label="领取时间" width="160">
              <template #default="scope">
                <p v-if="scope.row.TakeTime != '0001-01-01 00:00:00'">
                  {{ scope.row.TakeTime }}
                </p>
              </template>
            </el-table-column>

            <el-table-column
              prop="TakeHisId"
              align="center"
              label="领取ID"
            ></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="query1.PageStartRow"
              v-model:page-size="query1.PageRowCount"
              :page-sizes="[50, 100]"
              :total="tableData1.length"
              @current-change="handle1PageChange"
              @size-change="handle1SizeChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="领取历史">
          <el-table
            :data="
              tableData2.slice(
                (query2.PageStartRow - 1) * query2.PageRowCount,
                query2.PageStartRow * query2.PageRowCount
              )
            "
            border
            class="table"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
            style="width: 100%"
          >
            <el-table-column
              prop="TakeTime"
              align="center"
              label="领取时间"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="TakeHisId"
              align="center"
              label="领取ID"
            ></el-table-column>

            <el-table-column
              prop="TakeOpenid"
              align="center"
              label="Openid"
            ></el-table-column>
            <el-table-column
              prop="TakeVipName"
              align="center"
              label="领取人"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="TakeVipCell"
              align="center"
              label="领取人电话"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="TicketQty"
              align="center"
              label="领取券的张数"
              width="140"
            ></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="query2.PageStartRow"
              v-model:page-size="query2.PageRowCount"
              :page-sizes="[50, 100]"
              :total="tableData2.length"
              @current-change="handle2PageChange"
              @size-change="handle2SizeChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="DetailVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";

import TicketTransferSearchForm from "@/components/vip/TicketTransferSearchForm.vue";
import {
  SearchGiveBatches,
  GetGiveBatchDetails,
  GetGiveBatchTailHises,
} from "@/api/vip.js";

const query = reactive({
  search: {
    openid: "",
    vip_name: "",
    vip_cell: "",
    give_date_begin: "",
    give_date_end: "",
    give_type: "", //类型转赠类型：好友（1）群（2）
    give_status: "", //转赠批次状态:已撤回（-1）,待领取（0）,已领取（1）
    time: [],
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
  query.search.give_date_begin = "";
  query.search.give_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.give_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.give_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchGiveBatches({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
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
const query1 = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
});
const query2 = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
});
const DetailVisible = ref(false);
//临时ID
const BatchId = ref("");
//查询明细
const ViewDetail = (BatchIdValue) => {
  DetailVisible.value = true;
  BatchId.value = BatchIdValue;
  GetDataDetail();
};
const tableData1 = ref([]);
const tableData2 = ref([]);
const GetDataDetail = async () => {
  let res = await GetGiveBatchDetails({
    ObjectId: BatchId.value,
  });
  if (res.Code == 200) {
    tableData1.value = res.DataMap ? res.DataMap : [];
  }
  let res1 = await GetGiveBatchTailHises({
    ObjectId: BatchId.value,
  });
  if (res1.Code == 200) {
    tableData2.value = res1.DataMap ? res1.DataMap : [];
  }
};

// 分页导航
const handle1PageChange = (val) => {
  query1.PageStartRow = val;
};
const handle1SizeChange = (val) => {
  query1.PageRowCount = val;
};
const handle2PageChange = (val) => {
  query2.PageStartRow = val;
};
const handle2SizeChange = (val) => {
  query2.PageRowCount = val;
};

const handleOut = () => {
  //导出
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
      query.search.give_date_begin = "";
      query.search.give_date_end = "";
      if (query.search.time) {
        if (query.search.time.length > 0) {
          query.search.give_date_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[0]
          );
          query.search.give_date_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[1]
          );
        }
      }
      let res = await SearchGiveBatches({
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
            "类型",
            "祝福语",
            "小程序",
            "OpenID",
            "姓名",
            "电话",
            "备注",
            "转赠时间",
            "每个领取张数(转给群时)",
            "每个的领取概率(转给群时)",
            "状态",
          ];
          const filterVal = [
            "GiveTypeDesc",
            "GiveWish",
            "AccountName",
            "Openid",
            "VipName",
            "VipCell",
            "GiveRemark",
            "GiveTime",
            "EveryoneTakeCount",
            "EveryoneTakeProbability",
            "GiveStatusDesc",
          ];
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "卡券转赠列表数据导出" + time,
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
const init = async () => {
  //一个月
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  query.search.time = [start, end];
  getData();
};
init();
</script>

<style scoped>
::v-deep(.datatable-ticket .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
