<template>
  <div class="container">
    <div class="handle-box">
      <!-- 使用统计卡片组件 -->
      <TicketStatCards :statData="StatData" />
      <!-- 使用查询条件组件 -->
      <TicketSearchForm
        v-model="query.search"
        :brands="brands"
        :IsRight="IsRight"
        :IsRight1="IsRight1"
        :IsRight2="IsRight2"
        @handleSearch="handleSearch"
        @handleSend="handleSend"
        @handleSell="handleSell"
        @handleOut="handleOut"
        @handleImport="handleImport"
        @handleAdd="handleAdd"
      />
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="图片" width="120">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 90px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="TicketTemplateTypeDesc2"
        label="类型"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="TicketTemplateCode"
        label="批次号"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column align="left" label="基础信息">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="clickPicJump(scope.row.TicketTemplateId)"
            style="color: #f56c6c"
          >
            {{ scope.row.TicketTemplateTitle }}</el-link
          >
          <p>品牌：{{ scope.row.BrandName }}</p>
          <p v-if="scope.row.TicketTemplateType != 4">
            价格：{{ (scope.row.OrgPrice / 100).toFixed(2) }}&nbsp;(元)
          </p>
          <p v-else>
            折扣：{{ scope.row.TicketTemplateConfigDesc.Discount }}&nbsp;%
          </p>
          <p>有效期：{{ scope.row.ValidDateDesc }}</p>
          <p>配送期：{{ scope.row.ExchangeDateDesc2 }}</p>
          <img
            v-if="scope.row.DeliverType == 21 || scope.row.DeliverType == 22|| scope.row.DeliverType == 23"
            class="list-info-detail_1-point"
            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/pick_up_1.png"
            style="width: 86.4px; height: 13.92px"
          /> </template
      ></el-table-column>

      <!-- <el-table-column
        align="center"
        label="线下提货"
        width="90"
      >
        <template #default="scope">
          <p v-if="scope.row.DeliverType==21||scope.row.DeliverType==22">支持</p>
          <p v-else>不支持</p>
        </template>
      </el-table-column> -->

      <!-- <el-table-column
        prop="ExchangeDateDesc2"
        align="center"
        label="配送期"
        width="160"
      ></el-table-column> -->
      <el-table-column align="left" label="数量" width="120">
        <template #default="scope">
          <p>总量：{{ scope.row.TicketCount }}</p>
          <p>已兑：{{ scope.row.ExchangeCount }}</p>
          <p>销售：{{ scope.row.SaleCount }}</p>
          <p>发放：{{ scope.row.TakeCount }}</p>
          <p>退券：{{ scope.row.ReturnCount }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建信息" width="160">
        <template #default="scope">
          <p>{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              size="small"
              v-if="scope.row.CreateUnitId == loginUser.UnitId && IsRight"
              @click="handleEdit(scope.row.TicketTemplateId, 'edit')"
              >编辑
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.TicketTemplateId, 'detail')"
              >明细
            </el-button>
            <el-button
              class="button-op-del"
              size="small"
              v-if="
                scope.row.CreateUnitId == loginUser.UnitId &&
                IsRight &&
                scope.row.TicketTemplateStatus == 1
              "
              @click="handleEdit(scope.row.TicketTemplateId, 'del')"
              >删除
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              v-if="scope.row.CreateUnitId == loginUser.UnitId && IsRight"
              @click="AddTicketCountBtn(scope.row.TicketTemplateId)"
              >增发券
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              v-if="
                scope.row.CreateUnitId == loginUser.UnitId &&
                (scope.row.DeliverType == 21 || scope.row.DeliverType == 22|| scope.row.DeliverType == 23)
              "
              @click="handleEdit(scope.row.TicketTemplateId, 'point')"
              >提货门店
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              v-if="
                scope.row.CreateUnitId == loginUser.UnitId &&
                scope.row.TicketTemplateConfigDesc.CanUseInSpecialShop == '1'
              "
              @click="handleEdit(scope.row.TicketTemplateId, 'point')"
              >可使用门店
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
    <!-- 增加卡券弹出框 -->
    <el-dialog
      title="增加卡券"
      v-model="editVisible"
      width="38%"
      :show-close="false"
    >
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form
            ref="formRef"
            :model="form_modal"
            :rules="rules_modal"
            label-width="120px"
          >
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
          <el-button class="button1" :loading="BtnLoading" @click="onSaveModal"
            >保 存</el-button
          >
          <el-button class="button2" @click="editVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 选择兑换点弹出框 -->
    <el-dialog
      title="兑换点"
      class="padding_top"
      v-model="PointVisible"
      width="60%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <ticketPoint
        ref="editor"
        @selectPointValue="selectPointValue"
        :openPointTable="openPointTable"
      >
      </ticketPoint>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="pointLoading"
            @click="savePointModalBtn"
            >保 存</el-button
          >
          <el-button class="button2" @click="closePointModalBtn"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 文件导入券码弹出框 -->
    <el-dialog
      title="导入文件"
      v-model="fileNoVisible"
      width="38%"
      :show-close="false"
    >
      <div class="file-detail" style="height: 100px">
        <el-upload
          v-model:file-list="fileNoList"
          :limit="1"
          :on-exceed="handleNoExceed"
          :on-remove="handleNoRemove"
          class="ticket-detail-file-home-uploader1"
          action="#"
          :http-request="SuccessNoFile"
          :auto-upload="true"
        >
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link
                :underline="false"
                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/批次券号模板.xlsx?v=1"
                style="color: #f56c6c"
              >
                下载模板</el-link
              >
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
          <el-button
            class="button1"
            :loading="FileNoLoading"
            @click="SaveNoFileModalBtn"
            >保 存</el-button
          >
          <el-button class="button2" @click="cennelNoFileModalBtn"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Cookie from "js-cookie";
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SearchBrands,
  SearchTicketTemplates,
  GetTicketTemplateById,
  AddTicketTemplateCount,
  DeleteTicketTemplate,
} from "@/api/ticket.js";
import { StatSingle, HasRightes, SearchUnites } from "@/api/index.js";
import { AddTicketTemplatePickupUnites } from "@/api/order.js";
import { Import } from "@/api/imgapi.js";
import common from "@/utils/common.js";

