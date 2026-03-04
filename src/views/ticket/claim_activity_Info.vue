<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
      <el-row style="margin-top: 10px">
        <el-col class="send-local" :span="12">发券信息</el-col>
        <el-col class="send-local" :span="12" v-if="!form.AddStaffByCell">领取名单</el-col>
      </el-row>
      <el-row style="margin-top: 30px; padding-bottom: 100px">
        <el-col :span="12">
          <el-row>
            <el-col :span="20">
              <el-form-item label="标题" prop="BillTitle">
                <el-input maxlength="50" show-word-limit v-model="form.BillTitle" :autosize="{ minRows: 2, maxRows: 4 }"
                  type="textarea" :disabled="Type == 'View'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="活动时间" prop="time">
                <el-date-picker :disabled="Type == 'View'" :default-time="defaultTime2" v-model="form.time"
                  type="datetimerange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.BillStatus == 0 || Type == 'View'">
            <el-col :span="20">
              <el-form-item label="通过手机号匿名领取">
                <el-switch :disabled="Type == 'View'" v-model="form.AddStaffByCell" inline-prompt active-text="是"
                  inactive-text="否" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="9">
              <el-form-item label="券模板背景高度">
                <el-input v-model="form.xcxConfiguration.TicketHeight" :disabled="Type == 'View'"> <template
                    #append>px</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-form-item label="券模板文字大小">
                <el-input v-model="form.xcxConfiguration.TicketFontSize" :disabled="Type == 'View'"> <template
                    #append>px</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-form-item label="按钮高度">
                <el-input v-model="form.xcxConfiguration.TakeButtonHeight" :disabled="Type == 'View'"> <template
                    #append>px</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-form-item label="按钮宽度">
                <el-input v-model="form.xcxConfiguration.TakeButtonWeight" :disabled="Type == 'View'"> <template
                    #append>px</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-form-item label="'立即领取'大小">
                <el-input v-model="form.xcxConfiguration.TakeButtonFontSize" :disabled="Type == 'View'"> <template
                    #append>px</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="小程序背景色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.BGColor" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="券模板名称背景色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.TicketBGColor" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="券模板名称颜色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.TicketColor" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="按钮背景色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.TakeButtonBGColor" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="'立即领取'颜色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.TakeButtonFontColor" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="'可购买商品' 颜色">
                <el-color-picker :disabled="Type == 'View'" v-model="form.xcxConfiguration.BuyTextColor" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="展示可使用商品">
                <el-switch v-model="form.xcxConfiguration.ShowCommodity" inline-prompt active-text="开"
                  inactive-text="关" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="20" style="height: 260px">
              <el-form-item label="背景图片">
                <el-upload class="b-ground-uploader" ref="upload" :show-file-list="false" action="#"
                  :http-request="SuccessImg" :auto-upload="true">
                  <img v-if="form.MainImage" :src="form.MainImage" class="b-ground-uploader-avatar" />
                  <i v-else class="el-icon-mpzengjia"></i>
                  <template #tip>
                    <div class="el-upload__tip" style="width: 400px; margin-top: 0">
                      建议尺寸例:400*375,支持格式: .jpg .png不能超过20MB
                      <span v-if="form.MainImage" @click="previewImg(form.MainImage)"
                        style="color: #f56c6c;cursor: pointer;" class="el-upload__tip">预览</span>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="10">
              <el-form-item label="邮件通知">
                <el-switch
                  v-model="form.EmailNotify"
                  inline-prompt
                  active-text="启"
                  inactive-text="关"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="短信通知">
                <el-switch
                  v-model="form.SmsNotify"
                  inline-prompt
                  active-text="启"
                  inactive-text="关"
                />
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row style="margin-top: 10px" v-if="form.BillStatus == 0 || Type == 'View'">
            <el-col :span="22">
              <el-form-item label="发券卡券">
                <el-button v-if="Type != 'View'" class="button1" round @click="addTicketBtn">
                  &nbsp;&nbsp;添加卡券&nbsp;&nbsp;
                </el-button>
              </el-form-item>
            </el-col>
            <div style="padding-left: 160px">
              <ul id="nav-send">
                <li v-for="(item, index) in goods" :key="index">
                  <div class="inli-send">
                    <div class="send-type" v-if="item.GoodsQty > 1">
                      {{ item.GoodsQty + "选" + item.ExchangeGoodsQty }}
                    </div>
                    <div class="send-edit" v-if="Type != 'View'"
                      @click="goodEditBtn(item.TicketTemplateId, index, 'Edit')">
                      <img src="/src/assets/imgs/send-edit.png" />
                    </div>
                    <div class="send-del" @click="goodDelBtn(index)" v-if="Type != 'View'">
                      <img src="/src/assets/imgs/send-del.png" />
                    </div>
                    <el-row>
                      <el-col :span="6">
                        <div class="flex-col justify-center items-center send-detail">
                          <img :src="item.ListImg
                            ? item.ListImg
                            : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/img-order2.png'
                            " style="width: 70px; height: 70px" />
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="send-detail-title line_ellipsi">
                          {{ item.TicketTemplateTitle }}
                        </div>
                        <div class="send-detail-time">
                          {{ item.ValidDateDesc2 }}
                        </div>
                        <div class="send-detail-rmb">¥{{ item.OrgPrice }}</div>
                        <div class="send-detail-rmb" v-if="item.TicketIndexScope" style="top: 84px; font-size: 12px">
                          号段：{{ item.TicketIndexScope }}
                        </div>
                        <div class="send-detail-count" v-if="item.TicketCount > 0">
                          X{{ item.TicketCount }}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" v-if="!form.AddStaffByCell">
          <el-col :span="24">
            <div class="handle-box">
              <el-form label-width="1px">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="">
                      <el-input class="input-with-icon" v-model="query.search.search_keyword" clearable
                        placeholder="名称/编码/手机">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="17" :offset="1">
                    <div class="button-mgl">
                      <el-button v-if="Type != 'View'" class="button2 button-float" round @click="handleInFile()">
                        <el-icon>
                          <RefreshRight />
                        </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;入
                      </el-button>
                      <el-button v-if="Type != 'View'" class="button1 button-float" round @click="handleAdd()">
                        <el-icon>
                          <Search />
                        </el-icon>&nbsp;&nbsp;添&nbsp;&nbsp;加
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-table :data="filterTableData.slice(
              (query.PageStartRow - 1) * query.PageRowCount,
              query.PageStartRow * query.PageRowCount
            )
              " border class="table" v-loading="tableLoading" ref="multipleTable"
              :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
              <el-table-column prop="StaffDept" align="center" label="部门" width="90"></el-table-column>
              <el-table-column prop="StaffName" align="center" label="姓名" width="90">
              </el-table-column>
              <el-table-column prop="StaffCell" align="center" label="电话" width="120">
              </el-table-column>
              <el-table-column prop="StaffEmail" align="center" label="邮件">
              </el-table-column>
              <el-table-column prop="TicketCount" align="center" label="张数" width="60">
              </el-table-column>
              <el-table-column prop="StaffRemark" align="center" label="备注">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <div class="button-mgl">
                    <el-button class="button-op-edit" size="small" v-if="Type != 'View'"
                      @click="handleEdit(scope.$index, 'Edit')">编辑
                    </el-button>
                    <el-button class="button-op-del" size="small" v-if="Type != 'View'"
                      @click="handleDel(scope.$index)">
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background layout="->,total, sizes, prev, pager, next"
                v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                :page-sizes="[15, 50, 100]" :total="pageTotal" @current-change="handlePageChange"
                @size-change="handleSizeChange"></el-pagination>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button v-if="Type != 'View'" class="button1" round :loading="btnLoading" @click="onSubmit">
          &nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;</el-button>
        <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 文件导入弹出框 -->
    <el-dialog title="导入文件" v-model="fileVisible" width="38%" :show-close="false">
        <div style="width:100%;height: 18px;"></div>
      <div class="file-detail">
        <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
          class="send-file-home-uploader" action="#" :http-request="SuccessFile" :auto-upload="true">
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link :underline="false" href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/名单.xlsx"
                style="color: #f56c6c">
                下载模板</el-link>
            </div>
            <div class="el-upload__tip">支持上传excel文件</div>
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
    <!-- 添加名单弹出框 -->
    <el-dialog title="添加名单" v-model="addVisible" width="38%" :show-close="false">
      <el-form ref="formFileRef" :rules="addRules" :model="addForm" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="部门">
              <el-input v-model="addForm.StaffDept" clearable placeholder="请输入部门">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="姓名" prop="StaffName">
              <el-input v-model="addForm.StaffName" clearable placeholder="请输入姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="电话" prop="StaffCell">
              <el-input v-model="addForm.StaffCell" clearable placeholder="请输入电话">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发放" prop="TicketCount">
              <el-input v-model="addForm.TicketCount" clearable placeholder="请输入发放张数">
                <template #append>张</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="邮件">
              <el-input v-model="addForm.StaffEmail" clearable placeholder="请输入邮件">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input v-model="addForm.StaffRemark" clearable placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="addLoading" @click="SaveAddModalBtn">保 存</el-button>
          <el-button class="button2" @click="cennelAddModalBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加卡券弹出框 -->
    <el-dialog title="添加/编辑" v-model="addTicketVisible" width="38%" :show-close="false">
      <el-form ref="formTicketRef" :rules="TicketRules" :model="TicketForm" label-width="120px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="选择卡券" prop="TicketTemplateId">
              <el-select v-model="TicketForm.TicketTemplateTitle" filterable style="width: 100%" placeholder="请输入卡券名称"
                @change="changeTicketTemplateId($event, index)">
                <el-option v-for="(obj, index) in tickets" :key="index" :label="obj.TicketTemplateCode + '-' + obj.TicketTemplateTitle
                  " :value="obj.TicketTemplateId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="卡券类型">
              <el-input disabled v-model="TicketForm.GoodsQtyDesc"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="有效期">
              <el-input disabled v-model="TicketForm.ValidDateDesc2">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="剩余数量">
                  <el-input disabled v-model="TicketForm.LeftCount">
                    <template #append>张</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="面值">
                  <el-input disabled v-model="TicketForm.OrgPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-form-item label="发券数量" prop="TicketCount">
              <el-input v-model="TicketForm.TicketCount"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="券号段">
              <el-input v-model="TicketForm.TicketIndexScope"></el-input>
              <span style="color: #a8abb2">提示：1,5-8 代表要券号为1/5/6/7/8</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="addTicketLoading" @click="SaveTicketModalBtn">保 存</el-button>
          <el-button class="button2" @click="cennelTicketModalBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="previewVisible" width="520px" :show-close="true" align-center destroy-on-close
      class="img-preview-dialog" title="图片预览">
      <div style="text-align:center;max-height:60vh;overflow:auto;">
        <img :src="previewUrl" style="max-width:100%;object-fit:contain;" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import {
  GetTicketTemplateList,
  GetTicketTemplateById,
  GetMyValidTicketTemplateList,
} from "@/api/ticket.js";
import { GetTicketBillAct, SaveTicketBillAct } from "@/api/bill.js";
import { UploadSingle, GetFileData } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const formRef = ref(null);
const btnLoading = ref(false);
const chooseIdx = ref("0");
let Type = ref("");
const rules = {
  BillTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
  time: [{ required: true, message: "请选择起始时间", trigger: "blur" }],
};
let form = reactive({
  BillId: "",
  BillTitle: "",
  time: [],
  BeginTime: "",
  EndTime: "",
  BillCode: "", //单号
  BillDate: "", //创建日期
  BillStatus: "",//状态
  EmailNotify: false, //是否邮件通知领取(类型为名单时有用)
  SmsNotify: false, //是否短信通知领取(类型为名单时有用)
  RosterId: "", //发放花名册
  MainImage: "", //自定义图片
  AddStaffByCell: false, //是否根据手机号添加员工进名单,适用于扫码留手机领券场合（一个手机号只能领取一次）
  BillConfig: "", //配置
  TakeThemeConfig: "", //领取主题配置
  TicketTemplateDetails: [], //可以领取的券模板列表
  TakeStaffs: [], //领取名单
  xcxConfiguration: {
    BGColor: "",
    TicketColor: "",
    TicketBGColor: "",
    TakeButtonBGColor: "",
    TakeButtonFontColor: "",
    BuyTextColor: "",
    TicketHeight: "",//块的高度
    TicketFontSize: "",//模板名称字体大小
    TakeButtonWeight: "",//按钮宽度
    TakeButtonHeight: "",//按钮高度
    TakeButtonFontSize: "",//按钮文字大小
    ShowCommodity: true,
  }

});

