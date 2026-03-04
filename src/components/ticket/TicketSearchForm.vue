<template>
  <el-form label-width="1px" v-if="loginUser.UnitType == 1">
    <el-row>
      <el-col :span="5">
        <el-form-item label="">
          <el-input
            v-model="searchForm.search_keyword"
            clearable
            placeholder="请输入批次号、标题"
            @input="handleSearchChange"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-select
            clearable
            style="width: 100%"
            v-model="searchForm.display_status"
            placeholder="请选择状态"
            @change="handleSearchChange"
          >
            <el-option label="全部" value=""> </el-option>
            <el-option label="有效中" value="1"> </el-option>
            <el-option label="已过期" value="2"> </el-option>
            <el-option label="已取消" value="3"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-date-picker
            style="width: 100%"
            v-model="searchForm.time"
            type="daterange"
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleSearchChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="button-mgl">
          <el-button
            v-if="IsRight2"
            class="button2 button-float"
            round
            @click="$emit('handleSend')"
          >
            我要发券
          </el-button>
          <el-button
            v-if="IsRight1"
            class="button2 button-float"
            round
            @click="$emit('handleSell')"
          >
            我要卖券
          </el-button>
          <el-button
            class="button1 button-float"
            round
            @click="$emit('handleSearch')"
          >
            <el-icon> <Search /> </el-icon
            >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-form-item label="">
          <el-select
            v-model="searchForm.brand_id"
            clearable
            filterable
            placeholder="请选择品牌"
            style="width: 100%"
            @change="handleSearchChange"
          >
            <el-option
              v-for="item in brands"
              :key="item.BrandName"
              :label="item.BrandName"
              :value="item.BrandId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-select
            v-model="searchForm.ticket_template_type"
            clearable
            placeholder="请选择券类型"
            style="width: 100%"
            @change="handleSearchChange"
          >
            <el-option label="提货券" value="0"> </el-option>
            <el-option label="提货券包" value="10"> </el-option>
            <el-option label="现金券" value="5"> </el-option>
            <el-option label="折扣券" value="4"> </el-option>
            <el-option label="储值卡" value="6"> </el-option>
            <el-option label="企业点卡" value="7"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-select
            v-model="searchForm.create_unit_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入券商名称"
            :remote-method="remoteMethod"
            remote-show-suffix
            :loading="SelLoading"
            style="width: 100%"
            clearable
            @change="handleSearchChange"
          >
            <el-option
              v-for="(item, index) in UnitData"
              :key="index"
              :label="item.UnitCode + '-' + item.UnitName"
              :value="item.UnitId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="button-mgl">
          <el-button
            v-if="IsRight"
            class="button2 button-float"
            round
            @click="$emit('handleImport')"
          >
            导入券码
          </el-button>
          <el-button
            class="button2 button-float"
            round
            @click="$emit('handleOut')"
          >
            导出
          </el-button>
          <el-button
            v-if="IsRight"
            class="button1 button-float"
            round
            @click="$emit('handleAdd')"
          >
            <i class="el-icon-mppinleizengjia_o"></i>&nbsp;&nbsp;创建卡券
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>

  <el-form label-width="1px" v-else>
    <el-row>
      <el-col :span="5">
        <el-form-item label="">
          <el-input
            v-model="searchForm.ticket_template_code"
            clearable
            placeholder="请输入批次号"
            @input="handleSearchChange"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-input
            v-model="searchForm.ticket_template_title"
            clearable
            placeholder="请输入标题"
            @input="handleSearchChange"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-date-picker
            style="width: 100%"
            v-model="searchForm.time"
            type="daterange"
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleSearchChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="button-mgl">
          <el-button
            v-if="IsRight2"
            class="button2 button-float"
            round
            @click="$emit('handleSend')"
          >
            <i class="el-icon-mpdaohang"></i>&nbsp;&nbsp;我要发券
          </el-button>
          <el-button
            v-if="IsRight1"
            class="button2 button-float"
            round
            @click="$emit('handleSell')"
          >
            <i class="el-icon-mptianmaohaoquan"></i>&nbsp;&nbsp;我要卖券
          </el-button>
          <el-button
            class="button1 button-float"
            round
            @click="$emit('handleSearch')"
          >
            <el-icon> <Search /> </el-icon
            >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-form-item label="">
          <el-select
            v-model="searchForm.brand_id"
            filterable
            clearable
            placeholder="请选择品牌"
            style="width: 100%"
            @change="handleSearchChange"
          >
            <el-option
              v-for="item in brands"
              :key="item.BrandName"
              :label="item.BrandName"
              :value="item.BrandId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-select
            v-model="searchForm.ticket_template_type"
            clearable
            placeholder="请选择券类型"
            style="width: 100%"
            @change="handleSearchChange"
          >
            <el-option label="提货券" value="0"> </el-option>
            <el-option label="提货券包" value="10"> </el-option>
            <el-option label="折扣券" value="4"> </el-option>
            <el-option label="现金券" value="5"> </el-option>
            <el-option label="储值卡" value="6"> </el-option>
            <el-option label="企业点卡" value="7"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="">
          <el-select
            clearable
            style="width: 100%"
            v-model="searchForm.display_status"
            placeholder="请选择状态"
            @change="handleSearchChange"
          >
            <el-option label="全部" value=""> </el-option>
            <el-option label="有效中" value="1"> </el-option>
            <el-option label="已过期" value="2"> </el-option>
            <el-option label="已取消" value="3"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="1">
        <div class="button-mgl">
          <el-button
            class="button2 button-float"
            round
            @click="$emit('handleOut')"
          >
            导出
          </el-button>
          <el-button
            v-if="IsRight"
            class="button2 button-float"
            round
            @click="$emit('handleImport')"
            >导入券码
          </el-button>
          <el-button
            v-if="IsRight"
            class="button1 button-float"
            round
            @click="$emit('handleAdd')"
          >
            <i class="el-icon-mppinleizengjia_o"></i>&nbsp;&nbsp;创建卡券
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { SearchUnites } from "@/api/index.js";
import Cookie from "js-cookie";

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  brands: {
    type: Array,
    default: () => [],
  },
  IsRight: {
    type: Boolean,
    default: false,
  },
  IsRight1: {
    type: Boolean,
    default: false,
  },
  IsRight2: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "handleSearch",
  "handleSend",
  "handleSell",
  "handleOut",
  "handleImport",
  "handleAdd",
]);

// Data
const loginUser = JSON.parse(Cookie.get("User"));
const SelLoading = ref(false);
const UnitData = ref([]);

// 内部搜索表单
const searchForm = reactive({
  search_keyword: "",
  ticket_template_code: "",
  ticket_template_title: "",
  display_status: "1",
  brand_id: "",
  time: [],
  create_date_begin: "",
  create_date_end: "",
  create_unit_id: "",
  ticket_template_type: "",
});

// 监听外部传入的值变化
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(searchForm, newVal);
  },
  { immediate: true, deep: true }
);

// 搜索条件变化时向外发送
const handleSearchChange = () => {
  emit("update:modelValue", { ...searchForm });
};

// 远程搜索券商
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await SearchUnites({
      SearchCondition: {
        search_keyword: SearchQuery,
        unit_type: 2,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      UnitData.value = res.DataMap.Data ? res.DataMap.Data : [];
    }
  } else {
    UnitData.value = [];
  }
};
</script>
