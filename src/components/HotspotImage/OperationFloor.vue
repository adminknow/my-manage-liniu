<template>
  <div class="operationFloor">
    <div class="imgBox">
      <div class="container">
        <img
          ref="backgroundImg"
          :src="ImgUrl"
          ondragstart="return false;"
          oncontextmenu="return false;"
          alt=""
          style="width: 100%"
        />
        <!--绘制的热区-->
        <div
          v-show="caseShow"
          class="area"
          :style="{
            width: areaWidth + 'px',
            height: areaHeight + 'px',
            left: starX + 'px',
            top: starY + 'px',
          }"
        />
        <!--已有的热区-->
        <AreaBox
          v-for="(item, index) in areaData"
          :id="index"
          :key="index"
          :areaInit="item"
          :title="
            item.AdGoConfig.InputName
              ? item.AdGoConfig.InputName
              : '热区' + (index + 1)
          "
          @DelAreaBox="DelAreaBox"
        />
      </div>
    </div>
    <div class="right-btn">
      <div class="items" :style="{ height: ImgHeight + 'px' }">
        <div class="item-wrap" v-for="(item, index) in areaData" :key="item">
          <h1>热区{{ index + 1 }}</h1>
          <div class="l-info">
            <el-form-item label="名称">
              <el-input maxlength="10" show-word-limit v-model="item.AdGoConfig.InputName"></el-input>
            </el-form-item>
            <p>
              <span>跳转配置：</span>
              <span
                @click="urlPopup(index)"
                v-if="item.AdGoConfig.AdJumpTypeDesc"
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
          </div>
        </div>
      </div>
      <el-button icon="el-icon-plus" @click="addGood()" class="button1 add-hot">
        添加热区
      </el-button>
    </div>

    <el-dialog
      width="48%"
      title="图片跳转配置"
      v-model="ConfigShow"
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
          <el-button class="button2" @click="ConfigShow = false"
            >关闭</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <div style="width: 100%; height: 20px"></div>
  <div class="" style="text-align: center">
    <el-button class="button1" @click="saveHot">保 存</el-button>
    <el-button class="button2" @click="hotShow">关 闭</el-button>
  </div>
</template>

