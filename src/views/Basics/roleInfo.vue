<template>
  <div class="container">
    <el-row :gutter="20" style="margin-top: 20px; padding-bottom: 100px">
      <el-col :span="24" :offset="0">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="编码" prop="RoleCode">
                <el-input :disabled="isdisabled" maxlength="20" show-word-limit v-model="form.RoleCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="名称" prop="RoleName">
                <el-input :disabled="isdisabled" maxlength="20" show-word-limit v-model="form.RoleName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限">
                <el-tree v-if="Treedata.length > 0" :data="Treedata" show-checkbox="false" default-expand-all
                  node-key="RightId" ref="treeRef" highlight-current :props="defaultProps">
                </el-tree>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button v-if="form.Type != 'View'" round class="button1" :loading="btnLoading" @click="onSubmit">
              <el-icon>
                <CirclePlus />
              </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
            </el-button>
            <el-button class="button2" @click="onReturn" round>&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { GetMyRole, GetRole, SaveRole } from "../../api/index.js";
import common from "@/utils/common.js";
export default {
  name: "Edit",
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const Treedata = ref([]);
    const treeRef = ref([]);
    const formRef = ref(null);
    const btnLoading = ref(false);
    const isdisabled = ref(false);
    let defaultProps = {
      children: "childen",
      label: "RightName",
    };
    const rules = {
      RoleCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
      RoleName: [{ required: true, message: "请输入名称", trigger: "blur" }],
    };
    const form = reactive({
      RoleId: 0,
      RoleCode: "",
      RoleName: "",
      Rightes: [],
      Type: "",
    });
    form.RoleId = router.currentRoute.value.query.ID
      ? router.currentRoute.value.query.ID
      : 0;
    form.Type = router.currentRoute.value.query.Type
      ? router.currentRoute.value.query.Type
      : "";
    const GetApp = async () => {
      let res = await GetMyRole({
        ReturnRight: true,
        CascadeRight: true,
      });
      if (res.Code == 200) {
        const treedata_new = [];
        for (var m = 0; m < res.DataMap.Apps.length; m++) {
          if (res.DataMap.Apps.length > 0) {
            res.DataMap.Apps[m].childen = res.DataMap.Apps[m].Rightes;
            res.DataMap.Apps[m].RightName = res.DataMap.Apps[m].AppName;
          }
          for (var i = 0; i < res.DataMap.Apps[m].Rightes.length; i++) {
            if (res.DataMap.Apps[m].Rightes[i].SubRightes) {
              if (res.DataMap.Apps[m].Rightes[i].SubRightes.length > 0) {
                res.DataMap.Apps[m].Rightes[i].childen =
                  res.DataMap.Apps[m].Rightes[i].SubRightes;
              }
            }
          }
          treedata_new.push(res.DataMap.Apps[m]);
        }
        Treedata.value = treedata_new; //res.DataMap;
      }
    };

    const onReturn = () => {
      common.ClosePageTag("角色详情")
      router.go(-1);
    };
    const GetDetail = async (ID) => {
      let res = await GetRole({
        RoleId: ID,
        ReturnMy: true,
      });
      if (res.Code == 200) {
        isdisabled.value = res.DataMap.RoleType === 1;
        form.RoleCode = res.DataMap.RoleCode;
        form.RoleId = res.DataMap.RoleId;
        form.RoleName = res.DataMap.RoleName;
        const treedata = [];
        const treedata_new = [];
        for (var m = 0; m < res.DataMap.Apps.length; m++) {
          if (res.DataMap.Apps[m].Rightes.length > 0) {
            res.DataMap.Apps[m].childen = res.DataMap.Apps[m].Rightes;
            res.DataMap.Apps[m].RightName = res.DataMap.Apps[m].AppName;
          }
          for (var i = 0; i < res.DataMap.Apps[m].Rightes.length; i++) {
            if (res.DataMap.Apps[m].Rightes[i].SubRightes) {
              if (res.DataMap.Apps[m].Rightes[i].SubRightes.length > 0) {
                res.DataMap.Apps[m].Rightes[i].childen =
                  res.DataMap.Apps[m].Rightes[i].SubRightes;
              }
              for (
                var j = 0;
                j < res.DataMap.Apps[m].Rightes[i].SubRightes.length;
                j++
              ) {
                if (res.DataMap.Apps[m].Rightes[i].SubRightes[j].IsSelected) {
                  treedata.push(
                    res.DataMap.Apps[m].Rightes[i].SubRightes[j].RightId
                  );
                }
              }
            } else {
              if (res.DataMap.Apps[m].Rightes[i].IsSelected) {
                treedata.push(res.DataMap.Apps[m].Rightes[i].RightId);
              }
            }
          }
          treedata_new.push(res.DataMap.Apps[m]);
        }
        Treedata.value = treedata_new;
        if (treedata.length > 0) {
          setTimeout(() => {
            proxy.$refs.treeRef.setCheckedKeys(treedata);
          }, 1000);
        }
      }
    };
    if (form.RoleId > 0) {
      GetDetail(form.RoleId);
    } else {
      GetApp();
    }
    const onSubmit = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          btnLoading.value = true;
          var arrtree = [];
          var tree_master = proxy.$refs.treeRef.getHalfCheckedKeys();
          var tree = proxy.$refs.treeRef.getCheckedKeys();
          if (tree.length == 0) {
            ElMessage.warning("请勾选角色权限");
            btnLoading.value = false;
            return;
          }
          for (var i = 0; i < tree_master.length; i++) {
            if (tree_master[i]) {
              arrtree.push({ RightID: tree_master[i] });
            }
          }
          for (var i = 0; i < tree.length; i++) {
            if (tree[i]) {
              arrtree.push({ RightID: tree[i] });
            }
          }
          form.Rightes = arrtree;
          let res = await SaveRole({ Role: form });
          btnLoading.value = false;
          if (res.Code == 200) {
            common.ClosePageTag("角色详情")
            store.commit("tags/setPageSaerch", { Search: 1, titlePage: "角色" });
            ElMessage.success("保存成功");
            setTimeout(() => {
              router.push({
                path: "/role"
              });
            }, 2000);
          } else {
            ElMessage.error(res.Message);
          }
        } else {
          return false;
        }
      });
    };
    return {
      defaultProps,
      Treedata,
      onReturn,
      form,
      formRef,
      btnLoading,
      rules,
      onSubmit,
      isdisabled
    };
  },
};
</script>

<style scoped></style>
