<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入名称、编码"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.page_status"
                placeholder="单据状态"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option label="停用" value="0"> </el-option>
                <el-option label="启用" value="1"> </el-option>
              </el-select>
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
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增页面
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
      <el-table-column prop="PageCode" align="center" label="编码" width="120">
      </el-table-column>
      <el-table-column prop="PageName" align="center" label="名称" width="160">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.PageId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.PageName }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="页面地址">
        <template #default="scope">
          <p v-if="loginUser.UnitType == 1">
            /pages/activity/index?PageId={{ scope.row.PageId }}
          </p>
          <p v-else>
            /pages/activity/index?PageId={{ scope.row.PageId }}&UnitId={{
              scope.row.CreateUnitId
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column v-if="loginUser.UnitType==1" align="center" label="微信小程序名称" width="160">
        <template #default="scope">
          <p>{{ scope.row.AccountName }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建信息" width="170">
        <template #default="scope">
          <p>{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="70">
        <template #default="scope">
          <p v-if="scope.row.PageStatus == 0">停用</p>
          <p v-if="scope.row.PageStatus == 1">启用</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              v-if="loginUser.UnitId == scope.row.CreateUnitId"
              size="small"
              @click="handleEdit(scope.row.PageId, 'Edit')"
              >编辑
            </el-button>

            <el-button
              v-if="scope.row.PageStatus == 0"
              class="button-op-edit"
              size="small"
              @click="EnableClick(scope.row.PageId)"
              >启用
            </el-button>
            <el-button
              v-if="scope.row.PageStatus == 1"
              class="button-op-del"
              size="small"
              @click="DisableClick(scope.row.PageId)"
              >停用
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="xcxCodeClick(scope.row.PageId)"
              >小程序码
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="xcxCopyClick(scope.row.PageId)"
              >复制页面
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
    <!-- 小程序二维码 -->
    <el-dialog
      title="小程序码"
      v-model="QrCodeVisible"
      width="38%"
      :show-close="false"
    >
      <div style="width: 100%; text-align: center">
        <img :src="QrCodeImg" style="width: 300px" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="QrCodeVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import Cookie from "js-cookie";
import { SearchPages, EnablePage, DisablePage, CopyPage } from "@/api/index.js";
import { GetPageWxxcxQRCode } from "@/api/common.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    page_status: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const QrCodeVisible = ref(false);

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
  let res = await SearchPages({
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
/////////////////////////////////////////////////////////////////////////////////

//新增活动
const handleAdd = () => {
  common.ClosePageTag("装修详情");
  router.push({
    path: "/page_Info",
  });
};
const handleEdit = (ID, Type) => {
  common.ClosePageTag("装修详情");
  router.push({
    path: "/page_Info",
    query: {
      SubmitType: Type,
      ID: ID,
    },
  });
};
const EnableClick = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnablePage({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//停用
const DisableClick = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisablePage({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
const QrCodeImg = ref("");
//查看小程序二维码
const xcxCodeClick = async (ID) => {
  let res = await GetPageWxxcxQRCode({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    QrCodeVisible.value = true;
    QrCodeImg.value = res.DataMap;
  }
};
const xcxCopyClick = async (ID) => {
  ElMessageBox.confirm("确定要复制吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await CopyPage({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
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
      if (row.title == "页面装修") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "页面装修"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
