<template>
  <div class="container mover">
    <!-- animation 拖拽的过渡动画的时间 -->
    <!-- onStart 开始拖拽的事件 -->
    <!-- onEnd 拖拽结束的事件 -->
    <!-- ghost-class 当前正在被拖拽的元素 的样式的类名  -->
    <!-- sort 是否可以进行拖拽，false 不可以进行拖拽,  默认为true -->
    <!-- delay 鼠标按下去 多少秒之后才可以进行拖拽 -->
    <!-- handle 表示 当鼠标落在handle指定的元素上面时才允许拖动，下面的例子中 只有鼠标放到 + 的div 才能拖拽 -->
    <!-- filter 表示鼠标落在filter指定的元素上面 不允许拖动，和 handle正好相反 -->
    <!-- draggable 表示样式为item的元素才能被拖动 -->
    # 4. 然后就可以使用了（其实和原来的写法一模一样！！！）
    <draggable
      draggable=".item"
      v-model="fileDetailImgList"
      @start="onStart"
      @end="onEnd"
    >
      <transition-group>
        <div
          class="item"
          v-for="element in fileDetailImgList"
          :key="element.id"
        >
          {{ element.name }}
        </div>
      </transition-group>
      <el-button @click="checkt">确认</el-button>
    </draggable>
  </div>
</template>
<script setup>
import { VueDraggableNext as draggable } from "vue-draggable-next";
import { ref, reactive, computed, nextTick } from "vue";
const fileDetailImgList = ref([
  {
    name: "1",
    id: 1,
  },
]); //用于保存商品详情
// 查询操作
const checkt = () => {
  fileDetailImgList.value.push({
    name: "2",
    id: 2,
  });
};
const onStart = () => {};
const onEnd = () => {};
</script>
<!-- <script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
export default defineComponent({
  name: "HomeIndex",
  components: { draggable: VueDraggableNext },
  setup() {
    const fileDetailImgList = ref([
      {
        name: "1",
        id: 1,
      },

    ]); //用于保存商品详情
    const state = reactive({
      list: [
        {
          name: "1",
          id: 1,
        },
        {
          name: "1",
          id: 2,
        },
        {
          name: "3",
          id: 3,
        },
        {
          name: "4",
          id: 4,
        },
        {
          name: "5",
          id: 5,
          disabled: false,
        },
      ],
    });
    const onStart = () => {
    };
    const onEnd = () => {
    };
    const checkt = () => {
    };

    return {
      checkt,
      ...toRefs(state),
      onStart,
      fileDetailImgList,
      onEnd,
    };
  },
});
</script> -->
<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: salmon;
  .item {
    width: 80%;
    height: 5vh;
    background: skyblue;
    border: 2px solid red;
    margin: 20px;
    display: flex;
    justify-content: space-between;
    .mover {
      width: 50px;
      height: 100%;
      background: red;
      font-size: 25px;
      text-align: center;
    }
    .unmover {
      width: 50px;
      height: 100%;
      background: red;
      font-size: 20px;
      text-align: center;
      float: right;
    }
  }
  .ghost {
    background: #0333f2 !important;
  }
}
</style>
