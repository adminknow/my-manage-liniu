<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.ad_title"
                clearable
                placeholder="请输入标题"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.create_unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入券商名称"
                :remote-method="remoteMethod"
                remote-show-suffix
                :loading="SelLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in UnitData"
                  :key="index"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                v-if="IsEditAd"
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增广告
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
      <el-table-column prop="AdTitle" align="center" label="标题">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.AdId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.AdTitle }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="AdSubTitle" align="center" label="副标题">
      </el-table-column>
      <el-table-column
        prop="AdTypeDesc"
        label="类型"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="DisplayPositionDesc"
        label="位置"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="AdJumpTypeDesc"
        label="跳转类型"
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column label="是否显示首页" align="center" width="110">
        <template #default="scope">
          <img
            v-if="scope.row.IsShow"
            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/show.png"
            style="width: 20px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="UnitStatusDesc"
        label="状态"
        align="center"
        width="80"
      >
        <template #default="scope">
          {{ scope.row.AdStatus === 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="显示时间" align="left" width="250">
        <template #default="scope">
          <p>开始时间：{{ scope.row.BeginTime }}</p>
          <p>结束时间：{{ scope.row.EndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="180">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="loginUser.UnitId == scope.row.CreateUnitId && IsEditAd"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.AdId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="
                loginUser.UnitId == scope.row.CreateUnitId &&
                scope.row.AdStatus == 1 &&
                IsEditAd
              "
              class="button-op-del"
              size="small"
              @click="handleDisable(scope.row.AdId)"
              >停用
            </el-button>
            <el-button
              v-if="
                loginUser.UnitId == scope.row.CreateUnitId &&
                scope.row.AdStatus == 0 &&
                IsEditAd
              "
              class="button-op-enable"
              size="small"
              @click="handleEnable(scope.row.AdId)"
              >启用
            </el-button>
          </div>
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
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchAds, EnableAd, DisableAd } from "../../api/shopApi.js";
import { SearchUnites, HasRightes } from "@/api/index.js";
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    ad_title: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const adType = ref("");

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchAds({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    tableData.value.forEach((row) => {
      let JSONValue = JSON.parse(row.AdGoConfig);
      row.AdJumpType = JSONValue.AdJumpType;
      if (row.AdJumpType == 1) {
        row.AdJumpTypeDesc = "H5";
      }
      if (row.AdJumpType == 2) {
        row.AdJumpTypeDesc = "小程序";
      }
      if (row.AdJumpType == 3) {
        row.AdJumpTypeDesc = "不跳转";
      }
    });
    pageTotal.value = res.DataMap.ToalCount;
  }
};
if (router.currentRoute.value.query.adType) {
  adType.value = router.currentRoute.value.query.adType;
  query.PageStartRow = 1;
  getData();
}

const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//新增商品
const handleAdd = () => {
  common.ClosePageTag("广告详情");
  router.push({
    path: "/Ad_list_info",
    query: {
      Type: "Add",
      adType: adType.value,
    },
  });
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
//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("广告详情");
  router.push({
    path: "/Ad_list_info",
    query: {
      Type: type,
      ID: ID,
      adType: adType.value,
    },
  });
};
//停用
const handleDisable = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableAd({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableAd({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
//券商
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
/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const IsEditAd = ref(false);
const BoolRight = async () => {
  let arr = ["edit_ad"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsEditAd.value = res.DataMap.edit_ad;
  }
};
BoolRight();
////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "广告列表") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "广告列表"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    } else if (data.query.adType) {
      adType.value=data.query.adType;
      query.PageStartRow = 1;
      getData();
    }
  }
);
</script>

<style scoped></style>
