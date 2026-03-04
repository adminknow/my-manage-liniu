<template>
  <div class="container">
    <div class="handle-box" style="padding-bottom: 10px">
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-select
                style="width: 100%"
                v-model="query.search.account_id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in AccountList"
                  :key="item.AppId"
                  :label="item.AppName"
                  :value="item.AppId"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.kf_wx"
                clearable
                placeholder="请输入微信号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入券商名称"
                :remote-method="remoteMethod"
                remote-show-suffix
                :loading="SelLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in UnitData"
                  :key="index"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                v-if="IsRight"
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
      <el-table-column
        v-if="loginUser.UnitType != 2"
        prop="UnitName"
        align="center"
        label="券商"
      >
      </el-table-column>
      <el-table-column align="center" label="头像" width="180">
        <template #default="scope">
          <img :src="scope.row.KfHeadimgurl" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="KfOpenid" align="center" label="Openid">
      </el-table-column>
      <el-table-column prop="KfNickname" align="center" label="昵称">
      </el-table-column>
      <el-table-column prop="AccountName" align="center" label="小程序">
      </el-table-column>
      <el-table-column align="center" label="在线" width="100">
        <template #default="scope">
          <img
            v-if="scope.row.KfStatus == 1"
            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/show.png"
            style="width: 20px"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理员" width="80">
        <template #default="scope">
          <p v-if="scope.row.KfAdmin == 1">是</p>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        prop="CreateTime"
        align="center"
        label="创建时间"
      ></el-table-column>
      <el-table-column prop="CreateUnitName" align="center" label="创建单位">
      </el-table-column>
      <el-table-column
        width="100"
        prop="CreateUserName"
        label="创建人"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="scope.row.KfAdmin == 0"
              class="button-op-edit"
              size="small"
              @click="SetKfAdminClick(scope.row.Rid, true)"
              >成为管理员
            </el-button>
            <el-button
              v-if="scope.row.KfAdmin == 1"
              class="button-op-del"
              size="small"
              @click="SetKfAdminClick(scope.row.Rid, false)"
              >注销管理员
            </el-button>
            <el-button
              class="button-op-del"
              size="small"
              v-if="IsRight"
              @click="
                handleDel(scope.row.AccountId, scope.row.UnitId, scope.row.KfWx)
              "
              >删除
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
    <!-- 编辑/新增客服弹出框 -->
    <el-dialog
      class="unit-top"
      title="新增客服"
      v-model="Visible"
      width="38%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
    <div style="width:100%;height:18px"></div>
      <el-form
        ref="formSubmit"
        :model="form_modal"
        :rules="rules_modal"
        label-width="160px"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="微信号" label-width="120px">
              <el-input v-model="form_modal.KfWx" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="btnLoading" @click="saveBtnForm"
            >保 存</el-button
          >
          <el-button class="button2" @click="Visible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SearchKfes,
  SaveKf,
  GetAllAccount,
  DeleteKf,
  SetKfAdmin,
} from "@/api/wxxcx.js";
import Cookie from "js-cookie";
import { SearchUnites, HasRightes, GetUnitList } from "@/api/index.js";
const loginUser = JSON.parse(Cookie.get("User"));
const query = reactive({
  search: {
    unit_id: "",
    account_id: "",
    kf_wx: "",
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
  let res = await SearchKfes({
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
////////////////////////////////////////////////////////////////
const handleAdd = (ID) => {
  Visible.value = true;
};
//删除
const handleDel = (ID, UnitId, WxNo) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DeleteKf({
        AccountId: ID,
        UnitId: UnitId,
        WxNo: WxNo,
      });
      if (res.Code == 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => {});
};
//成为或者注销为管理员
const SetKfAdminClick = async (ID, booleaValue) => {
  let res = await SetKfAdmin({
    Rid: ID,
    IsAdmin: booleaValue,
  });
  if (res.Code == 200) {
    query.PageStartRow = 1;
    getData();
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
//新增客服弹窗
const Visible = ref(false);
const AccountList = ref(false);
const btnLoading = ref(false);

const form_modal = reactive({
  KfWx: "",
});
const GetAllAccountApi = async () => {
  let res = await GetAllAccount({});
  if (res.Code == 200) {
    AccountList.value = res.DataMap;
  }
};
GetAllAccountApi();
const saveBtnForm = async () => {
  if (form_modal.KfWx == "") {
    ElMessage.error("请先输入微信号");
    return;
  }
  btnLoading.value = true;
  let res = await SaveKf({ Kf: form_modal });
  btnLoading.value = false;
  if (res.Code == 200) {
    form_modal.KfWx = "";
    ElMessage.success("操作成功！");
    Visible.value = false;
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
//券商
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await GetUnitList({
      SearchCondition: {
        search_keyword: SearchQuery,
        unit_type: 2,
      },
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      UnitData.value = res.DataMap ? res.DataMap : [];
    }
  } else {
    UnitData.value = [];
  }
};
const IsRight = ref(false);
const BoolRight = async () => {
  let arr = ["edit_wxxcx_kf"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_wxxcx_kf;
  }
};
BoolRight();
////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

<style scoped></style>
