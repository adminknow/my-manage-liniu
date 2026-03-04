<template>
  <div class="container" style="padding: 5px 0px 20px">
    <section class="decoration-edit">
      <section class="l sidebar">
        <ul @dragstart="dragStart" @dragend="dragEnd">
          <li v-for="(val, key, index) in typeList" draggable="true" :data-type="key" :key="index + 1">
            <span :class="val.icon"></span>
            <p>{{ val.name }}</p>
          </li>
        </ul>
      </section>
      <section class="c">
        <div class="view-content" @drop="drog" @dragover="dragOver" :style="{
          backgroundColor: backgroundPageColor,
        }">
          <draggable v-model="view" draggable=".item1" @start="onStart">
            <template v-for="(item, index) in view" :key="index">
              <div :data-index="index" class="item" :class="{ item1: index > 0 }" @click="selectType(index)">
                <!-- waiting -->
                <template v-if="item.status && item.status == 2">
                  <div class="wait">{{ item.type }}</div>
                </template>
                <template v-else>
                  <component v-if="typeList[item.type]['com']" :is="typeList[item.type]['com']" :data="item">
                  </component>
                </template>
                <el-icon v-if="item.type != 'info'" class="el-icon-error" @click="deleteItem($event, index)">
                  <CloseBold />
                </el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </section>
      <section class="r sidebar">
        <EditForm :data="props" v-if="isRight"></EditForm>
      </section>
      <div class="submit-btn">
        <el-button :loading="BtnLoading" class="button1" v-if="SubmitType != 'View'" @click="submit">提交页面</el-button>
        <el-button class="button2" @click="onReturn">返回</el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { SavePage, GetPage } from "@/api/index.js";
import { GetGoodsList } from "@/api/goods.js";
import common from "@/utils/common.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { VueDraggableNext as Draggable } from "vue-draggable-next";
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
import "@/assets/style/page-decoration.less";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const store = useStore();
const router = useRouter();
const Page = reactive({
  PageCreateUnitId:"",
  PageId: "",
  PageCode: "",
  PageName: "",
  PageConfig: "",
  AccountId: "",
  AccountType: 4,
});
const typeList = reactive({
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
});

const type = ref("");
const SubmitType = ref("");

const PageId = ref("");
const BtnLoading = ref(false);

const props = ref({}); // 传值
const isRight = ref(false);

const index = ref(null); // 当前组件的索引
const view = ref([]);
const isPush = ref(""); // 是否已添加组件

const inIt = () => {
  SubmitType.value = router.currentRoute.value.query.SubmitType;
  if (router.currentRoute.value.query.ID) {
    Page.PageId = router.currentRoute.value.query.ID;
    PageId.value = router.currentRoute.value.query.ID;
    GetPageApi(Page.PageId);
  } else {
    view.value.push({
      type: "info",
      data: [],
    });
  }
};
const GetPageApi = async (PageId) => {
  let res = await GetPage({
    ObjectId: PageId,
  });
  if (res.Code == 200) {
    view.value = [];
    Page.PageCode = res.DataMap.PageCode;
    Page.PageName = res.DataMap.PageName;
    Page.PageConfig = res.DataMap.PageConfig;
    Page.PageCreateUnitId = res.DataMap.CreateUnitId;
    let PageConfig = JSON.parse(res.DataMap.PageConfig);

    // 初始化视图模板
    initializeViewTemplates(PageConfig.Modules);

    // 填充模板数据
    await populateTemplateData(PageConfig.Modules);
    console.log(view.value);
  }
};
// 初始化视图模板
const initializeViewTemplates = (modules) => {
  const templateInitializers = {
    info: () => ({ type: "info", data: [] }),
    banner: () => ({ type: "banner", data: [] }),
    images: () => ({ type: "images", data: [] }),
    product: () => ({
      type: "product",
      data: [],
      options: {
        productObject: {
          productType: "",
          appointType: "",
          productBrandId: "",
          productTagId: "",
          productUnitId: "",
          productClassId: "",
          productNum: 1,
        },
        originalPrice: 0,
        cssStyle: { GoodsCss: "" },
      },
    }),
    adImage: () => ({ type: "adImage", data: [], options: {} }),
    search: () => ({
      type: "search",
      data: [],
      options: {
        cssStyle: {
          outsideBgColor: "#ffffff",
          innerBgColor: "#e7e7e7",
        },
      },
    }),
    specialProducts: () => ({
      type: "specialProducts",
      data: [],
      options: {
        originalPrice: 0,
        activeName: "",
        titleColor: "",
        bgColor: "",
        priceColor: "",
        showSubtitle: "1",
        navigation: "1",
      },
    }),
    hotImage: () => ({ type: "hotImage", data: [], options: { ImageUrl: "" } }),
    newsExpress: () => ({ type: "newsExpress", data: [] }),
    ranKing: () => ({ type: "ranKing", data: [], options: { originalPrice: 0, } }),
  };

  modules.forEach((module) => {
    const initializer = templateInitializers[module.TemplateType];
    if (initializer) {
      view.value.push(initializer());
    }
  });
};
// 填充模板数据
const populateTemplateData = async (modules) => {
  const dataPopulators = {
    info: populateInfoData,
    search: populateSearchData,
    banner: populateBannerData,
    images: populateImagesData,
    product: populateProductData,
    adImage: populateAdImageData,
    specialProducts: populateSpecialProductsData,
    hotImage: populateHotImageData,
    newsExpress: populateNewsExpressData,
    ranKing: populateRankingData,
  };

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const populator = dataPopulators[module.TemplateType];
    if (populator) {
      await populator(module, i);
    }
  }
};

