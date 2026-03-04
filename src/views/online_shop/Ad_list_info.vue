<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="10">
          <el-row>
            <el-col :span="23">
              <el-form-item label="标题" prop="AdTitle">
                <el-input v-model="form.AdTitle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="广告类型">
                <el-select
                  v-model="form.AdType"
                  style="width: 100%"
                  placeholder="类型"
                >
                  <el-option label="图片" value="1"></el-option>
                  <el-option label="视频" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="跳转配置">
                <el-select
                  v-model="AdJumpType"
                  style="width: 100%"
                  placeholder="类型"
                >
                  <el-option label="不跳转" value="3"></el-option>
                  <el-option label="H5" value="1"></el-option>
                  <el-option label="小程序" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" v-if="AdJumpType == 1">
              <el-form-item label="H5Url">
                <el-input v-model="AdGoConfig.H5Url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" v-if="AdJumpType == 2">
              <el-form-item label="小程序APPID">
                <el-select
                  v-model="AdGoConfig.WxxcxAppid"
                  style="width: 100%"
                  placeholder=""
                >
                  <el-option
                    v-for="item in WxxcxAccountList"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" v-if="AdJumpType == 2">
              <el-form-item label="小程序页面地址">
                <el-input v-model="AdGoConfig.WxxcxPagepath"></el-input>
                <p style="height: 12px; color: #909399">Tips:/pages/my/index</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="显示位置" prop="DisplayPosition">
                <el-select
                  v-model="form.DisplayPosition"
                  style="width: 100%"
                  placeholder="类型"
                >
                  <el-option label="首页" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="显示顺序" prop="DisplayIndex">
                <el-input v-model="form.DisplayIndex"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="背景颜色">
                <el-color-picker v-model="AdGoConfig.MainColor" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="显示时间">
                <el-date-picker
                  style="width: 100%"
                  v-model="time"
                  :clearable="true"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="开始显示时间"
                  end-placeholder="结束显示时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-row>
            <el-col :span="23">
              <el-form-item label="副标题">
                <el-input v-model="form.AdSubTitle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.AdType == 1">
            <el-col :span="24">
              <el-form-item label="图片" ref="uploadElement" prop="">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      v-model="AdDisplayConfig.Image.Url"
                      v-if="false"
                    ></el-input>
                    <el-upload
                      class="commodity-home-uploader"
                      ref="upload"
                      :show-file-list="false"
                      action="#"
                      :http-request="SuccessImg"
                      :auto-upload="true"
                    >
                      <img
                        v-if="AdDisplayConfig.Image.Url"
                        :src="AdDisplayConfig.Image.Url"
                        class="commodity-home-uploader-avatar"
                      />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      首图，320*200 且不超过1M
                      <span
                        style="cursor: pointer; color: #ff6666"
                        class="el-icon-delete"
                        v-if="AdDisplayConfig.Image.Url"
                        @click="clear"
                        >删除</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.AdType == 2">
            <el-col :span="23">
              <el-form-item label="封面地址">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      v-model="AdDisplayConfig.ShortVideo.CoverUrl"
                      v-if="false"
                    ></el-input>
                    <el-upload
                      class="commodity-home-uploader"
                      ref="upload"
                      :show-file-list="false"
                      action="#"
                      :http-request="SuccessImgUrl"
                      :auto-upload="true"
                    >
                      <img
                        v-if="AdDisplayConfig.ShortVideo.CoverUrl"
                        :src="AdDisplayConfig.ShortVideo.CoverUrl"
                        class="commodity-home-uploader-avatar"
                      />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      封面，320*200 且不超过1M
                      <span
                        style="cursor: pointer; color: #ff6666"
                        class="el-icon-delete"
                        v-if="AdDisplayConfig.ShortVideo.CoverUrl"
                        @click="clear"
                        >删除</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.AdType == 2">
            <el-col :span="23">
              <el-form-item label="视频上传" prop="Video">
                <!-- action必选参数, 上传的地址 -->
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :on-progress="uploadVideoProcess"
                  :http-request="SuccessImg1"
                  :before-upload="beforeUploadVideo"
                  :show-file-list="false"
                >
                  <video
                    v-if="
                      AdDisplayConfig.ShortVideo.VideoUrl != '' && !videoFlag
                    "
                    :src="AdDisplayConfig.ShortVideo.VideoUrl"
                    class="avatar video-avatar"
                    controls="controls"
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <i
                    v-else-if="
                      AdDisplayConfig.ShortVideo.VideoUrl == '' && !videoFlag
                    "
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                  <el-progress
                    v-if="videoFlag == true"
                    type="circle"
                    :percentage="videoUploadPercent"
                    style=""
                  ></el-progress>
                </el-upload>
                <P class="text"
                  >请保证视频格式正确，且不超过500M
                  <span
                    style="cursor: pointer"
                    class="el-icon-delete"
                    v-if="AdDisplayConfig.ShortVideo.VideoUrl"
                    @click="clear1"
                    >删除</span
                  >
                </P>
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
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { SaveAd, GetAd } from "@/api/shopApi.js";
import { UploadSingle } from "@/api/imgapi.js";
import { GetDictionaryDetailList } from "@/api/common.js";
import common from "@/utils/common.js";
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
const AdJumpType = ref("3");
const videoFlag = ref(true); //是否显示进度条
const videoUploadPercent = ref(0); //是否显示进度条
const time = ref([]); //显示时间

