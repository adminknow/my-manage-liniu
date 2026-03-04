<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px">
        <el-col class="send-local" :span="10">销售单信息</el-col>
        <el-col class="send-local" :span="14">购买卡券</el-col>
      </el-row>
      <el-row style="margin-top: 30px; padding-bottom: 100px">
        <el-col :span="10">
          <el-row>
            <el-col :span="20">
              <el-form-item label="购买客户" prop="UnitId">
                <el-select :disabled="Type == 'View'" v-model="form.UnitId" filterable remote reserve-keyword
                  placeholder="请输入客户名称" :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading"
                  style="width: 100%" clearable @change="changeCustomer">
                  <el-option v-for="(item, index) in UnitData" :key="index" :label="item.UnitCode + '-' + item.UnitName"
                    :value="item.UnitId">
                  </el-option>
                </el-select>
                <span style="color: #909399" v-if="GoodsDiscount > 0">默认折扣：{{ GoodsDiscount }}%</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="销售单号">
                <el-input disabled v-model="form.BillCode"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="整单折扣" prop="SaleDiscount">
                <el-input v-model.number="form.SaleDiscount" @input="inputSaleDiscount">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="短信通知">
                <el-switch v-model="form.SmsNotify" inline-prompt active-text="启" inactive-text="关" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="">
                <el-checkbox :disabled="!activationBtn" style="height: 10px" v-model="form.ActiveTicketAfterPassApprove"
                  label="审核通过后，自动激活券" size="large" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.SmsNotify">
            <el-col :span="20">
              <el-form-item label="短信中券的名称">
                <el-input clearable v-model="form.SmsTicketName" maxlength="10" show-word-limit></el-input>
                <span style="font-size: 12px; color: #909399">一个汉字代表2个字符。</span>
                <span style="
                    font-size: 12px;
                    color: #909399;
                    height: auto;
                    line-height: 18px;
                  ">短信格式：亲，您购买的<span style="color: #f56c6c">{{
                    form.SmsTicketName ? form.SmsTicketName : "××××"
                  }}</span>券已发放，请点击 **** ,到我的卡包查看</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="销售渠道">
                <el-input clearable v-model="form.SaleChannel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="领取人姓名">
                <el-input clearable v-model="form.TakeName"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="领取人手机">
                <el-input clearable v-model="form.TakeCell"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="Type == 'View'">
            <el-col :span="20">
              <el-form-item label="领取暗码">
                <el-input clearable v-model="form.TakePass" disabled> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="制单人">
                <el-input disabled v-model="form.PreparedBy"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="制单时间">
                <el-input disabled v-model="form.PreparationTime"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
                        <el-col :span="20">
                            <el-form-item label="单据状态">
                                <el-input disabled v-model="form.BillStatusDesc">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row> -->

          <el-row>
            <el-col :span="20">
              <el-form-item label="领取页首图" ref="uploadElement" prop="">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="form.TakeImage" v-if="false"></el-input>
                    <el-upload class="sale-uploader" ref="upload" :show-file-list="false" action="#"
                      :http-request="SuccessImg" :auto-upload="true">
                      <img v-if="form.TakeImage" :src="form.TakeImage" class="sale-uploader-avatar" />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p style="color: #909399">
                      建议 400*375,支持格式：.jpg .png不能超过20MB
                      <span style="cursor: pointer; color: #ff6666" class="el-icon-delete"
                        v-if="form.TakeImage && Type != 'View'" @click="clear">删除</span>
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="领取页标题">
                <el-input v-model="form.TakeTitle"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="领取页祝福语">
                <el-input v-model="form.TakeWish"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input type="textarea" maxlength="100" :rows="4" show-word-limit v-model="form.BillRemark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="14">
          <el-row>
            <el-col :span="10">
              <el-button class="button1" v-if="Type != 'View'" round @click="addTicketBtn">
                &nbsp;&nbsp;添加卡券&nbsp;&nbsp;
              </el-button>
              <el-button class="button1" v-if="tickets.length > 0 && Type != 'View'" round @click="inDataBtn">
                &nbsp;&nbsp;导入价格本&nbsp;&nbsp;
              </el-button>
            </el-col>
            <div style="width: 100%">
              <ul id="nav-send">
                <li v-for="(item, index) in tickets" :key="index">
                  <div class="inli-send">
                    <div class="send-type" v-if="item.GoodsQty > 1">
                      {{ item.GoodsQty + "选" + item.ExchangeGoodsQty }}
                    </div>
                    <el-row>
                      <el-col :span="4">
                        <div class="flex-col justify-center items-center sale-detail">
                          <img :src="item.ListImg" style="width: 60px; height: 60px" />
                        </div>
                      </el-col>
                      <el-col :span="5">
                        <div class="flex-col justify-center sale-detail">
                          <p class="sale-detail-time">
                            {{ item.TicketTemplateCode }}
                          </p>
                          <p class="sale-detail-title line_ellipsi">
                            {{ item.TicketTemplateTitle }}
                          </p>
                          <p class="sale-detail-time">
                            原价：{{ item.OrgPrice }}
                          </p>
                          <p class="sale-detail-time" v-if="item.TicketIndexScope">
                            号段：{{ item.TicketIndexScope }}
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="flex-col justify-center items-center sale-detail">
                          <p class="sale-detail-tr">数量</p>
                          <div class="flex-col justify-center items-center goods-sales">
                            <div class="goode-sales-number flex-row items-center justify-center">
                              <div class="goode-number-add" @click="addNumberBtn(index)">
                                +
                              </div>
                              <div class="goode-number-value">
                                {{ item.TicketCount }}
                              </div>
                              <div class="goode-number-reduce" @click="reduceNumberBtn(index)">
                                -
                              </div>
                            </div>
                          </div>
                          <!-- <p class="sale-detail-td">{{ item.TicketCount }}</p> -->
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div class="flex-col justify-center items-center sale-detail">
                          <p class="sale-detail-tr">折扣</p>
                          <p class="sale-detail-td">{{ item.Discount }}%</p>
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div class="flex-col justify-center items-center sale-detail">
                          <p class="sale-detail-tr">折后价</p>
                          <p class="sale-detail-td">
                            {{ item.DiscountedPrice }}
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="flex-col justify-center items-center sale-detail">
                          <p class="sale-detail-tr">金额</p>
                          <p class="sale-detail-td">{{ item.Amt }}</p>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <el-row>
                          <el-col>
                            <div v-if="Type != 'View'" class="send-edit" @click="
                              editSendBtn(
                                item.TicketTemplateId,
                                index,
                                'Edit'
                              )
                              ">
                              <img src="/src/assets/imgs/send-edit.png" />
                            </div>
                            <div v-if="Type != 'View'" class="send-del" @click="delSendBtn(index)">
                              <img src="/src/assets/imgs/send-del.png" />
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
            </div>
            <el-col :span="22" v-if="tickets.length > 0">
              <div class="totalDetail flex-col justify-center">
                <el-row>
                  <el-col :span="6" :offset="2"><text style="font-weight: 600">折后总额：</text>
                    <text style="color: #f56c6c; font-weight: 600">{{
                      totalCount.toFixed(2)
                    }}</text>
                  </el-col>
                  <el-col :span="6" :offset="2">卡券总数：<text style="color: #f56c6c">{{
                    ticketsCount
                      }}</text></el-col>
                  <el-col :span="7" :offset="1">原价总额：<text style="color: #f56c6c">{{
                    ticketsAmount.toFixed(2)
                      }}</text>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button v-if="Type != 'View'" class="button1" :loading="btnLoading" @click="onSubmit">保存
        </el-button>
        <el-button class="button2" @click="onReturn">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加卡券弹出框 -->
    <el-dialog title="添加/编辑" v-model="addTicketVisible" width="42%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-form ref="formTicketRef" :rules="TicketRules" :model="TicketForm" label-width="120px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="选择卡券" prop="TicketTemplateId">
              <el-select v-model="TicketForm.TicketTemplateTitle" filterable style="width: 100%" placeholder=""
                @change="changeTicketTemplateId($event, index)">
                <el-option v-for="(obj, index) in ticketArr" :key="index" :label="obj.TicketTemplateCode + '-' + obj.TicketTemplateTitle
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
                <el-form-item label="数量" prop="TicketCount">
                  <el-input @input="inputTicketCount" v-model="TicketForm.TicketCount">
                    <template #append>张</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="原价">
                  <el-input disabled v-model="TicketForm.OrgPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="折扣">
                  <el-input @input="inputGoodsDiscount" v-model="TicketForm.Discount">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="折后价">
                  <el-input @input="inputDiscountedPrice" v-model="TicketForm.DiscountedPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="金额" prop="Amt">
                  <el-input disabled v-model="TicketForm.Amt">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-form-item label="券号段">
              <el-input v-model="TicketForm.TicketIndexScope"></el-input>
              <span style="color: #f56c6c">提示：1,5-8 代表要券号为1/5/6/7/8</span>
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

    <!-- 文件导入弹出框 -->
    <el-dialog title="导入文件" v-model="fileVisible" width="38%" :show-close="false" :close-on-click-modal="false">
      <div class="file-detail">
        <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
          class="file-home-uploader" action="#" :http-request="SuccessFile" :auto-upload="true">
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link :underline="false" href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/价格本模板.xlsx"
                style="color: #f56c6c">
                下载模板</el-link>
            </div>
            <div class="el-upload__tip">支持上传excel文件</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="cennelFileModalBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  GetTicketTemplateById,
  GetMyValidTicketTemplateList,
} from "@/api/ticket.js";
import { GetUnit, SearchUnites, HasRightes,GetUnitList } from "@/api/index.js";
import { SaveTicketBillSale, GetTicketBillSale } from "@/api/bill.js";
import { GetFileData, UploadSingle } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import Cookie from "js-cookie";