// 各个模板的数据填充函数
const populateInfoData = (module, index) => {
  if (module.Config.length > 0) {
    const config = module.Config[0];
    view.value[index].data = [
      {
        type: "info",
        isShare: config.isShare || "0",
        ShareImgUrl: config.ShareImgUrl || "",
        ShareTitle: config.ShareTitle || "",
        title: config.title,
        webTitle: config.webTitle,
        code: config.code,
        AccountId: config.AccountId || "",
        AccountType: 4,
        backgroundColor: config.backgroundColor,
        backgroundPageColor: config.backgroundPageColor,
        remarks: config.remarks,
        isNavigation: config.isNavigation || "0",
      },
    ];
  }
};

const populateSearchData = (module, index) => {
  if (module.Config.length > 0) {
    const config = module.Config[0];
    view.value[index].data = [
      {
        title: config.title || "",
        isLogo: config.isLogo || "",
        logoImg: config.logoImg || "",
        customer: config.customer || "",
        titleList: config.titleList || ["搜索特惠、热卖商品"],
      },
    ];
    view.value[index].options.cssStyle = {
      outsideBgColor: config.outsideBgColor || "#ffffff",
      innerBgColor: config.innerBgColor || "#e7e7e7",
    };
  }
};

const populateBannerData = (module, index) => {
  const bannerData = module.Config.map((config) => ({
    AdGoConfig: {
      AdJumpType: config.GoType,
      H5Url: config.H5,
      MainColor: config.MainColor,
      WxxcxAppid: config.WxxcxAppid,
      WxxcxPagepath: config.WxxcxPagePath,
      AdJumpTypeDesc: config.AdJumpTypeDesc || "",
    },
    name: config.ImageTitle,
    url: config.Image,
  }));
  view.value[index].data = bannerData;
};

const populateImagesData = (module, index) => {
  const imagesData = module.Config.map((config) => ({
    AdGoConfig: {},
    name: config.ImageTitle,
    url: config.Image,
  }));
  view.value[index].data = imagesData;
};

const populateProductData = (module, index) => {
  const config = module.Config[0];
  view.value[index].options.priceColor = config.priceColor;
  view.value[index].options.originalPrice = config.originalPrice ? config.originalPrice : 0;

  view.value[index].options.productObject = config.productObject || {
    productType: "",
    appointType: "",
    productBrandId: "",
    productTagId: "",
    productUnitId: "",
    productClassId: "",
    productNum: 1,
  };
  view.value[index].options.cssStyle.GoodsCss = config.GoodsCss || "two";
  if (config.GoodsIDs) {
    GetGoodsListApi(config.GoodsIDs, index);
  }
};

