<template>
  <div class="hot-image-content">
    <div class="top-set">图片热区</div>
    <div class="css-title">
      <p class="tit">图片设置</p>
    </div>
    <div class="l-info">
      <p>
        <el-form-item label="图片上传" label-width="100px">
          <div style="width: 100%">
            <el-upload
              class="hot-img-uploader"
              ref="uploadRef"
              :show-file-list="false"
              action="#"
              :http-request="SuccessImg1"
              :auto-upload="true"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                class="hot-img-uploader-avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>

          <p
            style="margin-top: 10px; min-height: 20px; line-height: 1.5"
            class="text"
          >
            建议宽度750像素 大小不超过 2 MB
          </p>
        </el-form-item>
      </p>
    </div>
    <div class="css-title">
      <p class="tit">
        内容设置 <span class="text">添加热区,最多添加10个热区</span>
      </p>
    </div>
    <div class="item-wrap" v-for="(item, index) in list.data" :key="item">
      <div class="item-wrap-del" v-if="index > 0">
        <el-icon @click="deleteItem(index)"><Delete /></el-icon>
      </div>

      <h1>热区{{ index + 1 }}</h1>
      <div class="l-info">
        <p>
          <span>名称：</span>
          <span>{{ item.AdGoConfig.InputName }} </span>
        </p>
        <p>
          <span>跳转配置：</span>
          <span
            >{{ item.AdGoConfig.AdJumpTypeDesc }}
            <span style="color: #f56c6c; cursor: pointer" @click="addHotImage()"
              >修改</span
            ></span
          >
        </p>
      </div>
    </div>
    <template v-if="list.data">
      <el-button
        icon="el-icon-plus"
        @click="addHotImage()"
        class="add-image button1 button-float"
      >
        添加热区
      </el-button>
    </template>

    <el-dialog
      width="60%"
      title="热区设置"
      v-model="hotShow"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <OperationFloor
        ref="operationFloor"
        :ImgUrl="imageUrl"
        :AreaData="data.data"
        @CloseShow="CloseShow"
        @SaveAllArea="SaveAllArea"
      />
    </el-dialog>
  </div>
</template>

<script>
import OperationFloor from "@/components/HotspotImage/OperationFloor.vue";
import { UploadSingle } from "@/api/imgapi.js";
export default {
  name: "Info",
  props: ["data"],
  components: {
    OperationFloor,
  },
  data() {
    return {
      list: {},
      hotShow: false,
      imageUrl: "",
    };
  },
  mounted() {
    this.list = this.data;
    this.imageUrl = this.data.options.ImageUrl;
  },
  methods: {
    SuccessImg1(param) {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          this.imageUrl = res.DataMap.HttpsUrl;
          this.data.options.ImageUrl = res.DataMap.HttpsUrl;
        }
      });
    },
    addHotImage() {
      if (this.imageUrl == "") {
        this.$message.error("请先上传图片");
        return;
      }
      this.hotShow = true;
    },
    SaveAllArea(AreaData) {
      this.hotShow = false;
      this.data.data = AreaData;
      this.data.options.ImageUrl = this.imageUrl;
    },
    CloseShow() {
      this.hotShow = false;
    },
    deleteItem(index) {
      //删除单个商品
      this.list.data.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
.tit {
  text-align: left;
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.hot-image-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  overflow: hidden;
  overflow-y: overlay;
  display: block;

  .add-image {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .item-wrap {
    position: relative;
    background-color: #f2f2f2;
    padding: 10px;
    margin: 0 10px;
    margin-bottom: 12px;
    cursor: move;
    font-size: 12px;
    border-radius: 4px;
    .item-wrap-del {
      position: absolute;
      color: #f56c6c;
      right: 8px;
      top: -2px;
      width: 10px;
      height: 10px;
      font-size: 16px;
      cursor: pointer;
    }
    .l-info {
      font-size: 12px;
      padding-top: 8px;
      width: calc(100% - 70px);
      p {
        margin: 4px 0 0;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
        .link {
          color: #1b8bff;
          cursor: pointer;
        }
        .text {
          white-space: nowrap;
          text-align: -webkit-auto;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
  .text {
    font-size: 12px;
    color: #888;
  }
  .l-info {
    font-size: 12px;
    width: calc(100%);
    .el-form-item {
      margin-bottom: 0;
    }
    p {
      margin: 12px 0 0;
      white-space: nowrap;
      overflow: hidden;
      display: flex;
    }
  }
}
</style>
<style>
.css-title {
  padding: 0 10px;
  font-size: 14px;
}
.hot-img-uploader {
  width: 70px;
  height: 70px;
}

.hot-img-uploader .el-upload {
  width: 70px !important;
  height: 70px !important;
  line-height: 70px !important;
}

.hot-img-uploader-avatar {
  width: 100%;
}
</style>
