<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.bill_code"
                clearable
                placeholder="请输入单据号"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                v-model="query.search.time"
                type="daterange"
                range-separator="To"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.bill_status"
                placeholder="状态"
              >
                <el-option label="待提现" value="0"> </el-option>
                <el-option label="提现中" value="60"> </el-option>
                <el-option label="提现成功" value="100"> </el-option>
                <el-option label="提现失败" value="101"> </el-option>
                <el-option label="已取消" value="-1"> </el-option>
              </el-select> </el-form-item
          ></el-col>
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
            <el-form-item label="">
              <el-input
                v-model="query.search.pay_no"
                clearable
                placeholder="请输入支付单号"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.vip_name"
                clearable
                placeholder="请输入会员姓名"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.vip_cell"
                clearable
                placeholder="请输入会员电话"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <withdrawal-table :data="tableData" :loading="tableLoading" />

    <!-- 主表格分页 -->
    <common-pagination
      v-model:current-page="query.PageStartRow"
      v-model:page-size="query.PageRowCount"
      :total="pageTotal"
      :page-sizes="[15, 50, 100]"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import { SearchVipAccountWithdrawRecords } from "@/api/vip.js";
import CommonPagination from "@/components/common/CommonPagination.vue";
import WithdrawalTable from "@/components/vip/WithdrawalTable.vue";
const query = reactive({
  search: {
    bill_code: "",
    openid: "",
    pay_no: "",
    vip_name: "",
    vip_cell: "",
    bill_date_begin: "",
    bill_date_end: "",
    time: [],
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

const init = async () => {
  //一个月
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  query.search.time = [start, end];
  getData();
};

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  query.search.bill_date_begin = "";
  query.search.bill_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.bill_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.bill_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchVipAccountWithdrawRecords({
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
const handleOut = () => {
  //导出
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
      query.search.bill_date_begin = "";
      query.search.bill_date_end = "";
      if (query.search.time) {
        if (query.search.time.length > 0) {
          query.search.bill_date_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[0]
          );
          query.search.bill_date_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time[1]
          );
        }
      }
      let res = await SearchVipAccountWithdrawRecords({
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
            "微信小程序",
            "单据号",
            "会员姓名",
            "会员电话",
            "微信支付单号",
            "金额(元)",
            "时间",
            "单据状态",
          ];
          const filterVal = [
            "AccountName",
            "BillCode",
            "VipName",
            "VipCell",
            "PayNo",
            "AmtDesc",
            "BillTime",
            "BillStatusDesc",
          ];
          res.DataMap.Data.forEach((row) => {
            row.AmtDesc = row.Amt / 100;
          });
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "提现数据导出" + time,
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////
init();
</script>
