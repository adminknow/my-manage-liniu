<template>
  <div class="handle-box">
    <el-form label-width="1px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-input
              v-model="searchForm.wxxcx_openid"
              clearable
              @keyup.enter="handleSearch"
              placeholder="请输入粉丝openid"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchForm.vip_name"
              clearable
              placeholder="请输入会员姓名"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchForm.vip_cell"
              clearable
              placeholder="请输入会员电话"
              maxlength="11"
              @keyup.enter="handleSearch"
            >
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="6" :offset="1">
          <div class="button-mgl">
            <el-button class="button2 button-float" round @click="handleExport">
              导&nbsp;&nbsp;出
            </el-button>
            <el-button class="button1 button-float" round @click="handleSearch">
              <el-icon><Search /></el-icon
              >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="">
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :shortcuts="dateShortcuts"
              :default-value="defaultDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-input
              v-model="searchForm.wxxcx_unionid"
              clearable
              placeholder="请输入UnionID"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="">
            <el-select
              v-model="searchForm.vip_type_id"
              clearable
              placeholder="请选择会员等级"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item in vipList"
                :key="item.VipTypeId"
                :label="item.VipTypeName"
                :value="item.VipTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { ElMessage } from "element-plus";
// 定义组件属性
const props = defineProps({
  // 搜索表单数据
  search: {
    type: Object,
    required: true,
  },
  // 会员等级列表
  vipList: {
    type: Array,
    default: () => [],
  },
  // 搜索加载状态
  searchLoading: {
    type: Boolean,
    default: false,
  },
  // 是否有搜索数据（用于控制导出按钮状态）
  hasSearchData: {
    type: Boolean,
    default: false,
  },
});
// 定义事件
const emit = defineEmits(["update:search", "search", "export"]);

// 响应式数据
const formRef = ref();

// 本地搜索表单数据
const searchForm = computed({
  get: () => props.search,
  set: (value) => emit("update:search", value),
});

// 日期选择器快捷选项
const dateShortcuts = [
  {
    text: "最近7天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "最近30天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "本月",
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [start, end];
    },
  },
  {
    text: "上个月",
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return [start, end];
    },
  },
];

// 方法定义
const handleSearch = async () => {
  try {
    emit("search");
  } catch (error) {
    console.error("搜索表单验证失败:", error);
  }
};

const handleExport = () => {
  if (!props.hasSearchData) {
    ElMessage.warning("请先查询数据后再导出");
    return;
  }
  emit("export");
};
// 默认日期范围
const defaultDateRange = computed(() => {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  const defaultRange = [start, end];
  return defaultRange;
});
// 初始化默认值
const initDefaultValues = () => {
  // 如果搜索表单的时间字段为空，设置默认值
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  const defaultRange = [start, end];

  // 格式化日期为字符串
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedRange = [
    formatDate(defaultRange[0]),
    formatDate(defaultRange[1]),
  ];

  // 更新搜索表单
  const updatedSearch = {
    ...searchForm.value,
    time: formattedRange,
    create_date_begin: formattedRange[0],
    create_date_end: formattedRange[1],
  };
  emit("update:search", updatedSearch);
};
// 组件挂载时初始化默认值
onMounted(() => {
  initDefaultValues();
});
// 监听搜索表单变化，实时更新
watch(
  () => props.search,
  (newVal) => {
    nextTick(() => {
      // 清除验证错误信息
      formRef.value?.clearValidate();
    });
  },
  { deep: true }
);
</script>
