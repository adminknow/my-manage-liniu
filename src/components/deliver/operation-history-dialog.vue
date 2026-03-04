<template>
    <el-dialog
      :title="title"
      v-model="visible"
      :show-close="false"
      width="80%"
      height="300"
    >
    <div style="width:100%;height: 18px;"></div>
      <el-table
        :header-cell-style="{ 'text-align': 'center' }"
        v-loading="loading"
        border
        :data="historyData"
        style="width: 100%"
      >
        <el-table-column align="left" label="操作人" width="200">
          <template #default="scope">
            <p>姓名：{{ scope.row.OpUserName }}</p>
            <p>角色：{{ scope.row.OpRoleName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="OpTime" align="center" label="时间" width="160">
        </el-table-column>
        <el-table-column
          prop="OpTypeDesc"
          align="center"
          label="类型"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="FromStatusDesc"
          align="center"
          label="前置状态=>后置状态"
          width="220"
        >
          <template #default="scope">
            <p>
              <text v-if="scope.row.FromStatusDesc"
                >{{ scope.row.FromStatusDesc }}=></text
              >
              {{ scope.row.ToStatusDesc }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="OpRemark" align="center" label="备注">
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="handleClose">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  // Props
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '操作记录'
    },
    historyData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  // Emits
  const emit = defineEmits(['update:modelValue', 'close'])
  
  // Local data
  const visible = ref(props.modelValue)
  
  // Methods
  const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newVal) => {
    visible.value = newVal
  })
  
  watch(visible, (newVal) => {
    emit('update:modelValue', newVal)
  })
  </script>