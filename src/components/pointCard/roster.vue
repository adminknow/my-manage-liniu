<template>
  <div class="handle-box">
    <el-form label-width="1px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="">
            <el-input
              class="input-with-icon"
              v-model="queryParams.search.search_keyword"
              clearable
              placeholder="名称/编码/手机"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="17" :offset="1">
          <div class="button-mgl">
            <el-button
              v-if="!disabled"
              class="button2 button-float"
              round
              @click="handleInFile()"
            >
              <el-icon> <RefreshRight /> </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;入
            </el-button>
            <el-button
              class="button1 button-float"
              v-if="!disabled"
              round
              @click="handleAdd()"
            >
              <el-icon> <Search /> </el-icon>&nbsp;&nbsp;添&nbsp;&nbsp;加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-table
    :data="currentPageData"
    height="400"
    border
    class="table"
    v-loading="tableLoading"
    ref="multipleTable"
    :header-cell-style="{ 'text-align': 'center' }"
    header-cell-class-name="table-header"
    style="width: 100%"
  >
    <!-- <el-table-column type="selection" fixed align="center" width="40" /> -->
    <el-table-column
      prop="StaffDept"
      align="center"
      label="部门"
    ></el-table-column>
    <el-table-column prop="StaffName" align="center" label="姓名">
    </el-table-column>
    <el-table-column prop="StaffCell" align="center" label="电话">
    </el-table-column>
    <el-table-column prop="StaffEmail" align="center" label="邮件">
    </el-table-column>
    <!-- <el-table-column prop="TicketCount" align="center" label="张数">
    </el-table-column> -->
    <el-table-column prop="StaffRemark" align="center" label="备注">
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <div class="button-mgl">
          <el-button
            v-if="!disabled"
            class="button-op-edit"
            size="small"
            @click="handleEdit(scope.$index, 'Edit')"
            >编辑
          </el-button>
          <el-button
            v-if="!disabled"
            class="button-op-del"
            size="small"
            @click="handleDel(scope.$index)"
          >
            删除
          </el-button>
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
  <!-- 添加名单弹出框 -->
  <el-dialog
    title="添加名单"
    v-model="addVisible"
    width="38%"
    :show-close="false"
  >
  <div style="width:100%;height: 18px;"></div>
    <el-form
      ref="formFileRef"
      :rules="addRules"
      :model="addForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="20">
          <el-form-item label="部门">
            <el-input
              v-model="addForm.StaffDept"
              clearable
              placeholder="请输入部门"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="姓名" prop="StaffName">
            <el-input
              v-model="addForm.StaffName"
              clearable
              placeholder="请输入姓名"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="电话" prop="StaffCell">
            <el-input
              v-model="addForm.StaffCell"
              clearable
              placeholder="请输入电话"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="邮件">
            <el-input
              v-model="addForm.StaffEmail"
              clearable
              placeholder="请输入邮件"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input
              v-model="addForm.StaffRemark"
              clearable
              placeholder="请输入备注"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          :loading="addLoading"
          @click="SaveAddModalBtn"
          >保 存</el-button
        >
        <el-button class="button2" @click="cennelAddModalBtn">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 文件导入弹出框 -->
  <el-dialog
    title="导入文件"
    v-model="fileVisible"
    width="38%"
    :show-close="false"
  >
    <div class="file-detail">
      <el-upload
        v-model:file-list="fileList"
        :limit="1"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        class="send-file-home-uploader"
        action="#"
        :http-request="SuccessFile"
        :auto-upload="true"
      >
        <el-button class="button1" round>
          <el-icon>
            <DocumentAdd />
          </el-icon>
          &nbsp;&nbsp;上传文件
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            <el-link
              :underline="false"
              href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/名单.xlsx"
              style="color: #f56c6c"
            >
              下载模板</el-link
            >
          </div>
          <div class="el-upload__tip">支持上传excel文件</div>
        </template>
      </el-upload>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          :loading="FileLoading"
          @click="SaveFileModalBtn"
          >保 存</el-button
        >
        <el-button class="button2" @click="cennelFileModalBtn">关 闭</el-button>
      </span>
    </template>
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
import { GetFileData } from "@/api/imgapi.js";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
const props = defineProps({
  //子组件接收父组件传递过来的值
  disabled: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
});
// //使用父组件传递过来的值
const {} = toRefs(props);

