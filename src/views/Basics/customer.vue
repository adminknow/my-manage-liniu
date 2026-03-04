<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入名称/编码/手机"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select v-model="query.search.filter" clearable style="width: 100%" placeholder="请选择类型">
                <el-option label="分销商" value="1"></el-option>
                <el-option label="企业客户" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select v-model="query.search.unit_status" clearable style="width: 100%" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()">导出数据
              </el-button>
              <el-button class="button2 button-float" round @click="handleAdd()">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;新建客户
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column prop="UnitCode" align="center" label="客户编码" width="120"></el-table-column>
      <el-table-column prop="UnitName" align="center" label="客户名称">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.UnitId, 'View')" style="color: #f56c6c">
            {{ scope.row.UnitName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="UnitTypeDesc" align="center" label="客户类型" width="140"></el-table-column>
      <el-table-column prop="" align="left" label="联系方式" width="160">
        <template #default="scope">
          <p v-if="scope.row.UnitContact">{{ scope.row.UnitContact }}</p>
          <p v-if="scope.row.UnitTel">{{ scope.row.UnitTel }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="GoodsDiscount" align="center" label="折扣" width="70"></el-table-column>
      <el-table-column prop="DefaultUserAccount" label="缺省登录帐号" align="center" width="130"></el-table-column>
      <el-table-column prop="UnitStatusDesc" label="客户状态" align="center" width="90"></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="200">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId" class="button-op-edit" size="small"
              @click="handleEdit(scope.row.UnitId, 'Edit')">编辑
            </el-button>
            <el-button v-if="
              scope.row.UnitStatus == 1 &&
              loginUser.UnitId == scope.row.CreateUnitId
            " class="button-op-del" size="small" @click="handleDel(scope.row.UnitId)">停用
            </el-button>
            <el-button v-if="
              scope.row.UnitStatus == 0 &&
              loginUser.UnitId == scope.row.CreateUnitId
            " class="button-op-edit" size="small" @click="handleEnable(scope.row.UnitId)">启用
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="IsRight && loginUser.UnitId == scope.row.CreateUnitId"
              @click="handleResetPws(scope.row.UserId)">重置密码
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="!scope.row.DefaultUserAccount"
              @click="handleCreateUser(scope.row.UnitId)">创建缺省登录帐号
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="
              scope.row.CreateUnitName == '礼牛网' &&
              scope.row.UnitTypeDesc == '券商的企业客户'
            " @click="handleJumpUrl(scope.row.UnitId)">员工花名册
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
    <!-- 编辑密码弹出框 -->
    <el-dialog title="重置密码" v-model="editVisible" width="38%" :show-close="false" :close-on-click-modal="false">
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="onSaveModal">保 存</el-button>
          <el-button class="button2" @click="editVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑信息弹出框 -->
    <el-dialog title="操作" v-model="formeEitVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="22">
          <el-form ref="formSubmit" :model="form_modal" :rules="rules_modal" label-width="120px">
            <el-form-item prop="UnitType" label="类型">
              <el-select v-model="form_modal.UnitType" clearable style="width: 100%" placeholder="请选择客户类型">
                <el-option label="分销商" value="31"></el-option>
                <el-option label="企业客户" value="32"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="UnitCode" label="编码">
              <el-input v-model="form_modal.UnitCode" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item prop="UnitName" label="名称">
              <el-input v-model="form_modal.UnitName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入地址"
                v-model="form_modal.UnitAddress"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form_modal.UnitContact" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form_modal.UnitTel" placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item label="折扣">
              <el-input style="width: 30%" v-model="form_modal.GoodsDiscount" placeholder="请输入折扣">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="缺省登陆帐号" v-if="form_modal.UnitId == ''">
              <el-radio-group v-model="form_modal.addUserValueDesc">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
              &nbsp;自动创建
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" v-if="isEdit" :loading="btnLoading" @click="saveBtnForm">保 存</el-button>
          <el-button class="button2" @click="formeEitVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useCustomerExport } from "@/hooks/use-export.js";
import {
  SearchUnites,
  GetUnit,
  SaveUnit,
  DisableUnit,
  EnableUnit,
  DisableUser,
  HasRight,
  CreateDefaultUser,
} from "../../api/index.js";
import { ResetPwd } from "../../api/common.js";
import md5 from "js-md5";
import Cookie from "js-cookie";
const router = useRouter();
const query = reactive({
  search: {
    filter: "",
    unit_type: "",
    unit_type_filter: "",
    search_keyword: "",
    unit_status: "",
    only_my_create: 1,
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const IsRight = ref(false);
const editVisible = ref(false);
const formeEitVisible = ref(false);
const btnLoading = ref(false);
const isEdit = ref(false);

//初始化表格
const formRef = ref(null);
const UserId = ref("");

const formSubmit = ref(null);
const form = reactive({
  passward: "",
});
const rules = {
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const form_modal = reactive({
  UnitId: "",
  UnitType: "",
  UnitCode: "",
  UnitName: "",
  UnitAddress: "",
  UnitContact: "",
  UnitTel: "",
  GoodsDiscount: "", //折扣
  UnitConfig: "",
  addUserValueDesc: 0,
});
const rules_modal = {
  UnitType: [{ required: true, message: "请选择类型", trigger: "blur" }],
  UnitCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
  UnitName: [{ required: true, message: "请输入名称", trigger: "blur" }],
};
// 获取表格数据
const getData = async () => {
  switch (query.search.filter) {
    case "":
      query.search.unit_type_filter = "31,32";
      query.search.unit_type = "";
      break;
    case "1":
      query.search.unit_type_filter = "";
      query.search.unit_type = "31";
      break;
    case "2":
      query.search.unit_type_filter = "";
      query.search.unit_type = "32";
      break;

    default:
      break;
  }
  tableLoading.value = true;
  let res = await SearchUnites({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach((row) => {
        row.GoodsDiscount = "";
        let UnitConfig = {};
        if (row.UnitConfig) {
          UnitConfig = JSON.parse(row.UnitConfig);
          row.GoodsDiscount = UnitConfig.GoodsDiscount + "%";
        }
      });
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }

    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
const GetUnitById = async (ID) => {
  let res = await GetUnit({ ObjectId: ID });
  if (res.Code == 200) {
    form_modal.UnitId = res.DataMap.UnitId;
    form_modal.UnitType = res.DataMap.UnitType.toString();
    form_modal.UnitCode = res.DataMap.UnitCode;
    form_modal.UnitName = res.DataMap.UnitName;
    form_modal.UnitAddress = res.DataMap.UnitAddress;
    form_modal.UnitContact = res.DataMap.UnitContact;
    form_modal.UnitTel = res.DataMap.UnitTel;
    let GoodsDiscount = "";
    if (res.DataMap.UnitConfig) {
      GoodsDiscount = JSON.parse(res.DataMap.UnitConfig).GoodsDiscount;
    }
    form_modal.GoodsDiscount = GoodsDiscount;
  }
};
const BoolRight = async () => {
  let res = await HasRight({ RightCode: "reset-pwd" });
  if (res.Code == 200) {
    IsRight.value = res.DataMap;
  }
};
BoolRight();
const saveBtnForm = async () => {
  formSubmit.value.validate(async (valid) => {
    if (valid) {
      let GoodsDiscount = {
        GoodsDiscount: form_modal.GoodsDiscount,
      };
      form_modal.UnitConfig = JSON.stringify(GoodsDiscount);
      btnLoading.value = true;
      let res = await SaveUnit({
        AddUser: form_modal.addUserValueDesc == 1 ? true : false,
        Unit: form_modal,
        IsSubmit: true,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        formSubmit.value.resetFields();
        ElMessage.success("保存成功");
        formeEitVisible.value = false;
        query.PageStartRow = 1;
        getData();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const onSaveModal = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let res = await ResetPwd({
        UserId: UserId.value,
        NewPwd: md5(form.passward),
      });
      if (res.Code == 200) {
        formRef.value.resetFields();
        ElMessage.success("保存成功");
        editVisible.value = false;
        query.PageStartRow = 1;
        getData();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
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
  if (type == "Edit") {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }
  formeEitVisible.value = true;

  GetUnitById(ID);
};

//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableUnit({
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
//停用
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DisableUnit({
        ObjectId: ID,
      });
      if (res.Code == 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => { });
};
const handleResetPws = (ID) => {
  editVisible.value = true;
  UserId.value = ID;
};
//给单位创建缺省登录帐号
const handleCreateUser = (ID) => {
  ElMessageBox.confirm("确定要创建缺省登录帐号？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await CreateDefaultUser({
        UnitId: ID,
      });
      if (res.Code == 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => { });
};

const handleJumpUrl = (ID) => {
  //跳转到花名册
  router.push({
    path: "/roster",
    query: {
      Type: "1",
      ID: ID,
    },
  });
};
//新增
const handleAdd = () => {
  isEdit.value = true;
  formeEitVisible.value = true;
  form_modal.UnitId = "";
  form_modal.UnitType = "";
  form_modal.UnitCode = "";
  form_modal.UnitName = "";
  form_modal.UnitAddress = "";
  form_modal.UnitContact = "";
  form_modal.UnitTel = "";
  form_modal.GoodsDiscount = "100";
  form_modal.addUserValueDesc = 0;
};

//导出
const { handleExport } = useCustomerExport();
const handleOut = () => {
  //导出
  handleExport(query, tableLoading);
};

const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
</script>
