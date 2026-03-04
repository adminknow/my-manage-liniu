<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <ul id="nav">
              <li v-for="(item, index) in ulData" :key="index" :index="index"
                :class="{ active: activeIndex == index, item: 'item' }" @click="selectStyle(item.value, index)">
                {{ item.key }}
              </li>
            </ul>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" @input="inputHandleSearch" class="input-with-icon"
                clearable>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight1" class="button1 button-float" round @click="handleAdd()">我要发券
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="list-card" v-if="tableData.length > 0">
          <div class="list-info" v-for="(item, index) in tableData" :key="index">
            <div class="list-info-detail">
              <div class="list-info-detail-info">
                <el-row>
                  <el-col :span="2">
                    <div class="card-img">
                      <img
                        :src="item.TakeWxxcxQRCode ? item.TakeWxxcxQRCode : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png'"
                        style="width:80px;height:80px"
                        @click="handleOpenQr(item.TakeWxxcxQRCode ? item.TakeWxxcxQRCode : '')" />
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        创建时间
                      </div>
                      <div class="list-info-detail-info-tr">
                        {{ item.CreateTime }}
                      </div>
                      <div class="list-info-detail-info-tr">
                        {{ item.CreateUnitName }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        发券备注
                      </div>
                      <div class="list-info-detail-info-tr">
                        {{ item.TakeRemark }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        卡券
                      </div>
                      <div class="list-info-detail-info-tr" style="width: 100%">
                        <div v-for="(obj, index) in item.TicketTemplateDetails" :key="index">
                          {{ obj.TicketTemplateCode + '-' + obj.TicketTemplateTitle + " ×" + obj.TicketCount  }}</div>
                        <p>总数：{{ item.TicketCount + "张" }}</p>
                      </div>
                    </div>
                  </el-col>
                  <!-- <el-col :span="2">
                      <div class="list-info-detail-info-th flex-col justify-center items-center ">
                        <div class="list-info-detail-info-td">
                          发券人员
                        </div>
                        <div class="list-info-detail-info-tr">
                          {{item.TakeRemark}}
                        </div>
                      </div>
                    </el-col> -->
                  <el-col :span="2">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        发券类型
                      </div>
                      <div class="list-info-detail-info-tr">
                        {{ item.TakeTypeDesc }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        领取进度({{ item.TakePercent }}%)
                      </div>
                      <div class="list-info-detail-info-tr" style="width:100%;text-align:center;">
                        <div style="height:15.67px"></div>
                        <el-progress :percentage="item.TakePercent" :show-text="false" />
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        未领(张)
                      </div>
                      <div class="list-info-detail-info-tr send-number">
                        {{ item.TicketCount - item.TakenCount }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        状态
                      </div>
                      <div class="list-info-detail-info-tr">
                        {{ item.BillStatusDesc }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="list-info-detail-info-th flex-col justify-center items-center ">
                      <div class="list-info-detail-info-td">
                        操作
                      </div>
                      <div class="list-info-detail-info-tr send-number">
                        <div class="button-mgl">
                          <el-button v-if="(item.BillStatus == 0 && loginUser.UnitId == item.CreateUnitId && IsRight)"
                            class="button-op-edit" size="small" @click="handlePass(item.BillId)">审核
                          </el-button>
                          <el-button v-if="(item.BillStatus == 0 && loginUser.UnitId == item.CreateUnitId && IsRight1)"
                            class="button-op-edit" size="small" @click="handleEdit(item.BillId, 'Edit')">编辑
                          </el-button>
                          <el-button class="button-op-edit" size="small" @click="handleDetail(item.BillId)">详情
                          </el-button>
                          <el-button class="button-op-edit" size="small" @click="handleTicket(item.BillId)">券明细
                          </el-button>
                          <el-button v-if="item.BillStatus == 1 && item.TakeType == 3 && item.SmsNotify == 1"
                            class="button-op-edit" size="small" @click="handleSMSNotify(item.BillId)">发送领取短信
                          </el-button>
                          <el-button v-if="item.BillStatus == 1 && item.TakeType == 3 && item.EmailNotify == 1"
                            class="button-op-edit" size="small" @click="handleEmailNotify(item.BillId)">发送领取邮件
                          </el-button>
                          <el-button
                            v-if=" item.BillStatus == 1&& loginUser.UnitId == item.CreateUnitId && IsRight2"
                            class="button-op-del" size="small" @click="handleActive(item.BillId)">激活券
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </el-col>

                </el-row>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="当前暂无数据" />
      </el-col>
    </el-row>
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
      <div style="width:100%;text-align: center">
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
      <el-table :data="tableDataModal" height="400" border class="table" v-loading="tableLoading" ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="120"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" label="名称" align="center"></el-table-column>
            <el-table-column prop="TicketIndex" align="center" label="序号" width="60"></el-table-column>
            <el-table-column prop="TicketCode" align="center" label="券码"></el-table-column>
            <el-table-column prop="IsSuspendDesc" align="center" label="挂起" width="60"></el-table-column>
            <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="130"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="PageStartRowModal"
          v-model:page-size="PageRowCountModal" :page-sizes="[15, 50, 100]" :total="pageTotalModal"
          @current-change="handlePageChangeModal" @size-change="handleSizeChangeModal"></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="tableVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 操作 -->
    <el-dialog title="激活发放单下的券" v-model="activeVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareaActive">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="activeLoading" @click="activeModalBtn">确 认</el-button>
          <el-button class="button2" @click="activeVisible = false">关 闭</el-button>
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
import { DisableTicketTemplate} from "@/api/ticket.js";
import { SearchTicketBillTakes,ActiveTicketByTicketBill,PassTicketBillTake,CancelTicketBillTake ,SendTicketTakeSMSNotify,SendTicketTakeEmailNotify,SearchTicketBillDetails} from "@/api/bill.js";
import { HasRightes } from "@/api/index.js";
import common from "@/utils/common.js";
const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    search_keyword: "",
    bill_status: "0",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const ulData = reactive([
  { value: "0", key: "待审核" },
  { value: "1", key: "领取中" },
  { value: "20", key: "已领取" },
  { value: "-1", key: "已取消" },
]);
const activeIndex = ref(0);
const tableData = ref([]);
const pageTotal = ref(0);
const IsRight = ref(false);//控制审批按钮
const IsRight1 = ref(false);//控制新建按钮
const IsRight2 = ref(false);//控制激活按钮

const tableLoading = ref(false);
const tableVisible = ref(false);
const PageRowCountModal = ref(15);
const PageStartRowModal = ref(1);
const pageTotalModal = ref(0);
const tableDataModal = ref([]);


const BillID = ref("");
const approveVisible = ref(false);
const textareaApprove = ref("");//审核不通过内容
const passLoading = ref(false);
const noPassLoading = ref(false);

//二维码
const QrCodeImg = ref("");
const QrCodeVisible = ref(false);
//* 操作*//
const selectStyle = async (value, index) => {
  activeIndex.value = index;
  if (index !== 0) {
    query.search.bill_status = value
  } else {
    query.search.bill_status = "0"
  }
  query.PageStartRow = 1;
  getData();
};
// 获取表格数据
const getData = async () => {
  let res = await SearchTicketBillTakes({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();
const BoolRight = async () => {
  let arr = ["approve_ticket_take_bill", "edit_ticket_take_bill", "active_ticket_take_bill"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.approve_ticket_take_bill;
    IsRight1.value = res.DataMap.edit_ticket_take_bill;
    IsRight2.value = res.DataMap.active_ticket_take_bill;
  }
};
//审批权限控制
BoolRight()
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const handleShow = () => { };
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
const handlePageChangeModal = (val) => {
  PageStartRowModal.value = val;
  SearchTicketBillDetailsData();
};
const handleSizeChangeModal = (val) => {
  PageRowCountModal.value = val;
  SearchTicketBillDetailsData();
};

const handleEdit = (ID, type) => {
  if (type === "del") {
    handleDel(ID)
  } else if (type === "detail") {
    router.push({
      path: "/detail",
      query: {
        ID: ID,
      },
    });
  } else if (type === "Edit") {
    common.ClosePageTag("发券详情");
    router.push({
      path: "/ticket_send_info",
      query: {
        Type: type,
        ID: ID,
      },
    });
  }
};
//发券明细
const handleDetail = (ID) => {
  common.ClosePageTag("发券明细");
  router.push({
    path: "/ticket_send_detail",
    query: {
      ID: ID,
    },
  });
};
//发送短信
const handleSMSNotify = async (ID) => {
  let res = await SendTicketTakeSMSNotify({
    BillId: ID,
    Cell: ""
  })
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.warning(res.Message);
  }
};
//发送邮件
const handleEmailNotify = async (ID) => {
  let res = await SendTicketTakeEmailNotify({
    BillId: ID,
    Email: ""
  })
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.warning(res.Message);
  }
};
const handleOpenQr = (imgValue) => {
  if (imgValue) {
    QrCodeVisible.value = true;
    QrCodeImg.value = imgValue
  }

};
//查询券明细
const handleTicket = async (ID) => {
  tableVisible.value = true;
  BillID.value = ID;
  SearchTicketBillDetailsData()
};
//查询券明细列表
const SearchTicketBillDetailsData = async () => {
  tableLoading.value = true;
  let res = await SearchTicketBillDetails({
    PageStartRow: (PageStartRowModal.value - 1) * PageRowCountModal.value,
    PageRowCount: PageRowCountModal.value,
    NoPage: true,
    SearchCondition: {
      bill_id: BillID.value
    }
  })
  tableLoading.value = false;
  if (res.Code == 200) {
    tableDataModal.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotalModal.value = res.DataMap.ToalCount;
  } else {
    ElMessage.warning(res.Message);
  }
};
//我要发券
const handleAdd = () => {
  common.ClosePageTag("发券详情");
  router.push({
    path: "/ticket_send_info",
    query: {
      Type: "Add",
    },
  });
};
////////////////////////////////////////////////////////////////
//激活
const activeVisible = ref(false);
const activeLoading = ref(false);
const textareaActive = ref("");
const handleActive = (ID) => {
  BillID.value = ID;
  textareaActive.value = "";
  activeVisible.value = true;
};
const activeModalBtn = async () => {
  activeLoading.value = true;
  let res = await ActiveTicketByTicketBill({
    BillId: BillID.value,
    Remark: textareaActive.value,
  });
  activeLoading.value = false;
  if (res.Code == 200) {
    activeVisible.value = false;
    handleSearch()
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};
////////////////////////////////////////////////////////////////
// 查询操作
const inputHandleSearch = (value) => {
  query.search.search_keyword = value;
  query.PageStartRow = 1;
  getData();
};
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DisableTicketTemplate({
        ObjectId: ID
      })
      if (res.Code == 200) {
        ElMessage.success("删除成功");
      }
    })
    .catch(() => { });
};

const ticketDetial = (type, TicketTemplateId) => {
  return {
    TicketTemplateId: TicketTemplateId,
    key: type
  }
}
const handlePass = (ID) => {
  BillID.value = ID
  approveVisible.value = true
  textareaApprove.value = "";

}
const handleNo = (ID) => {
  BillID.value = ID
  approveVisible.value = true
  textareaApprove.value = "";
  // ElMessageBox.confirm("确定不通过？", "提示", {
  //   type: "warning",
  //   cancelButtonClass: "button2",
  //   confirmButtonClass: "button1",
  // })
  //   .then(async () => {

  //   })
  //   .catch(() => { });
}
const passModalBtn = async () => {
  //通过
  passLoading.value = true;
  let res = await PassTicketBillTake({
    BillId: BillID.value
  })
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
  let res = await CancelTicketBillTake({
    BillId: BillID.value,
    Remark: textareaApprove.value
  })
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
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach(row => {
      if (row.title == "发券单") {
        isRenovate = 1
      }
    });
    if (store.state.tags.pageSaerch.Search == 1 && isRenovate == 1 && store.state.tags.pageSaerch.titlePage == "发券单") {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", {
        Search: 0, titlePage: ""
      });
    }
  },
);

</script>
  
<style scoped>
.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100px;
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

#nav {
  list-style-type: none;
  border: solid 1px #dcdfe6;

  border-radius: 4px;
}

.item {
  display: inline-block;
  letter-spacing: 1px;
  width: 25%;
  height: 31px;
  line-height: 31px;
  text-align: center;
  font-size: 14px;
  color: #6a6a6a;
}

.active {
  background-color: #f56c6c;
  color: white;
}

.list-card {}

.list-info {
  width: 100%;
}

.list-info-detail {
  position: relative;
  padding: 10px 0;
  margin: 0 0 20px 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
  -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
}

.list-info-detail-info {
  margin: 0 10px;
  /* height: 100px; */
}

.list-info-detail-info-th {
  /* height: 90px; */
  margin-top: 16px;
}

.list-info-detail-info-td {
  margin-bottom: 10px;
  color: #909399;
}

.send-number {
  font-size: 16px;
  color: #f56c6c;
  font-weight: 600;
}
</style>