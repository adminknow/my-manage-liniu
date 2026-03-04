<template>
  <el-dialog
    class="datatable-ticket"
    :title="title"
    v-model="dialogVisible"
    width="80%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    @open="handleDialogOpen"
    @close="handleDialogClose"
  >
    <!-- 搜索表单 -->
    <ticket-search-form
      v-model:search="localQuery.search"
      @search="handleSearch"
    />

    <!-- 券表格 -->
    <ticket-table :data="tableData" :loading="loading" />

    <!-- 分页 -->
    <common-pagination
      v-model:current-page="localQuery.PageStartRow"
      v-model:page-size="localQuery.PageRowCount"
      :total="pageTotal"
      :page-sizes="[15, 50, 100]"
      :disabled="loading"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { SearchVipTicketes } from "@/api/vip.js";
import { ref, computed, watch, nextTick, onMounted } from "vue";
import TicketSearchForm from "@/components/vip/TicketSearchForm.vue";
import TicketTable from "@/components/vip/TicketTable.vue";
import CommonPagination from "@/components/common/CommonPagination.vue";
// 定义组件属性
const props = defineProps({
  // 搜索表单数据
  query: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "券明细",
  },
  // 搜索等待状态
  visible: {
    type: Boolean,
    default: false,
  },
});
// 定义事件
const emit = defineEmits(["update:visible", "close", "data-change"]);

// 响应式数据
const tableData = ref([]);
const loading = ref(false);
const pageTotal = ref(0);

// 本地查询参数（避免直接修改props）
const localQuery = ref({
  search: { ...props.query.search },
  PageStartRow: props.query.PageStartRow || 1,
  PageRowCount: props.query.PageRowCount || 15,
});
// 弹窗显示状态的双向绑定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

// 分页导航
const handlePageChange = (val) => {
  localQuery.value.PageStartRow = val;
  getData();
};

const handleSizeChange = (val) => {
  localQuery.value.PageRowCount = val;
  localQuery.value.PageStartRow = 1; // 重置到第一页
  getData();
};
// 获取表格数据
const getData = async () => {
  if (!localQuery.value.search?.vip_id) {
    console.warn("缺少必要的查询参数 vip_id");
    return;
  }

  loading.value = true;

  try {
    const res = await SearchVipTicketes({
      PageStartRow:
        (localQuery.value.PageStartRow - 1) * localQuery.value.PageRowCount,
      PageRowCount: localQuery.value.PageRowCount,
      SearchCondition: localQuery.value.search,
    });

    if (res.Code === 200) {
      tableData.value = res.DataMap?.Data || [];
      pageTotal.value = res.DataMap?.ToalCount || 0;

      // 触发数据变化事件
      emit("data-change", {
        data: tableData.value,
        total: pageTotal.value,
      });
    } else {
      ElMessage.error(res.Message || "获取券数据失败");
      tableData.value = [];
      pageTotal.value = 0;
    }
  } catch (error) {
    console.error("获取券数据失败:", error);
    ElMessage.error("获取券数据失败，请稍后重试");
    tableData.value = [];
    pageTotal.value = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  localQuery.value.PageStartRow = 1;
  getData();
};

// 弹窗打开时的处理
const handleDialogOpen = () => {
  // 重置本地查询参数
  localQuery.value = {
    search: { ...props.query.search },
    PageStartRow: props.query.PageStartRow || 1,
    PageRowCount: props.query.PageRowCount || 15,
  };
};
// 弹窗关闭时的处理
const handleDialogClose = () => {
  // 清空数据
  tableData.value = [];
  pageTotal.value = 0;
  loading.value = false;

  emit("close");
};
// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      nextTick(() => {
        getData();
      });
    }
  }
);
// 监听查询参数变化
watch(
  () => props.query,
  (newQuery) => {
    if (newQuery && props.visible) {
      localQuery.value = {
        search: { ...newQuery.search },
        PageStartRow: newQuery.PageStartRow || 1,
        PageRowCount: newQuery.PageRowCount || 15,
      };

    }
  },
  { deep: true, immediate: false }
);
</script>
