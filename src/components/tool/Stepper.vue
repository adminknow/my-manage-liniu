<template>
  <div class="stepper">
    <span
      class="input-num-minus"
      :class="value == 1 ? 'is-disabled' : ''"
      @click="decrement"
      onselectstart="return false"
      >-</span
    >
    <el-input
      class="product-input"
      v-model="value"
      @blur="inputBlur"
      style="width: 25%"
    ></el-input>
    <span class="input-num-plus" @click="increment" onselectstart="return false"
      >+</span
    >
  </div>
</template>

<script setup>
import { toRefs, ref, watch } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  productNum: "",
  productListNum: "",
});
// //使用父组件传递过来的值
const { productNum, productListNum } = toRefs(props);
const emit = defineEmits([]);
const increment = () => {
  if (value.value >= productListNum.value) {
    return;
  }
  value.value++;
  emit("increment", value.value);
};
const value = ref(productNum.value);
const decrement = () => {
  if (value.value > 1) {
    value.value--;
    emit("decrement", value.value);
  }
};
const inputBlur = () => {
  if (value.value >= productListNum.value || value.value == 0) {
    value.value = JSON.parse(JSON.stringify(productListNum.value));
  }
  emit("inputBlur", value.value);
};

watch(
  () => props.productNum,
  (newValue, oldValue) => {
    value.value = newValue;
    if (newValue) {
    }
  }
);
</script>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
}

.input-num-minus,
.input-num-plus {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  text-align: center;
  background: #fff;
  position: relative;
  margin-left: 0;
  cursor: pointer;
}
.is-disabled {
  cursor: not-allowed;
  color: #bbb;
  background-color: #f5f5f5;
}
</style>
<style>
.product-input .el-input__wrapper {
  border-radius: 0;
}
.product-input .el-input__inner {
  text-align: center;
}
</style>
