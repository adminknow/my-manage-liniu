<template>
  <div>
    <div class="container">
      <el-row :gutter="20" style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="10" :offset="0">
          <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
            <el-form-item label="所属应用">
              <el-input v-model="form.AppName" disabled></el-input>
            </el-form-item>
            <el-form-item label="上级权限">
              <el-input v-model="form.ParentRightIDName" disabled></el-input>
            </el-form-item>
            <el-form-item label="权限编码" prop="RightCode">
              <el-input v-model="form.RightCode"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="RightName">
              <el-input v-model="form.RightName"></el-input>
            </el-form-item>
            <el-form-item label="显示次序" prop="DisplayIndex">
              <el-input v-model="form.DisplayIndex"></el-input>
            </el-form-item>
            <el-form-item label="权限类型" prop="RightType">
              <el-radio-group v-model="form.RightType">
                <el-radio label="1">菜单</el-radio>
                <el-radio label="2">操作</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="访问路径">
              <el-input v-model="form.UrlPath"></el-input>
            </el-form-item>
            <!-- <el-form-item label="图标">
              <el-input v-model="form.IconPath"></el-input>
            </el-form-item> -->
            <el-form-item label="图标">
              <el-row>
                <el-col :span="24">
                  <el-input v-model="form.IconPath" v-if="false"></el-input>
                  <el-upload class="jurisdiction-uploader" ref="upload" :show-file-list="false" action="#"
                    :http-request="SuccessImg" :auto-upload="true">
                    <img v-if="form.IconPath" :src="form.IconPath" class="jurisdiction-uploader-avatar" />
                    <i v-else class="el-icon-plus jurisdiction-uploader-icon"></i>
                  </el-upload>
                  <P class="text">100*100
                    <span style="cursor: pointer" class="el-icon-delete" v-if="form.IconPath" @click="clear">删除</span>
                  </P>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="button1" round v-if="form.Type != 'view'" :loading="BtnLoading" @click="onSubmit">
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
  </div>
</template>
<script>
import { SaveRight, GetRight } from "../../api/index.js";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { UploadSingle } from "@/api/imgapi.js";
import common from "@/utils/common.js";
export default {
  name: "Edit",
  setup() {
    const IconPathIcon = "https://zytest15.oss-cn-shanghai.aliyuncs.com/testappid/20221108/89654d30895e44c7a396db90b59200f5.png";
    //初始化表单
    const formRef = ref(null);
    const BtnLoading = ref(false);
    const router = useRouter();
    const rules = {
      RightCode: [
        { required: true, message: "请输入权限编码", trigger: "blur" },
      ],
      RightName: [
        { required: true, message: "请输入权限名称", trigger: "blur" },
      ],
      DisplayIndex: [
        { required: true, message: "请输入权限次序", trigger: "blur" },
      ],
    };
    const form = reactive({
      AppName: "",
      ParentRightIDName: "",
      AppId: 1,
      ParentRightId: 0,
      RightId: 0,
      RightCode: "", //编码
      RightName: "", //名称
      RightNameEn: "", //英文名称
      RightType: "1", //类型(1:菜单;2:操作)
      UrlPath: "", //访问路径
      IconPath: IconPathIcon, //图标路径
      DisplayIndex: "", //显示顺序
      Type: "",
    });
    form.AppName = router.currentRoute.value.query.AppName;
    form.Type = router.currentRoute.value.query.Type;
    form.ParentRightId = router.currentRoute.value.query.ParentRightID;
    form.AppId = router.currentRoute.value.query.AppID;
    if (
      router.currentRoute.value.query.Type == "Edit" ||
      router.currentRoute.value.query.Type == "view"
    ) {
      form.RightId = router.currentRoute.value.query.RightID;
    } else {
      form.ParentRightIDName = router.currentRoute.value.query.RightName
        ? router.currentRoute.value.query.RightName
        : "";
    }
    // 提交
    const onSubmit = () => {
      // 表单校验
      formRef.value.validate(async (valid) => {
        if (valid) {
          BtnLoading.value = true;
          let res = await SaveRight({ Right: form });
          BtnLoading.value = false;
          if (res.Code == 200) {
            common.ClosePageTag("权限编辑");
            ElMessage.success("保存成功");
            setTimeout(function () {
              router.push({
                path: "/jurisdiction",
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
    //获取详情
    const GetDetail = async (ID) => {
      let res = await GetRight({ RightId: ID });
      if (res.Code == 200) {
        form.ParentRightId = res.DataMap.ParentRightId;
        form.AppId = res.DataMap.AppId;
        form.RightId = res.DataMap.RightId;
        form.RightCode = res.DataMap.RightCode;
        form.RightName = res.DataMap.RightName;
        form.RightType = res.DataMap.RightType.toString();
        form.UrlPath = res.DataMap.UrlPath;
        form.IconPath = res.DataMap.IconPath;
        form.DisplayIndex = res.DataMap.DisplayIndex;
        if (res.DataMap.ParentRightId == 0) {
          form.ParentRightIDName = "统一权限管理系统";
        } else {
          let res1 = await GetRight({
            RightId: res.DataMap.ParentRightId,
          });
          if (res1.Code == 200) {
            form.ParentRightIDName = res1.DataMap.RightName;
          }
        }
      }
    };
    if (form.RightId > 0) {
      GetDetail(form.RightId);
    }
    const onReturn = () => {
      common.ClosePageTag("权限编辑");
      router.go(-1);
    };
    const SuccessImg = async (param) => {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          form.IconPath = res.DataMap.HttpsUrl;
        }
      });
    };
    const beforeUpload = async (file) => {
      const isJPG = file.type == "image/jpeg" || file.type == "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      return isLt2M;
    };
    const clear = () => {
      form.IconPath = ""
    }
    return { formRef, form, rules, onSubmit, onReturn, BtnLoading, SuccessImg, beforeUpload, clear };
  },
};
</script>
<style lang="less" scoped>
.crumbsDetail {
  margin-top: 2px;
}
</style>

<style>
.jurisdiction-uploader {
  width: 100px;
  height: 100px;
}

.jurisdiction-uploader .el-upload {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}

.jurisdiction-uploader-avatar {
  width: 100%;
}
</style>