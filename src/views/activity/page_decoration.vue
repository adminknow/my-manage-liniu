<template>
  <div ref="containerDiv" class="container" style="padding: 5px 0px 20px">
    <section class="decoration-edit">
      <section class="l sidebar">
        <ul @dragstart="dragStart" @dragend="dragEnd">
          <li
            v-for="(val, key, index) in typeList"
            draggable="true"
            :data-type="key"
            :key="index + 1"
          >
            <span :class="val.icon"></span>
            <p>{{ val.name }}</p>
          </li>
        </ul>
      </section>
      <section class="c">
        <div
          class="view-content"
          @drop="drog"
          @dragover="dragOver"
          :style="{
            backgroundColor: backgroundPageColor,
          }"
        >
          <draggable v-model="view" draggable=".item1" @start="onStart">
            <template v-for="(item, index) in view" :key="index">
              <div
                :data-index="index"
                class="item"
                :class="{ item1: index > 0 }"
                @click="selectType(index)"
              >
                <!-- waiting -->
                <template v-if="item.status && item.status == 2">
                  <div class="wait">{{ item.type }}</div>
                </template>
                <template v-else>
                  <component
                    v-if="typeList[item.type]['com']"
                    :is="typeList[item.type]['com']"
                    :data="item"
                  ></component>
                </template>
                <el-icon
                  v-if="item.type != 'info'"
                  class="el-icon-error"
                  @click="deleteItem($event, index)"
                  ><CloseBold
                /></el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </section>
      <section class="r sidebar">
        <EditForm :data="props" v-if="isRight"></EditForm>
      </section>

      <div class="submit-btn">
        <el-button
          :loading="BtnLoading"
          class="button1"
          v-if="Type != 'View'"
          @click="submit"
          >提交页面</el-button
        >
        <el-button class="button2" @click="onReturn">返回</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import { SavePage, GetPage } from "@/api/index.js";
