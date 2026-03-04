<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.order_code"
                clearable
                placeholder="请输入订单号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                style="width: 100%"
                v-model="query.search.time"
                type="daterange"
                :shortcuts="shortcuts"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.order_id"
                clearable
                placeholder="请输入订单ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleOut()"
              >
                <el-icon> <DocumentAdd /> </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;出
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.ticket_code"
                clearable
                placeholder="请输入券码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.contact_name"
                clearable
                placeholder="请输入收件人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.contact_cell"
                clearable
                placeholder="请输入收件人电话"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.goods_name"
                clearable
                placeholder="请输入商品名称或编码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.invoice_status"
                placeholder="请选择发票状态"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option label="待开票" value="0"> </el-option>
                <el-option label="开票中" value="1"> </el-option>
                <el-option label="已开票" value="10"> </el-option>
                <el-option label="不开票" value="-10"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.unit_id"
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
        </el-row>
      </el-form>
    </div>
    <div class="order_tags">
      <ul>
        <li
          @click="choosetag(index)"
          class="order_tags-li"
          v-for="(item, index) in statusList"
          :class="{
            active: item.active,
            Highlight: index == 2 && StatData.pay_wait_ticket_cnt > 0,
          }"
          :key="index"
        >
          {{ item.key
          }}<text v-if="item.key == '待付款' && StatData.wait_pay_cnt > 0"
            >({{ StatData.wait_pay_cnt }})</text
          >
          <text
            v-else-if="
              item.key == '已付款待发券' && StatData.pay_wait_ticket_cnt > 0
            "
            >({{ StatData.pay_wait_ticket_cnt }})</text
          >
          <text
            v-else-if="item.key == '待审核' && StatData.wait_approve_cnt > 0"
            >({{ StatData.wait_approve_cnt }})</text
          >
          <text
            v-else-if="item.key == '待发货' && StatData.wait_deliver_cnt > 0"
            >({{ StatData.wait_deliver_cnt }})</text
          >
        </li>
      </ul>
    </div>
    <div style="width: 100%; height: 8px"></div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="tableDataRef"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div
            class="child-contant"
            style="margin: 20px; margin-top: 0; padding-left: 90px"
          >
            <p>商品明细</p>
            <el-table
              @selection-change="
                handleSelectionChange($event, props.row.OrderId)
              "
              :data="props.row.Details"
              style="width: 90%"
              border
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column align="center" type="selection" width="55" />
              <el-table-column align="center" label="图片" width="80">
                <template #default="scope">
                  <img
                    :src="scope.row.GoodsListImg"
                    style="width: 50px; height: 50px"
                  />
                </template>
              </el-table-column>
              <el-table-column align="left" label="商品详情">
                <template #default="scope">
                  <p>{{ scope.row.GoodsTitle }}</p>
                  <p>价格：{{ (scope.row.Price / 100).toFixed(2) }}(元)</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="数量" width="80">
                <template #default="scope">
                  <p>{{ scope.row.Qty }}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格(元)" width="120">
                <template #default="scope">
                  <p>{{ (scope.row.Price / 100).toFixed(2) }}</p>
                </template>
              </el-table-column>
              <el-table-column align="left" label="发货信息">
                <template #default="scope">
                  <p>{{ scope.row.SendUnitName }}</p>
                  <p>{{ scope.row.SendUnitTel }}</p>
                  <p>{{ scope.row.SendStatusDesc }}</p>
                </template>
              </el-table-column>
              <el-table-column align="left" label="收货信息">
                <template #default="scope">
                  <p>{{ scope.row.ReceiveUnitName }}</p>
                  <p>{{ scope.row.ReceiveUnitContact }}</p>
                  <p>{{ scope.row.ReceiveStatusDesc }}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" align="left">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.OrderId)"
            style="color: #f56c6c"
          >
            {{ scope.row.OrderCode }}</el-link
          >
          <p>{{ scope.row.OrderTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="礼盒信息" align="left">
        <template #default="scope">
          <p>名称：{{ scope.row.GiftPackageConfigDesc.Title }}</p>
          <p>
            价格：<span style="font-size: 11px; margin-right: 2px">¥</span
            >{{ (scope.row.GiftPackageConfigDesc.Price / 100).toFixed(2) }}
          </p>
          <p>
            礼盒样式：{{ scope.row.TicketMethodDesc
            }}<span
              style="margin-left: 8px"
              v-if="scope.row.BoxAppearanceTypeDesc"
              >{{ scope.row.BoxAppearanceTypeDesc }}</span
            >
          </p>
          <p>配送方式：{{ scope.row.DeliverMethodDesc }}</p>
          <p>组装方式：{{ scope.row.AssemblyMethodDesc }}</p>
        </template>
      </el-table-column>
      <el-table-column label="购买数量" align="center" width="160">
        <template #default="scope">
          <p>{{ scope.row.GiftPackageQty }}</p>
        </template>
      </el-table-column>
      <el-table-column label="总额(元)" align="center" width="180">
        <template #default="scope">
          <p>{{ (scope.row.TotalAmt / 100).toFixed(2) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="最早配送日期" align="center">
        <template #default="scope">
          <p>
            {{
              scope.row.BeginDeliverDateDesc + " " + scope.row.BeginDeliverDateH
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template #default="scope">
          <p>{{ scope.row.OrderStatusDesc }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small">详情</el-button>
            <el-button
              v-if="scope.row.OrderStatus == 0"
              class="button-op-edit"
              size="small"
              @click="OrderPay(scope.row.OrderId)"
              >线下付款</el-button
            >
            <el-button
              v-if="scope.row.OrderStatus == 0"
              class="button-op-edit"
              size="small"
              @click="OrderClose(scope.row.OrderId)"
              >关闭订单</el-button
            >
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
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :total="pageTotal"
      />
    </div>
    <!-- 付款信息 -->
    <OrderPayModal
      :OrderPayVisible="orderPayVisible"
      :OrderID="publicOrderId"
      @closeOrderPayVisible="closeOrderPayVisible"
    ></OrderPayModal>
    <!-- 关闭订单 -->
    <OrderCloseModal
      :OrderCloseVisible="orderCloseVisible"
      :OrderID="publicOrderId"
      @closeOrderVisible="closeOrderVisible"
    ></OrderCloseModal>
  </div>
</template>
<script setup>
import OrderPayModal from "@/components/Modal/fucaiOrder/OrderPayModal.vue";
import OrderCloseModal from "@/components/Modal/fucaiOrder/OrderCloseModal.vue";
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import {} from "@/api/common.js";
import Cookie from "js-cookie";
import { SearchGiftPackageOrders } from "@/api/order.js";
import { StatSingle, HasRightes, SearchUnites } from "@/api/index.js";
import { GetFileData, Import } from "@/api/imgapi.js";
import { GetGoods } from "@/api/goods.js";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
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
//统计数量
const StatData = reactive({
  wait_pay_cnt: "", //待付款
  pay_wait_ticket_cnt: "", //待发券
  wait_approve_cnt: "",
  wait_deliver_cnt: "",
});
////////////////////////////////////////////////////////////////////////////////////////////////
let statusList = ref([
  {
    value: "",
    key: "全部",
    active: false,
  },
  {
    value: "0",
    key: "待付款",
    active: true,
  },
  {
    value: "10,21,22",
    key: "待发货",
    active: false,
  },
  {
    value: "70",
    key: "发货中",
    active: false,
  },
  {
    value: "81,82,83 ",
    key: "已发货",
    active: false,
  },
  {
    value: "100",
    key: "已完成",
    active: false,
  },
  {
    value: "-1",
    key: "已取消",
    active: false,
  },
  {
    value: "300",
    key: "近三个月订单",
    active: false,
  },
]);
const query = reactive({
  search: {
    order_code: "",
    order_status: "0", //状态 (0:全部;1:待付款;2:已完成;)
    contact_cell: "", //联系电话
    contact_name: "", //联系人
    express_code: "", //物流单号
    goods_name: "", //商品名称
    ticket_code: "", //券码
    order_id: "", //订单id针对于 礼牛
    invoice_status: "", //发票状态（0:待开票;1:开票中;10:已开票;-10 不开票）
    time: [],
    order_date_begin: "",
    order_date_end: "",
    unit_id: "", //券商ID
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
//全局公共参数
const publicOrderId = ref("");
////////////////////////////////////////////////////////////////////////////////////////////////////
const choosetag = (pIndex) => {
  statusList.value.forEach((row) => {
    row.active = false;
  });
  statusList.value[pIndex].active = true;
  query.search.order_status = statusList.value[pIndex].value;
  if (statusList.value[pIndex].value == 300) {
    query.search.order_status = "";
    //三个月
    const end = new Date();
    end.setHours(23, 59, 59);
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    start.setHours(0, 0, 0);
    query.search.time = [start, end];
  } else if (statusList.value[pIndex].value == "") {
    //点击全部就只查询一个月的
    const end = new Date();
    end.setHours(23, 59, 59);
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    start.setHours(0, 0, 0);
    query.search.time = [start, end];
    pageTotal.value = 0;
    tableData.value = [];
  } else {
    query.search.time = [];
  }
  query.PageStartRow = 1;
  SearchGiftPackageOrdersApi();
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
//线下财务付款
const orderPayVisible = ref(false);
const OrderPay = (pOrderId) => {
  publicOrderId.value = pOrderId;
  orderPayVisible.value = true;
};
//关闭订单
const orderCloseVisible = ref(false);
const OrderClose = (pOrderId) => {
  publicOrderId.value = pOrderId;
  orderCloseVisible.value = true;
};
////////////////////////////////////////////////////////////////////////////////////////////////
//SharedFunctions
const formatDate = (pValue) => {
  const year = pValue.toString().slice(0, 4);
  const month = pValue.toString().slice(4, 6);
  const day = pValue.toString().slice(6, 8);
  return `${year}年${month}月${day}日`;
};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  SearchGiftPackageOrdersApi();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  SearchGiftPackageOrdersApi();
};
const closeOrderPayVisible = (pValue) => {
  orderPayVisible.value = false;
  if (pValue) {
    //只有传值过来的时候需要刷新页面
    handleSearch();
  }
};
const closeOrderVisible = (pValue) => {
  orderCloseVisible.value = false;
  if (pValue) {
    //只有传值过来的时候需要刷新页面
    handleSearch();
  }
};
const handleSearch = () => {
  query.PageStartRow = 1;
  SearchGiftPackageOrdersApi();
};
//api
const SearchGiftPackageOrdersApi = async () => {
  query.search.order_date_begin = "";
  query.search.order_date_end = "";
  if (query.search.time) {
    if (query.search.time.length > 0) {
      query.search.order_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[0]
      );
      query.search.order_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time[1]
      );
    }
  }
  tableLoading.value = true;
  let res = await SearchGiftPackageOrders({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    tableData.value.forEach((row) => {
      row.GiftPackageConfigDesc = JSON.parse(row.GiftPackageConfig);
      row.BeginDeliverDateDesc = formatDate(row.BeginDeliverDate);
    });
    pageTotal.value = res.DataMap.ToalCount;
    
    if(query.PageStartRow === 1) {
      // ElMessage.success('操作成功');
    } else {
      ElMessage.error('操作失败');
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
const init = () => {
  SearchGiftPackageOrdersApi();
};
//初始化
init();
////////////////////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "福采订单") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "福采订单"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
    // if (data.query.orderType) {
    //   query.PageStartRow = 1;
    //   getData();
    // }
  }
);
</script>
<style></style>

<style lang="less">
.order_tags {
  position: relative;
  height: 34px;
  overflow: hidden;
}

.order_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #e9eaec;
}

.order_tags-li.active {
  color: #f56c6c;
  font-weight: 500;
  background-color: #fff;
  border-bottom: 1px solid #fff;
  border-top: 2px solid #f56c6c !important;
  border-left: 1px solid #e9eaec;
  border-right: 1px solid #e9eaec;
}

.order_tags-li.Highlight {
  color: #f56c6c;
  font-weight: 500;
  background-color: #fff;
  border-bottom: 1px solid #fff;
  border-top: 2px solid #e9eaec;
  border-left: 1px solid #e9eaec;
  border-right: 1px solid #e9eaec;
}

.order_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.order_tags-li {
  float: left;
  font-size: 14px;
  width: 140px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  height: 33px;
  line-height: 26px;
  background: #fff;
  vertical-align: middle;
  color: #666;
}

ul {
  list-style: none;
}
</style>
