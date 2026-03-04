<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入编码/标题/条形码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.goods_status" placeholder="请选择状态">
                <el-option label="全部" value=""> </el-option>
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select v-model="query.search.create_unit_id" filterable remote reserve-keyword placeholder="请输入券商名称"
                :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading" style="width: 100%" clearable>
                <el-option v-for="(item, index) in UnitData" :key="index" :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleAdd()">
                添加商品
              </el-button>
              <el-button class="button2 button-float" round @click="handleOut()">
                导&nbsp;&nbsp;出
              </el-button>
              <el-button class="button2 button-float" round @click="FileModal()">
                批量导入
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column prop="GoodsTypeDesc" label="类型" align="center" width="100"></el-table-column>
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column prop="GoodsCode" align="center" label="商品编码" width="100"></el-table-column>
      <el-table-column prop="GoodsTitle" align="center" label="标题">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.GoodsId, 'View')" style="color: #f56c6c">
            {{ scope.row.GoodsTitle }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="OrgPrice" align="center" label="价格(元)" width="80">
        <template #default="scope">
          {{ (scope.row.OrgPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="GoodsBarcode" label="条形码" align="center" width="100"></el-table-column>
      <el-table-column v-if="IsInventory == 1 || IsInventory1 == 1" align="center" label="库存" width="100">
        <template #default="scope">
          <p v-if="IsInventory == 1 && scope.row.TotalQty2 > 0">
            线下：{{ scope.row.TotalQty2 }}
          </p>
          <p v-if="IsInventory1 == 1 && scope.row.TotalQty > 0">
            线上：{{ scope.row.TotalQty }}
          </p>
        </template></el-table-column>
      <el-table-column label="品牌" prop="BrandName" align="center" width="100">
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="160">
        <template #default="scope">
          <div v-if="loginUser.UnitName == '礼牛网'">
            <p>{{ scope.row.CreateUnitName }}</p>
            <p>{{ scope.row.CreateTime }}</p>
          </div>
          <div v-else>
            <p>{{ scope.row.CreateUserName }}</p>
            <p>{{ scope.row.CreateTime }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId && IsRight" class="button-op-edit" size="small"
              @click="handleEdit(scope.row.GoodsId, 'Edit')">编辑
            </el-button>
            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              scope.row.GoodsStatus == 1 &&
              IsRight
            " class="button-op-del" size="small" @click="handleDisable(scope.row.GoodsId)">停用
            </el-button>
            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              scope.row.GoodsStatus == 0 &&
              IsRight
            " class="button-op-enable" size="small" @click="handleEnable(scope.row.GoodsId)">启用
            </el-button>
            <el-button v-if="scope.row.DiffExchangeTemplateName && IsRight" class="button-op-del" size="small"
              @click="handleDel(scope.row.GoodsId)">删除差异商品
            </el-button>

            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              scope.row.GoodsTypeDesc != '组合装商品'
            " class="button-op-edit" size="small" @click="handleGoods(scope.row.GoodsId, scope.$index)">绑定的组合装商品
            </el-button>
            <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId" class="button-op-edit" size="small"
              @click="handleTickets(scope.row.GoodsId, scope.$index)">绑定的卡券
            </el-button>
            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              scope.row.GoodsTypeDesc != '组合装商品' &&
              scope.row.GoodsProperties.length > 0
            " class="button-op-view" size="small" @click="handleSKU(scope.row.GoodsId)">规格
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
    <!-- 商品组 -->
    <el-dialog :title="GoodTitleModal" v-model="goodVisible" width="60%" :show-close="false">
      <el-table :data="tableGoodData" border class="table" v-loading="goodTableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
        <el-table-column prop="GoodsTypeDesc" align="center" label="类型"></el-table-column>
        <el-table-column prop="GoodsCode" align="center" label="编码"></el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="标题" width="260">
          <template #default="scope">
            <el-link :underline="false" @click="handleEdit(scope.row.GoodsId, 'View')" style="color: #f56c6c">
              {{ scope.row.GoodsTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="GoodsSubTitle" align="center" label="副标题"></el-table-column>
        <el-table-column prop="OrgPrice" align="center" label="价格(元)">
          <template #default="scope">
            {{ (scope.row.OrgPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="GoodsBarcode" label="条形码" align="center"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="goodVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 卡券组 -->
    <el-dialog :title="TicketTitleModal" v-model="ticketVisible" width="48%" :show-close="false">
      <el-table :data="tableTicketData" border class="table" v-loading="ticketTableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
        <el-table-column prop="TicketTemplateTypeDesc2" align="center" label="类型"></el-table-column>
        <el-table-column prop="TicketTemplateCode" align="center" label="批次号"></el-table-column>
        <el-table-column prop="TicketTemplateTitle" align="center" label="名称" width="260">
          <template #default="scope">
            <el-link :underline="false" @click="handleTicketEdit(scope.row.TicketTemplateId)" style="color: #f56c6c">
              {{ scope.row.TicketTemplateTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="OrgPrice" align="center" label="面值(元)">
          <template #default="scope">
            {{ (scope.row.OrgPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="ticketVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件导入弹出框 -->
    <el-dialog title="导入文件" v-model="fileVisible" width="38%" :show-close="false" :close-on-click-modal="false">
      <div class="file-detail" style="height: 100px">
        <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
          class="file-category-uploader" action="#" :http-request="SuccessFile" :auto-upload="true">
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link :underline="false"
                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/批量导入兑换商品.xlsx"
                style="color: #f56c6c">
                下载模板</el-link>
            </div>
            <div class="el-upload__tip">支持上传excel文件</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="CennelFileModalBtn">关 闭</el-button>
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
import { Import } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import { HasRightes, GetUnitConfigs, SearchUnites } from "@/api/index.js";
import {
  SearchGoodses,
  EnableGoods,
  DisableGoods,
  GetBindGoodsList,
  CancelGoodsExchangeTemplate,
} from "@/api/goods.js";
import { GetTicketTemplateListByExchangeGoods } from "../../api/ticket.js";

const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    goods_status: "",
    create_unit_id: "",
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
  let res = await SearchGoodses({
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
//新增商品
const handleAdd = () => {
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: {
      Type: "Add",
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
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
//编辑
const handleTicketEdit = (ID) => {
  common.ClosePageTag("卡券详情");
  router.push({
    path: "/ticket_batch_info",
    query: {
      Type: "View",
      ID: ID,
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
    let res = await DisableGoods({
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
    let res = await EnableGoods({
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
//删除
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要删除差异商品吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await CancelGoodsExchangeTemplate({
        ObjectId: ID,
      });
      if (res.Code == 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => { });
};
const goodTableLoading = ref(false);
const goodVisible = ref(false);
const tableGoodData = ref([]);
const GoodTitleModal = ref("");
//查看商品组
const handleGoods = async (ID, Index) => {
  goodTableLoading.value = true;
  let res = await GetBindGoodsList({
    ObjectId: ID,
  });
  goodTableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.length > 0) {
      GoodTitleModal.value =
        tableData.value[Index].GoodsTitle + " - 绑定的组合装商品";
      goodVisible.value = true;
      tableGoodData.value = res.DataMap;
    } else {
      ElMessage.info("当前暂无数据");
    }
  } else {
    ElMessage.error(res.Message);
  }
};
const ticketTableLoading = ref(false);
const ticketVisible = ref(false);
const tableTicketData = ref([]);
const TicketTitleModal = ref("");
//查看卡券组
const handleTickets = async (ID, Index) => {
  ticketTableLoading.value = true;
  let res = await GetTicketTemplateListByExchangeGoods({
    ObjectId: ID,
  });
  ticketTableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.length > 0) {
      TicketTitleModal.value =
        tableData.value[Index].GoodsTitle + " - 绑定的卡券";
      ticketVisible.value = true;
      tableTicketData.value = res.DataMap;
    } else {
      ElMessage.info("当前暂无数据");
    }
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
      let res = await SearchGoodses({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: query.search,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        tableData.value = res.DataMap.Data;
        var myDate = new Date();
        myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var time =
          myDate.getFullYear() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          myDate.getDate();

        import("../../vendor/Export2Excel").then((excel) => {
          res.DataMap.Data.forEach((row) => {
            row.OrgPriceDesc = row.OrgPrice / 100;
            if (row.GoodsStatus == 1) {
              row.GoodsStatusDesc = "正常";
            } else {
              row.GoodsStatusDesc = "停用";
            }
            row.GoodsProperties.forEach((sku, SkuIndex) => {
              if (SkuIndex == 0) {
                row.GoodsPropertiesDesc = sku.Name;
              } else {
                row.GoodsPropertiesDesc =
                  row.GoodsPropertiesDesc + "," + sku.Name;
              }
            });
          });
          const tHeader = [
            "类型",
            "编码",
            "标题",
            "副标题",
            "价格(元)",
            "规格属性",
            "规格数量",
            "条形码",
            "品牌",
            "状态",
            "创建单位",
            "创建人",
            "创建时间",
            "商品名称",
          ];

          const filterVal = [
            "GoodsTypeDesc",
            "GoodsCode",
            "GoodsTitle",
            "GoodsSubTitle",
            "OrgPriceDesc",
            "GoodsPropertiesDesc",
            "SkuCount",
            "GoodsBarcode",
            "BrandName",
            "GoodsStatusDesc",
            "CreateUnitName",
            "CreateUserName",
            "CreateTime",
            "ListImg",
          ];
          if (IsInventory.value == 1) {
            tHeader.push("库存(线下)");
            filterVal.push("TotalQty2");
          }
          if (IsInventory1.value == 1) {
            tHeader.push("库存(线上)");
            filterVal.push("TotalQty");
          }
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "商品列表数据导出" + time,
            autoWidth: true,
          });
        });
      }
    })
    .catch(() => { });
};
const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
////////////////////////////////////////////////////////////////
//跳转到sku明细
const handleSKU = async (ID) => {
  common.ClosePageTag("规格");
  router.push({
    path: "/sku",
    query: {
      ID: ID,
      type: "private",//我的商品
    },
  });
};
//是否有取消权限
const IsRight = ref("");
const BoolRight = async () => {
  let arr = ["edit_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goods;
  }
};
BoolRight();
////////////////////////////////////////////////////////////////
//获取当前券商是否线下库存
const IsInventory = ref(""); //是否校验商品的库存线下(1:是)
const IsInventory1 = ref(""); //是否校验商品的库存线上(1:是)
const GetUnitConfigsApi = async () => {
  let res = await GetUnitConfigs({
    ObjectId: loginUser.UnitId,
  });
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      if (row.ConfigKey == "check.goods.stock.when.exchange.in.shop") {
        IsInventory.value = row.ConfigValue;
      }
      if (row.ConfigKey == "check.goods.stock.when.exchange.online") {
        IsInventory1.value = row.ConfigValue;
      }
    });
  }
};
GetUnitConfigsApi();
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
//文件导入
const FileModal = () => {
  fileVisible.value = true;
};
const fileVisible = ref(false);
const fileList = ref([]);
const fileParam = ref([]);
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
    } 个文件`
  );
};
const handleRemove = async (param) => {
  fileParam.value = {};
};
const SuccessFile = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  fd.append("DataType", "ExchangeGoods"); //传文件
  let res = await Import(fd);
  if (res.Code == 200) {
    ElMessage.success("导入成功");
    fileVisible.value = false;
    fileList.value = [];
    getData();
  } else {
    ElMessage.warning(res.Message);
    fileList.value = [];
  }
};
const CennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};
/////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "兑换商品") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "兑换商品"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style>
.file-category-uploader {
  width: 150px;
  height: 40px;
}

.file-category-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.file-category-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
