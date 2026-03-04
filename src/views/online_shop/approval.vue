<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入编码/名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                style="width: 100%"
                v-model="query.search.mall_status"
                placeholder="请选择状态"
              >
                <el-option label="全部" value="0,10"> </el-option>
                <el-option label="待审核" value="0"> </el-option>
                <el-option label="上架中" value="10"> </el-option>
                <el-option label="未上架" value="-1"> </el-option>
              </el-select>
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
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()"
                >导&nbsp;&nbsp;出
              </el-button>
              <el-button class="button2 button-float" round @click="removeBtn()"
                >批量下架
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="approvedBtn()"
                >批量审核
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        prop="GoodsTypeDesc"
        label="类型"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column align="center" label="商品图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>

      <el-table-column align="left" label="商品信息">
        <template #default="scope">
          <p v-if="scope.row.BrandName">{{ scope.row.BrandName }}</p>
          <p>编码：{{ scope.row.GoodsCode }}</p>
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.GoodsId, 'View')"
            style="color: #f56c6c"
          >
            名称：{{ scope.row.GoodsTitle }}</el-link
          >
          <p v-if="ConfigValue == 1">
            /pages/productDetail/index_new?UnitId={{ loginUser.UnitId }}&id={{
              scope.row.GoodsId
            }}
          </p>
          <p v-else>
            /pages/productDetail/index_new?id={{ scope.row.GoodsId }}
          </p>
          <p v-if="scope.row.GoodsType == '1'">
            关联的券：{{
              scope.row.TicketTemplate.TicketTemplateCode +
              "-" +
              scope.row.TicketTemplate.TicketTemplateTitle
            }}
          </p>
          <p v-if="scope.row.PublicGoodsCategories&&scope.row.PublicGoodsCategories.length > 0">
            所属分类：<span
              v-for="(item, index) in scope.row.PublicGoodsCategories"
              :key="index"
              >{{ item.Code + "-" + item.PathName }},</span
            >
          </p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="价格(元)" width="150">
        <template #default="scope">
          <p>原价：{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
          <p>售价：{{ (scope.row.SellPrice / 100).toFixed(2) }}</p>
          <p>采购价：{{ (scope.row.PurchasePrice / 100).toFixed(2) }}</p>
          <p>平台进货价：{{ (scope.row.BuyPrice / 100).toFixed(2) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="scope">
          <p>库存：{{ scope.row.TotalQty }}</p>
          <p>已售：{{ scope.row.SoldQty }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="综合指数" width="90">
        <template #default="scope">
          <p
            v-if="
              loginUser.UnitName == '礼牛网' &&
              scope.row.Index.CompositeIndex > 0
            "
          >
            <span style="font-size: 10px; color: #f56c6c"></span
            >{{ scope.row.Index.CompositeIndex }}
          </p>
        </template></el-table-column
      >
      <el-table-column
        prop="UnitStatusDesc"
        label="状态"
        align="center"
        width="80"
      >
        <template #default="scope">
          <p v-if="scope.row.MallStatus == 0">待审核</p>
          <p v-if="scope.row.MallStatus == -1">未上架</p>
          <p v-if="scope.row.MallStatus == 10">上架中</p>
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="券商" width="180">
        <template #default="scope">
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-del"
              size="small"
              v-if="scope.row.MallStatus == 0"
              @click="approvalOrShelvesClick(scope.row, 'approve')"
              >审批
            </el-button>
            <el-button
              class="button-op-stop"
              size="small"
              v-if="scope.row.MallStatus == 10"
              @click="approvalOrShelvesClick(scope.row, 'shelves')"
              >下架
            </el-button>
            <el-button
              v-if="loginUser.UnitName == '礼牛网'"
              class="button-op-view"
              size="small"
              @click="ModifyGoodsIndexClick(scope.row.GoodsId)"
              >综合指数
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

    <!-- 审核下架弹出框 -->
    <el-dialog
      title="批量操作"
      v-model="approveVisible"
      width="38%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-input
        type="textarea"
        maxlength="100"
        :rows="4"
        show-word-limit
        placeholder="请输入备注"
        v-model="TextareaRemark"
      >
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <div v-if="visibleType == 'approved'">
            <el-button class="button1" :loading="passLoading" @click="passBtn"
              >通 过</el-button
            >
            <el-button
              class="button2"
              :loading="refuseLoading"
              @click="refuseBtn"
              >拒 绝</el-button
            >
            <el-button class="button2" @click="approveVisible = false"
              >关 闭</el-button
            >
          </div>
          <div v-if="visibleType == 'remove'">
            <el-button
              class="button1"
              :loading="removeLoading"
              @click="offlineBtn"
              >确认下架</el-button
            >
            <el-button class="button2" @click="approveVisible = false"
              >关 闭</el-button
            >
          </div>
        </span>
      </template>
    </el-dialog>

    <!-- 综合指数 -->
    <el-dialog
      title="综合指数"
      v-model="GoodsIndexVisible"
      width="38%"
      :show-close="false"
    >
      <el-form label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="数值">
              <el-input
                v-model="GoodsIndex"
                clearable
                placeholder="请输入综合指数"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="GoodsIndexLoading"
            @click="ModifyGoodsIndexApi"
            >保 存</el-button
          >
          <el-button class="button2" @click="GoodsIndexVisible = false"
            >关 闭</el-button
          >
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
import { SearchUnites, HasRightes, GetUnitConfigs } from "../../api/index.js";
import {
  SearchSellGoodses,
  BatchApproveMallGoods,
  BatchRejectMallGoods,
  BatchOfflineMallGoods,
  ModifyGoodsIndex,
} from "@/api/goods.js";
import goodsQty from "@/components/common/GoodsQty.vue";
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    create_unit_id: "",
    mall_status: "0",
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
  let res = await SearchSellGoodses({
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
//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("售卖详情");
  router.push({
    path: "/selling_goods_info",
    query: {
      Type: "View",
      ID: ID,
    },
  });
};
////////////////////////////////////////////////////////////////
//权限控制
const IsRight = ref(false);
const BoolRight = async () => {
  let arr = ["edit_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goods;
  }
};
//审批权限控制
BoolRight();
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
      let res = await SearchSellGoodses({
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
            if (row.GoodsTypeDesc == "兑换券商品") {
              row.ticketDesc =
                row.TicketTemplate.TicketTemplateCode +
                "-" +
                row.TicketTemplate.TicketTemplateTitle;
            }
            row.OrgPriceDesc = row.OrgPrice / 100;
            row.SellPriceDesc = row.SellPrice / 100;
            row.PurchasePriceDesc = row.PurchasePrice / 100;
            row.BuyPriceDesc = row.BuyPrice / 100;
            if (row.MallStatus == 0) {
              row.GoodsStatusDesc = "待审核";
            } else if (row.MallStatus == 10) {
              row.GoodsStatusDesc = "上架中";
            } else if (row.MallStatus == -1) {
              row.GoodsStatusDesc = "未上架";
            }
            //所属商品分类
            row.PublicGoodsCategories.forEach(
              (PublicCategories, PublicCategoriesIndex) => {
                if (PublicCategoriesIndex == 0) {
                  row.PublicGoodsCategoriesDesc =
                    PublicCategories.Code + "-" + PublicCategories.PathName;
                } else {
                  row.PublicGoodsCategoriesDesc =
                    row.PublicGoodsCategoriesDesc +
                    "," +
                    PublicCategories.Code +
                    "-" +
                    PublicCategories.PathName;
                }
              }
            );
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
            "品牌",
            "编码",
            "名称",
            "卖点",
            "商品分类",
            "关联的券",
            "原价(元)",
            "售价(元)",
            "采购价(元)",
            "平台进货价(元)",
            "库存",
            "已售数量",
            "规格属性",
            "规格数量",
            "状态",
            "创建单位",
            "创建人",
            "创建时间",
            "商品图片",
          ];
          const filterVal = [
            "GoodsTypeDesc",
            "BrandName",
            "GoodsCode",
            "GoodsTitle",
            "GoodsSubTitle",
            "PublicGoodsCategoriesDesc",
            "ticketDesc",
            "OrgPriceDesc",
            "SellPriceDesc",
            "PurchasePriceDesc",
            "BuyPriceDesc",
            "TotalQty",
            "SoldQty",
            "GoodsPropertiesDesc",
            "SkuCount",
            "GoodsStatusDesc",
            "CreateUnitName",
            "CreateUserName",
            "CreateTime",
            "ListImg",
          ];
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "商品数据导出" + time,
            autoWidth: true,
          });
        });
      }
    })
    .catch(() => {});
};
const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
////////////////////////////////////////////////////////////////
//获取商户配置信息详情
const ConfigValue = ref(""); //是否启用券商私域小程序(1:是)
const GetUnitConfigsApi = async () => {
  if (loginUser.UnitType == 2) {
    let res = await GetUnitConfigs({
      ObjectId: loginUser.UnitId,
    });
    if (res.Code == 200) {
      for (let i = 0; i < res.DataMap.length; i++) {
        if (res.DataMap[i].ConfigKey == "wxxcx.ticket.broker") {
          ConfigValue.value = res.DataMap[i].ConfigValue;
        }
      }
    }
  }
};
GetUnitConfigsApi();
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
const visibleType = ref("");
const TextareaRemark = ref("");
const passLoading = ref(false);
const refuseLoading = ref(false);
const removeLoading = ref(false);
const approveVisible = ref(false);
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
//批量审批弹窗
const approvedBtn = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  TextareaRemark.value = "";
  approveVisible.value = true;
  visibleType.value = "approved";
};
//批量下架弹窗
const removeBtn = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  TextareaRemark.value = "";
  approveVisible.value = true;
  visibleType.value = "remove";
};
//通过
const passBtn = async () => {
  let GoodsIdsList = [];
  multipleSelection.value.forEach((row) => {
    GoodsIdsList.push(row.GoodsId);
  });
  passLoading.value = true;
  let res = await BatchApproveMallGoods({
    GoodsIds: GoodsIdsList,
    TextareaRemark: "",
  });
  passLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功！");
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
//拒绝
const refuseBtn = async () => {
  if (TextareaRemark.value == "") {
    ElMessage.warning("请先输入备注");
    return;
  }
  let GoodsIdsList = [];
  multipleSelection.value.forEach((row) => {
    GoodsIdsList.push(row.GoodsId);
  });
  refuseLoading.value = true;
  let res = await BatchRejectMallGoods({
    GoodsIds: GoodsIdsList,
    TextareaRemark: TextareaRemark.value,
  });
  refuseLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功！");
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
//下架
const offlineBtn = async () => {
  if (TextareaRemark.value == "") {
    ElMessage.warning("请先输入备注");
    return;
  }
  let GoodsIdsList = [];
  multipleSelection.value.forEach((row) => {
    GoodsIdsList.push(row.GoodsId);
  });
  removeLoading.value = true;
  let res = await BatchOfflineMallGoods({
    GoodsIds: GoodsIdsList,
    TextareaRemark: TextareaRemark.value,
  });
  removeLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功！");
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//综合指数
const GoodsIndexVisible = ref(false);
const GoodsIndex = ref("");
const goodsID = ref("");
const GoodsIndexLoading = ref(false);
const ModifyGoodsIndexClick = (GoodsIDValue) => {
  GoodsIndexVisible.value = true;
  goodsID.value = GoodsIDValue;
  GoodsIndex.value = "";
};
const ModifyGoodsIndexApi = async () => {
  GoodsIndexLoading.value = true;
  let res = await ModifyGoodsIndex({
    GoodsId: goodsID.value,
    CompositeIndex: GoodsIndex.value,
  });
  GoodsIndexLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功！");
    query.PageStartRow = 1;
    getData();
    GoodsIndex.value = "";
    GoodsIndexVisible.value = false;
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//设置审批
const multipleTable = ref(null);
const approvalOrShelvesClick = async (row, type) => {
  multipleSelection.value.forEach((row) => {
    multipleTable.value.toggleRowSelection(row, false);
  });
  multipleSelection.value = [];
  multipleTable.value.toggleRowSelection(row, true);
  if (type == "approve") {
    //审核
    TextareaRemark.value = "";
    approveVisible.value = true;
    visibleType.value = "approved";
  } else {
    //下架
    TextareaRemark.value = "";
    approveVisible.value = true;
    visibleType.value = "remove";
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "售卖商品") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "售卖商品"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped>
::v-deep(.inventory-top .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
