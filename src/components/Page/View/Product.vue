<template>
  <div class="product">
    <template v-if="data.data && data.data.length > 0">
      <div
        :class="data.options.cssStyle.GoodsCss"
        class="product-item"
        v-for="(item, index) in data.data.slice(0, sliceValue)"
        :key="index"
      >
        <div class="image">
          <el-image style="width: 100%" :src="item.ListImg" fit="contain" />
        </div>
        <div class="info">
          <p class="name">{{ item.GoodsTitle }}</p>
          <p class="sub-name">{{ item.GoodsSubTitle }}</p>
          <p class="price">
            <span
              :style="{
                color: data.options.priceColor,
              }"
              >￥{{ item.SellPrice }}</span
            >
            <span v-if="item.OrgPrice">￥{{ item.OrgPrice }}</span>
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        :class="data.options.cssStyle.GoodsCss"
        class="product-item product-default"
        v-for="index in 6"
        :key="index"
      >
        <div class="image">
          <img
            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/paged/default_image.png"
            alt=""
          />
        </div>
        <div class="info">
          <p class="name">商品名称</p>
          <p class="num">12124 已购买 | 99%</p>
          <p class="price">
            <span>￥9.99</span>
            <span>￥9.99</span>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: ["data"],
  computed: {
    sliceValue() {
      if (
        this.data.options.productObject &&
        this.data.options.productObject.productNum > 1
      ) {
        //说明已经输入了数量
        return this.data.options.productObject.productNum > 6
          ? 6
          : this.data.options.productObject.productNum;
      } else {
        if (this.data.options.cssStyle.GoodsCss == "one") {
          return 2;
        }
        if (this.data.options.cssStyle.GoodsCss == "two") {
          return 4;
        }
        if (this.data.options.cssStyle.GoodsCss == "three") {
          return 6;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.product {
  display: flex;
  flex-wrap: wrap;
  padding: 4px 8px;
  overflow: hidden;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }

  .product-item {
    width: 50%;
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
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
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
        overflow: hidden;
      }
      .num {
        font-size: 12px;
        color: #d23000;
        font-weight: 600;
      }
      .price {
        font-weight: 600;
        margin: 12px 0 0;
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
  .three {
    width: 33.33%;
    .info {
      .name {
        -webkit-line-clamp: 1;
      }
      .sub-name {
        -webkit-line-clamp: 1;
      }
      .price {
        font-size: 14px;
      }
    }
    &.product-default:nth-of-type(3) {
      display: block;
    }
  }
  .one {
    width: 100%;
    padding: 10px;
    display: flex;
    border-bottom: 1px dashed #eee;
    .image {
      width: 100px;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 10px;
    }
    .info {
      padding: 0 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .price {
        font-size: 20px;
        margin: 0;
      }
      .num {
        margin: 12px 0 0;
      }
      .name {
        -webkit-line-clamp: 2;
      }
      .sub-name {
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