const populateAdImageData = (module, index) => {
  const AdData = module.Config.map((config) => ({
    AdGoConfig: {
      AdJumpType: config.GoType,
      H5Url: config.H5,
      MainColor: "",
      WxxcxAppid: config.WxxcxAppid,
      WxxcxPagepath: config.WxxcxPagePath,
      AdJumpTypeDesc: config.AdJumpTypeDesc || "",
    },
    url: config.Image,
    title: config.Title,
  }));
  view.value[index].data = AdData;
  view.value[index].options.cssStyle = module.cssStyle;
};

const populateSpecialProductsData = async (module, index) => {
  for (let j = 0; j < module.Config.length; j++) {
    const config = module.Config[j];
    if (config.GoodsItem.toString()) {
      const res = await GetGoodsList({
        SearchCondition: { goods_ids: config.GoodsItem.toString(), from_mall: Page.PageCreateUnitId },
      });
      if (res.Code == 200) {
        const productData = res.DataMap.map((item) => ({
          GoodsId: item.GoodsId,
          GoodsTitle: item.GoodsTitle,
          GoodsCode: item.GoodsCode,
          ListImg: item.ListImg,
          OrgPrice: (item.OrgPrice / 100).toFixed(2),
          SellPrice: (item.SellPrice / 100).toFixed(2),
          GoodsSubTitle: item.GoodsSubTitle,
        }));
        view.value[index].data.push({
          active: j === 0,
          subtitle: config.subTitle,
          title: config.title,
          img: config.img,
          originalPrice: config.originalPrice ? config.originalPrice : 0,
          goodsItem: productData,
        });
      }
    } else {
      view.value[index].data.push({
        active: false,
        subtitle: config.subTitle,
        title: config.title,
        img: config.img,
        originalPrice: config.originalPrice ? config.originalPrice : 0,
        goodsItem: [],
      });
    }
  }

  // 设置选项
  Object.assign(view.value[index].options, {
    titleColor: module.titleColor,
    bgColor: module.bgColor || "",
    priceColor: module.priceColor,
    showSubtitle: module.showSubtitle || "1",
    navigation: module.navigation || "1",
    originalPrice: module.originalPrice || 0,
  });
};

const populateHotImageData = (module, index) => {
  const config = module.Config[0];
  view.value[index].data = config.AreaItem;
  view.value[index].options.ImageUrl = config.ImageUrl;
};

const populateNewsExpressData = (module, index) => {
  const config = module.Config[0];
  view.value[index].data = [
    {
      title: config.title,
      background: config.background || "",
      color: config.color || "",
    },
  ];
};

