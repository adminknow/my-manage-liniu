<template>
  <div
    style="height: 100%; overflow-y: auto; overflow-y: overlay; display: block"
  >
    <div class="top-set">页面</div>
    <div class="css-title">
      <p class="tit">后台设置</p>
      <el-form-item label="小程序" v-if="loginUser.UnitType == 1">
        <el-select
          v-model="list.AccountId"
          style="width: 100%"
          placeholder="微信小程序"
        >
        <el-option label="不指定" value=""></el-option>
          <el-option
            v-for="item in WxxcxAccountList"
            :key="item.AppId"
            :label="item.AppName"
            :value="item.AppId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="list.code"></el-input>
        <p style="height: 16px; color: #909399">Tips：homepage 代表首页</p>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="list.webTitle"></el-input>
      </el-form-item>

      <el-form-item label="备注" style="margin-bottom: 10px">
        <el-input type="textarea" :rows="4" v-model="list.remarks"></el-input>
      </el-form-item>
      <p class="tit">样式设置</p>
      <el-form-item label="页面标题">
        <el-input v-model="list.title"></el-input>
      </el-form-item>
      <el-form-item label="标题背景色">
        <el-color-picker
          v-model="list.backgroundColor"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="页面背景色">
        <el-color-picker
          v-model="list.backgroundPageColor"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="导航显示">
        <el-select style="width: 100%" v-model="list.isNavigation">
          <el-option label="是" value="1"> </el-option>
          <el-option label="否" value="0"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否分享">
        <el-select style="width: 100%" v-model="list.isShare">
          <el-option label="是" value="1"> </el-option>
          <el-option label="否" value="0"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分享标题" v-if="list.isShare == '1'">
        <el-input v-model="list.ShareTitle"></el-input>
      </el-form-item>
      <el-form-item label="分享图片" v-if="list.isShare == '1'">
        <img
          @click="addImage()"
          style="width: 64px; height: 64px"
          :src="
            list.ShareImgUrl
              ? list.ShareImgUrl
              : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/paged/default_image.png'
          "
        />
        <p style="height: 10px; color: #909399; font-size: 13px">
          宽高比建议尺寸 5:4，大小不超过 2 MB
        </p>
      </el-form-item>
    </div>

    <div class="upload-box" style="display: none">
      <el-upload
        class="upload-resource"
        ref="uploadRef"
        :show-file-list="false"
        action="#"
        :http-request="SuccessImg1"
        :auto-upload="true"
      >
      </el-upload>
    </div>
  </div>
</template>

<script>
import { UploadSingle } from "@/api/imgapi.js";
import { GetAllAccount } from "@/api/wxxcx.js";
import Cookie from "js-cookie";
export default {
  name: "Info",
  props: ["data"],
  data() {
    return {
      loginUser: JSON.parse(Cookie.get("User")),
      list: {},
      WxxcxAccountList: [], //小程序账号列表
    };
  },
  mounted() {
    this.list = this.data.data[0];
    this.getWxxcxAccountList();
  },
  methods: {
    async SuccessImg1(param) {
      //上传图片
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          this.list.ShareImgUrl = res.DataMap.HttpsUrl;
        }
      });
    },
    addImage() {
      //通过点击其他事件触发上传图片方法
      document.querySelector(".upload-resource .el-upload").click();
    },
    async getWxxcxAccountList() {
      //获取小程序账号列表
      let res = await GetAllAccount({});
      if (res.Code == 200) {
        this.WxxcxAccountList = res.DataMap;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.info-content {
  padding: 12px;
}
.tit {
  text-align: left;
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
::-webkit-scrollbar {
  display: none;
}
</style>