const store = useStore();
const router = useRouter();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
const isBatch = ref("0");
const chooseIdx = ref("0");

let form = reactive({
  BillId: "",
  BillCode: "",
  BillDate: "", //创建日期
  UnitId: "", //经商商/服务商/客户ID
  TakeName: "", //领取人姓名
  TakeCell: "", //领取人手机号
  TakePass: "", //领取暗码
  TicketCount: "", //销售的券数量
  SaleChannel: "", //销售渠道
  SaleDiscount: 100,
  SmsNotify: false,
  SaleAmt: "",
  BillConfig: "",
  BillRemark: "",
  PreparedBy: "", //制单人
  PreparationTime: "", //制单时间
  BillStatusDesc: "新建", //单据状态
  SmsTicketName: "", //短信中券的名称
  TakeTitle: "", //领取标题
  TakeImage: "", //领取图片
  TakeWish: "", //领取祝福语
  ActiveTicketAfterPassApprove: false,
  Details: [], //券明细
});
const rules = {
  UnitId: [{ required: true, message: "请选择客户", trigger: "blur" }],
  SaleDiscount: [
    { required: true, message: "请输入整单折扣", trigger: "blur" },
    { type: "number", message: "折扣必须为数字" },
  ],
  TakeCell: [{ type: "number", message: "手机号必须为数字" }],
};
//卡券数组
const tickets = reactive([]);

