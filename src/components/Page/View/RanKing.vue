<template>
  <div class="tag-item">
    <template v-if="data.data && data.data.length > 0">
      <div style="width: 100%; height: 20px"></div>
      <div
        class="ranking-title"
        :style="{
          color: data.options.color,
          fontSize: data.options.fontsize + 'px',
        }"
      >
        {{ data.options.title }}
      </div>
      <div style="width: 100%; height: 12px"></div>
      <div style="white-space: nowrap; overflow: hidden">
        <div
          :style="{
            width: '28%',
          }"
          class="nav-item"
          style="display: inline-block"
          v-for="(item, ind) in data.data"
          :key="ind"
        >
          <div class="product-item">
            <div class="image">
              <img :src="item.ListImg" style="width: 100%" />
            </div>
            <div class="info">
              <p class="name line_ellipsis">{{ item.GoodsTitle }}</p>
              <p class="price">
                <span
                  :style="{
                    color: data.options.priceColor,
                  }"
                  >￥{{ item.SellPrice }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 6px"></div>
    </template>
    <template v-else>
      <div style="width: 100%; height: 20px"></div>
      <div class="ranking-title">
        {{ data.options.title ? data.options.title : "标题" }}
      </div>
      <div style="width: 100%; height: 12px"></div>
      <div style="white-space: nowrap; overflow: hidden">
        <div
          :style="{
            width: '28%',
          }"
          class="nav-item"
          style="display: inline-block"
          v-for="(val, ind) in 10"
          :key="ind"
        >
          <div class="product-item">
            <div class="image">
              <img
                src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/paged/default_image.png"
                alt=""
              />
            </div>
            <div class="info">
              <p class="name line_ellipsi">商品名称</p>
              <p class="price">
                <span>￥9.99</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="width: 100%; height: 6px"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "RanKing",
  props: ["data"],
  data() {
    return {};
  },
  computed: {
    Color() {
      return this.data.options.Color;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
.tag-item .nav-item:nth-child(-n + 5) {
  margin-bottom: 12px;
}

.slider-title {
  width: 100%;
  font-size: 13px;
}
.ranking-title {
  font-size: 20px;
  font-weight: 600;
  padding-left: 10px;
}
.product-item {
  width: 80%;
  padding: 5px;
  &.product-default:nth-of-type(3) {
    display: none;
  }
  .image {
    font-size: 0;
    img {
      max-width: 100%;
    }
  }
  .info {
    padding: 10px 5px 0;
    .name {
      font-size: 14px;
      margin: 0;
      color: #333;
    }
    .sub-name {
      font-size: 12px;
      margin: 0;
      color: #333;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .num {
      font-size: 12px;
      color: #d23000;
      font-weight: 600;
    }
    .price {
      font-weight: 600;
      font-size: 18px;
      span:nth-of-type(1) {
        color: red;
      }
      span:nth-of-type(2) {
        color: #b5b5b5;
        font-weight: 400;
        font-size: 12px;
        margin-left: 4px;
        text-decoration: line-through;
      }
    }
  }
}
</style>
