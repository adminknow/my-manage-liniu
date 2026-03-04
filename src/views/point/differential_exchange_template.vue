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
                placeholder="请输入模板名称/商品名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.template_status"
                placeholder="状态"
              >
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="5" :offset="1"> </el-col>
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
      <el-table-column prop="TemplateName" align="center" label="名称">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.TemplateId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.TemplateName }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="TemplateRemark" align="center" label="备注">
      </el-table-column>

      <el-table-column align="center" label="状态" width="120">
        <template #default="scope">
          <p>{{ scope.row.TemplateStatus == 0 ? "停用" : "正常" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="scope.row.TemplateStatus == 0"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.TemplateId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.TemplateStatus == 1"
              class="button-op-del"
              size="small"
              @click="handleDisable(scope.row.TemplateId)"
              >停用
            </el-button>
            <el-button
              v-if="scope.row.TemplateStatus == 0"
              class="button-op-enable"
              size="small"
              @click="handleEnable(scope.row.TemplateId)"
              >启用
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
import {
  SearchExchangeTemplates,
  EnableExchangeTemplate,
  DisableExchangeTemplate,
} from "@/api/goods.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    template_name: "",
    template_status: "",
    search_keyword: "",
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
  let res = await SearchExchangeTemplates({
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
/////////////////////////////////////////////////////////////////////////////////
//新增差异兑换详情
const handleAdd = () => {
  common.ClosePageTag("差异兑换详情");
  router.push({
    path: "/differential_exchange_template_info",
    query: {
      Type: "Add",
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
//编辑
const handleEdit = (TemplateId, type) => {
  common.ClosePageTag("差异兑换详情");
  router.push({
    path: "/differential_exchange_template_info",
    query: {
      Type: type,
      ID: TemplateId,
    },
  });
};
/////////////////////////////////////////////////////////////////////////////////
//停用
const handleDisable = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableExchangeTemplate({
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
//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableExchangeTemplate({
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
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "差异兑换模板") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "差异兑换模板"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
