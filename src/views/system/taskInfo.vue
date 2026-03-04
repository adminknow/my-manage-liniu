<template>
  <div class="container">
    <el-row :gutter="20" style="margin-top: 20px; padding-bottom: 100px">
      <el-col :span="24" :offset="0">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称" prop="TaskName">
                <el-input v-model="form.TaskName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数" prop="TaskArgs">
                <el-input v-model="form.TaskArgs"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="添加接口"
                v-if="form.TaskId > 0 && form.Type != 'view'"
              >
                <el-button class="button1" @click="handleDialog"
                  >新增接口</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <el-table
                  :data="
                    teskList.slice(
                      (query.PageStartRow - 1) * query.PageRowCount,
                      query.PageStartRow * query.PageRowCount
                    )
                  "
                  border
                  v-loading="tableLoading"
                  class="table"
                  ref="multipleTable"
                  header-cell-class-name="table-header"
                >
                  <el-table-column
                    prop="IfParams"
                    align="center"
                    label="接口名称"
                  >
                    <template #default="scope">
                      {{ scope.row.Interface.IfName }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="IfParams"
                    align="center"
                    label="接口运行参数"
                  ></el-table-column>
                  <el-table-column
                    prop="TaskIfRemark"
                    align="center"
                    label="备注"
                  >
                    <template #default="scope">
                      {{ scope.row.TaskIfRemark }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="IfSchedule"
                    align="center"
                    label="时间频率"
                  ></el-table-column>
                  <el-table-column
                    prop="Ext_LatestBeginTimeStr"
                    align="center"
                    label="最新执行的开始时间"
                  ></el-table-column>
                  <el-table-column
                    prop="Ext_LatestEndTimeStr"
                    align="center"
                    label="最新执行的结束时间"
                  ></el-table-column>
                  <el-table-column label="操作" width="100" align="center">
                    <template #default="scope">
                      <div class="button-mgl">
                        <el-button
                          class="button-op-edit"
                          size="small"
                          v-if="form.Type != 'view'"
                          @click="handleEdit(scope.row.TaskIfId)"
                          >编辑</el-button
                        >
                        <el-button
                          class="button-op-del"
                          size="small"
                          v-if="form.Type != 'view'"
                          @click="handleDel(scope.row.TaskIfId)"
                          >删除</el-button
                        >
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination">
                  <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    v-model:currentPage="query.PageStartRow"
                    v-model:page-size="query.PageRowCount"
                    :page-sizes="[15, 50, 100]"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                  ></el-pagination>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              v-if="form.Type != 'view'"
              class="button1"
              round
              :loading="BtnLoading"
              @click="onSubmit"
            >
              <el-icon> <CirclePlus /> </el-icon
              >&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
            </el-button>
            <el-button round class="button2" @click="onReturn"
              >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 编辑弹出框 -->
    <el-dialog title="新建/修改接口" v-model="editVisible" width="38%">
      <el-row>
        <el-col :span="23" :offset="0">
          <el-form
            label-width="140px"
            ref="formRefModal"
            :rules="rulesModal"
            :model="formModal"
          >
            <el-form-item label="接口名称" prop="IfId">
              <el-select
                v-model="formModal.IfId"
                style="width: 100%"
                placeholder="请选择接口名称"
                clearable
                @change="selInterface"
              >
                <el-option
                  v-for="item in InterfaceList"
                  :key="item.IfId"
                  :label="item.IfName"
                  :value="item.IfId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口描述">
              <el-input
                v-model="formModal.IfIDDesc"
                type="textarea"
                disabled
                maxlength="200"
                :rows="4"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="参数描述">
              <el-input
                v-model="formModal.IfParamsDesc"
                type="textarea"
                disabled
                maxlength="200"
                :rows="4"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="接口运行参数" prop="IfParams">
              <el-input
                v-model="formModal.IfParams"
                type="textarea"
                maxlength="1000"
                :rows="4"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="时间频率" prop="IfSchedule">
              <el-input
                v-model="formModal.IfSchedule"
                placeholder="例如：(分 时 日 月 周)"
              ></el-input>
              <el-row>
                <span>分 时 日 月 周</span>
              </el-row>
            </el-form-item>
            <el-form-item label="执行顺序" prop="IfSort">
              <el-input v-model="formModal.IfSort"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                v-model="formModal.TaskIfRemark"
                maxlength="100"
                :rows="4"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                round
                class="button1"
                @click="onSaveModal"
                :loading="BtnLoadingModal"
                >保 存</el-button
              >
              <el-button round class="button2" @click="onClose"
                >关 闭</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  SaveCrontab,
  GetCrontab,
  GetInterfaceList,
  SaveCrontabIf,
  DeleteCrontabIf,
} from "../../api/index.js";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
export default {
  name: "Edit",
  setup() {
    //初始化表单
    const formRef = ref(null);
    const formRefModal = ref(null);
    const BtnLoading = ref(false);
    const BtnLoadingModal = ref(false);

    //接口名称下拉
    const InterfaceList = ref([]);
    //添加的接口列表
    const teskList = ref([]);
    const tableLoading = ref(false);
    const pageTotal = ref(0);
    const query = reactive({
      PageStartRow: 1,
      PageRowCount: 15,
    });
    //弹框
    const editVisible = ref(false);
    const router = useRouter();
    const rules = {
      TaskArgs: [{ required: true, message: "请输入参数", trigger: "blur" }],
      TaskName: [
        { required: true, message: "请输入任务名称", trigger: "blur" },
      ],
    };
    const rulesModal = {
      IfId: [{ required: true, message: "请输入接口名称", trigger: "blur" }],
      IfParams: [
        { required: true, message: "请输入接口运行参数", trigger: "blur" },
      ],
      IfSort: [{ required: true, message: "请输入执行顺序", trigger: "blur" }],
    };
    const form = reactive({
      TaskId: 0,
      TaskName: "",
      TaskArgs: "",
      Type: "",
    });
    const formModal = reactive({
      TaskIfId: 0,
      TaskId: 0,
      IfId: "",
      IfParams: "",
      IfSchedule: "",
      IfSort: "",
      TaskIfRemark: "", //备注
      IfIDDesc: "", //接口描述
      IfParamsDesc: "", //参数描述
    });
    form.Type = router.currentRoute.value.query.Type;
    form.TaskId = router.currentRoute.value.query.ID
      ? router.currentRoute.value.query.ID
      : 0;

    //提交
    const onSubmit = () => {
      // 表单校验
      formRef.value.validate(async (valid) => {
        if (valid) {
          BtnLoading.value = true;
          let res = await SaveCrontab({ Task: form });
          BtnLoading.value = false;
          if (res.Code == 200) {
            ElMessage.success("保存成功");
            form.TaskId = res.DataMap.TaskId;
            setTimeout(() => {
              common.ClosePageTag("定时任务详情");
              router.go(-1);
            }, 2000);
          } else {
            ElMessage.error(res.Message);
          }
        } else {
          return false;
        }
      });
    };
    //接口任务提交
    const onSaveModal = () => {
      // 表单校验
      formRefModal.value.validate(async (valid) => {
        if (valid) {
          BtnLoadingModal.value = true;
          formModal.TaskId = form.TaskId;
          let res = await SaveCrontabIf({ TaskIf: formModal });
          BtnLoadingModal.value = false;
          if (res.Code == 200) {
            editVisible.value = false;
            ElMessage.success("保存成功");
            GetDetail(formModal.TaskId);
          } else {
            ElMessage.error(res.Message);
          }
        } else {
          return false;
        }
      });
    };

    //根据ID获取详情
    const GetDetail = async (ID) => {
      let res = await GetCrontab({ ObjectId: ID });
      if (res.Code == 200) {
        form.TaskName = res.DataMap.TaskName;
        form.TaskArgs = res.DataMap.TaskArgs;
        teskList.value = res.DataMap.CrontabIfs; //任务的执行接口列表
        pageTotal.value = res.DataMap.CrontabIfs.length;
      }
    };
    if (form.TaskId > 0) {
      GetDetail(form.TaskId);
    }
    //新增接口
    const handleDialog = () => {
      editVisible.value = true;
    };
    //查询所有接口
    const GetData = async () => {
      let res = await GetInterfaceList({
        PageStartRow: 0,
        PageRowCount: 100,
      });
      if (res.Code == 200) {
        InterfaceList.value = res.DataMap;
      }
    };
    GetData();
    const handlePageChange = (val) => {
      query.PageStartRow = val;
    };
    const handleSizeChange = (val) => {
      query.PageRowCount = val;
    };
    //返回上一页
    const onReturn = () => {
      common.ClosePageTag("定时任务详情");
      router.go(-1);
    };
    //弹框关闭
    const onClose = () => {
      editVisible.value = false;
      formRef.value.resetFields();
    };
    //下拉框选择接口名称触发
    const selInterface = (val) => {
      let InterList = InterfaceList.value;
      InterList.forEach((item) => {
        if (item.IfId == val) {
          formModal.IfIDDesc = item.IfRemark ? item.IfRemark : "";
          formModal.IfParamsDesc = item.IfParamsDesc ? item.IfParamsDesc : "";
        }
      });
    };
    //编辑接口信息
    const handleEdit = (id) => {
      editVisible.value = true;
      teskList.value.forEach((item) => {
        if (id == item.TaskIfId) {
          formModal.TaskIfId = item.TaskIfId;
          formModal.TaskId = item.TaskId;
          formModal.IfId = item.IfId;
          formModal.IfParams = item.IfParams;
          formModal.IfSchedule = item.IfSchedule;
          formModal.IfSort = item.IfSort;
          formModal.TaskIfRemark = item.TaskIfRemark;
        }
      });
    };
    //删除
    const handleDel = async (id) => {
      tableLoading.value = true;
      let res = await DeleteCrontabIf({ ObjectId: id });
      tableLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功");
        GetDetail(form.TaskId);
      } else {
        ElMessage.warning(res.Message);
      }
    };
    return {
      formRef,
      form,
      formModal,
      rules,
      rulesModal,
      onSubmit,
      onSaveModal,
      onReturn,
      BtnLoading,
      BtnLoadingModal,
      handleDialog,
      GetDetail,
      formRefModal,
      onClose,
      editVisible,
      GetData,
      InterfaceList,
      teskList,
      tableLoading,
      pageTotal,
      query,
      handlePageChange,
      handleSizeChange,
      handleEdit,
      handleDel,
      selInterface,
    };
  },
};
</script>
<style lang="less" scoped></style>
