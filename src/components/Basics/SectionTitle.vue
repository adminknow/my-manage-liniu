<!--  -->
<template>
  <div class="">
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local flex-row items-center" :span="20"
        >{{title}}</el-col
      >
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import {} from "@/api/goods.js";
const props = defineProps({
  //子组件接收父组件传递过来的值
  title: String,
});
// //使用父组件传递过来的值
const { title } = toRefs(props);

watch(
  () => props.openModal,
  (newValue, oldValue) => {
    if (newValue) {
      getData();
    }
  }
);
////////////////////////////////////////////////////////////////
</script>
<style scoped></style>
