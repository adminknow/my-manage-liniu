<template>
  <el-table
    :data="data"
    border
    class="table"
    height="300"
    v-loading="loading"
    :header-cell-style="{ 'text-align': 'center' }"
    header-cell-class-name="table-header"
  >
    <el-table-column label="类型" align="center">
      <template #default="scope">
        <p v-if="scope.row.TicketTemplate.Type == 5">现金券</p>
        <p v-if="scope.row.TicketTemplate.Type == 4">折扣券</p>
        <p v-if="scope.row.TicketTemplate.Type == 6">不可充值储值卡</p>
        <p v-if="scope.row.TicketTemplate.Type == 7">可充值储值卡</p>
        <p v-if="scope.row.TicketTemplate.Type == 0">提货券</p>
        <p v-if="scope.row.TicketTemplate.Type == 10">提货券包</p>
      </template>
    </el-table-column>
    <el-table-column label="批次号" align="center" width="100">
      <template #default="scope">
        <p>{{ scope.row.TicketTemplate.Code }}</p>
      </template>
    </el-table-column>
    <el-table-column label="名称" align="center">
      <template #default="scope">
        <p>{{ scope.row.TicketTemplate.Title }}</p>
      </template>
    </el-table-column>
    <el-table-column label="券码/卡号" align="center" width="180">
      <template #default="scope">
        <p>{{ scope.row.TicketCode }}</p>
      </template>
    </el-table-column>
    <el-table-column label="有效期" align="center" width="200">
      <template #default="scope">
        <p>{{ scope.row.ValidDateDesc2 }}</p>
      </template>
    </el-table-column>
    <el-table-column label="配送期" align="center" width="200">
      <template #default="scope">
        <p
          v-if="
            scope.row.TicketTemplate.Type != 5 &&
            scope.row.TicketTemplate.Type != 6
          "
        >
          {{ scope.row.ExchangeDateDesc2 }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="券商" align="center" width="150">
      <template #default="scope">
        <p>{{ scope.row.TicketTemplate.UnitName }}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="VipTicketStatusDesc"
      align="center"
      label="状态"
      width="100"
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
