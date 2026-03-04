<template>
  <section>
    <component
      v-if="type && list[type]['com']"
      :is="type && list[type]['com']"
      :data="data"
    ></component>
  </section>
</template>

<script>
import Info from "@/components/Page/Edit/Info.vue";
import Search from "@/components/Page/Edit/Search.vue";
import Images from "@/components/Page/Edit/Image.vue";
import Product from "@/components/Page/Edit/Product.vue";
import AdImage from "@/components/Page/Edit/AdImage.vue";
import HotImage from "@/components/Page/Edit/HotImage.vue";
import NewsExpress from "@/components/Page/Edit/NewsExpress.vue";
import SpecialProducts from "@/components/Page/Edit/SpecialProducts.vue";
import RanKing from "@/components/Page/Edit/RanKing.vue";
export default {
  name: "EditForm",
  components: {
    Info,
    Images,
    Product,
    AdImage,
    HotImage,
    NewsExpress,
    SpecialProducts,
    RanKing,
    Search,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      type: "",
      list: {
        info: {
          tit: "页面信息",
          com: "Info",
        },
        product: {
          tit: "商品",
          com: "Product",
        },

        images: {
          tit: "图片",
          com: "Images",
        },
        banner: {
          tit: "轮播图",
          com: "Images",
        },
        search: {
          tit: "搜索",
          com: "Search",
        },
        adImage: {
          tit: "图片广告",
          com: "AdImage",
        },
        specialProducts: {
          tit: "专题商品",
          com: "SpecialProducts",
        },
        hotImage: {
          tit: "图片热区",
          com: "hotImage",
        },
        newsExpress: {
          tit: "消息快报",
          com: "NewsExpress",
        },
        ranKing: {
          tit: "商品排行",
          com: "RanKing",
        },
      },
    };
  },
  mounted() {
    this.type = this.data.type;
  },
  methods: {},
};
</script>
<style scoped lang="less">
section {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
.tab-content {
  padding: 0 15px;
  h2 {
    font-size: 16px;
    color: #333;
  }
  .tab {
    display: flex;
    justify-content: space-around;
    border: 1px solid #ddd;
    border-radius: 6px;
    span {
      width: 33.33%;
      text-align: center;
      font-size: 14px;
      color: #666;
      display: block;
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      &.active {
        color: #fff;
        background: #409eff;
        border-radius: 2px;
      }
      &:nth-of-type(2) {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
      }
    }
  }
}
</style>
