<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="250px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="10">
          <el-row>
            <el-col :span="18">
              <el-form-item label="编码" prop="VipTypeCode">
                <el-input
                  :disabled="Type == 'View'"
                  maxlength="10"
                  show-word-limit
                  v-model="form.VipTypeCode"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="名称" prop="VipTypeName">
                <el-input
                  :disabled="Type == 'View'"
                  maxlength="10"
                  show-word-limit
                  v-model="form.VipTypeName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="购物时享受的折扣" prop="ShoppingDiscount">
                <el-input
                  :disabled="Type == 'View'"
                  maxlength="10"
                  show-word-limit
                  type="number"
                  v-model="form.ShoppingDiscount"
                  ><template #append>%</template></el-input
                >
                <div style="height: 10px; color: #909399; font-size: 12px">
                  最高输入100
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="注册手机号后即可拥有此等级">
                <el-radio-group v-model="form.OnlyHasCell">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="23">
              <el-form-item label="需支付的金额" prop="SellPrice">
                <el-input :disabled="Type == 'View'" v-model="form.SellPrice"
                  ><template #append>元</template></el-input
                >
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="图片" ref="uploadElement" prop="">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      v-model="form.VipTypeConfigDesc.ListImg"
                      v-if="false"
                    ></el-input>
                    <el-upload
                      class="commodity-home-uploader"
                      ref="upload"
                      :show-file-list="false"
                      action="#"
                      :http-request="SuccessImg"
                      :before-upload="beforeUpload"
                      :auto-upload="true"
                    >
                      <img
                        v-if="form.VipTypeConfigDesc.ListImg"
                        :src="form.VipTypeConfigDesc.ListImg"
                        class="commodity-home-uploader-avatar"
                      />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      建议，100*100 且不超过500k
                      <span
                        style="cursor: pointer; color: #ff6666"
                        class="el-icon-delete"
                        v-if="form.VipTypeConfigDesc.ListImg && Type != 'View'"
                        @click="clear"
                        >删除</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-row>
            <el-col :span="23">
              <el-form-item
                prop="GoodsDetail"
                label="会员权益"
                label-width="150px"
              >
                <tinymceEditor
                  ref="editor"
                  :value="form.VipTypeBenefit"
                  @tinymceinput="gettinymceinput"
                ></tinymceEditor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
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
import Cookie from "js-cookie";
import { GetVipType, SaveVipType } from "@/api/vip.js";
import { UploadSingle } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import tinymceEditor from "@/components/common/tinymce.vue";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");

let form = reactive({
  VipTypeId: "",
  VipTypeCode: "",
  VipTypeName: "",
  OnlyHasCell: "0",
  ShoppingDiscount: "",
  SellPrice: "",
  VipTypeBenefit: "",
  NewTicketTemplateId: "",
  VipTypeConfig: "",
  VipTypeStatus: "",
  VipTypeConfigDesc: {
    ListImg: "",
  },
});
const rules = {
  GoodsCategoryCode: [
    { required: true, message: "请输入编码", trigger: "blur" },
  ],
};
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.VipTypeConfigDesc.ListImg = res.DataMap.HttpsUrl;
    }
  });
};
const beforeUpload = async (file) => {
  const isJPG = file.type == "image/jpeg" || file.type == "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 格式!");
  }
  return isLt2M;
};

const clear = () => {
  form.ListImg = "";
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let formData = JSON.parse(JSON.stringify(form));
      formData.ShoppingDiscount = formData.ShoppingDiscount;
      formData.VipTypeConfig = JSON.stringify(formData.VipTypeConfigDesc);
      btnLoading.value = true;
      let res = await SaveVipType({
        VipType: formData,
        IsSubmit: true,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("会员等级详情");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "会员等级",
        });
        ElMessage.success("保存成功");
        setTimeout(function () {
          router.push({
            path: "/level",
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
const GetVipTypeApi = async (ID) => {
  let res = await GetVipType({
    ObjectId: ID,
  });
  if (res.Code === 200) {
    form.VipTypeId = ID;
    form.VipTypeCode = res.DataMap.VipTypeCode;
    form.VipTypeName = res.DataMap.VipTypeName;
    form.OnlyHasCell = res.DataMap.OnlyHasCell.toString();
    form.SellPrice = (res.DataMap.SellPrice / 100).toFixed(2);
    form.VipTypeBenefit = res.DataMap.VipTypeBenefit;
    form.NewTicketTemplateId = res.DataMap.NewTicketTemplateId;
    form.VipTypeConfig = res.DataMap.VipTypeConfig;
    if (form.VipTypeConfig) {
      //如果有值的话 就要去处理
      let Info = JSON.parse(form.VipTypeConfig);
      form.VipTypeConfigDesc.ListImg = Info.ListImg;
    }
    form.ShoppingDiscount = res.DataMap.ShoppingDiscount;
  }
};
const gettinymceinput = async (val) => {
  form.VipTypeBenefit = val;
};
const onReturn = async (val) => {
  common.ClosePageTag("会员等级");
  router.back();
};
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    form.GoodsId = router.currentRoute.value.query.ID;
    Type.value = router.currentRoute.value.query.Type;
    GetVipTypeApi(form.GoodsId);
  }
};
Init();
</script>

<style scoped></style>

<style>
.el-radio__inner:hover {
  border-color: #f56c6c;
}
.commodity-uploader {
  width: 320px;
  height: 150px;
}

.commodity-uploader .el-upload {
  width: 320px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.commodity-uploader-avatar {
  width: 100%;
}

.commodity-home-uploader {
  width: 150px;
  height: 150px;
}

.commodity-home-uploader .el-upload {
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.commodity-home-uploader-avatar {
  width: 100%;
}
</style>