//文件导入
const fileVisible = ref(false);
const FileLoading = ref(false);
const fileList = ref([]);

const fileparam = ref([]);

//名单添加
const addVisible = ref(false);
const addLoading = ref(false);
const formFileRef = ref(null);
const addFormType = ref("");
const addFormIndex = ref("");
const addRules = {
  StaffDept: [{ required: true, message: "请输入部门", trigger: "blur" }],
  StaffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  StaffCell: [{ required: true, message: "请输入电话", trigger: "blur" }],
  TicketCount: [{ required: true, message: "请输入发放张数", trigger: "blur" }],
};
let addForm = reactive({
  StaffDept: "", //部门
  StaffName: "", //姓名
  StaffCell: "", //电话
  TicketCount: "", //发放
  StaffEmail: "", //邮件
  StaffRemark: "", //备注
});

//添加卡券
const addTicketLoading = ref(false);
const isEditTicket = ref("");
const addTicketVisible = ref(false);
const formTicketRef = ref(null);
const TicketRules = {
  TicketTemplateId: [
    { required: true, message: "请选择卡券", trigger: "blur" },
  ],
  TicketCount: [{ required: true, message: "请输入发券数量", trigger: "blur" }],
};
let TicketForm = reactive({
  BillDetailId: "",
  BillId: "",
  TicketTemplateId: "",
  TicketCount: "",
  LeftCount: "", //剩余总量(=券总量-销售券总量-发放券总量)
  OrgPrice: "", //面值
  TicketIndexScope: "", //券号段
  ValidDateDesc2: "", //有效期
  GoodsQtyDesc: "", //卡券类型
  TicketTemplateTitle: "",
  TicketTemplateCode: "",
  GoodsQty: 1, //兑换商品数量(<=1:单选卡;>1:多选卡)
  ExchangeGoodsQty: "", //多选卡兑换时需要选择几种兑换商品(默认为1)
  ListImg: "",
});
const tickets = ref([]);

