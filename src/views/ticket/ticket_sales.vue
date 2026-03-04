<template>
  <div class="container">
    <div class="handle-box">
      <!-- 使用统计卡片组件 -->
      <TicketSalesCards :statData="StatData" :cardConfigs="customCardConfigs" />

      <!-- 使用搜索表单组件 -->
      <TicketSalesSearchForm v-model="query.search" :customerOptions="customerArr" :showAddButton="IsRight1"
        @search="handleSearch" @export="handleOut" @add="handleAdd" />
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
      <el-table-column align="center" label="领取码" width="120">
        <template #default="scope">
          <img :src="scope.row.TakeWxxcxQRCode" @click="
            handleOpenQr(
              scope.row.TakeWxxcxQRCode
                ? scope.row.TakeWxxcxQRCode
                : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png'
            )
            " style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="BillCode" align="center" label="销售单号" width="260">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.BillId, 'View')" style="color: #f56c6c">
            {{ scope.row.BillCode }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="UnitName" align="left" label="客户信息" width="260">
        <template #default="scope">
          <p>{{ scope.row.UnitName }}</p>
          <p v-if="scope.row.TakeName">领取姓名：{{ scope.row.TakeName }}</p>
          <p v-if="scope.row.TakeCell">领取电话：{{ scope.row.TakeCell }}</p>
          <p v-if="scope.row.SaleChannel">
            销售渠道：{{ scope.row.SaleChannel }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="卡券" align="left">
        <template #default="scope">
          <div v-for="(obj, index) in scope.row.Details" :key="index">
            {{
              obj.TicketTemplateCode +
              "-" +
              obj.TicketTemplateTitle +
              " ×" +
              obj.TicketCount
            }}
            <p v-if="obj.TicketIndexScope">
              券号段：{{ obj.TicketIndexScope }}
            </p>
            <el-divider v-if="scope.row.Details.length > 1" style="margin: 10px 0" />
          </div>
          <p>总数：{{ scope.row.TicketCount + "张" }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="BillStatusDesc" align="center" label="状态" width="100"></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="200">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" v-if="
              scope.row.BillStatus == 0 &&
              loginUser.UnitId == scope.row.CreateUnitId &&
              IsRight1
            " size="small" @click="handleEdit(scope.row.BillId, 'Edit')">编辑
            </el-button>
            <el-button class="button-op-reset" v-if="
              scope.row.BillStatus == 0 &&
              loginUser.UnitId == scope.row.CreateUnitId &&
              IsRight
            " size="small" @click="handlePass(scope.row.BillId)">审核
            </el-button>

            <el-button class="button-op-edit" v-if="scope.row.BillStatus == 1" size="small"
              @click="handleSendTicket(scope.row.BillId, scope.$index)">发送领取短信
            </el-button>
            <el-button class="button-op-edit" size="small" @click="handleTicket(scope.row.BillId)">券明细
            </el-button>
            <el-button v-if="
              IsRight2 &&
              (scope.row.BillStatus == 1 || scope.row.BillStatus == 10)
            " class="button-op-del" size="small" @click="handleActive(scope.row.BillId)">激活券
            </el-button>
            <el-button class="button-op-edit" v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              IsRight
            " size="small" @click="handleTakePass(scope.row.BillId)">重置领取暗码
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

    <!-- 审核通过 -->
    <el-dialog title="提示" v-model="approveVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入内容" v-model="textareaApprove">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="passLoading" @click="passModalBtn">通 过</el-button>
          <el-button class="button2 button-op-stop" :loading="noPassLoading" @click="noPassModalBtn">不通过</el-button>
          <el-button class="button2" @click="approveVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 二维码图片弹框 -->
    <el-dialog title="小程序码" v-model="QrCodeVisible" width="38%" :show-close="false">
      <div style="width: 100%; text-align: center">
        <img :src="QrCodeImg" style="width: 300px" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="QrCodeVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 券明细 -->
    <el-dialog title="券明细" v-model="tableVisible" width="60%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="券批次" name="first">
          <el-table :data="tableDataModal1" height="400" border class="table" v-loading="tableModalLoading1"
            ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="120"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" align="center" label="名称"></el-table-column>
            <el-table-column prop="TicketCount" align="center" label="数量" width="100"></el-table-column>
            <el-table-column align="center" label="面值(元)" width="100">
              <template #default="scope">
                <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="折扣(%)" width="80">
              <template #default="scope">
                <p>{{ scope.row.Discount }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="折后价(元)" width="100">
              <template #default="scope">
                <p>{{ (scope.row.DiscountPrice / 100).toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="TicketIndexScope" label="号段" align="center" width="180"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal1" v-model:page-size="PageRowCountModal1"
              :page-sizes="[15, 50, 100]" :total="Number(pageTotalModal1)" @current-change="handlePageChangeModal1"
              @size-change="handleSizeChangeModal1"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="券明细" name="second">
          <el-table :data="tableDataModal" height="400" border class="table" v-loading="tableModalLoading"
            ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="120"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" label="名称" align="center"></el-table-column>
            <el-table-column prop="TicketIndex" align="center" label="序号" width="60"></el-table-column>
            <el-table-column prop="TicketCode" align="center" label="券码"></el-table-column>
            <el-table-column prop="IsSuspendDesc" align="center" label="挂起" width="60"></el-table-column>
            <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="130"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next"
              v-model:currentPage="PageStartRowModal" v-model:page-size="PageRowCountModal" :page-sizes="[15, 50, 100]"
              :total="Number(pageTotalModal)" @current-change="handlePageChangeModal"
              @size-change="handleSizeChangeModal"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="tableVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 操作 -->
    <el-dialog title="激活销售单下的券" v-model="activeVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareaActive">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="activeLoading" @click="activeModalBtn">确 认</el-button>
          <el-button class="button2" @click="activeVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发送短信 -->
    <el-dialog title="发送短信" v-model="TellVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="联系人" label-width="130px">
            <el-input v-model="contacts"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="电话" label-width="130px">
            <el-input v-model="telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="短信中券的名称" label-width="130px">
            <el-input clearable v-model="SmsTicketName" maxlength="10" show-word-limit></el-input>
            <span style="font-size: 12px; color: #909399">一个汉字代表2个字符。</span>
            <span style="
                font-size: 12px;
                color: #909399;
                height: auto;
                line-height: 18px;
              ">短信格式：亲，您购买的<span style="color: #f56c6c">{{
                SmsTicketName ? SmsTicketName : "××××"
              }}</span>券已发放，请点击 **** ,到我的卡包查看</span>
          </el-form-item>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="SendTellLoading" @click="SendTellBtn">发送</el-button>
          <el-button class="button2" @click="TellVisible = false">关 闭</el-button>
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
import { StatSingle, HasRightes, GetUnitList } from "@/api/index.js";
import {
  SearchTicketBillSales,
  ActiveTicketByTicketBill,
  PassTicketBillSale,
  CancelTicketBillSale,
  SendTicketBillSaleSMSNotify,
  SearchTicketBillDetails,
  GetTicketBillTicketTemplateDetails,
  ResetTicketBillSaleTakePass
} from "@/api/bill.js";
import common from "@/utils/common.js";
import TicketSalesCards from "@/components/ticket/TicketSalesCards.vue";
import TicketSalesSearchForm from "@/components/ticket/TicketSalesSearchForm.vue";

// 导入图片
import imgOrder1 from "@/assets/imgs/img-order1.png";
import imgOrder2 from "@/assets/imgs/img-order2.png";
import imgOrder3 from "@/assets/imgs/img-order3.png";
import imgOrder4 from "@/assets/imgs/img-order4.png";
const customCardConfigs = [
  {
    title: "今日卖券",
    image: imgOrder1,
    dataKey: "today_approve_ticket_cnt",
    percentKey: "today_ticket_cnt_percent",
    compareText: "同比昨日",
  },
  {
    title: "今日销售额",
    image: imgOrder2,
    dataKey: "today_approve_amt",
    percentKey: "today_amt_percent",
    compareText: "同比昨日",
  },
  {
    title: "本月卖券",
    image: imgOrder3,
    dataKey: "thismonth_approve_ticket_cnt",
    percentKey: "thismonth_ticket_cnt_percent",
    compareText: "同比上月",
  },
  {
    title: "本月销售额",
    image: imgOrder4,
    dataKey: "thismonth_approve_amt",
    percentKey: "thismonth_amt_percent",
    compareText: "同比上月",
  },
];
const store = useStore();
const router = useRouter();
const query = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
  search: {
    bill_code: "", //订单号
    bill_date_begin: "",
    bill_date_end: "",
    sale_channel: "",
    unit_id: "",
    take_cell: "",
    time: "",
    bill_status: "",
    ticket_template_code: "",
    ticket_template_title: "",
    ticket_code: "",
  },
});
const activeVisible = ref(false);
const textareaActive = ref("");
const activeLoading = ref(false);

const tableModalLoading = ref(false);
const tableModalLoading1 = ref(false);
const tableVisible = ref(false);
const tableDataModal = ref([]);
const tableDataModal1 = ref([]);
const PageRowCountModal = ref(15);
const PageRowCountModal1 = ref(15);
const PageStartRowModal = ref(1);
const PageStartRowModal1 = ref(1);
const pageTotalModal = ref(0);
const pageTotalModal1 = ref(0);

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const IsRight = ref(false); //控制审核按钮
const IsRight1 = ref(false); //控制新增按钮
const IsRight2 = ref(false); //控制激活按钮
const IsRight3 = ref(false); //控制退券

//客户下拉
const customerArr = ref([]);
const approveVisible = ref(false);
const textareaApprove = ref(""); //审核不通过内容
const passLoading = ref(false);
const noPassLoading = ref(false);
const BillId = ref("");
const StatData = reactive({
  today_approve_ticket_cnt: "", //今日卖券
  today_ticket_cnt_percent: "",
  thismonth_approve_ticket_cnt: "", //本月卖券
  thismonth_ticket_cnt_percent: "",
  today_approve_amt: "", //今日已审批的销售单金额
  today_amt_percent: "", //今日销售单金额与昨日对比
  thismonth_approve_cnt: "", //本月已审批的销售单数
  thismonth_approve_amt: "", //本月已审批的销售单金额
  thismonth_cnt_percent: "", //本月销售单数与上月对比
  thismonth_amt_percent: "", //本月销售单金额与上月对比
});
//二维码
const QrCodeImg = ref("");
const QrCodeVisible = ref(false);

// 获取表格数据
const getData = async () => {
  if (query.search.time) {
    query.search.bill_date_begin = common.dateFormat(
      "YYYY-mm-dd",
      query.search.time[0]
    );
    query.search.bill_date_end = common.dateFormat(
      "YYYY-mm-dd",
      query.search.time[1]
    );
  } else {
    query.search.bill_date_begin = "";
    query.search.bill_date_end = "";
  }
  tableLoading.value = true;
  let res = await SearchTicketBillSales({
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
getData();
const BoolRight = async () => {
  let arr = [
    "approve_ticket_sale_bill",
    "edit_ticket_sale_bill",
    "active_ticket_sale_bill",
    "edit_ticket_return_bill",
  ];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.approve_ticket_sale_bill;
    IsRight1.value = res.DataMap.edit_ticket_sale_bill;
    IsRight2.value = res.DataMap.active_ticket_sale_bill;
    IsRight3.value = res.DataMap.edit_ticket_return_bill;
  }
};
//审批权限控制
BoolRight();
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
const SearchUnitesByList = async () => {
  let res = await GetUnitList({
    SearchCondition: { get_liniu: 1, unit_type_filter: "31,32" },
  });
  if (res.Code == 200) {
    customerArr.value = res.DataMap;
  }
};
SearchUnitesByList();
const handleEdit = (ID, type) => {
  common.ClosePageTag("销售单详情");
  router.push({
    path: "/ticket_sales_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
const handleOpenQr = (imgValue) => {
  if (imgValue) {
    QrCodeVisible.value = true;
    QrCodeImg.value = imgValue;
  }
};

const handlePass = (ID) => {
  approveVisible.value = true;
  textareaApprove.value = "";
  BillId.value = ID;
};
//重置领取暗码
const handleTakePass=(ID)=>{
  ElMessageBox.confirm("是否确认重置领取暗码？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res=await ResetTicketBillSaleTakePass({
        BillId:ID
      });
      if(res.Code==200){
        ElMessage.success("操作成功");
        query.PageStartRow = 1;
        getData();
      }else{
        ElMessage.error(res.Message);
      }
    })
    .catch(() => {
      //取消操作
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////
const TellVisible = ref(false);
const SendTellLoading = ref(false);
const contacts = ref(""); //联系人
const telephone = ref(""); //联系电话
const SmsTicketName = ref(""); //短信模板中的券名称

//发送短信
const handleSendTicket = async (ID, index) => {
  BillId.value = ID;
  let InfoValue = tableData.value[index];
  if (InfoValue.TakeCell) {
    //如果当前有电话，则直接发送短信
    let SmsTicketName = "";
    if (InfoValue.BillConfig) {
      SmsTicketName = JSON.parse(InfoValue.BillConfig).SmsTicketName;
    }
    let res = await SendTicketBillSaleSMSNotify({
      BillId: ID,
      Cell: InfoValue.TakeCell,
      Name: InfoValue.TakeName,
      SmsTicketName: SmsTicketName,
    });
    passLoading.value = false;
    if (res.Code == 200) {
      ElMessage.success("操作成功");
      query.PageStartRow = 1;
      getData();
    } else {
      ElMessage.error(res.Message);
    }
  } else {
    //弹框提示 输入联系人联系电话
    contacts.value = "";
    telephone.value = "";
    SmsTicketName.value = "";
    TellVisible.value = true;
  }
};
//确认发送
const SendTellBtn = async () => {
  SendTellLoading.value = true;
  if (contacts.value == "" || telephone.value == "") {
    ElMessage.error("请输入联系人或电话");
    return;
  }
  let res = await SendTicketBillSaleSMSNotify({
    BillId: BillId.value,
    Name: contacts.value,
    Cell: telephone.value,
    SmsTicketName: SmsTicketName.value,
  });
  SendTellLoading.value = false;
  if (res.Code == 200) {
    handleSearch();
    TellVisible.value = false;
    ElMessage.success("操作成功");
  } else {
    ElMessage.error(res.Message);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
//查询券明细
const handleTicket = async (ID) => {
  tableVisible.value = true;
  activeName.value = "first";
  tableDataModal.value = [];
  BillId.value = ID;
  GetTicketBillTicketTemplateDetailsData();
};
const handleActive = (ID) => {
  BillId.value = ID;
  textareaActive.value = "";
  activeVisible.value = true;
};
const activeName = ref("first");
const handleClick = (event) => {
  if (event.props.name == "second" && tableDataModal.value.length == 0) {
    //点击第二个并且当前得值为空才查询
    SearchTicketBillDetailsData();
  }
};
////////////////////////////////////////////////////////////////
const activeModalBtn = async () => {
  activeLoading.value = true;
  let res = await ActiveTicketByTicketBill({
    BillId: BillId.value,
    Remark: textareaActive.value,
  });
  activeLoading.value = false;
  if (res.Code == 200) {
    activeVisible.value = false;
    query.PageStartRow = 1;
    getData();
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};

//查询券明细列表
const SearchTicketBillDetailsData = async () => {
  tableModalLoading.value = true;
  let res = await SearchTicketBillDetails({
    PageStartRow: (PageStartRowModal.value - 1) * PageRowCountModal.value,
    PageRowCount: PageRowCountModal.value,
    NoPage: true,
    SearchCondition: {
      bill_id: BillId.value,
    },
  });
  tableModalLoading.value = false;
  if (res.Code == 200) {
    tableDataModal.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotalModal.value = res.DataMap.ToalCount;
  } else {
    ElMessage.warning(res.Message);
  }
};
const handlePageChangeModal = (val) => {
  PageStartRowModal.value = val;
  SearchTicketBillDetailsData();
};
const handleSizeChangeModal = (val) => {
  PageRowCountModal.value = val;
  SearchTicketBillDetailsData();
};
//查询券模板明细
const GetTicketBillTicketTemplateDetailsData = async () => {
  tableModalLoading1.value = true;
  let res = await GetTicketBillTicketTemplateDetails({
    GetTicketIndexScope: true,
    BillId: BillId.value,
  });
  tableModalLoading1.value = false;
  if (res.Code == 200) {
    tableDataModal1.value = res.DataMap ? res.DataMap : [];
    pageTotalModal1.value = res.DataMap.length;
  } else {
    ElMessage.warning(res.Message);
  }
};
const handlePageChangeModal1 = (val) => {
  PageStartRowModal1.value = val;
  GetTicketBillTicketTemplateDetailsData();
};
const handleSizeChangeModal1 = (val) => {
  PageRowCountModal1.value = val;
  GetTicketBillTicketTemplateDetailsData();
};
const passModalBtn = async () => {
  //通过
  passLoading.value = true;
  let res = await PassTicketBillSale({
    BillId: BillId.value,
  });
  passLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.error(res.Message);
  }
};
const noPassModalBtn = async () => {
  //不通过
  if (textareaApprove.value == "") {
    ElMessage.warning("请先输入不通过原因");
    return;
  }
  noPassLoading.value = true;
  let res = await CancelTicketBillSale({
    BillId: BillId.value,
    Remark: textareaApprove.value,
  });
  noPassLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.error(res.Message);
  }
};

//新增任务
const handleAdd = () => {
  common.ClosePageTag("销售单详情");
  router.push({
    path: "/ticket_sales_info",
    query: {
      Type: "Add",
    },
  });
};
//导出
const handleOut = () => {
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      if (query.search.time) {
        query.search.bill_date_begin = common.dateFormat(
          "YYYY-mm-dd",
          query.search.time[0]
        );
        query.search.bill_date_end = common.dateFormat(
          "YYYY-mm-dd",
          query.search.time[1]
        );
      } else {
        query.search.bill_date_begin = "";
        query.search.bill_date_end = "";
      }
      tableLoading.value = true;
      let res = await SearchTicketBillSales({
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
          let OutList = [];
          res.DataMap.Data.forEach((row) => {
            row.Details.forEach((rowD) => {
              let obj = {
                BillCode: "",
                CreateTime: "",
                UnitName: "",
                TicketCount: "",
                SaleChannel: "",
                BillStatusDesc: "",
                CreateUserName: "",
                TakeName: "",
                TakeCell: "",
                Amt: "",
                TicketTemplateCode: "",
                TicketTemplateTitle: "",
                OrgPrice: "",
                Discount: "",
                DiscountPrice: "",
                TicketIndexScope: "",
              };
              obj.SaleAmtDesc = (row.SaleAmt / 100).toFixed(2);
              obj.SaleDiscountDesc = row.SaleDiscount;
              obj.BillCode = row.BillCode;
              obj.CreateTime = row.CreateTime;
              obj.UnitName = row.UnitName;
              obj.TicketCount = row.TicketCount;
              obj.SaleChannel = row.SaleChannel;
              obj.BillStatusDesc = row.BillStatusDesc;
              obj.CreateUserName = row.CreateUserName;
              obj.TakeName = row.TakeName;
              obj.TakeCell = row.TakeCell;
              obj.Amt = (rowD.Amt / 100).toFixed(2);
              obj.TicketTemplateCode = rowD.TicketTemplateCode;
              obj.TicketTemplateTitle = rowD.TicketTemplateTitle;
              obj.TicketCountD = rowD.TicketCount;
              obj.Discount = rowD.Discount;
              obj.OrgPrice = (rowD.OrgPrice / 100).toFixed(2);
              obj.DiscountPrice = (rowD.DiscountPrice / 100).toFixed(2);
              obj.TicketIndexScope = rowD.TicketIndexScope;
              OutList.push(obj);
            });
          });
          const tHeader = [
            "单号",
            "创建时间",
            "客户名称",
            "总数",
            "整单折扣(%)",
            "整单金额(元)",
            "销售渠道",
            "状态",
            "制单人",
            "领取姓名",
            "领取电话",
            "券批次号",
            "券名称",
            "数量",
            "面值(元)",
            "折扣(%)",
            "折后价(元)",
            "券号段",
          ];
          const filterVal = [
            "BillCode",
            "CreateTime",
            "UnitName",
            "TicketCount",
            "SaleDiscountDesc",
            "SaleAmtDesc",
            "SaleChannel",
            "BillStatusDesc",
            "CreateUserName",
            "TakeName",
            "TakeCell",
            "TicketTemplateCode",
            "TicketTemplateTitle",
            "TicketCountD",
            "OrgPrice",
            "Discount",
            "DiscountPrice",
            "TicketIndexScope",
          ];
          const data = formatJson(filterVal, OutList);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "销售单数据导出" + time,
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
const StatSingleData = async () => {
  let res = await StatSingle({
    StatType: 3,
  });
  if (res.Code == 200) {
    StatData.today_approve_cnt = res.DataMap.today_approve_cnt;
    StatData.today_approve_amt = res.DataMap.today_approve_amt
      ? res.DataMap.today_approve_amt.toFixed(2)
      : 0;
    StatData.today_amt_percent = res.DataMap.today_amt_percent;
    StatData.thismonth_approve_cnt = res.DataMap.thismonth_approve_cnt;
    StatData.thismonth_approve_amt = res.DataMap.thismonth_approve_amt
      ? res.DataMap.thismonth_approve_amt.toFixed(2)
      : 0;
    StatData.thismonth_cnt_percent = res.DataMap.thismonth_cnt_percent;
    StatData.thismonth_amt_percent = res.DataMap.thismonth_amt_percent;

    StatData.today_approve_ticket_cnt = res.DataMap.today_approve_ticket_cnt
      ? res.DataMap.today_approve_ticket_cnt
      : 0;
    StatData.today_ticket_cnt_percent = res.DataMap.today_ticket_cnt_percent;
    StatData.thismonth_approve_ticket_cnt = res.DataMap
      .thismonth_approve_ticket_cnt
      ? res.DataMap.thismonth_approve_ticket_cnt
      : 0;
    StatData.thismonth_ticket_cnt_percent =
      res.DataMap.thismonth_ticket_cnt_percent;
  }
};
StatSingleData();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "销售单") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "销售单"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", {
        Search: 0,
        titlePage: "",
      });
    }
  }
);
</script>

<style scoped>
.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.card-text {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.card-text-desc {
  color: #797979;
  font-size: 16px;
  letter-spacing: 1px;
}

.card-text-number {
  color: #f56c6c;
  font-weight: 600;
  font-size: 24px;
}

.card-text-type {
  font-size: 12px;
  color: #797979;
}

.card-text-type text {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}
</style>
