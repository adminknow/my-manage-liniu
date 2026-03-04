<template>
  <div class="tag-item" style="padding-top: 6px">
    <template v-if="data.data && data.data.length > 0">
      <div
        v-if="
          data.options.cssStyle.ImgCss == 1 || data.options.cssStyle.ImgCss == 2
        "
      >
        <div
          :style="{
            width: imgWidth,
          }"
          class="nav-item"
          style="display: inline-block; text-align: center"
          v-for="(item, index) in data.data"
          :key="index"
        >
          <el-image
            class="img-style"
            style="width: 60px; height: 60px"
            :src="item.url"
          />
          <div class="slider-title">{{ item.title ? item.title : "标题" }}</div>
        </div>
      </div>
      <div
        v-if="data.options.cssStyle.ImgCss == 3"
        style="white-space: nowrap; overflow: hidden"
      >
        <div
          :style="{
            width: '18.18181818%',
          }"
          class="nav-item"
          style="display: inline-block; text-align: center"
          v-for="(item, ind) in data.data"
          :key="ind"
        >
          <el-image
            class="img-style"
            style="width: 60px; height: 60px"
            :src="
              item.url
                ? item.url
                : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1'
            "
          />
          <div class="slider-title">{{ item.title ? item.title : "标题" }}</div>
        </div>
      </div>
      <div style="width: 100%; height: 6px"></div>
    </template>
    <template v-else>
      <div
        class="nav-item"
        style="display: inline-block; text-align: center; width: 25%"
        v-for="(val, ind) in 4"
        :key="ind"
      >
        <el-image
          class="img-style"
          style="width: 60px; height: 60px"
          src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/web_logo.png?v=1"
        />
        <div class="slider-title">{{ "标题" + (ind + 1) }}</div>
      </div>
      <div style="width: 100%; height: 6px"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "AdImage",
  props: ["data"],
  data() {
    return {};
  },
  computed: {
    imgWidth() {
      if (this.data.options.cssStyle.ShowCss == "4") {
        return "25%";
      }
      if (this.data.options.cssStyle.ShowCss == "5") {
        return "20%";
      }
      if (this.data.options.cssStyle.ShowCss == "8") {
        return "25%";
      }
      if (this.data.options.cssStyle.ShowCss == "10") {
        return "20%";
      }
      if (this.data.options.cssStyle.ShowCss == "6") {
        return "33.33333333%";
      }
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
// .slider-container {
//   position: relative;
//   width: 100%; /* 或者设置一个固定的宽度 */
//   overflow: hidden;
// }

// .slide-wrapper {
//   display: flex; /* 使用flex布局 */
//   width: 100%; /* 假设每张图片占100%的宽度，总宽度设置为300% */
//   transition: transform 0.5s ease; /* 平滑过渡效果 */
// }

// .slide-wrapper .img-style {
//   width: 100%; /* 图片宽度设置为容器的100% */
//   flex-shrink: 0; /* 防止图片被压缩 */
//   margin-left: 6px;
// }
.slider-title {
  width: 100%;
  font-size: 13px;
}
</style>
