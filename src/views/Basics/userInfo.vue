<template>
  <div>
    <div class="container">
      <el-row :gutter="20" style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="24" :offset="0">
          <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
            <el-row>
              <el-col :span="10">
                <el-form-item label="姓名" prop="UserName">
                  <el-input v-model="form.UserName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="电话">
                  <el-input disabled="true" v-model="form.UserCell"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="帐号" prop="UserAccount">
                  <el-input v-model="form.UserAccount" @focus="handlerIptClick" maxlength="20"
                    show-word-limit></el-input>
                  <span style="position: relative; color: #909399">最短6位，最长20位</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="密码">
                  <el-input type="password" v-model="form.UserPassword" :readonly="readonly"
                    @focus="handlerIptClick"></el-input>
                  <span style="color: #909399">密码不得少于8位，并且包含数字、字母、特殊符号</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="可访问角色">
                  <el-button class="button1" @click="AddRole">添加角色</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="" v-if="form.UserRoles.length > 0">
                  <div style="padding-bottom: 100px">
                    <div v-for="roleitem in form.UserRoles" :key="roleitem.id" style="
                        height: 100px;
                        border: 1px solid rgb(231, 236, 241);
                        margin-bottom: 10px;
                        background: #ecf5ff;
                        width: 100%;
                      ">
                      <div class="col-md-4">
                        <div class="dashboard-stat2 bordered" style="padding: 15px; margin: 0; cursor: pointer">
                          <div class="display" style="margin: 0; position: relative">
                            <div class="number">
                              <h3 class="font-blue-sharp">
                                <el-popover :content="roleitem.RoleName" placement="top-start">
                                  <template #reference>
                                    <span data-counter="counterup" class="roleName">{{ roleitem.RoleName }}</span>
                                  </template>
                                </el-popover>
                                <small class="font-blue-sharp"></small>
                              </h3>
                              <small class="unitName">{{
                                roleitem.UnitName
                                }}</small>
                            </div>
                            <div class="icon" style="
                                display: inline-block;
                                float: right;
                                padding: 0 0 0;
                              ">
                              <i class="el-icon-mphuiyuan"></i>
                            </div>
                            <div @click="dellist(roleitem.id)" style="
                                position: absolute;
                                right: 3px;
                                bottom: -74px;
                              ">
                              <el-icon size="16px" style="float: right; color: red">
                                <Delete />
                              </el-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button v-if="Type != 'View'" class="button1" round :loading="btnLoading" @click="onSubmit">
                <el-icon>
                  <CirclePlus />
                </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
              </el-button>
              <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="添加组织机构与角色" v-model="editVisible" width="38%">
      <div style="width:100%;height:18px"></div>
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form ref="formModalRef" :model="formModal" :rules="rulesModal" label-width="120px">
            <el-form-item label="组织机构" prop="unitid">
              <!-- 如果是礼牛的话，需要把创建单位加上，否则不加 -->
              <el-select v-if="loginUser.UnitType == 1" v-model="formModal.unitid" filterable style="width: 100%"
                placeholder="请输入关键词">
                <el-option v-for="(obj, index) in ArrUnit" :key="index" :label="
                    obj.CreateUnitName +
                    '-' +
                    obj.UnitName +
                    '(' +
                    obj.UnitTypeDesc +
                    ')'
                  " :value="obj.UnitId">
                </el-option>
              </el-select>
              <el-select v-else v-model="formModal.unitid" filterable style="width: 100%" placeholder="请输入关键词">
                <el-option v-for="(obj, index) in ArrUnit" :key="index"
                  :label="obj.UnitName + '(' + obj.UnitTypeDesc + ')'" :value="obj.UnitId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleuser">
              <el-select v-if="loginUser.UnitType == 1" v-model="formModal.roleId" placeholder="角色" style="width: 100%">
                <el-option v-for="item in ArrRoleUser" :key="item.RoleId"
                  :label="item.CreateUnitName + '-' + item.RoleName" :value="item.RoleId">
                </el-option>
              </el-select>
              <el-select v-else v-model="formModal.roleId" placeholder="角色" style="width: 100%">
                <el-option v-for="item in ArrRoleUser" :key="item.RoleId" :label="item.RoleName" :value="item.RoleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onSaveModal" :loading="BtnLoadingModal" class="button1">确 定</el-button>
          <el-button class="button2" @click="editVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from "@/api/imgindex";
