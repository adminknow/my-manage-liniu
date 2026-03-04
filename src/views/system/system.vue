<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.title"
                clearable
                placeholder="请输入关键字"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon>
                  <Plus /> </el-icon
                >&nbsp;&nbsp;新&nbsp;&nbsp;增&nbsp;&nbsp;
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon>
                  <Search /> </el-icon
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
    >
      <el-table-column
        prop="ConfigKey"
        align="left"
        label="配置项"
      ></el-table-column>
      <el-table-column prop="ConfigValue" align="left" label="配置值">
        <template #default="scope">
          {{ scope.row.ConfigValue.substring(0,200) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ConfigDesc"
        align="left"
        label="配置描述"
      ></el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column label="修改时间" width="200" align="center">
        <template #default="scope">
          {{ scope.row.ModifyTime ? scope.row.ModifyTime : "" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
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
    <!-- 编辑弹出框 -->
    <el-dialog title="操作" v-model="editVisible" width="42%">
      <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="23" :offset="0">
          <el-form
            label-width="120px"
            ref="formRef"
            :rules="rules"
            :model="form"
          >
            <el-form-item label="配置项" >
              <el-input v-model="form.ConfigKey"></el-input>
            </el-form-item>
            <el-form-item label="配置值" >
              <el-input
                type="textarea"
                :rows="4"
                v-model="form.ConfigValue"
              ></el-input>
            </el-form-item>
            <el-form-item label="配置描述" prop="ConfigDesc">
              <el-input
                type="textarea"
                :rows="4"
                v-model="form.ConfigDesc"
              ></el-input>
            </el-form-item>
            <div style="width: 100%; text-align: center">
              <el-button class="button1" @click="saveEdit" :loading="btnLoading"
                >保 存</el-button
              >
              <el-button class="button2" @click="onClose">关 闭</el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { SearchConfigs, SaveConfig } from "../../api/index.js";

export default {
  name: "system",
  setup() {
    const query = reactive({
      title: "",
      name: "",
      PageStartRow: 1,
      PageRowCount: 15,
    });
    //表单初始化
    const formRef = ref(null);
    const btnLoading = ref(false);
    const rules = {
      ConfigKey: [{ required: true, message: "请输入配置项", trigger: "blur" }],
      ConfigValue: [
        { required: true, message: "请输入配置值", trigger: "blur" },
      ],
      ConfigDesc: [
        { required: true, message: "请输入配置描述", trigger: "blur" },
      ],
    };

    const tableLoading = ref(false);
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = async () => {
      var data = {
        search_keyword: query.title,
      };
      tableLoading.value = true;
      let res = await SearchConfigs({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: data,
      });
      tableLoading.value = false;
      if (res.Code == 200) {

        tableData.value = res.DataMap.Data;
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

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    let form = reactive({
      ConfigKey: "",
      ConfigValue: "",
      ConfigDesc: "",
    });
    const editVisible = ref(false);
    const handleEdit = (index, row) => {
      editVisible.value = true;
      form.ConfigKey = row.ConfigKey;
      form.ConfigValue = row.ConfigValue;
      form.ConfigDesc = row.ConfigDesc;
    };
    //新增任务
    const handleAdd = () => {
      form.ConfigKey = "";
      form.ConfigValue = "";
      form.ConfigDesc = "";
      editVisible.value = true;
    };

    const onClose = () => {
      editVisible.value = false;
      formRef.value.resetFields();
    };
    const saveEdit = () => {
      // 表单校验
      formRef.value.validate(async (valid) => {
        if (valid) {
          btnLoading.value = true;
          let res = await SaveConfig({
            ConfigKey: form.ConfigKey,
            ConfigValue: form.ConfigValue,
            ConfigDesc: form.ConfigDesc,
          });
          btnLoading.value = false;
          if (res.Code == 200) {
            formRef.value.resetFields();
            editVisible.value = false;
            ElMessage.success("保存成功");
            getData();
          } else {
            ElMessage.error(res.Message);
          }
        } else {
          return false;
        }
      });
      //   ElMessage.success(`修改第 ${idx + 1} 行成功`);
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleSizeChange,
      handleDelete,
      handleEdit,
      saveEdit,
      onClose,
      tableLoading,
      formRef,
      btnLoading,
      rules,
      handleAdd,
    };
  },
};
</script>

<style scoped></style>
