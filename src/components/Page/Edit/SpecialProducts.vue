<template>
  <div class="products-content">
    <div class="top-set">专题商品</div>
    <div class="css-title">
      <p class="tit">样式设置</p>
      <el-form :inline="true">
        <el-form-item label="选择模版">
          <el-radio-group v-model="radioNavigation" @change="changeRadioNavigation">
            <el-radio-button label="文字导航" value="1" />
            <el-radio-button label="图片导航" value="2" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :inline="true" v-if="radioNavigation == '文字导航'">
        <el-form-item label="背景颜色"><el-color-picker v-model="list.options.bgColor" />
        </el-form-item>
        <el-form-item label="标题颜色"><el-color-picker v-model="list.options.titleColor" />
        </el-form-item>
      </el-form>
      <el-form-item label="价格颜色"><el-color-picker v-model="list.options.priceColor" />
      </el-form-item>
      <el-form-item label="显示原价">
        <el-radio-group v-model="originalPriceText" @change="onOriginalPriceChange">
          <el-radio-button label="是" />
          <el-radio-button label="否" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="副标题显示" v-if="radioNavigation == '文字导航'">
        <el-radio-group v-model="radioGroup" @change="changeRadioGroup">
          <el-radio-button label="显示" value="1" />
          <el-radio-button label="不显示" value="2" />
        </el-radio-group>
      </el-form-item>
    </div>
    <div style="width: 100%; height: 10px"></div>
    <p class="desc">
      <span>最多添加10个专题，鼠标拖动调整顺序;</span>
    </p>

    <draggable v-model="list.data" tag="ul" draggable="li" v-if="list.data && list.data.length > 0" class="image-list">
      <li :class="item.active ? 'li-active' : ''" v-for="(item, index) in list.data" :key="index">
        <div class="l-info" @click="changeLi(index)">
          <div style="
              background: rgba(245, 108, 108, 0.5);
              padding: 2px;
              border-radius: 5px;
            ">
            <p>
              <el-form-item label-width="80px" label="标题">
                <el-input style="width: 80%" v-model="item.title" placeholder="请输入标题" maxlength="4"
                  show-word-limit></el-input>
              </el-form-item>
            </p>
            <p v-if="radioNavigation == '文字导航'">
              <el-form-item label-width="80px" label="副标题">
                <el-input style="width: 80%" v-model="item.subtitle" placeholder="请输入副标题" maxlength="4"
                  show-word-limit></el-input>
              </el-form-item>
            </p>
            <p v-if="radioNavigation == '图片导航'">
              <el-form-item label="图片" label-width="80px">
                <div style="width: 100%">
                  <el-upload class="hot-img-uploader" ref="uploadRef" :show-file-list="false" action="#"
                    :http-request="SuccessImg1" :auto-upload="true">
                    <img v-if="item.img" :src="item.img" class="hot-img-uploader-avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                      <Plus />
                    </el-icon>
                  </el-upload>
                </div>

                <p style="margin-top: 10px; min-height: 20px; line-height: 1.5" class="text">
                  建议尺寸：300*300
                </p>
              </el-form-item>
            </p>
          </div>
          <div style="width: 100%; height: 5px"></div>
          <draggable v-model="item.goodsItem" class="goods-list">
      <li class="goods-item" v-for="(goodsItem, goodsIndex) in item.goodsItem" :key="goodsIndex">
        <div class="item-style">
          <div class="image" style="text-align: center">
            <el-tooltip effect="dark" :content="goodsItem.GoodsTitle" placement="top"
              :show-after="300">
              <el-image style="width: 70px;height: 70px;" :src="goodsItem.ListImg" fit="scale-down" />
            </el-tooltip>
          </div>
          <div class="line_ellipsi" style="width: 100%">
            {{ goodsItem.GoodsTitle }}
          </div>
          <el-icon :size="18" @click="deleteItem(index, goodsIndex)">
            <Delete />
          </el-icon>
        </div>
      </li>
    </draggable>
    <el-button icon="el-icon-plus" @click="addGood(index)" class="add-image button-float">
      添加专题商品
    </el-button>
  </div>
  <div class="r-image">
    <span @click="removeImage(index)">
      <el-icon>
        <Close />
      </el-icon></span>
  </div>
  </li>
  </draggable>
  <template v-if="list.data">
    <el-button icon="el-icon-plus" @click="addData()" class="add-image button1 button-float">
      添加专题
    </el-button>
  </template>

  <GoodsModal :GoodsVisible="show" :list="selListGoods" @CloseVisible="closeModal" @ConFirm="ConFirm"></GoodsModal>
  </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import { ref, reactive, defineComponent } from "vue";
