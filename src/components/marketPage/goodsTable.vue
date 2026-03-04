<template>
    <div class="">
    </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
    //子组件接收父组件传递过来的值
    openSkuModal: Boolean,
    ExchangeArr: {}, //传进来的兑换商品，
});
// //使用父组件传递过来的值
const { openSkuModal, ExchangeArr } = toRefs(props);
watch(
    () => props.openSkuModal,
    (newValue, oldValue) => {
        //这里是用来监控父组件 点击按钮打开
        if (newValue) {
            init();
            SyncSelSku();
        }
    }
);

//初始化把数据加载好
const init = () => {
};

////////////////////////////////////////////////////////////////
</script>
<style scoped></style>
