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
                placeholder="帐号/电话"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.create_unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入券商名称"
                :remote-method="searchUnits"
                remote-show-suffix
                :loading="unitSearchLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="`${item.UnitCode}-${item.UnitName}`"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="7">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增用户
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="font-size: 14px; color: red">
      默认密码为：帐号后五位加上感叹号
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
      <el-table-column prop="UserName" align="center" label="姓名">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.UserId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.UserName }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="UserAccount"
        align="center"
        label="帐号"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="UserCell"
        align="center"
        label="手机"
        width="120"
      ></el-table-column>
      <el-table-column align="center" label="角色">
        <template #default="scope">
          {{ scope.row.UserRoleDesc }}
        </template>
      </el-table-column>
      <el-table-column
        prop="UserTypeDesc"
        align="center"
        label="类型"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="UserStatusDesc"
        align="center"
        label="状态"
        width="60"
      ></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="280">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <div class="button-mgl">
            <div v-if="scope.row.UserName != '系统管理员'">
              <el-button
                v-if="
                  (scope.row.UserType != '1' &&
                    loginUser.UnitId == scope.row.CreateUnitId) ||
                  loginUser.UnitType == 1
                "
                class="button-op-edit"
                size="small"
                @click="handleEdit(scope.row.UserId, 'Edit')"
                >编辑
              </el-button>
              <el-button
                v-if="
                  scope.row.UserStatus == 1 &&
                  loginUser.UnitId == scope.row.CreateUnitId
                "
                class="button-op-stop"
                size="small"
                @click="handleStop(scope.row.UserId)"
                >停用
              </el-button>
              <el-button
                v-if="
                  scope.row.UserStatus == 0 &&
                  loginUser.UnitId == scope.row.CreateUnitId
                "
                class="button-op-enable"
                size="small"
                @click="handleEnable(scope.row.UserId)"
                >启用
              </el-button>
              <el-button
                class="button-op-del"
                size="small"
                v-if="IsRight && loginUser.UnitId != scope.row.CreateUnitId"
                @click="handleReset(scope.row.UserId)"
                >重置密码
              </el-button>
              <el-button
                class="button-op-del"
                size="small"
                v-if="
                  loginUser.UnitId == scope.row.CreateUnitId &&
                  scope.row.HasBindFans == '是'
                "
                @click="handleViewFans(scope.row.UserId)"
                >绑定的粉丝
              </el-button>
            </div>
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
    <el-dialog
      title="重置密码"
      v-model="editVisible"
      width="38%"
      :show-close="false"
    >
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password"></el-input>
              <span>tip:密码不得少于8位，并且包含数字、字母、特殊符号</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            @click="onSaveModal"
            :loading="BtnLoadingModal"
            >保 存</el-button
          >
          <el-button class="button2" @click="editVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 绑定的粉丝列表 -->
    <el-dialog
      title="绑定的粉丝列表"
      v-model="fansVisible"
      width="68%"
      :show-close="false"
    >
      <el-table
        :data="tableFansData"
        border
        class="table"
        ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="AppName"
          align="center"
          label="应用"
        ></el-table-column>
        <el-table-column align="left" label="小程序">
          <template #default="scope">
            <p>{{ scope.row.AccountName }}</p>
            <p>{{ scope.row.Openid }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" align="left" label="粉丝注册的会员信息">
          <template #default="scope">
            <p>姓名：{{ scope.row.VipName }}</p>
            <p>手机：{{ scope.row.VipCell }}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="登录信息">
          <template #default="scope">
            <p>登录单位：{{ scope.row.UnitName }}</p>
            <p>登录时间：{{ scope.row.LoginTime }}</p>
            <p>登录角色：{{ scope.row.RoleName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="90">
          <template #default="scope">
            <div class="button-mgl">
              <el-button
                class="button-op-del"
                size="small"
                @click="handleUnbind(scope.row.UserId, scope.row.AppId)"
                >解绑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="fansVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import md5 from "js-md5";
import Cookie from "js-cookie";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import {
  SearchUsers,
  DeleteUser,
  EnableUser,
  DisableUser,
  ResetPwd,
  HasRight,
  UnbindUserFans,
  GetUserFansMapList,
  SearchUnites,
} from "../../api/index.js";
export default {
  name: "user",
  setup() {
    const router = useRouter();
    const store = useStore();
    const query = reactive({
      UserID: "",
      search: {
        search_keyword: "",
        return_user_role: 1,
        create_unit_id: "",
      },
      PageStartRow: 1,
      PageRowCount: 15,
    });
    const tableLoading = ref(false);
    const tableData = ref([]);
    const tableFansData = ref([]);
    const userList = ref([]);
    const pageTotal = ref(0);
    const IsRight = ref(false);
    const editVisible = ref(false);
    const fansVisible = ref(false);

    //初始化表格
    const formRef = ref(null);
    const windowHeight = common.windowScreenHeight();
    const BtnLoadingModal = ref(false);
    const form = reactive({
      password: "",
    });
    const rules = {
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    //重置密码
    const onSaveModal = async () => {
      BtnLoadingModal.value = true;
      if (form.password.length < 8) {
        ElMessage.error("密码长度不得低于8位");
        BtnLoadingModal.value = false;
        return;
      }
      var testPassword =
        /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&* ~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^& *~()-+=]+$)(?![0-9\W_!@#$%^&* ~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*~()-+=]/;
      if (testPassword.test(form.password) === false) {
        ElMessage.error("密码强度不够");
        BtnLoadingModal.value = false;
        return;
      }
      let res = await ResetPwd({
        NewPwd: md5(form.password),
        UserId: query.UserID,
      });
      BtnLoadingModal.value = false;
      if (res.Code == 200) {
        formRef.value.resetFields();
        editVisible.value = false;
        ElMessage.success("操作成功");
        query.PageStartRow = 1;
        getData();
      } else {
        ElMessage.warning(res.Message);
      }
    };
    // 获取表格数据
    const getData = async () => {
      var data = {
        user_keyword: query.title,
        return_user_role: 1,
      };
      tableLoading.value = true;
      let res = await SearchUsers({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotal.value = res.DataMap.ToalCount;
      }
    };
    getData();
    const loginUser = JSON.parse(Cookie.get("User"));
    const BoolRight = async () => {
      let res = await HasRight({ RightCode: "reset_user_pwd" });
      if (res.Code == 200) {
        IsRight.value = res.DataMap;
      }
    };
    BoolRight();
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
    const handleEdit = (ID, type) => {
      common.ClosePageTag("用户详情");
      router.push({
        path: "/userInfo",
        query: {
          Type: type,
          ID: ID,
        },
      });
    };
    //停用
    const handleStop = (ID) => {
      ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await DisableUser({
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
    //启用
    const handleEnable = (ID) => {
      ElMessageBox.confirm("确定要启用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await EnableUser({
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
    const userID = ref("");
    //解绑
    const handleUnbind = (ID, Appid) => {
      ElMessageBox.confirm("确定要解绑吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await UnbindUserFans({
          UserId: ID,
          AppId: Appid,
        });
        if (res.Code == 200) {
          fansVisible.value = false;
          query.PageStartRow = 1;
          getData();
          ElMessage.success("操作成功");
        } else {
          ElMessage.warning(res.Message);
        }
      });
    };
    //查看绑定的粉丝列表
    const handleViewFans = async (ID) => {
      userID.value = ID;
      fansVisible.value = true;
      let res = await GetUserFansMapList({
        UserId: ID,
      });
      if (res.Code == 200) {
        tableFansData.value = res.DataMap;
      }
    };

    //删除
    const handleDel = (ID) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      }).then(async () => {
        let res = await DeleteUser({
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
    const handleReset = (ID) => {
      query.UserID = ID;

      editVisible.value = true;
    };
    //新增任务
    const handleAdd = () => {
      common.ClosePageTag("用户详情");
      router.push({
        path: "/userInfo",
        query: {
          Type: "Add",
        },
      });
    };
    // 搜索券商
    // 券商查询相关
    const unitSearchLoading = ref(false);
    const unitList = ref([]);
    const searchUnits = async (queryString) => {
      if (!queryString) {
        unitList.value = [];
        return;
      }

      try {
        unitSearchLoading.value = true;
        const res = await SearchUnites({
          SearchCondition: {
            search_keyword: queryString,
            unit_type: 2,
          },
          NoPage: true,
          PageStartRow: 0,
          PageRowCount: 100000,
        });

        if (res.Code == 200) {
          unitList.value = res.DataMap.Data || [];
        } else {
          ElMessage.warning("获取券商列表失败");
          unitList.value = [];
        }
      } catch (error) {
        console.error("搜索券商出错:", error);
        unitList.value = [];
      } finally {
        unitSearchLoading.value = false;
      }
    };
    watch(
      () => router.currentRoute.value,
      (data) => {
        let isRenovate = 0;
        store.state.tags.tagsList.forEach((row) => {
          if (row.title == "用户") {
            isRenovate = 1;
          }
        });
        if (
          store.state.tags.pageSaerch.Search == 1 &&
          isRenovate == 1 &&
          store.state.tags.pageSaerch.titlePage == "用户"
        ) {
          query.PageStartRow = 1;
          getData();
          store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
      }
    );
    return {
      query,
      tableData,
      pageTotal,
      handleSearch,
      handlePageChange,
      handleSizeChange,
      handleEdit,
      handleStop,
      handleDel,
      handleReset,
      handleEnable,
      handleUnbind,
      handleViewFans,
      tableLoading,
      handleAdd,
      IsRight,
      editVisible,
      fansVisible,
      userID,
      formRef,
      form,
      rules,
      BtnLoadingModal,
      onSaveModal,
      userList,
      loginUser,
      windowHeight,
      searchUnits,
      tableFansData,
      unitList,
      unitSearchLoading,
    };
  },
};
</script>

<style scoped></style>