//右侧列表查询
const query = reactive({
  search: {
    unit_type: "2",
    unit_type_filter: "",
    search_keyword: "",
    unit_status: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const multipleTableRef = ref([]);
const tableData = ref([]);
const pageTotal = ref(0);
//卡券数组
const goods = reactive([]);
const requestTableData = () => {
  nextTick(() => {
    if (multipleTableRef.value.length > 0) {
      tableData.value.forEach(function (item, i) {
        multipleTableRef.value.forEach(function (multItem, j) {
          if (
            tableData.value[i].ResponseID ==
            multipleTableRef.value[j].ResponseID
          ) {
            multipleTable.toggleRowSelection(tableData.value[i], true); //这步操作是让  页面显示选中的数据
          }
        });
      });
    }
  });
};

//操作
const onReturn = () => {
  common.ClosePageTag("领取活动详情");
  //为了保存之后返回列表页面刷新
  store.commit("tags/setPageSaerch", {
    Search: 1,
    titlePage: "领取活动",
  });
  router.push({
    path: "/claim_activity",
  });
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let submitForm = form;
      if (!submitForm.AddStaffByCell) {
        if (filterTableData.value.length == 0) {
          ElMessage.warning("请先添加领取名单");
          return;
        }
      }

      submitForm.TakeStaffs = [];
      filterTableData.value.forEach((row) => {
        submitForm.TakeStaffs.push({
          StaffDept: row.StaffDept,
          StaffName: row.StaffName,
          StaffCell: row.StaffCell,
          StaffEmail: row.StaffEmail,
          StaffRemark: row.StaffRemark,
          TicketCount: row.TicketCount,
        });
      });
      if (typeof submitForm.time[0] != "string") {
        submitForm.BeginTime = common.dateFormat(
          "YYYY-mm-dd HH:MM:SS",
          submitForm.time[0]
        );
        submitForm.EndTime = common.dateFormat(
          "YYYY-mm-dd HH:MM:SS",
          submitForm.time[1]
        );
      } else {
        submitForm.BeginTime = submitForm.time[0];
        submitForm.EndTime = submitForm.time[1];
      }
      submitForm.EmailNotify = form.EmailNotify ? 1 : 0;
      submitForm.SmsNotify = form.SmsNotify ? 1 : 0;
      if (form.MainImage == "") {
        ElMessage.warning("请先上传图片");
        return;
      }
      if (goods.length == 0) {
        ElMessage.warning("请先添加卡券");
        return;
      }
      let JSONData = {
        MainImage: submitForm.MainImage, //背景图片
        AddStaffByCell: submitForm.AddStaffByCell, //是否根据手机号添加员工进名单,适用于扫码留手机领券场合（一个手机号只能领取一次） true:是 false:否
        ...submitForm.xcxConfiguration //展开小程序配置对象
      };
      submitForm.BillConfig = JSON.stringify(JSONData);
      submitForm.TicketTemplateDetails = [];
      goods.forEach((row) => {
        submitForm.TicketTemplateDetails.push({
          TicketTemplateId: row.TicketTemplateId,
          TicketCount: row.TicketCount,
          TicketIndexScope: row.TicketIndexScope,
        });
      });

      btnLoading.value = true;
      let res = await SaveTicketBillAct({ Bill: submitForm, OnlyModifyBaseInfo: submitForm.BillStatus === 1, });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("领取活动详情");
        ElMessage.success("保存成功");
        //为了保存之后返回列表页面刷新
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "领取活动",
        });
        setTimeout(() => {
          router.push({
            path: "/claim_activity",
          });
        }, 2000);
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  requestTableData();
};
const handlePageChange = (val) => {
  query.PageStartRow = val;
  requestTableData();
};
const SuccessImg = async (param) => {
  //上传图片
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.MainImage = res.DataMap.HttpsUrl;
    }
  });
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

