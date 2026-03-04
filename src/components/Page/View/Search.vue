<template>
  <div
    class="outside"
    :style="{
      background: outsideBgColor,
    }"
  >
    <img
      v-if="list?.isLogo"
      :src="list.logoImg"
      style="width: 10%; position: absolute; left: 10px"
    />
    <img
      v-if="list?.customer"
      src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img3-sp_mall/goods_customer_service_page.png"
      style="width: 6%; position: absolute; right: 7px; top: 14px"
    />
    <div
      class="search flex-row items-center"
      :class="cssChange"
      :style="{
        background: innerBgColor,
      }"
    >
      <span class="el-icon-mpsousuo-xianxing el-icon"></span>
      <div class="carousel-title">
        <el-carousel height="20px" direction="vertical" :autoplay="true">
          <el-carousel-item v-for="(item, index) in title" :key="index">
            <div style="width: 100%">{{ item }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: ["data"],
  data() {
    return {
      list: {},
      cssStyle: {},
    };
  },
  computed: {
    title() {
      let item = [];
      if (this.data?.data?.[0]?.titleList) {
        this.data.data[0].titleList.forEach((row) => {
          if (row) {
            item.push(row);
          }
        });
      }
      return item;
    },
    outsideBgColor() {
      return this.data?.options?.cssStyle?.outsideBgColor || "#ffffff";
    },
    cssChange() {
      if (this.data?.data?.[0]?.isLogo && this.data?.data?.[0]?.customer) {
        return "search-logoOrCustomer";
      }
      if (this.data?.data?.[0]?.isLogo) {
        return "search-logo";
      }
      if (this.data?.data?.[0]?.customer) {
        return "search-customer";
      }
      return "";
    },
    list() {
      return this.data?.data?.[0] || {};
    },
    innerBgColor() {
      return this.data?.options?.cssStyle?.innerBgColor || "#e7e7e7";
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.outside {
  width: 100%;
  padding: 8px 0;
  position: relative;
  .search {
    margin: 0 auto;
    width: 90%;
    border: solid 2px #f1f1f1;
    border-radius: 20px;
    height: 30px;
    padding: 2px 0;
    text-align: left;
    font-size: 16px;
    .el-icon {
      position: relative;
      top: 1px;
      left: 10px;
      font-size: 20px;
    }
    .search-title {
      width: 100%;
      padding-left: 20px;
    }
    .carousel-title {
      position: relative;
      left: 16px;
      width: 85%;
    }
  }
  .search-logoOrCustomer {
    width: 74%;
    position: relative;
    left: 9px;
  }
  .search-logo {
    width: 77%;
    position: relative;
    left: 20px;
  }
  .search-customer {
    width: 85%;
    position: relative;
    left: -16px;
  }
}
</style>