const emit = defineEmits(["CloseVisible", "updateTableData"]);
//右侧列表查询
const queryParams = reactive({
  search: {
    unit_type: "2",
    unit_type_filter: "",
    search_keyword: "",
    unit_status: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableData = ref([]);

const tableLoading = ref(false);
const pageTotal = computed(() => filterTableData.value.length);

const filterTableData = computed(() => {
  if (!queryParams.search.search_keyword) {
    return tableData.value;
  }

  const keyword = queryParams.search.search_keyword.toLowerCase();
  return tableData.value.filter(
    (data) =>
      data.StaffName?.toLowerCase().includes(keyword) ||
      data.StaffDept?.toLowerCase().includes(keyword) ||
      data.StaffCell?.toLowerCase().includes(keyword)
  );
});
const currentPageData = computed(() => {
  const startIndex = (queryParams.PageStartRow - 1) * queryParams.PageRowCount;
  const endIndex = queryParams.PageStartRow * queryParams.PageRowCount;
  return filterTableData.value.slice(startIndex, endIndex);
});

const handleAdd = async (param) => {
  addFormType.value = "Add";
  addVisible.value = true;
};

// 添加名单相关状态
const addVisible = ref(false);
const addLoading = ref(false);
const addFormType = ref("Add");
const formFileRef = ref(null);

// 表单对象
const addForm = reactive({
  StaffDept: "",
  StaffName: "",
  StaffCell: "",
  TicketCount: "1",
  StaffEmail: "",
  StaffRemark: "",
});

// 表单验证规则
const addRules = {
  StaffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  StaffCell: [
    { required: true, message: "请输入电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入有效的手机号码",
      trigger: "blur",
    },
  ],
};

// 保存添加的名单
const SaveAddModalBtn = async () => {
  if (!formFileRef.value) return;

  addLoading.value = true;
  try {
    await formFileRef.value.validate();

    // 数据处理 - 确保 TicketCount 是数字类型
    const formData = { ...addForm };
    formData.TicketCount = Number(formData.TicketCount);
    if (addFormType.value === "Add") {
      // 这里添加API调用，保存新增名单
      // await proxy.$api.roster.add(formData);
      tableData.value.push(formData);
      emit("updateTableData", tableData.value); // 添加此行
      ElMessage.success("添加成功");
    } else {
      // 编辑模式下的保存逻辑
      const index = tableData.value.findIndex(
        (item) =>
          item.StaffCell === addForm.StaffCell &&
          item.StaffName === addForm.StaffName
      );

      // 更新tableData中的记录
      if (index > -1) {
        tableData.value[index] = formData;
      }
      emit("updateTableData", tableData.value); // 添加此行
      ElMessage.success("更新成功");
    }

    addVisible.value = false;
    resetForm();
  } catch (error) {
    console.error("表单验证失败", error);
  } finally {
    addLoading.value = false;
  }
};

// 取消添加/编辑操作
const cennelAddModalBtn = () => {
  addVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  if (formFileRef.value) {
    formFileRef.value.resetFields();
  }
  Object.keys(addForm).forEach((key) => {
    addForm[key] = "";
  });
};

// 编辑行数据
const handleEdit = (index, type) => {
  addFormType.value = type;
  const row = filterTableData.value[index];

  // 填充表单数据
  Object.keys(addForm).forEach((key) => {
    addForm[key] = row[key] || "";
  });

  addVisible.value = true;
};

// 删除行数据
const handleDel = async (index) => {
  const row = filterTableData.value[index];
  // 这里添加API调用，删除名单
  // await proxy.$api.roster.delete(row.id);

  // 从本地数据中移除
  const delIndex = tableData.value.findIndex(
    (item) =>
      item.StaffCell === row.StaffCell && item.StaffName === row.StaffName
  );
  if (delIndex > -1) {
    tableData.value.splice(delIndex, 1);
    emit("updateTableData", tableData.value); // 添加此行
  }
};

const fileparam = ref([]);
// 导入功能实现
const handleInFile = () => {
  // 实现文件上传导入功能
  fileVisible.value = true;
  // 可以使用 el-upload 组件实现
};
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
};
const SuccessFile = async (param) => {
  fileparam.value = param;
};
const handleRemove = async (param) => {
  fileparam.value = {};
};
const FileLoading = ref(false);
const fileVisible = ref(false);
const fileList = ref([]);
const SaveFileModalBtn = async () => {
  let fd = new FormData();
  fd.append("file", fileparam.value.file); //传文件
  fd.append("DataType", "Roster"); //传文件
  FileLoading.value = true;
  let res = await GetFileData(fd);
  FileLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success(`导入成功`);
    tableData.value = res.DataMap;
    pageTotal.value = tableData.value.length;
    fileList.value = [];
    fileVisible.value = false;
    emit("updateTableData", tableData.value); // 添加此行，确保父组件获取最新导入的数据
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
const cennelFileModalBtn = () => {
  fileVisible.value = false;
  fileList.value = [];
};
// 分页处理函数
const handlePageChange = (val) => {
  queryParams.PageStartRow = val;
};

const handleSizeChange = (val) => {
  queryParams.PageRowCount = val;
  queryParams.PageStartRow = 1;
};

// 初始加载数据
const loadData = async () => {
  tableLoading.value = true;
  try {
    // 调用API获取数据
    // const res = await proxy.$api.roster.list();
    // tableData.value = res.data || [];

    // 模拟数据
    tableData.value = [];
    emit("updateTableData", tableData.value); // 添加此行
  } catch (error) {
    console.error("加载数据失败", error);
    ElMessage.error("加载数据失败");
  } finally {
    tableLoading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
watch(
  () => props.data,
  (newValue) => {
    if (Array.isArray(newValue) && newValue.length > 0) {
      // 防止重复更新引起的无限循环
      const ignoreNextEmit = ref(true);

      // 格式化数据并更新tableData
      tableData.value = newValue.map((item) => ({
        StaffId: item.StaffId || "",
        StaffDept: item.StaffDept || "",
        StaffName: item.StaffName || "",
        StaffCell: item.StaffCell || item.PhoneNumber || "",
        TicketCount: item.TicketCount || 1,
        StaffEmail: item.StaffEmail || item.Email || "",
        StaffRemark: item.StaffRemark || "",
      }));

      // 重置忽略标志
      nextTick(() => {
        ignoreNextEmit.value = false;
      });
    } else if (Array.isArray(newValue) && newValue.length === 0) {
      // 如果传入空数组，清空表格数据
      tableData.value = [];
    }
  },
  { immediate: true, deep: true }
);
watch(
  tableData,
  (newValue) => {
    emit("updateTableData", newValue);
  },
  { deep: true }
);
</script>
<style lang="less">
.send-file-home-uploader {
  .el-upload--text {
    border: none;
    width: auto;
    height: 40px;
  }
}
</style>
