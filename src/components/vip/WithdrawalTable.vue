<template>
  <el-table
    :data="data"
    border
    class="table"
    v-loading="loading"
    :header-cell-style="{ 'text-align': 'center' }"
    header-cell-class-name="table-header"
  >
    <el-table-column
      prop="AccountName"
      align="center"
      label="微信小程序"
      width="200"
    ></el-table-column>
    <el-table-column
      prop="BillCode"
      align="center"
      label="单据号"
    ></el-table-column>
    <el-table-column
      prop="VipName"
      align="center"
      label="会员姓名"
      width="120"
    ></el-table-column>
    <el-table-column
      prop="VipCell"
      align="center"
      label="会员电话"
      width="120"
    ></el-table-column>
    <el-table-column
      prop="PayNo"
      align="center"
      label="支付单号"
    ></el-table-column>
    <el-table-column align="center" label="金额(元)" width="120">
      <template #default="scope">
        <p>{{ scope.row.Amt / 100 }}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="BillTime"
      align="center"
      label="时间"
      width="160"
    ></el-table-column>
    <el-table-column
      prop="BillStatusDesc"
      align="center"
      label="单据状态"
      width="160"
    ></el-table-column>
  </el-table>
</template>
<script setup>
// 定义组件属性
const props = defineProps({
  // 表格加载数据
  data: {
    type: Array,
    default: () => [],
  },
  // 搜索等待状态
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
