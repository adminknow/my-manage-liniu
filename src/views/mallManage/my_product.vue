<!-- 我的商品页面 -->
<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入编码/名称/品牌/条码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.goods_status" placeholder="请选择状态">
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.goods_src" placeholder="请选择商品来源">
                <el-option label="境内" value="0"> </el-option>
                <el-option label="保税" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight" class="button2 button-float" round @click="handleAdd()">添加商品
              </el-button>
              <el-button class="button2 button-float" round @click="handleOut()">导&nbsp;&nbsp;出
              </el-button>
              <el-button v-if="
                IsRight1 &&
                loginUser.UnitName != '礼牛严选' &&
                loginUser.UnitName == '礼牛国际'
              " class="button2 button-float" round @click="synchronousBtn()">
                同步全球购
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="5">
            <el-form-item label="">
              <el-select clearable v-model="query.search.goods_type" placeholder="请选择类型" style="width: 100%">
                <el-option label="普通商品" value="2" />
                <el-option label="组合装商品" value="3" />
                <el-option label="电子券商品" value="1" />
                <el-option label="虚拟商品" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select clearable style="width: 100%" v-model="query.search.has_sku" placeholder="有无SKU">
                <el-option label="有" value="1"> </el-option>
                <el-option label="无" value="0"> </el-option>
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
          <el-col :span="7">
            <div class="button-mgl">
              <el-button v-if="
                loginUser.UnitType == 2 && loginUser.UnitName != '礼牛严选'
              " class="button2 button-float" round @click="fileUploadClick('SellGoods')">批量导入
              </el-button>
              <el-dropdown class="button-float" v-if="loginUser.UnitName == '礼牛严选' && IsRight2">
                <el-button class="button2 button-float" round>云中鹤导入导出
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="fileUploadClick('HaoxinySellGoods')">商品批量导入</el-dropdown-item>
                    <el-dropdown-item @click="fileUploadClick('HaoxinyGoodsCategoryMap')">商品分类映射导入</el-dropdown-item>
                    <el-dropdown-item @click="outTableData(false)">商品分类映射导出</el-dropdown-item>
                    <el-dropdown-item @click="outTableData(true)">虚拟商品分类映射导出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-button v-if="loginUser.UnitType == 2" class="button2 button-float" round
                @click="batchBtn('enable')">批量启用
              </el-button>
              <el-button v-if="loginUser.UnitType == 2" class="button2 button-float" round
                @click="batchBtn('stop')">批量停用
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" border class="table" v-loading="tableLoading"
      ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
      style="width: 100%">
      <el-table-column v-if="loginUser.UnitType == 2" align="center" type="selection" width="50" />
      <el-table-column prop="GoodsTypeDesc" label="类型" align="center" width="100"></el-table-column>
      <el-table-column align="center" label="商品图片" width="100">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 60px" />
        </template>
      </el-table-column>

      <el-table-column align="left" label="商品信息">
        <template #default="scope">
          <p v-if="scope.row.BrandName">{{ scope.row.BrandName }}</p>
          <p>编码：{{ scope.row.GoodsCode }}</p>
          <p v-if="scope.row.GoodsBarcode">
            条码：{{ scope.row.GoodsBarcode }}
          </p>
          <el-link :underline="false" @click="handleEdit(scope.row.GoodsId, 'View')" style="color: #f56c6c">
            名称：{{ scope.row.GoodsTitle }}</el-link>

          <p v-if="scope.row.GoodsType == '1'">
            关联的券：{{
              scope.row.TicketTemplate.TicketTemplateCode +
              "-" +
              scope.row.TicketTemplate.TicketTemplateTitle
            }}
          </p>
          <div v-if="scope.row.Malls.length > 0">
            <div v-for="(item, index) in scope.row.Malls" :key="index">
              <p v-if="
                item.Categories.length > 0 &&
                item.UnitId == scope.row.CreateUnitId
              ">
                分类：<span v-for="(item1, index1) in item.Categories" :key="index1">{{ item1.Code + "-" + item1.PathName
                  }},</span>
              </p>
            </div>
          </div>
          <p v-if="scope.row.GoodsSrc == 1">保税商品</p>
          <p v-if="isMall">
            {{ `/pages/productDetail/index_new?UnitId=${scope.row.CreateUnitId}&id=${scope.row.GoodsId}` }}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="价格(元)" width="160">
        <template #default="scope">
          <p>原价：{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
          <p>售价：{{ (scope.row.SellPrice / 100).toFixed(2) }}</p>
          <p v-if="loginUser.UnitName == '礼牛严选'">
            进货价：{{ (scope.row.BuyPrice / 100).toFixed(2) }}
          </p>
          <p v-if="scope.row.WholesaleBeginQty > 0">
            满{{ scope.row.WholesaleBeginQty }}件,每件{{
              (scope.row.WholesalePrice / 100).toFixed(2)
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="数量" width="100">
        <template #default="scope">
          <p>库存：{{ scope.row.TotalQty }}</p>
          <p>已售：{{ scope.row.SoldQty }}</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序" width="90" v-if="loginUser.UnitName == '礼牛网'">
        <template #default="scope">
          <p v-if="
            loginUser.UnitName == '礼牛网' &&
            scope.row.Index.CompositeIndex > 0
          ">
            <span style="font-size: 10px; color: #f56c6c"></span>{{ scope.row.Index.CompositeIndex }}
          </p>
        </template></el-table-column>
      <el-table-column align="center" label="排序" width="60" v-else>
        <template #default="scope">
          <p>
            {{ scope.row.Index.SoldIndex }}
          </p>
        </template></el-table-column>
      <el-table-column prop="UnitStatusDesc" label="状态" align="center" width="80">
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
            <p>{{ scope.row.CreateUnitName }}</p>
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
            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              IsRight &&
              scope.row.GoodsProperties.length == 0
            " class="button-op-del" size="small" @click="handleAddInventory(scope.row.GoodsId)">增加库存
            </el-button>
            <el-button v-if="scope.row.GoodsProperties.length == 0" class="button-op-del" size="small"
              @click="handleViewInventory(scope.row.GoodsId)">库存变动历史
            </el-button>
            <el-button v-if="
              scope.row.GoodsPropertyCount > 0
            " class="button-op-view" size="small" @click="handleSKU(scope.row.GoodsId, scope.row.CreateUnitId)">规格
            </el-button>
            <el-button v-if="loginUser.UnitName == '礼牛网'" class="button-op-view" size="small"
              @click="ModifyGoodsIndexClick(scope.row.GoodsId)">排序
            </el-button>
            <el-button class="button-op-view" size="small" @click="Evaluate(scope.row.GoodsId)">评价
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
    <el-dialog title="绑定的商品" v-model="goodVisible" width="60%" :show-close="false">
      <el-table :data="tableGoodData" border class="table" v-loading="goodTableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
        <el-table-column prop="GoodsCode" align="center" label="编码"></el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="名称" width="260">
          <template #default="scope">
            <el-link :underline="false" @click="handleEdit(scope.row.GoodsId, 'View')" style="color: #f56c6c">
              {{ scope.row.GoodsTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="GoodsTypeDesc" align="center" label="类型"></el-table-column>
        <el-table-column prop="GoodsSubTitle" align="center" label="规格"></el-table-column>
        <el-table-column prop="OrgPrice" align="center" label="面值(元)">
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
    <el-dialog title="绑定的卡券" v-model="ticketVisible" width="60%" :show-close="false">
      <el-table :data="tableTicketData" border class="table" v-loading="ticketTableLoading"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
        <el-table-column prop="TicketTemplateCode" align="center" label="券批次号"></el-table-column>
        <el-table-column prop="TicketTemplateTitle" align="center" label="券名称" width="260">
          <template #default="scope">
            <el-link :underline="false" @click="handleTicketEdit(scope.row.TicketTemplateId)" style="color: #f56c6c">
              {{ scope.row.TicketTemplateTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="BrandName" align="center" label="品牌"></el-table-column>
        <el-table-column prop="OrgPrice" align="center" label="面值(元)">
          <template #default="scope">
            {{ (scope.row.OrgPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="TicketTemplateTypeDesc2" align="center" label="类型"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="ticketVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 增加库存 -->
    <el-dialog title="增加库存" v-model="inventoryVisible" width="38%" :show-close="false">
      <div style="width:100%;height:10px"></div>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="数量">
              <el-input v-model="inventory" clearable placeholder="请输入数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
                v-model="inventoryRemark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="inventoryLoading" @click="saveInventoryBtn">保 存</el-button>
          <el-button class="button2" @click="inventoryVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 库存变更历史 -->
    <el-dialog class="inventory-top" title="库存变更历史" v-model="inventoryHistoryVisible" width="60%" :show-close="false">
      <goodsQty ref="editor" :goodID="goodID" :skuID="skuID" :openModal="inventoryHistoryVisible">
      </goodsQty>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="inventoryHistoryVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 排序 -->
    <el-dialog title="排序" v-model="GoodsIndexVisible" width="38%" :show-close="false">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="数值">
              <el-input v-model="GoodsIndex" clearable placeholder="请输入综合指数">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="GoodsIndexLoading" @click="ModifyGoodsIndexApi">保 存</el-button>
          <el-button class="button2" @click="GoodsIndexVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传文件通用弹窗 -->
    <uploadModal :fileUploadVisible="fileUploadVisible" :fileType="fileType" @closeUploadVisible="closeUploadVisible">
    </uploadModal>

    <!-- 评价列表 -->
    <evaluate-index :goodsId="goodsID" :Visible="evaluateVisible" @CloseVisible="CloseEvaluateVisible"></evaluate-index>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { SearchUnites, HasRightes, GetUnitConfigs, IsMallOpen } from "@/api/index.js";
import {
  GetHaoxinyGoodsCategoryMaps,
  GetHaoxinyVirtualGoodsCategoryMaps,
} from "@/api/common.js";
import {
  AddGoodsTotalQty,
  SearchMySellGoodses,
  EnableGoods,
  DisableGoods,
  ModifyGoodsIndex,
  SynGoodsFromJtgloble,
} from "@/api/goods.js";
import { useProductExport } from "@/hooks/use-export.js";
import uploadModal from "@/components/upload/index.vue";
import goodsQty from "@/components/common/GoodsQty.vue";
import evaluateIndex from "@/components/goods/evaluate.vue";
var flag = true;
var iCount = 0;
var msg = "";
var approveList = [];
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    create_unit_id: "",
    goods_status: "1",
    mall_status_1: "", //礼牛商城状态
    goods_type: "",
    goods_src: "",
    has_sku: "",
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
  let res = await SearchMySellGoodses({
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
//同步全球购商品
const synchronousBtn = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在同步中",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let res = await SynGoodsFromJtgloble({});
  loading.close();
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    handleSearch();
  } else {
    ElMessage.warning(res.Message);
  }
};
//新增商品
const handleAdd = () => {



  common.ClosePageTag("售卖详情");
  router.push({
    path: "/selling_goods_info",
    query: {
      Type: "Add",
      mall: 'my',
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
  common.ClosePageTag("售卖详情");
  router.push({
    path: "/selling_goods_info",
    query: {
      Type: type,
      mall: 'my',
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
const goodTableLoading = ref(false);
const goodVisible = ref(false);
const tableGoodData = ref([]);

const ticketTableLoading = ref(false);
const ticketVisible = ref(false);
const tableTicketData = ref([]);

const inventoryVisible = ref(false);
const inventoryLoading = ref(false);

const inventory = ref("");
const inventoryRemark = ref("");
const goodsID = ref("");

const handleAddInventory = (ID) => {
  goodsID.value = ID;
  inventory.value = "";
  inventoryRemark.value = "";
  inventoryVisible.value = true;
};

const saveInventoryBtn = async () => {
  if (inventory.value == "") {
    ElMessage.error("数量不能为空");
    return;
  }
  inventoryLoading.value = true;
  let res = await AddGoodsTotalQty({
    GoodsId: goodsID.value,
    Qty: inventory.value,
    Remark: inventoryRemark.value,
  });
  inventoryLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功！");
    query.PageStartRow = 1;
    getData();
    inventoryVisible.value = false;
  } else {
    ElMessage.error(res.Message);
  }
};

////////////////////////////////////////////////////////////////
//跳转到sku明细
const handleSKU = async (ID, CreateUnitId) => {
  common.ClosePageTag("规格");
  router.push({
    path: "/sku",
    query: {
      ID: ID,
      UnitID: CreateUnitId,
      type: "private",//我的商品
    },
  });
};
////////////////////////////////////////////////////////////////
//权限控制
const IsRight = ref(false);
const IsRight1 = ref(false);
const IsRight2 = ref(false);
const BoolRight = async () => {
  let arr = ["edit_goods", "syn_jtgloble_goods", "syn_haoxiny_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goods;
    IsRight1.value = res.DataMap.syn_jtgloble_goods;
    IsRight2.value = res.DataMap.syn_haoxiny_goods;
  }
};
//审批权限控制
BoolRight();
////////////////////////////////////////////////////////////////
const goodID = ref("");
const skuID = ref("");
const inventoryHistoryVisible = ref(false);

//查看库存变更历史
const handleViewInventory = (ID) => {
  goodID.value = ID;
  skuID.value = "";
  inventoryHistoryVisible.value = true;
};
////////////////////////////////////////////////////////////////
//排序
const GoodsIndexVisible = ref(false);
const GoodsIndex = ref("");
const GoodsIndexLoading = ref(false);

const ModifyGoodsIndexClick = (GoodsIDValue) => {
  GoodsIndexVisible.value = true;
  goodsID.value = GoodsIDValue;
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
////////////////////////////////////////////////////////////////
//导出
const { handleExport } = useProductExport();
const handleOut = () => {
  //导出
  handleExport(query, tableLoading);
};

////////////////////////////////////////////////////////////////
//获取商户配置信息详情
const ConfigValue = ref(""); //是否启用券商私域小程序(1:是)
const ConfigValue1 = ref(""); //【商城】开关(on:打开)
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
        if (res.DataMap[i].ConfigKey == "mall.switch") {
          ConfigValue1.value = res.DataMap[i].ConfigValue;
        }
      }
    }
  }
};
GetUnitConfigsApi();
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
const fileUploadVisible = ref(false);
const fileType = ref("");
const fileUploadClick = (pValue) => {
  fileType.value = pValue;
  fileUploadVisible.value = true;
};

const closeUploadVisible = (pValue) => {
  fileUploadVisible.value = false;
  if (pValue) {
    handleSearch();
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//导出数据
const outTableData = async (virtual = false) => {
  //商品
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = null;
      let outFileName = "";
      if (virtual) {
        outFileName = "礼牛商城的分类与云中鹤的虚拟商品分类的映射导出";
        res = await GetHaoxinyVirtualGoodsCategoryMaps({});
      } else {
        outFileName = "礼牛商城的分类与云中鹤的商品分类的映射导出";
        res = await GetHaoxinyGoodsCategoryMaps({});
      }
      if (res.Code == 200) {
        if (!res.DataMap || res.DataMap.length == 0) {
          ElMessage.error("当前暂无数据");
          return;
        }
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
          const tHeader = [
            "云中鹤分类编码",
            "云中鹤分类名称",
            "礼牛一级分类编码",
            "礼牛一级分类名称",
            "礼牛二级分类编码",
            "礼牛二级分类名称",
          ];

          const filterVal = [
            "haoxiny_code",
            "haoxiny_name",
            "ln_parent_code",
            "ln_parent_name",
            "ln_code",
            "ln_name",
          ];
          const data = formatJson(filterVal, res.DataMap);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: outFileName + time,
            autoWidth: true,
          });
        });
      }
    })
    .catch(() => { });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//如果是券商的话可以批量审批和下架
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
////////////////////////////////////////////////////////////////////////////////////////////////////
// 批量启用与停用
const batchBtn = (type) => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先选择数据");
    return;
  }
  iCount = multipleSelection.value.length;
  approveList = multipleSelection.value;
  if (type == "enable") {
    //批量启用
    opBatch(iCount, approveList, "enable");
  }
  if (type == "stop") {
    //批量停用
    opBatch(iCount, approveList, "stop");
  }
};
//递归函数
const opBatch = async (iCount, List, type) => {
  if (flag && iCount > 0) {
    let res = null;
    // 判断 1 是否请求成功 2 是否到达请求次数
    var index = iCount;
    if (type == "enable") {
      res = await EnableGoods({
        ObjectId: List[index - 1].GoodsId,
      });
    }
    if (type == "stop") {
      res = await DisableGoods({
        ObjectId: List[index - 1].GoodsId,
      });
    }
    if (res.Code == 200) {
      iCount--; //请求次数 - 1
      msg = res.Message;
      if (iCount > 0) {
        opBatch(iCount, List, type);
      }
    } else {
      flag = false;
      ElMessage.warning(res.Message);
    }
  }
  if (iCount == 0) {
    ElMessage.success(msg);
    handleSearch();
  }
};

//评价
const evaluateVisible = ref(false);
const Evaluate = (ID) => {
  goodsID.value = ID;
  evaluateVisible.value = true;
};
const CloseEvaluateVisible = () => {
  evaluateVisible.value = false;
  goodsID.value = "";
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//判断当前券商是否开通了商城
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
IsMallOpenAPi();
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