<script>
import { GetDictionaryDetailList } from "@/api/common.js";
import AreaBox from "./AreaBox.vue";
export default {
  name: "OperationFloor",
  props: {
    AreaData: {
      type: Array,
      default: () => [],
    },
    ImgUrl: {
      type: String,
      default: "",
    },
  },
  components: {
    AreaBox,
  },
  data() {
    return {
      starX: 0,
      // endX: 0,
      starY: 0,
      // endY: 0,
      areaWidth: 0,
      areaHeight: 0,
      caseShow: false,
      nowImgWidth: null,
      areaData: [],
      ConfigShow: false,
      WxxcxAccountList: [],
      index: "",
      AdGoConfig: {
        H5Url: "",
        WxxcxAppid: "",
        WxxcxPagepath: "",
        AdJumpType: "0",
        AdJumpTypeDesc: "",
        MainColor: "",
      },
    };
  },
  watch: {
    ImgUrl: {
      handler(newVal, oldVal) {
        this.ImgHeight = this.$refs.backgroundImg.offsetHeight;
      },
    },
  },
  mounted() {
    // 显示之前添加的热区
    if (this.AreaData && this.AreaData.length) {
      this.areaData = this.AreaData;
    } else {
      setTimeout(() => {
        this.addGood();
      }, 1000);
    }

    setTimeout(() => {
      this.ImgHeight = this.$refs.backgroundImg.offsetHeight;
    }, 500);

    this.GetDictionaryDetailListApi();
  },
  methods: {
    // 删除指定热区
    DelAreaBox(id) {
      this.areaData.splice(id, 1);
    },

    urlPopup(indexValue) {
      //添加跳转配置
      this.index = indexValue; //把点击的索引保存到全局
      if (this.areaData[indexValue].AdGoConfig.AdJumpType) {
        //有值说明不需要清空界面数据直接赋值
        this.AdGoConfig.H5Url = this.areaData[indexValue].AdGoConfig.H5Url;
        this.AdGoConfig.WxxcxAppid =
          this.areaData[indexValue].AdGoConfig.WxxcxAppid;
        this.AdGoConfig.WxxcxPagepath =
          this.areaData[indexValue].AdGoConfig.WxxcxPagepath;
        this.AdGoConfig.AdJumpType =
          this.areaData[indexValue].AdGoConfig.AdJumpType;
        this.AdGoConfig.AdJumpTypeDesc =
          this.areaData[indexValue].AdGoConfig.AdJumpTypeDesc;
        this.AdGoConfig.MainColor =
          this.areaData[indexValue].AdGoConfig.MainColor;
        this.AdGoConfig.InputName =
          this.areaData[indexValue].AdGoConfig.InputName;
      } else {
        this.AdGoConfig.H5Url = "";
        this.AdGoConfig.WxxcxAppid = "";
        this.AdGoConfig.WxxcxPagepath = "";
        this.AdGoConfig.AdJumpType = "0";
        this.AdGoConfig.AdJumpTypeDesc = "";
        this.AdGoConfig.MainColor = "";
      }
      this.ConfigShow = true;
    },
    async GetDictionaryDetailListApi() {
      let res = await GetDictionaryDetailList({
        DictionaryCode: "go_wxxcx_account",
      });
      if (res.Code == 200) {
        this.WxxcxAccountList = res.DataMap;
      }
    },
    addGood() {
      //添加热区
      const data = {
        starX: 0,
        starY: 10,
        areaWidth: 100,
        areaHeight: 100,
        nowImgWidth: this.$refs.backgroundImg.offsetWidth,
        nowImgHeight: this.$refs.backgroundImg.offsetHeight,
        originalHeight: this.$refs.backgroundImg.naturalHeight,
        originalWidth: this.$refs.backgroundImg.naturalWidth,
        AdGoConfig: {
          H5Url: "",
          InputName: "",
          WxxcxAppid: "",
          WxxcxPagepath: "",
          AdJumpType: "0",
          AdJumpTypeDesc: "",
          MainColor: "",
        },
        target: "_self",
      };
      this.areaData.push(data);
      // 初始化绘图
      this.caseShow = false;
      this.starX = 0;
      this.starY = 0;
      this.areaWidth = 0;
      this.areaHeight = 0;
    },
    saveHot() {
      this.$emit("SaveAllArea", this.areaData);
    },
    hotShow() {
      this.$emit("CloseShow", "");
    },
    confirm() {
      if (this.AdGoConfig.AdJumpType == "1") {
        this.AdGoConfig.AdJumpTypeDesc = "H5";
      } else if (this.AdGoConfig.AdJumpType == "2") {
        for (let i = 0; i < this.WxxcxAccountList.length; i++) {
          const row = this.WxxcxAccountList[i];
          if (this.AdGoConfig.WxxcxAppid == row.Code) {
            //匹配id
            if (row.Code == "current") {
              this.AdGoConfig.AdJumpTypeDesc = row.Name;
            } else {
              this.AdGoConfig.AdJumpTypeDesc = row.Name + "-小程序";
            }
          }
        }
      } else {
        this.AdGoConfig.AdJumpTypeDesc = "不跳转";
      }
      let listNew = JSON.parse(JSON.stringify(this.areaData));
      listNew[this.index]["AdGoConfig"] = this.AdGoConfig;
      this.areaData = JSON.parse(JSON.stringify(listNew));
      this.ConfigShow = false;
    },
  },
};
</script>

<style scoped lang="less">
.operationFloor {
  display: flex;
  flex-direction: row;
  position: relative;
  .header {
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;
      .name {
        font-size: 13px;
        font-weight: bold;
      }
    }
    .textBox {
      font-size: 12px;
      color: #777;
      margin-bottom: 10px;
    }
  }
  .imgBox {
    width: 60%;
    display: flex;
    justify-content: left;
    .container {
      padding: 0;
      position: relative;
      overflow: hidden;
    }
    .area {
      position: absolute;
      width: 200px;
      height: 200px;
      left: 200px;
      top: 300px;
      background: rgba(#2980b9, 0.3);
      border: 1px dashed #34495e;
    }
  }
  .right-btn {
    display: flex;
    padding-left: 10px;
    flex-direction: column;
    width: 40%;
    .items {
      overflow: hidden;
      overflow-y: auto;
    }
    .item-wrap {
      position: relative;
      background-color: #f2f2f2;
      padding: 20px;
      margin-bottom: 12px;
      cursor: move;
      font-size: 12px;
      border-radius: 4px;
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
    }
    .add-hot {
      width: 100%;
    }
  }
}
</style>
