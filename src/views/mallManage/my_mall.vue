<!-- 我的商城页面 -->
<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.mall_search_keyword" clearable placeholder="请输入名称、编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> <el-form-item label="">
              <el-select clearable v-model="query.search.apply_status" placeholder="状态" style="width:80%">
                <el-option label="开通" value="10"> </el-option>
                <el-option label="关闭" value="-1"> </el-option>
                <el-option label="待审核" value="0"> </el-option>
              </el-select>
            </el-form-item> </el-col>
          <el-col :span="6" :offset="7">
            <div class="button-mgl">
              <el-button v-if="loginUser.UnitType != 1" class="button2 button-float" round @click="handleApply()">申请开通商城
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <mall-table :tableData="tableData" :tableLoading="tableLoading" @OpBtn="OpBtn"></mall-table>
    <!-- 主表格分页 -->
    <common-pagination v-model:current-page="query.PageStartRow" v-model:page-size="query.PageRowCount"
      :total="pageTotal" :page-sizes="[15, 50, 100]" @page-change="handlePageChange" @size-change="handleSizeChange" />
    <apply-modal :Visible="modal" @CloseVisible="close" :desc="'申请开通商城'" :opType="'apply'"></apply-modal>
  </div>
</template>

<script setup>
import CommonPagination from "@/components/common/CommonPagination.vue";
import applyModal from "@/components/mallManage/applyModal.vue";
import mallTable from "@/components/mallManage/mallTable.vue";
import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import { SearchMyMalls, OnlineMyMall } from "@/api/index.js";

import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const query = reactive({
  search: {
    mall_search_keyword: "",
    apply_status: "",//状态
    unit_id: loginUser.UnitId,
    sum_goods_cnt: 1,
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchMyMalls({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotal.value = res.DataMap.ToalCount;
  }
};
//开通商城通过按钮
const OpBtn = () => {
  query.PageStartRow = 1;
  getData();
};
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const modal = ref(false)
const handleApply = () => {
  modal.value = true;
}
//关闭申请商城弹窗
const close = (value) => {
  modal.value = false;
  if (value == 1) {
    handleSearch();
  }
}
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
const init = async () => {
  getData();
};

init();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    if (data.meta.title == "我的商城") {
      query.PageStartRow = 1;
      getData();
    }
  }
);
</script>

<style scoped></style>
