<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">请选择角色</div>
      <el-form :model="form" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item>
          <el-select style="width: 100%" v-model="form.RoleId" placeholder="请选择">
            <el-option v-for="item in List" :key="item.Id" :label="item.Name" :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
        <div class="login-btn">
          <el-row :gutter="10">
            <el-col :span="6" :offset="18">
              <el-button span="2" offset="10" class="loginsubmit button1" :loading="op.Loading"
                @click="submitForm('form')">确定</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";
import { SelectLoginRole, GetMyMenuList, GetUserLoginRoleList } from "@/api/index";
export default {
  setup() {
    const router = useRouter();
    const List = ref([]);
    const op = reactive({
      Loading: false,
    });
    const form = reactive({
      RoleId: "",
    });

    const RoleId = ref("");
    //获取下拉角色数据
    const getRoles = async () => {
      let res = await GetUserLoginRoleList({
        AppCode: "LNMS"
      })
      if (res.Code == 200) {
        List.value = res.DataMap
        form.RoleId = res.DataMap[0].Id;
      }
    };
    getRoles();
    const login = ref(null);
    const submitForm = () => {
      login.value.validate(async (valid) => {
        if (valid) {
          op.Loading = true;
          let res = await SelectLoginRole({
            LoginRoleId: form.RoleId,
          });
          op.Loading = false;
          if (res.Code == 200) {
            Cookie.set("User", JSON.stringify(res.DataMap));
            let response = await GetMyMenuList({ CascadeMenu: true });
            if (response.Code == 200) {
              let routeslist = [];
              var pathUrl = "";
              router.options.routes[2].children = [];
              for (var i = 0; i < response.DataMap.length; i++) {
                response.DataMap[i].SubRightes.forEach(row => {
                  var obj = {};
                  if (pathUrl == "") {
                    pathUrl = row.UrlPath;
                  }
                  obj.path = row.UrlPath;
                  obj.name = row.RightName;
                  obj.hidden = false;
                  obj.meta = {
                    title: row.RightName,
                    url: row.UrlPath,
                    code: row.RightCode,
                    icon: row.IconPath,
                  };
                  routeslist.push(obj);
                  router.options.routes[2].children.push(obj);
                })
              }
              router.push("/" + pathUrl);
              // router.push("/home");
            }
          } else {
            ElMessage.info(res.Message);
          }
        } else {
          return false;
        }
      });
    };
    window.addEventListener("beforeunload", () => {
      // sessionStorage.setItem("rolesList", JSON.stringify(List.value));
    });
    return {
      submitForm,
      List,
      form,
      login,
      op,
    };
  },
};
</script>
<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url("../../../static/img/login-bg.jpg"); */
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: black;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

/* .loginsubmit {
  background-color: #c02c2c;
  border-color: #c02c2c;
  color: white;
} */
</style>
