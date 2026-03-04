<template>
  <!-- Banner & Image 通用组件 -->
  <div class="image-content">
    <div class="top-set">图片</div>
    <p class="desc">
      <span v-if="list.type == 'images'">单图</span
      ><span v-if="list.type == 'banner'">轮播图</span>(最多{{
        len
      }}张，可拖动排序）
    </p>

    <draggable
      v-model="list.data"
      tag="ul"
      draggable="li"
      v-if="list.data && list.data.length > 0"
      class="image-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in list.data" :key="index">
        <div class="l-info">
          <p>
            <span>名称：</span>
            <span class="text">{{
              item && item.name ? item && item.name : "图片" + (index + 1)
            }}</span>
          </p>
          <p v-if="list.type == 'banner'">
            <span>跳转配置：</span>
            <span @click="urlPopup(index)" v-if="item.AdGoConfig.AdJumpTypeDesc"
              >{{ item.AdGoConfig.AdJumpTypeDesc }}
              <span style="color: #f56c6c; cursor: pointer">修改</span></span
            >
            <span
              style="color: #f56c6c"
              v-else
              @click="urlPopup(index)"
              class="link"
              >请设置跳转链接</span
            >
          </p>
          <p v-if="list.type == 'banner'">
            <span v-if="item.AdGoConfig.AdJumpType == 2">跳转地址：</span>
            <span v-if="item.AdGoConfig.AdJumpType == 2">
              {{ item.AdGoConfig.WxxcxPagepath }}</span
            >
            <span v-if="item.AdGoConfig.AdJumpType == 1">跳转地址：</span>
            <span v-if="item.AdGoConfig.AdJumpType == 1">
              {{ item.AdGoConfig.H5Url }}</span
            >
          </p>
          <p v-if="list.type == 'banner'">
            <span>背景颜色：</span>
            <span>
              <el-color-picker v-model="item.AdGoConfig.MainColor"
            /></span>
          </p>
        </div>
        <div class="r-image">
          <span @click="removeImage(index)">
            <el-icon><Close /></el-icon
          ></span>
          <div class="image-box">
            <img :src="item && item.url" />
            <span @click="addImage(index)" class="el-icon-edit-outline"></span>
          </div>
        </div>
      </li>
    </draggable>
    <template v-if="list.data && list.data.length < len">
      <el-button
        icon="el-icon-plus"
        @click="addImage(null)"
        class="add-image button1 button-float"
      >
        添加图片
      </el-button>
      <span v-if="list.type == 'banner'" class="size">建议尺寸:750x500</span>
    </template>
    <div class="upload-box" style="display: none">
      <el-upload
        class="brand-uploader"
        ref="uploadRef"
        :show-file-list="false"
        action="#"
        :http-request="SuccessImg1"
        :auto-upload="true"
      >
      </el-upload>
    </div>
    <el-dialog
      width="48%"
      title="图片跳转配置"
      v-model="show"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form label-width="130px">
        <el-form-item label="跳转类型">
          <el-select
            v-model="AdGoConfig.AdJumpType"
            style="width: 80%"
            placeholder="类型"
          >
            <el-option label="不跳转" value="0"></el-option>
            <el-option label="H5" value="1"></el-option>
            <el-option label="小程序" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="130px"
          label="小程序APPID"
          v-if="AdGoConfig.AdJumpType == 2"
        >
          <el-select
            v-model="AdGoConfig.WxxcxAppid"
            style="width: 80%"
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
        <el-form-item
          label-width="130px"
          label="小程序页面地址"
          v-if="AdGoConfig.AdJumpType == 2"
        >
          <el-input
            style="width: 80%"
            v-model="AdGoConfig.WxxcxPagepath"
          ></el-input>
          <p style="height: 12px; color: #909399">Tips:/pages/my/index</p>
        </el-form-item>
        <el-form-item
          label-width="130px"
          label="H5Url"
          v-if="AdGoConfig.AdJumpType == 1"
        >
          <el-input style="width: 80%" v-model="AdGoConfig.H5Url"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button class="button1" @click="confirm">确定</el-button>
          <el-button class="button2" @click="show = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import { ElMessage } from "element-plus";
import { ref, reactive, defineComponent, computed } from "vue";
import { UploadSingle } from "@/api/imgapi.js";
import { GetDictionaryDetailList } from "@/api/common.js";
export default defineComponent({
  name: "ImagePage",
  props: {
    data: {
      type: Object,
    },
  },
  components: { draggable: VueDraggableNext },
  setup(props) {
    const list = ref({});
    const WxxcxAccountList = ref([]); //小程序AppID下拉数据
    const AdGoConfig = reactive({
      H5Url: "",
      WxxcxAppid: "",
      WxxcxPagepath: "",
      AdJumpType: "0",
      AdJumpTypeDesc: "",
      MainColor: "",
    });
    const index = ref(null);
    const show = ref(false);
    const imageIndex = ref(null);
    const uploadRef = ref(null);

    list.value = props.data;
    let len = computed(() => (list.value.type == "images" ? 8 : 10));

    const addImage = (index) => {
      //通过点击其他事件触发上传图片方法
      imageIndex.value = index;
      uploadRef.value.$el.querySelector("input").click();
    };
    const confirm = () => {
      //保存轮播图跳转信息
      if (AdGoConfig.AdJumpType == "1") {
        AdGoConfig.AdJumpTypeDesc = "H5";
      } else if (AdGoConfig.AdJumpType == "2") {
        for (let i = 0; i < WxxcxAccountList.value.length; i++) {
          const row = WxxcxAccountList.value[i];
          if (AdGoConfig.WxxcxAppid == row.Code) {
            //匹配id
            if (row.Code == "current") {
              AdGoConfig.AdJumpTypeDesc = row.Name;
            } else {
              AdGoConfig.AdJumpTypeDesc = row.Name + "-小程序";
            }
          }
        }
      } else {
        AdGoConfig.AdJumpTypeDesc = "不跳转";
      }
      let listNew = JSON.parse(JSON.stringify(list.value.data));
      AdGoConfig.MainColor = listNew[index.value]["AdGoConfig"].MainColor;
      listNew[index.value]["AdGoConfig"] = AdGoConfig;
      list.value.data = JSON.parse(JSON.stringify(listNew));
      close();
    };

    const SuccessImg1 = async (param) => {
      //上传图片
      const len = list.value.data.length;
      if (len >= len.value) {
        ElMessage.warning(`最多添加${len}张图片!`);
        return;
      }
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          const data = {
            name: param.file.name,
            url: res.DataMap.HttpsUrl,
            AdGoConfig: {
              H5Url: "",
              WxxcxAppid: "",
              WxxcxPagepath: "",
              AdJumpType: "0",
              AdJumpTypeDesc: "",
              MainColor: "",
            },
          };
          const index = imageIndex.value;
          if (index !== null) {
            list.value[index].data = data;
          } else {
            list.value.data.push(data);
          }
        }
      });
    };
    const close = () => {
      //关闭弹窗
      show.value = false;
    };
    const urlPopup = (indexValue) => {
      //添加跳转配置
      index.value = indexValue; //把点击的索引保存到全局
      if (list.value.data[indexValue].AdGoConfig.AdJumpType) {
        //有值说明不需要清空界面数据直接赋值
        AdGoConfig.H5Url = list.value.data[indexValue].AdGoConfig.H5Url;
        AdGoConfig.WxxcxAppid =
          list.value.data[indexValue].AdGoConfig.WxxcxAppid;
        AdGoConfig.WxxcxPagepath =
          list.value.data[indexValue].AdGoConfig.WxxcxPagepath;
        AdGoConfig.AdJumpType =
          list.value.data[indexValue].AdGoConfig.AdJumpType;
        AdGoConfig.AdJumpTypeDesc =
          list.value.data[indexValue].AdGoConfig.AdJumpTypeDesc;
        AdGoConfig.MainColor = list.value.data[indexValue].AdGoConfig.MainColor;
      } else {
        AdGoConfig.H5Url = "";
        AdGoConfig.WxxcxAppid = "";
        AdGoConfig.WxxcxPagepath = "";
        AdGoConfig.AdJumpType = "0";
        AdGoConfig.AdJumpTypeDesc = "";
        AdGoConfig.MainColor = "";
      }
      show.value = true;
    };

    const removeImage = (index) => {
      //删除其中一条数据
      list.value.data.splice(index, 1);
    };

    const Init = async () => {
      let res = await GetDictionaryDetailList({
        DictionaryCode: "go_wxxcx_account",
      });
      if (res.Code == 200) {
        WxxcxAccountList.value = res.DataMap;
      }
    };

    Init();
    return {
      list,
      index,
      show,
      imageIndex,
      len,
      addImage,
      uploadRef,
      SuccessImg1,
      close,
      removeImage,
      urlPopup,
      AdGoConfig,
      WxxcxAccountList,
      confirm,
    };
  },
});
</script>

<style lang="less" scoped>
.image-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  overflow: hidden;
  .desc {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin: 18px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }
  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
  }
  .add-image {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .image-list {
    margin: 0;
    padding: 0 10px;
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      background: #dbdbdb;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: #f6f6f6;
      border-radius: 10px;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    li {
      list-style: none;
      background: #f7f8f9;
      border-radius: 4px;
      padding: 6px 14px 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      &.disable div {
        pointer-events: none;
        user-select: none;
      }
      .l-info {
        font-size: 12px;
        padding-top: 8px;
        width: calc(100% - 70px);
        p {
          margin: 12px 0 0;
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
      .r-image {
        text-align: right;
        .el-icon-close {
          color: #999;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          cursor: pointer;
          &:hover {
            color: red;
          }
        }
        .image-box {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
          }
          span {
            position: absolute;
            top: 50%;
            left: 50%;
            color: #fff;
            transform: translate(-50%, -50%);
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s;
          }
          img {
            max-width: 100%;
          }
          &:hover {
            &::before,
            span {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
