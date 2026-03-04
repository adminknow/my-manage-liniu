<template>
  <div class="ad-image-content">
    <div class="top-set">图文导航</div>
    <div style="width: 100%; height: 4px"></div>
    <div class="css-title">
      <p class="tit">样式设置</p>
      <el-form-item label="图片样式">
        <el-radio-group v-model="cssInfo1" @change="ImgCssChange">
          <el-radio-button label="一排固定" value="一排固定" />
          <el-radio-button label="两排固定" value="两排固定" />
          <el-radio-button label="一排滑动" value="一排滑动" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="一屏显示" v-if="cssInfo1 != '一排滑动'">
        <el-radio-group
          v-model="cssInfo2"
          v-if="cssInfo1 == '一排固定'"
          @change="OneScreenChange"
        >
          <el-radio-button
            v-for="item in firsts"
            :key="item"
            :label="item.key"
            :value="item.value"
          ></el-radio-button>
        </el-radio-group>
        <el-radio-group
          v-model="cssInfo2"
          v-if="cssInfo1 == '两排固定'"
          @change="OneScreenChange"
        >
          <el-radio-button
            v-for="item in seconds"
            :key="item"
            :label="item.key"
            :value="item.value"
          ></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
    <span v-if="cssInfo1 == '一排滑动'" class="size">最多10个</span>
    <div style="width: 100%; height: 4px"></div>
    <div class="css-title">
      <p class="tit">内容设置</p>
    </div>
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
            <el-form-item label="">
              <el-input
                style="width: 80%"
                v-model="item.title"
                placeholder="请输入标题"
                maxlength="4"
                show-word-limit
              ></el-input>
            </el-form-item>
          </p>
          <p>
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
          <span v-if="item.AdGoConfig.AdJumpType == 2">跳转地址：</span>
          <span v-if="item.AdGoConfig.AdJumpType == 2">
            {{ item.AdGoConfig.WxxcxPagepath }}</span
          >
          <span v-if="item.AdGoConfig.AdJumpType == 1">跳转地址：</span>
          <span v-if="item.AdGoConfig.AdJumpType == 1">
            {{ item.AdGoConfig.H5Url }}</span
          >
        </div>
        <div class="r-image">
          <div class="image-box">
            <img @click="addImage(index)" :src="item && item.url" />
          </div>
        </div>
      </li>
    </draggable>
    <template v-if="list.data">
      <el-button
        v-if="saveShowBtn"
        icon="el-icon-plus"
        @click="addImage(null)"
        class="add-image button1 button-float"
      >
        添加内容
      </el-button>
      <span class="size">建议尺寸:100x100</span>
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
import { ref, reactive, defineComponent } from "vue";
import { UploadSingle } from "@/api/imgapi.js";
import { GetDictionaryDetailList } from "@/api/common.js";
export default defineComponent({
  name: "AdImagePage",
  props: {
    data: {
      type: Object,
    },
  },
  components: { draggable: VueDraggableNext },
  setup(props) {
    const list = ref({});
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
    const saveShowBtn = ref(false);
    const cssInfo1 = ref("一排固定");
    const cssInfo2 = ref("4个导航");
    const firsts = ref([
      { value: "4", key: "4个导航" },
      { value: "5", key: "5个导航" },
    ]);
    const seconds = ref([
      { value: "10", key: "10个导航" },
      { value: "8", key: "8个导航" },
      { value: "6", key: "6个导航" },
    ]);

    const WxxcxAccountList = ref([]); //小程序AppID下拉数据
    list.value = props.data;
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
      listNew[index.value]["AdGoConfig"] = AdGoConfig;
      list.value.data = JSON.parse(JSON.stringify(listNew));
      close();
    };

    const SuccessImg1 = async (param) => {
      //上传图片
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          const data = {
            url: res.DataMap.HttpsUrl,
            title: "",
            AdGoConfig: {},
          };
          const index = imageIndex.value;
          if (index !== null) {
            list.value.data[index].url = res.DataMap.HttpsUrl;
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

    const removeImage = (index) => {
      //删除其中一条数据
      list.value.data.splice(index, 1);
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

    const OneScreenChange = (val) => {
      switch (val) {
        case "5个导航":
          list.value.options.cssStyle.ShowCss = 5;
          InitData(5);
          break;
        case "4个导航":
          list.value.options.cssStyle.ShowCss = 4;
          InitData(4);
          break;
        case "10个导航":
          list.value.options.cssStyle.ShowCss = 10;
          InitData(10);
          break;
        case "8个导航":
          list.value.options.cssStyle.ShowCss = 8;
          InitData(8);
          break;
        case "6个导航":
          list.value.options.cssStyle.ShowCss = 6;
          InitData(6);
          break;
        default:
          break;
      }
    };
    const ImgCssChange = (val) => {
      if (val == "一排滑动") {
        //最多10个
        list.value.options.cssStyle.ImgCss = 3;
        InitData(10);
      } else if (val == "一排固定") {
        list.value.options.cssStyle.ImgCss = 1;
        cssInfo2.value = "4个导航";
        InitData(4);
        list.value.options.cssStyle.ShowCss = 4;
      } else if (val == "两排固定") {
        list.value.options.cssStyle.ImgCss = 2;
        cssInfo2.value = "10个导航";
        list.value.options.cssStyle.ShowCss = 10;
        InitData(10);
      }
    };

    const InitData = (ShowValue) => {
      if (list.value.data.length > 0) {
        if (list.value.data.length < ShowValue) {
          //如果小于ShowValue个那么就push
          let DifferenceValue = ShowValue - list.value.data.length;
          for (let i = 0; i < DifferenceValue; i++) {
            list.value.data.push({
              url: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1",
              title: "",
              AdGoConfig: {},
            });
          }
        }
        if (list.value.data.length > ShowValue) {
          //如果大于ShowValue个那么就删除
          let DifferenceValue = list.value.data.length - ShowValue;
          for (let i = 0; i < DifferenceValue; i++) {
            list.value.data.pop();
          }
        }
      } else {
        list.value.data = [
          {
            url: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1",
            title: "",
            AdGoConfig: {},
          },
          {
            url: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1",
            title: "",
            AdGoConfig: {},
          },
          {
            url: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1",
            title: "",
            AdGoConfig: {},
          },
          {
            url: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1",
            title: "",
            AdGoConfig: {},
          },
        ];
      }
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
    if (list.value.data.length == 0) {
      //初始化数据
      InitData(1, 4);
    } else {
      //有值的时候
      switch (list.value.options.cssStyle.ImgCss.toString()) {
        case "1":
          cssInfo1.value = "一排固定";
          break;
        case "2":
          cssInfo1.value = "两排固定";
          break;
        case "3":
          cssInfo1.value = "一排滑动";
          break;
        default:
          break;
      }
      switch (list.value.options.cssStyle.ShowCss.toString()) {
        case "4":
          cssInfo2.value = "4个导航";
          break;
        case "5":
          cssInfo2.value = "5个导航";
          break;
        case "10":
          cssInfo2.value = "10个导航";
          break;
        case "8":
          cssInfo2.value = "8个导航";
          break;
        case "6":
          cssInfo2.value = "6个导航";
          break;
        default:
          break;
      }
    }
    return {
      list,
      index,
      show,
      imageIndex,
      addImage,
      uploadRef,
      SuccessImg1,
      close,
      removeImage,
      AdGoConfig,
      urlPopup,
      confirm,
      WxxcxAccountList,
      cssInfo1,
      cssInfo2,
      firsts,
      seconds,
      OneScreenChange,
      ImgCssChange,
      saveShowBtn,
      InitData,
    };
  },
});
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
.ad-image-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  overflow: hidden;
  .add-image {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
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
      padding: 10px 14px 10px;
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
          cursor: pointer;
          // &::before {
          //   content: "";
          //   position: absolute;
          //   top: 0;
          //   left: 0;
          //   width: 100%;
          //   height: 100%;
          //   background: rgba(0, 0, 0, 0.5);
          //   opacity: 0;
          //   transition: all 0.3s;
          // }
          // span {
          //   position: absolute;
          //   top: 50%;
          //   left: 50%;
          //   color: #fff;
          //   transform: translate(-50%, -50%);
          //   font-size: 20px;
          //   cursor: pointer;
          //   opacity: 0;
          //   transition: all 0.3s;
          // }
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