import ticketPoint from "@/components/common/ticket_point.vue";

import TicketSearchForm from "@/components/ticket/TicketSearchForm.vue";
import TicketStatCards from "@/components/ticket/TicketStatCards.vue";
const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    search_keyword: "",
    ticket_template_code: "",
    ticket_template_title: "",
    display_status: "1", //状态
    brand_id: "", //品牌
    time: [], //时间
    create_date_begin: "",
    create_date_end: "",
    create_unit_id: "", //券商
    ticket_template_type: "", //类型(0:提货券;10:券包,5:现金券,6:储值卡)
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const activeIndex = ref(1);
const tableData = ref([]);
const pageTotal = ref(0);
const IsRight = ref(false); //控制创建、编辑、删除按钮
const IsRight1 = ref(false); //控制我要发券按钮
const IsRight2 = ref(false); //控制我要卖券按钮
const TicketTemplateId = ref("");
const brands = ref([]); //品牌

//* 表单增加卡券数量*//
const formRef = ref(null);
const editVisible = ref(false);
const BtnLoading = ref(false);
const form_modal = reactive({
  TicketTemplateId: "",
  TicketTemplateTitle: "",
  ValidDateDesc: "",
  TicketCount: "", //总量
  AddCount: "",
  LeftCount: "", //剩余
});
const rules_modal = {
  AddCount: [{ required: true, message: "请输入增发数量", trigger: "blur" }],
};
const StatData = reactive({
  this_year_create_cnt: "", //本年已建
  this_year_exchange_cnt: "", //本年已兑,
  today_exchange_cnt: "", //今日已兑
  today_sale_cnt: "", //今日销售
});

