<template>
  <el-dialog
    title="评价列表"
    v-model="dialogVisible"
    width="68%"
    :close-on-click-modal="false"
    @close="handleClose"
    class="evaluate-dialog"
  >
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="">
              <el-input
                class="input-with-icon"
                v-model="queryParams.search.search_keyword"
                clearable
                placeholder="内容/评论人"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="17" :offset="1"> </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="currentPageData"
      height="400"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" label="SKU" width="160">
        <template #default="scope">
          {{ scope.row.ContentDesc.SkuPropertyDesc || "" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单">
        <template #default="scope">
          {{ scope.row.ContentDesc.FromBillCode || "" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="星级" width="100">
        <template #default="scope">
          {{ scope.row.ContentDesc.Star || "" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template #default="scope">
          {{ scope.row.ContentDesc.Content || "" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="100">
        <template #default="scope">
          <el-link
            v-if="scope.row.ContentDesc.Images.length > 0"
            style="color: #f56c6c; font-size: 12px; margin-left: 4px"
            :underline="false"
            @click="viewImgs(scope.row.ContentDesc.Images)"
          >
            图片预览</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="Nickname"
        align="center"
        label="评论人"
        width="120"
      >
      </el-table-column>
      <el-table-column align="center" label="评论时间" width="160">
        <template #default="scope">
          {{ scope.row.Time.replace("T", " ").substring(0, 19) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="queryParams.PageStartRow"
        v-model:page-size="queryParams.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>

    <el-dialog
      title="图片预览"
      v-model="imgsVisible"
      width="38%"
      :show-close="false"
    >
      <el-form label-width="100px">
        <el-carousel height="260px" v-if="imgsList && imgsList.length > 0">
          <el-carousel-item v-for="(item, index) in imgsList" :key="index">
            <el-image
              style="width: 100%; height: 260px"
              :src="item.url"
              fit="scale-down"
            />
          </el-carousel-item>
        </el-carousel>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  computed,
} from "vue";
import { GetCommentes } from "@/api/common.js";

import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
const props = defineProps({
  Visible: Boolean,
  goodsId: {
    type: String,
    default: "",
  },
});
// //使用父组件传递过来的值
// 从属性中解构
const { Visible, goodsId } = toRefs(props);

const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);
// 表格数据
const tableData = ref([]);
const tableLoading = ref(false);
const multipleTable = ref(null);
const evaluateFormRef = ref(null);
// 分页参数
const pageTotal = ref(0);
const queryParams = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
  search: {
    search_keyword: "",
  },
});
// 计算属性：当前页数据（包含搜索过滤）
const currentPageData = computed(() => {
  // 先进行搜索过滤
  const keyword = queryParams.search.search_keyword.toLowerCase();
  let filteredData = tableData.value;

  if (keyword) {
    filteredData = tableData.value.filter((item) => {
      // 搜索内容和评论人字段
      return (
        (item.Content && item.Content.toLowerCase().includes(keyword)) ||
        (item.Nickname && item.Nickname.toLowerCase().includes(keyword))
      );
    });
  }

  // 然后进行分页
  const startIndex = (queryParams.PageStartRow - 1) * queryParams.PageRowCount;
  pageTotal.value = filteredData.length; // 更新总条数
  return filteredData.slice(startIndex, startIndex + queryParams.PageRowCount);
});
// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = () => {
  emit("CloseVisible", false);
};
const imgsVisible = ref(false);
const imgsList = ref([]);
const viewImgs = (imgs) => {
  if (imgs && imgs.length > 0) {
    imgsList.value = imgs.map((img) => ({
      url: img,
    }));
    imgsVisible.value = true;
  } else {
    ElMessage.warning("暂无图片");
  }
};
// 搜索方法
const search = () => {
  queryParams.PageStartRow = 1; // 搜索时重置到第一页
  initData();
};
// 初始化数据
const initData = async () => {
  try {
    tableLoading.value = true;
    // 调用API获取评价数据
    const res = await GetCommentes({
      ObjectType: "Goods",
      ObjectId: goodsId.value,
    });
    if (res.Code === 200) {
      tableData.value = res.DataMap || [];
      tableData.value.forEach((item) => {
        item.ContentDesc = JSON.parse(item.Content || "{}");
      });
      pageTotal.value = res.DataMap.length || 0;
      // 重置搜索条件
      queryParams.PageStartRow = 1;
      queryParams.search.search_keyword = "";
    } else {
      ElMessage.error(res.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取评价数据出错:", error);
  } finally {
    tableLoading.value = false;
  }
};
// 分页处理
const handlePageChange = (val) => {
  queryParams.PageStartRow = val;
};
// 页面大小变化处理
const handleSizeChange = (val) => {
  queryParams.PageRowCount = val;
  queryParams.PageStartRow = 1;
};
// 组件挂载时加载数据
onMounted(() => {
  //   initData();
});
// 监听弹窗显示状态
watch(
  () => props.Visible,
  (newValue) => {
    dialogVisible.value = newValue;
    if (newValue) {
      initData();
    }
  }
);
</script>
<style lang="less">
.evaluate-dialog {
  .el-dialog__body {
    padding-top: 1px !important;
  }
}
</style>