//区分页面路由
let paraMeter = reactive({
  adType: "",
});
let form = reactive({
  AdId: "",
  AdType: "1",
  DisplayPosition: "1",
  DisplayIndex: "",
  AdDisplayConfig: "",
  AdTitle: "",
  AdSubTitle: "",
  AdGoConfig: "",
  BeginTime: "",
  EndTime: "",
});
const AdGoConfig = reactive({
  H5Url: "",
  WxxcxAppid: "",
  WxxcxPagepath: "",
  AdJumpType: "",
  MainColor: "",
});
const AdDisplayConfig = reactive({
  Image: {
    Url: "",
  },
  ShortVideo: {
    CoverUrl: "",
    VideoUrl: "",
  },
});
const rules = {
  AdTitle: [{ required: true, message: "请输入主标题", trigger: "blur" }],
  AdSubTitle: [{ required: true, message: "请输入副标题", trigger: "blur" }],
  DisplayPosition: [
    { required: true, message: "请输入显示位置", trigger: "blur" },
  ],
  DisplayIndex: [{ required: true, message: "请输入顺序", trigger: "blur" }],
};
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      AdDisplayConfig.Image.Url = res.DataMap.HttpsUrl;
    }
  });
};
const SuccessImgUrl = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      AdDisplayConfig.ShortVideo.CoverUrl = res.DataMap.HttpsUrl;
    }
  });
};

