<template>
  <div class="">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5"> </el-col>
          <el-col :span="11" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon>
                  <el-icon>
                    <Refresh />
                  </el-icon> </el-icon
                >&nbsp;&nbsp;刷&nbsp;&nbsp;新
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      height="400"
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
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
            {{ (scope.row.BeginAmt / 100).toFixed(2) }}><text
              :style="{
                color:
                  scope.row.BeginAmt > scope.row.EndAmt ? '#ff6666' : '#14ee00',
              }"
              >{{ (scope.row.TransAmt / 100).toFixed(2) }}</text
            >
            >{{ (scope.row.EndAmt / 100).toFixed(2) }}
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
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { SearchAccountTransesByTicket } from "@/api/ticket.js";

const props = defineProps({
  //子组件接收父组件传递过来的值
  ticketID: "",
  openModal: Boolean,
});
// //使用父组件传递过来的值
const { openModal, ticketID } = toRefs(props);

watch(
  () => props.openModal,
  (newValue, oldValue) => {
    if (newValue) {
      query.search.ticket_id = ticketID.value;
      getData();
    }
  }
);
const emit = defineEmits(["clickChild"]);
const multipleTableData = ref([]);
const query = reactive({
  search: {
    ticket_id: ticketID.value,
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
  let res = await SearchAccountTransesByTicket({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
    NoPage: true,
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
</script>
<style scoped>

</style>
