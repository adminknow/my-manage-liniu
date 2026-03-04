<template>
  <div class="products">
    <template v-if="data.data && data.data.length > 0">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane
          :name="index"
          v-for="(item, index) in data.data"
          :key="index"
        >
          <template #label>
            <div v-if="data.options.navigation == 1">
              <div
                v-if="activeName == index"
                class="tabs-title"
                style="height: 50px"
                :style="{ color: data.options.titleColor }"
              >
                <div class="tabs-title1">{{ item.title }}</div>
                <div class="tabs-title2">{{ item.subtitle }}</div>
              </div>
              <div v-else class="tabs-title" style="height: 50px">
                <div class="tabs-title1">{{ item.title }}</div>
                <div class="tabs-title2">{{ item.subtitle }}</div>
              </div>
            </div>
            <div v-else>
              <div
                class="tabs-title flex-col items-center"
                style="height: 70px; line-height: 35px"
              >
                <el-image
                  style="
                    width: 40px;
                    height: 40px;
                    position: relative;
                    top: 4px;
                  "
                  fit="contain"
                  :src="
                    item.img
                      ? item.img
                      : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1'
                  "
                />
                <div class="tabs-title2">{{ item.title }}</div>
              </div>
            </div>
          </template>
          <div class="product-spec">
            <div
              class="product-item"
              v-for="(goodsItem, index) in item.goodsItem.slice(0, 4)"
              :key="index"
            >
              <div v-if="index < 4">
                <div class="image">
                  <img
                    :src="goodsItem.ListImg"
                    style="width: 100%; height: 120px"
                  />
                </div>
                <div class="info">
                  <p class="name">{{ goodsItem.GoodsTitle }}</p>
                  <p class="sub-name">{{ goodsItem.GoodsSubTitle }}</p>

                  <p class="price">
                    <span :style="{ color: data.options.priceColor }"
                      >￥{{ goodsItem.SellPrice }}</span
                    >
                    <span v-if="goodsItem.OrgPrice"
                      >￥{{ goodsItem.OrgPrice }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-else>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :name="index" v-for="(item, index) in 3" :key="index">
          <template #label>
            <div class="tabs-title">
              <div class="tabs-title1">第{{ index + 1 }}个</div>
              <div class="tabs-title2">第{{ index + 1 }}个</div>
            </div>
          </template>
          <div class="product-spec">
            <div
              class="product-item product-default"
              v-for="index in 2"
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
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
export default defineComponent({
  name: "SpecialProducts",
  props: {
    data: {
      type: Object,
    },
  },
  setup(props) {
    const list = ref({});
    list.value = props.data;
    let activeName = computed(() => {
      if (list.value.data.length > 0) {
        if (list.value.options.activeName) {
          return list.value.options.activeName;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

    return {
      activeName,
      list,
    };
  },
});
</script>

<style lang="less" scoped>
.products {
  padding: 0 12px;
  .tabs-title {
    color: #303133;
    text-align: center;
    .tabs-title1 {
      font-size: 14px;
      height: 18px;
    }
    .tabs-title2 {
      font-size: 10px;
      height: 0;
    }
    .el-image {
      display: block;
    }
  }
  .el-tabs__item {
    height: 40px !important;
  }
}
.product-spec {
  display: flex;
  flex-wrap: wrap;
  padding: 4px 8px;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &.one .product-item {
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
    }
  }
  &.three .product-item {
    width: 33.33%;
    .info .price {
      font-size: 16px;
    }
    &.product-default:nth-of-type(3) {
      display: block;
    }
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
}
</style>
<style lang="less">
.products .el-tabs__item {
  height: auto !important;
}
.products .el-tabs__active-bar {
  background-color: #f56c6c;
}
</style>
