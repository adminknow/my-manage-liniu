<template>
  <div class="product-content">
    <div class="top-set">商品</div>
    <div class="css-title">
      <p class="tit">样式设置</p>
      <el-form-item label="图片样式">
        <el-radio-group v-model="cssInfo" @change="cssChange">
          <el-radio-button label="一排一个" value="一排一个" />
          <el-radio-button label="一排两个" value="一排两个" />
          <el-radio-button label="一排三个" value="一排三个" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="价格颜色">
        <el-color-picker v-model="list.options.priceColor" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="显示原价">
        <el-radio-group v-model="originalPriceText" @change="onOriginalPriceChange">
          <el-radio-button label="是" />
          <el-radio-button label="否" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品来源">
        <el-select v-model="list.options.productObject.productType" style="width: 80%" placeholder="请选择商品类型"
          @change="changeProductType">
          <el-option label="指定品牌" value="1"> </el-option>
          <el-option label="指定分类" value="2"> </el-option>
          <el-option label="指定标签" value="4"> </el-option>
          <el-option label="指定商品" value="3"> </el-option>
          <el-option label="指定券商" value="5"> </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div v-if="list.options.productObject.productType == 3" class="css-title">
      <!-- 指定商品 -->
      <p class="tit">商品列表 <span>（可拖动排序）</span></p>
      <el-button class="add-btn button1 button-float" @click="toggleSearchPopup">添加商品</el-button>
      <template v-if="list.data && list.data.length > 0">
        <draggable v-model="list.data" tag="ul" draggable="li" v-if="list.data && list.data.length > 0" class="list">
          <li class="item" v-for="(item, index) in list.data" :key="index">
            <div class="image" style="text-align: center">
              <div style="height: 12px;width:100%"></div>
              <el-tooltip effect="dark" :content="item.GoodsTitle" placement="top" :show-after="300">
                <el-image style="width: 70%" :src="item.ListImg" fit="contain" />
              </el-tooltip>
            </div>
            <div class="info">
              <p class="name">
                {{ item.GoodsCode + "-" + item.GoodsTitle }}
                <el-icon :size="18" @click="deleteItem(index)">
                  <Delete />
                </el-icon>
              </p>
            </div>
          </li>
        </draggable>
        <div class="size" v-if="list.data.length > 0">
          共{{ list.data.length }}个商品
        </div>
      </template>
    </div>

    <div class="css-title" v-if="
      list.options.productObject.productType == 1 ||
      list.options.productObject.productType == 2 ||
      list.options.productObject.productType == 4 ||
      list.options.productObject.productType == 5
    ">
      <p class="tit">内容设置</p>
      <div class="product-type-content" style="">
        <el-form-item label="品牌" v-if="list.options.productObject.productType == 1">
          <el-select @change="changeSel" v-model="list.options.productObject.productBrandId" style="width: 80%"
            placeholder="">
            <el-option v-for="item in brandList" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" v-if="list.options.productObject.productType == 2">
          <el-tree-select default-expand-all v-model="list.options.productObject.productClassId" :data="classList"
            @change="changeSel" :render-after-expand="false" style="width: 240px" />
        </el-form-item>
        <el-form-item label="标签" v-if="list.options.productObject.productType == 4">
          <el-select @change="changeSel" v-model="list.options.productObject.productTagId" style="width: 80%"
            placeholder="">
            <el-option v-for="item in tagList" :key="item.TagId" :label="item.TagName" :value="item.TagId" />
          </el-select>
        </el-form-item>
        <el-form-item label="券商" v-if="list.options.productObject.productType == 5">
          <el-select @change="changeSel" v-model="list.options.productObject.productUnitId" style="width: 80%"
            placeholder="">
            <el-option v-for="item in ticketList" :key="item.UnitId" :label="item.UnitName" :value="item.UnitId" />
          </el-select>
        </el-form-item>
      </div>
    </div>
    <GoodsModal :GoodsVisible="GoodsVisible" :list="list" @CloseVisible="CloseVisible" @ConFirm="ConFirm"></GoodsModal>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { ElMessage } from "element-plus";
