<template>
  <div class="container">
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local flex-row items-center" :span="18">基本信息</el-col>
      <el-col :span="6">
        <div class="button-mgl">
          <el-button v-loading.fullscreen.lock="btnLoading" size="" class="button1 button-float" round
            @click="Refresh()">
            &nbsp;&nbsp;刷&nbsp;&nbsp;新&nbsp;&nbsp;
          </el-button>
          <el-button v-if="loginUser.UnitName == '礼牛严选' && form.OrderType == 4" v-loading.fullscreen.lock="btnLoading"
            size="" class="button1 button-float" round @click="SynOrderCardFromHaoxinyApi()">
            从云中鹤中刷新卡密
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="8"> 订单号：{{ form.OrderCode }} </el-col>
            <el-col :span="8"> 下单时间：{{ form.OrderTime }} </el-col>
            <el-col :span="8"> 微信支付单号: {{ form.PayOrderId }} </el-col>
          </el-row>
          <el-row style="padding-bottom: 6px" v-if="form.OrderType == 0 || form.OrderType == 3">
            <el-col :span="8">
              收件人：{{ form.ContactName + " " + form.ContactCell }}
            </el-col>
            <el-col :span="8">
              地址：{{
                form.ContactProvinceName +
                " " +
                form.ContactCityName +
                " " +
                form.ContactDistrictName +
                " " +
                form.ContactAddress
              }}
            </el-col>
            <el-col :span="8"> 商城：{{ form.MallUnitName }} </el-col>
          </el-row>
          <el-row style="padding-bottom: 6px">
            <el-col :span="8"> 供应商：{{ form.UnitName }} </el-col>
            <el-col :span="8">
              购买人：{{ form.VipName + " " + form.VipCell }}
            </el-col>
            <el-col :span="8"> 状态：{{ form.OrderStatusDesc }} </el-col>
          </el-row>
          <el-row style="padding-bottom: 6px">
            <el-col :span="8"><span>总金额：{{ form.TotalAmt }} (元)</span> ，<span>折扣：{{ form.DiscountAmt }}
                (元)</span>，<span>卡券：{{ form.TicketAmt }}
                (元)</span></el-col>
            <el-col :span="8"><span>应付：{{ form.PayAmt }} (元)</span></el-col>
            <el-col :span="8"><span>退款：{{ form.RefundAmt }} (元)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"> 备注：{{ form.OrderRemark }} </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">商品信息</el-col>
    </el-row>
    <el-row style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.Details" style="width: 100%" border :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column align="left" label="购买商品">
                  <template #default="scope">
                    <el-link :underline="false" @click="goodsDetail(scope.row.GoodsId)" style="color: #f56c6c">
                      {{
                        scope.row.GoodsCode + " - " + scope.row.GoodsTitle
                      }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column v-if="form.OrderType == 0" align="center" label="SKU">
                  <template #default="scope">
                    <p v-if="scope.row.SkuCode">
                      {{
                        scope.row.SkuCode + " - " + scope.row.SkuPropertyDesc
                      }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column v-if="form.OrderType == 1" align="left" label="券">
                  <template #default="scope">
                    <el-table :data="scope.row.Ticketes" border class="table" v-loading="tableLoading"
                      ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }"
                      header-cell-class-name="table-header" style="width: 100%">
                      <el-table-column prop="TicketTemplateCode" align="center" label="批次号">
                      </el-table-column>
                      <el-table-column prop="TicketTemplateTitle" align="center" label="名称">
                      </el-table-column>
                      <el-table-column prop="TicketCode" align="center" label="券码">
                      </el-table-column>
                      <el-table-column prop="TicketStatusDesc" align="center" label="状态">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="参与营销活动" width="300">
                  <template #default="scope">
                    <el-link v-if="
                      scope.row.JoinMallAct && scope.row.JoinMallAct.ActName
                    " :underline="false" @click="
                      handleEdit(
                        scope.row.JoinMallAct.ActId,
                        'View',
                        scope.row.JoinMallAct.ActObjType
                      )
                      " style="color: #f56c6c">
                      {{ scope.row.JoinMallAct.ActCode }}</el-link>
                    <p v-if="
                      scope.row.JoinMallAct && scope.row.JoinMallAct.ActName
                    ">
                      {{ scope.row.JoinMallAct.ActName }}
                    </p>
                    <div v-if="
                      scope.row.JoinMallAct &&
                      scope.row.JoinMallAct.Ticketes.length >= 0
                    ">
                      <p v-for="(item, index) in scope.row.JoinMallAct.Ticketes" :key="index">
                        <el-icon :size="16" style="position: relative; top: 3px" color="#ff6666">
                          <Ticket />
                        </el-icon>{{ item.TicketTemplateTitle + " " + item.TicketCode }}
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="数量" width="60">
                  <template #default="scope">
                    <p>
                      {{ scope.row.Qty
                      }}<span v-if="scope.row.GiveQty > 0">(含{{ scope.row.GiveQty }}件赠品)</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="支付" width="160"><template #default="scope">
                    <div>
                      <p>
                        原价：{{
                          (scope.row.OrderOrgPrice / 100).toFixed(2)
                        }}(元)
                      </p>
                      <p>
                        总额：{{
                          (
                            (scope.row.OrderOrgPrice / 100) *
                            scope.row.Qty
                          ).toFixed(2)
                        }}(元)
                      </p>
                      <p>
                        折扣：{{ (scope.row.DiscountAmt / 100).toFixed(2) }}(元)
                      </p>
                      <p>实付：{{ (scope.row.PayAmt / 100).toFixed(2) }}(元)</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="退款" width="140"><template #default="scope">
                    <p v-if="scope.row.RefundQty">
                      数量：{{ scope.row.RefundQty }}
                    </p>
                    <p v-if="scope.row.RefundAmt">
                      金额：{{ (scope.row.RefundAmt / 100).toFixed(2) }}(元)
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="ExpressCode" v-if="form.OrderType == 0" align="center" label="物流信息" width="200">
                  <template #default="scope">
                    <p>{{ scope.row.ExpressTypeDesc }}</p>
                    <p>{{ scope.row.ExpressCode }}</p>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">支付信息</el-col>
    </el-row>
    <el-row style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.Pays" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column align="center" label="方式">
                  <template #default="scope">
                    <p v-if="scope.row.PayType == 'discount_ticket'">
                      {{
                        scope.row.PayTypeDesc + "(" + scope.row.PayRelNo4 + "%)"
                      }}
                    </p>
                    <p v-else>{{ scope.row.PayTypeDesc }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="单号/券码/卡号">
                  <template #default="scope">
                    <p v-if="scope.row.PayType == 'wx'">
                      {{ scope.row.PayRelNo1 }}
                    </p>
                    <p v-else>{{ scope.row.PayRelNo3 }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="商户号" width="160">
                  <template #default="scope">
                    <p v-if="scope.row.PayType == 'wx'">
                      {{ scope.row.PayRelNo2 + ' ' + scope.row.PayRelNo3 }}
                    </p>
                  </template></el-table-column>
                <el-table-column prop="CreateTime" align="center" label="时间" width="160"></el-table-column>
                <el-table-column align="center" label="金额(元)" width="100">
                  <template #default="scope">
                    <p v-if="scope.row.PayType != 'discount_ticket'">
                      {{ (scope.row.PayAmt / 100).toFixed(2) }}
                    </p>
                    <p v-else>{{ (scope.row.PayRelNo5 / 100).toFixed(2) }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="退款金额(元)" width="120">
                  <template #default="scope">
                    <p v-if="scope.row.PayType != 'discount_ticket'">
                      {{ (scope.row.RefundAmt / 100).toFixed(2) }}
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="form.CustomsList.length > 0" style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">报关信息</el-col>
    </el-row>
    <el-row v-if="form.CustomsList.length > 0" style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.CustomsList" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column align="center" label="总状态">
                  <template #default="scope">
                    <p v-if="scope.row.CustomsStatus == 0">未调用</p>
                    <p v-if="scope.row.CustomsStatus == 1">成功</p>
                    <p v-if="scope.row.CustomsStatus == 2">失败</p>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="报关信息">
                  <template #default="scope">
                    <p v-if="scope.row.CustomsOrderCount > 0">
                      调用时间：{{ scope.row.CustomsOrderTime }}
                    </p>
                    <p>调用次数：{{ scope.row.CustomsOrderCount }}</p>
                    <p>
                      调用状态：<span v-if="scope.row.CustomsOrderStatus == 0">未调用</span><span
                        v-if="scope.row.CustomsOrderStatus == 1">成功</span><span
                        v-if="scope.row.CustomsOrderStatus == 2">失败</span>
                      <span v-if="scope.row.CustomsOrderStatus == 3">申报中</span>
                      <span v-if="scope.row.CustomsOrderStatus == 4">未申报</span>
                      <span v-if="scope.row.CustomsOrderStatus == 5">已修改未申报</span>
                      <span v-if="scope.row.CustomsOrderStatus == 6">海关接口异常</span>
                      <span v-if="scope.row.CustomsOrderStatus == 99">其他</span>
                    </p>
                    <p v-if="scope.row.VerifyDept">
                      核验机构代码：{{ scope.row.VerifyDept }}
                    </p>
                    <p v-if="scope.row.VerifyDeptTransId">
                      核验机构交易流水号：{{ scope.row.VerifyDeptTransId }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="身份信息">
                  <template #default="scope">
                    <p v-if="scope.row.CustomsIdcardCount > 0">
                      调用时间：{{ scope.row.CustomsIdcardTime }}
                    </p>
                    <p>调用次数：{{ scope.row.CustomsIdcardCount }}</p>
                    <p v-if="scope.row.CustomsIdcardStatus == 0">
                      调用状态：未调用
                    </p>
                    <p v-if="scope.row.CustomsIdcardStatus == 1">
                      调用状态：成功
                    </p>
                    <p v-if="scope.row.CustomsIdcardStatus == 2">
                      调用状态：失败
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="景彤云仓信息">
                  <template #default="scope">
                    <p v-if="scope.row.JtglobleOrderCount > 0">
                      调用时间：{{ scope.row.JtglobleOrderTime }}
                    </p>
                    <p>调用次数：{{ scope.row.JtglobleOrderCount }}</p>
                    <p v-if="scope.row.JtglobleOrderStatus == 0">
                      调用状态：未调用
                    </p>
                    <p v-if="scope.row.JtglobleOrderStatus == 1">
                      调用状态：成功
                    </p>
                    <p v-if="scope.row.JtglobleOrderStatus == 2">
                      调用状态：失败
                    </p>
                    <p v-if="scope.row.JtglobleOrderCode">
                      订单编码：{{ scope.row.JtglobleOrderCode }}
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="form.Refunds.length > 0" style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">退款信息</el-col>
    </el-row>
    <el-row v-if="form.Refunds.length > 0" style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.Refunds" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column align="center" label="方式">
                  <template #default="scope">
                    <p v-if="scope.row.RefundType == 'discount_ticket'">
                      {{
                        scope.row.RefundTypeDesc +
                        "(" +
                        scope.row.RefundRelNo4 +
                        "%)"
                      }}
                    </p>
                    <p v-else>{{ scope.row.RefundTypeDesc }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="单号/券码/卡号">
                  <template #default="scope">
                    <p v-if="scope.row.RefundType == 'wx'">
                      {{ scope.row.RefundRelNo1 }}
                    </p>
                    <p v-else>{{ scope.row.RefundRelNo3 }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="金额(元)" width="100">
                  <template #default="scope">
                    <p v-if="scope.row.RefundType == 'discount_ticket'">
                      {{ (scope.row.RefundRelNo5 / 100).toFixed(2) }}
                    </p>
                    <p v-else>{{ (scope.row.RefundAmt / 100).toFixed(2) }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="CreateTime" align="center" label="时间" width="160"></el-table-column>
                <el-table-column prop="RefundRemark" align="center" label="备注"></el-table-column>
                <el-table-column prop="RefundStatusDesc" align="center" label="状态" width="100"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="form.Expresses && form.Expresses.length > 0" style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">物流信息</el-col>
    </el-row>
    <el-row v-if="form.Expresses && form.Expresses.length > 0" style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.Expresses" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column prop="ExpressTime" align="center" label="发货时间"></el-table-column>
                <el-table-column prop="ExpressTypeDesc" align="center" label="快递公司"></el-table-column>
                <el-table-column align="center" label="单号">
                  <template #default="scope">
                    <el-link :underline="false" @click="
                      viewExpress(scope.row.OrderExpressId, scope.row.OrderId)
                      " style="color: #f56c6c">
                      {{ scope.row.ExpressCode }}</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="form.NeedInvoice == 1" style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">开票信息</el-col>
    </el-row>
    <el-row v-if="form.NeedInvoice == 1" style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.InvoiceData" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column prop="InvoiceTypeDesc" align="center" label="发票类型" width="100"></el-table-column>
                <el-table-column prop="TitleTypeDesc" align="center" label="抬头类型" width="100"></el-table-column>
                <el-table-column prop="InvoiceTitle" align="center" label="抬头"></el-table-column>
                <el-table-column align="left" label="公司信息">
                  <template #default="scope">
                    <p>{{ scope.row.CompanyTaxno }}</p>
                    <p v-if="scope.row.CompanyAddress">
                      {{ scope.row.CompanyAddress }}
                    </p>
                    <p v-if="scope.row.CompanyContact">
                      {{ scope.row.CompanyContact }}
                    </p>
                    <p v-if="scope.row.CompanyTel">
                      {{ scope.row.CompanyTel }}
                    </p>
                    <p v-if="scope.row.CompanyBank">
                      {{ scope.row.CompanyBank }}
                    </p>
                    <p v-if="scope.row.CompanyBankAccount">
                      {{ scope.row.CompanyBankAccount }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="InvoiceExtInfoDesc" align="left" label="发票下载地址">
                  <template #default="scope">
                    <el-link @click="openInvoice(item.Url)" v-for="item in scope.row.InvoiceExtInfoDesc" :key="item"
                      :underline="false" style="color: #f56c6c">
                      {{ item.Url }}</el-link>
                  </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="总金额" width="100">
                  <template #default="scope">
                    <p>{{ scope.row.TotalAmt.toFixed(2) }}</p>
                  </template></el-table-column
                >
                <el-table-column align="center" label="不含税金额" width="100">
                  <template #default="scope">
                    <p>{{ scope.row.NetAmt.toFixed(2) }}</p>
                  </template>
                </el-table-column> -->
                <el-table-column align="left" label="接收人信息" width="180">
                  <template #default="scope">
                    <p>{{ scope.row.ReceiveCell }}</p>
                    <p v-if="scope.row.ReceiveEmail">
                      {{ scope.row.ReceiveEmail }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="InvoiceStatusDesc" align="center" label="开票状态" width="100"></el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button class="button-op-edit"
                        v-if="issueOrderInvoice && (form.Invoice.InvoiceStatus == 1 || form.Invoice.InvoiceStatus == 10)"
                        size="small" @click="uploadInvoice()">上传发票
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">卡密信息</el-col>
    </el-row>
    <el-row style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :data="form.Cards" border class="table" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column align="center" label="卡号">
                  <template #default="scope">
                    <p style="padding-right: 6px">{{ scope.row.CardNo }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="卡密">
                  <template #default="scope">
                    <p style="padding-right: 6px">{{ scope.row.CardPwd }}</p>
                  </template></el-table-column>
                <el-table-column align="center" label="兑换地址">
                  <template #default="scope">
                    <el-link style="color: #f56c6c; font-size: 12px; margin-left: 4px" :underline="false"
                      @click="copyToClipboard(scope.row.UseUrl)">
                      {{ scope.row.UseUrl }}</el-link>
                  </template></el-table-column>
                <el-table-column prop="EndTime" align="center" label="有效期" width="160"></el-table-column>
                <el-table-column align="center" label="状态" width="160">
                  <template #default="scope">
                    <p v-if="scope.row.CardStatus == 1">已核销</p>
                    <p v-else>未使用</p>
                  </template></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button class="button-op-edit" size="small" @click="copyClick(scope.row.CardNo)">复制卡号
                      </el-button>
                      <el-button class="button-op-edit" size="small" @click="copyClick(scope.row.CardPwd)">复制密码
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; padding-bottom: 10px">
      <el-col class="send-local send-local flex-row items-center" :span="24">日志</el-col>
    </el-row>
    <el-row style="padding-bottom: 6px">
      <el-col :span="24">
        <div class="order-detail">
          <el-row style="padding-bottom: 6px">
            <el-col :span="24">
              <el-table :header-cell-style="{ 'text-align': 'center' }" border :data="tableHistoryData"
                style="width: 100%">
                <el-table-column align="left" label="操作人" width="200">
                  <template #default="scope">
                    <p v-if="scope.row.OpUserName">
                      姓名：{{ scope.row.OpUserName }}
                    </p>
                    <p v-if="scope.row.OpRoleName">
                      角色：{{ scope.row.OpRoleName }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="OpTime" align="center" label="时间" width="160">
                </el-table-column>
                <el-table-column prop="OpTypeDesc" align="center" label="类型" width="100">
                </el-table-column>
                <el-table-column prop="FromStatusDesc" align="center" label="前置状态=>后置状态" width="220">
                  <template #default="scope">
                    <p>
                      <text v-if="scope.row.FromStatusDesc">{{ scope.row.FromStatusDesc }}=></text>
                      {{ scope.row.ToStatusDesc }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="OpRemark" align="center" label="备注">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="23" :offset="1">
        <el-row>
          <el-col :span="23">
            <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 查看物流详情 -->
    <el-dialog title="物流详情" class="padding_top" v-model="logisticsVisible" width="55%" :show-close="false">
      <div class="package-info" style="">
        <ul class="package-status">
          <li class="package-status-list" v-for="(item, index) in Logistics.data" :key="index">
            <el-icon :size="22">
              <LocationFilled />
            </el-icon>
            <div class="status-details">{{ item.context }}</div>
            <div class="status-time">{{ item.time }}</div>
          </li>
        </ul>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="logisticsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="上传发票" class="padding_top" v-model="uploadInvoiceVisible" width="55%" :show-close="false">
      <el-form-item label="发票" prop="ListImg">
        <el-row>
          <el-col :span="24">
            <el-upload class="invoice-uploader" ref="upload" :show-file-list="false" :http-request="SuccessImg"
              :before-upload="beforeUpload" :auto-upload="true">
              <el-button class="button1">上传文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  仅允许png和jpg格式
                </div>
              </template>
            </el-upload>
            <el-row>
              <el-col :span="6" v-for="(item, index) in fileList" :key="index" style="position: relative;">
                <el-image fit="cover" :src="item.url" :preview-src-list="previewImageList" hide-on-click-modal />
                <el-icon class="img-remove-icon" size="18" @click.stop="removeInvoiceImage(index)" title="删除">
                  <Close />
                </el-icon>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="onUpload">确认上传</el-button>
          <el-button class="button2" @click="uploadInvoiceVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Cookie from "js-cookie";
import { UploadSingle } from "@/api/imgapi.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  GetDeliverOrderExpressDetail,
  GetOrderById,
  GetBillOperateHises,
  SynOrderCardFromHaoxiny,
  UpdateOrderInvoice
} from "@/api/order.js";
import common from "@/utils/common.js";
import { useRights } from "@/hooks/useRights.js";
const rightCodes = ref([
  "issue_order_invoice"]);
const { hasRight } = useRights(rightCodes);
const issueOrderInvoice = computed(() => hasRight("issue_order_invoice"));
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const btnLoading = ref(false);

const Type = ref("");

let form = reactive({
  OrderId: "",
  OrderType: "",
  OrderCode: "",
  OrderStatusDesc: "", //状态
  OrderTime: "", //下单时间
  PayOrderId: "",
  ContactProvinceName: "",
  ContactCityName: "",
  ContactDistrictName: "",
  ContactAddress: "",
  ContactName: "",
  ContactCell: "",
  Details: [], //商品明细
  Expresses: [], //物流明细
  Pays: [], //支付明细
  Refunds: [], //退款明细
  UnitName: "",
  MallUnitName: "",
  VipName: "",
  VipCell: "",
  WxxcxOpenid: "",
  NeedInvoice: "",
  RealPayAmt: "", //购买数量
  OrderRemark: "",
  TotalAmt: "", //总金额(分)
  TicketAmt: "", //券金额(分)
  PayAmt: "", //支付金额(分)
  DiscountAmt: "", //折扣金额(分)
  TotalPayAmt: "", //支付(分)
  RefundAmt: "", //退款(分)
  Invoice: null,
  InvoiceData: [],
  CustomsList: [],
  Cards: [], //卡密信息
});
const onReturn = async (val) => {
  common.ClosePageTag("订单详情");
  router.back();
};
////////////////////////////////////////////////////////////////////////////////////////////////
const tableHistoryData = ref([]);
//查看订单操作历史
const GetBillOperateHisesApi = async (ID) => {
  let res = await GetBillOperateHises({
    BillId: ID,
  });
  if (res.Code == 200) {
    tableHistoryData.value = res.DataMap;
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
const GetOrderByIdApi = async (ID) => {
  try {
    btnLoading.value = true;
    const res = await GetOrderById({ ObjectId: ID });
    if (res.Code !== 200) {
      ElMessage.error(res.Message);
      onReturn();
      return;
    }
    // 基本字段直接赋值
    const baseFields = [
      "OrderCode",
      "OrderType",
      "OrderStatusDesc",
      "UnitName",
      "MallUnitName",
      "VipName",
      "VipCell",
      "OrderTime",
      "PayOrderId",
      "ContactProvinceName",
      "ContactCityName",
      "ContactDistrictName",
      "ContactAddress",
      "ContactName",
      "ContactCell",
      "Details",
      "Expresses",
      "Pays",
      "Refunds",
      "Invoice",
      "WxxcxOpenid",
      "RealPayAmt",
      "OrderRemark",
      "Cards",
      "NeedInvoice"
    ];

    baseFields.forEach((field) => {
      form[field] = res.DataMap[field];
    });

    form.OrderId = ID;

    // 处理发票数据
    form.InvoiceData = [];
    if (res.DataMap.Invoice) {
      const invoice = res.DataMap.Invoice;
      if (invoice.InvoiceExtInfo) {
        invoice.InvoiceExtInfoDesc = JSON.parse(invoice.InvoiceExtInfo).Invoices;
        invoice.InvoiceExtInfoDesc.forEach(item => {
          fileList.value.push({ name: '已上传发票', url: item.Url });
        })
      }
      form.InvoiceData.push(invoice);
    }

    // 处理报关信息
    form.CustomsList = [];
    if (res.DataMap.Customs) {
      form.CustomsList.push(res.DataMap.Customs);
    }

    // 处理金额转换（统一处理，便于维护）
    const amountFields = [
      "TotalAmt",
      "DiscountAmt",
      "PayAmt",
      "TicketAmt",
      "TotalPayAmt",
      "RefundAmt",
    ];
    amountFields.forEach((field) => {
      form[field] = formatAmount(res.DataMap[field]);
    });
  } catch (error) {
    console.error("获取订单详情失败:", error);
    ElMessage.error("获取订单详情失败，请稍后重试");
  } finally {
    btnLoading.value = false;
  }
};
// 抽取的金额格式化函数（分转元）
const formatAmount = (amountInCents) => {
  return (amountInCents / 100).toFixed(2);
};
const SynOrderCardFromHaoxinyApi = async () => {
  let res = await SynOrderCardFromHaoxiny({
    OrderId: form.OrderId,
  });
  if (res.Code == 200) {
    ElMessage.success("同步成功");
    GetOrderByIdApi(form.OrderId);
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
//查看物流
const logisticsVisible = ref(false);

//查看物流
const Logistics = ref([]);
const viewExpress = async (OrderExpressId, OrderId) => {
  let res = await GetDeliverOrderExpressDetail({
    OrderExpressId: OrderExpressId,
    OrderId: OrderId,
  });
  if (res.Code == 200) {
    logisticsVisible.value = true;
    Logistics.value = res.DataMap;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
//刷新
const Refresh = async () => {
  GetOrderByIdApi(form.OrderId);
  GetBillOperateHisesApi(form.OrderId);
};
////////////////////////////////////////////////////////////////////////////////////////////////
const handleEdit = (ID, Type, ActType) => {
  common.ClosePageTag("营销活动详情");
  router.push({
    path: "/market_page_info",
    query: {
      Type: Type,
      ID: ID,
      mkType: ActType,
    },
  });
};
const goodsDetail = (ID) => {
  if (form.OrderType == 5) {
    //后付款 需要跳转到卡券查询界面
    common.ClosePageTag("券码查询");
    router.push({
      path: "/find_no",
      query: {
        No: form.Details[0].GoodsCode,
      },
    });
  } else {
    common.ClosePageTag("售卖详情");
    router.push({
      path: "/selling_goods_info",
      query: {
        Type: "View",
        ID: ID,
      },
    });
  }

};

const copyClick = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("复制成功！");
  } catch (err) {
    ElMessage.success("复制失败");
  }
};
const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success("复制成功！");
  } catch (err) {
    ElMessage.success("复制失败");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
//上传发票
const uploadInvoiceVisible = ref(false)
const uploadInvoice = () => {
  uploadInvoiceVisible.value = true;
};
const fileList = ref([]);
const beforeUpload = async (file) => {
  const isJPG = file.type == "image/jpeg" || file.type == "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    this.$message.error("上传头像图片只能是 JPG或者png 格式!");
  }
  return isLt2M;
};
// 预览需要的纯 URL 数组
const previewImageList = computed(() => fileList.value.map(f => f.url).filter(Boolean))
const removeInvoiceImage = (idx) => {
  fileList.value.splice(idx, 1)
}
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      fileList.value.push({ name: param.file.name, url: res.DataMap.HttpsUrl });
    }
  });
};
const openInvoice = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}
const onUpload = async () => {
  if (fileList.value.length == 0) {
    ElMessage.error("请上传发票");
    return;
  }
  let Invoices = [];
  if (fileList.value.length > 0) {
    fileList.value.forEach((item) => {
      Invoices.push({ Url: item.url });
    });
  }
  let res = await UpdateOrderInvoice({
    OrderId: form.OrderId,
    Invoices: Invoices,
  });
  if (res.Code == 200) {
    ElMessage.success("上传成功");
    uploadInvoiceVisible.value = false;
    fileList.value = [];
    GetOrderByIdApi(form.OrderId);
    GetBillOperateHisesApi(form.OrderId);
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    Type.value = router.currentRoute.value.query.Type;
    GetOrderByIdApi(router.currentRoute.value.query.ID);
    GetBillOperateHisesApi(router.currentRoute.value.query.ID);
  }
};

Init();
</script>

<style scoped>
::v-deep(.padding_top .el-dialog__body) {
  padding-top: 20px !important;
  height: 300px;
  overflow-y: scroll;
}

.order-detail {
  font-size: 16px;
  padding: 0 28px;
}

ul {
  list-style: none;
}

.package-info {
  margin: 10px 14px 0;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

ul.package-status {
  width: 100%;
}

ul.package-status li.package-status-list {
  color: #666;
  font-size: 12px;
  border-left: 1px solid #eee;
  padding-left: 25px;
  position: relative;
  padding-bottom: 26px;
}

ul.package-status li.package-status-list:last-child {
  border: 0;
}

ul.package-status li .status-title {
  font-size: 14px;
}

ul.package-status li .status-details {
  line-height: 22px;
}

ul.package-status li.package-status-list i {
  width: 24px;
  height: 24px;
  display: inline-block;
  position: absolute;
  left: -12px;
  border-radius: 50%;
}

ul.package-status li.package-status-list span {
  width: 8px;
  height: 8px;
  display: inline-block;
  position: absolute;
  left: -5px;
  top: 8px;
  background: #eee;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
}
</style>
<style lang="less">
.invoice-uploader {
  width: auto;
  height: auto;

  .el-upload {
    width: auto !important;
    height: auto !important;
  }
}

.img-remove-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #fff;
  background: rgba(0, 0, 0, .45);
  border-radius: 50%;
  padding: 2px;
  transition: background .2s;
}

.img-remove-icon:hover {
  background: rgba(255, 0, 0, .7);
}
</style>