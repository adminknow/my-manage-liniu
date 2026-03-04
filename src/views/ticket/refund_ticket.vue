<template>
  <div class="container">
    <div class="handle-box">
      <!-- 使用统计卡片组件 -->
      <TicketSalesCards :statData="StatData" :cardConfigs="customCardConfigs" />

      <!-- 使用退券搜索表单组件 -->
      <RefundTicketSearchForm
        v-model="query.search"
        :customerOptions="customerArr"
        :showAddButton="IsRight"
        @search="handleSearch"
        @export="handleOut"
        @add="handleAdd"
      />
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
    >
      <el-table-column
        prop="BillCode"
        align="center"
        label="退券单号"
        width="250"
      >
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.BillId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.BillCode }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="UnitName"
        align="left"
        label="客户信息"
        width="220"
      >
        <template #default="scope">
          <p>{{ scope.row.UnitName }}</p>
          <p v-if="scope.row.TakeName">领取姓名：{{ scope.row.TakeName }}</p>
          <p v-if="scope.row.TakeCell">领取电话：{{ scope.row.TakeCell }}</p>
          <p>退券金额(元)：{{ (scope.row.ReturnAmt / 100).toFixed(2) }}</p>
          <p>折扣(%)：{{ scope.row.ReturnDiscount }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="卡券" align="left">
        <template #default="scope">
          <div v-for="(obj, index) in scope.row.Details" :key="index">
            {{
              obj.TicketTemplateCode +
              "-" +
              obj.TicketTemplateTitle +
              " ×" +
              obj.TicketCount
            }}
            <p v-if="obj.TicketIndexScope">
              券号段：{{ obj.TicketIndexScope }}
            </p>
            <el-divider
              v-if="scope.row.Details.length > 1"
              style="margin: 10px 0"
            />
          </div>
          <p>总数：{{ scope.row.TicketCount + "张" }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="BillStatusDesc"
        align="center"
        label="状态"
        width="120"
      ></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="200">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              v-if="
                scope.row.BillStatus == 0 &&
                loginUser.UnitId == scope.row.CreateUnitId &&
                IsRight
              "
              size="small"
              @click="handleEdit(scope.row.BillId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              class="button-op-edit"
              v-if="
                scope.row.BillStatus == 0 &&
                loginUser.UnitId == scope.row.CreateUnitId &&
                IsRight1
              "
              size="small"
              @click="handlePass(scope.row.BillId)"
              >审核
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="handleTicket(scope.row.BillId)"
              >券明细
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
    <!-- 券明细 -->
    <el-dialog
      title="券明细"
      v-model="tableVisible"
      width="60%"
      :show-close="false"
    >
    <div style="width:100%;height: 18px;"></div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="券批次" name="first">
          <el-table
            :data="tableDataModal1"
            height="400"
            border
            class="table"
            v-loading="tableModalLoading1"
            ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="TicketTemplateCode"
              align="center"
              label="批次号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="TicketTemplateTitle"
              align="center"
              label="名称"
            ></el-table-column>
            <el-table-column
              prop="TicketCount"
              align="center"
              label="数量"
              width="100"
            ></el-table-column>
            <el-table-column align="center" label="面值(元)" width="100">
              <template #default="scope">
                <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="折扣(%)" width="80">
              <template #default="scope">
                <p>{{ scope.row.Discount }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="折后价(元)" width="100">
              <template #default="scope">
                <p>{{ (scope.row.DiscountPrice / 100).toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="TicketIndexScope"
              label="号段"
              align="center"
              width="180"
            ></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal"
              v-model:page-size="PageRowCountModal1"
              :page-sizes="[15, 50, 100]"
              :total="pageTotalModal1"
              @current-change="handlePageChangeModal1"
              @size-change="handleSizeChangeModal1"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="券明细" name="second">
          <el-table
            :data="tableDataModal"
            height="400"
            border
            class="table"
            v-loading="tableModalLoading"
            ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="TicketTemplateCode"
              align="center"
              label="批次号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="TicketTemplateTitle"
              label="名称"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="TicketIndex"
              align="center"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="TicketCode"
              align="center"
              label="券码"
            ></el-table-column>
            <el-table-column
              prop="IsSuspendDesc"
              align="center"
              label="挂起"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="TicketStatusDesc"
              align="center"
              label="状态"
              width="130"
            ></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal"
              v-model:page-size="PageRowCountModal"
              :page-sizes="[15, 50, 100]"
              :total="pageTotalModal"
              @current-change="handlePageChangeModal"
              @size-change="handleSizeChangeModal"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="tableVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 审核通过 -->
    <el-dialog
      title="提示"
      v-model="approveVisible"
      width="38%"
      :show-close="false"
    >
      <el-input
        type="textarea"
        maxlength="100"
        :rows="4"
        show-word-limit
        placeholder="请输入内容"
        v-model="textareaApprove"
      >
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="passLoading"
            @click="passModalBtn"
            >通 过</el-button
          >
          <el-button
            class="button2 button-op-stop"
            :loading="noPassLoading"
            @click="noPassModalBtn"
            >不通过</el-button
          >
          <el-button class="button2" @click="approveVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { HasRightes, StatSingle, GetUnitList } from "@/api/index.js";
import {
  SearchTicketBillDetails,
  GetTicketBillTicketTemplateDetails,
  SearchTicketBillReturns,
  PassTicketBillReturn,
  CancelTicketBillReturn,
} from "@/api/bill.js";
import TicketSalesCards from "@/components/ticket/TicketSalesCards.vue";
import RefundTicketSearchForm from "@/components/ticket/RefundTicketSearchForm.vue";
// 导入图片
import imgOrder1 from "@/assets/imgs/img-order1.png";
import imgOrder2 from "@/assets/imgs/img-order2.png";
import imgOrder3 from "@/assets/imgs/img-order3.png";
import imgOrder4 from "@/assets/imgs/img-order4.png";
const customCardConfigs = [
  {
    title: "今日退券",
    image: imgOrder1,
    dataKey: "today_approve_ticket_cnt",
    percentKey: "today_ticket_cnt_percent",
    compareText: "同比昨日",
  },
  {
    title: "今日退券额",
    image: imgOrder2,
    dataKey: "today_approve_amt",
    percentKey: "today_amt_percent",
    compareText: "同比昨日",
  },
  {
    title: "本月退券",
    image: imgOrder3,
    dataKey: "thismonth_approve_ticket_cnt",
    percentKey: "thismonth_ticket_cnt_percent",
    compareText: "同比上月",
  },
  {
    title: "本月退券额",
    image: imgOrder4,
    dataKey: "thismonth_approve_amt",
    percentKey: "thismonth_amt_percent",
    compareText: "同比上月",
  },
];
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    unit_id: "", //客户
    bill_code: "", //单号
    bill_date_begin: "",
    bill_date_end: "",
    time: "",
    bill_status: "",
    ticket_template_code: "",
    ticket_template_title: "",
    ticket_code: "",
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
  if (query.search.time) {
    query.search.bill_date_begin = common.dateFormat(
      "YYYY-mm-dd",
      query.search.time[0]
    );
    query.search.bill_date_end = common.dateFormat(
      "YYYY-mm-dd",
      query.search.time[1]
    );
  } else {
    query.search.bill_date_begin = "";
    query.search.bill_date_end = "";
  }
  let res = await SearchTicketBillReturns({
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
//新增商品
const handleAdd = () => {
  common.ClosePageTag("退券详情");
  router.push({
    path: "/refund_ticket_info",
  });
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
////////////////////////////////////////////////////////////////
const IsRight = ref(false);
const IsRight1 = ref(false);
const HasRightesApi = async () => {
  //新增/修改券退还单edit_ticket_return_bill,审批券退还单approve_ticket_return_bill
  let arr = ["edit_ticket_return_bill", "approve_ticket_return_bill"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_ticket_return_bill;
    IsRight1.value = res.DataMap.approve_ticket_return_bill;
  }
};
////////////////////////////////////////////////////////////////
//查询券明细
const BillId = ref("");
const tableModalLoading = ref(false);
const tableModalLoading1 = ref(false);
const tableVisible = ref(false);
const tableDataModal = ref([]);
const tableDataModal1 = ref([]);
const PageRowCountModal = ref(15);
const PageRowCountModal1 = ref(15);
const PageStartRowModal = ref(1);
const PageStartRowModal1 = ref(1);
const pageTotalModal = ref(0);
const pageTotalModal1 = ref(0);

const handleTicket = async (ID) => {
  tableVisible.value = true;
  BillId.value = ID;
  activeName.value = "first";
  tableDataModal.value = [];
  GetTicketBillTicketTemplateDetailsApi();
};
const activeName = ref("first");
const handleClick = (event) => {
  if (event.props.name == "second" && tableDataModal.value.length == 0) {
    //点击第二个并且当前得值为空才查询
    SearchTicketBillDetailsApi();
  }
};
//查询券明细列表
const SearchTicketBillDetailsApi = async () => {
  tableModalLoading.value = true;
  let res = await SearchTicketBillDetails({
    PageStartRow: (PageStartRowModal.value - 1) * PageRowCountModal.value,
    PageRowCount: PageRowCountModal.value,
    NoPage: true,
    SearchCondition: {
      bill_id: BillId.value,
    },
  });
  tableModalLoading.value = false;
  if (res.Code == 200) {
    tableDataModal.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotalModal.value = res.DataMap.ToalCount;
  } else {
    ElMessage.warning(res.Message);
  }
};
const handlePageChangeModal = (val) => {
  PageStartRowModal.value = val;
  SearchTicketBillDetailsApi();
};
const handleSizeChangeModal = (val) => {
  PageRowCountModal.value = val;
  SearchTicketBillDetailsApi();
};
//查询券模板明细
const GetTicketBillTicketTemplateDetailsApi = async () => {
  tableModalLoading1.value = true;
  let res = await GetTicketBillTicketTemplateDetails({
    GetTicketIndexScope: true,
    BillId: BillId.value,
  });
  tableModalLoading1.value = false;
  if (res.Code == 200) {
    tableDataModal1.value = res.DataMap ? res.DataMap : [];
    pageTotalModal1.value = res.DataMap.length;
  } else {
    ElMessage.warning(res.Message);
  }
};
const handlePageChangeModal1 = (val) => {
  PageStartRowModal1.value = val;
  GetTicketBillTicketTemplateDetailsApi();
};
const handleSizeChangeModal1 = (val) => {
  PageRowCountModal1.value = val;
  GetTicketBillTicketTemplateDetailsApi();
};
////////////////////////////////////////////////////////////////
//审核单据
const passLoading = ref(false);
const noPassLoading = ref(false);
const approveVisible = ref(false);
const textareaApprove = ref("");

const handlePass = (ID) => {
  approveVisible.value = true;
  textareaApprove.value = "";
  BillId.value = ID;
};
const passModalBtn = async () => {
  //通过
  passLoading.value = true;
  let res = await PassTicketBillReturn({
    BillId: BillId.value,
  });
  passLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.error(res.Message);
  }
};
const noPassModalBtn = async () => {
  //不通过
  if (textareaApprove.value == "") {
    ElMessage.warning("请先输入不通过原因");
    return;
  }
  noPassLoading.value = true;
  let res = await CancelTicketBillReturn({
    BillId: BillId.value,
    Remark: textareaApprove.value,
  });
  noPassLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////
//编辑与查看
const handleEdit = (ID, type) => {
  common.ClosePageTag("退券详情");
  router.push({
    path: "/refund_ticket_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
////////////////////////////////////////////////////////////////
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      if (query.search.time) {
        query.search.bill_date_begin = common.dateFormat(
          "YYYY-mm-dd",
          query.search.time[0]
        );
        query.search.bill_date_end = common.dateFormat(
          "YYYY-mm-dd",
          query.search.time[1]
        );
      } else {
        query.search.bill_date_begin = "";
        query.search.bill_date_end = "";
      }
      tableLoading.value = true;
      let res = await SearchTicketBillReturns({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: query.search,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
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
          let OutList = [];
          res.DataMap.Data.forEach((row) => {
            row.Details.forEach((rowD) => {
              let obj = {
                BillCode: "",
                CreateTime: "",
                UnitName: "",
                TicketCount: "",
                SaleChannel: "",
                BillStatusDesc: "",
                CreateUserName: "",
                TakeName: "",
                TakeCell: "",

                Amt: "",
                TicketTemplateCode: "",
                TicketTemplateTitle: "",
                OrgPrice: "",
                Discount: "",
                DiscountPrice: "",
              };
              obj.BillCode = row.BillCode;
              obj.CreateTime = row.CreateTime;
              obj.ReturnAmtDesc = (row.ReturnAmt / 100).toFixed(2);
              obj.ReturnDiscount = row.ReturnDiscount;
              obj.UnitName = row.UnitName;
              obj.TicketCount = row.TicketCount;
              obj.SaleChannel = row.SaleChannel;
              obj.BillStatusDesc = row.BillStatusDesc;
              obj.CreateUserName = row.CreateUserName;
              obj.TakeName = row.TakeName;
              obj.TakeCell = row.TakeCell;
              obj.Amt = (rowD.Amt / 100).toFixed(2);
              obj.TicketTemplateCode = rowD.TicketTemplateCode;
              obj.TicketTemplateTitle = rowD.TicketTemplateTitle;
              obj.Discount = rowD.Discount;
              obj.TicketCountD = rowD.TicketCount;
              obj.OrgPrice = (rowD.OrgPrice / 100).toFixed(2);
              obj.DiscountPrice = (rowD.DiscountPrice / 100).toFixed(2);
              obj.TicketIndexScope = rowD.TicketIndexScope;
              OutList.push(obj);
            });
          });
          const tHeader = [
            "单号",
            "创建时间",
            "总数",
            "整单折扣(%)",
            "整单金额(元)",
            "状态",
            "制单人",
            "券批次号",
            "券名称",
            "数量",
            "面值(元)",
            "折扣(%)",
            "折后价(元)",
            "券号段",
            "客户",
          ];
          const filterVal = [
            "BillCode",
            "CreateTime",
            "TicketCount",
            "ReturnDiscount",
            "ReturnAmtDesc",
            "BillStatusDesc",
            "CreateUserName",
            "TicketTemplateCode",
            "TicketTemplateTitle",
            "TicketCountD",
            "OrgPrice",
            "Discount",
            "DiscountPrice",
            "TicketIndexScope",
            "UnitName",
          ];
          const data = formatJson(filterVal, OutList);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "退券单数据导出" + time,
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
////////////////////////////////////////////////////////////////
//客户查询下拉
const customerArr = ref([]);
const SearchUnitesByList = async () => {
  let res = await GetUnitList({
    SearchCondition: { get_liniu: 1, unit_type_filter: "31,32" },
  });
  if (res.Code == 200) {
    customerArr.value = res.DataMap;
  }
};
////////////////////////////////////////////////////////////////
SearchUnitesByList();
//初始化数据
const init = () => {
  SearchUnitesByList();
  HasRightesApi();
  StatSingleData();
};
////////////////////////////////////////////////////////////////
//初始化数据
const StatData = reactive({
  today_approve_ticket_cnt: "", //今日卖券
  today_ticket_cnt_percent: "",
  thismonth_approve_ticket_cnt: "", //本月卖券
  thismonth_ticket_cnt_percent: "",
  today_approve_amt: "", //今日已审批的销售单金额
  today_amt_percent: "", //今日销售单金额与昨日对比
  thismonth_approve_cnt: "", //本月已审批的销售单数
  thismonth_approve_amt: "", //本月已审批的销售单金额
  thismonth_cnt_percent: "", //本月销售单数与上月对比
  thismonth_amt_percent: "", //本月销售单金额与上月对比
});
const StatSingleData = async () => {
  let res = await StatSingle({
    StatType: 9,
  });
  if (res.Code == 200) {
    StatData.today_approve_ticket_cnt = res.DataMap.today_approve_ticket_cnt
      ? res.DataMap.today_approve_ticket_cnt
      : 0;
    StatData.today_ticket_cnt_percent = res.DataMap.today_ticket_cnt_percent;
    StatData.today_approve_amt = res.DataMap.today_approve_amt
      ? res.DataMap.today_approve_amt.toFixed(2)
      : 0;
    StatData.today_amt_percent = res.DataMap.today_amt_percent;
    StatData.thismonth_approve_amt = res.DataMap.thismonth_approve_amt
      ? res.DataMap.thismonth_approve_amt.toFixed(2)
      : 0;
    StatData.thismonth_amt_percent = res.DataMap.thismonth_amt_percent;
    StatData.thismonth_approve_ticket_cnt = res.DataMap
      .thismonth_approve_ticket_cnt
      ? res.DataMap.thismonth_approve_ticket_cnt
      : 0;
    StatData.thismonth_ticket_cnt_percent =
      res.DataMap.thismonth_ticket_cnt_percent;
  }
};

////////////////////////////////////////////////////////////////
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "退券单") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "退券单"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped>
.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.card-text {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.card-text-desc {
  color: #797979;
  font-size: 16px;
  letter-spacing: 1px;
}

.card-text-number {
  color: #f56c6c;
  font-weight: 600;
  font-size: 24px;
}

.card-text-type {
  font-size: 12px;
  color: #797979;
}

.card-text-type text {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}
</style>
