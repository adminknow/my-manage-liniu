<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <h3>
                {{
                  formData.TicketTemplateCode +
                  " " +
                  formData.TicketTemplateTitle
                }}-{{ (formData.OrgPrice / 100).toFixed(2) }}
              </h3>
              &nbsp;&nbsp;<text>总量：</text><text>{{ formData.TicketCount }}张，</text><text>&nbsp;剩余：</text><text
                style="color: #f56c6c">{{ formData.LeftCount }}张，</text><text>已兑：</text><text>{{ formData.ExchangeCount
                }}张</text>&nbsp;<text>{{
                  "有效期：" + formData.ValidDateDesc
                }}</text>&nbsp;<text v-if="
                  formData.TicketTemplateType != 5 &&
                  formData.TicketTemplateType != 6
                ">{{ "配送期：" + formData.ExchangeDateDesc }}</text>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-row>
              <el-col :span="7">
                <el-form-item label="">
                  <el-input v-model="query.search.ticket_code" clearable placeholder="输入券码">
                  </el-input> </el-form-item></el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item>
                        <el-input v-model="query.search.begin_index" placeholder="序号范围"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item>
                        <div class="detail-desc">~</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item>
                        <el-input v-model="query.search.end_index" placeholder="序号范围"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row> </el-form-item></el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="">
                  <el-select v-model="query.search.ticket_status" clearable style="width: 100%" placeholder="请选择状态">
                    <el-option label="待激活" value="0"></el-option>
                    <el-option label="已激活" value="1"></el-option>
                    <el-option label="转赠中" value="3"></el-option>
                    <el-option label="已作废" value="-1"></el-option>
                    <el-option label="待兑换" value="2"></el-option>
                    <el-option label="已兑换" value="10"></el-option>
                  </el-select> </el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="">
                  <el-input v-model="query.search.sale_bill_code" clearable placeholder="输入销售单号">
                  </el-input> </el-form-item></el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="">
                  <el-input v-model="query.search.deliver_order_code" clearable placeholder="输入配送单号">
                  </el-input> </el-form-item></el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="">
                  <el-select v-model="query.search.is_suspend" clearable style="width: 100%" placeholder="挂起状态">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                  </el-select> </el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="">
                  <el-input v-model="query.search.package_ticket_code" clearable placeholder="输入所属券包券码">
                  </el-input> </el-form-item></el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="">
                  <el-input v-model="query.search.current_unit_name" clearable placeholder="输入所属客户">
                  </el-input> </el-form-item></el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleBtn1()">批量作废
              </el-button>
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleBtn3()">批量激活
              </el-button>
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleBtn4()">批量恢复
              </el-button>
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleBtn2()">批量挂起
              </el-button>
              <el-button v-if="IsRight2" class="button2 button-float" round @click="handleBtn5()">导入有效期
              </el-button>
              <el-button v-if="IsRight1" class="button2 button-float" round @click="handleBtn7()">导入券码
              </el-button>
              <el-button class="button2 button-float" round @click="handleBtn6()">导出
              </el-button>
              <el-button class="button2 button-float" v-if="IsRight3" round @click="handleTransfer()">券转移
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
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable1"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column prop="TicketIndex" align="center" label="序号" width="90"></el-table-column>
      <el-table-column prop="" align="left" label="卡券信息">
        <template #default="scope">
          <p>券码/卡号：{{ scope.row.TicketCode }}</p>
          <div v-if="formData.ValidDateType == 1">
            <p v-if="
              scope.row.ValidBeginDate != formData.ValidDateDescIf ||
              scope.row.ValidEndDate != formData.ValidDateDescIf1
            ">
              有效期：{{
                scope.row.ValidBeginDate + `~` + scope.row.ValidEndDate
              }}
            </p>
          </div>
          <div v-else>
            有效期：{{
              scope.row.ValidBeginDate + `~` + scope.row.ValidEndDate
            }}
          </div>
          <div v-if="
            formData.TicketTemplateType != 5 &&
            formData.TicketTemplateType != 6
          ">
            <div v-if="formData.ExchangeDateType == 1">
              <p v-if="
                scope.row.ExchangeBeginDate != formData.ExchangeDateDescIf ||
                scope.row.ExchangeEndDate != formData.ExchangeDateDescIf1
              ">
                配送期：{{
                  scope.row.ExchangeBeginDate + `~` + scope.row.ExchangeEndDate
                }}
              </p>
            </div>
            <div v-else>
              配送期：{{
                scope.row.ExchangeBeginDate + `~` + scope.row.ExchangeEndDate
              }}
            </div>
          </div>
          <p>所属客户：{{ scope.row.CurrentUnitName }}</p>
          <p v-if="scope.row.PackageTicketCode">
            所属券包券码：{{ scope.row.PackageTicketCode }}
          </p>
          <p v-if="
            scope.row.TakeVipAccountId &&
            (formData.TicketTemplateType == 6 ||
              formData.TicketTemplateType == 7)
          ">
            当前余额：{{ (scope.row.TakeVipAccountAmt / 100).toFixed(2) }}元
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="销售单" align="left" width="250">
        <template #default="scope">
          <p v-if="scope.row.SaleBillCode">
            单号：{{ scope.row.SaleBillCode }}
          </p>
          <p>{{ scope.row.SaleTime }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="领取人" width="200" align="left">
        <template #default="scope">
          <p v-if="scope.row.TakeVipName">姓名：{{ scope.row.TakeVipName }}</p>
          <p v-if="scope.row.TakeVipCell">手机：{{ scope.row.TakeVipCell }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="配送单/消费订单" align="left" width="250">
        <template #default="scope">
          <p v-if="scope.row.DeliverOrderCode">
            单号：{{ scope.row.DeliverOrderCode }}
          </p>
          <p>{{ scope.row.ExchangeTime }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="后付款" align="left">
        <template #default="scope">
          <p v-if="scope.row.PayPrice > 0">金额：{{ (scope.row.PayPrice / 100).toFixed(2) }}元</p>
          <p>{{ scope.row.PayStatusDesc }}</p>
          <p v-if="scope.row.PayOrderCode">支付单号：{{ scope.row.PayOrderCode }}</p>
          <p v-if="scope.row.PayerVipName">支付人：{{ scope.row.PayerVipName + ' ' + scope.row.PayerVipCell }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="IsSuspendDesc" align="center" label="挂起" width="60"></el-table-column>
      <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="100"></el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small" v-if="IsRight"
              @click="handleViewqrCode(scope.row.QrTicketCode)">二维码
            </el-button>
            <el-button class="button-op-edit" size="small" v-if="IsRight"
              @click="handleViewPassword(scope.row.TicketId)">密码
            </el-button>
            <el-button class="button-op-edit" size="small" @click="handleLog(scope.row.TicketId)">日志
            </el-button>
            <el-button v-if="scope.row.IsSuspend == 0 && IsRight2" class="button-op-del" size="small"
              @click="handleOp(scope.row.TicketId, '3')">挂起
            </el-button>
            <el-button v-if="scope.row.TicketStatus == 0 && IsRight2" class="button-op-del" size="small"
              @click="handleOp(scope.row.TicketId, '1')">激活
            </el-button>
            <el-button v-if="scope.row.TicketStatus == -1 && IsRight2" class="button-op-del" size="small"
              @click="handleOp(scope.row.TicketId, '2')">作废
            </el-button>
            <el-button v-if="scope.row.IsSuspend == 1 && IsRight2" class="button-op-del" size="small"
              @click="handleOp(scope.row.TicketId, '4')">恢复
            </el-button>
            <el-button class="button-op-del" v-if="
              formData.TicketTemplateType == 6 ||
              formData.TicketTemplateType == 7
            " size="small" @click="ViewFlowingWater(scope.row.TicketId)">交易流水
            </el-button>
            <el-button class="button-op-view" size="small" v-if="formData.TicketTemplateType == 10"
              @click="ViewTicketPackageDetail(scope.row.TicketId)">券包的明细
            </el-button>
            <el-button class="button-op-view" size="small" v-if="IsRight2"
              @click="UpdateDate(scope.row.TicketId, scope.$index)">调整有效期
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
    <!-- 密码弹出框 -->
    <el-dialog title="密码查看" v-model="editVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-form ref="formRef" :model="form_modal" label-width="120px">
        <el-form-item label="密码查看：">
          <span>{{ form_modal.password }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="editVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 日志弹出框 -->
    <el-dialog title="券日志" v-model="logVisible" width="55%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-table height="300" :data="tableLogData" border class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <el-table-column prop="OpTime" label="时间" width="160" align="center"></el-table-column>
        <el-table-column prop="OpChannelTypeDesc" align="center" label="系统渠道"></el-table-column>
        <el-table-column prop="OpType" label="动作" align="center"></el-table-column>
        <el-table-column prop="OpUserName" align="center" label="操作人"></el-table-column>
        <el-table-column prop="OpUnitName" align="center" label="券归属"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="logVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 操作 -->
    <el-dialog :title="tip" v-model="approveVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareaApprove">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="passLoading" @click="passModalBtn">确 认</el-button>
          <el-button class="button2" @click="approveVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件导入弹出框 -->
    <el-dialog title="导入文件" v-model="fileVisible" width="38%" :show-close="false">
      <div class="file-detail" style="height: 90px">
        <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
          class="ticket-detail-file-home-uploader" action="#" :http-request="SuccessFile" :auto-upload="true">
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip" style="width: 500px">
              支持上传excel文件
              <p>
                提示：导入的文件可以从导出的文件里面进行修改,删除不需要修改的券码后导入
              </p>
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="FileLoading" @click="SaveFileModalBtn">保 存</el-button>
          <el-button class="button2" @click="cennelFileModalBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 文件导入券码弹出框 -->
    <el-dialog title="导入文件" v-model="fileNoVisible" width="38%" :show-close="false">
      <div class="file-detail" style="height: 120px">
        <el-upload v-model:file-list="fileNoList" :limit="1" :on-exceed="handleNoExceed" :on-remove="handleNoRemove"
          class="ticket-detail-file-home-uploader" action="#" :http-request="SuccessNoFile" :auto-upload="true">
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link :underline="false"
                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/券号模板.xlsx?v=2"
                style="color: #f56c6c">
                下载模板</el-link>
            </div>
            <div class="el-upload__tip">
              支持上传excel文件
              <p>状态（未激活，已激活，待兑换，已兑换）</p>
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

    <!-- 交易流水弹出框 -->
    <el-dialog class="sell-top" title="交易流水" v-model="FlowingWaterVisible" width="68%" :show-close="false">
      <flowingwatertable :ticketID="FWquery.ticket_id" :openModal="FlowingWaterVisible">
      </flowingwatertable>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="FlowingWaterVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 券包下的券明细 -->
    <el-dialog title="券包下的券明细" v-model="PackageDetailVisible" width="68%" :show-close="false">
      <el-table :data="PackageDetailTable.slice(
        (QueryPackageDetail.PageStartRow - 1) *
        QueryPackageDetail.PageRowCount,
        QueryPackageDetail.PageStartRow * QueryPackageDetail.PageRowCount
      )
        " height="300" border class="table" ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
        <el-table-column prop="CreateUnitName" align="center" label="券商" ></el-table-column>
        <el-table-column align="center" label="类型" width="160">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplate.TicketTemplateTypeDesc2 }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" align="center" label="券批次号" width="120">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplate.TicketTemplateCode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplate.TicketTemplateTitle }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="TicketCode" align="center" label="券码" width="160"></el-table-column>
        <el-table-column prop="TicketIndex" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="IsSuspendDesc" align="center" label="挂起" width="60"></el-table-column>
        <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="130"></el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="PackageDetailVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更新日期弹出框 -->
    <el-dialog title="调整有效期" v-model="DateVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-form-item label="有效期">
        <el-date-picker :default-time="defaultTime2" v-model="formDate.date1" @change="changeDatetimeRange"
          type="datetimerange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
      </el-form-item>
      <el-form-item label="配送期" v-if="
        formData.TicketTemplateType == 0 || formData.TicketTemplateType == 10
      ">
        <el-date-picker :default-time="defaultTime2" v-model="formDate.date2" type="datetimerange" range-separator="至"
          start-placeholder="开始" end-placeholder="结束" />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="UpdateDateLoading" @click="UpdateDateClick">保 存</el-button>

          <el-button class="button2" @click="DateVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <qrCode-index :Visible="showQRCode" :qrCode="qrCodeContent" @CloseVisible="showQRCode = false"></qrCode-index>
    <!-- 没有用完的卡券转移到另外一个券模板下 -->
    <transfer-components :visible="transferVisible" :fromTicketTemplateId="query.search.ticket_template_id"
      @CloseVisible="transferCloseVisible"></transfer-components>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SearchTicketes,
  GetTicketTemplateById,
  GetTicketPass,
  GetTicketOpHises,
  BatchOpTicketes,
  GetTicketesByPackageTicketId,
  UpdateTicketDate,
} from "@/api/ticket.js";
import { HasRight, HasRightes } from "@/api/index.js";
import { Import } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import flowingwatertable from "@/components/common/flowingwater_table.vue";
import transferComponents from "@/components/ticket/transfer.vue";
import qrCodeIndex from "@/components/ticket/qrCode_modal.vue";
import { useTicketDetailExport } from "@/hooks/use-export.js";
const router = useRouter();
const query = reactive({
  search: {
    ticket_template_id: "",
    begin_index: "",
    end_index: "",
    ticket_code: "",
    ticket_status: "",
    sale_bill_code: "", //销售单号
    deliver_order_code: "", //配送单号
    is_suspend: "",
    package_ticket_code: "", //券包所属券码
    current_unit_name: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const tableLogData = ref([]);
const IsRight = ref(false);
const IsRight1 = ref(false);
const IsRight2 = ref(false);
const IsRight3 = ref(false);
const multipleTable1 = ref(null);
const multipleSelection = ref([]);
const passLoading = ref(false);
const TicketIds = ref([]);
const tip = ref("");
const pageTotal = ref(0);
const formRef = ref(null);
const editVisible = ref(false);
const logVisible = ref(false);
const form_modal = reactive({
  password: "",
});

//获取详情信息
const formData = reactive({
  TicketTemplateTitle: "",
  TicketTemplateCode: "",
  OrgPrice: "",
  CreateUnitId: "",
  TicketTemplateType: "",
  ExchangeDateDesc: "", //配送期
  ExchangeDateDescIf: "",
  ExchangeDateDescIf1: "",
  ValidDateDesc: "", //有效期
  ValidDateDescIf: "",
  ValidDateDescIf1: "",
  TicketCount: "", //总数
  LeftCount: "", //剩余
  SaleCount: "", //销售
  ExchangeCount: "", //已兑
  TakeCount: "", //发放
  ValidDateType: "",
  ValidDateAdd: "",
  ExchangeDateType: "",
  ExchangeDateAdd: "",
  CustomerServiceTel: "",
});
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchTicketes({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data;
    pageTotal.value = res.DataMap.ToalCount;
  }
};
const BoolRight = async () => {
  let arr = ["view_ticket_password", "edit_tickettemplate", "edit_ticket", "move_ticket"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.view_ticket_password;
    IsRight1.value = res.DataMap.edit_tickettemplate;
    IsRight2.value = res.DataMap.edit_ticket;
    IsRight3.value = res.DataMap.move_ticket;
  }
};
//挂起 激活 作废
const approveVisible = ref(false);
const textareaApprove = ref(""); //不通过内容
const Type = ref("");
const CheckType = ref("");

// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
//券转移
const transferVisible = ref(false);
const handleTransfer = () => {
  transferVisible.value = true;
}
const transferCloseVisible = (op) => {
  transferVisible.value = false;
  if (op != 'cannel') {
    //页面要刷新
    handleSearch();
  }
}
const flag = ref(true);
const Msg = ref("");
//批量作废
const handleBtn1 = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  Type.value = 2;
  textareaApprove.value = "";
  approveVisible.value = true;
  tip.value = "批量作废";
};
//批量挂起
const handleBtn2 = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  approveVisible.value = true;
  Type.value = 3;
  textareaApprove.value = "";
  tip.value = "批量挂起";
};
//批量激活
const handleBtn3 = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  Type.value = 1;
  tip.value = "批量激活";
  textareaApprove.value = "";
  approveVisible.value = true;
};
//批量恢复
const handleBtn4 = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  Type.value = 4;
  approveVisible.value = true;
  textareaApprove.value = "";
  tip.value = "批量恢复";
};
//导入
//文件导入
const fileVisible = ref(false);
const FileLoading = ref(false);
const fileList = ref([]);
const fileparam = ref([]);
const handleBtn5 = () => {
  fileVisible.value = true;
};

const fileNoVisible = ref(false);
const FileNoLoading = ref(false);
const fileNoList = ref([]);
const fileNoparam = ref([]);
const handleBtn7 = () => {
  fileNoVisible.value = true;
};

const cennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};
const SuccessFile = async (param) => {
  fileparam.value = param;
};
const handleRemove = async (param) => {
  fileparam.value = {};
};
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
    } 个文件`
  );
};

const SaveFileModalBtn = async () => {
  let fd = new FormData();
  fd.append("file", fileparam.value.file); //传文件
  fd.append("DataType", "ChangeTicketDate"); //传文件
  fd.append("TicketTemplateId", query.search.ticket_template_id); //TicketTemplateId
  FileLoading.value = true;
  let res = await Import(fd);
  FileLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success(`导入成功`);
    fileList.value = [];
    fileVisible.value = false;
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.warning(`${res.Message}`);
  }
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
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
    } 个文件`
  );
};
const SaveNoFileModalBtn = async () => {
  let fd = new FormData();
  fd.append("file", fileNoparam.value.file); //传文件
  fd.append("DataType", "OneTicketTemplateTicketCodes"); //传文件
  fd.append("TicketTemplateId", query.search.ticket_template_id); //TicketTemplateId
  FileNoLoading.value = true;
  let res = await Import(fd);
  FileNoLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success(`导入成功`);
    fileNoList.value = [];
    fileNoVisible.value = false;
    query.PageStartRow = 1;
    getData();
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
//导出
const { handleExport } = useTicketDetailExport();
const handleBtn6 = () => {
  handleExport(formData, query, tableLoading);

};

const GetTicketOpHisesList = async (icount, List) => {
  if (flag.value && icount > 0) {
    let index = icount;
    let TicketIdsarr = [List[index - 1]];
    let res = await BatchOpTicketes({
      TicketIds: TicketIdsarr,
      OpType: Type.value,
      OpRemark: textareaApprove.value,
    });
    if (res.Code == 200) {
      icount--;
      Msg.value = "操作成功";
      if (icount > 0) {
        GetTicketOpHisesList(icount, List);
      }
    } else {
      passLoading.value = false;
      flag.value = true;
      ElMessage.error(res.Message);
    }
  }
  if (icount == 0) {
    flag.value = true;
    passLoading.value = false;
    approveVisible.value = false;
    ElMessage.success(Msg.value);
    query.PageStartRow = 1;
    getData();
  }
};
let showQRCode = ref(false);
let qrCodeContent = ref("");
const handleViewqrCode = async (qrCode) => {
  showQRCode.value = true;
  qrCodeContent.value = qrCode;
};
const handleViewPassword = async (ID) => {
  editVisible.value = true;
  form_modal.password = "";
  let res = await GetTicketPass({
    TicketId: ID,
    ReturnPass: true,
  });
  if (res.Code == 200) {
    form_modal.password = res.DataMap;
  }
};
const handleLog = async (ID) => {
  let res = await GetTicketOpHises({
    PageStartRow: 0,
    PageRowCount: 100000,
    TicketId: ID,
  });
  if (res.Code == 200) {
    logVisible.value = true;
    tableLogData.value = res.DataMap;
  }
};
//操作
const handleOp = async (ID, key) => {
  CheckType.value = "op";
  TicketIds.value = [];
  TicketIds.value.push(ID);
  switch (key) {
    case "1":
      tip.value = "激活";
      break;
    case "2":
      tip.value = "作废";
      break;
    case "3":
      tip.value = "挂起";
      break;
    case "4":
      tip.value = "恢复";
      break;
    default:
      break;
  }

  Type.value = key;
  approveVisible.value = true;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const FWquery = reactive({
  ticket_id: "",
});

const FlowingWaterVisible = ref(false);
//查看交易流水
const ViewFlowingWater = async (ID) => {
  FWquery.ticket_id = ID;
  FlowingWaterVisible.value = true;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//券包下的明细
const PackageDetailVisible = ref(false);
const PackageDetailTable = ref([]);
const QueryPackageDetail = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
});
const ViewTicketPackageDetail = async (ID) => {
  GetTicketesByPackageTicketIdApi(ID);
};
const GetTicketesByPackageTicketIdApi = async (ID) => {
  let res = await GetTicketesByPackageTicketId({
    TicketId: ID,
  });
  if (res.Code == 200) {
    PackageDetailVisible.value = true;
    PackageDetailTable.value = res.DataMap;
  } else {
    ElMessage.error(res.Message);
  }
};
const handlePackageDetailPageChange = (val) => {
  QueryPackageDetail.PageStartRow = val;
};
const handlePackageDetailSizeChange = (val) => {
  QueryPackageDetail.PageRowCount = val;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//批量通过 激活 挂起 作废 恢复
const passModalBtn = async () => {
  let TicketIdsValue = [];
  if (CheckType.value == "op") {
    //通过表格后面操作按钮单个操作
    TicketIdsValue = TicketIdsValue.concat(TicketIds.value);
  } else {
    //批量选择
    switch (Type.value) {
      case 1:
        //激活
        TicketIdsValue = ReturnTicketID("未激活", multipleSelection.value);
        break;
      case 2:
        //作废
        for (let i = 0; i < multipleSelection.value.length; i++) {
          const element = multipleSelection.value[i];
          TicketIdsValue.push(element.TicketId);
        }
        break;
      case 3:
        //挂起
        for (let i = 0; i < multipleSelection.value.length; i++) {
          const element = multipleSelection.value[i];
          TicketIdsValue.push(element.TicketId);
        }
        break;
      case 4:
        //恢复
        for (let i = 0; i < multipleSelection.value.length; i++) {
          const element = multipleSelection.value[i];
          TicketIdsValue.push(element.TicketId);
        }
        break;
      default:
        break;
    }
  }
  if (TicketIdsValue.length == 0) {
    ElMessage.error("请先选择数据，或当前数据状态不符合");
    return;
  }
  passLoading.value = true;
  let res = await BatchOpTicketes({
    TicketIds: TicketIdsValue,
    OpType: Type.value,
    OpRemark: textareaApprove.value,
  });
  passLoading.value = false;
  if (res.Code == 200) {
    approveVisible.value = false;
    handleSearch();
    ElMessage.success("操作成功");
  } else {
    ElMessage.error(res.Message);
  }
  // GetTicketOpHisesList(TicketIds.value.length, TicketIds.value);
};
const ReturnTicketID = (typeDesc, List) => {
  let ListNew = [];
  for (let i = 0; i < List.length; i++) {
    const element = List[i];
    if (element.TicketStatusDesc == typeDesc) {
      ListNew.push(element.TicketId);
    }
  }
  return ListNew;
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

//停用
const handleStop = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableUser({
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
    let res = await EnableUser({
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
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => { })
    .catch(() => { });
};
const GetTicketTemplateByIdApi = async (ID) => {
  let res = await GetTicketTemplateById({
    TicketTemplateId: ID,
    ReturnStatData: true,
  });
  if (res.Code == 200) {
    formData.TicketTemplateTitle = res.DataMap.TicketTemplateTitle;
    formData.TicketTemplateCode = res.DataMap.TicketTemplateCode;
    formData.OrgPrice = res.DataMap.OrgPrice;
    formData.ValidDateType = res.DataMap.ValidDateType;
    formData.ExchangeDateType = res.DataMap.ExchangeDateType;
    formData.CreateUnitId = res.DataMap.CreateUnitId;
    formData.TicketTemplateType = res.DataMap.TicketTemplateType;
    formData.CustomerServiceTel = res.DataMap.CustomerServiceTel;

    formData.ExchangeDateDesc = res.DataMap.ExchangeDateDesc;
    if (res.DataMap.ExchangeDateDesc.split("-") != -1) {
      formData.ExchangeDateDescIf = res.DataMap.ExchangeDateDesc.split("-")[0];
      formData.ExchangeDateDescIf1 = res.DataMap.ExchangeDateDesc.split("-")[1];
    }
    formData.ValidDateDesc = res.DataMap.ValidDateDesc;
    if (res.DataMap.ValidDateDesc.indexOf("-") != -1) {
      formData.ValidDateDescIf = res.DataMap.ValidDateDesc.split("-")[0];
      formData.ValidDateDescIf1 = res.DataMap.ValidDateDesc.split("-")[1];
    }

    formData.TicketCount = res.DataMap.TicketCount;
    formData.LeftCount = res.DataMap.LeftCount;
    formData.SaleCount = res.DataMap.SaleCount;
    formData.ExchangeCount = res.DataMap.ExchangeCount;
    formData.TakeCount = res.DataMap.TakeCount;
  }
};
if (router.currentRoute.value.query.ID) {
  //根据id来查询详情
  GetTicketTemplateByIdApi(router.currentRoute.value.query.ID);
  query.search.ticket_template_id = router.currentRoute.value.query.ID;
  query.PageStartRow = 1;
  getData();
  //审批权限控制
  BoolRight();
}
const handleSelectionChange = (val) => {
  CheckType.value = "";
  multipleSelection.value = val;
  TicketIds.value = [];
  val.forEach((row) => {
    TicketIds.value.push(row.TicketId);
  });
};
//更新日期弹框
const DateVisible = ref(false);
const UpdateDateLoading = ref(false);
const formDate = reactive({
  date1: [],
  date2: [],
});
const defaultTime2 = [
  new Date(2023, 1, 1, 0, 0, 0),
  new Date(2023, 2, 1, 23, 59, 59),
];
const defaultDate2 = [new Date(2023, 2, 1, 23, 59, 59)];
const changeDatetimeRange = async (value) => {
  if (formDate.date2.value != "") {
    return;
  }
  formDate.date2 = value;
};
const UpdateDate = (ID, indexValue) => {
  FWquery.ticket_id = ID; //临时保存ticketID
  formDate.date1 = [
    tableData.value[indexValue].ValidBeginDate.toString(),
    tableData.value[indexValue].ValidEndDate.toString(),
  ];
  formDate.date2 = [
    tableData.value[indexValue].ExchangeBeginDate.toString(),
    tableData.value[indexValue].ExchangeEndDate.toString(),
  ];
  DateVisible.value = true;
};

const UpdateDateClick = async () => {
  let ValidBeginTime = "";
  let ValidEndTime = "";
  let ExchangeBeginTime = "";
  let ExchangeEndTime = "";
  if (formDate.date1.length > 0) {
    ValidBeginTime = common.dateFormat(
      "YYYY-mm-dd HH:MM:SS",
      formDate.date1[0]
    );
    ValidEndTime = common.dateFormat("YYYY-mm-dd HH:MM:SS", formDate.date1[1]);
  }
  if (formDate.date2.length > 0) {
    ExchangeBeginTime = common.dateFormat(
      "YYYY-mm-dd HH:MM:SS",
      formDate.date2[0]
    );
    ExchangeEndTime = common.dateFormat(
      "YYYY-mm-dd HH:MM:SS",
      formDate.date2[1]
    );
  }
  UpdateDateLoading.value = true;
  let res = await UpdateTicketDate({
    TicketId: FWquery.ticket_id,
    ValidBeginTime: ValidBeginTime,
    ValidEndTime: ValidEndTime,
    ExchangeBeginTime: ExchangeBeginTime,
    ExchangeEndTime: ExchangeEndTime,
  });
  UpdateDateLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    DateVisible.value = false;
    handleSearch();
  } else {
    ElMessage.warning(res.Message);
  }
};
</script>

<style scoped>
::v-deep(.sell-top .el-dialog__body) {
  padding-top: 0 !important;
}

.detail-desc {
  text-align: center;
  width: 100%;
}
</style>
<style>
.ticket-detail-file-home-uploader {
  width: 150px;
  height: 40px;
}

.ticket-detail-file-home-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.ticket-detail-file-home-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
