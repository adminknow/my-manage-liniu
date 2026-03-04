<template>
  <el-dialog
    title="充值记录"
    v-model="dialogVisible"
    width="68%"
    :close-on-click-modal="false"
    @close="handleClose"
    class="log-dialog"
  >
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="">
              <el-input
                class="input-with-icon"
                v-model="queryParams.search.search_keyword"
                clearable
                placeholder="部门/领取人/电话/邮箱"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="17" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button1 button-float"
                round
                @click="searchBtn()"
              >
                <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
      <el-table-column
        prop="StaffDept"
        align="center"
        label="部门"
      ></el-table-column>
      <el-table-column
        prop="StaffName"
        align="center"
        label="领取人"
      ></el-table-column>
      <el-table-column
        prop="StaffCell"
        align="center"
        label="电话"
      ></el-table-column>
      <el-table-column
        prop="StaffEmail"
        align="center"
        label="邮箱"
      ></el-table-column>
      <el-table-column label="卡号" align="center">
        <template #default="scope">
          <div v-for="(obj, index) in scope.row.TakeStaffDetails" :key="index">
            <p>
              {{ obj.TicketCode }}
            </p>
          </div>
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
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  computed,
} from "vue";
import { SearchTicketBillTakeStaffs } from "@/api/bill.js";

import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
const props = defineProps({
  Visible: Boolean,
  billID: {
    type: String,
    default: "",
  },
});
// //使用父组件传递过来的值
// 从属性中解构
const { Visible, billID } = toRefs(props);

const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
// 表格数据
const tableData = ref([]);
const tableLoading = ref(false);
const multipleTable = ref(null);
const evaluateFormRef = ref(null);
// 分页参数
const pageTotal = ref(0);
const queryParams = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
  search: {
    search_keyword: "",
  },
});

// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = () => {
  emit("CloseVisible", false);
};
// 初始化数据
const initData = async () => {
  try {
    tableLoading.value = true;
    // 调用API获取评价数据
    let res = await SearchTicketBillTakeStaffs({
      PageStartRow: (queryParams.PageStartRow - 1) * queryParams.PageRowCount,
      PageRowCount: queryParams.PageRowCount,
      NoPage: false,
      SearchCondition: {
        bill_id: billID.value,
        is_recharge: 1,
        search_keyword: queryParams.search.search_keyword,
      },
    });
    if (res.Code === 200) {
      if (res.DataMap.ToalCount > 0) {
        tableData.value = res.DataMap.Data;
      }
      pageTotal.value = res.DataMap.ToalCount || 0;
      // 重置搜索条件
      queryParams.PageStartRow = 1;
      queryParams.search.search_keyword = "";
    } else {
      ElMessage.error(res.message || "获取数据失败");
    }
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
};
const searchBtn = () => {
  queryParams.PageStartRow = 1; // 搜索时重置到第一页
  initData(); // 执行搜索
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
// 组件挂载时加载数据
onMounted(() => {
  //   initData();
});
// 监听弹窗显示状态
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
<style lang="less">
.log-dialog {
  .el-dialog__body {
    padding-top: 1px !important;
  }
}
</style>
