<template>
  <div class="steps-container">
    <el-row class="steps-pg">
      <el-col :span="24">
        <el-steps class="handlerSteps" :active="activeIndex" align-center>
          <el-step title="基本信息" description="请填写基本信息" />
          <el-step title="兑换信息" description="请选择兑换商品信息" />
          <el-step title="提交成功" description="信息提交成功" />
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定义组件属性
const props = defineProps({
  // 当前激活的步骤索引
  activeIndex: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.steps-pg {
  padding: 36px;
}

.steps-pg .el-step__title.is-process {
  font-weight: 500 !important;
}

/* 步骤条样式 */
:deep(.handlerSteps) {
  .el-step__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    font-size: 18px;
  }

  .el-step__head.is-finish {
    color: #fff;
    border-color: #ff8686;
  }

  .el-step__icon.is-text {
    border-radius: 33%;
  }

  .el-step.is-horizontal .el-step__line {
    top: 22px;
    background-color: #c0c4cc;
  }

  .is-process .el-step__icon {
    background-color: #ff8686;
    color: #fff;
    border-color: #ff8686;
  }

  .is-finish .el-step__icon {
    background-color: #ff8686;
  }

  .el-step__title.is-finish {
    color: #000;
  }

  .el-step__description.is-finish {
    color: #bbbbbb;
  }

  .el-step__description.is-process {
    color: #bbbbbb;
  }

  .el-step__title.is-wait {
    color: #747474;
  }
}
</style>