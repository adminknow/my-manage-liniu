<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <div style="margin-top: 20px; padding-bottom: 100px">
        <el-form-item label="类型" prop="AgreementType">
          <el-select
            style="width: 30%"
            v-model="form.AgreementType"
            placeholder="请选择状态"
          >
            <el-option label="用户协议" value="user"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="AgreementVersion">
          <el-input
            style="width: 30%"
            v-model="form.AgreementVersion"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="AgreementContent" label="协议内容">
          <tinymceEditor
            ref="editor"
            :value="form.AgreementContent"
            @tinymceinput="gettinymceinput"
          ></tinymceEditor>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          v-if="Type != 'View'"
          class="button1"
          round
          :loading="btnLoading"
          @click="onSubmit"
        >
          <el-icon> <CirclePlus /> </el-icon
          >&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
        </el-button>
        <el-button class="button2" round @click="onReturn"
          >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SaveAgreement, GetAgreement } from "@/api/common.js";
import tinymceEditor from "@/components/common/tinymce.vue";
import common from "@/utils/common.js";
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
let form = reactive({
  AgreementId: "",
  AgreementType: "user",
  AgreementVersion: "",
  AgreementContent: "", //内容
  IsCurrent: "",
});

const rules = {
  AgreementContent: [
    { required: true, message: "请输入协议内容", trigger: "blur" },
  ],
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      let res = await SaveAgreement({ Agreement: form });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("协议详情");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "协议",
        });
        ElMessage.success("保存成功");
        setTimeout(function () {
          router.push({
            path: "/agreement",
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
const GetAgreementApi = async (ID) => {
  let res = await GetAgreement({
    ObjectId: ID,
  });
  if (res.Code === 200) {
    form.AgreementType = res.DataMap.AgreementType;
    form.AgreementVersion = res.DataMap.AgreementVersion;
    form.AgreementContent = res.DataMap.AgreementContent;
    form.IsCurrent = res.DataMap.IsCurrent;
  }
};
const gettinymceinput = async (val) => {
  form.AgreementContent = val;
};
const onReturn = async (val) => {
  common.ClosePageTag("协议详情");
  router.back();
};
//根据ID获取详情
const Init = () => {
  if (router.currentRoute.value.query.ID) {
    form.AgreementId = router.currentRoute.value.query.ID;
    Type.value = router.currentRoute.value.query.Type;
    GetAgreementApi(form.AgreementId);
  }
};

Init();
</script>

<style scoped></style>
