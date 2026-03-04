<template>
  <el-table
    :data="data"
    border
    class="table"
    v-loading="loading"
    :header-cell-style="{ 'text-align': 'center' }"
    header-cell-class-name="table-header"
  >
    <el-table-column prop="VipName" align="center" label="姓名" width="160" />
    <el-table-column
      prop="VipCell"
      align="center"
      label="电话"
      width="160"
    ></el-table-column>
    <el-table-column
      prop="VipTypeName"
      align="center"
      label="会员等级"
      width="160"
    ></el-table-column>

    <el-table-column align="left" label="粉丝openid">
      <template #default="scope">
        <p v-if="scope.row.WxxcxFans.Openid">
          平台：{{ scope.row.WxxcxFans.Openid }}
        </p>
        <p v-if="scope.row.WxxcxOpenid2">私域：{{ scope.row.WxxcxOpenid2 }}</p>
        <p v-if="scope.row.WxxcxOpenid3">卡券：{{ scope.row.WxxcxOpenid3 }}</p>
        <p v-if="scope.row.WxxcxOpenid4">福采：{{ scope.row.WxxcxOpenid4 }}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="CreateTime"
      align="center"
      label="创建时间"
      width="160"
    ></el-table-column>
    <el-table-column width="180" label="操作" align="center">
      <template #default="scope">
        <div class="button-mgl">
          <el-button
            class="button-op-edit"
            size="small"
            @click="$emit('view-tickets', scope.row.VipId, scope.$index)"
          >
            拥有的卡券
          </el-button>
          <el-button
            class="button-op-view"
            size="small"
            @click="$emit('view-account', scope.row.VipId, scope.row.VipName)"
          >
            账户
          </el-button>
        </div>
      </template>
    </el-table-column>
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
// 定义事件
const emit = defineEmits(["view-account", "view-tickets"]);
</script>
