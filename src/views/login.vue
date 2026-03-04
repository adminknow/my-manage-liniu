<template>
  <div class="login-wrap">
    <img
      src="../assets/imgs/login-bg1.jpg"
      style="width: 100%; height: 100%; position: absolute"
    />
    <div class="ms-login">
      <div class="ms-title">
        <img src="../assets/imgs/login-bg4.png?v=3" style="width: 55%" />
      </div>
      <div class="ms-title1">欢迎登录</div>
      <div class="ms-form">
        <el-form
          :model="param"
          :rules="rules"
          ref="login"
          label-width="0px"
          class="ms-content"
        >
          <div class="login-options">
            <div
              class="login-item"
              v-for="(item, index) in loginitems"
              :key="item.id"
              :class="current === index ? 'move' : ''"
              @click="change(index)"
            >
              {{ item.text }}
            </div>
          </div>
          <div v-if="current == 0">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="username">
                  <el-input
                    v-model="param.username"
                    size="large"
                    placeholder="帐号"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    size="large"
                    placeholder="密码"
                    v-model="param.password"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input
                    placeholder="验证码"
                    size="large"
                    maxlength="4"
                    v-model="param.code"
                    @keyup.enter="submitForm()"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
          </div>
          <div v-else>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="tell">
                  <el-input v-model="param.tell" size="large" placeholder="+86">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input
                    placeholder="验证码"
                    size="large"
                    maxlength="4"
                    v-model="param.code"
                    @keyup.enter="submitForm()"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item prop="cellSMSCode">
                  <el-input
                    placeholder="短信验证码"
                    size="large"
                    maxlength="4"
                    v-model="param.cellSMSCode"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <div class="get-code" @click="getCode">
                  <p v-if="isok == 1">获取验证码</p>
                  <p v-else>{{ countTime }}</p>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="login-btn">
            <el-button
              class="button1"
              round
              :loading="btnLoading"
              @click="submitForm()"
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Identify from "@/components/common/identify.vue";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";
import md5 from "js-md5";
import { Login, GetMyMenuList } from "../api/index";
import { SendSMSCode } from "../api/common";
const router = useRouter();
const param = reactive({
  tell: "",
  cellSMSCode: "",
  username: "",
  password: "",
  code: "",
});
const countTime = ref(60);
const isok = ref(1);
const btnLoading = ref(false);
const current = ref(0);

const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const loginitems = ref([
  {
    id: 1,
    text: "账号密码登录",
  },
  {
    id: 2,
    text: "手机号登录",
  },
]);
const login = ref(null);
const identifyCode = ref("");
const identifyCodes = ref("123456789abcdefjhjknpqrsduvwxyz");
const store = useStore();

const submitForm = () => {
  login.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      if (current.value == 0) {
        //只有是账号密码登录的时候验证
        if (param.code.toLowerCase() !== identifyCode.value.toLowerCase()) {
          ElMessage.error("请填写正确验证码");
          btnLoading.value = false;
          refreshCode();
          return;
        }
      }

      const res = await Login({
        Account: param.username,
        Pwd: md5(param.password),
        // Pwd: "bb1ece03279a633210f873a9c0240bc5",
        Cell: param.tell,
        CellSMSCode: param.cellSMSCode,
        AppCode: "LNMS",
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        Cookie.set("User", JSON.stringify(res.DataMap.User));
        Cookie.set("CookieToken", res.DataMap.Token);
        ElMessage.success("登录成功");
        if (res.DataMap.Roles) {
          if (res.DataMap.Roles.length > 1) {
            //如果存在多角色的话，需要跳转到选择角色页面
            router.push("/choicepost");
            return;
          }
        } else {
          let response = await GetMyMenuList({ CascadeMenu: false });
          if (response.Code == 200) {
            var pathUrl = "";
            for (var i = 0; i < response.DataMap.length; i++) {
              if (
                response.DataMap[i].UrlPath == "" ||
                response.DataMap[i].UrlPath == undefined
              ) {
                continue;
              }
              if (pathUrl == "") {
                pathUrl = response.DataMap[i].UrlPath;
              }
            }
            store.commit("tags/clearTags");
            router.push("/" + pathUrl);
          }
        }
      } else {
        ElMessage.error(res.Message);
        return false;
      }
    } else {
      return false;
    }
  });
};
// 切换验证码登录和账号密码登录
const change = (index) => {
  //切换的时候清空数据，避免保存的时候出问题
  param.code = "";
  param.tell = "";
  param.username = "";
  param.cellSMSCode = "";
  param.password = "";
  current.value = index;
};
// 获取验证码倒计时
const getCode = async () => {
  if (param.code.toLowerCase() !== identifyCode.value.toLowerCase()) {
    ElMessage.error("请填写正确验证码");
    btnLoading.value = false;
    return;
  }
  if (param.tell == "") {
    ElMessage.error("请输入手机号");
    btnLoading.value = false;
    rreturn;
  }
  if (isok.value == 0) {
    return;
  }
  let res = await SendSMSCode({
    Cell: param.tell,
    TemplateType: "cell_check",
    PushScene: "user_login_cell",
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

const init = () => {
  makeCode(identifyCodes.value, 4);
};

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value +=
      identifyCodes.value[randomNum(0, identifyCodes.value.length)];
  }
};

const refreshCode = () => {
  identifyCode.value = "";
  makeCode(identifyCodes.value, 4);
};
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
init();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/imgs/login-bg1.jpg);
  background-size: 100%;
  background-repeat: no-repeat; */
}

.ms-title {
  padding-top: 90px;
  position: relative;
  width: 100%;
  text-align: center;
  height: 100px;
  line-height: 160px;
}

.ms-title1 {
  width: 100%;
  text-align: center;
  position: relative;
  font-weight: 600;
  height: 140px;
  line-height: 140px;
  font-size: 36px;
  letter-spacing: 2px;
}

.ms-login {
  position: relative;
  left: 65%;
  top: 1.4%;
  height: 97.1%;
  width: 34%;
  z-index: 19;
  /* margin: 16px 0; */
  /* margin: -190px 0 0 -175px; */
  background: rgba(255, 255, 255);
}

.ms-form {
  margin: 0 auto;
  width: 75%;
}

.ms-content {
  padding: 0 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  margin-top: 22px;
  width: 100%;
  height: 42px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.login-options {
  margin: 20px 0 20px 0;
  display: flex;
  align-items: center;
}
.login-item {
  box-sizing: border-box;
  padding-bottom: 5px;
  margin-right: 10px;
}
.move {
  cursor: pointer;
  color: #f56c6c;
  padding-bottom: 5px;
  font-weight: 600;
  border-bottom: 2px solid #f56c6c;
}
.login-item:hover {
  cursor: pointer;
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