import { GetGoodsList } from "@/api/goods.js";
import common from "@/utils/common.js";
import { ElMessage } from "element-plus";
import { VueDraggableNext } from "vue-draggable-next";
import EditForm from "@/components/Page/Edit/index.vue";
import Product from "@/components/Page/View/Product.vue";
import Images from "@/components/Page/View/Images.vue";
import InfoTitle from "@/components/Page/View/Info.vue";
import Banner from "@/components/Page/View/Banner.vue";
import Search from "@/components/Page/View/Search.vue";
import AdImage from "@/components/Page/View/AdImage.vue";
import NewsExpress from "@/components/Page/View/NewsExpress.vue";
import HotImage from "@/components/Page/View/HotImage.vue";
import RanKing from "@/components/Page/View/RanKing.vue";
import SpecialProducts from "@/components/Page/View/SpecialProducts.vue";
export default {
  components: {
    EditForm,
    draggable: VueDraggableNext,
    Product,
    Images,
    Banner,
    Search,
    AdImage,
    HotImage,
    RanKing,
    NewsExpress,
  },
  data() {
    return {
      BtnLoading: false,
      PageId: "",
      typeList: {
        info: {
          name: "页面标题",
          icon: "el-icon-mpshouyelunbotu",
          com: InfoTitle,
        },
        banner: {
          name: "轮播图",
          icon: "el-icon-mpshouyelunbotu",
          com: Banner,
        },
        product: {
          name: "商品",
          icon: "el-icon-mpshangpin-xianxing",
          com: Product,
        },
        images: {
          name: "图片",
          icon: "el-icon-mpicon-",
          com: Images,
        },
        adImage: {
          name: "图文导航",
          icon: "el-icon-mptupianguanggao1",
          com: AdImage,
        },
        specialProducts: {
          name: "专题商品",
          icon: "el-icon-mpzhuantishangpin",
          com: SpecialProducts,
        },
        search: {
          name: "搜索",
          icon: "el-icon-mpsousuo-xianxing",
          com: Search,
        },
        hotImage: {
          name: "热区",
          icon: "el-icon-mphuizhirequ",
          com: HotImage,
        },
        newsExpress: {
          name: "消息快报",
          icon: "el-icon-mpxiaoxikuaibao",
          com: NewsExpress,
        },
        ranKing: {
          name: "商品排行",
          icon: "el-icon-mppaihang",
          com: RanKing,
        },
      },
      view: [],
      type: "",
      index: null, // 当前组件的索引
      isPush: false, // 是否已添加组件

      props: {}, // 传值
      isRight: false,

      className: {
        1: "one",
        2: "two",
        3: "three",
      },
      saveShow: false,
      Page: {
        PageId: "",
        PageCode: "",
        PageName: "",
        PageConfig: "",
      },
      Type: "",
    };
  },
  created() {
    this.Type = this.$route.query.Type ? this.$route.query.Type : "";
    this.PageId = this.$route.query.ID ? this.$route.query.ID : "";
    if (this.PageId != "") {
      this.Page.PageId = this.PageId;
      this.GetPageApi(this.Page.PageId);
    } else {
      this.view.push({
        type: "info",
        data: [],
      });
    }
  },
  mounted() {},
  computed: {
    backgroundPageColor() {
      if (
        this.view.length > 0 &&
        this.view[0].data.length > 0 &&
        this.view[0]["data"][0].backgroundPageColor != ""
      ) {
        return this.view[0]["data"][0].backgroundPageColor;
      }
    },
  },
  methods: {
    async GetPageApi(PageId) {
      let res = await GetPage({
        ObjectId: PageId,
      });
      if (res.Code == 200) {
        this.view = [];
        this.Page.PageCode = res.DataMap.PageCode;
        this.Page.PageName = res.DataMap.PageName;
        this.Page.PageConfig = res.DataMap.PageConfig;
        let PageConfig = JSON.parse(res.DataMap.PageConfig);

        for (let i = 0; i < PageConfig.Modules.length; i++) {
          const row = PageConfig.Modules[i];
          if (row.TemplateType == "info") {
            this.view.push({
              type: "info",
              data: [],
            });
          }
          if (row.TemplateType == "banner") {
            //把轮播图数据整理添加进去
            this.view.push({
              type: "banner",
              data: [],
            });
          }
          if (row.TemplateType == "images") {
            //把轮播图数据整理添加进去
            this.view.push({
              type: "images",
              data: [],
            });
          }
          if (row.TemplateType == "product") {
            //把商品数据整理进去
            this.view.push({
              type: "product",
              data: [],
              options: {
                productObject: {
                  productType: "",
                  productBrandId: "",
                  productClassId: "",
                  productNum: 1,
                },
                cssStyle: {
                  GoodsCss: "",
                },
              },
            });
          }
          if (row.TemplateType == "adImage") {
            this.view.push({
              type: "adImage",
              data: [],
              options: {},
            });
          }
          if (row.TemplateType == "search") {
            this.view.push({
              type: "search",
              data: [],
              options: {
                cssStyle: {
                  outsideBgColor: "#ffffff",
                  innerBgColor: "#e7e7e7",
                },
              },
            });
          }
          if (row.TemplateType == "specialProducts") {
            this.view.push({
              type: "specialProducts",
              data: [],
              options: {
                activeName: "",
                titleColor: "",
                priceColor: "",
                showSubtitle: "1", //是否展示副标题
              },
            });
          }
          if (row.TemplateType == "hotImage") {
            //热区
            this.view.push({
              type: "hotImage",
              data: [],
              options: {
                ImageUrl: "",
              },
            });
          }
          if (row.TemplateType == "newsExpress") {
            this.view.push({
              type: "newsExpress",
              data: [],
            });
          }
          if (row.TemplateType == "ranKing") {
            this.view.push({
              type: "ranKing",
              data: [],
              options: {},
            });
          }
        }
        for (let i = 0; i < PageConfig.Modules.length; i++) {
          const row = PageConfig.Modules[i];
          if (row.TemplateType == "info") {
            if (row.Config.length > 0) {
              this.view[i].data = [
                {
                  type: "info",
                  isShare: row.Config[0].isShare ? row.Config[0].isShare : "0",
                  ShareImgUrl: row.Config[0].ShareImgUrl
                    ? row.Config[0].ShareImgUrl
                    : "",
                  ShareTitle: row.Config[0].ShareTitle
                    ? row.Config[0].ShareTitle
                    : "",
                  title: row.Config[0].title,
                  webTitle: row.Config[0].webTitle,
                  code: row.Config[0].code,
                  backgroundColor: row.Config[0].backgroundColor,
                  backgroundPageColor: row.Config[0].backgroundPageColor,
                  remarks: row.Config[0].remarks,
                  isNavigation: row.Config[0].isNavigation
                    ? row.Config[0].isNavigation
                    : "0",
                },
              ];
            }
          }
          if (row.TemplateType == "search") {
            if (row.Config.length > 0) {
              this.view[i].data = [
                {
                  title: row.Config[0].title ? row.Config[0].title : "",
                },
              ];
              this.view[i].options.cssStyle = {
                outsideBgColor: row.Config[0].outsideBgColor
                  ? row.Config[0].outsideBgColor
                  : "#ffffff",
                innerBgColor: row.Config[0].innerBgColor
                  ? row.Config[0].innerBgColor
                  : "#e7e7e7",
              };
            }
          }
          if (row.TemplateType == "banner") {
            //把轮播图数据整理添加进去
            let bannerData = [];
            for (let j = 0; j < row.Config.length; j++) {
              const rowj = row.Config[j];
              let object = {
                AdGoConfig: {
                  AdJumpType: rowj.GoType,
                  H5Url: rowj.H5,
                  MainColor: rowj.MainColor,
                  WxxcxAppid: rowj.WxxcxAppid,
                  WxxcxPagepath: rowj.WxxcxPagePath,
                  AdJumpTypeDesc: rowj.AdJumpTypeDesc
                    ? rowj.AdJumpTypeDesc
                    : "",
                },
                name: rowj.ImageTitle,
                url: rowj.Image,
              };
              bannerData.push(object);
            }
            this.view[i].data = bannerData;
          }
          if (row.TemplateType == "images") {
            //把轮播图数据整理添加进去
            let imagesData = [];
            for (let j = 0; j < row.Config.length; j++) {
              const rowj = row.Config[j];
              let object = {
                AdGoConfig: {},
                name: rowj.ImageTitle,
                url: rowj.Image,
              };
              imagesData.push(object);
            }
            this.view[i].data = imagesData;
          }
          if (row.TemplateType == "product") {
            //把商品数据整理进去
            this.view[i].options.priceColor = row.Config[0].priceColor;
            if (row.Config[0].productObject) {
              this.view[i].options.productObject = row.Config[0].productObject;
            } else {
              this.view[i].options.productObject = {
                productType: "",
                productBrandId: "",
                productClassId: "",
                productNum: 1,
              };
            }

            this.view[i].options.cssStyle.GoodsCss = row.Config[0].GoodsCss
              ? row.Config[0].GoodsCss
              : "two";
            this.GetGoodsListApi(row.Config[0].GoodsIDs, i);
          }
          if (row.TemplateType == "adImage") {
            //广告图片数据
            let AdData = [];
            for (let j = 0; j < row.Config.length; j++) {
              const rowj = row.Config[j];
              let object = {
                AdGoConfig: {
                  AdJumpType: rowj.GoType,
                  H5Url: rowj.H5,
                  MainColor: "",
                  WxxcxAppid: rowj.WxxcxAppid,
                  WxxcxPagepath: rowj.WxxcxPagePath,
                  AdJumpTypeDesc: rowj.AdJumpTypeDesc
                    ? rowj.AdJumpTypeDesc
                    : "",
                },
                url: rowj.Image,
                title: rowj.Title,
              };
              AdData.push(object);
            }
            this.view[i].data = AdData;
            this.view[i].options.cssStyle = row.cssStyle;
          }
          if (row.TemplateType == "specialProducts") {
            //把专题商品数据整理进去
            for (let j = 0; j < row.Config.length; j++) {
              //专题商品专用
              let res = await GetGoodsList({
                SearchCondition: {
                  goods_ids: row.Config[j].GoodsItem.toString(),
                },
              });
              if (res.Code == 200) {
                let productData = [];
                let active = false;
                if (j == 0) {
                  active = true;
                }
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
                this.view[i].data.push({
                  active: active,
                  subtitle: row.Config[j].subTitle,
                  title: row.Config[j].title,
                  goodsItem: productData,
                });
              }
            }
            this.view[i].options.titleColor = row.titleColor;
            this.view[i].options.priceColor = row.priceColor;
            this.view[i].options.showSubtitle = row.showSubtitle
              ? row.showSubtitle
              : "1";
          }
          if (row.TemplateType == "hotImage") {
            //把热区数据添加进去
            this.view[i].data = row.Config[0].AreaItem;
            this.view[i].options.ImageUrl = row.Config[0].ImageUrl;
          }
          if (row.TemplateType == "newsExpress") {
            //消息快报
            this.view[i].data = [
              {
                title: row.Config[0].title,
                background: row.Config[0].background
                  ? row.Config[0].background
                  : "",
                color: row.Config[0].color ? row.Config[0].color : "",
              },
            ];
          }
          if (row.TemplateType == "ranKing") {
            //商品排行
            this.view[i].options.title = row.Config[0].title;
            this.view[i].options.color = row.Config[0].color;
            this.view[i].options.priceColor = row.Config[0].priceColor;
            this.view[i].options.fontsize = row.Config[0].fontsize;
            this.GetGoodsListApi(row.Config[0].GoodsIDs, i);
          }
        }
      }
    },
    async GetGoodsListApi(goodsIds, index) {
      let res = await GetGoodsList({
        SearchCondition: {
          goods_ids: goodsIds,
        },
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
        this.view[index].data = productData;
      }
    },
    async GetGoodsListApiPro(goodsIds, title, subtitle, JIndex, IIndex) {},
    onStart(e) {},
    async submit() {
      // JSON 转换会丢失 formData
      const formItem = JSON.parse(JSON.stringify(this.view));
      let PageConfigJson = {
        Name: "",
        Modules: [],
      };
      this.Page.PageId = this.PageId;
      formItem.forEach((row) => {
        let PageJson = {
          Id: "",
          TemplateType: "",
          Config: [],
        };
        if (this.Page.PageId == "") {
          PageJson.Id = common.guid();
        }
        PageJson.TemplateType = row.type;
        if (row.type == "info") {
          //如果是标题
          if (row.data.length > 0) {
            //有值才操作
            let infoObjectJson = {
              code: row.data[0].code ? row.data[0].code : "",
              title: row.data[0].title ? row.data[0].title : "",
              webTitle: row.data[0].webTitle ? row.data[0].webTitle : "",
              backgroundColor: row.data[0].backgroundColor
                ? row.data[0].backgroundColor
                : "",
              backgroundPageColor: row.data[0].backgroundPageColor
                ? row.data[0].backgroundPageColor
                : "",

              remarks: row.data[0].remarks ? row.data[0].remarks : "",
              isNavigation: row.data[0].isNavigation
                ? row.data[0].isNavigation
                : "0",

              isShare: row.data[0].isShare ? row.data[0].isShare : "0",
              ShareTitle: row.data[0].ShareTitle ? row.data[0].ShareTitle : "",
              ShareImgUrl: row.data[0].ShareImgUrl
                ? row.data[0].ShareImgUrl
                : "",
            };
            PageConfigJson.Name = row.data[0].title ? row.data[0].title : "";
            this.Page.PageCode = row.data[0].code ? row.data[0].code : "";
            this.Page.PageName = row.data[0].webTitle
              ? row.data[0].webTitle
              : "";
            PageJson.Config.push(infoObjectJson);
          }
        }
        if (row.type == "banner") {
          //如果是轮播图
          row.data.forEach((bannerRow) => {
            let bannerObjectJson = {};
            bannerObjectJson.GoType = bannerRow.AdGoConfig.AdJumpType; //0:不跳转;1:H5;2:小程序
            bannerObjectJson.Image = bannerRow.url;
            bannerObjectJson.ImageTitle = bannerRow.name;
            bannerObjectJson.H5 = bannerRow.AdGoConfig.H5Url;
            bannerObjectJson.WxxcxAppid = bannerRow.AdGoConfig.WxxcxAppid;
            bannerObjectJson.MainColor = bannerRow.AdGoConfig.MainColor;
            bannerObjectJson.AdJumpTypeDesc =
              bannerRow.AdGoConfig.AdJumpTypeDesc;
            bannerObjectJson.WxxcxPagePath = bannerRow.AdGoConfig.WxxcxPagepath;
            PageJson.Config.push(bannerObjectJson);
          });
        }
        if (row.type == "product") {
          //如果是商品
          let GoodsIDs = "";
          row.data.forEach((goodsRow, goodsIndex) => {
            if (goodsIndex == 0) {
              GoodsIDs = goodsRow.GoodsId;
            } else {
              GoodsIDs = GoodsIDs + ";" + goodsRow.GoodsId;
            }
          });
          let ranKingObject = {
            GoodsIDs: GoodsIDs,
            priceColor: row.options.priceColor,
            GoodsCss: row.options.cssStyle.GoodsCss,
            productObject: row.options.productObject,
          };
          PageJson.Config.push(ranKingObject);
        }
        if (row.type == "images") {
          row.data.forEach((imageRow) => {
            let imagesObjectJson = {
              Image: imageRow.url,
              ImageTitle: imageRow.name,
            };
            PageJson.Config.push(imagesObjectJson);
          });
        }
        if (row.type == "adImage") {
          //如果是广告图片
          row.data.forEach((AdRow) => {
            let aDImgObjectJson = {};
            aDImgObjectJson.GoType = AdRow.AdGoConfig.AdJumpType; //0:不跳转;1:H5;2:小程序
            aDImgObjectJson.Image = AdRow.url;
            aDImgObjectJson.Title = AdRow.title;
            aDImgObjectJson.ImageTitle = AdRow.name;
            aDImgObjectJson.H5 = AdRow.AdGoConfig.H5Url;
            aDImgObjectJson.WxxcxAppid = AdRow.AdGoConfig.WxxcxAppid;
            aDImgObjectJson.AdJumpTypeDesc = AdRow.AdGoConfig.AdJumpTypeDesc;
            aDImgObjectJson.WxxcxPagePath = AdRow.AdGoConfig.WxxcxPagepath;
            PageJson.Config.push(aDImgObjectJson);
          });
          PageJson.cssStyle = row.options.cssStyle;
        }
        if (row.type == "specialProducts") {
          //专题商品
          row.data.forEach((goodsRow, goodsIndex) => {
            let ProductsObject = {
              title: "",
              subTitle: "",
              GoodsItem: [],
            };
            ProductsObject.title = goodsRow.title;
            ProductsObject.subTitle = goodsRow.subtitle;
            let GoodsIDs = "";
            goodsRow.goodsItem.forEach((rowItem, indexItem) => {
              if (indexItem == 0) {
                GoodsIDs = rowItem.GoodsId;
              } else {
                GoodsIDs = GoodsIDs + ";" + rowItem.GoodsId;
              }
            });
            ProductsObject.GoodsItem.push(GoodsIDs);
            PageJson.Config.push(ProductsObject);
          });
          PageJson.titleColor = row.options.titleColor;
          PageJson.priceColor = row.options.priceColor;
          PageJson.showSubtitle = row.options.showSubtitle;
        }
        if (row.type == "search") {
          //如果是标题
          let infoObjectJson = {
            title: "",
            outsideBgColor: row.options.cssStyle.outsideBgColor
              ? row.options.cssStyle.outsideBgColor
              : "#ffffff",
            innerBgColor: row.options.cssStyle.innerBgColor
              ? row.options.cssStyle.innerBgColor
              : "#e7e7e7",
          };
          if (row.data.length > 0) {
            //有值才操作
            infoObjectJson.title = row.data[0].title ? row.data[0].title : "";
          }
          PageJson.Config.push(infoObjectJson);
        }
        if (row.type == "hotImage") {
          //如果是热区
          let hotObjectJson = {
            ImageUrl: row.options.ImageUrl,
            AreaItem: row.data,
          };
          PageJson.Config.push(hotObjectJson);
        }
        if (row.type == "newsExpress") {
          //消息快报
          let newsExpressJson = {
            title: row.data[0].title ? row.data[0].title : "",
            color: row.data[0].color ? row.data[0].color : "",
            background: row.data[0].background ? row.data[0].background : "",
          };
          PageJson.Config.push(newsExpressJson);
        }
        if (row.type == "ranKing") {
          //商品排行
          let GoodsIDs = "";
          row.data.forEach((goodsRow, goodsIndex) => {
            if (goodsIndex <= 10) {
              //只允许 添加10个
              if (goodsIndex == 0) {
                GoodsIDs = goodsRow.GoodsId;
              } else {
                GoodsIDs = GoodsIDs + ";" + goodsRow.GoodsId;
              }
            }
          });
          let ranKingObject = {
            GoodsIDs: GoodsIDs,
            title: row.options.title,
            fontsize: row.options.fontsize,
            color: row.options.color,
            priceColor: row.options.priceColor,
          };
          PageJson.Config.push(ranKingObject);
        }
        PageConfigJson.Modules.push(PageJson);
      });
      this.Page.PageConfig = JSON.stringify(PageConfigJson);
      this.BtnLoading = true;
      let res = await SavePage({
        Page: this.Page,
      });
      this.BtnLoading = false;
      if (res.Code == 200) {
        let _this = this;
        common.ClosePageTag("装修详情");
        ElMessage.success("保存成功");
        _this.$store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "页面装修",
        });
        setTimeout(function () {
          _this.$router.push({
            path: "/page_list",
          });
        }, 1000);
      } else {
        ElMessage.error(res.Message);
      }
      // this.saveShow = true;
    },
    // 切换视图组件
    selectType(index) {
      this.isRight = false;
      if (this.view[index].type == "info") {
        if (this.view[index].data.length == 0) {
          this.view[index].data.push({
            title: "页面标题",
            webTitle: "",
            code: "",
            remarks: "",
            backgroundColor: "",
            backgroundPageColor: "",
            isNavigation: "0",
            isShare: "0",
            ShareImgUrl: "",
            ShareTitle: "",
          });
        }
      }
      if (this.view[index].type == "search") {
        if (this.view[index].data.length == 0) {
          this.view[index].data.push({
            title: "搜索特惠、热卖商品",
          });
        }
      }
      if (this.view[index].type == "newsExpress") {
        //消息快报
        if (this.view[index].data.length == 0) {
          this.view[index].data.push({
            title: "请输入消息内容",
            color: "", //文本颜色
            background: "", //内容颜色
          });
        }
      }
      this.props = this.view[index];
      this.$nextTick(() => {
        this.isRight = true;
      });
    },
    deleteItem(e, index) {
      e.preventDefault();
      e.stopPropagation();
      this.view.splice(index, 1);
      this.isRight = false;
      this.props = {};
    },
    // 拖拽类型
    dragStart(e) {
      this.type = e.target.dataset.type;
    },
    // 结束拖拽
    dragEnd(e) {
      if (this.type == "info") {
        return;
      }
      delete this.view[this.index].status;
      this.isPush = false;
      this.type = null;
    },
    // 已放置到指定位置
    drog(e) {
      if (this.type == "info") {
        return;
      }
      if (!this.type) {
        // 内容拖拽
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.dragEnd();
    },
    // 移动中
    dragOver(e) {
      if (!this.type) {
        // 内容拖拽
        return;
      }
      if (this.type == "info") {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      let className = e.target.className;
      let name = className !== "view-content" ? "item" : "view-content";

      const defaultData = {
        type: this.type, // 组件类型
        status: 2, // 默认状态
        data: [], // 数据
        options: {}, // 选项操作
      };
      //开始设置css样式参数
      if (this.type == "adImage") {
        //默认为一排4个
        defaultData.options.cssStyle = {
          ImgCss: 1,
          ShowCss: 4,
        };
      }
      if (this.type == "hotImage") {
        //给一个默认值
        defaultData.options.ImageUrl = "";
      }
      if (this.type == "specialProducts") {
        //专题商品
        //给一个默认值
        defaultData.options.activeName = "";
        defaultData.options.titleColor = "";
        defaultData.options.priceColor = ""; //价格颜色
        defaultData.options.showSubtitle = "1"; //是否显示副标题
      }
      if (this.type == "ranKing") {
        //给一个默认值
        defaultData.options.title = ""; //标题
        defaultData.options.fontsize = "20"; //文字大小
        defaultData.options.color = ""; //文字颜色
        defaultData.options.priceColor = ""; //价格颜色
      }
      if (this.type == "product") {
        //商品
        //给一个默认值
        defaultData.options.priceColor = ""; //价格颜色
        defaultData.options.productObject = {
          productType: "",
          productBrandId: "",
          productClassId: "",
          productNum: 1,
        }; //选择的商品类型
        //默认为一排两个
        defaultData.options.cssStyle = {
          GoodsCss: "two",
        };
      }
      if (this.type == "search") {
        //初始化的时候带上背景颜色
        defaultData.options.cssStyle = {
          outsideBgColor: "#ffffff",
          innerBgColor: "#e7e7e7",
        };
      }
      if (name == "view-content") {
        if (!this.isPush) {
          this.index = this.view.length;
          this.isPush = true;
          this.view.push(defaultData);
        }
      } else if (name == "item") {
        let target = e.target;
        let [y, h, curIndex] = [
          e.offsetY,
          target.offsetHeight,
          target.dataset.index,
        ];
        let direction = y < h / 2;

        if (!this.isPush) {
          // Push to Top or Bottom
          if (direction) {
            if (curIndex == 0) {
              this.view.unshift(defaultData);
            } else {
              this.view.splice(curIndex, 0, defaultData);
            }
          } else {
            curIndex = +curIndex + 1;
            this.view.splice(curIndex, 0, defaultData);
          }
        } else {
          // Moving
          if (direction) {
            var i = curIndex == 0 ? 0 : curIndex - 1;
            var result = this.view[i]["status"] == 2;
          } else {
            var i = +curIndex + 1;
            var result = this.view.length > i && this.view[i]["status"] == 2;
          }

          if (result) return;

          const temp = this.view.splice(this.index, 1);
          this.view.splice(curIndex, 0, temp[0]);
        }
        this.index = curIndex;
        this.isPush = true;
      }
    },
    handleModalAdTop(e, type) {
      e.preventDefault();
      e.stopPropagation();
      const _this = this;
      _this.view[type] = _this.view.splice(type - 1, 1, _this.view[type])[0];
    },
    handleModalAdDown(e, type) {
      e.preventDefault();
      e.stopPropagation();
      const _this = this;
      if (type != _this.view.length - 1) {
        _this.view[type] = _this.view.splice(type + 1, 1, _this.view[type])[0];
      }
    },
    onReturn() {
      common.ClosePageTag("装修详情");
      this.$router.back();
    },
  },
};
</script>

<style lang="less">
.decoration-edit {
  position: relative;
  height: calc(100vh - 200px);
  overflow: hidden; /* 防止内容溢出 */
  background: #f7f8f9;
  .sidebar {
    background: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 200px; /* 固定栏的宽度 */
    overflow-y: auto; /* 如果内容过多则允许垂直滚动 */
  }
  .l {
    left: 0;
    ul {
      margin: 0;
      padding: 0;
      li {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: default;
        list-style: none;
        font-size: 14px;
        color: #666;
        float: left;
        margin: 0 10px;
        border-radius: 6px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          background: #efefef;
        }
        span {
          display: block;
          font-size: 40px;
          margin-bottom: 8px;
          color: #999;
        }
        p {
          display: block;
          margin: 0;
          font-size: 12px;
        }
      }
    }
  }
  .r {
    width: 400px; /* 固定栏的宽度 */
    right: 0;
  }
  .c {
    position: absolute;
    left: 400px; /* 左侧固定栏的宽度 */
    right: 300px; /* 右侧固定栏的宽度 */
    top: 0;
    bottom: 0;
    overflow-y: auto; /* 允许内容垂直滚动 */
    background: #f7f8f9;
    box-sizing: border-box; /* 边框计算在宽度内 */
    padding: 10px; /* 内容区域的内边距 */
    .view-content {
      width: 400px;
      height: 650px;
      background: #f5f5f5;
      overflow-y: auto;
      overflow-x: hidden;
      box-shadow: 0 2px 6px #ccc;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: #dbdbdb;
      }
      &::-webkit-scrollbar-track {
        background: #f6f6f6;
      }

      .item {
        transition: all 0.3s;
        background: #fff;
        &:hover {
          transform: scale(0.95);
          border-radius: 10px;
          box-shadow: 0 0 10px #afafaf;
          .el-icon-error {
            display: block;
          }
        }
        div {
          pointer-events: none;
        }
        .wait {
          background: #deedff;
          height: 35px;
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          color: #666;
        }
        .el-icon-error {
          position: absolute;
          right: -6px;
          top: -6px;
          color: #f56c6c;
          font-size: 25px;
          cursor: pointer;
          display: none;
          z-index: 9999;
        }
      }
    }
    /* 隐藏滚动条 */
    .view-content::-webkit-scrollbar {
      width: 0; /* 隐藏垂直滚动条 */
      height: 0; /* 隐藏水平滚动条 */
    }
  }
  .submit-btn {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.top-set {
  position: relative;
  top: 0;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  border-left: solid 4px #f56c6c;
  border-bottom: solid 1px #ddd;
}
</style>