const handleAdd = async (param) => {
  addFormType.value = "Add";
  addVisible.value = true;
};
//编辑领取名单
const handleEdit = (idIndex) => {
  addVisible.value = true;
  addFormType.value = "Edit";
  addFormIndex.value = idIndex;
  tableData.value.forEach((row, index) => {
    if (idIndex === index) {
      addForm.StaffDept = row.StaffDept;
      addForm.StaffName = row.StaffName;
      addForm.StaffCell = row.StaffCell;
      addForm.TicketCount = row.TicketCount;
      addForm.StaffEmail = row.StaffEmail;
      addForm.StaffRemark = row.StaffRemark;
    }
  });
};
//删除领取名单
const handleDel = (idIndex) => {
  tableData.value.forEach((row, index) => {
    if (idIndex === index) {
      tableData.value.splice(index, 1);
    }
  });
};
const handleInFile = async (param) => {
  fileVisible.value = true;
};
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !query.search.search_keyword ||
      data.StaffName.toLowerCase().includes(
        query.search.search_keyword.toLowerCase()
      ) ||
      data.StaffDept.toLowerCase().includes(
        query.search.search_keyword.toLowerCase()
      ) ||
      data.StaffCell.toLowerCase().includes(
        query.search.search_keyword.toLowerCase()
      )
  )
);
const SaveFileModalBtn = async () => {
  let fd = new FormData();
  fd.append("file", fileparam.value.file); //传文件
  fd.append("DataType", "Roster"); //传文件
  FileLoading.value = true;
  let res = await GetFileData(fd);
  FileLoading.value = false;
  if (res.Code == 200) {
    ElMessage.warning(`导入成功`);
    tableData.value = res.DataMap;
    pageTotal.value = tableData.value.length;
    fileList.value = [];
    fileVisible.value = false;
  } else {
    ElMessage.warning(`${res.Message}`);
  }
};
const cennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};
const SaveAddModalBtn = async () => {
  formFileRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      if (addFormType.value == "Edit") {
        tableData.value.forEach((row, index) => {
          if (index == addFormIndex.value) {
            row.StaffDept = addForm.StaffDept;
            row.StaffName = addForm.StaffName;
            row.StaffCell = addForm.StaffCell;
            row.TicketCount = addForm.TicketCount;
            row.StaffEmail = addForm.StaffEmail;
            row.StaffRemark = addForm.StaffRemark;
          }
        });
      } else {
        tableData.value.push({
          StaffDept: addForm.StaffDept,
          StaffName: addForm.StaffName,
          StaffCell: addForm.StaffCell,
          TicketCount: addForm.TicketCount,
          StaffEmail: addForm.StaffEmail,
          StaffRemark: addForm.StaffRemark,
        });
      }
      pageTotal.value = tableData.value.length;
      setTimeout(() => {
        addForm.StaffDept = "";
        addForm.StaffName = "";
        addForm.StaffCell = "";
        addForm.TicketCount = "";
        addForm.StaffEmail = "";
        addForm.StaffRemark = "";
        addVisible.value = false;
        addLoading.value = false;
      }, 1000);
    } else {
      return false;
    }
  });
};
const previewVisible = ref(false)
const previewUrl = ref('')

