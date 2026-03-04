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
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.bill_status"
                placeholder="状态"
              >
                <el-option label="待审批" value="0"> </el-option>
                <el-option label="审批通过" value="1"> </el-option>
                <el-option label="审批不通过" value="-1"> </el-option>
                <el-option label="作废" value="-10"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
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
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon
                >&nbsp;&nbsp;新&nbsp;&nbsp;增&nbsp;&nbsp;
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
            <el-form-item label="" v-if="loginUser.UnitType == 2">
              <el-select
                v-model="query.search.create_unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入提货点名称"
                :remote-method="remoteMethod1"
                remote-show-suffix
                :loading="SelPointLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in UnitPointData"
                  :key="index"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
      <el-table-column prop="CreateUnitName" align="center" label="创建单位">
      </el-table-column>
      <el-table-column align="center" label="单据号">
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
      <el-table-column prop="BillRemark" align="center" label="备注">
      </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="创建时间">
      </el-table-column>
      <el-table-column prop="CreateUserName" align="center" label="创建人">
      </el-table-column>
      <el-table-column prop="BillStatusDesc" align="center" label="状态">
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="scope.row.BillStatus == 0"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.BillId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.BillStatus == 0"
              class="button-op-view"
              size="small"
              @click="OpApproveAndCancel(scope.row.BillId, 'Approve')"
              >审批
            </el-button>
            <el-button
              v-if="scope.row.BillStatus == 0"
              class="button-op-del"
              size="small"
              @click="OpApproveAndCancel(scope.row.BillId, 'Cancel')"
              >取消
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

    <!-- 操作弹框 -->
    <delDialog
      ref="editor"
      :IDs="BillId"
      :OpType="OpType"
      :BillType="'rk'"
      :Visible="OpVisible"
      @RefreshData="RefreshData"
      @CloseVisible="CloseVisible"
    >
    </delDialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import delDialog from "@/components/common/del_dialog.vue";
import { SearchGoodsBills } from "@/api/bill.js";
import { SearchUnites } from "@/api/index.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    bill_type: "2",
    bill_code: "",
    bill_date_begin: "",
    bill_date_end: "",
    bill_status: "",
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
  let res = await SearchGoodsBills({
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
//新增差异兑换详情
const handleAdd = () => {
  common.ClosePageTag("单据详情");
  router.push({
    path: "/bill_info",
    query: {
      Type: "Add",
      BillType: "2", //出库单
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
//编辑
const handleEdit = (BillId, Type) => {
  common.ClosePageTag("单据详情");
  router.push({
    path: "/bill_info",
    query: {
      Type: Type,
      ID: BillId,
      BillType: "2", //出库单
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
//审批和取消
const OpApproveAndCancel = (ID, type) => {
  OpVisible.value = true;
  BillId.value = [];
  BillId.value.push(ID);
  OpType.value = type;
};
/////////////////////////////////////////////////////////////////////////////////
const OpType = ref("");
const OpVisible = ref(false);
const RefreshData = (val) => {
  if (val == 2) {
    query_Pmoter.PageStartRow = 1;
    SearchCustomersByPromoterApi();
  } else {
    //列表刷新
    handleSearch();
  }
};
const CloseVisible = (isBoolean) => {
  OpVisible.value = isBoolean;
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
//提货点
const SelPointLoading = ref(false);
const UnitPointData = ref([]);
const remoteMethod1 = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelPointLoading.value = true;
    let res = await SearchUnites({
      SearchCondition: {
        search_keyword: SearchQuery,
        unit_type: 33,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    SelPointLoading.value = false;
    if (res.Code == 200) {
      UnitPointData.value = res.DataMap.Data ? res.DataMap.Data : [];
    }
  } else {
    UnitPointData.value = [];
  }
};
/////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "出库单") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "出库单"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
