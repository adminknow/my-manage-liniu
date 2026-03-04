<template>
  <el-form label-width="1px">
    <!-- 第一行 -->
    <el-row>
      <el-col :span="5">
        <el-form-item>
          <el-input v-model="searchData.bill_code" clearable placeholder="销售单号" @input="handleInputChange" />
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item>
          <el-date-picker v-model="searchData.time" type="daterange" range-separator="To" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="handleInputChange" />
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item>
          <el-select v-model="searchData.bill_status" clearable style="width: 100%" placeholder="领取状态"
            @change="handleInputChange">
            <el-option label="待审批" value="0" />
            <el-option label="审批通过,待领取" value="1" />
            <el-option label="已领取" value="10" />
            <el-option label="审批不通过" value="-1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="button-mgl flex-row-end">
          <el-button class="button1 button-float" round @click="$emit('search')">
            <el-icon>
              <Search />
            </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
          </el-button>
          <el-button class="button2 button-float" round @click="$emit('export')">
            导&nbsp;&nbsp;出
          </el-button>
          <el-button class="button2 button-float" round @click="$emit('add')" v-if="showAddButton">
            <el-icon>
              <Plus />
            </el-icon>&nbsp;&nbsp;新&nbsp;&nbsp;增
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 第二行（默认显示：客户 / 领取电话 / 销售渠道） -->
    <el-row>
      <el-col :span="5">
        <el-form-item>
          <el-select v-model="searchData.unit_id" clearable filterable style="width: 100%" placeholder="客户"
            @change="handleInputChange">
            <el-option v-for="(obj, index) in customerOptions" :key="index" :label="obj.UnitName" :value="obj.UnitId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item>
          <el-input v-model="searchData.take_cell" clearable placeholder="领取电话" @input="handleInputChange" />
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item>
          <el-input v-model="searchData.sale_channel" clearable placeholder="销售渠道" @input="handleInputChange" />
        </el-form-item>

      </el-col>
      <el-col :span="6" :offset="1">
        <el-button link style="color: #f56c6c" class="more-btn" @click="toggleExpand">
          {{ isExpanded ? "收起" : "更多条件" }}
          <el-icon style="margin-left: 4px; transition: transform 0.25s" :style="{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }">
            <arrow-down />
          </el-icon>
        </el-button></el-col>
    </el-row>

    <!-- 第三行（展开后显示：券批次号 / 券名称 / 券码） -->
    <transition name="expand-fade">
      <div v-show="isExpanded">
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="searchData.ticket_template_code" clearable placeholder="券批次号"
                @input="handleInputChange" />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item>
              <el-input v-model="searchData.ticket_template_title" clearable placeholder="券名称"
                @input="handleInputChange" />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item>
              <el-input v-model="searchData.ticket_code" clearable placeholder="券码" @input="handleInputChange" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1" />
        </el-row>
      </div>
    </transition>

    <div style="width:100%;height: 10px;"></div>
  </el-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { Plus, Search, ArrowDown } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      bill_code: "",
      time: "",
      bill_status: "",
      unit_id: "",
      take_cell: "",
      sale_channel: "",
      ticket_template_code: "",
      ticket_template_title: "",
      ticket_code: "",
    }),
  },
  customerOptions: {
    type: Array,
    default: () => [],
  },
  showAddButton: {
    type: Boolean,
    default: false,
  },
  defaultExpanded: {
    // 可选：外部控制初始是否展开
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "search", "export", "add"]);

const searchData = ref({ ...props.modelValue });
const isExpanded = ref(props.defaultExpanded);

const handleInputChange = () => {
  emit("update:modelValue", searchData.value);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

watch(
  () => props.modelValue,
  (newVal) => {
    searchData.value = { ...newVal };
  },
  { deep: true }
);
</script>

<style scoped>
.flex-row-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.more-btn {
  padding: 0 4px;
  font-size: 13px;
}

.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: all 0.25s ease;
}

.expand-fade-enter-from,
.expand-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.el-form-item {
  margin-bottom: 12px;
}
</style>
