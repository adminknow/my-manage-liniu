<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <!-- <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.agreement_status"
                placeholder="请选择状态"
              >
                <el-option label="待审批" value="0"> </el-option>
                <el-option label="已审批待付款" value="1"> </el-option>
                <el-option label="已付款" value="2"> </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增协议
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
      <el-table-column label="类型" align="center">
        <template #default="scope">
          <p v-if="scope.row.AgreementType == 'user'">用户协议</p>
        </template></el-table-column
      >
      <el-table-column prop="AgreementVersion" align="center" label="版本号">
      </el-table-column>
      <el-table-column align="center" label="是否当前版本">
        <template #default="scope">
          <img
            v-if="scope.row.IsCurrent == '1'"
            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/show.png"
            style="width: 20px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="" align="left" label="创建信息" width="180">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="scope.row.AgreementStatus == 0"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.AgreementId)"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.IsCurrent == 0"
              class="button-op-del"
              size="small"
              @click="setClick(scope.row.AgreementId)"
              >选为当前版本
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
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { GetAgreementList, SaveCurrentAgreement } from "../../api/common.js";
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    agreement_type: "",
    agreement_status: "",
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
  let res = await GetAgreementList({
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap ? res.DataMap : [];
    pageTotal.value = res.DataMap.length;
  }
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//新增
const handleAdd = () => {
  common.ClosePageTag("协议详情");
  router.push({
    path: "/agreement_info",
    query: {
      Type: "Add",
    },
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
//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("协议详情");
  router.push({
    path: "/agreement_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
//选为当前版本
const setClick = (ID) => {
  ElMessageBox.confirm("确定要选为当前版本吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await SaveCurrentAgreement({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "协议") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "协议"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
