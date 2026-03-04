<template>
  <el-row class="card-box">
    <el-col
      v-for="(card, index) in cardConfigs"
      :key="index"
      :span="card.span || 5"
      :offset="card.offset || (index > 0 ? 1 : 0)"
    >
      <div class="card">
        <el-row>
          <el-col :span="11">
            <div class="card-img">
              <img
                style="width: 65px; height: 65px"
                :src="card.image"
                :alt="card.title"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="card-text">
              <div class="card-text-desc">{{ card.title }}</div>
              <div class="card-text-number">
                {{ getCardValue(card.dataKey) }}
              </div>
              <div
                v-if="getPercentValue(card.percentKey)"
                class="card-text-type"
              >
                <text v-if="getPercentValue(card.percentKey) > 0"
                  >+{{ getPercentValue(card.percentKey) }}%</text
                >
                <text v-if="getPercentValue(card.percentKey) < 0"
                  >{{ getPercentValue(card.percentKey) }}%</text
                >
                {{ card.compareText }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  statData: {
    type: Object,
    default: () => ({}),
  },
  cardConfigs: {
    type: Array,
    default: () => [],
  },
});

const getCardValue = (dataKey) => {
  return props.statData[dataKey] || "0";
};

const getPercentValue = (percentKey) => {
  return props.statData[percentKey];
};
</script>

<style scoped>
.card-box {
  margin-bottom: 0;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
}

.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.card-text-desc {
  color: #797979;
  font-size: 16px;
  letter-spacing: 1px;
}

.card-text-number {
  color: #f56c6c;
  font-weight: 600;
  font-size: 24px;
}

.card-text-type {
  font-size: 12px;
  color: #797979;
}

.card-text-type text {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}
</style>
