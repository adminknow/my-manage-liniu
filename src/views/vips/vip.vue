<template>
  <div class="container">
    <!-- 搜搜条件 -->
    <vip-search-form
      v-model:search="query.search"
      :vip-list="vipList"
      :search-loading="tableLoading"
      :has-search-data="tableData.length > 0"
      @search="handleSearch"
      @export="handleOut"
    />

    <!-- 券表格 -->
    <vip-table
      :data="tableData"
      :loading="tableLoading"
      @view-tickets="ViewTickets"
      @view-account="ViewAccount"
    />

    <!-- 主表格分页 -->
    <common-pagination
      v-model:current-page="query.PageStartRow"
      v-model:page-size="query.PageRowCount"
      :total="pageTotal"
      :page-sizes="[15, 50, 100]"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 券明细弹窗 -->
    <ticket-modal
      v-model:visible="TicketTableVisible"
      :title="TicketTitleModal"
      :query="TicketQuery"
      @close="handleTicketModalClose"
      @data-change="handleTicketDataChange"
    />

    <!-- 储值卡账户 -->
    <el-dialog
      class="datatable-ticket"
      :title="CardTitle"
      v-model="AccountVisible"
      width="70%"
      :show-close="false"
    >
      <el-table
        :data="
          AccountData.slice(
            (AccountQuery.PageStartRow - 1) * AccountQuery.PageRowCount,
            AccountQuery.PageStartRow * AccountQuery.PageRowCount
          )
        "
        height="400"
        border
        class="table"
        v-loading="AccountLoading"
        ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
      >
        <el-table-column
          label="类型"
          prop="AccountTypeDesc"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column label="别名" prop="AccountAlias" align="center">
        </el-table-column>
        <el-table-column label="余额(元)" align="center" width="100">
          <template #default="scope">
            <p>{{ scope.row.AccountAmt / 100 }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime"
          align="center"
          width="160"
        >
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <p>{{ scope.row.AccountStatus == 1 ? "正常" : "停用" }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <div class="button-mgl">
              <el-button
                v-if="IsRight"
                class="button-op-edit"
                size="small"
                @click="adjust(scope.row.VipAccountId)"
                >调整余额
              </el-button>
              <el-button
                class="button-op-edit"
                size="small"
                @click="ViewFlowingWater(scope.row.VipAccountId)"
                >交易流水
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <common-pagination
        v-model:current-page="AccountQuery.PageStartRow"
        v-model:page-size="AccountQuery.PageRowCount"
        :total="AccountData.length"
        :page-sizes="[15, 50, 100]"
        @page-change="handleAccountPageChange"
        @size-change="handleAccountSizeChange"
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="AccountVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 交易流水弹出框 -->
    <el-dialog
      class="datatable-ticket"
      title="交易流水"
      v-model="FlowingWaterVisible"
      width="68%"
      :show-close="false"
    >
      <div style="padding: 0 0 10px">
        <el-form label-width="1px">
          <el-row>
            <el-col :span="5"> </el-col>
            <el-col :span="11" :offset="1"> </el-col>
            <el-col :span="6" :offset="1">
              <div class="button-mgl">
                <el-button
                  class="button1 button-float"
                  round
                  @click="Refresh()"
                >
                  &nbsp;&nbsp;刷&nbsp;&nbsp;新&nbsp;&nbsp;
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        height="400"
        :data="AccountTransesData"
        border
        class="table"
        v-loading="AccountTransesLoading"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
        style="width: 100%"
      >
        <el-table-column
          prop="TransTime"
          label="交易时间"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="TransDesc"
          align="center"
          label="描述"
        ></el-table-column>
        <el-table-column label="交易走向" align="center" width="250">
          <template #default="scope">
            <p>
              {{ (scope.row.BeginAmt / 100).toFixed(2) }}>
              <span v-if="scope.row.BeginAmt > scope.row.EndAmt">-</span
              ><span v-if="scope.row.BeginAmt < scope.row.EndAmt">+</span
              ><span
                :style="{
                  color:
                    scope.row.BeginAmt > scope.row.EndAmt
                      ? '#ff6666'
                      : '#14ee00',
                }"
                >{{ (scope.row.TransAmt / 100).toFixed(2) }}</span
              >
              > {{ (scope.row.EndAmt / 100).toFixed(2) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateUserName"
          align="center"
          label="交易人员姓名"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="CreateUnitName"
          align="center"
          label="券商"
          width="160"
        ></el-table-column>
      </el-table>
      <common-pagination
        v-model:current-page="AccountTransesQuery.PageStartRow"
        v-model:page-size="AccountTransesQuery.PageRowCount"
        :total="AccountTransesPageTotal"
        :page-sizes="[50, 100]"
        @page-change="handleAccountTransesQueryPageChange"
        @size-change="handleAccountTransesQuerySizeChange"
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="CloseAccountTranses"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 调整余额 -->
    <el-dialog
      class="datatable-ticket"
      title="调整余额"
      v-model="justVisible"
      width="24%"
      :show-close="false"
    >
      <div style="padding: 0 0 10px">
        <div style="width: 100%; height: 10px"></div>
        <el-form>
          <el-form-item label="金额" label-width="80px">
            <el-input
              type="number"
              @input="limitationInput"
              style="width: 80%"
              v-model="justForm.Amount"
              clearable
              placeholder="请输入金额"
            >
              <template #append>元</template></el-input
            >
            <div
              style="
                width: 100%;
                height: 15px;
                font-size: 10px;
                color: rgb(255, 102, 102);
              "
            >
              正数向账户充值，负数从账户扣减
            </div>
          </el-form-item>
          <el-form-item label="备注" label-width="80px">
            <el-input
              style="width: 80%"
              v-model="justForm.Remark"
              clearable
              :rows="2"
              type="textarea"
              placeholder="请输入备注"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="justSubmitLoading"
            @click="saveJust"
            >保 存</el-button
          >
          <el-button class="button2" @click="closeJust">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import common from "@/utils/common.js";
import { HasRightes } from "@/api/index.js";
import {
  SearchVips,
  GetVipAccountList,
  SearchVipAccountTranses,
  GetVipTypeList,
  AdjustVipAccountAmount,
} from "@/api/vip.js";
import { useVipExport } from "@/hooks/use-export.js";
import CommonPagination from "@/components/common/CommonPagination.vue";
import VipSearchForm from "@/components/vip/VipSearchForm.vue";
import TicketModal from "@/components/vip/TicketModal.vue";
import VipTable from "@/components/vip/VipTable.vue";
const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    wxxcx_openid: "",
    vip_name: "",
    vip_cell: "",
    create_date_begin: "",
    create_date_end: "",
    time: [],
    wxxcx_unionid: "",
    vip_type_id: "",
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
  GetVipTypeListApi();
};

const vipList = ref([]);
const GetVipTypeListApi = async () => {
  let res = await GetVipTypeList({});
  if (res.Code == 200) {
    vipList.value = res.DataMap;
  }
};

init();
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  query.search.create_date_begin = "";
  query.search.create_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.create_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.create_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchVips({
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
// 使用导出Hook
const { handleExport } = useVipExport();
const handleOut = () => {
  //导出
  handleExport(query, tableLoading);
};
const IsRight = ref(false);
const BoolRight = async () => {
  let arr = ["adjust_vip_account_amount"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.adjust_vip_account_amount;
  }
};
BoolRight();
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const TicketQuery = reactive({
  search: {
    vip_id: "",
    search_keyword: "",
    status: "1",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const TicketTableVisible = ref(false);
const TicketTitleModal = ref("");
//查看卡券
const ViewTickets = async (ID, Index) => {
  TicketQuery.search.vip_id = ID;
  TicketTitleModal.value = tableData.value[Index].VipName + " 拥有的卡券";
  TicketTableVisible.value = true;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const AccountQuery = reactive({
  search: {
    vip_id: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const AccountVisible = ref(false);
const AccountLoading = ref(false);
const CardTitle = ref("");
const AccountData = ref([]);
// 分页导航
const handleAccountPageChange = (val) => {
  AccountQuery.PageStartRow = val;
};
const handleAccountSizeChange = (val) => {
  AccountQuery.PageRowCount = val;
};
//调整余额
const justForm = reactive({
  VipAccountId: "",
  Amount: "",
  Remark: "",
});
const justVisible = ref(false);
const justSubmitLoading = ref(false);
const adjust = async (ID) => {
  justForm.VipAccountId = ID;
  justVisible.value = true;
  justForm.Amount = "";
  justForm.Remark = "";
};

const saveJust = async () => {
  if (!justForm.Amount) {
    ElMessage.error("请输入金额");
    return;
  }
  if (!justForm.Remark) {
    ElMessage.error("请输入备注");
    return;
  }
  justSubmitLoading.value = true;
  let res = await AdjustVipAccountAmount({
    VipAccountId: justForm.VipAccountId,
    VipId: AccountQuery.search.vip_id,
    Amount: Number(justForm.Amount * 100).toFixed(0),
    Remark: justForm.Remark,
  });
  justSubmitLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    GetVipAccountListApi();
    justVisible.value = false;
  } else {
    ElMessage.error(res.Message);
  }
};
const closeJust = async () => {
  justVisible.value = false;
  justForm.Amount = "";
  justForm.Remark = "";
};
//查看账户
const ViewAccount = async (ID, Name) => {
  AccountVisible.value = true;
  CardTitle.value = (Name ? Name + "的" : "游客的") + "账户";
  AccountQuery.search.vip_id = ID;
  GetVipAccountListApi();
};

// 获取表格数据
const GetVipAccountListApi = async () => {
  AccountLoading.value = true;
  let res = await GetVipAccountList({
    VipId: AccountQuery.search.vip_id,
  });
  AccountLoading.value = false;
  if (res.Code == 200) {
    AccountData.value = res.DataMap ? res.DataMap : [];
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//交易流水
const AccountTransesQuery = reactive({
  search: {
    vip_account_id: "",
    vip_id: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const FlowingWaterVisible = ref(false);
const AccountTransesLoading = ref(false);

const AccountTransesData = ref([]);
const AccountTransesPageTotal = ref(0);
const SearchVipAccountTransesApi = async () => {
  AccountLoading.value = true;
  AccountTransesLoading.value = true;
  let res = await SearchVipAccountTranses({
    PageStartRow:
      (AccountTransesQuery.PageStartRow - 1) * AccountTransesQuery.PageRowCount,
    PageRowCount: AccountTransesQuery.PageRowCount,
    SearchCondition: AccountTransesQuery.search,
  });
  AccountTransesLoading.value = false;
  AccountLoading.value = false;
  if (res.Code == 200) {
    AccountTransesData.value = res.DataMap.Data ? res.DataMap.Data : [];
    AccountTransesPageTotal.value = res.DataMap.ToalCount;
  }
};

const CloseAccountTranses = () => {
  FlowingWaterVisible.value = false;
};
//查看交易流水
const ViewFlowingWater = async (ID) => {
  AccountTransesQuery.search.vip_account_id = ID;
  AccountTransesQuery.search.vip_id = AccountQuery.search.vip_id;
  FlowingWaterVisible.value = true;
  SearchVipAccountTransesApi();
};
// 分页导航
const handleAccountTransesQueryPageChange = (val) => {
  AccountTransesQuery.PageStartRow = val;
  SearchVipAccountTransesApi();
};
const handleAccountTransesQuerySizeChange = (val) => {
  AccountTransesQuery.PageRowCount = val;
  SearchVipAccountTransesApi();
};
const Refresh = () => {
  AccountTransesQuery.PageStartRow = 1;
  SearchVipAccountTransesApi();
};

const limitationInput = (val) => {
  if (val.includes(".")) {
    // 分割小数点前后的部分
    var parts = val.split(".");
    // 只保留小数点前的部分和小数点后两位
    justForm.Amount = parts[0] + "." + parts[1].slice(0, 2);
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "会员列表") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "会员列表"
    ) {
      handleSearch();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const handleTicketModalClose = () => {
  console.log("券明细弹窗已关闭");
  handleTicketModalClose.value = false;
};

const handleTicketDataChange = ({ data, total }) => {
  console.log("券数据已更新:", data, total);
};
</script>

<style scoped>
::v-deep(.datatable-ticket .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
