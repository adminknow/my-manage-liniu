<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.promoter_name" clearable placeholder="请输入分销员姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.promoter_vip_cell" clearable placeholder="请输入分销员手机">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker style="width: 100%" v-model="query.search.time" type="daterange" :shortcuts="shortcuts"
                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="false" class="button2 button-float" round @click="BatchDel()">
                <el-icon>
                  <Delete />
                </el-icon>
                &nbsp;&nbsp;批量删除&nbsp;&nbsp;
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.vip_name" clearable placeholder="请输入客户姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.vip_cell" clearable placeholder="请输入客户手机">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable filterable v-model="query.search.mall_unit_id" placeholder="请选择商城"
                style="width:100%">
                <el-option v-for="item in mallsUnitArr" :key="item.MallUnitId" :label="item.MallUnit.UnitName"
                  :value="item.MallUnitId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1"> </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column prop="MallUnitName" align="center" label="商城">
      </el-table-column>
      <el-table-column prop="PromoterName" align="center" label="分销员">
      </el-table-column>
      <el-table-column prop="PromoterVipCell" align="center" label="分销员手机">
      </el-table-column>
      <el-table-column prop="VipName" align="center" label="客户">
      </el-table-column>
      <el-table-column prop="VipCell" align="center" label="客户手机">
      </el-table-column>
      <el-table-column prop="BindTime" label="绑定时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small" @click="handleHis(scope.row.VipId, scope.row.MallUnitId)">历史
            </el-button>
            <el-button v-if="loginUser.UnitId == scope.row.MallUnitId" class="button-op-del" size="small"
              @click="delBtn(scope.row.VipId, scope.row.MallUnitId)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>

    <!-- 分销员绑定历史 -->
    <el-dialog class="dataTable-promoter" title="分销员下的客户" v-model="HisVisible" width="48%" :show-close="false">
      <el-table :data="HisData.slice(
        (query_HisList.PageStartRow - 1) * query_HisList.PageRowCount,
        query_HisList.PageStartRow * query_HisList.PageRowCount
      )
        " height="300" border class="table" v-loading="HisDataLoading" ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column prop="FromPromoterName" align="center" label="姓名" width="100"></el-table-column>
        <el-table-column prop="FromPromoterVipCell" align="center" label="电话" width="120"></el-table-column>
        <el-table-column prop="OpTime" align="center" label="时间" width="160"></el-table-column>
        <el-table-column prop="OpDesc" align="center" label="操作"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="query_HisList.PageStartRow" v-model:page-size="query_HisList.PageRowCount"
          :page-sizes="[15, 50, 100]" :total="pageHisTotal" @current-change="HisPageChange"
          @size-change="HisSizeChange"></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="HisVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 操作删除组件 -->
    <delDialog ref="editor" :IDs="VipS" :OpType="DelType" :BillType="'fx'" :Visible="DelVisible"
      @RefreshData="RefreshData" @CloseVisible="CloseVisible">
    </delDialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchMyMalls } from "@/api/index.js";
import delDialog from "@/components/common/del_dialog.vue";
import {
  SearchPromoterCustomers,
  GetPromoterBindHisList,
} from "@/api/promoteApi.js";
////////////////////////////////////////////////////////////////////////////////////////////////
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
];
////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    promoter_name: "",
    promoter_vip_cell: "",
    vip_name: "",
    vip_cell: "",
    time: [],
    bind_date_begin: "",
    bind_date_end: "",
    mall_unit_id: "",
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
  query.search.bind_date_begin = "";
  query.search.bind_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.bind_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.bind_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchPromoterCustomers({
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
////////////////////////////////////////////////////////////////////////////////////////////////
const handleHis = (val, mallId) => {
  query_HisList.search.VipId = val;
  query_HisList.search.MallUnitId = mallId;
  HisVisible.value = true;
  GetPromoterBindHisListApi();
};
//绑定历史
const query_HisList = reactive({
  search: {
    VipId: "",
    MallUnitId:"",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const HisVisible = ref(false);
const HisDataLoading = ref(false);
const HisData = ref([]);
const pageHisTotal = ref(0);
const GetPromoterBindHisListApi = async () => {
  let res = await GetPromoterBindHisList({
    VipId: query_HisList.search.VipId,
    MallUnitId:query_HisList.search.MallUnitId,
  });
  if (res.Code == 200) {
    HisData.value = res.DataMap ? res.DataMap : [];
    pageHisTotal.value = res.DataMap.length;
  }
};
const HisPageChange = (val) => {
  query_HisList.PageStartRow = val;
};
const HisSizeChange = (val) => {
  query_HisList.PageRowCount = val;
};
////////////////////////////////////////////////////////////////////////////////////////////////
const VipS = ref([]);
const DelVisible = ref(false);
const TextareaRemark = ref(false);
const DelType = ref("");
const BatchDel = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  VipS.value = [];
  multipleSelection.value.forEach((row) => {
    VipS.value.push(row.VipId);
  });
  TextareaRemark.value = "";
  DelVisible.value = true;
  DelType.value = 2; //
};

//强制删除某个分销员下的所有客户
const delBtn = (ID, MallUnitId) => {
  VipS.value = [];
  VipS.value.push({
    vip: ID,
    mallId: MallUnitId
  });
  TextareaRemark.value = "";
  DelVisible.value = true;
  DelType.value = 2; //
};

const RefreshData = (val) => {
  handleSearch();
};
const CloseVisible = (isBoolean) => {
  DelVisible.value = isBoolean;
};
////////////////////////////////////////////////////////////////////////////////////////////////
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
////////////////////////////////////////////////////////////////////////////////////////////////
const mallsUnitArr = ref([]);
const SearchMyMallsApi = async () => {
  let res = await SearchMyMalls({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
    SearchCondition: {
      apply_status: 10,//状态
    },
  })
  if (res.Code == 200) {
    mallsUnitArr.value = res.DataMap.Data;
  }
}

/////////////////////////////////////////////////////////////////////////////////
const loginUser = JSON.parse(Cookie.get("User"));
const init = async () => {
  SearchMyMallsApi();
  getData();

};
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    if (data.meta.title == "券商客户关系" || data.meta.title == "客户关系") {
      query.PageStartRow = 1;

      getData();
    }
  }
);
</script>

<style scoped>
::v-deep(.dataTable-promoter .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
