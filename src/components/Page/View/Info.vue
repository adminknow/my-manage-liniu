<template>
  <div class="info">
    <!-- header 不可拖拽 -->
    <div class="top-nav" @click="selectType(0)">
      <img
        style="width: 100"
        src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/paged/topNavBlack.png"
      />
      <span class="tit">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Info",
  props: ["data"],
  computed: {
    title() {
      if (this.data.data.length == 0) {
        return "页面标题";
      } else {
        return this.data.data[0].title;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.top-nav {
  width: 100%;
  text-align: center;
}
img {
  max-width: 100%;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
.tit {
  bottom: 10px;
  position: relative;
  transform: translateX(-50%);
}
</style>
