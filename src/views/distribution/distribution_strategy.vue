<template>
  <div class="container">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="分销配置" name="first">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
          <el-row>
            <el-col :span="23">
              <el-form-item label="商城">
                <el-select filterable v-model="form.MallUnitId" placeholder="请选择商城" style="width:15%" @change="changeMall">
                  <el-option v-for="item in MallUnitList" :key="item.MallUnitId" :label="item.MallUnit.UnitName"
                    :value="item.MallUnitId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="是否开启分销">
                <el-radio-group v-model="form.IsPromote">
                  <el-radio-button label="0">否</el-radio-button>
                  <el-radio-button label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.IsPromote == 1">
            <el-col :span="23">
              <el-form-item label="分销类型">
                <el-radio-group v-model="form.PromoteType">
                  <el-radio-button label="0">所有商品都参加</el-radio-button>
                  <el-radio-button label="1">指定商品参加</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.IsPromote == 1 && form.PromoteType == 0">
            <el-col :span="23">
              <el-form-item label="缺省的返还类型">
                <el-radio-group v-model="form.DefaultReturnType">
                  <el-radio-button label="0">按售价的比例</el-radio-button>
                  <el-radio-button label="1">按固定金额</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="
            form.DefaultReturnType == 0 &&
            form.IsPromote == 1 &&
            form.PromoteType == 0
          ">
            <el-col :span="8">
              <el-form-item label="按售价返还">
                <el-input v-model="form.DefaultReturnRate">
                  <template #append>(%)</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="
            form.DefaultReturnType == 1 &&
            form.IsPromote == 1 &&
            form.PromoteType == 0
          ">
            <el-col :span="8">
              <el-form-item label="按固定金额返还">
                <el-input v-model="form.DefaultReturnAmt">
                  <template #append>(元)</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.IsPromote == 1">
            <el-col :span="8">
              <el-form-item label="结束时间">
                <el-date-picker :default-time="defaultTime" style="width: 100%" v-model="form.EndTime" type="datetime"
                  placeholder="请选择结束时间" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="loginUser.UnitType == 2">
            <el-button class="button1" round :loading="btnLoading" @click="onSubmit">
              &nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="指定的分销商品" name="two" v-if="form.PromoteType == 1">
        <div class="handle-box" style="padding-top: 0">
          <el-form label-width="1px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="">
                  <el-input v-model="query.search.search_keyword" clearable placeholder="请输入编码/标题"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1"> </el-col>
              <el-col :span="6" :offset="1">
                <div class="button-mgl">
                  <el-button class="button2 button-float" round @click="handleDelS()">
                    &nbsp;&nbsp;批量删除&nbsp;&nbsp;
                  </el-button>
                  <el-button class="button2 button-float" round @click="handleAdd()">
                    <el-icon>
                      <Plus />
                    </el-icon>&nbsp;&nbsp;添加商品
                  </el-button>
                  <el-button class="button1 button-float" round @click="handleSearch()">
                    <el-icon>
                      <Search />
                    </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-table :data="tableData" @selection-change="multipleChooseGoodsID" border class="table"
          v-loading="tableLoading" ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }"
          header-cell-class-name="table-header" style="width: 100%">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="GoodsCode" align="center" label="编码"></el-table-column>
          <el-table-column prop="GoodsTitle" align="center" label="标题"></el-table-column>
          <el-table-column label="返还类型" align="center">
            <template #default="scope">
              {{ scope.row.ReturnType === 0 ? "按售价的比例" : "按固定金额" }}
            </template>
          </el-table-column>
          <el-table-column label="按售价返还比例(%)" align="center">
            <template #default="scope">
              <p v-if="scope.row.ReturnRate > 0">{{ scope.row.ReturnRate }}</p>
            </template>
          </el-table-column>
          <el-table-column label="固定返还金额(元)" align="center">
            <template #default="scope">
              <p v-if="scope.row.ReturnAmt > 0">
                {{ scope.row.ReturnAmt / 100 }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template #default="scope">
              {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template #default="scope">
              <div class="button-mgl">
                <el-button class="button-op-edit" size="small" @click="handleDel(scope.row.GoodsId)">删除
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
      </el-tab-pane>
    </el-tabs>
    <!-- 可销售商品列表 -->
    <el-dialog class="sell-top" title="可销售商品列表" v-model="ComponentsGoodVisible" width="60%" :show-close="false">
      <div class="handle-box">
        <el-form label-width="1px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="">
                <el-input v-model="queryGoods.search.search_keyword" clearable placeholder="请输入编码/名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1"> </el-col>
            <el-col :span="6" :offset="1">
              <div class="button-mgl">
                <el-button class="button1 button-float" round @click="handleGoodsSearch()">
                  <el-icon>
                    <Search />
                  </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="缺省的返还类型">
            <el-radio-group v-model="ReturnType">
              <el-radio-button label="0">按售价的比例</el-radio-button>
              <el-radio-button label="1">按固定金额</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="按售价返还" v-if="ReturnType == 0">
            <el-input style="width: 60%" v-model="ReturnRate">
              <template #append>(%)</template></el-input>
          </el-form-item>
          <el-form-item label="按固定金额返还" v-if="ReturnType == 1">
            <el-input style="width: 60%" v-model="ReturnAmt">
              <template #append>(元)</template></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table height="300" @selection-change="multipleCheckTable" :data="tableGoodsData" border class="table"
        v-loading="tableGoodsLoading" ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header" style="width: 100%">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="GoodsCode" align="center" label="编码"></el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="名称">
          <template #default="scope">
            <el-link :underline="false" @click="handleEdit(scope.row.GoodsId, 'View')" style="color: #f56c6c">
              {{ scope.row.GoodsTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="原价(元)">
          <template #default="scope">
            {{ (scope.row.OrgPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="UnitStatusDesc" label="状态" align="center">
          <template #default="scope">
            {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="queryGoods.PageStartRow" v-model:page-size="queryGoods.PageRowCount"
          :page-sizes="[50, 100]" :total="pageGoodsTotal" @current-change="handleGoodsPageChange"
          @size-change="handleGoodsSizeChange"></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="btnGoodsLoading" @click="SaveTable">
            保 存
          </el-button>
          <el-button class="button2" @click="ComponentsGoodVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import {
  GetPromoteUnit,
  SavePromoteUnit,
  SearchUnitPromoteGoodses,
  BatchAddUnitPromoteGoods,
  BatchDeleteUnitPromoteGoods,
} from "@/api/promoteApi.js";
import { SearchMyMalls, IsMallOpen } from "@/api/index.js";
import { SearchMySellGoodses } from "@/api/goods.js";
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    mall_unit_id: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
let form = reactive({
  UnitId: "",
  IsPromote: "0",
  PromoteType: "0", //分销类型(0:所有商品都参加;1:指定商品参加)
  DefaultReturnType: "0", //缺省的返还类型(0:按售价的比例;1:按固定金额)
  DefaultReturnRate: "", //缺省的按售价的比例返还(%)
  DefaultReturnAmt: "", //缺省的固定金额返还(分)
  EndTime: "", //当前返还配置的结束时间
  PromoteGoodses: [], //指定的分销商品的分销配置
  MallUnitId: "",
});
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  query.search.mall_unit_id = form.MallUnitId;
  let res = await SearchUnitPromoteGoodses({
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
////////////////////////////////////////////////////////////////
const ComponentsGoodVisible = ref(false);

const multipleTableData = ref([]);
const formRef = ref(null);
const btnLoading = ref(false);
const activeName = ref("first");

const rules = {};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let promoteUnitValue = JSON.parse(JSON.stringify(form));
      promoteUnitValue.DefaultReturnAmt = promoteUnitValue.DefaultReturnAmt * 100;
      if (promoteUnitValue.EndTime == "" && promoteUnitValue.IsPromote == '1') {
        ElMessage.error("请选择结束时间");
        return;
      }
      promoteUnitValue.EndTime = common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        promoteUnitValue.EndTime
      );
      btnLoading.value = true;
      promoteUnitValue.MallUnitId = form.MallUnitId
      let res = await SavePromoteUnit({
        PromoteUnit: promoteUnitValue,
        UnitId: loginUser.UnitId
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("保存成功");
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};

const changeMall=(val)=>{
GetPromoteUnitApi(val);
}
const GetPromoteUnitApi = async (Id) => {
  let res = await GetPromoteUnit({
    MallUnitId: Id,
  });
  if (res.Code == 200 && res.DataMap) {
    //当前券商是否配置了分销策略（0为没有开启，1为开启）
    form.IsPromote = res.DataMap.IsPromote;
    form.PromoteType = res.DataMap.PromoteType, toString();
    form.DefaultReturnType = res.DataMap.DefaultReturnType, toString();
    form.DefaultReturnRate = res.DataMap.DefaultReturnRate;
    form.DefaultReturnAmt = res.DataMap.DefaultReturnAmt / 100;
    form.EndTime = res.DataMap.EndTime;
    form.PromoteGoodses = res.DataMap.PromoteGoodses;
  }
};

//保存选中的商品
const btnGoodsLoading = ref(false);
const SaveTable = async () => {
  if (ReturnType.value == "") {
    ElMessage.error("缺省的返还类型");
    return;
  }
  if (ReturnType.value == "1") {
    if (ReturnAmt.value == "") {
      ElMessage.error("请输入金额");
      return;
    }
  }
  if (ReturnType.value == "0") {
    if (ReturnRate.value == "") {
      ElMessage.error("请输入比例");
      return;
    }
  }
  if (multipleTableData.value.length == 0) {
    ElMessage.error("请先勾选商品");
    return;
  }
  multipleTableData.value.forEach((row) => {
    row.ReturnType = ReturnType.value;
    row.ReturnRate = ReturnRate.value;
    row.ReturnAmt = ReturnAmt.value * 100;
    row.UnitId = row.CreateUnitId;
  });
  btnGoodsLoading.value = true;

  let res = await BatchAddUnitPromoteGoods({
    ClearAll: false,
    PromoteGoodses: multipleTableData.value,
    MallUnitId: form.MallUnitId,
  });
  btnGoodsLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("保存成功！");
    ComponentsGoodVisible.value = false;
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};

const multipleCheckTable = (val) => {
  multipleTableData.value = val;
};
const multipleGoodsTableData = ref([]);
const multipleChooseGoodsID = (val) => {
  multipleGoodsTableData.value = val;
};

const handleAdd = async () => {
  ComponentsGoodVisible.value = true;
  ReturnType.value = "";
  ReturnRate.value = "";
  ReturnAmt.value = "";
  getGoodsData();
};

////////////////////////////////////////////////////////////////
const handleDelS = async () => {
  if (multipleGoodsTableData.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let GoodsIds = [];
      multipleGoodsTableData.value.forEach((row) => {
        GoodsIds.push(row.GoodsId);
      });
      let res = await BatchDeleteUnitPromoteGoods({
        GoodsIds: GoodsIds,
        ClearAll: false,
      });
      if (res.Code == 200) {
        ElMessage.success("操作成功");
        handleSearch();
      } else {
        ElMessage.error(res.Message);
      }
    })
    .catch(() => { });
};
const handleDel = async (ID) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await BatchDeleteUnitPromoteGoods({
        GoodsIds: [ID],
        ClearAll: false,
      });
      if (res.Code == 200) {
        ElMessage.success("操作成功");
        handleSearch();
      } else {
        ElMessage.error(res.Message);
      }
    })
    .catch(() => { });
};

const defaultTime = new Date(2000, 1, 1, 23, 59, 59);
////////////////////////////////////////////////////////////////
//下拉选择商城
const isMall = ref(false);
const IsMallOpenAPi = async () => {
  let res = await IsMallOpen({
    ObjectId: loginUser.UnitId,
  });
  if (res.Code == 200) {
    isMall.value = res.DataMap;
  } else {
    ElMessage.error(res.Message);
  }
}

const MallUnitList = ref([]);
const GetMallUnitListApi = async () => {
  let res = await SearchMyMalls({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
    SearchCondition: {
      apply_status: 10,//状态
    },
  })
  if (res.Code == 200) {
    MallUnitList.value = res.DataMap.Data;
    if (res.DataMap.Data.length > 0) {
      form.MallUnitId = MallUnitList.value[0].MallUnitId;
      //首先判断当前人登陆进来 是否含有说商城，
      for (let i = 0; i < MallUnitList.value.length; i++) {
        const row = MallUnitList.value[i];
        if (loginUser.UnitId == row.MallUnitId) {
          form.MallUnitId = row.MallUnitId;
          break;
        }
      }
    } else {
      form.UnitId = "";
    }
  }
}
////////////////////////////////////////////////////////////////
const init = async () => {
  GetMallUnitListApi();
  const loginUser = JSON.parse(Cookie.get("User"));
  form.UnitId = loginUser.UnitId;
  GetPromoteUnitApi(loginUser.UnitId);
  getData();
};
////////////////////////////////////////////////////////////////
const queryGoods = reactive({
  search: {
    search_keyword: "",
    goods_status: 1,

  },
  PageStartRow: 1,
  PageRowCount: 50,
});
const tableGoodsLoading = ref(false);
const tableGoodsData = ref([]);
const pageGoodsTotal = ref(0);

// 获取表格数据
const getGoodsData = async () => {
  tableLoading.value = true;
  let res = await SearchMySellGoodses({
    PageStartRow: (queryGoods.PageStartRow - 1) * queryGoods.PageRowCount,
    PageRowCount: queryGoods.PageRowCount,
    SearchCondition: queryGoods.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableGoodsData.value = res.DataMap.Data;
    } else {
      tableGoodsData.value = [];
    }
    pageGoodsTotal.value = res.DataMap.ToalCount;
  }
};
// 查询操作
const handleGoodsSearch = () => {
  queryGoods.PageStartRow = 1;
  getGoodsData();
};
// 分页导航
const handleGoodsPageChange = (val) => {
  queryGoods.PageStartRow = val;
  getGoodsData();
};
const handleGoodsSizeChange = (val) => {
  queryGoods.PageRowCount = val;
  getGoodsData();
};
////////////////////////////////////////////////////////////////
const ReturnType = ref(""); //返回类型
const ReturnRate = ref(""); //比例
const ReturnAmt = ref(""); //金额

////////////////////////////////////////////////////////////////
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    //监听页面切换的时候
    if (data.meta.title == "券商分销策略" || data.meta.title == "分销策略") {
      GetPromoteUnitApi(loginUser.UnitId);
      getData();
    }
  }
);
</script>

<style scoped>
::v-deep(.sell-top .el-dialog__body) {
  padding-top: 0 !important;
}
</style>