const clear = () => {
  AdDisplayConfig.Image.Url = "";
};
const clear1 = () => {
  AdDisplayConfig.ShortVideo.CoverUrl = "";
};
const uploadVideoProcess = (event, file, fileList) => {
  videoFlag.value = true;
  videoUploadPercent.value = file.percentage.toFixed(0) * 1;
};
const SuccessImg1 = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      videoFlag.value = false;
      videoUploadPercent.value = 0;
      AdDisplayConfig.ShortVideo.VideoUrl = res.DataMap.HttpsUrl;
    }
  });
};
const beforeUploadVideo = (file) => {
  const isLt100M = file.size / 1024 / 1024 < 500;
  if (
    [
      "video/mp4",
      "video/ogg",
      "video/flv",
      "video/avi",
      "video/wmv",
      "video/rmvb",
    ].indexOf(file.type) == -1
  ) {
    ElMessage.error("请上传正确的视频格式");
    return false;
  }
  if (!isLt100M) {
    ElMessage.error("上传视频大小不能超过100MB哦!");
    return false;
  }
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      if (form.AdType == 1) {
        //当选择的是上传图片素材
        if (AdDisplayConfig.Image.Url == "") {
          ElMessage.info("请先上传图片");
          btnLoading.value = false;
          return;
        }
      } else {
        //当选择的是上传视频素材
        if (
          AdDisplayConfig.ShortVideo.ShortVideo == "" ||
          AdDisplayConfig.ShortVideo.VideoUrl == ""
        ) {
          ElMessage.info("请先上传封面或者视频");
          btnLoading.value = false;
          return;
        }
      }
      AdGoConfig.AdJumpType = AdJumpType.value;
      if (AdJumpType.value == 1) {
        //当选择的是H5跳转
        if (AdGoConfig.H5Url == "") {
          ElMessage.info("请先输入H5地址");
          btnLoading.value = false;
          return;
        }
        AdGoConfig.WxxcxAppi = "";
        AdGoConfig.WxxcxPagepath = "";
      } else if (AdJumpType.value == 2) {
        //当选择的是小程序
        if (AdGoConfig.WxxcxAppid == "" || AdGoConfig.WxxcxPagepath == "") {
          ElMessage.info("请先输入小程序id或小程序地址");
          btnLoading.value = false;
          return;
        }
        AdGoConfig.H5Url = "";
      }
      if (time.value) {
        if (time.value.length > 0) {
          form.BeginTime = common.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            time.value[0]
          );
          form.EndTime = common.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            time.value[1]
          );
        } else {
          ElMessage.info("请选择时间");
          btnLoading.value = false;
          return;
        }
      } else {
        ElMessage.info("请选择时间");
        btnLoading.value = false;
        return;
      }
      if (AdGoConfig.MainColor == "") {
        ElMessage.info("请选择轮播图背景色");
        btnLoading.value = false;
        return;
      }
      form.AdDisplayConfig = JSON.stringify(AdDisplayConfig);
      form.AdGoConfig = JSON.stringify(AdGoConfig);
      let res = await SaveAd({ Ad: form, IsSubmit: true });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("广告详情");
        let titlePage = "";
        if (paraMeter.adType == 1) {
          titlePage = "首页广告";
        } else {
          titlePage = "广告管理";
        }
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: titlePage,
        });
        ElMessage.success("保存成功");
        setTimeout(function () {
          router.push({
            path: "/Ad_list",
            query: {
              adType: paraMeter.adType,
            },
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
const GetAdApi = async (ID) => {
  let res = await GetAd({
    ObjectId: ID,
  });
  if (res.Code === 200) {
    form.AdId = res.DataMap.AdId;
    form.DisplayPosition = res.DataMap.DisplayPosition.toString();
    form.DisplayIndex = res.DataMap.DisplayIndex;
    form.AdTitle = res.DataMap.AdTitle;
    form.AdSubTitle = res.DataMap.AdSubTitle;
    form.AdGoConfig = res.DataMap.AdGoConfig;
    form.BeginTime = res.DataMap.BeginTime;
    form.AdType = res.DataMap.AdType.toString();
    form.EndTime = res.DataMap.EndTime;
    time.value = [res.DataMap.BeginTime, res.DataMap.EndTime];
    form.AdDisplayConfig = res.DataMap.AdDisplayConfig;
    let AdDisplayConfigValue = JSON.parse(res.DataMap.AdDisplayConfig);
    if (AdDisplayConfigValue.Image.Url != "") {
      //那么当前是选择的图片素材
      AdDisplayConfig.Image.Url = AdDisplayConfigValue.Image.Url;
    } else {
      //反之则是视频素材
      AdDisplayConfig.ShortVideo.CoverUrl =
        AdDisplayConfigValue.ShortVideo.CoverUrl;
      AdDisplayConfig.ShortVideo.VideoUrl =
        AdDisplayConfigValue.ShortVideo.VideoUrl;
    }
    form.AdGoConfig = res.DataMap.AdGoConfig;
    if (res.DataMap.AdGoConfig != "") {
      let AdGoConfigValue = JSON.parse(res.DataMap.AdGoConfig);

      if (AdGoConfigValue.AdJumpType) {
        AdJumpType.value = AdGoConfigValue.AdJumpType;
      }
      if (AdGoConfigValue.MainColor) {
        //后加代码，为了判断为空值，避免报错
        AdGoConfig.MainColor = AdGoConfigValue.MainColor;
      }

      if (AdGoConfigValue.H5Url != "") {
        //说明选择的h5跳转地址
        AdGoConfig.H5Url = AdGoConfigValue.H5Url;
      } else {
        //说明选择的小程序跳转地址
        AdGoConfig.WxxcxAppid = AdGoConfigValue.WxxcxAppid;
        AdGoConfig.WxxcxPagepath = AdGoConfigValue.WxxcxPagepath;
      }
    }
  }
};
const onReturn = async (val) => {
  common.ClosePageTag("广告详情");
  router.back();
};
const WxxcxAccountList = ref([]); //小程序AppID下拉数据
//根据ID获取详情
const Init = async () => {
  paraMeter.adType = router.currentRoute.value.query.adType;
  if (router.currentRoute.value.query.ID) {
    form.AdId = router.currentRoute.value.query.ID;
    Type.value = router.currentRoute.value.query.Type;
    GetAdApi(form.AdId);
  }
  let res = await GetDictionaryDetailList({
    DictionaryCode: "go_wxxcx_account",
  });
  if (res.Code == 200) {
    WxxcxAccountList.value = res.DataMap;
  }
};

Init();
</script>

<style scoped>
#nav-goods {
  list-style-type: none;
  margin-top: 10px;
}

.inli-goods {
  border-bottom: solid 8px #f56c6c;
  position: relative;
  margin: 10px 10px 20px 0;
  border-radius: 4px;
  border-bottom-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 442px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
  height: 110px;
}

.goods-edit {
  position: absolute;
  right: 72px;
  z-index: 9;
  top: 32px;
}

.goods-edit img {
  width: 35px;
  height: 35px;
}

.goods-del {
  position: absolute;
  right: 22px;
  z-index: 9;
  top: 32px;
}

.goods-del img {
  width: 35px;
  height: 35px;
}

.goods-detail {
  height: 110px;
}

.goods-detail-title {
  position: absolute;
  top: 20px;
  color: #252525;
}

.goods-detail-time {
  position: absolute;
  top: 42px;
  font-size: 12px;
  color: #757575;
}

.goods-detail-rmb {
  position: absolute;
  top: 66px;
  color: #f56c6c;
}

.goods-detail-addorreduce {
  position: absolute;
  top: 58px;
  margin-left: 80px;
}

.goods-detail-no {
  position: absolute;
  top: 87px;
  color: #f56c6c;
  font-size: 14px;
}

.goods-detail-count {
  position: absolute;
  right: 14px;
  top: 80px;
  color: #313131;
}

.goods-type {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f56c6c;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 12px;
  color: #fff;
  line-height: 22px;
  width: 60px;
  text-align: center;
  height: 22px;
  letter-spacing: 1px;
}

.goode-number {
  border: solid 1px #f56c6c;
  border-radius: 20px;
  width: 90px;
  height: 27px;
  font-size: 16px;
  text-align: center;
}

.goode-number .goode-number-add {
  width: 40px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #f56c6c;
  cursor: pointer;
}

.goode-number .goode-number-value {
  width: 38px;
  height: 28px;
  line-height: 28px;
  background-color: #f56c6c;
  font-size: 14px;
  color: #fff;
}

.goode-number .goode-number-reduce {
  width: 40px;
  height: 30px;
  line-height: 28px;
  font-size: 22px;
  color: #6d6d6d;
  cursor: pointer;
}
</style>

<style>
.commodity-home-uploader {
  width: 320px;
  height: 200px;
}

.commodity-home-uploader .el-upload {
  width: 320px !important;
  height: 200px !important;
  line-height: 200px !important;
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
