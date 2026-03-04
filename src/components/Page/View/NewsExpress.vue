<template>
  <div class="notice-wrapper" :style="{ background: background }">
    <div
      class="notice-content"
      :style="{ animationDuration: 40 + 's', color: color }"
    >
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsExpress",
  props: ["data"],
  data() {
    return {};
  },
  computed: {
    title() {
      if (this.data.data.length == 0) {
        return "请输入消息内容";
      } else {
        return this.data.data[0].title;
      }
    },
    background() {
      if (this.data.data.length == 0) {
        return "#fffbe8";
      } else {
        return this.data.data[0].background;
      }
    },
    color() {
      if (this.data.data.length == 0) {
        return "#e65770;";
      } else {
        return this.data.data[0].color;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.notice-wrapper {
  background-color: #fffbe8;
  width: 100%;
}

.notice-content {
  color: #e65770;
  padding: 10px 20px;
  font-size: 14px;
  pointer-events: auto;
  animation: scroll-notice 40s linear infinite;
}

@keyframes scroll-notice {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

// .notic-bar {
//   display: flex;
//   background: #fffbe8;
//   margin: 5px;
//   border-radius: 5px;
//   padding: 2px 5px;
// }
// .notice-bar-container {
//   display: flex;
//   width: calc(100% - 30px);
//   height: 20px;
//   overflow: hidden;
//   margin-left: 5px;
// }
// .notice-img {
//   width: 20px;
//   height: 20px;
// }
// .notice-bar__wrap {
//   margin-left: 10px;
//   display: flex;
//   animation: move 20s linear infinite;
//   line-height: 20px;
//   color: #e65770;
//   .notice-bar__wrap_text {
//     width: max-content;
//     min-width: 100px;
//   }
// }
// @keyframes move {
//   0% {
//     transform: translateX(200%);
//   }
//   100% {
//     transform: translateX(-100%);
//   }
// }
</style>
