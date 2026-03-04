<template>
  <div>
    <div class="top-set">搜索</div>
    <div class="css-title">
      <p class="tit">样式设置</p>
      <el-form-item label="热门标题" label-width="100px">
        <el-input
          type="textarea"
          v-model="list.title"
          @input="handleInput"
          placeholder="请输入标签，用逗号分隔"
        ></el-input>
        <p style="font-size:12px">输入你需要的标题，按英文逗号自动隔开</p>
      </el-form-item>
      <el-form-item label="外框背景" label-width="100px">
        <el-color-picker
          v-model="cssStyle.outsideBgColor"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="内框背景" label-width="100px">
        <el-color-picker
          v-model="cssStyle.innerBgColor"
          show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="客服" label-width="100px">
        <el-switch
          inline-prompt
          @change="changeCustomer"
          v-model="value1"
          active-text="开"
          inactive-text="关"
        />
      </el-form-item>
      <el-form-item label="图片Logo" label-width="100px">
        <el-switch
          @change="changeLogo"
          inline-prompt
          v-model="value2"
          active-text="开"
          inactive-text="关"
        />
      </el-form-item>
      <el-form-item label="" label-width="100px" v-if="value2">
        <div style="width: 100%">
          <el-upload
            class="customer-uploader"
            ref="uploadRef"
            :show-file-list="false"
            action="#"
            :http-request="SuccessImg1"
            :auto-upload="true"
          >
            <img
              v-if="list.logoImg"
              :src="list.logoImg"
              class="customer-uploader-avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>

        <p
          style="margin-top: 10px; min-height: 20px; line-height: 1.5"
          class="text"
        >
          建议尺寸:100*100
        </p>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { UploadSingle } from "@/api/imgapi";
export default {
  name: "Info",
  props: ["data"],
  data() {
    return {
      inputvalue: ["tag1", "tag2", "tag3"],
      list: {},
      value2: false,
      value1: false,
      imgValue: "",
      cssStyle: {},
    };
  },
  mounted() {
    this.list = this.data.data[0];
    this.imgValue = "";
    if (this.list.isLogo) {
      //如果有logo数据就显示
      this.value2 = true;
    } else {
      this.value2 = false;
    }
    if (this.list.customer) {
      //如果勾选了客服就显示
      this.value1 = true;
    } else {
      this.value1 = false;
    }
    this.cssStyle = this.data.options.cssStyle;
  },
  computed: {},
  methods: {
    handleInput(value) {
      // 使用逗号分隔标签
      this.list.titleList= value.trim().split(",");
      console.log(this.list.titleList);
    },
    handleSpace(event) {
      // 在空格键按下时添加标签
      if (event.target.selectionStart === event.target.value.length) {
        this.list.title += ",";
      }
    },
    handleDelete() {
      // 在删除键按下时移除最后一个标签
      const lastCommaIndex = this.list.title.lastIndexOf(",");
      if (lastCommaIndex !== -1) {
        this.list.title = this.list.title.substr(0, lastCommaIndex);
      } else {
        this.list.title = "";
      }
   
    },
    changeLogo() {
      this.list.isLogo = this.value2;
    },
    changeCustomer() {
      this.list.customer = this.value1;
    },
    SuccessImg1(param) {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          this.list.logoImg = res.DataMap.HttpsUrl;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tit {
  text-align: left;
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.desc {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
</style>
<style lang="less">
.customer-uploader {
  width: 80px;
  height: 80px;
  .el-upload {
    width: 80px !important;
    height: 80px !important;
    line-height: 80px !important;
  }
}

.customer-uploader-avatar {
  width: 100%;
}
</style>