import { UploadSingle } from "@/api/imgapi.js";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import md5 from "js-md5";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import Cookie from "js-cookie";
import {
  GetUnitList,
  SearchRoles,
  GetUser,
  SaveUser,
} from "../../api/index.js";
import { useRouter, onBeforeRouteLeave } from "vue-router";
const loginUser = JSON.parse(Cookie.get("User"));
const store = useStore();
const router = useRouter();
const formRef = ref(null);
const readonly = ref(true);

const formModalRef = ref(null);
const btnLoading = ref(false);
const BtnLoadingModal = ref(false);
const editVisible = ref(false);
const SelLoading = ref(false);
const ArrUnit = ref([]);
const ArrRoleUser = ref([]);
let Type = ref("");

const rules = {
  UserName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  UserAccount: [{ required: true, message: "请输入帐号", trigger: "blur" }],
  UserCell: [{ required: true, message: "请输入电话", trigger: "blur" }],
};
let form = reactive({
  UserId: 0,
  UserName: "",
  UserAccount: "",
  UserCell: "",
  UserPassword: "",
  UserRoles: [],
});
let ruleFormCopy = reactive({
  UserId: 0,
  UserName: "",
  UserAccount: "",
  UserCell: "",
  UserPassword: "",
  UserRoles: [],
});

form.UserId = router.currentRoute.value.query.ID
  ? router.currentRoute.value.query.ID
  : 0;
Type = router.currentRoute.value.query.Type
  ? router.currentRoute.value.query.Type
  : "";
const formModal = reactive({
  unitid: "",
  roleId: "",
});

const onSaveModal = async (query) => {
  formModalRef.value.validate(async (valid) => {
    if (valid) {
      BtnLoadingModal.value = true;
      if (ArrRoleUser.value.length == 0) {
        BtnLoadingModal.value = false;
        ElMessage.info("请先选择角色");
        return;
      }
      if (ArrUnit.value.length == 0) {
        BtnLoadingModal.value = false;
        ElMessage.info("请先选择组织机构");
        return;
      }
      let RoleName = ArrRoleUser.value.filter((item) => {
        return item.RoleId == formModal.roleId;
      })[0].RoleName;
      let UnitName = ArrUnit.value.filter((item) => {
        return item.UnitId == formModal.unitid;
      })[0].UnitName;
      if (form.UserRoles.length == 0) {
        form.UserRoles.push({
          RoleName: RoleName,
          UnitName: UnitName,
          id: formModal.unitid + "-" + formModal.roleId,
          unitid: formModal.unitid,
          RoleId: formModal.roleId,
        });
      } else {
        let isRepeat = false;
        form.UserRoles.forEach((row) => {
          if (row.id == formModal.unitid + "-" + formModal.roleId) {
            isRepeat = true;
          }
        });
        if (isRepeat) {
          ElMessage.info("数据重复，请重新选择");
          BtnLoadingModal.value = false;
          return;
        }
        form.UserRoles.push({
          RoleName: RoleName,
          UnitName: UnitName,
          id: formModal.unitid + "-" + formModal.roleId,
          unitid: formModal.unitid,
          RoleId: formModal.roleId,
        });
      }
      BtnLoadingModal.value = false;
      editVisible.value = false;
    } else {
      return false;
    }
  });
};
const handlerIptClick = () => {
  readonly.value = false;
};

//获取组织
const GetUnitListApi = async () => {
  let res = await GetUnitList({
    SearchCondition: { search_keyword: "" },
  });
  if (res.Code == 200) {
    ArrUnit.value = res.DataMap;
  }
};
GetUnitListApi();
const remoteMethod = async (query) => {
  let SearchQuery = "";
  SelLoading.value = true;
  if (query !== "") {
    SearchQuery = query;
  }
  let res = await GetUnitList({
    SearchCondition: { search_keyword: SearchQuery },
  });
  SelLoading.value = false;
  if (res.Code == 200) {
    let Data = fullData(res.DataMap);
    ArrUnit.value = Data;
  }
};
const fullData = (postData) => {
  let list = [];
  if (postData.length > 0) {
    postData.forEach((row) => {
      if (row.UnitStatus != 0) {
        list.push(row);
      }
    });
  }
  return list;
};

