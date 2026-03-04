<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="10">
          <el-row>
            <el-col :span="23">
              <el-form-item label="上级分类" style="position: relative;">
                <el-tree-select v-model="form.ParentGoodsCategoryId" :data="data" check-strictly=true
                  :render-after-expand="false" style="width: 76%" placeholder="不选代表为一级分类" />
                <el-button type="danger" @click="clearableTreeSel" style="margin-left:4px">清除数据</el-button>
                <div style="position: absolute;left:0;top:25px;font-size:12px;color:#606266">不选代表为一级分类</div>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="编码" prop="GoodsCategoryCode">
                <el-input :disabled="Type == 'View'" maxlength="10" show-word-limit
                  v-model="form.GoodsCategoryCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="名称" prop="GoodsCategoryName">
                <el-input :disabled="Type == 'View'" maxlength="10" show-word-limit
                  v-model="form.GoodsCategoryName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="详情" prop="GoodsCategoryDetail">
                <el-input :disabled="Type == 'View'" type="textarea" maxlength="100" :rows="4" show-word-limit
                  v-model="form.GoodsCategoryDetail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="顺序" prop="DisplayIndex">
                <el-input :disabled="Type == 'View'" v-model="form.DisplayIndex"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="首图" ref="uploadElement" prop="">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="form.ListImg" v-if="false"></el-input>
                    <el-upload class="commodity-home-uploader" ref="upload" :show-file-list="false" action="#"
                      :http-request="SuccessImg" :before-upload="beforeUpload" :auto-upload="true">
                      <img v-if="form.ListImg" :src="form.ListImg" class="commodity-home-uploader-avatar" />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      首图，100*100 且不超过500k
                      <span style="cursor: pointer; color: #ff6666" class="el-icon-delete"
                        v-if="form.ListImg && Type != 'View'" @click="clear">删除</span>
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
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
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import {
  SaveGoodsCategory,
  GetGoodsCategory,
  GetPublicGoodsCategoryList,
  GetGoodsCategoryList,
} from "@/api/goods.js";
import { UploadSingle } from "@/api/imgapi.js";
import common from "@/utils/common.js";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
const mall = ref("");
const data = ref([]);

let form = reactive({
  ParentGoodsCategoryId: "",
  GoodsCategoryId: "",
  GoodsCategoryType: "3",
  GoodsCategoryCode: "",
  GoodsCategoryName: "",
  DisplayIndex: "",
  ListImg: "",
  GoodsCategoryConfig: "",
  GoodsCategoryDetail: "",
});
const rules = {
  GoodsCategoryCode: [
    { required: true, message: "请输入编码", trigger: "blur" },
  ],
  GoodsCategoryName: [
    { required: true, message: "请输入名称", trigger: "blur" },
  ],
  DisplayIndex: [
    { required: true, message: "请输入显示顺序", trigger: "blur" },
  ],
  ListImg: [{ required: true, message: "请选择图片", trigger: "blur" }],
};
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.ListImg = res.DataMap.HttpsUrl;
    }
  });
};
const beforeUpload = async (file) => {
  const isJPG = file.type == "image/jpeg" || file.type == "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 格式!");
  }
  // if (!isLt2M) {
  //   this.$message.error("上传头像图片大小不能超过 2MB!");
  // }
  return isLt2M;
};

const clear = () => {
  form.ListImg = "";
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      // if (form.ListImg == "") {
      //   ElMessage.info("请先选择首图");
      //   btnLoading.value = false;
      //   return;
      // }
      let res = await SaveGoodsCategory({ GoodsCategory: form, IsSubmit: true });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("我的分类详情");
        let returnBackUrl = "";
        if (mall.value == 1) {
          returnBackUrl = "/product_category";
        } else {
          returnBackUrl = "/my_category";
        }
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "我的分类",
        });
        ElMessage.success("保存成功");
        setTimeout(function () {
          router.push({
            path: returnBackUrl,
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
const GetGoodsById = async (ID) => {
  let res = await GetGoodsCategory({
    ObjectId: ID,
  });
  if (res.Code === 200) {
    form.ListImg = res.DataMap.ListImg;
    form.GoodsCategoryCode = res.DataMap.GoodsCategoryCode;
    form.GoodsCategoryName = res.DataMap.GoodsCategoryName;
    form.GoodsCategoryId = res.DataMap.GoodsCategoryId;
    form.GoodsCategoryDetail = res.DataMap.GoodsCategoryDetail;
    form.ParentGoodsCategoryId = res.DataMap.ParentGoodsCategoryId == 0 ? '' : res.DataMap.ParentGoodsCategoryId;
    form.DisplayIndex = res.DataMap.DisplayIndex;
  }
};
const onReturn = async (val) => {
  common.ClosePageTag("我的分类");
  router.back();
};

const GetGoodsCategoryListApi = async () => {
  let dataValue = [];
  let res = await GetGoodsCategoryList({});
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      //第一级(大类)
      let object = {};
      object.value = row.GoodsCategoryId;
      object.label = row.GoodsCategoryName;
      object.children = [];
      row.SubGoodsCategories.forEach((row1) => {
        //第二级(中类)
        let objectChildren = {};
        objectChildren.value = row1.GoodsCategoryId;
        objectChildren.label = row1.GoodsCategoryName;
        objectChildren.children = [];
        row1.SubGoodsCategories.forEach((row2) => {
          //第三级(小类)
          let objectChildren2 = {};
          objectChildren2.value = row2.GoodsCategoryId;
          objectChildren2.label = row2.GoodsCategoryName;
          objectChildren.children.push(objectChildren2);
        });
        object.children.push(objectChildren);
      });
      dataValue.push(object);
    });
    data.value = dataValue;
  }
};
const GetPublicGoodsCategoryListApi = async () => {
  let dataValue = [];
  let res = await GetPublicGoodsCategoryList({});
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      //第一级(大类)
      let object = {};
      object.value = row.GoodsCategoryId;
      object.label = row.GoodsCategoryName;
      object.children = [];
      row.SubGoodsCategories.forEach((row1) => {
        //第二级(中类)
        let objectChildren = {};
        objectChildren.value = row1.GoodsCategoryId;
        objectChildren.label = row1.GoodsCategoryName;
        objectChildren.children = [];
        row1.SubGoodsCategories.forEach((row2) => {
          //第三级(小类)
          let objectChildren2 = {};
          objectChildren2.value = row2.GoodsCategoryId;
          objectChildren2.label = row2.GoodsCategoryName;
          objectChildren.children.push(objectChildren2);
        });
        object.children.push(objectChildren);
      });
      dataValue.push(object);
    });
    data.value = dataValue;
  }
};

const clearableTreeSel = () => {
  form.ParentGoodsCategoryId = "";
};
//根据ID获取详情
const Init = async () => {
  if (loginUser.UnitName == "礼牛网") {
    GetPublicGoodsCategoryListApi();
  } else {
    GetGoodsCategoryListApi();
  }
  if (router.currentRoute.value.query.ID) {
    form.GoodsId = router.currentRoute.value.query.ID;
    GetGoodsById(form.GoodsId);
  }
  Type.value = router.currentRoute.value.query.Type;
  if (router.currentRoute.value.query.mall) {
    mall.value = router.currentRoute.value.query.mall;
  }
};
Init();
</script>

<style scoped></style>

<style>
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

.icon_top {
  position: relative;
  top: 5px;
  left: 10px;
}
</style>