//卡券数组
const ticketArr = ref([]);
//添加卡券
const addTicketLoading = ref(false);
const isEditTicket = ref("");
const addTicketVisible = ref(false);
const formTicketRef = ref(null);
//折扣
const GoodsDiscount = ref("100");
const totalCount = ref(""); //折扣后金额
const ticketsCount = ref(""); //卡券总数
const ticketsAmount = ref(""); //卡券总金额

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
  Discount: "", //折扣
  LeftCount: "", //剩余总量(=券总量-销售券总量-发放券总量)
  OrgPrice: "", //原价
  ValidDateDesc2: "", //有效期
  GoodsQtyDesc: "", //卡券类型
  TicketTemplateTitle: "",
  TicketTemplateCode: "",
  GoodsQty: 1, //兑换商品数量(<=1:单选卡;>1:多选卡)
  ExchangeGoodsQty: "", //多选卡兑换时需要选择几种兑换商品(默认为1)
  ListImg: "", //logo
  Amt: "", //折扣后金额(分)
  DiscountedPrice: "", //折后价
  TicketIndexScope: "", //券段号
});

//初始化数据
const User = JSON.parse(Cookie.get("User"));
form.PreparedBy = User.UserName;
form.PreparationTime =
  new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let Bill = form;
      if (tickets.length == 0) {
        ElMessage.warning("请先添加卡券");
        return;
      }
      Bill.Details = [];
      Bill.SmsNotify = form.SmsNotify ? 1 : 0;
      let BillConfig = {};
      if (form.SmsNotify) {
        //如果选择发送短信，就需要把短信内容值弄上去
        if (Bill.SmsTicketName == "") {
          ElMessage.warning("请先输入短信中券的名称");
          return;
        }
        BillConfig.SmsTicketName = Bill.SmsTicketName;
      }
      BillConfig.TakeTitle = Bill.TakeTitle;
      BillConfig.TakeImage = Bill.TakeImage;
      BillConfig.TakeWish = Bill.TakeWish;
      BillConfig.ActiveTicketAfterPassApprove =
        Bill.ActiveTicketAfterPassApprove;
      Bill.BillConfig = JSON.stringify(BillConfig);
      Bill.SaleAmt = parseInt(totalCount.value * 100);
      tickets.forEach((row) => {
        Bill.Details.push({
          BillDetailId: row.BillDetailId,
          BillId: row.BillId,
          TicketTemplateId: row.TicketTemplateId,
          Discount: row.Discount,
          Amt: parseInt(row.Amt * 100),
          TicketTemplateTitle: row.TicketTemplateTitle,
          TicketTemplateCode: row.TicketTemplateCode,
          ListImg: row.ListImg,
          OrgPrice: parseInt(row.OrgPrice * 100),
          TicketCount: row.TicketCount,
          ValidDateDesc: row.ValidDateDesc,
          GoodsQty: row.GoodsQty,
          ExchangeGoodsQty: row.ExchangeGoodsQty,
          TicketIndexScope: row.TicketIndexScope,
        });
      });
      btnLoading.value = true;
      let res = await SaveTicketBillSale({
        Bill: Bill,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("销售单详情");
        ElMessage.success("保存成功");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "销售单",
        });
        setTimeout(function () {
          router.push({
            path: "/ticket_sales",
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

const calculationTableData = async () => {
  let Count = 0;
  let Amount = 0;
  let DiscountAmount = 0;

  tickets.forEach((row) => {
    Count = Number(row.TicketCount) + Count;
    Amount = Number(row.OrgPrice * row.TicketCount + Amount);
    DiscountAmount = Number(row.Amt) + DiscountAmount;
  });
  ticketsAmount.value = Number(Amount);
  ticketsCount.value = Count;
  totalCount.value = Number((DiscountAmount * form.SaleDiscount) / 100);
};
const SaveTicketModalBtn = async () => {
  formTicketRef.value.validate(async (valid) => {
    if (valid) {
      addTicketLoading.value = true;
      if (isEditTicket.value != "Edit") {
        tickets.push({
          TicketTemplateId: TicketForm.TicketTemplateId,
          TicketCount: TicketForm.TicketCount,
          Discount: TicketForm.Discount,
          TicketTemplateTitle: TicketForm.TicketTemplateTitle,
          TicketTemplateCode: TicketForm.TicketTemplateCode,
          GoodsQty: TicketForm.GoodsQty,
          ExchangeGoodsQty: TicketForm.ExchangeGoodsQty,
          ListImg: TicketForm.ListImg,
          ValidDateDesc2: TicketForm.ValidDateDesc2,
          OrgPrice: TicketForm.OrgPrice,
          BillDetailId: TicketForm.BillDetailId,
          BillId: TicketForm.BillId,
          Amt: TicketForm.Amt,
          DiscountedPrice: Number(TicketForm.DiscountedPrice).toFixed(2),
          TicketIndexScope: TicketForm.TicketIndexScope,
        });
      } else {
        tickets[chooseIdx.value].BillDetailId = TicketForm.BillDetailId;
        tickets[chooseIdx.value].TicketTemplateId = TicketForm.TicketTemplateId;
        tickets[chooseIdx.value].TicketCount = TicketForm.TicketCount;
        tickets[chooseIdx.value].Discount = TicketForm.Discount;
        tickets[chooseIdx.value].TicketTemplateTitle =
          TicketForm.TicketTemplateTitle;
        tickets[chooseIdx.value].TicketTemplateCode =
          TicketForm.TicketTemplateCode;
        tickets[chooseIdx.value].GoodsQty = TicketForm.GoodsQty;
        tickets[chooseIdx.value].ExchangeGoodsQty = TicketForm.ExchangeGoodsQty;
        tickets[chooseIdx.value].ListImg = TicketForm.ListImg;
        tickets[chooseIdx.value].ValidDateDesc2 = TicketForm.ValidDateDesc2;
        tickets[chooseIdx.value].OrgPrice = TicketForm.OrgPrice;
        tickets[chooseIdx.value].BillId = TicketForm.BillId;
        tickets[chooseIdx.value].Amt = TicketForm.Amt;
        tickets[chooseIdx.value].TicketIndexScope = TicketForm.TicketIndexScope;
        tickets[chooseIdx.value].DiscountedPrice = Number(
          TicketForm.DiscountedPrice
        ).toFixed(2);
      }
      setTimeout(() => {
        addTicketLoading.value = false;
        addTicketVisible.value = false;
      }, 800);
      calculationTableData();
    } else {
      return false;
    }
  });
};
const GetMyValidTicketTemplateListApi = async () => {
  let res = await GetMyValidTicketTemplateList({});
  if (res.Code === 200) {
    ticketArr.value = res.DataMap;
  }
};
GetMyValidTicketTemplateListApi();

/////////////////////////////////////////////////////////////////////////////////
//查询客户
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
    let res = await GetUnitList({
      SearchCondition: {
        search_keyword: SearchQuery,
        get_liniu: 1,
        unit_type_filter: "31,32",
      },
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      UnitData.value = res.DataMap ? res.DataMap : [];
    }
  } else {
    UnitData.value = [];
  }
};
/////////////////////////////////////////////////////////////////////////////////

const GetUnitByID = async (ID) => {
  let res = await GetUnit({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    let GoodsDiscountValue = "";
    UnitData.value.push({
      UnitCode: res.DataMap.UnitCode,
      UnitName: res.DataMap.UnitName,
      UnitId: res.DataMap.UnitId,
    });
    if (res.DataMap.UnitConfig) {
      GoodsDiscountValue = JSON.parse(res.DataMap.UnitConfig).GoodsDiscount;
    }
    GoodsDiscount.value = GoodsDiscountValue;
    // tickets.forEach(row => {
    //     row.Amt = (row.Amt * GoodsDiscountValue / 100).toFixed(2)
    //     row.Discount = GoodsDiscountValue
    // })
    // calculationTableData();
  }
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
    let Discount = "";
    if (TicketForm.Discount) {
      Discount = TicketForm.Discount;
    } else {
      Discount = GoodsDiscount.value;
    }
    TicketForm.DiscountedPrice = (
      (Discount / 100) *
      TicketForm.OrgPrice
    ).toFixed(2);
    if (res.DataMap.GoodsQty > 1) {
      TicketForm.GoodsQtyDesc = `多选卡 ${res.DataMap.GoodsQty}选${res.DataMap.ExchangeGoodsQty}`;
    } else {
      TicketForm.GoodsQtyDesc = `单选卡`;
    }
  }
};
const onReturn = async (val) => {
  common.ClosePageTag("销售单详情");
  router.back();
};
const gettinymceinput = async (val) => {
  form.GoodsDetail = val;
};

const GetTicketBillSaleById = async (ID) => {
  let res = await GetTicketBillSale({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    form.BillId = res.DataMap.BillId;
    form.BillCode = res.DataMap.BillCode;
    form.UnitId = res.DataMap.UnitId;
    if (form.UnitId > 0) {
      changeCustomer(form.UnitId);
    }
    form.TakeName = res.DataMap.TakeName;
    form.TakeCell = res.DataMap.TakeCell;

    form.TicketCount = res.DataMap.TicketCount;
    form.SaleChannel = res.DataMap.SaleChannel;
    form.SaleDiscount = res.DataMap.SaleDiscount;
    form.SmsNotify = res.DataMap.SmsNotify == 1 ? true : false;
    form.SaleAmt = res.DataMap.SaleAmt;
    form.BillConfig = res.DataMap.BillConfig;
    form.BillRemark = res.DataMap.BillRemark;
    form.PreparedBy = res.DataMap.CreateUserName;
    form.PreparationTime = res.DataMap.CreateTime;
    if (res.DataMap.UnitConfig) {
      GoodsDiscount.value = JSON.parse(res.DataMap.UnitConfig).GoodsDiscount;
    }
    if (res.DataMap.BillConfig) {
      if (res.DataMap.SmsNotify == 1) {
        form.SmsTicketName = JSON.parse(res.DataMap.BillConfig).SmsTicketName;
      }
      form.TakeTitle = JSON.parse(res.DataMap.BillConfig).TakeTitle;
      form.ActiveTicketAfterPassApprove = JSON.parse(
        res.DataMap.BillConfig
      ).ActiveTicketAfterPassApprove;
      form.TakeImage = JSON.parse(res.DataMap.BillConfig).TakeImage;
      form.TakeWish = JSON.parse(res.DataMap.BillConfig).TakeWish;
      form.TakePass = JSON.parse(res.DataMap.BillConfig).TakePass;
    }

    res.DataMap.Details.forEach((row) => {
      tickets.push({
        TicketTemplateId: row.TicketTemplateId,
        TicketCount: row.TicketCount,
        Discount: row.Discount,
        TicketTemplateTitle: row.TicketTemplateTitle,
        TicketTemplateCode: row.TicketTemplateCode,
        GoodsQty: row.GoodsQty,
        ExchangeGoodsQty: row.ExchangeGoodsQty,
        ListImg: row.ListImg,
        ValidDateDesc2: row.ValidDateDesc2,
        OrgPrice: (row.OrgPrice / 100).toFixed(2),
        BillDetailId: row.BillDetailId,
        BillId: row.BillId,
        Amt: (row.Amt / 100).toFixed(2),
        BillId: row.BillId,
        DiscountedPrice: ((row.Amt / 100).toFixed(2) / row.TicketCount).toFixed(
          2
        ),
        TicketIndexScope: row.TicketIndexScope,
      });
    });
    calculationTableData();
  }
};
const addTicketBtn = async () => {
  if (form.UnitId == "" || form.SaleDiscount == "") {
    ElMessage.info("请先选择客户和输入整单折扣");
    return;
  }
  addTicketVisible.value = true;
  isEditTicket.value = "";

  clearTicketForm(); //把数据情况
};

const clearTicketForm = () => {
  TicketForm.TicketIndexScope = "";
  TicketForm.BillDetailId = "";
  TicketForm.BillId = form.BillId ? form.BillId : "";
  TicketForm.TicketTemplateId = "";
  TicketForm.TicketCount = "";
  TicketForm.LeftCount = "";
  TicketForm.OrgPrice = "";
  TicketForm.ValidDateDesc2 = "";
  TicketForm.GoodsQtyDesc = "";
  TicketForm.TicketTemplateTitle = "";
  TicketForm.TicketTemplateCode = "";
  TicketForm.GoodsQty = "";
  TicketForm.ExchangeGoodsQty = "";
  TicketForm.ListImg = "";
  TicketForm.Amt = "";
  TicketForm.DiscountedPrice = "";
  TicketForm.Discount = GoodsDiscount.value;
};
const changeCustomer = async (ID) => {
  GetUnitByID(ID);
};
const inputTicketCount = async (val) => {
  if (val) {
    TicketForm.Amt = (val * TicketForm.DiscountedPrice).toFixed(2);
  }
};
//计算折扣
const inputGoodsDiscount = async (val) => {
  if (val) {
    if (TicketForm.TicketCount) {
      TicketForm.DiscountedPrice = ((val * TicketForm.OrgPrice) / 100).toFixed(
        2
      );
      TicketForm.Amt = (
        TicketForm.DiscountedPrice * TicketForm.TicketCount
      ).toFixed(2);
    }
  }
};
//计算折后价
const inputDiscountedPrice = async (val) => {
  if (val) {
    TicketForm.Discount = ((val / TicketForm.OrgPrice) * 100).toFixed(2);
    TicketForm.Amt = (val * TicketForm.TicketCount).toFixed(2);
  }
};

const cennelTicketModalBtn = async () => {
  addTicketVisible.value = false;
  TicketForm.GoodsQtyDesc = "";
  TicketForm.OrgPrice = "";
  TicketForm.ValidDateDesc2 = "";
  TicketForm.LeftCount = "";
  formTicketRef.value.resetFields();
};
const editSendBtn = async (ID, idx, type) => {
  addTicketVisible.value = true;
  isEditTicket.value = type;
  changeTicketTemplateId(ID);
  chooseIdx.value = idx;
  tickets.forEach((row, index) => {
    if (index == idx) {
      TicketForm.TicketCount = row.TicketCount;
      TicketForm.BillDetailId = row.BillDetailId;
      TicketForm.BillId = row.BillId;
      TicketForm.Discount = row.Discount;
      TicketForm.TicketIndexScope = row.TicketIndexScope;
      TicketForm.DiscountedPrice = (row.Amt / row.TicketCount).toFixed(2);
      TicketForm.Amt = (row.TicketCount * row.OrgPrice).toFixed(2);
    }
  });
};
const delSendBtn = async (idx) => {
  tickets.forEach((row, index) => {
    if (index == idx) {
      tickets.splice(index, 1);
    }
  });
  calculationTableData();
};
const inputSaleDiscount = (idx) => {
  if (idx < 0) {
    form.SaleDiscount = 0;
  }
  calculationTableData();
};
if (router.currentRoute.value.query.ID) {
  //根据id来查询详情
  GetTicketBillSaleById(router.currentRoute.value.query.ID);
  Type.value = router.currentRoute.value.query.Type;
}
//通过批次页面进来的数据
if (router.currentRoute.value.query.isBatch) {
  let getTicketIds = store.state.ticket.ticketIds;
  getTicketIds.forEach(async (row) => {
    let res = await GetTicketTemplateById({
      TicketTemplateId: row,
      ReturnStatData: true,
    });
    if (res.Code == 200) {
      tickets.push({
        TicketTemplateId: res.DataMap.TicketTemplateId,
        Discount: 100,
        TicketTemplateTitle: res.DataMap.TicketTemplateTitle,
        TicketTemplateCode: res.DataMap.TicketTemplateCode,
        GoodsQty: res.DataMap.GoodsQty,
        TicketCount: 1,
        ExchangeGoodsQty: res.DataMap.ExchangeGoodsQty,
        ListImg: res.DataMap.ListImg,
        ValidDateDesc2: res.DataMap.ValidDateDesc2,
        OrgPrice: (res.DataMap.OrgPrice / 100).toFixed(2),
        BillDetailId: "",
        BillId: "",
        Amt: (res.DataMap.OrgPrice / 100).toFixed(2),
        DiscountedPrice: (res.DataMap.OrgPrice / 100).toFixed(2), //折后价
      });
      calculationTableData();
    }
  });
  isBatch.value = router.currentRoute.value.query.isBatch;
}

const fileVisible = ref(false);
const fileList = ref([]);
const fileparam = ref([]);
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
    } 个文件`
  );
};
const handleRemove = async (param) => {
  fileparam.value = {};
};

const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.TakeImage = res.DataMap.HttpsUrl;
    }
  });
};
const clear = () => {
  form.TakeImage = "";
};
const SuccessFile = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  fd.append("DataType", "TicketSaleBillPriceBook"); //传文件
  let res = await GetFileData(fd);
  if (res.Code == 200) {
    fileVisible.value = false;
    fileList.value = [];
    tickets.forEach((row) => {
      res.DataMap.forEach((row1) => {
        if (row.TicketTemplateId == row1.TicketTemplateId) {
          row.DiscountedPrice = Number(row1.SalePrice).toFixed(2);
          row.Discount = row1.Discount;
          row.Amt = Number(row.DiscountedPrice * row.TicketCount).toFixed(2);
        }
      });
    });
    calculationTableData();
  } else {
    ElMessage.warning(res.Message);
    fileList.value = [];
  }
};

const inDataBtn = async (val) => {
  fileVisible.value = true;
};
const cennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};
//增加数量
const addNumberBtn = async (dataIndex) => {
  tickets.forEach((row, index) => {
    if (index == dataIndex) {
      row.TicketCount++;
      row.Amt = (row.TicketCount * row.DiscountedPrice).toFixed(2);
      calculationTableData();
    }
  });
};
//减少数量
const reduceNumberBtn = async (dataIndex) => {
  tickets.forEach((row, index) => {
    if (index == dataIndex) {
      row.TicketCount--;
      if (Number(row.TicketCount) == 0) {
        row.TicketCount = 1;
      }
      row.Amt = (row.TicketCount * row.DiscountedPrice).toFixed(2);
      calculationTableData();
    }
  });
};
let activationBtn = ref(false);
const BoolRight = async () => {
  let arr = ["active_ticket_sale_bill"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    activationBtn.value = res.DataMap.active_ticket_sale_bill;
  }
};
//审批权限控制
BoolRight();
</script>

<style scoped>
#nav-send {
  list-style-type: none;
  margin-top: 10px;
  overflow-y: scroll;
  height: 450px;
}

.inli-send {
  border-bottom: solid 8px #f56c6c;
  position: relative;
  margin: 10px 10px 20px 0;
  border-radius: 4px;
  border-bottom-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
  height: 110px;
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

.sale-detail {
  height: 110px;
}

.send-edit {
  position: absolute;
  right: 60px;
  z-index: 9;
  top: 42px;
}

.send-edit img {
  width: 35px;
  height: 35px;
}

.send-del {
  position: absolute;
  right: 14px;
  z-index: 9;
  top: 42px;
}

.send-del img {
  width: 35px;
  height: 35px;
}

.sale-detail-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(102, 102, 102);
}

.sale-detail-time {
  font-size: 14px;
  color: rgb(153, 153, 153);
}

.sale-detail-tr {
  font-size: 14px;
  padding-bottom: 10px;
  color: rgb(102, 102, 102);
}

.sale-detail-td {
  font-size: 14px;
  color: #f56c6c;
}

.totalDetail {
  margin-top: 10px;
  width: 100%;
  height: 100px;
  border: 1px dashed #f56c6c;
}

.file-detail {
  position: relative;
  height: 80px;
  top: -10px;
}

.goods-sales {
  position: relative;
}

.goode-sales-number {
  border: solid 1px #f56c6c;
  border-radius: 20px;
  width: 100%;
  height: 27px;
  font-size: 16px;
  text-align: center;
}

.goode-sales-number .goode-number-add {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #f56c6c;
  cursor: pointer;
}

.goode-sales-number .goode-number-value {
  width: 30px;
  height: 28px;
  line-height: 28px;
  background-color: #f56c6c;
  font-size: 14px;
  color: #fff;
}

.goode-sales-number .goode-number-reduce {
  width: 30px;
  height: 30px;
  line-height: 28px;
  font-size: 22px;
  color: #6d6d6d;
  cursor: pointer;
}
</style>

<style>
.el-checkbox.el-checkbox--large .el-checkbox__label {
  color: #f56c6c !important;
}

.file-home-uploader {
  width: 150px;
  height: 40px;
}

.file-home-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.file-home-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}

.sale-uploader {
  width: 179.2px;
  height: 168px;
}

.sale-uploader .el-upload {
  width: 179.2px !important;
  height: 168px !important;
  line-height: 168px !important;
}

.sale-uploader-avatar {
  width: 100%;
}
</style>
