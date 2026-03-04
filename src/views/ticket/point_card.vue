<template>
  <div class="container">
    <div class="handle-box">
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="queryParams.search.bill_code"
              placeholder="请输入编码"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="queryParams.search.bill_title"
              placeholder="请输入标题"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="queryParams.search.bill_status"
              clearable
              style="width: 100%"
              placeholder="状态"
            >
              <el-option label="待审批" value="0"></el-option>
              <el-option label="审批通过" value="1"></el-option>
              <el-option label="已允值" value="10"></el-option>
              <el-option label="审批不通过" value="-1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <div class="button-mgl">
            <el-button class="button2 button-float" round @click="handleAdd()"
              ><el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新&nbsp;&nbsp;增
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
            <el-date-picker
              style="width: 100%"
              v-model="queryParams.search.time"
              type="daterange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="queryParams.search.ticket_template_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入点卡名称"
              :remote-method="searchTicket"
              remote-show-suffix
              :loading="ticketSearchLoading"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="(item, index) in ticketList"
                :key="index"
                :label="`${item.TicketTemplateCode}-${item.TicketTemplateTitle}`"
                :value="item.TicketTemplateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 添加表格显示部分 -->
      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          :header-cell-style="{ 'text-align': 'center' }"
          header-cell-class-name="table-header"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column
            prop="BillCode"
            align="center"
            label="编码"
            width="220"
          />
          <el-table-column align="center" label="标题">
            <template #default="scope">
              <el-link
                :underline="false"
                @click="handleEdit(scope.row.BillId, 'view')"
                style="color: #f56c6c"
              >
                {{ scope.row.BillTitle }}</el-link
              >
            </template></el-table-column
          >

          <el-table-column
            prop="TicketTemplateTitle"
            align="center"
            label="点卡名称"
          >
          </el-table-column>
          <el-table-column align="center" label="每人充值金额" width="160">
            <template #default="scope">
              {{ scope.row.EveryoneAmt / 100 }}
            </template></el-table-column
          >
          <el-table-column align="center" label="充值总金额" width="160"
            ><template #default="scope">
              {{ scope.row.TotalAmt / 100 }}
            </template></el-table-column
          >
          <el-table-column
            prop="CreateTime"
            align="center"
            label="创建日期"
            width="160"
          />
          <el-table-column
            label="状态"
            prop="BillStatusDesc"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <div class="button-mgl">
                <el-button
                  v-if="scope.row.BillStatus == '0'"
                  class="button-op-edit"
                  size="small"
                  @click="handleEdit(scope.row.BillId, 'edit')"
                  >编辑
                </el-button>
                <el-button
                  v-if="scope.row.BillStatus == '0'"
                  class="button-op-edit"
                  size="small"
                  @click="handleApprove(scope.row.BillId)"
                  >审核
                </el-button>
                <el-button
                  class="button-op-edit"
                  size="small"
                  @click="handleDetail(scope.row.BillId)"
                  >卡明细
                </el-button>
                <el-button
                  class="button-op-edit"
                  size="small"
                  @click="handleLog(scope.row.BillId)"
                  >充值记录
                </el-button>
                <el-button
                  v-if="scope.row.BillStatus == '0'"
                  class="button-op-del"
                  size="small"
                  @click="handleDel(scope.row.BillId, 'edit')"
                  >删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            background
            layout="->,total, prev, pager, next"
            :total="total"
            :current-page="queryParams.PageStartRow"
            :page-size="queryParams.PageRowCount"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <detail-index
      :Visible="detailVisible"
      :billID="billID"
      @CloseVisible="CloseVisible"
    ></detail-index>
    <log-Index
      :Visible="logVisible"
      :billID="billID"
      @CloseVisible="CloseLogVisible"
    ></log-Index>
  </div>
</template>

<script setup>
import detailIndex from "@/components/ticket/detail.vue";
import logIndex from "@/components/pointCard/log.vue";
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { SearchTicketTemplates } from "@/api/ticket.js";
import {
  SearchTicketBillRecharges,
  PassTicketBillRecharge,
  CancelTicketBillRecharge,
} from "@/api/bill.js";

