<template>
  <div class="header">
    <div class="logo">
      <img
        v-if="UnitType == 1"
        src="../assets/imgs/head-bg1.png"
        style="width: 190px; height: 80px"
      />
      <img
        v-else
        :src="UnitLogo ? UnitLogo : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/head-bg1.png'"
        style="width: 190px; height: 80px"
      />
    </div>
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <!-- <i v-if="!collapse" class="el-icon-mpzhedie2"></i>
      <i v-else class="el-icon-mpzhedie1"></i> -->
      <el-icon :size="28" color="#f56c6c">
        <Fold v-if="!collapse" />
        <Expand v-else />
      </el-icon>
    </div>
    <div class="tip-left">
      <span style="font-weight: 600">{{ username }}</span
      >，欢迎登录 <span style="font-weight: 600">{{ unitName }}</span
      ><span v-if="UnitType == 2"
        >，有效期至：<span style="font-weight: 600">{{
          UnitValidDate
        }}</span></span
      >
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ RoleName }}
            <el-icon>
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="choicePost">切换角色</el-dropdown-item>
              <el-dropdown-item command="bindingCell"
                >绑定手机</el-dropdown-item
              >
              <el-dropdown-item command="changePassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              <!-- <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="header-right" style="width: 40px">
      <div class="header-user-con">
        <img src="../assets/imgs/set.png" style="width: 100%" />
      </div>
    </div>
    <div class="header-right" style="width: 40px">
      <div class="header-user-con">
        <img src="../assets/imgs/bell.png" style="width: 100%" />
      </div>
    </div>
    <div class="header-right" style="width: 40px">
      <div class="header-user-con">
        <img src="../assets/imgs/search.png" style="width: 100%" />
      </div>
    </div>
    <!-- 编辑密码弹出框 -->
    <el-dialog
      title="重置密码"
      v-model="editVisible"
      width="38%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item v-if="LoginType == 0" label="旧密码" prop="oldPwd">
              <el-input v-model="form.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="form.newPwd"></el-input>
              <span>密码不得少于8位，并且包含数字、字母、特殊符号</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="onSaveModal">保 存</el-button>
          <el-button class="button2" @click="editVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 绑定手机号 -->
    <el-dialog
      title="绑定手机号"
      v-model="editCellVisible"
      width="28%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formCellRef"
        :model="formCell"
        :rules="rulesCell"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号" prop="tell">
              <el-input v-model="formCell.Cell" size="large" placeholder="+86">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="验证码" prop="code">
              <el-input
                placeholder="验证码"
                size="large"
                maxlength="4"
                v-model="formCell.Code"
                @keyup.enter="submitForm()"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div
              class="login-code"
              style="
                height: 40px;
                width: 100px;
                position: absolute;
                right: 30px;
                top: 0;
              "
              @click="refreshCode"
            >
              <Identify :identifyCode="identifyCode"></Identify>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="短信验证码">
              <el-input
                placeholder="短信验证码"
                size="large"
                maxlength="4"
                v-model="formCell.SMSCode"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div class="get-code" @click="getCode">
              <p v-if="isok == 1">获取验证码</p>
              <p v-else>{{ countTime }}</p>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="onSaveCellModal">保 存</el-button>
          <el-button class="button2" @click="editCellVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Cookie from "js-cookie";
import md5 from "js-md5";
import { ModifyPwd, SendSMSCode, BindCell } from "@/api/common.js";
import { GetUserLoginRoleList } from "@/api/index.js";
import Identify from "@/components/common/identify.vue";
const editVisible = ref(false);
const editCellVisible = ref(false);
const identifyCode = ref("");
const identifyCodes = ref("123456789abcdefjhjknpqrsduvwxyz");
const countTime = ref(60);
const isok = ref(1);
const refreshCode = () => {
  identifyCode.value = "";
  makeCode(identifyCodes.value, 4);
};
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value +=
      identifyCodes.value[randomNum(0, identifyCodes.value.length)];
  }
};

const form = reactive({
  oldPwd: "",
  newPwd: "",
});
const formCell = reactive({
  Cell: "",
  Code: "",
  SMSCode: "",
});

const rules = {
  oldPwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  newPwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
};
const rulesCell = {};

const formRef = ref(null);
const formCellRef = ref(null);
const residue = ref(""); //剩余天数

