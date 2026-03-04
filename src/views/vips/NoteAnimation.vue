<template>
  <div class="container123">
    <img
      :src="item.NoteCover"
      v-for="(item, index) in tableData"
      :key="index"
    />
    <!-- 更多项目 -->
  </div>
</template>
<script setup>
import { SearchNotes, UnpassNote } from "../../api/vip.js";
import { onMounted, ref, nextTick, reactive } from "vue";
const showMask = ref(false);
const loadImg = () => {
  const maxImageHeight = window.innerHeight - 64;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src =
      "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/exchange_11.jpg";
    img.onload = (e) => {
      const realWidth = (maxImageHeight / e.target.height) * e.target.width;
      resolve({
        realWidth,
        realHeight: maxImageHeight,
      });
    };
  });
};
const query = reactive({
  search: {
    note_status: "",
    search_keyword: "",
    vip_name: "",
    vip_cell: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableData = ref([]);
const getData = async () => {
  let res = await SearchNotes({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }
  }
};
getData();
const mediaWidth = ref();
const zoom = ref();
let firstInfo = {},
  lastInfo = {},
  dialogNode = null,
  maskNode = null,
  convertY = 0,
  convertX = 0;
const openDialog = async (e) => {
  // F：记录初始状态的位置，首先为实现该效果，弹窗的初始位置需与卡片重叠，且左侧图片的大小刚好与卡片中的图片大小一致
  firstInfo = e.target.getBoundingClientRect();
  // 点击弹窗，获取当前图片的实际宽高，此处是因为小红书内容弹窗左侧的图片的宽高是动态计算的，所以需要动态获取
  const { realWidth, realHeight } = await loadImg();
  mediaWidth.value = realWidth;
  // 展示弹窗，获取弹窗的最终状态的位置
  showMask.value = true;

  nextTick(() => {
    dialogNode = document.querySelector(".dialog-content");
    maskNode = document.querySelector(".dialog");
    // L：记录弹窗的最终态的位置和大小信息
    lastInfo = dialogNode.getBoundingClientRect();

    // I：计算弹窗初始态和最终态的位移差和缩放的比例，并设置到弹窗上
    // 卡片图片与弹窗图片保持一致，所以缩放比例就是卡片图片的宽度与弹窗图片宽度的比例
    // 然后通过计算位移将弹窗移动到卡片的位置
    zoom.value = firstInfo.width / mediaWidth.value;
    convertX = firstInfo.x - lastInfo.x;
    convertY = firstInfo.y - lastInfo.y;

    // P: 设置弹窗到初始状态
    // 注意这里的一个技巧：将缩放放置到translate的前面，这样计算位移就不需要考虑缩放后产生的位移差了
    dialogNode.style.transform = `translate(calc(-50% + ${convertX}px), calc(-50% + ${convertY}px)) scale(${zoom.value}) `;
    dialogNode.style.transformOrigin = "left top";

    // P：下一帧取消回到初始状态的动画效果，则恢复到最终态
    requestAnimationFrame(() => {
      // 最后一定要再次设置元素的宽度，否则关闭弹窗时的宽度过渡不生效
      dialogNode.style.transition = "transform 0.4s, width 0.4s";
      dialogNode.style.width = lastInfo.width + "px";
      dialogNode.style.transform = "";
      maskNode.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    });
  });
};

const closeDialog = () => {
  // F: 记录初始状态
  const dialogFirstInfo = dialogNode.getBoundingClientRect();
  // L：设置到最终态
  dialogNode.style.left = firstInfo.x + "px";
  dialogNode.style.top = firstInfo.y + "px";
  dialogNode.style.transition = "none";
  dialogNode.style.width = mediaWidth.value + "px";
  dialogNode.style.overflow = "hidden";
  dialogNode.style.transform = `scale(${zoom.value})`;

  nextTick(() => {
    // F: 记录最终态
    const dialogLastInfo = dialogNode.getBoundingClientRect();
    // I: 计算位移
    const convertX = dialogFirstInfo.x - dialogLastInfo.x;
    const convertY = dialogFirstInfo.y - dialogLastInfo.y;
    // P：恢复到初始位置
    dialogNode.style.width = dialogFirstInfo.width + "px";
    dialogNode.style.overflow = "visible";
    dialogNode.style.transform = `translate(${convertX}px, ${convertY}px) scale(1)`;
    // 下一帧过渡到最终状态
    requestAnimationFrame(() => {
      dialogNode.style.transition = "transform 0.4s, width 0.4s";
      dialogNode.style.width = mediaWidth.value + "px";
      dialogNode.style.overflow = "hidden";
      dialogNode.style.transform = `scale(${zoom.value})`;
      maskNode.style.backgroundColor = "transparent";
    });

    dialogNode.addEventListener("transitionend", () => {
      // 动画结束后移除弹窗
      showMask.value = false;
    });
  });
};
</script>

<style lang="less" scoped>
.container123 {
  display: flex;
  flex-direction: column;
  gap: 11px;
  height: 1200px;
  flex-wrap: wrap;
  padding: 10px;
}

img {
  width: 25%; /* 每行三个卡片，减去间距 */
}
</style>
