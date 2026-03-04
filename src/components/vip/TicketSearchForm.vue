<template>
  <div class="ticket-search-form">
    <el-form ref="formRef" :model="searchForm" label-width="1px" inline>
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-input
              v-model="searchForm.search_keyword"
              clearable
              placeholder="请输入券码/卡号/卡券名称"
              style="width: 250px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item>
            <el-select
              v-model="searchForm.status"
              clearable
              placeholder="请选择状态"
              style="width: 150px"
            >
              <el-option label="未兑换" value="1" />
              <el-option label="已兑换" value="2" />
              <el-option label="转赠中" value="3" />
              <el-option label="已转赠" value="4" />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="3" :offset="10">
          <el-form-item>
            <div class="button-mgl">
              <el-button
                class="button1 button-float"
                round
                :loading="loading"
                @click="handleSearch"
              >
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  search: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:search", "search", "reset"]);

const formRef = ref();

const searchForm = computed({
  get: () => props.search,
  set: (value) => emit("update:search", value),
});

const handleSearch = () => {
  emit("search");
};
</script>

<style scoped></style>