// ...existing code...
const previewImg = (UrlImg) => {
  if (!UrlImg) return
  previewUrl.value = UrlImg
  previewVisible.value = true
}
const cennelAddModalBtn = async () => {
  addVisible.value = false;
};
const addTicketBtn = async () => {
  addTicketVisible.value = true;
  isEditTicket.value = "";
  TicketForm.GoodsQtyDesc = "";
  TicketForm.TicketTemplateId = "";
  TicketForm.TicketCount = "";
  TicketForm.OrgPrice = "";
  TicketForm.TicketIndexScope = "";
  TicketForm.ValidDateDesc2 = "";
  TicketForm.LeftCount = "";
  TicketForm.BillDetailId = "";
  TicketForm.BillId = "";

  TicketForm.TicketTemplateTitle = "";
  TicketForm.TicketTemplateId = "";
};
const goodEditBtn = async (ID, idx, type) => {
  isEditTicket.value = type;
  changeTicketTemplateId(ID);
  chooseIdx.value = idx;
  goods.forEach((row, index) => {
    if (index == idx) {
      TicketForm.TicketCount = row.TicketCount;
      TicketForm.BillDetailId = row.BillDetailId;
      TicketForm.BillId = row.BillId;
      TicketForm.TicketIndexScope = row.TicketIndexScope;
    }
  });
  addTicketVisible.value = true;
};
const goodDelBtn = async (idx) => {
  goods.forEach((row, index) => {
    if (idx == index) {
      goods.splice(index, 1);
    }
  });
};
const cennelTicketModalBtn = async () => {
  addTicketVisible.value = false;
  TicketForm.GoodsQtyDesc = "";
  TicketForm.OrgPrice = "";
  TicketForm.ValidDateDesc2 = "";
  TicketForm.LeftCount = "";
  TicketForm.TicketIndexScope = ""; //券号段
  formTicketRef.value.resetFields();
};
const changeTicketTemplateId = async (key) => {
  let res = await GetTicketTemplateById({
    TicketTemplateId: key,
    ReturnStatData: true,
  });
  if (res.Code == 200) {
    // TicketForm.TicketCount = res.DataMap.TicketCount;
    TicketForm.TicketTemplateId = res.DataMap.TicketTemplateId;
    TicketForm.TicketTemplateTitle =
      res.DataMap.TicketTemplateCode + "-" + res.DataMap.TicketTemplateTitle;
    TicketForm.TicketTemplateCode = res.DataMap.TicketTemplateCode;
    TicketForm.GoodsQty = res.DataMap.GoodsQty;
    TicketForm.ExchangeGoodsQty = res.DataMap.ExchangeGoodsQty;
    TicketForm.ListImg = res.DataMap.ListImg;
    TicketForm.ValidDateDesc2 = res.DataMap.ValidDateDesc2;
    TicketForm.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
    TicketForm.LeftCount = res.DataMap.LeftCount;
    if (res.DataMap.GoodsQty > 1) {
      TicketForm.GoodsQtyDesc = `多选卡 ${res.DataMap.GoodsQty}选${res.DataMap.ExchangeGoodsQty}`;
    } else {
      TicketForm.GoodsQtyDesc = `单选卡`;
    }
  }
};
const SaveTicketModalBtn = async () => {
  formTicketRef.value.validate(async (valid) => {
    if (valid) {
      addTicketLoading.value = true;
      if (isEditTicket.value != "Edit") {
        goods.push({
          TicketTemplateId: TicketForm.TicketTemplateId,
          TicketCount: TicketForm.TicketCount,
          TicketTemplateTitle: TicketForm.TicketTemplateTitle,
          TicketTemplateCode: TicketForm.TicketTemplateCode,
          GoodsQty: TicketForm.GoodsQty,
          ExchangeGoodsQty: TicketForm.ExchangeGoodsQty,
          ListImg: TicketForm.ListImg,
          ValidDateDesc2: TicketForm.ValidDateDesc2,
          OrgPrice: TicketForm.OrgPrice,
          BillDetailId: TicketForm.BillDetailId,
          BillId: TicketForm.BillId,
          TicketIndexScope: TicketForm.TicketIndexScope,
        });
      } else {
        goods[chooseIdx.value].TicketTemplateId = TicketForm.TicketTemplateId;
        goods[chooseIdx.value].TicketCount = TicketForm.TicketCount;
        goods[chooseIdx.value].TicketTemplateTitle =
          TicketForm.TicketTemplateTitle;
        goods[chooseIdx.value].TicketTemplateCode =
          TicketForm.TicketTemplateCode;
        goods[chooseIdx.value].GoodsQty = TicketForm.GoodsQty;
        goods[chooseIdx.value].ExchangeGoodsQty = TicketForm.ExchangeGoodsQty;
        goods[chooseIdx.value].ListImg = TicketForm.ListImg;
        goods[chooseIdx.value].ValidDateDesc2 = TicketForm.ValidDateDesc2;
        goods[chooseIdx.value].OrgPrice = TicketForm.OrgPrice;
        goods[chooseIdx.value].BillDetailId = TicketForm.BillDetailId;
        goods[chooseIdx.value].BillId = TicketForm.BillId;
        goods[chooseIdx.value].TicketIndexScope = TicketForm.TicketIndexScope;
      }
      setTimeout(() => {
        addTicketLoading.value = false;
        addTicketVisible.value = false;
      }, 800);
    } else {
      return false;
    }
  });
};
const GetTicketBillActApi = async (key) => {
  let res = await GetTicketBillAct({
    ObjectId: key,
  });
  if (res.Code == 200) {
    form.SmsNotify = res.DataMap.SmsNotify == 1 ? true : false;
    form.EmailNotify = res.DataMap.EmailNotify == 1 ? true : false;
    form.BillConfig = res.DataMap.BillConfig;
    form.BillStatus = res.DataMap.BillStatus;


    //用来接收配置字段里面的数据
    let BillConfigDesc = {
      MainImage: "",
      AddStaffByCell: false,
    };

    if (form.BillConfig) {
      BillConfigDesc = JSON.parse(form.BillConfig);
      form.MainImage = BillConfigDesc.MainImage || "";
      form.AddStaffByCell = BillConfigDesc?.AddStaffByCell || false;

      // 设置小程序配置信息
      form.xcxConfiguration = {
        BGColor: BillConfigDesc.BGColor || "",
        TicketBGColor: BillConfigDesc.TicketBGColor || "",
        TakeButtonBGColor: BillConfigDesc.TakeButtonBGColor || "",
        TakeButtonFontColor: BillConfigDesc.TakeButtonFontColor || "",
        BuyTextColor: BillConfigDesc.BuyTextColor || "",
        TicketColor: BillConfigDesc.TicketColor || "",

        TakeButtonFontSize: BillConfigDesc.TakeButtonFontSize || "",
        TakeButtonHeight: BillConfigDesc.TakeButtonHeight || "",
        TakeButtonWeight: BillConfigDesc.TakeButtonWeight || "",
        TicketHeight: BillConfigDesc.TicketHeight || "",
        TicketFontSize: BillConfigDesc.TicketFontSize || "",
        ShowCommodity: BillConfigDesc.ShowCommodity,
      };
    }

    form.time = [res.DataMap.BeginTime, res.DataMap.EndTime];
    form.BillTitle = res.DataMap.BillTitle;
    form.BillCode = res.DataMap.BillCode;

    res.DataMap.TicketTemplateDetails.forEach((row) => {
      goods.push({
        TicketTemplateId: row.TicketTemplateId,
        TicketCount: row.TicketCount,
        TicketTemplateTitle: row.TicketTemplateTitle,
        TicketTemplateCode: row.TicketTemplateCode,
        GoodsQty: row.GoodsQty,
        ExchangeGoodsQty: row.ExchangeGoodsQty,
        ListImg: row.ListImg,
        ValidDateDesc2: row.ValidDateDesc,
        OrgPrice: Number((row.OrgPrice / 100).toFixed(2)),
        BillDetailId: row.BillDetailId,
        BillId: row.BillId,
        TicketIndexScope: row.TicketIndexScope,
      });
    });

    form.TakeStaffs = [];
    tableData.value = res.DataMap.TakeStaffs ? res.DataMap.TakeStaffs : [];
    pageTotal.value = tableData.value.length;
  }
};
const GetMyValidTicketTemplateListApi = async () => {
  let res = await GetMyValidTicketTemplateList({});
  if (res.Code === 200) {
    tickets.value = res.DataMap;
  }
};

