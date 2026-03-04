<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.act_code"
                clearable
                placeholder="请输入编码"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.act_name"
                clearable
                placeholder="请输入名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增活动
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
                v-model="query.search.time"
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
                clearable
                style="width: 100%"
                v-model="query.search.act_status"
                placeholder="单据状态"
              >
                <el-option label="待审核" value="0"> </el-option>
                <el-option label="审核" value="1"> </el-option>
                <el-option label="暂停" value="2"> </el-option>
                <el-option label="不通过" value="-1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1"> </el-col>
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
      <el-table-column prop="ActCode" align="center" label="编码" width="220">
      </el-table-column>
      <el-table-column prop="ActName" align="center" label="名称">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.ActId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.ActName }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column align="left" label="活动时间" width="330">
        <template #default="scope">
          <p>{{ scope.row.BeginTime + " ~ " + scope.row.EndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="query.search.act_type == 2"
        align="center"
        label="可使用商品"
      >
        <template #default="scope">
          <p v-if="scope.row.UseGoodsCount == 0">全部商品</p>
          <p v-else>{{ scope.row.UseGoodsCount }}个</p>
        </template>
      </el-table-column>
      <el-table-column prop="DetailDesc" align="center" label="描述">
      </el-table-column>
      <el-table-column align="left" label="创建信息" width="160">
        <template #default="scope">
          <p>{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template #default="scope">
          <p v-if="scope.row.ActStatus == 0">待审核</p>
          <p v-if="scope.row.ActStatus == 1">已审核</p>
          <p v-if="scope.row.ActStatus == -1">不通过</p>
          <p v-if="scope.row.ActStatus == 2">暂停</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              v-if="scope.row.ActStatus == 0"
              size="small"
              @click="handleEdit(scope.row.ActId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.ActStatus == 0"
              class="button-op-view"
              size="small"
              @click="OpApproveAndCancel(scope.row.ActId, 'MKApprove')"
              >审批
            </el-button>
            <el-button
              v-if="scope.row.ActStatus == 0"
              class="button-op-del"
              size="small"
              @click="OpApproveAndCancel(scope.row.ActId, 'MKCancel')"
              >取消
            </el-button>
            <el-button
              v-if="scope.row.ActStatus == 1"
              class="button-op-del"
              size="small"
              @click="OpApproveAndCancel(scope.row.ActId, 'MKPause')"
              >暂停
            </el-button>
            <el-button
              v-if="scope.row.ActStatus == 2"
              class="button-op-reset"
              size="small"
              @click="OpApproveAndCancel(scope.row.ActId, 'MKRestore')"
              >恢复
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
      :IDs="ActID"
      :OpType="OpType"
      :BillType="'MK'"
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
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchMallActes } from "@/api/market.js";
import delDialog from "@/components/common/del_dialog.vue";
////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    act_code: "",
    act_name: "",
    act_type: 1,
    time: [],
    begin_time: "",
    end_time: "",
    act_status: "",
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
  query.search.begin_time = "";
  query.search.end_time = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.begin_time = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.end_time = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchMallActes({
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
/////////////////////////////////////////////////////////////////////////////////
//弹框处理
const ActID = ref([]);
const OpVisible = ref(false);
const OpType = ref("");
//审批和取消
const OpApproveAndCancel = (ID, type) => {
  OpVisible.value = true;
  ActID.value = [];
  ActID.value.push(ID);
  OpType.value = type;
};
const RefreshData = (val) => {
  //列表刷新
  handleSearch();
};
const CloseVisible = (isBoolean) => {
  OpVisible.value = isBoolean;
};
/////////////////////////////////////////////////////////////////////////////////
//新增活动
const handleAdd = () => {
  common.ClosePageTag("营销活动详情");
  router.push({
    path: "/market_page_info",
    query: {
      Type: "Add",
      mkType: 1,
    },
  });
};
const handleEdit = (ID, Type) => {
  common.ClosePageTag("营销活动详情");
  router.push({
    path: "/market_page_info",
    query: {
      Type: Type,
      ID: ID,
      mkType: 1,
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
const Init = () => {
  getData();
};
Init();
/////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "买赠活动") {
        isRenovate = 1;
      }
    });
    if (
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "买赠活动"
    ) {
      handleSearch();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