//获取选择人员
const GetRoles = async () => {
  let res = await SearchRoles({
    PageStartRow: 0,
    PageRowCount: 1000,
    NoPage: true,
    SearchCondition: {
      return_user_role: 1,
      role_status: 1,
    },
  });
  if (res.Code == 200) {
    ArrRoleUser.value = res.DataMap.Data;
  }
};
GetRoles();
const GetDetail = async (ID) => {
  let res = await GetUser({
    UserId: ID,
    ReturnRole: true,
  });
  if (res.Code == 200) {
    form.UserId = res.DataMap.UserId;
    form.UserName = res.DataMap.UserName;
    form.UserAccount = res.DataMap.UserAccount;
    form.UserCell = res.DataMap.UserCell;
    form.UserPassword = res.DataMap.UserPassword
      ? res.DataMap.UserPassword
      : "";
    form.UserRoles = [];
    if (res.DataMap.UserRoles) {
      for (var i = 0; i < res.DataMap.UserRoles.length; i++) {
        form.UserRoles.push({
          id:
            res.DataMap.UserRoles[i].UnitId +
            "-" +
            res.DataMap.UserRoles[i].RoleId,
          unitid: res.DataMap.UserRoles[i].UnitId,
          RoleId: res.DataMap.UserRoles[i].RoleId,
          RoleName: res.DataMap.UserRoles[i].RoleName,
          UnitName: res.DataMap.UserRoles[i].UnitName,
        });
      }
    }
    ruleFormCopy = form;
  }
};
//删除可访问角色
const dellist = (key) => {
  for (var i = 0; i < form.UserRoles.length; i++) {
    if (form.UserRoles[i].id == key) {
      form.UserRoles.splice(i, 1);
    }
  }
};
if (form.UserId > 0) {
  GetDetail(form.UserId);
}

// GetRoles();
const onReturn = () => {
  common.ClosePageTag("用户详情");
  router.back();
};
const AddRole = () => {
  editVisible.value = true;
};
//保存用户
const onSubmit = () => {
  ruleFormCopy = form;
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      if (form.UserId == "") {
        if (form.UserPassword == "") {
          ElMessage.error("请输入密码");
          btnLoading.value = false;
          return;
        }
      }
      if (form.UserPassword != "") {
        if (form.UserPassword.length < 8) {
          ElMessage.error("密码长度不得低于8位");
          btnLoading.value = false;
          return;
        }
        var testPassword =
          /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&* ~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^& *~()-+=]+$)(?![0-9\W_!@#$%^&* ~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*~()-+=]/;
        if (testPassword.test(form.UserPassword) === false) {
          ElMessage.error("密码强度不够");
          btnLoading.value = false;
          return;
        }
        form.UserPassword = md5(form.UserPassword.toString());
      }
      let res = await SaveUser({ User: form });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("用户详情");
        store.commit("tags/setPageSaerch", { Search: 1, titlePage: "用户" });
        ElMessage.success("保存成功");
        setTimeout(() => {
          router.push({
            path: "/user",
          });
        }, 1500);
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
.dashboard-stat2 .display .number {
  float: left;
  display: inline-block;
}

.dashboard-stat2 .display .number h3 {
  margin: 0 0 2px;
  padding: 0;
  font-size: 30px;
  font-weight: 400;
}

.font-blue-sharp {
  color: #5c9bd1 !important;
}
.roleName {
  display: inline-block;
  max-width: 96%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.dashboard-stat2 .display .number h3 > small {
  font-size: 23px;
}

.dashboard-stat2 .display .number small {
  font-size: 14px;
  color: #aab5bc;
  font-weight: 600;
}

.dashboard-stat2 .display .icon {
  display: inline-block;
  float: right;
  padding: 7px 0 0;
}

.dashboard-stat2 .display .icon > i {
  color: #cbd4e0;
  font-size: 26px;
}


</style>