const remoteMethod = async (query) => {
  if (query) {
    let res = await GetTicketTemplateList({
      SearchCondition: { search_keyword: query },
    });
    if (res.Code === 200) {
      if (res.DataMap.ToalCount == 0) {
        tickets.value = [];
      } else {
        tickets.value = res.DataMap;
      }
    }
  } else {
    tickets.value = [];
  }
};
const defaultTime2 = [
  new Date(2023, 1, 1, 0, 0, 0),
  new Date(2023, 2, 1, 23, 59, 59),
];
const Init = async () => {
  GetMyValidTicketTemplateListApi(); //需要添加的卡券信息
  Type.value = router.currentRoute.value.query.Type
    ? router.currentRoute.value.query.Type
    : "";
  if (router.currentRoute.value.query.ID) {
    //根据ID获取详情
    form.BillId = router.currentRoute.value.query.ID
      ? router.currentRoute.value.query.ID
      : "";
    GetTicketBillActApi(router.currentRoute.value.query.ID);
  }
};
Init();
</script>

<style scoped>
#nav-send {
  list-style-type: none;
  margin-top: 10px;
}

.inli-send {
  border-bottom: solid 8px #f56c6c;
  position: relative;
  margin: 10px 10px 20px 0;
  border-radius: 4px;
  border-bottom-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 442px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
  height: 120px;
}

