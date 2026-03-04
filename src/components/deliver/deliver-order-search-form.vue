<template>
    <el-form label-width="1px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchData.order_code"
              clearable
              placeholder="请输入配送单号"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.openid"
              clearable
              placeholder="请输入OpenID"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-date-picker
              style="width: 100%"
              v-model="searchData.time"
              type="daterange"
              :shortcuts="shortcuts"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handleInputChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="button-mgl">
            <el-button
              class="button2 button-float"
              round
              @click="$emit('import')"
              v-if="showImportButton"
            >导入发货
            </el-button>
            <el-button
              class="button2 button-float"
              round
              @click="$emit('export')"
            >导&nbsp;&nbsp;出
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
              v-model="searchData.ticket_code"
              clearable
              placeholder="请输入券码"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.contact_name"
              clearable
              placeholder="请输入收件人姓名"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.contact_cell"
              clearable
              placeholder="请输入收件人电话"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="button-mgl">
            <el-button
              class="button2 button-float"
              round
              @click="$emit('batchApprove')"
              v-if="showBatchApproveButton"
            >批量审核
            </el-button>
            <el-button
              class="button2 button-float"
              round
              @click="$emit('add')"
              v-if="showAddButton"
            >
              <i class="el-icon-mppinleizengjia_o"></i>&nbsp;&nbsp;新增配送单
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchData.express_code"
              clearable
              placeholder="请输入物流单号"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.goods_name"
              clearable
              placeholder="请输入商品名称或编码"
              @input="handleInputChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="" v-if="showUnitSelect">
            <el-select
              v-model="searchData.deliver_unit_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入券商名称"
              :remote-method="handleRemoteMethod"
              remote-show-suffix
              :loading="loading"
              style="width: 100%"
              clearable
              @change="handleInputChange"
            >
              <el-option
                v-for="(item, index) in unitOptions"
                :key="index"
                :label="item.UnitCode + '-' + item.UnitName"
                :value="item.UnitId"
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
  import { Search } from '@element-plus/icons-vue'
  
  // Props
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        order_code: "",
        openid: "",
        time: [],
        order_date_begin: "",
        order_date_end: "",
        ticket_code: "",
        contact_name: "",
        contact_cell: "",
        express_code: "",
        goods_name: "",
        deliver_unit_id: "",
      })
    },
    showImportButton: {
      type: Boolean,
      default: false
    },
    showBatchApproveButton: {
      type: Boolean,
      default: false
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    showUnitSelect: {
      type: Boolean,
      default: false
    },
    unitOptions: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  // Emits
  const emit = defineEmits(['update:modelValue', 'search', 'export', 'import', 'batchApprove', 'add', 'remoteMethod'])
  
  // Local data
  const searchData = ref({ ...props.modelValue })
  
  // 日期快捷选项
  const shortcuts = [
    {
      text: "上周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: "上个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
  ]
  
  // Methods
  const handleInputChange = () => {
    emit('update:modelValue', searchData.value)
  }
  
  const handleRemoteMethod = (query) => {
    emit('remoteMethod', query)
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newVal) => {
    searchData.value = { ...newVal }
  }, { deep: true })
  </script>