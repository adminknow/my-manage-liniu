<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.openid"
                clearable
                placeholder="请输入openid"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item>
              <el-select
                v-model="query.search.appid"
                style="width: 100%"
                placeholder="小程序APPID"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in WxxcxAccountList"
                  :key="item.AppId"
                  :label="item.AppName"
                  :value="item.AppId"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                v-model="query.search.time"
                type="daterange"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()"
                >导&nbsp;&nbsp;出
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
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
              <el-input
                v-model="query.search.vip_cell"
                clearable
                placeholder="请输入会员手机"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.vip_name"
                clearable
                placeholder="请输入会员姓名"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.unionid"
                clearable
                placeholder="请输入UnionID"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column
        prop="AppName"
        align="center"
        label="小程序"
      ></el-table-column>
      <el-table-column
        prop="Openid"
        align="center"
        label="openid"
      ></el-table-column>
      <el-table-column
        prop="Unionid"
        align="center"
        label="Unionid"
      ></el-table-column>
      <el-table-column
        prop="Nickname"
        align="center"
        label="昵称"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="InTime"
        align="center"
        label="创建时间"
        width="160"
      ></el-table-column>
      <el-table-column align="center" label="会员姓名" width="120">
        <template #default="scope">
          <p>{{ scope.row.Vip.VipName }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员手机" width="140">
        <template #default="scope">
          <p>{{ scope.row.Vip.VipCell }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loginUser.UnitType == 1"
        align="center"
        label="最后访问券商"
        width="140"
      >
        <template #default="scope">
          <p v-if="scope.row.LastUnitName">{{ scope.row.LastUnitName }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员绑定时间" width="160">
        <template #default="scope">
          <p>{{ scope.row.VipBindTime }}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import { useStore } from "vuex";
import common from "@/utils/common.js";
import { SearchWxxcxFanses, GetAllAccount } from "../../api/wxxcx.js";
import { useFansExport } from "@/hooks/use-export.js";
const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    openid: "",
    unionid: "",
    appid: "",
    nickname: "",
    vip_name: "",
    vip_cell: "",
    in_date_begin: "",
    in_date_end: "",
    time: [],
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

const init = async () => {
  //一个月
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  query.search.time = [start, end];
};
init();
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  query.search.in_date_begin = "";
  query.search.in_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.in_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.in_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchWxxcxFanses({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }

    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
// 使用导出Hook
const { handleExport } = useFansExport();
const handleOut = () => {
  //导出
  handleExport(query, tableLoading);
};

////////////////////////////////////////////////////////////////
const WxxcxAccountList = ref([]); //小程序AppID下拉数据
const GetDictionaryDetailListApi = async () => {
  let res = await GetAllAccount({});
  if (res.Code == 200) {
    WxxcxAccountList.value = [];
    res.DataMap.forEach((row) => {
      if (row.Code != "current") {
        WxxcxAccountList.value.push(row);
      }
    });
  }
};
GetDictionaryDetailListApi();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "小程序粉丝") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "小程序粉丝"
    ) {
      handleSearch();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
////////////////////////////////////////////////////////////////
</script>

<style scoped></style>
