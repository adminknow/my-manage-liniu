<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.taskName" clearable placeholder="名称/参数">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleAdd()">
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
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
      <el-table-column prop="TaskId" align="center" label="ID" width="55"></el-table-column>
      <el-table-column prop="TaskName" align="center" label="任务名称">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.TaskId, 'view')" style="color: #f56c6c">
            {{ scope.row.TaskName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="TaskArgs" align="center" label="任务参数"></el-table-column>
      <el-table-column prop="LatestBeginTime" align="center" label="最新一次执行的开始时间"></el-table-column>
      <el-table-column prop="LatestEndTime" align="center" label="最新一次执行的结束时间"></el-table-column>
      <el-table-column prop="" align="center" label="状态" width="100">
        <template #default="scope">
          {{ scope.row.TaskStatus == "1" ? "启用" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small" @click="handleHostory(scope.row.TaskId)">历史
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="scope.row.TaskStatus == 0"
              @click="handleEdit(scope.row.TaskId, 'update')">编辑
            </el-button>
            <el-button v-if="scope.row.TaskStatus == 1" class="button-op-del" size="small"
              @click="handleStop(scope.row.TaskId)">停用
            </el-button>
            <el-button v-if="scope.row.TaskStatus == 0" class="button-op-del" size="small"
              @click="handleEnable(scope.row.TaskId)">启用
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
    <!-- 弹出框 -->
    <el-dialog title="定时任务的执行历史" :close-on-click-modal="false" v-model="historyVisible" width="80%" :show-close="false">
      <el-dialog width="68%" title="接口历史列表" v-model="innerVisible" append-to-body :close-on-click-modal="false"
        :show-close="true">
        <el-table :data="tableData_hostory1" border class="table" ref="multipleTable_hostory"
          header-cell-class-name="table-header">
          <el-table-column prop="IfName" align="center" label="接口名称"></el-table-column>
          <el-table-column prop="ExecuteLog" align="center" label="日志"></el-table-column>
          <el-table-column prop="BeginTime" align="center" label="开始时间" width="160"></el-table-column>
          <el-table-column prop="EndTime" align="center" label="结束时间" width="160"></el-table-column>
        </el-table>
      </el-dialog>
      <el-table :data="tableData_hostory" border class="table" :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header">
        <el-table-column align="center" label="基本信息">
          <template #default="scope">
            <div>批次ID:{{ scope.row.BatchId }}</div>
            <div>开始时间:{{ scope.row.BeginTime }}</div>
            <div>结束时间:{{ scope.row.EndTime }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ExecuteLog" align="center" label="日志"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button class="button-op-edit" @click="GetIfHisList(scope.row.BatchId)">接口历史
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="query.PageStartRow_hostory" v-model:page-size="query.PageRowCount_hostory"
          :page-sizes="[5, 20, 50]" :total="pageTotal_hostory" @current-change="handlePageChange_hostory"
          @size-change="handleSizeChange_hostory"></el-pagination>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="historyVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  SearchCrontabs,
  SearchCrontabHises,
  EnableCrontab,
  DisableCrontab,
  GetCrontabIfHisList
} from "../../api/index.js";

export default {
  name: "task",
  setup() {
    const router = useRouter();
    const query = reactive({
      TaskId: "",
      taskName: "",
      PageStartRow: 1,
      PageRowCount: 15,
      PageStartRow_hostory: 1,
      PageRowCount_hostory: 5,
    });
    //表单初始化
    const tableLoading = ref(false);
    const historyVisible = ref(false);
    const innerVisible = ref(false);

    const tableData = ref([]);
    const pageTotal = ref(0);
    const tableData_hostory = ref([]);
    const tableData_hostory1 = ref([]);
    const pageTotal_hostory = ref(0);

    // 获取表格数据
    const getData = async () => {
      var data = {
        search_keyword: query.taskName,
      };
      tableLoading.value = true;
      let res = await SearchCrontabs({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: data,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        if (res.DataMap.ToalCount > 0) {
          tableData.value = res.DataMap.Data;
        } else {
          tableData.value = [];
        }
        pageTotal.value = res.DataMap.ToalCount;
      }
    };
    const getDataHostory = async () => {
      var data = {
        task_id: query.TaskId,
      };
      tableLoading.value = true;
      let res = await SearchCrontabHises({
        PageStartRow:
          (query.PageStartRow_hostory - 1) * query.PageRowCount_hostory,
        PageRowCount: query.PageRowCount_hostory,
        NoPage: true,
        SearchCondition: data,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        if (res.DataMap.ToalCount > 0) {
          tableData_hostory.value = res.DataMap.Data;
        } else {
          tableData_hostory.value = [];
        }
        pageTotal_hostory.value = res.DataMap.ToalCount;
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
    const handlePageChange_hostory = (val) => {
      query.PageStartRow_hostory = val;
      getDataHostory();
    };

    const handleSizeChange = (val) => {
      query.PageRowCount = val;
      getData();
    };
    const handleSizeChange_hostory = (val) => {
      query.PageRowCount_hostory = val;
      getDataHostory();
    };
    //编辑任务
    const handleEdit = (TaskId, type) => {
      router.push({
        path: "/taskInfo",
        query: {
          Type: type,
          ID: TaskId,
        },
      });
    };
    //停用
    const handleStop = (id) => {
      // 二次确认
      ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await DisableCrontab({
          ObjectId: id,
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
    const handleEnable = (id) => {
      // 二次确认
      ElMessageBox.confirm("确定要启用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await EnableCrontab({
          ObjectId: id,
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

    //查看历史
    const handleHostory = (TaskId) => {
      historyVisible.value = true;
      query.TaskId = TaskId;
      getDataHostory();
    };
    //新增任务
    const handleAdd = () => {
      router.push({
        path: "/taskInfo",
        query: {
          Type: "Add",
        },
      });
    };
    const GetIfHisList = async (postID) => {
      innerVisible.value = true
      let res = await GetCrontabIfHisList({
        TaskID: query.TaskId,
        BatchID: postID
      })
      if (res.Code == 200) {
        tableData_hostory1.value = res.DataMap
      } else {
        ElMessage.warning(res.Message);
      }
    };
    return {
      query,
      tableData,
      tableData_hostory,
      tableData_hostory1,
      pageTotal,
      pageTotal_hostory,
      handleSearch,
      handlePageChange,
      handleSizeChange,
      handlePageChange_hostory,
      handleSizeChange_hostory,
      tableLoading,
      handleAdd,
      handleEdit,
      innerVisible,
      handleHostory,
      handleStop,
      handleEnable,
      historyVisible,
      GetIfHisList
    };
  },
};
</script>

<style scoped>

</style>