.send-edit {
  position: absolute;
  right: 72px;
  z-index: 9;
  top: 32px;
}

.send-edit img {
  width: 35px;
  height: 35px;
}

.send-del {
  position: absolute;
  right: 22px;
  z-index: 9;
  top: 32px;
}

.send-del img {
  width: 35px;
  height: 35px;
}

.send-detail {
  height: 120px;
}

.send-detail-title {
  position: absolute;
  top: 20px;
  color: #252525;
}

.send-detail-time {
  position: absolute;
  top: 42px;
  font-size: 12px;
  color: #757575;
}

.send-detail-rmb {
  position: absolute;
  top: 66px;
  color: #f56c6c;
}

.send-detail-no {
  position: absolute;
  top: 87px;
  color: #f56c6c;
  font-size: 14px;
}

.send-detail-count {
  position: absolute;
  right: 14px;
  top: 80px;
  color: #313131;
}

.send-type {
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

.file-detail {
  position: relative;
  height: 0px;
  top: -10px;
}
</style>

<style>
.b-ground-uploader {
  width: 240px;
  height: 225px;
}

.b-ground-uploader .el-upload {
  width: 240px !important;
  height: 225px !important;
  line-height: 225px !important;
}

.b-ground-uploader-avatar {
  width: 100%;
}

.send-file-home-uploader {
  width: 150px;
  height: 40px;
}

.send-file-home-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.send-file-home-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