let UnitType = JSON.parse(Cookie.get("User")).UnitType;
let UnitLogo = JSON.parse(Cookie.get("User")).UnitLogo;
let LoginType = JSON.parse(Cookie.get("User")).LoginType;
let username = JSON.parse(Cookie.get("User")).UserName;
let UnitValidDate = JSON.parse(Cookie.get("User")).UnitValidDate;
let unitName = JSON.parse(Cookie.get("User")).UnitName;
let RoleName = JSON.parse(Cookie.get("User")).RoleName;
// 获取验证码倒计时
const getCode = async () => {
  if (formCell.Code.toLowerCase() !== identifyCode.value.toLowerCase()) {
    ElMessage.error("请填写正确验证码");
    btnLoading.value = false;
    return;
  }
  if (formCell.Cell == "") {
    ElMessage.error("请输入手机号");
    btnLoading.value = false;
    rreturn;
  }
  if (isok.value == 0) {
    return;
  }
  let res = await SendSMSCode({
    Cell: formCell.Cell,
    TemplateType: "cell_check",
    PushScene: "user_bind_cell",
  });
  if (res.Code == 200) {
    refreshCode();
    isok.value = 0;
    var Timer = setInterval(() => {
      countTime.value--;
      if (countTime.value <= 0) {
        clearInterval(Timer);
        isok.value = 1;
        countTime.value = 60;
      }
    }, 1000);
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
const store = useStore();
const collapse = computed(() => store.state.tags.collapse);
const tagsList = computed(() => store.state.tags.tagsList);
// 侧边栏折叠
const collapseChage = () => {
  store.commit("tags/handleCollapse", !collapse.value);
};

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage();
  }
});
const onSaveModal = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.newPwd.length < 8) {
        ElMessage.error("密码长度不得低于8位");
        return;
      }
      var testPassword =
        /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&* ~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^& *~()-+=]+$)(?![0-9\W_!@#$%^&* ~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*~()-+=]/;
      if (testPassword.test(form.newPwd) === false) {
        ElMessage.error("密码强度不够");
        return;
      }
      if (form.oldPwd == "") {
        form.oldPwd = "123456";
      }
      let res = await ModifyPwd({
        OldPwd: md5(form.oldPwd),
        NewPwd: md5(form.newPwd),
      });
      if (res.Code == 200) {
        formRef.value.resetFields();
        form.oldPwd = "";
        form.newPwd = "";
        ElMessage.success("保存成功");
        editVisible.value = false;
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const onSaveCellModal = async () => {
  formCellRef.value.validate(async (valid) => {
    if (valid) {
      let res = await BindCell({
        Cell: formCell.Cell,
        SMSCode: formCell.SMSCode,
      });
      if (res.Code == 200) {
        formCellRef.value.resetFields();
        formCell.Cell = "";
        formCell.Code = "";
        formCell.SMSCode = "";
        ElMessage.success("保存成功");
        editCellVisible.value = false;
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};

const getDifferScale = (value) => {
  var format;
  //获取转化比（天数跟毫秒数的比例）
  if (value == 1) {
    format = parseFloat(24 * 60 * 60 * 1000);
  }
  //获取转化比（小时数跟毫秒数的比例）
  else if (value == 2) {
    format = parseFloat(60 * 60 * 1000);
  }
  //获取转化比（分钟数跟毫秒数的比例）
  else if (value == 3) {
    format = parseFloat(60 * 1000);
  }
  //获取转化比（秒数跟毫秒数的比例）
  else if (value == 4) {
    format = parseFloat(1000);
  }
  return format;
};
//获取当前日期
const getNowDate = () => {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var dateStr = year + "-" + getFormatDate(month) + "-" + getFormatDate(day);
  return dateStr;
};
const getFormatDate = (value) => {
  var result;
  result = value < 10 ? "0" + value : value;
  return result;
};
const getDifferDate = (firstDate, secondDate, differ) => {
  //1)将两个日期字符串转化为日期对象
  var startDate = new Date(firstDate);
  var endDate = new Date(secondDate);
  //2)计算两个日期相差的毫秒数
  var msecNum = endDate.getTime() - startDate.getTime();
  //3)计算两个日期相差的天数
  //(参数：1：相差天数，2：相差小时数，3：相差分钟数，4：相差毫秒数)
  var dayNum = Math.floor(msecNum / getDifferScale(1));
  residue.value = dayNum;
  return dayNum;
};

// 用户名下拉菜单选择事件
const router = useRouter();
const route = useRoute();
const handleCommand = async (command) => {
  if (command == "loginout") {
    store.commit("tags/clearTags");
    router.push("/login");
  } else if (command == "user") {
    router.push("/user");
  } else if (command == "choicePost") {
    let res = await GetUserLoginRoleList({
      AppCode: "LNMS",
    });
    if (res.Code == 200) {
      if (res.DataMap.length > 1) {
        store.commit("tags/clearTags");
        router.push("/choicepost");
      } else {
        ElMessage.info("当前暂无多个角色可选择");
      }
    }
  } else if (command == "changePassword") {
    editVisible.value = true;
  } else if (command == "bindingCell") {
    editCellVisible.value = true;
    makeCode(identifyCodes.value, 4);
  }
};
if (UnitType == 2) {
  if (getDifferDate(getNowDate(), UnitValidDate, 1) < 10) {
    //当结束日期与当前日期小于10天的时候 提示
    let HtmlDesc = "";
    if (residue.value > 0) {
      HtmlDesc = `<p style='letter-spacing: 1px;'>当前账号还可使用 <span style="color:#f56c6c;font-weight:600">${residue.value}</span> 天，请尽快续费</p>`;
    }
    if (residue.value == 0) {
      HtmlDesc = `<p style='letter-spacing: 1px;'>当前账号明日到期，请尽快续费</p>`;
    }
    if (residue.value < 0) {
      HtmlDesc = `<p style='letter-spacing: 1px;'>当前账号已过期，请尽快续费</p>`;
    }
    ElMessageBox.alert(HtmlDesc, "提示", {
      confirmButtonClass: "button1",
      "show-close": false,
      dangerouslyUseHTMLString: true,
      type: "warning",
    });
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  font-size: 22px;
  color: #fff;
  background-color: #fff;
}

.collapse-btn {
  float: left;
  padding: 6px 8px;
  cursor: pointer;
  line-height: 80px;
  color: #fff;
}
.tip-left {
  float: left;
  color: black;
  line-height: 80px;
  font-size: 14px;
  padding-left: 6px;
}
.header .logo {
  float: left;
  width: 190px;
  height: 80px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 80px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #f56c6c;
  cursor: pointer;
  font-size: 14px;
}

.el-dropdown-menu__item {
  text-align: center;
}

.el-dropdown-link .el-icon {
  position: relative;
  top: 2px;
}

.get-code {
  position: absolute;
  right: 0;
  top: 0;
}

.get-code p {
  height: 40px;
  width: 130px;
  text-align: center;
  background-color: #f56c6c;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