import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const queryParams = reactive({
  search: {
    bill_code: "",
    bill_status: "",
    bill_title: "",
    time: [],
    bill_date_begin: "",
    bill_date_end: "",
    ticket_template_id: "", // 添加点卡模板ID字段
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableData = ref([]);
const total = ref(0);

const tableLoading = ref(false);
const ticketSearchLoading = ref(false);
const ticketList = ref([]);

// 搜索券商
const searchTicket = async (queryString) => {
  if (queryString) {
    ticketSearchLoading.value = true;
    const res = await SearchTicketTemplates({
      SearchCondition: {
        search_keyword: queryString,
        ticket_template_type: "7",
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    ticketSearchLoading.value = false;
    if (res.Code == 200) {
      ticketList.value = res.DataMap.Data || [];
    } else {
      ElMessage.warning("获取点卡列表失败");
      ticketList.value = [];
    }
  } else {
    ticketList.value = [];
  }
};

// 日期变更处理
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    queryParams.search.bill_date_begin = formatDate(val[0]);
    queryParams.search.bill_date_end = formatDate(val[1]);
  } else {
    queryParams.search.bill_date_begin = "";
    queryParams.search.bill_date_end = "";
  }
};
// 格式化日期
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// 查询数据
const handleSearch = async () => {
  tableLoading.value = true;
  try {
    // 处理日期
    handleDateChange(queryParams.search.time);
    const res = await SearchTicketBillRecharges({
      PageStartRow: (queryParams.PageStartRow - 1) * queryParams.PageRowCount,
      PageRowCount: queryParams.PageRowCount,
      SearchCondition: queryParams.search,
    });
    if (res.Code === 200) {
      tableData.value = res.DataMap.Data || [];
      total.value = res.DataMap.ToalCount || 0;
    } else {
      ElMessage.warning(res.Message || "查询失败");
    }
  } catch (error) {
    console.error("查询点卡列表出错:", error);
    ElMessage.error("系统异常，请稍后再试");
  } finally {
    tableLoading.value = false;
  }
};

//批量选中数据
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 审核
const handleApprove = (IdPost) => {
  ElMessageBox.confirm("确认要审核点卡?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
    type: "warning",
  })
    .then(async () => {
      // 这里添加批量审核的逻辑
      let res = await PassTicketBillRecharge({
        BillId: IdPost,
      });
      if (res.Code == 200) {
        ElMessage.success("审核成功");
        queryParams.PageStartRow = 1;
        handleSearch();
      } else {
        ElMessage.error(res.Message || "审核失败");
        return;
      }
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 删除
const handleDel = () => {
  ElMessageBox.confirm("确认要删除点卡?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
    type: "warning",
  })
    .then(async () => {
      let res = await CancelTicketBillRecharge({
        BillId: IdPost,
      });
      if (res.Code == 200) {
        ElMessage.success("删除成功");
        queryParams.PageStartRow = 1;
        handleSearch();
      } else {
        ElMessage.error(res.Message || "删除失败");
        return;
      }
    })
    .catch(() => {
      // 用户取消操作
    });
};

//查看券明细
const detailVisible = ref(false);
const billID = ref("");
const handleDetail = (IdPost) => {
  detailVisible.value = true;
  billID.value = IdPost;
};
const CloseVisible = () => {
  detailVisible.value = false;
  billID.value = "";
};
//查看充值记录
const logVisible = ref(false);
const handleLog = (IdPost) => {
  logVisible.value = true;
  billID.value = IdPost;
};
const CloseLogVisible = () => {
  logVisible.value = false;
  billID.value = "";
};
const handleAdd = () => {
  router.push({
    path: "/point_card_info",
  });
};
const handleEdit = (id, type = "view") => {
  router.push({
    path: "/point_card_info",
    query: {
      id: id,
      type: type,
    },
  });
};
// 页码变更
const handlePageChange = (page) => {
  queryParams.PageStartRow = page;
  handleSearch();
};

// 页面加载时执行查询
onMounted(() => {
  handleSearch();
});
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "点卡充值单") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "点卡充值单"
    ) {
      queryParams.PageStartRow = 1;
      handleSearch();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