import GoodsModal from "@/components/Modal/GoodsModal.vue";
import { UploadSingle } from "@/api/imgapi.js";
export default defineComponent({
  name: "SpecialProducts",
  props: {
    data: {
      type: Object,
    },
  },
  components: { draggable: VueDraggableNext, GoodsModal },
  setup(props) {
    const list = ref(props.data || {
      data: [],
      options: {
        priceColor: '#ff0000',
        originalPrice: 0, // 0 不显示 1 显示
        showSubtitle: '1',
        navigation: '1'
      }
    });

    function onOriginalPriceChange(val) {
      list.value.options.originalPrice = val === '是' ? 1 : 0;
    }
    const radioGroup = ref("");
    const radioNavigation = ref("");
    const show = ref(false);
    const selIndex = ref(""); //临时保存需要添加商品的索引

    const listGoods = ref([]);
    const selListGoods = reactive({
      data: [],
    });
    list.value = props.data;
    const originalPriceText = ref(list.value.options.originalPrice === 1 ? '是' : '否');
    //初始化一些数据
    switch (list.value.options.showSubtitle) {
      case "1":
        radioGroup.value = "显示";
        break;
      case "2":
        radioGroup.value = "不显示";
        break;
      default:
        break;
    }
    switch (list.value.options.navigation) {
      case "1":
        radioNavigation.value = "文字导航";
        break;
      case "2":
        radioNavigation.value = "图片导航";
        break;
      default:
        break;
    }

    const addData = () => {
      let activeBoolean = false;
      if (list.value.data.length == 0) {
        activeBoolean = true;
      }
      list.value.data.push({
        active: activeBoolean,
        title: "主标题",
        subtitle: "副标题",
        img: "",
        goodsItem: [],
      });
    };
    const addGood = (index) => {
      selIndex.value = index;
      selListGoods.data = [];
      selListGoods.data = JSON.parse(
        JSON.stringify(list.value.data[index].goodsItem)
      );
      show.value = true;
    };
    const deleteItem = (index, goodsIndex) => {
      list.value.data[index].goodsItem.splice(goodsIndex, 1);
    };

    const changeRadioGroup = (val) => {
      //副标题显示切换
      switch (val) {
        case "不显示":
          list.value.options.showSubtitle = "2";
          break;
        case "显示":
          list.value.options.showSubtitle = "1";
          break;
        default:
          break;
      }
    };
    const changeRadioNavigation = (val) => {
      //副标题显示切换
      switch (val) {
        case "文字导航":
          list.value.options.navigation = "1";
          break;
        case "图片导航":
          list.value.options.navigation = "2";
          break;
        default:
          break;
      }
    };
    const SuccessImg1 = (param) => {
      let fd = new FormData();
      let sel = list.value.options.activeName;
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          list.value.data[sel].img = res.DataMap.HttpsUrl;
        }
      });
    };
    const removeImage = (index) => {
      //删除其中一条数据
      list.value.data.splice(index, 1);
    };
    const ConFirm = (selListData) => {
      let Sel = selIndex.value;
      list.value.data[Sel].goodsItem = selListData;
      show.value = false;
    };
    const CheckTableData = (data) => {
      show.value = false;
      //商品去重添加
      for (let i = 0; i < data.length; i++) {
        let Sel = selIndex.value;
        const row = data[i];
        let isExistence = false; //默认不存在
        for (let j = 0; j < list.value.data[Sel].goodsItem.length; j++) {
          const rowj = list.value.data[Sel].goodsItem[j];
          if (rowj.GoodsId == row.GoodsId) {
            //如果匹配说明存在
            isExistence = true;
            break;
          }
        }
        if (!isExistence) {
          //把值添加进去
          list.value.data[Sel].goodsItem.push({
            GoodsId: row.GoodsId,
            GoodsTitle: row.GoodsTitle,
            GoodsCode: row.GoodsCode,
            ListImg: row.ListImg,
            OrgPrice: (row.OrgPrice / 100).toFixed(2),
            SellPrice: (row.SellPrice / 100).toFixed(2),
            GoodsSubTitle: row.GoodsSubTitle,
          });
        }
      }
    };
    const changeLi = (index) => {
      list.value.data.forEach((row) => {
        row.active = false;
      });
      list.value.data[index].active = true;
      list.value.options.activeName = index;
    };
    const closeModal = (data) => {
      show.value = data;
    };

    return {
      list,
      originalPriceText,
      onOriginalPriceChange,
      addData,
      removeImage,
      addGood,
      CheckTableData,
      show,
      closeModal,
      listGoods,
      changeLi,
      deleteItem,
      radioGroup,
      radioNavigation,
      changeRadioGroup,
      changeRadioNavigation,
      ConFirm,
      selListGoods,
      SuccessImg1,
    };
  },
});
</script>

<style lang="less">
.css-title {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
<style lang="less" scoped>
.el-button:focus,
.el-button:hover {
  color: #fff;
  border-color: rgba(245, 108, 108, 0.5);
  background-color: rgba(245, 108, 108, 0.5);
}

.info-content {
  padding: 12px;
}

.desc {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}

.products-content {
  overflow-y: overlay;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;

  .tit {
    text-align: left;
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
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
    margin-top: 10px;
    padding: 0 10px;

    // overflow: auto;
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
        padding-top: 2px;
        width: 100%;

        p {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          display: flex;

          .text {
            white-space: nowrap;
            text-align: -webkit-auto;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .el-form-item {
          margin-bottom: 8px;
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
          z-index: 999;
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
            background: rgba(0, 0, 0, 0.5);
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

    .goods-list {
      display: flex;
      flex-wrap: wrap;
      overflow-x: hidden;

      margin-top: -10px;
      margin-bottom: 10px;
      padding-top: 10px;

      .goods-item {
        width: 23%;
        position: relative;
        background-color: #fff;
        margin: 4px;
        padding: 2px 11px 2px;

        .item-style {
          width: 100%;
          float: left;
        }

        i {
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s;
          color: red;
        }

        &::before {
          content: "";
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          opacity: 0;
          transition: all 0.3s;
        }

        &:hover {
          cursor: grab;

          &::before,
          i {
            opacity: 1;
          }
        }
      }

      .del-goods {
        position: absolute;
        right: 0;
        top: 0;
        color: #000;
        font-size: 14px;
        cursor: pointer;
        z-index: 9;
      }
    }

    .li-active {
      border: solid 1px #f56c6c;
    }
  }
}
</style>