import { GetBrandList } from "@/api/common.js";
import { GetUnitList } from "@/api/index.js";
import Cookie from "js-cookie";
import { GetTagListByGroupId } from "@/api/shopApi.js";
import { GetGoodsList, GetGoodsCategoryList } from "@/api/goods.js";
import GoodsModal from "@/components/Modal/GoodsModal.vue";
import Stepper from "@/components/tool/Stepper.vue";
export default defineComponent({
  name: "ProductPage",
  props: {
    data: {
      type: Object,
    },
  },
  components: { draggable: VueDraggableNext, GoodsModal, Stepper },
  setup(props) {
    const loginUser = JSON.parse(Cookie.get("User"));
    const list = ref({});

    //品牌处理
    const brandList = ref([]);
    //标签下拉
    const tagList = ref([]);
    //券商下拉
    const ticketList = ref([]);
    const productList = ref([]);
    const classList = ref([]);
    const selectItem = ref([]);
    const selectProduct = ref("");
    list.value = props.data;

    if (
      list.value.options.productObject &&
      list.value.options.productObject.productType == ""
    ) {
      //第一次进来没值
      list.value.options.productObject.productType = "1";
    }
    const originalPriceText = ref(list.value.options.originalPrice === 1 ? '是' : '否');
    function onOriginalPriceChange(val) {
      list.value.options.originalPrice = val === '是' ? 1 : 0;
    }
    const deleteItem = (index) => {
      //删除单个商品
      list.value.data.splice(index, 1);
    };
    const cssInfo = ref("一排一个");
    const GoodsVisible = ref(false);
    const toggleSearchPopup = (index) => {
      //点击添加商品
      GoodsVisible.value = true;
    };
    const cssChange = (val) => {
      if (val == "一排一个") {
        //最多10个
        list.value.options.cssStyle.GoodsCss = "one";
        cssInfo.value = "一排一个";
      } else if (val == "一排两个") {
        list.value.options.cssStyle.GoodsCss = "two";
        cssInfo.value = "一排两个";
      } else if (val == "一排三个") {
        list.value.options.cssStyle.GoodsCss = "three";
        cssInfo.value = "一排三个";
      }
    };

    const CloseVisible = (booleanData) => {
      //点击添加商品
      GoodsVisible.value = booleanData;
    };
    const ConFirm = (selListData) => {
      list.value.data = selListData;
      GoodsVisible.value = false;
    };
    const changeProductType = (val) => {
      //商品来源切换的时候，需要把所有数据清空掉
      list.value.options.productObject.productClassId = "";
      list.value.options.productObject.productBrandId = "";
      list.value.options.productObject.productTagId = "";
      list.value.options.productObject.productUnitId = "";
      list.value.data = [];
    };

    const GetBrandListApi = async () => {
      let res = await GetBrandList({});
      if (res.Code == 200) {
        brandList.value = res.DataMap;
      }
    };
    const GetTagListByGroupIdApi = async () => {
      let res = await GetTagListByGroupId({
        GroupId: 3,
      });
      if (res.Code == 200) {
        tagList.value = res.DataMap;
      }
    };
    const GetUnitListAPi = async () => {
      let res = await GetUnitList({
        SearchCondition: { unit_type: 2 },
      });
      if (res.Code == 200) {
        ticketList.value = res.DataMap;
      }
    };
    const changeSel = async (val) => {
      //选择完品牌/分类/标签之后立马调用
      if (list.value.data.length > 0) {
        list.value.data = [];
      }
      let SearchData = {
        goods_status: 1,
        from_mall: loginUser.UnitId
      };
      if (loginUser.UnitType == 1) {
        //礼牛网的时候
        SearchData.mall_status = 10;
      }
      if (list.value.options.productObject.productType == 1) {
        //如果你选中的还是和之前一样的那么就返回，否则先清空数据
        //选择品牌
        SearchData.brand_id = val;
      } else if (list.value.options.productObject.productType == 2) {
        //选择分类
        SearchData.goods_category_id = val;
      } else if (list.value.options.productObject.productType == 4) {
        //选择标签
        SearchData.goods_tag_id = val;
      } else if (list.value.options.productObject.productType == 5) {
        //选择券商
        SearchData.create_unit_id = val;
      }
      let res = await GetGoodsList({
        SearchCondition: SearchData,
      });
      if (res.Code == 200) {
        let productData = [];
        res.DataMap.forEach((row) => {
          productData.push({
            GoodsId: row.GoodsId,
            GoodsTitle: row.GoodsTitle,
            GoodsCode: row.GoodsCode,
            ListImg: row.ListImg,
            OrgPrice: (row.OrgPrice / 100).toFixed(2),
            SellPrice: (row.SellPrice / 100).toFixed(2),
            GoodsSubTitle: row.GoodsSubTitle,
          });
        });
        productList.value = productData;
        if (productData.length > 0) {
          productData.forEach((row) => {
            list.value.data.push(row);
          });
        } else {
          ElMessage.info("当前品牌暂无商品信息！");
          //清空数据
          list.value.data = [];
        }
      }
    };
    const GetGoodsListApi = async (val) => {
      let SearchData = {
        goods_status: 1,
        from_mall: loginUser.UnitId
      };
      if (loginUser.UnitType == 1) {
        //礼牛网的时候
        SearchData.mall_status = 10;
      }
      if (list.value.options.productObject.productType == 1) {
        //如果你选中的还是和之前一样的那么就返回，否则先清空数据
        //选择品牌
        SearchData.brand_id = val;
      } else if (list.value.options.productObject.productType == 2) {
        //选择分类
        SearchData.goods_category_id = val;
      } else if (list.value.options.productObject.productType == 4) {
        //选择标签
        SearchData.goods_tag_id = val;
      } else if (list.value.options.productObject.productType == 5) {
        //选择券商
        SearchData.create_unit_id = val;
      }
      let res = await GetGoodsList({
        SearchCondition: SearchData,
      });
      if (res.Code == 200) {
        let productData = [];
        res.DataMap.forEach((row) => {
          productData.push({
            GoodsId: row.GoodsId,
            GoodsTitle: row.GoodsTitle,
            GoodsCode: row.GoodsCode,
            ListImg: row.ListImg,
            OrgPrice: (row.OrgPrice / 100).toFixed(2),
            SellPrice: (row.SellPrice / 100).toFixed(2),
            GoodsSubTitle: row.GoodsSubTitle,
          });
        });
        productList.value = productData;
      }
    };
    const InitData = (GoodsCssValue) => {
      if (GoodsCssValue == "two" || GoodsCssValue == "") {
        cssInfo.value = "一排两个";
      }
      if (GoodsCssValue == "one") {
        cssInfo.value = "一排一个";
      }
      if (GoodsCssValue == "three") {
        cssInfo.value = "一排三个";
      }
      GetBrandListApi();
      GetGoodsCategoryListApi();
      GetTagListByGroupIdApi();
      GetUnitListAPi(); //获取券商下拉信息
      setTimeout(() => {
        //延迟赋值，避免下拉数组没有加载出来
        if (
          list.value.options.productObject &&
          list.value.options.productObject.productType == 1
        ) {
          //品牌
          GetGoodsListApi(list.value.options.productObject.productBrandId);
        } else if (
          list.value.options.productObject &&
          list.value.options.productObject.productType == 2
        ) {
          //分类
          GetGoodsListApi(list.value.options.productObject.productClassId);
        } else if (
          list.value.options.productObject &&
          list.value.options.productObject.productType == 4
        ) {
          //标签
          GetGoodsListApi(list.value.options.productObject.productTagId);
        } else if (
          list.value.options.productObject &&
          list.value.options.productObject.productType == 5
        ) {
          //券商
          GetGoodsListApi(list.value.options.productObject.productUnitId);
        }
      }, 500);
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
        classList.value = dataValue;
      }
    };
    InitData(list.value.options.cssStyle.GoodsCss);
    return {
      list,
      originalPriceText,
      onOriginalPriceChange,
      productList,
      selectItem,
      selectProduct,
      deleteItem,
      toggleSearchPopup,
      cssInfo,
      CloseVisible,
      ConFirm,
      cssChange,
      InitData,
      GoodsVisible,
      brandList,
      changeSel,
      changeProductType,
      classList,
      tagList,
      ticketList,
    };
  },
});
</script>
<style lang="less" scoped>
.info {
  padding: 10px 5px 0;

  .name {
    font-size: 12px;
    margin: 0;
    color: #333;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
<style lang="less">
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

.product-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  overflow-y: overlay;
  display: block;

  .tit {
    text-align: left;
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
  }

  .add-btn {
    width: calc(100% - 30px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 5px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    margin: 0;
    overflow-x: hidden;

    .item {
      // background-color: #ddd;
      width: 32.3%;
      border-radius: 6px;
      margin: 1px;
      position: relative;
      transition: all 0.3s;
      list-style: none;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
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
  }

  .options {
    padding: 15px;
    border-radius: 6px;

    .el-form {
      background: #f7f8f9;
      overflow: hidden;
      padding: 10px 0;

      .el-form-item {
        margin: 0;

        label {
          font-size: 12px;
        }
      }
    }
  }
}

.product-top .el-dialog__body {
  padding-top: 10px !important;
}

.product-type-content {
  background-color: hsla(0, 0%, 94.9%, 0.5);
  border-radius: 4px;
  padding: 10px;

  .tea-input-group {
    display: inline-block;
    vertical-align: middle;

    .tea-inputnum {
      display: inline-block;
      vertical-align: middle;
      user-select: none;
      font-size: 0;
    }
  }
}
</style>
