<!-- 订单状态标签组件 -->
<template>
    <div class="order_tags">
        <ul>
            <li @click="chooseTag(index)" class="order_tags-li" v-for="(item, index) in localTagList" :class="{
                active: item.active,
                Highlight: index == 2 && statData.pay_wait_ticket_cnt > 0,
            }" :key="index">
                {{ item.key
                }}<text v-if="item.key == '待付款' && statData.wait_pay_cnt > 0">({{ statData.wait_pay_cnt }})</text>
                <text v-else-if="
                    item.key == '已付款待发券' && statData.pay_wait_ticket_cnt > 0
                ">({{ statData.pay_wait_ticket_cnt }})</text>
                <text v-else-if="item.key == '待审核' && statData.wait_approve_cnt > 0">({{ statData.wait_approve_cnt
                    }})</text>
                <text v-else-if="item.key == '待发货' && statData.wait_deliver_cnt > 0">({{ statData.wait_deliver_cnt
                    }})</text>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, toRefs } from "vue";
import { StatSingle, } from "@/api/index.js";
/**
 * 使用具名 v-model：v-model:search
 */
const props = defineProps({
    tagList: { type: Array, default: () => [] },
    statData: { type: Object, default: () => ({}) },     // 统计数据
    search: { type: Object, default: () => ({}) },     // 具名 v-model:search
});
const emit = defineEmits(["chooseTag"]);
// 本地副本，避免直接改 props

const { tagList} = toRefs(props);
const localTagList = ref([...props.tagList]);

watch(tagList, (newVal) => {
    localTagList.value = [...newVal];
}, { deep: true });

const chooseTag = (indexValue) => {
    localTagList.value.forEach((row) => {
        row.active = false;
    });
    localTagList.value[indexValue].active = true;
    emit("chooseTag", indexValue);
};
</script>

<style scoped lang="less">
.order_tags {
    position: relative;
    height: 34px;
    overflow: hidden;
}

.order_tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #e9eaec;
}

.order_tags-li.active {
    color: #f56c6c;
    font-weight: 500;
    // margin-top: 1px;
    background-color: #fff;
    border-bottom: 1px solid #fff;
    border-top: 2px solid #f56c6c;
    border-left: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
}

.order_tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.order_tags-li {
    float: left;
    font-size: 14px;
    width: 140px;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
    height: 33px;
    line-height: 26px;
    background: #fff;
    vertical-align: middle;
    color: #666;
}
</style>