const BoolRight = async () => {
  //新增/修改/停用/启用/删除 券模板的批次, 新增/修改券销售单, 新增/修改券发放单
  let arr = [
    "edit_tickettemplate_batch",
    "edit_ticket_sale_bill",
    "edit_ticket_take_bill",
  ];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_tickettemplate_batch;
    IsRight1.value = res.DataMap.edit_ticket_sale_bill;
    IsRight2.value = res.DataMap.edit_ticket_take_bill;
  }
};
BoolRight();

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
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
  } else {
    query.search.create_date_begin = "";
    query.search.create_date_end = "";
  }
  let res = await SearchTicketTemplates({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach((row) => {
        row.TicketCount = common.numFormat(row.TicketCount); //券总量
        row.LeftCount = row.LeftCount;
        row.ExchangeCount = common.numFormat(row.ExchangeCount); //已兑券总量
        row.SaleCount = Number(row.SaleCount + row.TakeCount); //销售
        row.checkboxBool = false;
        row.TicketTemplateConfigDesc = JSON.parse(row.TicketTemplateConfig);
      });
    }

    tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotal.value = res.DataMap.ToalCount;
  }
};

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
    handleDel(ID);
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
  } else if (type == "point") {
    common.ClosePageTag("门店信息");
    router.push({
      path: "/ticket_point_list",
      query: {
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
//导出数据

const handleOut = () => {
  //导出
  ElMessageBox.confirm("是否确认导出？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      tableLoading.value = true;
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
      } else {
        query.search.create_date_begin = "";
        query.search.create_date_end = "";
      }
      let res = await SearchTicketTemplates({
        PageStartRow: 0,
        PageRowCount: 100000,
        SearchCondition: query.search,
        NoPage: true,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        if (!res.DataMap) {
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
            "批次号",
            "名称",
            "类型",
            "品牌",
            "价格",
            "有效期",
            "配送期",
            "总量",
            "已兑",
            "销售",
            "发放",
            "退券",
            "创建人",
            "创建单位",
            "创建时间",
            "图片",
          ];
          const filterVal = [
            "TicketTemplateCode",
            "TicketTemplateTitle",
            "TicketTemplateTypeDesc2",
            "BrandName",
            "OrgPriceDesc",
            "ValidDateDesc",
            "ExchangeDateDesc2",
            "TicketCount",
            "ExchangeCount",
            "SaleCount",
            "TakeCount",
            "ReturnCount",
            "CreateUserName",
            "CreateUnitName",
            "CreateTime",
            "ListImg",
          ];

          res.DataMap.Data.forEach((row) => {
            row.OrgPriceDesc = row.OrgPrice.toFixed(2);
          });
          const data = formatJson(filterVal, res.DataMap.Data);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "卡券列表数据导出-" + time,
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
//我要发券
const handleSend = () => {
  let storeIds = [];
  multipleSelection.value.forEach((row) => {
    storeIds.push(row.TicketTemplateId);
  });
  if (storeIds.length == 0) {
    ElMessage.info("请先选择对应的券批次！");
    return;
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
  let storeIds = [];
  multipleSelection.value.forEach((row) => {
    storeIds.push(row.TicketTemplateId);
  });
  if (storeIds.length == 0) {
    ElMessage.info("请先选择对应的券批次！");
    return;
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
        ObjectId: ID,
      });
      if (res.Code == 200) {
        ElMessage.success("删除成功");
        query.PageStartRow = 1;
        getData();
      }
    })
    .catch(() => {});
};
//点击图片跳转到券详情
const clickPicJump = (TicketTemplateId) => {
  common.ClosePageTag("卡券详情");
  router.push({
    path: "/ticket_batch_info",
    query: {
      Type: "View",
      ID: TicketTemplateId,
    },
  });
};

//增发券
const AddTicketCountBtn = (TicketTemplateId) => {
  form_modal.AddCount = "";
  editVisible.value = true;
  GetTicketTemplateByIdApi(TicketTemplateId);
};

// 提交
const onSaveModal = () => {
  // 表单校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      BtnLoading.value = true;
      let res = await AddTicketTemplateCount({
        AddCount: form_modal.AddCount,
        SaleCount: 0,
        TicketTemplateId: form_modal.TicketTemplateId,
      });
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
    StatType: 5,
  });
  if (res.Code == 200) {
    StatData.this_year_create_cnt = res.DataMap.this_year_create_cnt;
    StatData.this_year_exchange_cnt = res.DataMap.this_year_exchange_cnt;
    StatData.today_exchange_cnt = res.DataMap.today_exchange_cnt;
    StatData.today_sale_cnt = res.DataMap.today_sale_cnt;
  }
};
StatSingleData();

const PointVisible = ref(false);
const pointLoading = ref(false);
const openPointTable = ref(false);
const PickupUnites = ref(false);
const BeginDate = ref(false);
const EndaDate = ref(false);

const selectPointValue = (postVal) => {
  PickupUnites.value = postVal.list;
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
  PickupUnites.value.forEach((row) => {
    PickupArr.push(row.UnitId);
  });
  let res = await AddTicketTemplatePickupUnites({
    PickupUnitIds: PickupArr,
    TicketTemplateId: TicketTemplateId.value,
    BeginDate: BeginDate.value,
    EndaDate: EndaDate.value,
  });
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
  fileNoList.value = [];
};
const SuccessNoFile = async (param) => {
  fileNoparam.value = param;
};
const handleNoRemove = async (param) => {
  fileNoparam.value = {};
};
const handleNoExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
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
    ElMessage.success(`导入成功`);
    fileNoList.value = [];
    fileNoVisible.value = false;
    query.PageStartRow = 1;
    StatSingleData();
    getData();
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
const GetBrands = async () => {
  // 获品牌
  let res = await SearchBrands({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
  });
  if (res.Code == 200) {
    brands.value = res.DataMap.Data;
  }
};
const init = async () => {
  //六个月
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
  query.search.time = [start, end];
  query.PageStartRow = 1;
  getData();
  GetBrands();
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
const loginUser = JSON.parse(Cookie.get("User"));
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    //是否刷新
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "卡券列表") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "卡券列表"
    ) {
      query.PageStartRow = 1;
      getData();
      StatSingleData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
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
.card-img img {
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

.list-card {
}

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

::v-deep(.padding_top .el-dialog__body) {
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
