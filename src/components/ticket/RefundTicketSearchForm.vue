<template>
    <el-form label-width="1px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchData.bill_code"
              clearable
              placeholder="退券单号"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleInputChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="searchData.bill_status"
              clearable
              style="width: 100%"
              placeholder="状态"
              @change="handleInputChange"
            >
              <el-option label="待审批" value="0"></el-option>
              <el-option label="审批通过" value="1"></el-option>
              <el-option label="审批不通过" value="-1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="button-mgl">
            <el-button
              class="button2 button-float"
              round
              @click="$emit('export')"
            >
              导&nbsp;&nbsp;出
            </el-button>
            <el-button
              class="button2 button-float"
              round
              @click="$emit('add')"
              v-if="showAddButton"
            >
              <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新&nbsp;&nbsp;增
            </el-button>
            <el-button
              class="button1 button-float"
              round
              @click="$emit('search')"
            >
              <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchData.ticket_template_code"
              clearable
              placeholder="券批次号"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.ticket_template_title"
              clearable
              placeholder="券名称"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.ticket_code"
              clearable
              placeholder="券码"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-select
              v-model="searchData.unit_id"
              clearable
              filterable
              style="width: 100%"
              placeholder="客户"
              @change="handleInputChange"
            >
              <el-option
                v-for="(obj, index) in customerOptions"
                :key="index"
                :label="obj.UnitName"
                :value="obj.UnitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { Plus, Search } from '@element-plus/icons-vue'
  
  // Props
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        unit_id: "",
        bill_code: "",
        bill_date_begin: "",
        bill_date_end: "",
        time: "",
        bill_status: "",
        ticket_template_code: "",
        ticket_template_title: "",
        ticket_code: "",
      })
    },
    customerOptions: {
      type: Array,
      default: () => []
    },
    showAddButton: {
      type: Boolean,
      default: false
    }
  })
  
  // Emits
  const emit = defineEmits(['update:modelValue', 'search', 'export', 'add'])
  
  // Local data
  const searchData = ref({ ...props.modelValue })
  
  // Methods
  const handleInputChange = () => {
    emit('update:modelValue', searchData.value)
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newVal) => {
    searchData.value = { ...newVal }
  }, { deep: true })
  </script>