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
              <el-input v-model="query.search.vip_cell" clearable placeholder="请输入分销员手机">
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
              <el-input v-model="query.search.promoter_name_p1" clearable placeholder="请输入上级分销员姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.vip_cell_p1" clearable placeholder="请输入上级分销员手机">
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
          <el-col :span="6" :offset="1">

          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column prop="MallUnitName" align="center" label="商城">
      </el-table-column>
      <el-table-column prop="PromoterName" align="center" label="姓名">
      </el-table-column>
      <el-table-column prop="VipCell" align="center" label="手机">
      </el-table-column>

      <el-table-column prop="PromoterCode" label="分销码" align="center"></el-table-column>
      <el-table-column prop="InviteCode" label="邀请码" align="center"></el-table-column>
      <el-table-column prop="CreateTime" label="申请时间" align="center"></el-table-column>
      <el-table-column label="总佣金(元)" align="center">
        <template #default="scope">
          <p>{{ scope.row.TotalAmt / 100 }}</p>
        </template>
      </el-table-column>
      <el-table-column label="上级信息" align="left">
        <template #default="scope">
          <p v-if="scope.row.ParentPromoterName1">
            姓名：{{ scope.row.ParentPromoterName1 }}
          </p>
          <p v-if="scope.row.ParentVipCell1">
            手机：{{ scope.row.ParentVipCell1 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="loginUser.UnitId == scope.row.MallUnitId" class="button-op-del" size="small"
              @click="DelPromoter(scope.row.VipId, scope.row.MallUnitId)">删除分销员
            </el-button>
            <el-button v-if="loginUser.UnitId == scope.row.MallUnitId" class="button-op-del" size="small"
              @click="handleDel(scope.row.VipId, scope.row.MallUnitId,)">删除客户
            </el-button>
            <el-button class="button-op-edit" size="small"
              @click="handleEdit(scope.row.VipId, scope.row.MallUnitId, 'Edit')">客户
            </el-button>
            <el-button class="button-op-edit" size="small"
              @click="handleRecord(scope.row.VipId, scope.row.MallUnitId)">交易流水
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

    <!-- 分销员下的客户 -->
    <el-dialog class="dataTable-promoter" title="分销员下的客户" v-model="PromoterVisible" width="48%" :show-close="false">
      <el-table :data="PmoterData" height="300" border class="table" v-loading="PmoterDataLoading" ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column prop="VipName" align="center" label="姓名" width="160"></el-table-column>
        <el-table-column prop="VipCell" align="center" label="电话"></el-table-column>
        <el-table-column prop="BindTime" align="center" label="绑定时间" width="160"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <div class="button-mgl">
              <el-button class="button-op-del" size="small" v-if="loginUser.UnitId == scope.row.MallUnitId"
                @click="DelByVipBtn(scope.row.VipId, scope.row.MallUnitId)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="queryPromoter.PageStartRow" v-model:page-size="queryPromoter.PageRowCount"
          :page-sizes="[15, 50, 100]" :total="pagePmoterTotal" @current-change="PmoterPageChange"
          @size-change="PmoterSizeChange"></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="PromoterVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 交易流水 -->
    <record-components :visible="recordVisible" :vipId="recordObject.vipId" :mallUnitId="recordObject.mallUnitId"
      @CloseVisible="recordCloseVisible"></record-components>
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
import {
  SearchPromoters,
  SearchCustomersByPromoter,
} from "@/api/promoteApi.js";
import delDialog from "@/components/common/del_dialog.vue";
import recordComponents from "@/components/distribution/record.vue";
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
    mall_unit_id: "",
    vip_cell: "",
    time: [],
    create_date_begin: "",
    create_date_end: "",
    promoter_name_p1: "",//上级分销员姓名
    vip_cell_p1: "",//分销员手机
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
  query.search.create_date_begin = "";
  query.search.create_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.create_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.create_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  let res = await SearchPromoters({
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
////////////////////////////////////////////////////////////////////////////////////////////////
const PromoterVisible = ref(false);
const handleEdit = (val, mallId) => {
  queryPromoter.search.promoter_vip_id = val;
  queryPromoter.search.mall_unit_id = mallId;
  PromoterVisible.value = true;
  SearchCustomersByPromoterApi();
};
//交易流水
const recordVisible = ref(false);
const recordObject = reactive({
  vipId: "",
  mallUnitId: ""
})
const handleRecord = (vipId, mallUnitId) => {
  recordObject.vipId = vipId;
  recordObject.mallUnitId = mallUnitId;
  recordVisible.value = true;
}
const recordCloseVisible = () => {
  recordVisible.value = false;
}
const queryPromoter = reactive({
  search: {
    promoter_vip_id: "",
    mall_unit_id: "",

  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const PmoterDataLoading = ref(false);
const PmoterData = ref([]);
const pagePmoterTotal = ref(0);
// 分页导航
const PmoterPageChange = (val) => {
  queryPromoter.PageStartRow = val;
  SearchCustomersByPromoterApi();
};
const PmoterSizeChange = (val) => {
  queryPromoter.PageRowCount = val;
  SearchCustomersByPromoterApi();
};
const SearchCustomersByPromoterApi = async () => {
  PmoterDataLoading.value = true;
  let res = await SearchCustomersByPromoter({
    PageStartRow: (queryPromoter.PageStartRow - 1) * queryPromoter.PageRowCount,
    PageRowCount: queryPromoter.PageRowCount,
    SearchCondition: queryPromoter.search,
  });
  PmoterDataLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      PmoterData.value = res.DataMap.Data;
    } else {
      PmoterData.value = [];
    }
    pagePmoterTotal.value = res.DataMap.ToalCount;
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
const VipS = ref([]);
const DelVisible = ref(false);
const TextareaRemark = ref(false);
const DelType = ref("");

const DelPromoter = async (ID, MallId) => {
  VipS.value = [];
  VipS.value.push({
    vip: ID,
    mallId: MallId
  });
  TextareaRemark.value = "";
  DelVisible.value = true;
  DelType.value = 1; //直接删除分销员
};
const RefreshData = (val) => {
  if (val == 2) {
    queryPromoter.PageStartRow = 1;
    SearchCustomersByPromoterApi();
  } else {
    //列表刷新
    handleSearch();
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
//删除分销员下的客户
const DelByVipBtn = async (ID, MallId) => {
  VipS.value = [];
  VipS.value.push({
    vip: ID,
    mallId: MallId
  });
  TextareaRemark.value = "";
  DelVisible.value = true;
  DelType.value = 2; //直接删除分销员下的客户
};

////////////////////////////////////////////////////////////////////////////////////////////////
//强制删除某个分销员下的所有客户
const handleDel = (ID, MallId) => {
  VipS.value = [];
  VipS.value.push({
    vip: ID,
    mallId: MallId
  });
  TextareaRemark.value = "";
  DelVisible.value = true;
  DelType.value = 3; //
};

const CloseVisible = (isBoolean) => {
  DelVisible.value = isBoolean;
};
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
SearchMyMallsApi();
////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    if (data.meta.title == "券商分销员" || data.meta.title == "分销员") {
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
