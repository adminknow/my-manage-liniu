<template>
  <el-dialog
    title="差异兑换模板"
    v-model="dialogVisible"
    width="48%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div style="width:100%;height: 18px;"></div>
    <div class="handle-box" style="padding-top: 0">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="">
              <el-input
                v-model="queryParams.search.search_keyword"
                clearable
                placeholder="关键字查询"
                @keyup.enter="handleSearch"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="queryParams.search.template_status"
                placeholder="状态"
              >
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
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
    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      height="400"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" label="" width="50">
        <template #default="scope">
          <el-checkbox
            v-model="scope.row.Select"
            @change="handleRowSelect(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="TemplateName" align="center" label="模板名称">
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template #default="scope">
          <p>{{ scope.row.TemplateStatus == 1 ? "正常" : "停用" }}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="queryParams.PageStartRow"
        v-model:page-size="queryParams.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          :loading="saveLoading"
          :disabled="!hasSelectedTemplate"
          @click="handleSaveTemplate"
          >确 认</el-button
        >
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { SearchExchangeTemplates } from "@/api/goods.js";

import { ElMessage } from "element-plus";
const props = defineProps({
  Visible: Boolean,
  billID: {
    type: String,
    default: "",
  },
});
// Emits 定义
const emit = defineEmits(["closeVisible", "confirm"]);

// 响应式数据
const dialogVisible = ref(false);
const tableData = ref([]);
const tableLoading = ref(false);
const saveLoading = ref(false);
const pageTotal = ref(0);

const queryParams = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
  search: {
    search_keyword: "",
    template_status: "", // 状态
  },
});

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = () => {
  emit("closeVisible", false);
};
// 搜索方法
const handleSearch = () => {
  queryParams.PageStartRow = 1; // 搜索时重置到第一页
  initData(); // 调用API重新获取数据
};
// 初始化数据
const initData = async () => {
  try {
    tableLoading.value = true;
    // 调用API获取评价数据
    let res = await SearchExchangeTemplates({
      PageStartRow: (queryParams.PageStartRow - 1) * queryParams.PageRowCount,
      PageRowCount: queryParams.PageRowCount,
      NoPage: false,
      SearchCondition: {},
    });
    if (res.Code === 200) {
      if (res.DataMap.ToalCount > 0) {
        tableData.value = res.DataMap.Data;
        tableData.value.forEach((row) => {
          row.Select = false;
        });
      }
      pageTotal.value = res.DataMap.ToalCount || 0;
      // 重置搜索条件
      queryParams.PageStartRow = 1;
      queryParams.search.search_keyword = "";
    } else {
      ElMessage.error(res.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取评价数据出错:", error);
  } finally {
    tableLoading.value = false;
  }
};
// 分页处理
const handlePageChange = (val) => {
  queryParams.PageStartRow = val;
  initData(); // 页码变化时重新加载数据
};
// 页面大小变化处理
const handleSizeChange = (val) => {
  queryParams.PageRowCount = val;
  queryParams.PageStartRow = 1;
  initData(); // 页大小变化时重新加载数据
};
const handleSaveTemplate = async () => {
  if (!hasSelectedTemplate.value) {
    ElMessage.warning("请选择至少一个模板");
    return;
  }

  try {
    saveLoading.value = true;
    // 发射确认事件，传递选中的模板数据
    emit("confirm", {
      templates: selectedTemplates.value,
    });

    ElMessage.success("保存成功");
    handleClose();
  } catch (error) {
    console.error("保存模板失败:", error);
    ElMessage.error("保存失败，请稍后重试");
  } finally {
    saveLoading.value = false;
  }
};

// 计算属性
const hasSelectedTemplate = computed(() => {
  return tableData.value.some((item) => item.Select);
});
const selectedTemplates = computed(() => {
  return tableData.value.filter((item) => item.Select);
});
const handleRowSelect = (index, row) => {
  tableData.value.forEach((row) => {
    row.Select = false;
  });
  tableData.value[index].Select = true;
};
// 监听器
watch(
  () => props.Visible,
  (newValue) => {
    dialogVisible.value = newValue;
    if (newValue) {
      initData();
    }
  }
);
</script>
<style lang="less"></style>
