<template>
  <div class="container">
    <div class="handle-box" style="padding-bottom: 10px">
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入编码、名称"></el-input>
            </el-form-item></el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select v-model="query.search.bill_status" clearable style="width: 100%" placeholder="请选择状态">
                <el-option label="待审批" value="0"></el-option>
                <el-option label="审批通过" value="1"></el-option>
                <el-option label="审批不通过" value="-1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select v-model="query.search.create_unit_id" filterable remote reserve-keyword placeholder="请输入券商名称"
                :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading" style="width: 100%" clearable>
                <el-option v-for="(item, index) in UnitData" :key="index" :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight" class="button2 button-float" round @click="handleAdd()">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;新&nbsp;&nbsp;增&nbsp;&nbsp;
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <!-- <el-table-column
        v-if="loginUser.UnitType != 2"
        prop="UnitName"
        align="center"
        label="券商"
      >
      </el-table-column> -->
      <el-table-column align="center" label="领取码" width="120">
        <template #default="scope">
          <img :src="scope.row.TakeWxxcxQRCode" @click="
            handleOpenQr(
              scope.row.TakeWxxcxQRCode
                ? scope.row.TakeWxxcxQRCode
                : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png'
            )
            " style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="单号">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.BillId, 'View')" style="color: #f56c6c">
            {{ scope.row.BillCode }}</el-link>
          <p>{{ scope.row.BillTitle }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="卡券" align="left">
        <template #default="scope">
          <div v-for="(obj, index) in scope.row.TicketTemplateDetails" :key="index">
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
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动时间" width="160">
        <template #default="scope">
          <p>{{ scope.row.CreateTime }}</p>
          <p>~</p>
          <p>{{ scope.row.EndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="120"> <template #default="scope">
          <p v-if="scope.row.TicketCount > 0">总数：{{ scope.row.TicketCount }} 张</p>
          <p v-if="scope.row.TakenCount > 0">已领取：{{ scope.row.TakenCount }} 张</p>
          <p >进度：{{ (scope.row.TakenCount/scope.row.TicketCount).toFixed(2)*100 }}%</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通过手机号匿名领取">
        <template #default="scope">
          <p>{{ JSON.parse(scope.row.BillConfig)?.AddStaffByCell ? '是' : '否' }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="BillStatusDesc" width="100">
      </el-table-column>
      <el-table-column width="160" prop="" align="left" label="创建信息">
        <template #default="scope">
          <p>{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small" v-if="IsRight && scope.row.BillStatus == 0"
              @click="handleEdit(scope.row.BillId, 'Edit')">编辑
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="IsRight1 && scope.row.BillStatus == 0"
              @click="handleOp(scope.row.BillId, 'examine')">通过
            </el-button>
            <el-button class="button-op-del" size="small" v-if="IsRight1 && scope.row.BillStatus == 0"
              @click="handleOp(scope.row.BillId, 'cancel')">不通过
            </el-button>
            <el-button v-if="IsRight2 && scope.row.BillStatus == 1" class="button-op-edit" size="small"
              @click="handleActive(scope.row.BillId)">激活券
            </el-button>
            <el-button v-if="IsRight2 && scope.row.BillStatus == 1" class="button-op-edit" size="small"
              @click="handleEdit(scope.row.BillId, 'Edit')">编辑样式
            </el-button>
            <el-button class="button-op-edit" size="small" @click="handleTicket(scope.row.BillId)">券明细
            </el-button>
            <el-button class="button-op-edit" size="small" @click="handleDetail(scope.row.BillId)">领取日志
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>

    <!-- 操作 -->
    <el-dialog :title="ModalDesc" v-model="approveVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareaApprove">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="passLoading" @click="passModalBtn">确 认</el-button>
          <el-button class="button2" @click="approveVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 二维码图片弹框 -->
    <el-dialog title="小程序码" v-model="QrCodeVisible" width="38%" :show-close="false">
      <div style="width: 100%; text-align: center">
        <img :src="QrCodeImg" style="width: 300px" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="QrCodeVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 券明细 -->
    <el-dialog title="券明细" v-model="tableVisible" width="60%" :show-close="false">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="券批次" name="first">
          <el-table :data="tableDataModal1" height="400" border class="table" v-loading="tableModalLoading1"
            ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="120"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" align="center" label="名称"></el-table-column>
            <el-table-column prop="TicketCount" align="center" label="数量" width="100"></el-table-column>
            <el-table-column align="center" label="面值(元)" width="100">
              <template #default="scope">
                <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="TicketIndexScope" label="号段" align="center" width="180"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal1" v-model:page-size="PageRowCountModal1"
              :page-sizes="[15, 50, 100]" :total="Number(pageTotalModal1)" @current-change="handlePageChangeModal1"
              @size-change="handleSizeChangeModal1"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="券明细" name="second">
          <el-table :data="tableDataModal" height="400" border class="table" v-loading="tableModalLoading"
            ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="120"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" label="名称" align="center"></el-table-column>
            <el-table-column prop="TicketIndex" align="center" label="序号" width="60"></el-table-column>
            <el-table-column prop="TicketCode" align="center" label="券码"></el-table-column>
            <el-table-column prop="IsSuspendDesc" align="center" label="挂起" width="60"></el-table-column>
            <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="130"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal" v-model:page-size="PageRowCountModal" :page-sizes="[15, 50, 100]"
              :total="Number(pageTotalModal)" @current-change="handlePageChangeModal"
              @size-change="handleSizeChangeModal"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="tableVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 操作 -->
    <el-dialog title="激活销售单下的券" v-model="activeVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareaActive">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="activeLoading" @click="activeModalBtn">确 认</el-button>
          <el-button class="button2" @click="activeVisible = false">关 闭</el-button>
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
import {
  SearchTicketBillActes,
  CancelTicketBillAct,
  PassTicketBillAct,
  SearchTicketBillDetails,
  GetTicketBillTicketTemplateDetails,
  ActiveTicketByTicketBill,
} from "@/api/bill.js";
import Cookie from "js-cookie";
import { SearchUnites, HasRightes } from "@/api/index.js";
import common from "@/utils/common.js";
const store = useStore();
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const query = reactive({
  search: {
    create_unit_id: "",
    bill_status: "",
    bill_code: "",
    bill_date_begin: "",
    bill_date_end: "",
    search_keyword: "",
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
  let res = await SearchTicketBillActes({
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
////////////////////////////////////////////////////////////////
const handleAdd = (ID) => {
  common.ClosePageTag("领取活动详情");
  router.push({
    path: "/claim_activity_Info",
  });
};
const handleEdit = (ID, type) => {
  common.ClosePageTag("领取活动详情");
  router.push({
    path: "/claim_activity_Info",
    query: {
      ID: ID,
      Type: type,
    },
  });
};
const handleDetail = (ID) => {
  common.ClosePageTag("领取活动明细");
  router.push({
    path: "/claim_activity_detail",
    query: {
      ID: ID,
    },
  });
};

//操作
const BillIdValue = ref("");
const ModalDesc = ref("");
const approveVisible = ref(false);
const textareaApprove = ref("");
const passLoading = ref(false);

const handleOp = (ID, typeDesc) => {
  BillIdValue.value = ID;
  if (typeDesc == "examine") {
    ModalDesc.value = "审核";
  } else {
    ModalDesc.value = "取消";
  }
  textareaApprove.value = "";
  approveVisible.value = true;
};
const passModalBtn = () => {
  if (ModalDesc.value == "审核") {
    PassTicketBillActApi();
  } else {
    CancelTicketBillActApi();
  }
};
const PassTicketBillActApi = async () => {
  passLoading.value = true;
  let res = await PassTicketBillAct({
    BillId: BillIdValue.value,
    Remark: textareaApprove.value,
  });
  passLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success(`操作成功`);
    approveVisible.value = false;
    handleSearch();
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
const CancelTicketBillActApi = async () => {
  if (!textareaApprove.value) {
    ElMessage.warning(`请先输入备注`);
    return;
  }
  passLoading.value = true;
  let res = await CancelTicketBillAct({
    BillId: BillIdValue.value,
    Remark: textareaApprove.value,
  });
  passLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success(`操作成功`);
    approveVisible.value = false;
    handleSearch();
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
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
const IsRight = ref(false); //新增/修改券活动领取单
const IsRight1 = ref(false); //审批券活动领取单
const IsRight2 = ref(false); //激活券
const BoolRight = async () => {
  let arr = [
    "edit_ticket_act_bill",
    "approve_ticket_act_bill",
    "active_ticket_act_bill",
  ];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_ticket_act_bill;
    IsRight1.value = res.DataMap.approve_ticket_act_bill;
    IsRight2.value = res.DataMap.active_ticket_act_bill;
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//二维码
const QrCodeImg = ref("");
const QrCodeVisible = ref(false);
const handleOpenQr = (imgValue) => {
  if (imgValue) {
    QrCodeVisible.value = true;
    QrCodeImg.value = imgValue;
  }
};
BoolRight();
////////////////////////////////////////////////////////////////////////////////////////////////////
//券明细
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
const BillId = ref("");
//查询券明细
const handleTicket = async (ID) => {
  tableVisible.value = true;
  BillId.value = ID;
  activeName.value = "first";
  tableDataModal.value = [];
  GetTicketBillTicketTemplateDetailsData();
};
const activeName = ref("first");
const handleClick = (event) => {
  if (event.props.name == "second" && tableDataModal.value.length == 0) {
    SearchTicketBillDetailsData();
  }
};
//查询券明细列表
const SearchTicketBillDetailsData = async () => {
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
  SearchTicketBillDetailsData();
};
const handleSizeChangeModal = (val) => {
  PageRowCountModal.value = val;
  SearchTicketBillDetailsData();
};
//查询券模板明细
const GetTicketBillTicketTemplateDetailsData = async () => {
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
  GetTicketBillTicketTemplateDetailsData();
};
const handleSizeChangeModal1 = (val) => {
  PageRowCountModal1.value = val;
  GetTicketBillTicketTemplateDetailsData();
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//券激活
const activeVisible = ref(false);
const textareaActive = ref("");
const activeLoading = ref(false);
const handleActive = (ID) => {
  BillId.value = ID;
  textareaActive.value = "";
  activeVisible.value = true;
};
const activeModalBtn = async () => {
  activeLoading.value = true;
  let res = await ActiveTicketByTicketBill({
    BillId: BillId.value,
    Remark: textareaActive.value,
  });
  activeLoading.value = false;
  if (res.Code == 200) {
    activeVisible.value = false;
    query.PageStartRow = 1;
    getData();
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    //回到页面来之后刷新用
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "领取活动") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "领取活动"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", {
        Search: 0,
        titlePage: "",
      });
    }
  }
);
////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

<style scoped></style>
