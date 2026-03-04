<template>
  <div class="handle-box">
    <el-form label-width="1px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchData.openid"
              clearable
              placeholder="请输入openid"
              @keyup.enter="handleSearch"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.vip_name"
              clearable
              placeholder="请输入姓名"
              @keyup.enter="handleSearch"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchData.vip_cell"
              clearable
              placeholder="请输入电话"
              @keyup.enter="handleSearch"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="button-mgl">
            <el-button class="button2 button-float" round @click="handleExport">
              导&nbsp;&nbsp;出
            </el-button>
            <el-button class="button1 button-float" round @click="handleSearch">
              <el-icon> <Search /> </el-icon>
              &nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="searchData.give_type"
              clearable
              style="width: 100%"
              placeholder="类型"
            >
              <el-option label="好友" value="1"></el-option>
              <el-option label="群" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="searchData.give_status"
              clearable
              style="width: 100%"
              placeholder="状态"
            >
              <el-option label="待领取" value="0"></el-option>
              <el-option label="已领取" value="1"></el-option>
              <el-option label="已撤回" value="-1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "search", "export"]);

// 搜索数据
const searchData = reactive({
  openid: "",
  vip_name: "",
  vip_cell: "",
  give_date_begin: "",
  give_date_end: "",
  give_type: "",
  give_status: "",
  time: [],
});

// 监听props变化，初始化搜索数据
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(searchData, newVal);
  },
  { immediate: true, deep: true }
);

// 监听搜索数据变化，向父组件emit
watch(
  searchData,
  (newVal) => {
    emit("update:modelValue", { ...newVal });
  },
  { deep: true }
);

// 搜索方法
const handleSearch = () => {
  emit("search", { ...searchData });
};

// 导出方法
const handleExport = () => {
  emit("export", { ...searchData });
};

// 重置搜索
const resetSearch = () => {
  Object.assign(searchData, {
    openid: "",
    vip_name: "",
    vip_cell: "",
    give_date_begin: "",
    give_date_end: "",
    give_type: "",
    give_status: "",
    time: [],
  });
};

// 暴露方法供父组件调用
defineExpose({
  resetSearch,
});
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}


</style>