const populateRankingData = (module, index) => {
  const config = module.Config[0];
  Object.assign(view.value[index].options, {
    title: config.title,
    color: config.color,
    priceColor: config.priceColor,
    fontsize: config.fontsize,
    originalPrice: config.originalPrice,//新增原价显示
  });

  if (config.GoodsIDs) {
    GetGoodsListApi(config.GoodsIDs, index);
  }
};
const GetGoodsListApi = async (goodsIds, index) => {
  let res = await GetGoodsList({
    SearchCondition: {
      goods_ids: goodsIds,
      from_mall: Page.PageCreateUnitId,
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
    view.value[index].data = productData;
  }
};
const submit = async () => {
  try {
    // 1. 数据预处理
    const formItem = JSON.parse(JSON.stringify(view.value));
    const pageConfigJson = {
      Name: "",
      Modules: [],
    };

    // 2. 设置页面ID
    Page.PageId = PageId.value;

    // 3. 构建配置数据
    const { modules, errorMessage } = await buildPageModules(
      formItem,
      pageConfigJson
    );

    // 4. 错误检查
    if (errorMessage) {
      ElMessage.error(errorMessage);
      return;
    }

    // 5. 设置页面配置
    pageConfigJson.Modules = modules;
    Page.PageConfig = JSON.stringify(pageConfigJson);
    // 6. 保存页面
    await savePage();
  } catch (error) {
    BtnLoading.value = false;
  }
};

// 构建页面模块配置
const buildPageModules = async (formItem, pageConfigJson) => {
  let errorMessage = "";
  const modules = [];

  // 模块处理器映射
  const moduleProcessors = {
    info: (row) => processInfoModule(row, pageConfigJson),
    banner: processBannerModule,
    product: processProductModule,
    images: processImagesModule,
    adImage: processAdImageModule,
    specialProducts: processSpecialProductsModule,
    search: processSearchModule,
    hotImage: processHotImageModule,
    newsExpress: processNewsExpressModule,
    ranKing: processRanKingModule,
  };

  for (const row of formItem) {
    const processor = moduleProcessors[row.type];
    if (!processor) {
      console.warn(`未知的模块类型: ${row.type}`);
      continue;
    }

    const result = processor(row);
    if (result.error) {
      errorMessage = result.error;
      break;
    }

    modules.push(result.module);
  }

  return { modules, errorMessage };
};

// 各模块处理函数
const processInfoModule = (row, pageConfigJson) => {
  const module = createBaseModule(row.type);


  if (row.data.length > 0) {
    const data = row.data[0];
    const infoConfig = {
      code: data.code || "",
      title: data.title || "",
      webTitle: data.webTitle || "",
      AccountId: data.AccountId || "",
      backgroundColor: data.backgroundColor || "",
      backgroundPageColor: data.backgroundPageColor || "",
      remarks: data.remarks || "",
      isNavigation: data.isNavigation || "0",
      isShare: data.isShare || "0",
      ShareTitle: data.ShareTitle || "",
      ShareImgUrl: data.ShareImgUrl || "",
    };

    // 设置全局页面信息
    pageConfigJson.Name = data.title || "";
    Page.PageCode = data.code || "";
    Page.AccountId = data.AccountId || "";
    Page.PageName = data.webTitle || "";

    module.Config.push(infoConfig);
  }

  return { module };
};

const processBannerModule = (row) => {
  const module = createBaseModule(row.type);

  row.data.forEach((bannerRow) => {
    const bannerConfig = {
      GoType: bannerRow.AdGoConfig.AdJumpType,
      Image: bannerRow.url,
      ImageTitle: bannerRow.name,
      H5: bannerRow.AdGoConfig.H5Url,
      WxxcxAppid: bannerRow.AdGoConfig.WxxcxAppid,
      MainColor: bannerRow.AdGoConfig.MainColor,
      AdJumpTypeDesc: bannerRow.AdGoConfig.AdJumpTypeDesc,
      WxxcxPagePath: bannerRow.AdGoConfig.WxxcxPagepath,
    };
    module.Config.push(bannerConfig);
  });

  return { module };
};

const processProductModule = (row) => {
  const module = createBaseModule(row.type);
  if (row.data.length === 0) {
    return { error: "请先选择商品" };
  }

  const goodsIds = row.data.map((item) => item.GoodsId).join(";");
  const productConfig = {
    GoodsIDs: goodsIds,
    priceColor: row.options.priceColor,
    GoodsCss: row.options.cssStyle.GoodsCss,
    productObject: row.options.productObject,
    originalPrice: row.options.originalPrice,
  };

  module.Config.push(productConfig);
  return { module };
};

const processImagesModule = (row) => {
  const module = createBaseModule(row.type);

  row.data.forEach((imageRow) => {
    const imageConfig = {
      Image: imageRow.url,
      ImageTitle: imageRow.name,
    };
    module.Config.push(imageConfig);
  });

  return { module };
};

const processAdImageModule = (row) => {
  const module = createBaseModule(row.type);

  row.data.forEach((adRow) => {
    const adConfig = {
      GoType: adRow.AdGoConfig.AdJumpType,
      Image: adRow.url,
      Title: adRow.title,
      ImageTitle: adRow.name,
      H5: adRow.AdGoConfig.H5Url,
      WxxcxAppid: adRow.AdGoConfig.WxxcxAppid,
      AdJumpTypeDesc: adRow.AdGoConfig.AdJumpTypeDesc,
      WxxcxPagePath: adRow.AdGoConfig.WxxcxPagepath,
    };
    module.Config.push(adConfig);
  });

  module.cssStyle = row.options.cssStyle;
  return { module };
};

const processSpecialProductsModule = (row) => {
  const module = createBaseModule(row.type);

  row.data.forEach((goodsRow) => {
    const goodsIds = goodsRow.goodsItem.map((item) => item.GoodsId).join(";");
    const productConfig = {
      title: goodsRow.title,
      img: goodsRow.img,
      subTitle: goodsRow.subtitle,
      originalPrice: row.options.originalPrice,
      GoodsItem: [goodsIds],
    };
    module.Config.push(productConfig);
  });

  // 设置模块选项
  Object.assign(module, {
    titleColor: row.options.titleColor,
    bgColor: row.options.bgColor || "",
    priceColor: row.options.priceColor,
    showSubtitle: row.options.showSubtitle,
    navigation: row.options.navigation,
    originalPrice: row.options.originalPrice,
  });

  return { module };
};

const processSearchModule = (row) => {
  const module = createBaseModule(row.type);

  const searchConfig = {
    title: "",
    outsideBgColor: row.options.cssStyle.outsideBgColor || "#ffffff",
    innerBgColor: row.options.cssStyle.innerBgColor || "#e7e7e7",
  };

  if (row.data.length > 0) {
    const data = row.data[0];
    Object.assign(searchConfig, {
      isLogo: data.isLogo || "",
      logoImg: data.logoImg || "",
      customer: data.customer || "",
      title: data.title || "",
      titleList: data.titleList.filter(Boolean), // 过滤空值
    });
  }

  module.Config.push(searchConfig);
  return { module };
};

const processHotImageModule = (row) => {
  const module = createBaseModule(row.type);

  const hotConfig = {
    ImageUrl: row.options.ImageUrl,
    AreaItem: row.data,
  };

  module.Config.push(hotConfig);
  return { module };
};

const processNewsExpressModule = (row) => {
  const module = createBaseModule(row.type);

  const newsConfig = {
    title: row.data[0]?.title || "",
    color: row.data[0]?.color || "",
    background: row.data[0]?.background || "",
  };

  module.Config.push(newsConfig);
  return { module };
};

const processRanKingModule = (row) => {
  const module = createBaseModule(row.type);

  if (row.data.length === 0) {
    return { error: "商品排行请添加商品" };
  }

  const goodsIds = row.data
    .slice(0, 10) // 限制最多10个商品
    .map((item) => item.GoodsId)
    .join(";");

  const rankingConfig = {
    GoodsIDs: goodsIds,
    title: row.options.title,
    fontsize: row.options.fontsize,
    color: row.options.color,
    priceColor: row.options.priceColor,
    originalPrice: row.options.originalPrice,
  };

  module.Config.push(rankingConfig);
  return { module };
};

// 创建基础模块结构
const createBaseModule = (type) => {
  return {
    Id: Page.PageId ? "" : common.guid(),
    TemplateType: type,
    Config: [],
  };
};

// 保存页面
const savePage = async () => {
  BtnLoading.value = true;

  try {
    if (Page.PageName == "") {
      ElMessage.error("请先输入页面名称");
      BtnLoading.value = false;
      return;
    }
    const res = await SavePage({ Page });

    if (res.Code === 200) {
      common.ClosePageTag("装修详情");
      ElMessage.success("保存成功");
      store.commit("tags/setPageSaerch", {
        Search: 1,
        titlePage: "页面装修",
      });

      setTimeout(() => {
        router.push({ path: "/page_list" });
      }, 1500);
    } else {
      ElMessage.error(res.Message);
    }
  } finally {
    BtnLoading.value = false;
  }
};
const onReturn = () => {
  common.ClosePageTag("装修详情");
  router.back();
};
const backgroundPageColor = computed(() => {
  if (
    view.value.length > 0 &&
    view.value[0].data.length > 0 &&
    view.value[0]["data"][0].backgroundPageColor != ""
  ) {
    return view.value[0]["data"][0].backgroundPageColor;
  }
});
// 拖拽类型
const dragStart = (e) => {
  type.value = e.target.dataset.type;
};
// 结束拖拽
const dragEnd = (e) => {
  if (type.value == "info") {
    return;
  }
  delete view.value[index.value].status;
  isPush.value = false;
  type.value = null;
};

// 已放置到指定位置
const drog = (e) => {
  if (type.value == "info") {
    return;
  }
  if (!type.value) {
    // 内容拖拽
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  dragEnd();
};
// 移动中
const dragOver = (e) => {
  if (!type.value) {
    // 内容拖拽
    return;
  }
  if (type.value == "info") {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  let className = e.target.className;
  let name = className !== "view-content" ? "item" : "view-content";

  const defaultData = {
    type: type.value, // 组件类型
    status: 2, // 默认状态
    data: [], // 数据
    options: {}, // 选项操作
  };
  //开始设置css样式参数
  if (type.value == "adImage") {
    //默认为一排4个
    defaultData.options.cssStyle = {
      ImgCss: 1,
      ShowCss: 4,
    };
  }
  if (type.value == "hotImage") {
    //给一个默认值
    defaultData.options.ImageUrl = "";
  }
  if (type.value == "specialProducts") {
    //专题商品
    //给一个默认值
    defaultData.options.activeName = "";
    defaultData.options.titleColor = "";
    defaultData.options.bgColor = "";
    defaultData.options.priceColor = ""; //价格颜色
    defaultData.options.showSubtitle = "1"; //是否显示副标题
    defaultData.options.navigation = "1"; //默认文字导航
    defaultData.options.originalPrice = 0; //默认不显示原价
  }
  if (type.value == "ranKing") {
    //给一个默认值
    defaultData.options.title = ""; //标题
    defaultData.options.fontsize = "20"; //文字大小
    defaultData.options.color = ""; //文字颜色
    defaultData.options.priceColor = ""; //价格颜色
    defaultData.options.originalPrice = 0; //默认不显示原价
  }
  if (type.value == "product") {
    //商品
    //给一个默认值
    defaultData.options.priceColor = ""; //价格颜色
    defaultData.options.originalPrice = 0; //默认不显示原价
    defaultData.options.productObject = {
      productType: "",
      appointType: "", //指定类型
      productBrandId: "",
      productTagId: "", //标签ID
      productUnitId: "", //券商ID
      productClassId: "",
      productNum: 1,
    }; //选择的商品类型
    //默认为一排两个
    defaultData.options.cssStyle = {
      GoodsCss: "two",
    };
  }
  if (type.value == "search") {
    //移动完第一次的时候初始化数据
    defaultData.data.push({
      title: "搜索特惠、热卖商品",
      titleList: ["搜索特惠、热卖商品"],
      isLogo: "", //是否需要logo
      logoImg: "", //logo图片
      customer: "", //客服
    });
    //初始化的时候带上背景颜色
    defaultData.options.cssStyle = {
      outsideBgColor: "#ffffff",
      innerBgColor: "#e7e7e7",
    };
  }
  if (name == "view-content") {
    if (!isPush.value) {
      index.value = view.value.length;
      isPush.value = true;
      view.value.push(defaultData);
    }
  } else if (name == "item") {
    let target = e.target;
    let [y, h, curIndex] = [
      e.offsetY,
      target.offsetHeight,
      target.dataset.index,
    ];
    let direction = y < h / 2;

    if (!isPush.value) {
      // Push to Top or Bottom
      if (direction) {
        if (curIndex == 0) {
          view.value.unshift(defaultData);
        } else {
          view.value.splice(curIndex, 0, defaultData);
        }
      } else {
        curIndex = +curIndex + 1;
        view.value.splice(curIndex, 0, defaultData);
      }
    } else {
      // Moving
      if (direction) {
        var i = curIndex == 0 ? 0 : curIndex - 1;
        var result = view.value[i]["status"] == 2;
      } else {
        var i = +curIndex + 1;
        var result = view.value.length > i && view.value[i]["status"] == 2;
      }

      if (result) return;

      const temp = view.value.splice(index.value, 1);
      view.value.splice(curIndex, 0, temp[0]);
    }
    index.value = curIndex;
    isPush.value = true;
  }
};
const onStart = (e) => { };
const selectType = (index) => {
  isRight.value = false;
  if (view.value[index].type == "info") {
    if (view.value[index].data.length == 0) {
      view.value[index].data.push({
        title: "页面标题",
        webTitle: "",
        code: "",
        AccountId: "",
        AccountType: 4,
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
  if (view.value[index].type == "newsExpress") {
    //消息快报
    if (view.value[index].data.length == 0) {
      view.value[index].data.push({
        title: "请输入消息内容",
        color: "", //文本颜色
        background: "", //内容颜色
      });
    }
  }
  props.value = view.value[index];
  nextTick(() => {
    isRight.value = true;
  });
};
const deleteItem = (e, index) => {
  e.preventDefault();
  e.stopPropagation();
  view.value.splice(index, 1);
  isRight.value = false;
  props.value = {};
};
inIt();
</script>