<template>
  <div class="container">
    <div class="handle-box">
      <el-row class="card-box">
        <el-col :span="5">
          <div class="card">
            <el-row>
              <el-col :span="11">
                <div class="card-img">
                  <img style="width: 65px; height: 65px" src="../../assets/imgs/img-order1.png" />
                </div>
              </el-col>
              <el-col :span="13">
                <div class="card-text">
                  <div class="card-text-desc">本年已建</div>
                  <div class="card-text-number">{{StatData.this_year_create_cnt?StatData.this_year_create_cnt:'0'}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="card">
            <el-row>
              <el-col :span="11">
                <div class="card-img">
                  <img style="width: 65px; height: 65px" src="../../assets/imgs/img-order3.png" />
                </div>
              </el-col>
              <el-col :span="13">
                <div class="card-text">
                  <div class="card-text-desc">本年已兑</div>
                  <div class="card-text-number">{{ StatData.this_year_exchange_cnt ? StatData.this_year_exchange_cnt : 0 }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="card">
            <el-row>
              <el-col :span="11">
                <div class="card-img">
                  <img style="width: 65px; height: 65px" src="../../assets/imgs/img-order4.png" />
                </div>
              </el-col>
              <el-col :span="13">
                <div class="card-text">
                  <div class="card-text-desc">今日销售</div>
                  <div class="card-text-number">{{ StatData.today_sale_cnt ? StatData.today_sale_cnt : 0 }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="card">
            <el-row>
              <el-col :span="11">
                <div class="card-img">
                  <img style="width: 65px; height: 65px" src="../../assets/imgs/img-order4.png" />
                </div>
              </el-col>
              <el-col :span="13">
                <div class="card-text">
                  <div class="card-text-desc">今日已兑</div>
                  <div class="card-text-number">{{ StatData.today_exchange_cnt ? StatData.today_exchange_cnt : 0 }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <ul id="nav">
              <li v-for="(item, index) in ulData" :key="index" :index="index"
                :class="{ active: activeIndex == index, item: 'item' }" @click="selectStyle(item, index)">
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
          <el-col :span="12" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleSend()"><i
                  class="el-icon-mpdaohang"></i>&nbsp;&nbsp;我要发券
              </el-button>
              <el-button v-if="IsRight1" class="button2 button-float" round @click="handleSell()"><i
                  class="el-icon-mptianmaohaoquan"></i>&nbsp;&nbsp;我要卖券
              </el-button>
              <el-button v-if="IsRight" class="button2 button-float" round @click="handleImport()"><i
                  class="el-icon-mppinleizengjia_o"></i>&nbsp;&nbsp;导入券码</el-button>
              <el-button v-if="IsRight" class="button1 button-float" round @click="handleAdd()"><i
                  class="el-icon-mppinleizengjia_o"></i>&nbsp;&nbsp;创建卡券</el-button>
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
              <div class="tip-type" v-if="item.GoodsQty > 1&&item.TicketTemplateType==0">{{ item.GoodsQty + '选' + item.ExchangeGoodsQty }}</div>
              <div class="tip-type" style="background-color: #8c8c8c;" v-if="item.TicketTemplateType==10">券包</div>
              <div class="tip-type" v-if="item.TicketTemplateType==6">储值卡</div>
              <div class="tip-type" v-if="item.TicketTemplateType==5">现金券</div>
              <div class="checkbox-type" v-if="(item.TicketTemplateStatus == 1)">
                <el-checkbox v-model="item.checkboxBool" label="" />
              </div>
              <div class="list-info-detail_1">
                <el-row>
                  <el-col :span="5">
                    <div class="card-img" style="height:90px;align-items: flex-end;">
                      <img @click="clickPicJump( item.TicketTemplateId)" :src="item.ListImg" style="width:60px;height:60px" />
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <p class="list-info-detail_1-name">{{ item.CreateUnitName }} <text v-if="item.TicketTemplateCode">{{
                      item.TicketTemplateCode
                    }}</text></p>
                      <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="item.TicketTemplateTitle"
                      placement="top-start"
                    >
                    <p class="list-info-detail_1-title line_ellipsi">{{ item.TicketTemplateTitle }}</p>
                    </el-tooltip>
                    <p class="list-info-detail_1-time">{{ item.ValidDateDesc }}</p>
                    <img v-if="item.DeliverType==21||item.DeliverType==22" class="list-info-detail_1-point" src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/pick_up_1.png" style="width:86.4px;height:13.92px" />
                    <!-- <p class="list-info-detail_1-batch">{{ item.BatchCode }}</p> -->
                  </el-col>
                  <el-col :span="4">
                    <p class="list-info-detail_1-org_price">¥{{ (item.OrgPrice / 100).toFixed(2) }}</p>
                  </el-col>
                </el-row>
              </div>
              <div class="list-info-detail_2">
                <el-row>
                  <el-col :span="6">
                    <p class="list-info-detail_1-number">总量</p>
                    <p class="list-info-detail_1-number"><text>{{ item.TicketCount }}</text></p>
                  </el-col>
                  <!-- <el-col :span="6">
                    <p class="list-info-detail_1-number">剩余</p>
                    <p class="list-info-detail_1-number"><text>{{ item.LeftCount }}</text></p>
                  </el-col> -->
                  <el-col :span="6">
                    <p class="list-info-detail_1-number">已兑</p>
                    <p class="list-info-detail_1-number"><text>{{ item.ExchangeCount }}</text></p>
                  </el-col>
                  <el-col :span="6">
                    <p class="list-info-detail_1-number">销售</p>
                    <p class="list-info-detail_1-number"><text>{{ item.SaleCount }}</text></p>
                  </el-col>
                  <el-col :span="6">
                    <p class="list-info-detail_1-number">发放</p>
                    <p class="list-info-detail_1-number"><text>{{ item.TakeCount }}</text></p>
                  </el-col>
                </el-row>
              </div>
              <div class="list-info-detail_3">
                <el-row class="">
                  <el-col :span="6">
                    <div class="button-ticket">
                      <el-button class="button-ticket-detail" size="small"
                        @click="handleEdit(item.TicketTemplateId, 'detail')"><i
                          class="el-icon-mpmingxi"></i>&nbsp;&nbsp;明&nbsp;&nbsp;细&nbsp;
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="button-ticket">
                      <el-button class="button-ticket-edit" size="small"
                        v-if="item.CreateUnitId == User.UnitId && IsRight"
                        @click="handleEdit(item.TicketTemplateId, 'edit')">
                        <el-icon>
                          <Edit />
                        </el-icon>&nbsp;&nbsp;编&nbsp;&nbsp;辑&nbsp;
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="button-ticket">
                      <el-button v-if="item.CreateUnitId == User.UnitId && IsRight && item.TicketTemplateStatus == 1"
                        class="button-ticket-edit" size="small" @click="handleDel(item.TicketTemplateId)">
                        <el-icon>
                          <Delete />
                        </el-icon>&nbsp;&nbsp;删&nbsp;&nbsp;除&nbsp;
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="button-ticket ">
                      <el-dropdown @command="handleCommand">
                        <div class="button-ticket-more">
                          更多<el-icon>
                            <CaretRight />
                          </el-icon>
                        </div>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item :command="ticketDetial('detail', item.TicketTemplateId)">券详情
                            </el-dropdown-item>
                            <el-dropdown-item v-if="item.CreateUnitId == User.UnitId&&IsRight"
                              :command="ticketDetial('add', item.TicketTemplateId)">增发券
                            </el-dropdown-item>
                            <el-dropdown-item v-if="item.CreateUnitId == User.UnitId&&(item.DeliverType==21||item.DeliverType==22)"
                              :command="ticketDetial('point', item.TicketTemplateId)">提货点
                            </el-dropdown-item>
                            <!-- <el-dropdown-item v-if="item.CreateUnitId == User.UnitId"
                              :command="ticketDetial('addpoint', item.TicketTemplateId)">添加提货点
                            </el-dropdown-item> -->
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
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
    <!-- 增加卡券弹出框 -->
    <el-dialog title="增加卡券" v-model="editVisible" width="38%" :show-close="false">
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form ref="formRef" :model="form_modal" :rules="rules_modal" label-width="120px">
            <el-form-item label="卡券名称">
              <span>{{ form_modal.TicketTemplateTitle }}</span>
            </el-form-item>
            <el-form-item label="有效期">
              <span>{{ form_modal.ValidDateDesc }}</span>
            </el-form-item>
            <el-form-item label="券总量">
              <span>{{ form_modal.TicketCount }}</span>
            </el-form-item>
            <el-form-item label="券剩余">
              <span>{{ form_modal.LeftCount }}</span>
            </el-form-item>
            <el-form-item prop="AddCount" label="增加数量">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="form_modal.AddCount">
                    <template #append>张</template>
                  </el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="BtnLoading" @click="onSaveModal">保 存</el-button>
          <el-button class="button2" @click="editVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 选择兑换点弹出框 -->
    <el-dialog title="兑换点" class="padding_top" v-model="PointVisible" width="60%" :show-close="false" :close-on-click-modal="false">
      <ticketPoint ref="editor" @selectPointValue="selectPointValue" :openPointTable="openPointTable">
      </ticketPoint>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="pointLoading" @click="savePointModalBtn">保 存</el-button>
          <el-button class="button2" @click="closePointModalBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件导入券码弹出框 -->
    <el-dialog title="导入文件" v-model="fileNoVisible" width="38%" :show-close="false">
    <div class="file-detail" style="height: 100px;">
        <el-upload v-model:file-list="fileNoList" :limit="1" :on-exceed="handleNoExceed" :on-remove="handleNoRemove"
            class="ticket-detail-file-home-uploader1" action="#" :http-request="SuccessNoFile" :auto-upload="true">
            <el-button class="button1" round>
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                &nbsp;&nbsp;上传文件
            </el-button>
            <template #tip>
                <div class="el-upload__tip">
                    <el-link :underline="false" href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/批次券号模板.xlsx"
                        style="color: #f56c6c">
                        下载模板</el-link>
                </div>
                <div class="el-upload__tip">
                    支持上传excel文件
                    <p>状态（已作废，未激活，已激活，待兑换，已兑换）</p>
                </div>
            </template>
        </el-upload>
    </div>
    <template #footer>
        <span class="dialog-footer">
            <el-button class="button1" :loading="FileNoLoading" @click="SaveNoFileModalBtn">保 存</el-button>
            <el-button class="button2" @click="cennelNoFileModalBtn">关 闭</el-button>
        </span>
    </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Cookie from "js-cookie";
import { ref, reactive,watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchTicketTemplates, GetTicketTemplateById, AddTicketTemplateCount, DeleteTicketTemplate } from "@/api/ticket.js";
import { StatSingle, HasRightes } from "@/api/index.js";
import { AddTicketTemplatePickupUnites } from "@/api/order.js";
import { Import } from "@/api/imgapi.js";
import common from "@/utils/common.js";

import ticketPoint from "@/components/common/ticket_point.vue";

const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    search_keyword: "",
    display_status: "1",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const ulData = reactive([
  { value: "", key: "全部卡券" },
  { value: "1", key: "有效中" },
  { value: "2", key: "已过期" },
  { value: "3", key: "已取消" },
]);
const activeIndex = ref(1);
const tableData = ref([]);
const pageTotal = ref(0);
const IsRight = ref(false);//控制创建、编辑、删除按钮
const IsRight1 = ref(false);//控制我要发券按钮
const IsRight2 = ref(false);//控制我要卖券按钮
const TicketTemplateId = ref("");

//* 表单增加卡券数量*//
const formRef = ref(null);
const editVisible = ref(false);
const BtnLoading = ref(false);
const form_modal = reactive({
  TicketTemplateId: "",
  TicketTemplateTitle: "",
  ValidDateDesc: "",
  TicketCount: "",//总量
  AddCount: "",
  LeftCount: "",//剩余
});
const rules_modal = {
  AddCount: [{ required: true, message: "请输入增发数量", trigger: "blur" }],
};
const StatData = reactive({
  this_year_create_cnt: "",//本年已建
  this_year_exchange_cnt: "",//本年已兑,
  today_exchange_cnt: "",//今日已兑
  today_sale_cnt: "",//今日销售
});

const BoolRight = async () => {
  //新增/修改/停用/启用/删除 券模板的批次, 新增/修改券销售单, 新增/修改券发放单
  let arr = ["edit_tickettemplate_batch", "edit_ticket_sale_bill", "edit_ticket_take_bill"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_tickettemplate_batch;
    IsRight1.value = res.DataMap.edit_ticket_sale_bill;
    IsRight2.value = res.DataMap.edit_ticket_take_bill;
  }
};
BoolRight();
//* 操作*//
const selectStyle = async (item, index) => {
  activeIndex.value = index;
  if (index !== 0) {
    query.search.display_status = index
  } else {
    query.search.display_status = ""
  }
  query.PageStartRow = 1;
  getData();
};
// 获取表格数据
const getData = async () => {
  let res = await SearchTicketTemplates({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach(row => {
        row.TicketCount = common.numFormat(row.TicketCount);//券总量
        row.LeftCount = row.LeftCount;
        row.ExchangeCount = common.numFormat(row.ExchangeCount);//已兑券总量
        row.SaleCount = Number(row.SaleCount + row.TakeCount);//销售
        row.checkboxBool = false;
      })
    }
    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();
// 获取单个券模板信息
const GetTicketTemplateByIdApi = async (ObjectId) => {
  let res = await GetTicketTemplateById({
    TicketTemplateId: ObjectId,
    ReturnStatData: true,
  });
  if (res.Code == 200) {
    form_modal.TicketTemplateId = ObjectId;
    form_modal.TicketTemplateTitle = res.DataMap.TicketTemplateTitle;
    form_modal.ValidDateDesc = res.DataMap.ValidDateDesc;
    form_modal.TicketCount = res.DataMap.TicketCount;
    form_modal.LeftCount = res.DataMap.LeftCount;
  }
};
// 查询操作
const inputHandleSearch = (value) => {
  query.search.search_keyword = value;
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

const handleEdit = (ID, type) => {
  if (type === "del") {
    handleDel(ID)
  } else if (type === "detail") {
    common.ClosePageTag("券明细");
    router.push({
      path: "/detail",
      query: {
        ID: ID,
      },
    });
  } else if (type === "edit") {
    common.ClosePageTag("卡券详情");
    router.push({
      path: "/ticket_batch_info",
      query: {
        Type: "Edit",
        ID: ID,
      },
    });
  }
};

//新增任务
const handleAdd = () => {
  common.ClosePageTag("卡券详情");
  router.push({
    path: "/ticket_batch_info",
    query: {
        Type: "Add",
      },
  });
};
//我要发券
const handleSend = () => {
  let storeIds = []
  tableData.value.forEach(row => {
    if (row.checkboxBool) {
      storeIds.push(row.TicketTemplateId)
    }
  })
  if (storeIds.length == 0) {
    ElMessage.info("请先选择对应的券批次！");
    return
  }
  store.commit("ticket/setTickets", storeIds);
  router.push({
    path: "/ticket_send_info",
    query: {
      isBatch: 1,
      Type: "Add",
    },
  });
};
//我要卖券
const handleSell = () => {
  let storeIds = []
  tableData.value.forEach(row => {
    if (row.checkboxBool) {
      storeIds.push(row.TicketTemplateId)
    }
  })
  if (storeIds.length == 0) {
    ElMessage.info("请先选择对应的券批次！");
    return
  }
  store.commit("ticket/setTickets", storeIds);
  router.push({
    path: "/ticket_sales_info",
    query: {
      isBatch: 1,
      Type: "Add",
    },
  });
};

const handleDel = (ID) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DeleteTicketTemplate({
        ObjectId: ID
      })
      if (res.Code == 200) {
        ElMessage.success("删除成功");
        query.PageStartRow = 1;
        getData();
      }
    })
    .catch(() => { });
};
//点击图片跳转到券详情
const clickPicJump = (TicketTemplateId) =>{
  common.ClosePageTag("卡券详情");
    router.push({
      path: "/ticket_batch_info",
      query: {
        Type: "View",
        ID: TicketTemplateId,
      },
    });
}
const handleCommand = (command) => {
  if (command.key === "add") {
    form_modal.AddCount = "";
    editVisible.value = true;
    GetTicketTemplateByIdApi(command.TicketTemplateId)
  }
  if (command.key === "detail") {
    common.ClosePageTag("卡券详情");
    router.push({
      path: "/ticket_batch_info",
      query: {
        Type: "View",
        ID: command.TicketTemplateId,
      },
    });
  }
  if (command.key === "point") {
    common.ClosePageTag("门店信息");
    router.push({
      path: "/ticket_point_list",
      query: {
        ID: command.TicketTemplateId,
      },
    });
  }
  if (command.key === "addpoint") {
    PointVisible.value = true;
    openPointTable.value = true;
    TicketTemplateId.value = command.TicketTemplateId;
  }
};
const ticketDetial = (type, TicketTemplateId) => {
  return {
    TicketTemplateId: TicketTemplateId,
    key: type
  }
}
// 提交
const onSaveModal = () => {
  // 表单校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      BtnLoading.value = true;
      let res = await AddTicketTemplateCount({ AddCount: form_modal.AddCount, SaleCount: 0, TicketTemplateId: form_modal.TicketTemplateId });
      BtnLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("保存成功");
        editVisible.value = false;
        query.PageStartRow = 1;
        StatSingleData();
        getData();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const StatSingleData = async () => {
  let res = await StatSingle({
    StatType: 5
  })
  if (res.Code == 200) {
    StatData.this_year_create_cnt = res.DataMap.this_year_create_cnt;
    StatData.this_year_exchange_cnt = res.DataMap.this_year_exchange_cnt;
    StatData.today_exchange_cnt = res.DataMap.today_exchange_cnt;
    StatData.today_sale_cnt = res.DataMap.today_sale_cnt;
  }
};
StatSingleData();
const User = JSON.parse(Cookie.get("User"));

const PointVisible = ref(false);
const pointLoading = ref(false);
const openPointTable = ref(false);
const PickupUnites = ref(false);
const BeginDate = ref(false);
const EndaDate = ref(false);

const selectPointValue = (postVal) => {
  PickupUnites.value = postVal.list
  if (postVal.type == "begin") {
    BeginDate.value = postVal.dateValue1;
  }
  if (postVal.type == "end") {
    EndaDate.value = postVal.dateValue2;
  }
};
//保存已选择的提货点
const savePointModalBtn = async () => {
  pointLoading.value = true;
  let PickupArr = [];
  PickupUnites.value.forEach(row => {
    PickupArr.push(row.UnitId);
  })
  let res = await AddTicketTemplatePickupUnites({
    PickupUnitIds: PickupArr,
    TicketTemplateId: TicketTemplateId.value,
    BeginDate: BeginDate.value,
    EndaDate: EndaDate.value,
  })
  pointLoading.value = false;
  openPointTable.value = false;
  if (res.Code == 200) {
    PointVisible.value = false;
    ElMessage.success(res.DataMap);
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.info(res.Message);
    return;
  }
};
const closePointModalBtn = () => {
  openPointTable.value = false;
  PointVisible.value = false;
};

const fileNoVisible = ref(false);
const FileNoLoading = ref(false);
const fileNoList = ref([]);
const fileNoparam = ref([]);
const handleImport = () => {
    fileNoVisible.value = true;
};
const cennelNoFileModalBtn = async () => {
    fileNoVisible.value = false;
    fileNoList.value = []
};
const SuccessNoFile = async (param) => {
    fileNoparam.value = param;
};
const handleNoRemove = async (param) => {
    fileNoparam.value = {}
};
const handleNoExceed = async (files, fileList) => {
    ElMessage.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
};
const SaveNoFileModalBtn = async () => {
    let fd = new FormData();
    fd.append("file", fileNoparam.value.file); //传文件
    fd.append("DataType", "MultiTicketTemplateTicketCodes"); //传文件
    fd.append("TicketTemplateId", query.search.ticket_template_id); //TicketTemplateId
    FileNoLoading.value = true;
    let res = await Import(fd);
    FileNoLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success(`导入成功`)
        fileNoList.value = []
        fileNoVisible.value = false;
        query.PageStartRow = 1;
        StatSingleData();
        getData();
    } else {
        ElMessage.warning(`${res.Message}`)
    }
};
watch(
  () => router.currentRoute.value,
  (data) => {
    //是否刷新
      let isRenovate=0;
      store.state.tags.tagsList.forEach(row => {
        if(row.title=="我的卡券"){
          isRenovate=1
        }
      });
      if (store.state.tags.pageSaerch.Search == 1 &&isRenovate==1&& store.state.tags.pageSaerch.titlePage == "我的卡券") {
        query.PageStartRow = 1;
        getData();
        StatSingleData();
        store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
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
  height: 150px;
}
.card-img img{
  cursor: pointer;
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
  float: left;
  width: 33%;
  border-radius: 10px;
}

.list-info-detail {
  border-radius: 10px;
  position: relative;
  margin: 0 20px 20px 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
  -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
}

.tip-type {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f56c6c;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 12px;
  color: #fff;
  line-height: 22px;
  width: 60px;
  text-align: center;
  height: 22px;
  letter-spacing: 1px;
}

.checkbox-type {
  position: absolute;
  top: 10px;
  right: 30px;
}

.list-info-detail_1 {
  height: 100px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #fff;
}

.list-info-detail_2 {
  height: 50px;
  background-color: #fff;
}

.list-info-detail_3 {
  background-color: #fef0f0;
  height: 50px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.list-info-detail_1-name {
  font-size: 14px;
  color: #545353;
  margin-top: 18px;
}

.list-info-detail_1-title {
  color: #252525;
  font-size: 16px;
  margin-top: 4px;
  cursor: pointer;
}

.list-info-detail_1-time {
  color: #818181;
  font-size: 12px;
  margin-top: 4px;
}
.list-info-detail_1-point {
  color: #818181;
  font-size: 12px;
  color: #f56c6c;
}

.list-info-detail_1-org_price {
  color: #e47370;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 120px;
  align-items: flex-end;
}

.list-info-detail_1-number {
  text-align: center;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
}

.list-info-detail_1-number text {
  font-weight: 600;
  font-size: 14px;
}

.button-ticket {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.button-ticket-more {
  color: #f56c6c;
  font-size: 14px;
}

.button-ticket-more i {
  position: relative;
  top: 2px;
}

::v-deep(.padding_top .el-dialog__body)  {
  padding-top: 10px !important;
}
</style>
<style>
.ticket-detail-file-home-uploader {
    width: 150px;
    height: 40px;
}

.ticket-detail-file-home-uploader1 .el-upload {
    width: 150px !important;
    height: 40px !important;
    border: none !important;
    justify-content: start !important;
}

.ticket-detail-file-home-uploader1 .el-upload__tip {
    width: 300px;
    padding-left: 5px;
}
</style>