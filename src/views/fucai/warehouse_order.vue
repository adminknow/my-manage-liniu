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
                  @click="handleIn()"
                  v-if="IsApproveOrder"
                >
                  <el-icon> <DocumentAdd /> </el-icon>&nbsp;&nbsp;导入发货
                </el-button>
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
              <div class="button-mgl">
                <el-button
                  class="button2 button-float"
                  round
                  @click="handleApprove()"
                  v-if="IsApproveOrder"
                >
                  <el-icon> <DocumentAdd /> </el-icon>&nbsp;&nbsp;批量审核
                </el-button>
                <el-button
                  class="button2 button-float"
                  round
                  @click="importInvoice()"
                >
                  <el-icon> <DocumentAdd /> </el-icon>&nbsp;&nbsp;导入开票
                </el-button>
              </div>
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
              <!-- <el-form-item label="">
                  <el-input
                    v-model="query.search.express_code"
                    clearable
                    placeholder="请输入物流单号"
                  ></el-input>
                </el-form-item> -->
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
        @selection-change="handleSelectionOrderChange"
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
            <div class="child-contant">
              <p>商品信息</p>
              <el-table
                @selection-change="
                  handleSelectionChange($event, props.row.OrderId)
                "
                :data="props.row.Details"
                style="width: 90%"
                border
                :header-cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column
                  align="center"
                  :selectable="selected"
                  type="selection"
                  width="55"
                />
                <el-table-column align="left" label="商品">
                  <template #default="scope">
                    <el-popover
                      :width="300"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                    >
                      <template #default>
                        <el-icon v-if="!goodsInfo.GoodsDetail">
                          <Loading />
                        </el-icon>
                        <p v-else v-html="goodsInfo.GoodsDetail"></p>
                      </template>
                      <template #reference>
                        <el-link
                          @mouseover="mouseoverGoods(scope.row.GoodsId)"
                          @click="jumpGoodsClick(scope.row.GoodsId)"
                          style="color: #f56c6c; font-size: 12px"
                          :underline="false"
                          >{{
                            scope.row.GoodsCode + " - " + scope.row.GoodsTitle
                          }}</el-link
                        >
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="SKU">
                  <template #default="scope">
                    <p v-if="scope.row.SkuCode">
                      {{ scope.row.SkuCode + " - " + scope.row.SkuPropertyDesc }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Qty"
                  align="center"
                  label="购买数量"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="RefundQty"
                  align="center"
                  label="退款数量"
                  width="100"
                >
                </el-table-column>
                <el-table-column align="center" label="支付金额(元)" width="120">
                  <template #default="scope">
                    <p>{{ (scope.row.PayAmt / 100).toFixed(2) }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="退款金额(元)" width="120">
                  <template #default="scope">
                    <p>{{ (scope.row.RefundAmt / 100).toFixed(2) }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ExpressCode"
                  align="center"
                  label="物流信息"
                  width="150"
                >
                  <template #default="scope">
                    <p>{{ scope.row.ExpressTypeDesc }}</p>
                    <p>{{ scope.row.ExpressCode }}</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="child-contant" v-if="props.row.FaterTicketes.length > 0">
              <p>券信息</p>
              <el-table
                :data="props.row.FaterTicketes"
                style="width: 90%"
                border
                :header-cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column
                  prop="TicketTemplateCode"
                  align="center"
                  label="批次号"
                >
                </el-table-column>
                <el-table-column
                  prop="TicketTemplateTitle"
                  align="center"
                  label="名称"
                >
                </el-table-column>
                <el-table-column prop="TicketCode" align="center" label="券码">
                </el-table-column>
                <el-table-column
                  prop="TicketStatusDesc"
                  align="center"
                  label="状态"
                >
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          :selectable="selectedApprove"
          align="center"
          width="55"
        />
        <el-table-column align="left" label="订单信息" width="220">
          <template #default="scope">
            <el-link
              :underline="false"
              @click="handleEdit(scope.row.OrderId)"
              style="color: #f56c6c"
            >
              {{ scope.row.OrderCode }}</el-link
            >
            <p>{{ scope.row.OrderTime }}</p>
            <p>{{ scope.row.UnitName }}</p>
            <p>{{ scope.row.AccountName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="购买人" width="120">
          <template #default="scope">
            <p>{{ scope.row.VipName }}</p>
            <p>{{ scope.row.VipCell }}</p>
            <p v-if="scope.row.OrderScene">{{ scope.row.OrderScene }}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="收件人" width="200">
          <template #default="scope">
            <p v-if="scope.row.ContactName">
              {{ scope.row.ContactName }}&nbsp;{{ scope.row.ContactCell }}
            </p>
            <p v-if="scope.row.ContactProvinceName">
              {{
                scope.row.ContactProvinceName +
                " " +
                scope.row.ContactCityName +
                " " +
                scope.row.ContactDistrictName +
                " " +
                scope.row.ContactAddress
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="商品详情">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.Details" :key="index">
              <p>
                {{ item.GoodsCode + "-" + item.GoodsTitle }}
                <span style="margin-left: 10px">×{{ item.Qty }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="支付金额(元)" width="120">
          <template #default="scope">
            <p>卡券：{{ (scope.row.TicketAmt / 100).toFixed(2) }}</p>
            <p>微信：{{ (scope.row.PayAmt / 100).toFixed(2) }}</p>
          </template>
        </el-table-column>
  
        <el-table-column align="left" label="物流信息" width="200">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.Expresses" :key="index">
              <p>{{ item.ExpressTypeDesc }}</p>
              <p>
                {{ item.ExpressCode
                }}<span v-if="query.search.order_status == '31,40'"
                  ><el-link
                    style="color: #f56c6c; font-size: 12px; margin-left: 4px"
                    :underline="false"
                    @click="
                      handleDelExpress(item.OrderExpressId, scope.row.OrderId)
                    "
                  >
                    删除快递</el-link
                  ></span
                >
              </p>
              <p>{{ item.ExpressTime }}</p>
              <el-popover
                :width="300"
                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
              >
                <template #default>
                  <div v-if="Logistics.data">
                    <h5>{{ Logistics.data[0].context }}</h5>
                    <p style="margin-top: 6px">{{ Logistics.data[0].time }}</p>
                    <p style="font-size: 12px; margin-top: 6px">
                      以上为最新跟踪信息<el-link
                        @click="viewLogisticsAll"
                        style="color: #f56c6c; font-size: 12px"
                        :underline="false"
                        >查看全部</el-link
                      >
                    </p>
                  </div>
                  <el-icon v-else>
                    <Loading />
                  </el-icon>
                </template>
                <template #reference>
                  <el-link
                    @mouseover="mouseover(item.OrderExpressId, scope.row.OrderId)"
                    @mouseleave="mouseleave"
                    style="color: #f56c6c; font-size: 12px"
                    :underline="false"
                    >查看物流</el-link
                  >
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="OrderStatusDesc"
          label="状态"
          align="center"
          width="70"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div class="button-mgl">
              <el-button
                v-if="scope.row.OrderStatus == 20 && IsApproveOrder"
                class="button-op-edit"
                size="small"
                @click="handleOrderByApprove(scope.row.OrderId)"
                >审核
              </el-button>
              <el-button
                v-if="
                  scope.row.OrderStatus == 0 &&
                  IsEditOrder &&
                  scope.row.OrderType == 0
                "
                class="button-op-edit"
                size="small"
                @click="handleOrderById(scope.row.OrderId)"
                >修改收件
              </el-button>
              <el-button
                v-if="
                  (scope.row.OrderStatus == 30 || scope.row.OrderStatus == 31) &&
                  IsExpressOrder
                "
                class="button-op-reset"
                size="small"
                @click="handleSend(scope.row.OrderId)"
                >整单发货
              </el-button>
              <el-button
                v-if="
                  (scope.row.OrderStatus == 30 || scope.row.OrderStatus == 31) &&
                  IsExpressOrder
                "
                class="button-op-reset"
                size="small"
                @click="handleSend1(scope.row.OrderId)"
                >组合发货
              </el-button>
              <el-button
                v-if="scope.row.OrderStatus == 0 && IsCancelOrder"
                class="button-op-del"
                size="small"
                @click="handleCannel(scope.row.OrderId)"
                >取消
              </el-button>
              <el-button
                v-if="
                  (scope.row.OrderStatus == 20 ||
                    scope.row.OrderStatus == 30 ||
                    scope.row.OrderStatus == 31 ||
                    scope.row.OrderStatus == 40 ||
                    scope.row.OrderStatus == 100) &&
                  IsRefundOrder &&
                  scope.row.CanRefundAll
                "
                class="button-op-del"
                size="small"
                @click="handleRefundAll(scope.row.OrderId)"
                >全额退款
              </el-button>
              <el-button
                v-if="
                  (scope.row.OrderStatus == 20 ||
                    scope.row.OrderStatus == 30 ||
                    scope.row.OrderStatus == 31 ||
                    scope.row.OrderStatus == 40 ||
                    scope.row.OrderStatus == 100) &&
                  IsRefundOrder &&
                  scope.row.CanRefundPart &&
                  scope.row.OrderType != 3
                "
                class="button-op-del"
                size="small"
                @click="handleRefund(scope.$index, scope.row.OrderId)"
                >部分退款
              </el-button>
              <el-button
                v-if="scope.row.OrderStatus == 10"
                class="button-op-reset"
                size="small"
                @click="handleSendOrderTicket(scope.row.OrderId)"
                >手工发放券
              </el-button>
              <el-button
                class="button-op-reset"
                size="small"
                @click="handleHistoryBtn(scope.row.OrderId)"
                >日志
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
      <!-- 编辑弹出框 -->
      <el-dialog title="导入发货" v-model="inDataVisible" width="45%">
        <el-row>
          <el-col :span="24">
            <el-steps class="handlerSteps" :active="activeIndex" align-center>
              <el-step title="上传文件" />
              <el-step title="数据预览" />
              <el-step title="导入完成" />
            </el-steps>
          </el-col>
        </el-row>
        <el-row v-if="activeIndex == 0">
          <div v-if="!isDataError">
            <el-col :span="24">
              <div class="out-bg">
                <el-row>
                  <el-col :span="4">
                    <img
                      src="../../assets/imgs/order_out1.png"
                      style="width: 100px; height: 100px"
                    />
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <div class="out-bg1 flex-col justify-center">
                      <div>填写导入数据信息</div>
                      <div>
                        请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，多运单号'，'分开
                      </div>
                      <div>
                        <el-link
                          :underline="false"
                          href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/订单发货模板.xlsx?v=1"
                          style="color: #f56c6c"
                        >
                          下载模板</el-link
                        >
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="out-bg">
                <el-row>
                  <el-col :span="4">
                    <img
                      src="../../assets/imgs/order_out2.png"
                      style="width: 100px; height: 100px"
                    />
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <div class="out-bg1 flex-col justify-center">
                      <div>上传填好的信息表</div>
                      <div>
                        文件后缀名必须为xls 或xlsx
                        （即Excel格式）和以制表符分隔的文本文件，文件大小不得大于10M，最多支持导入3000条数据
                      </div>
                      <div class="file-detail">
                        <el-upload
                          v-model:file-list="fileList"
                          :limit="1"
                          :on-exceed="handleExceed"
                          :on-remove="handleRemove"
                          class="file-order-uploader"
                          action="#"
                          :http-request="SuccessFile"
                          :auto-upload="true"
                          :before-upload="beforeAvatarUpload"
                        >
                          <el-link :underline="false" style="color: #f56c6c">
                            上传文件</el-link
                          >
                        </el-upload>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </div>
          <el-col v-else :span="24">
            <div class="out-error-bg">
              <el-row>
                <el-col :span="24">
                  <div
                    class=""
                    style="background-color: #f8f8f8; overflow-y: scroll"
                  >
                    <p>错误信息:</p>
                    <p v-html="htmlValue"></p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="activeIndex == 1">
          <el-table
            :data="tableModalData"
            border
            class="table"
            ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="OrderCode"
              align="center"
              label="配送单号"
              width="200"
            >
            </el-table-column>
            <el-table-column prop="OrderCode" align="left" label="收件信息">
              <template #default="scope">
                <p>
                  {{ scope.row.ContactName }}&nbsp;{{ scope.row.ContactCell }}
                </p>
                <p>{{ scope.row.ContactAddress }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="ExpressTypeName"
              label="快递公司"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="ExpressCode"
              label="运单号"
              align="center"
              width="160"
            ></el-table-column>
          </el-table>
        </el-row>
        <el-row v-if="activeIndex == 3">
          <div style="width: 100%; margin: 0 auto">
            <el-result icon="success" title="导入成功" :sub-title="subTitle">
            </el-result>
          </div>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <div v-if="activeIndex == 0">
              <el-button
                v-if="isDataError"
                class="button1"
                @click="isDataError = false"
                >重新上传</el-button
              >
              <el-button class="button1" @click="onNextOneBtn">下一步</el-button>
            </div>
            <div v-if="activeIndex == 1">
              <el-button class="button1" @click="onNextTwoBtn">发货</el-button>
            </div>
          </span>
        </template>
      </el-dialog>
  
      <!-- 发货弹出框 -->
      <el-dialog
        title="发货"
        v-model="deliverGoodsVisible"
        width="38%"
        :close-on-click-modal="false"
      >
        <el-row>
          <el-col :span="24">
            <el-form
              ref="formSendRef"
              :model="form_send_modal"
              :rules="rules_send_modal"
              label-width="100px"
            >
              <el-row>
                <el-col :span="20">
                  <el-form-item label="备注">
                    <el-input
                      style="width: 100%"
                      type="textarea"
                      maxlength="100"
                      :rows="4"
                      show-word-limit
                      placeholder="请输入备注"
                      v-model="textareaSend"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="物流信息">
                <div
                  v-for="(item, index) in form_send_modal.Expresses"
                  :key="index"
                >
                  <el-row style="padding-bottom: 8px">
                    <el-col :span="11">
                      <el-select
                        v-model="item.ExpressType"
                        filterable
                        clearable
                        style="width: 100%"
                        placeholder="请选择快递公司"
                        @change="changeProvinces($event, 'Sender')"
                      >
                        <el-option
                          v-for="itemChild in expressList"
                          :key="itemChild.Name"
                          :label="itemChild.Name"
                          :value="itemChild.Code"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="11" :offset="1">
                      <el-input
                        v-model="item.ExpressCode"
                        placeholder="输入快递单号"
                      ></el-input>
                    </el-col>
                    <el-col :span="1">
                      <el-icon
                        v-if="index > 0"
                        :size="18"
                        style="position: relative; top: 5px; left: 2px"
                        @click="delExpressesBtn(index)"
                      >
                        <CloseBold />
                      </el-icon>
                      <el-icon
                        v-else
                        :size="18"
                        style="position: relative; top: 5px; left: 2px"
                        @click="delExpressesBtn(index)"
                      >
                      </el-icon>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <div style="width: 68%; margin: 0 auto" v-if="isOrderExpress">
                <el-row>
                  <el-col :span="24">
                    <el-button
                      style="width: 100%"
                      class="button2"
                      @click="addExpressesBtn"
                      >添 加</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="ModalSendLoadingBtn"
              @click="onSaveSendModal"
              >保 存</el-button
            >
            <el-button class="button2" @click="deliverGoodsVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 批量操作审核 -->
      <el-dialog
        title="手工发券"
        v-model="sendTicketVisible"
        width="38%"
        :show-close="false"
      >
        <el-input
          type="textarea"
          maxlength="100"
          :rows="4"
          show-word-limit
          placeholder="请输入备注"
          v-model="textareaSendTicket"
        >
        </el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="sendLoading"
              @click="sendTicketModalBtn"
              >确 认</el-button
            >
            <el-button class="button2" @click="sendTicketVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 查看物流详情 -->
      <el-dialog
        title="物流详情"
        class="padding_top"
        v-model="logisticsVisible"
        width="55%"
        :show-close="false"
      >
        <div class="package-info" style="">
          <ul class="package-status">
            <li
              class="package-status-list"
              v-for="(item, index) in Logistics.data"
              :key="index"
            >
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
            <el-button class="button2" @click="logisticsVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 操作 -->
      <el-dialog
        title="取消"
        v-model="cancelVisible"
        width="38%"
        :show-close="false"
      >
        <el-input
          type="textarea"
          maxlength="100"
          :rows="4"
          show-word-limit
          placeholder="请输入取消原因"
          v-model="textareaCancel"
        >
        </el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="cancelLoading"
              @click="cancelModalBtn"
              >确 认</el-button
            >
            <el-button class="button2" @click="cancelVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 操作审核 -->
      <el-dialog
        title="审核"
        v-model="approveVisible"
        width="38%"
        :show-close="false"
      >
        <el-input
          type="textarea"
          maxlength="100"
          :rows="4"
          show-word-limit
          placeholder="请输入审核内容"
          v-model="textareaApprove"
        >
        </el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="passLoading"
              @click="passModalBtn"
              >确 认</el-button
            >
            <el-button class="button2" @click="approveVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 显示订单操作记录 -->
      <el-dialog
        title="操作记录"
        v-model="hisesVisible"
        :show-close="false"
        width="80%"
        height="300"
      >
        <el-table
          :header-cell-style="{ 'text-align': 'center' }"
          v-loading="tableHistoryLoading"
          border
          :data="tableHistoryData"
          style="width: 100%"
        >
          <el-table-column align="left" label="操作人" width="200">
            <template #default="scope">
              <p v-if="scope.row.OpUserName">姓名：{{ scope.row.OpUserName }}</p>
              <p v-if="scope.row.OpRoleName">角色：{{ scope.row.OpRoleName }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="OpTime" align="center" label="时间" width="160">
          </el-table-column>
          <el-table-column
            prop="OpTypeDesc"
            align="center"
            label="类型"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="FromStatusDesc"
            align="center"
            label="前置状态=>后置状态"
            width="220"
          >
            <template #default="scope">
              <p>
                <text v-if="scope.row.FromStatusDesc"
                  >{{ scope.row.FromStatusDesc }}=></text
                >
                {{ scope.row.ToStatusDesc }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="OpRemark" align="center" label="备注">
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="button2" @click="hisesVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 修改收件信息弹出框 -->
      <el-dialog title="修改收件信息" v-model="receivingVisible" width="40%">
        <el-row>
          <el-col :span="22">
            <el-form
              ref="formUpdateRef"
              :model="formUpdate_modal"
              :rules="rules_modal"
              label-width="120px"
            >
              <el-form-item label="收件人">
                <el-input v-model="formUpdate_modal.ContactName"></el-input>
              </el-form-item>
              <el-form-item label="收件手机">
                <el-input v-model="formUpdate_modal.ContactCell"></el-input>
              </el-form-item>
              <el-form-item label="收件城市">
                <el-row>
                  <el-col :span="7">
                    <el-select
                      v-model="formUpdate_modal.ContactProvinceAreaId"
                      filterable
                      style="width: 100%"
                      placeholder="请选择"
                      @change="changeProvinces($event, 'Contact')"
                    >
                      <el-option
                        v-for="item in ContactProvinces"
                        :key="item.AreaName"
                        :label="item.AreaName"
                        :value="item.AreaId"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7" :offset="1">
                    <el-select
                      v-model="formUpdate_modal.ContactCityAreaId"
                      filterable
                      style="width: 100%"
                      placeholder="请选择"
                      @change="changeCitys($event, 'Contact')"
                    >
                      <el-option
                        v-for="item in ContactCitys"
                        :key="item.AreaName"
                        :label="item.AreaName"
                        :value="item.AreaId"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-select
                      v-model="formUpdate_modal.ContactDistrictAreaId"
                      filterable
                      style="width: 100%"
                      placeholder="请选择"
                      @change="changeDistricts($event, 'Contact')"
                    >
                      <el-option
                        v-for="item in ContactDistricts"
                        :key="item.AreaName"
                        :label="item.AreaName"
                        :value="item.AreaId"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="收件详细地址">
                <el-input v-model="formUpdate_modal.ContactAddress"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formUpdate_modal.OrderRemark"
                  maxlength="100"
                  :rows="4"
                  show-word-limit
                  type="textarea"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="ModalLoadingBtn"
              @click="onSaveModal"
              >保 存</el-button
            >
            <el-button class="button2" @click="receivingVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 部分退款弹出框 -->
      <el-dialog
        title="退款信息"
        class="datatable-refund"
        v-model="refundVisible"
        width="52%"
      >
        <el-row>
          <el-col :span="24">
            <el-table
              :header-cell-style="{ 'text-align': 'center' }"
              @selection-change="handleSelectionRefundChange"
              :data="GoodsDetailData"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                :selectable="selectedisCheck"
                align="center"
                width="40"
              />
              <el-table-column align="left" label="商品信息">
                <template #default="scope">
                  {{ scope.row.GoodsCode + " - " + scope.row.GoodsTitle }}
                  <div
                    v-if="
                      scope.row.JoinMallAct != null &&
                      scope.row.JoinMallAct.Ticketes.length > 0
                    "
                  >
                    <div
                      v-for="(item, index) in scope.row.JoinMallAct.Ticketes"
                      :key="item.index"
                      :index="index"
                    >
                      <p>
                        <el-checkbox
                          style="position: relative; top: 2px"
                          v-model="item.selected"
                          @change="SelTicketIndex1($event, scope.$index, index)"
                          label=""
                        />
                        {{ item.TicketCode + " - " + item.TicketTemplateTitle }}
                      </p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-if="isTicketShow" align="left" label="券信息">
                <template #default="scope">
                  <div
                    v-for="(item, index) in scope.row.Ticketes"
                    :key="item.index"
                    :index="index"
                  >
                    <p>
                      <el-checkbox
                        v-if="scope.row.Ticketes.length >= 1"
                        v-model="item.selected"
                        @change="SelTicketIndex($event, index)"
                        :disabled="item.TicketStatus != 2"
                        label=""
                      />
                      {{
                        item.TicketTemplateCode +
                        " " +
                        item.TicketCode +
                        " - " +
                        item.TicketTemplateTitle
                      }}
                    </p>
                  </div>
                </template>
              </el-table-column>
  
              <el-table-column align="center" label="售价(元)" width="80">
                <template #default="scope">
                  <p v-if="scope.row.RealQty != 0">
                    {{
                      (scope.row.RealPayAmt / scope.row.RealQty / 100).toFixed(2)
                    }}
                  </p>
                  <p v-else>0</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="RealQty"
                align="center"
                label="可退数量"
                width="80"
              ></el-table-column>
              <el-table-column label="退款数量" align="center" width="120">
                <template #default="scope">
                  <el-input v-model="scope.row.ApplyRefundQty"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="退款金额" align="center" width="150">
                <template #default="scope">
                  <el-input v-model="scope.row.ApplyRefundAmt">
                    <template #append>元</template></el-input
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="width: 100%; height: 10px"></div>
            <el-table
              v-if="isShowPaysListCount > 1"
              :header-cell-style="{ 'text-align': 'center' }"
              :data="PaysList"
              style="width: 100%"
              @selection-change="handleSelectionPaysRefundChange"
            >
              <el-table-column type="selection" align="center" width="40" />
              <el-table-column
                prop="PayTypeDesc"
                align="center"
                label="方式"
                width="80"
              ></el-table-column>
              <el-table-column
                prop="CreateTime"
                align="center"
                label="下单时间"
                width="160"
              ></el-table-column>
              <el-table-column label="单号" align="center">
                <template #default="scope">
                  <p v-if="scope.row.PayType == 'wx'">
                    {{ scope.row.PayRelNo1 }}
                  </p>
                  <p v-else>{{ scope.row.PayRelNo3 }}</p>
                </template>
              </el-table-column>
              <el-table-column label="可退金额" align="center" width="100">
                <template #default="scope">
                  <p>
                    {{
                      ((scope.row.PayAmt - scope.row.RefundAmt) / 100).toFixed(2)
                    }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="退款金额" align="center" width="150">
                <template #default="scope">
                  <el-input
                    :disabled="
                      scope.row.PayType == 'cash_ticket' ||
                      scope.row.PayType == 'discount_ticket'
                    "
                    v-model="scope.row.ApplyRefundAmt"
                  >
                    <template #append>元</template></el-input
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="width: 100%; height: 10px"></div>
            <el-input
              v-model="Remark"
              placeholder="请输入退货原因"
              maxlength="100"
              :rows="4"
              show-word-limit
              type="textarea"
            >
            </el-input>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="refundLoadingBtn"
              @click="RefundSaveModal"
              >保 存</el-button
            >
            <el-button class="button2" @click="refundVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
      <!-- 整单退款 -->
      <el-dialog
        title="全额退款"
        v-model="refundAllVisible"
        width="38%"
        :show-close="false"
      >
        <el-input
          type="textarea"
          maxlength="100"
          :rows="4"
          show-word-limit
          placeholder="请输入退款理由"
          v-model="refundAllApprove"
        >
        </el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              class="button1"
              :loading="refundAllLoading"
              @click="refundAllBtn"
              >确 认</el-button
            >
            <el-button class="button2" @click="refundAllVisible = false"
              >关 闭</el-button
            >
          </span>
        </template>
      </el-dialog>
  
      <!-- 导入开票 -->
      <el-dialog title="导入开票" v-model="InvoiceVisible" width="45%">
        <el-row>
          <el-col :span="24">
            <el-steps
              class="handlerSteps"
              :active="activeInvoiceIndex"
              align-center
            >
              <el-step title="上传文件" />
              <el-step title="数据预览" />
              <el-step title="导入完成" />
            </el-steps>
          </el-col>
        </el-row>
        <el-row v-if="activeInvoiceIndex == 0">
          <div v-if="!isInvoiceDataError">
            <el-col :span="24">
              <div class="out-bg">
                <el-row>
                  <el-col :span="4">
                    <img
                      src="../../assets/imgs/order_out1.png"
                      style="width: 100px; height: 100px"
                    />
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <div class="out-bg1 flex-col justify-center">
                      <div>填写导入数据信息</div>
                      <div>
                        请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，多运单号'，'分开
                      </div>
                      <div>
                        <el-link
                          :underline="false"
                          href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/开票导入模板.xlsx"
                          style="color: #f56c6c"
                        >
                          下载模板</el-link
                        >
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="out-bg">
                <el-row>
                  <el-col :span="4">
                    <img
                      src="../../assets/imgs/order_out2.png"
                      style="width: 100px; height: 100px"
                    />
                  </el-col>
                  <el-col :span="19" :offset="1">
                    <div class="out-bg1 flex-col justify-center">
                      <div>上传填好的信息表</div>
                      <div>
                        文件后缀名必须为xls 或xlsx
                        （即Excel格式）和以制表符分隔的文本文件，文件大小不得大于10M，最多支持导入3000条数据
                      </div>
                      <div class="file-detail">
                        <el-upload
                          v-model:file-list="fileInvoiceList"
                          :limit="1"
                          :on-remove="handleInvoiceRemove"
                          class="file-order-uploader"
                          action="#"
                          :http-request="SuccessInvoiceFile"
                          :auto-upload="true"
                          :before-upload="beforeInvoiceAvatarUpload"
                        >
                          <el-link :underline="false" style="color: #f56c6c">
                            上传文件</el-link
                          >
                        </el-upload>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </div>
          <el-col v-else :span="24">
            <div class="out-error-bg">
              <el-row>
                <el-col :span="24">
                  <div
                    class=""
                    style="background-color: #f8f8f8; overflow-y: scroll"
                  >
                    <p>错误信息:</p>
                    <p v-html="htmlInvoiceValue"></p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="activeInvoiceIndex == 1">
          <el-table
            :data="tableModalInvoiceData"
            border
            class="table"
            ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
          >
            <el-table-column prop="OrderCode" align="center" label="订单号">
            </el-table-column>
            <el-table-column
              prop="InvoiceCode"
              label="发票代码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="InvoiceNo"
              label="发票号码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="InvoiceNo"
              label="发票号码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="InvoiceUrl"
              label="发票下载地址"
              align="center"
              width="120"
            ></el-table-column>
          </el-table>
        </el-row>
        <el-row v-if="activeInvoiceIndex == 3">
          <div style="width: 100%; margin: 0 auto">
            <el-result icon="success" title="导入成功" :sub-title="subTitle">
            </el-result>
          </div>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <div v-if="activeInvoiceIndex == 0">
              <el-button
                v-if="isInvoiceDataError"
                class="button1"
                @click="isInvoiceDataError = false"
                >重新上传</el-button
              >
              <el-button class="button1" @click="onNextOneInvoiceBtn"
                >下一步</el-button
              >
            </div>
            <div v-if="activeInvoiceIndex == 1">
              <el-button class="button1" @click="onNextTwoInvoiceBtn"
                >确认</el-button
              >
            </div>
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
  import common from "@/utils/common.js";
  import {
    GetProvinceList,
    GetCityList,
    GetDistrictList,
    GetDictionaryDetailList,
  } from "@/api/common.js";
  import Cookie from "js-cookie";
  import {
    GetBillOperateHises,
    GetDeliverOrderExpressDetail,
    ApproveOrders,
    ModifyOrderContactInfo,
    AddOrderExpress,
    RefundOrder,
    DeleteOrderExpress,
    GetOrderById,
    SearchOrders,
    CancelOrder,
    SendOrderTicket,
  } from "@/api/order.js";
  import { StatSingle, HasRightes, SearchUnites } from "@/api/index.js";
  import { GetFileData, Import } from "@/api/imgapi.js";
  import { GetGoods } from "@/api/goods.js";
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
      active: false,
    },
    {
      value: "20",
      key: "待审核",
      active: true,
    },
    {
      value: "30,31",
      key: "待发货",
      active: false,
    },
    {
      value: "31,40",
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
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  const query = reactive({
    UserID: "",
    title: "",
    name: "",
    search: {
      order_code: "",
      order_status: "20", //状态 (0:全部;1:待付款;2:已完成;)
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
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  const handleSearch = () => {
    query.PageStartRow = 1;
    getData();
  };
  //表格数据
  const tableLoading = ref(false);
  const tableData = ref([]);
  const pageTotal = ref(0);
  // 获取表格数据
  const getData = async () => {
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
    let res = await SearchOrders({
      PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
      PageRowCount: query.PageRowCount,
      SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
      tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
      tableData.value.forEach((row) => {
        row.FaterTicketes = [];
        row.Details.forEach((DetailRow) => {
          if (DetailRow.Ticketes.length > 0) {
            row.FaterTicketes = row.FaterTicketes.concat(DetailRow.Ticketes);
          }
        });
      });
      pageTotal.value = res.DataMap.ToalCount;
    } else {
      pageTotal.value = 0;
      tableData.value = [];
      ElMessage.error(res.Message);
    }
    StatSingleData();
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
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //统计数量
  const StatData = reactive({
    wait_pay_cnt: "", //待付款
    pay_wait_ticket_cnt: "", //待发券
    wait_approve_cnt: "",
    wait_deliver_cnt: "",
  });
  const StatSingleData = async () => {
    //获取头部数据
    let res = await StatSingle({
      StatType: 8,
    });
    if (res.Code == 200) {
      StatData.wait_pay_cnt = res.DataMap.wait_pay_cnt;
      StatData.pay_wait_ticket_cnt = res.DataMap.pay_wait_ticket_cnt;
      StatData.wait_approve_cnt = res.DataMap.wait_approve_cnt;
      StatData.wait_deliver_cnt = res.DataMap.wait_deliver_cnt;
      if (res.DataMap.pay_wait_ticket_cnt > 0) {
        if (statusList.value.length < 9) {
          statusList.value.splice(2, 0, {
            value: "10",
            key: "已付款待发券",
            active: false,
          });
        }
      }
    }
  };
  const choosetag = (valIndex) => {
    statusList.value.forEach((row) => {
      row.active = false;
    });
    statusList.value[valIndex].active = true;
    query.search.order_status = statusList.value[valIndex].value;
    if (statusList.value[valIndex].value == 300) {
      query.search.order_status = "";
      //三个月
      const end = new Date();
      end.setHours(23, 59, 59);
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      start.setHours(0, 0, 0);
      query.search.time = [start, end];
    } else if (statusList.value[valIndex].value == "") {
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
    getData();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //订单列表多选
  const orderDataArr = ref([]);
  const orderIds = ref([]);
  const handleSelectionOrderChange = (val) => {
    orderDataArr.value = val;
    orderIds.value = [];
    val.forEach((row) => {
      orderIds.value.push(row.OrderId);
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //取消订单
  const orderIDValue = ref("");
  const cancelVisible = ref(false);
  const cancelLoading = ref(false);
  const textareaCancel = ref("");
  const handleCannel = (ID) => {
    textareaCancel.value = "";
    cancelVisible.value = true;
    orderIDValue.value = ID;
  };
  const cancelModalBtn = async () => {
    if (textareaCancel.value == "") {
      ElMessage.warning("请先输入取消原因");
      return;
    }
    cancelLoading.value = true;
    let res = await CancelOrder({
      OrderId: orderIDValue.value,
      Remark: textareaCancel.value,
    });
    cancelLoading.value = false;
    if (res.Code == 200) {
      cancelVisible.value = false;
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //部分退款
  const PaysList = ref(false); //付款信息列表
  const isShowPaysListCount = ref(0); //是否显示退款储值卡/现金卡
  const refundVisible = ref(false);
  const isTicketShow = ref(false);
  const Amt = ref("");
  const Remark = ref("");
  const GoodsDetailData = ref([]);
  
  const refundLoadingBtn = ref(false);
  const handleRefund = async (indexPost, orderIDPost) => {
    refundAllID.value = orderIDPost;
    Amt.value = "";
    refundVisible.value = true;
    Remark.value = "";
    tableData.value.forEach((row) => {
      if (row.OrderId == orderIDPost) {
        row.Details.forEach((rowDetail) => {
          rowDetail.Amt = "";
          if (rowDetail.ApplyRefundAmt) {
            rowDetail.ApplyRefundAmt = (rowDetail.ApplyRefundAmt / 100).toFixed(
              2
            );
          }
          rowDetail.Ticketes.forEach((row) => {
            if (rowDetail.Ticketes.length == 1) {
              row.selected = true;
            } else {
              row.selected = false;
            }
          });
        });
        if (row.OrderType == 1) {
          isTicketShow.value = true;
        } else {
          isTicketShow.value = false;
        }
      }
    });
  
    let res = await GetOrderById({
      ObjectId: orderIDPost,
    });
    if (res.Code == 200) {
      let PaysListNew = [];
      isShowPaysListCount.value = res.DataMap.Pays.length;
      res.DataMap.Pays.forEach((row) => {
        if (row.PayAmt > row.RefundAmt || row.PayType == "discount_ticket") {
          PaysListNew.push(row);
        }
      });
      res.DataMap.Details.forEach((row) => {
        row.Amt = "";
        if (row.ApplyRefundAmt) {
          row.ApplyRefundAmt = (row.ApplyRefundAmt / 100).toFixed(2);
        }
        if (row.JoinMallAct == null) {
          //说明当前这个是赠送的
          row.GoodsTitle = row.GoodsTitle + "(赠送)";
        }
        if (row.JoinMallAct != null && row.JoinMallAct.Ticketes.length > 0) {
          for (let i = 0; i < row.JoinMallAct.Ticketes.length; i++) {
            const element = row.JoinMallAct.Ticketes[i];
            element.selected = false;
          }
        }
      });
      GoodsDetailData.value = JSON.parse(JSON.stringify(res.DataMap.Details));
      console.log(GoodsDetailData.value);
      PaysList.value = PaysListNew;
    }
  };
  const multipleRefundSelection = ref([]); //退款商品选择
  const multiplePaysRefundSelection = ref([]); //退款支付信息选择
  const selectedisCheck = (row) => {
    if (isTicketShow.value) {
      //如果是券商品
      if (row.RealQty > 0) {
        //只要可退数量大于0就表示可以退
        return true; //可以选择
      } else {
        return false; //不可选择
      }
    } else {
      //如果有值，说明已经发货了
      if (row.OrderExpressId) {
        return false; //不可选择
      } else {
        if (row.RefundQty == row.Qty) {
          return false; //不可选择
        } else {
          return true; //可选择
        }
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////
  //选择券信息
  const SelTicketIndex = (event, Idx) => {};
  
  const SelTicketIndex1 = (event, FIdx, Idx) => {
    if (multipleRefundSelection.value.length == 0) {
      GoodsDetailData.value[FIdx].JoinMallAct.Ticketes[Idx].selected = false;
      return;
    }
    multipleRefundSelection.value.forEach((row, index) => {
      if (row.OrderDetailId == GoodsDetailData.value[FIdx].OrderDetailId) {
        row.Ticketes[Idx].selected = event;
      }
    });
  };
  ////////////////////////////////////////////////////////////////////////
  //保存当前数据
  const RefundSaveModal = async () => {
    let AmtValue = 0;
    if (multipleRefundSelection.value.length == 0) {
      ElMessage.error("请选择要退款的商品！");
      return;
    }
    let JSONList = JSON.parse(JSON.stringify(multipleRefundSelection.value));
    for (let i = 0; i < JSONList.length; i++) {
      const row = JSONList[i];
      if (row.Ticketes && row.Ticketes.length > 0) {
        let TicketesNew = [];
        //判断当前含有券信息，那么去循环是否勾选了券信息
        let isSel = false; //默认是没有勾选的
        for (let j = 0; j < row.Ticketes.length; j++) {
          if (row.Ticketes[j].selected) {
            //认为你是勾选了券信息
            isSel = true;
            TicketesNew.push(row.Ticketes[j]);
          }
        }
        row.Ticketes = JSON.parse(JSON.stringify(TicketesNew));
        row.ApplyRefundActGiveTicketes = JSON.parse(JSON.stringify(TicketesNew));
        if (!isSel) {
          //当前商品没有勾选券信息
          ElMessage.error(
            "商品名称：" +
              row.GoodsCode +
              "-" +
              row.GoodsTitle +
              " 请先勾选券信息"
          );
          return;
        }
      }
      if (row.JoinMallAct) {
        //如果不是赠品那么就需要输入退款金额，赠品的话 退款金额默认就是0
        if (row.GiveQty == 0) {
          if (row.ApplyRefundAmt == "") {
            ElMessage.error("请输入退款金额");
            return;
          }
        }
      }
      if (row.RealQty == 0) {
        ElMessage.error("当前商品数量为0，无法退款");
        return;
      }
      AmtValue = row.ApplyRefundAmt * 100 + AmtValue;
      row.ApplyRefundAmt = row.ApplyRefundAmt * 100;
    }
  
    let JSONPaysList = JSON.parse(
      JSON.stringify(multiplePaysRefundSelection.value)
    );
    for (let i = 0; i < JSONPaysList.length; i++) {
      const row = JSONPaysList[i];
      row.ApplyRefundAmt = row.ApplyRefundAmt * 100;
    }
    if (Remark.value == "") {
      ElMessage.error("请输入退款原因");
      return;
    }
    refundLoadingBtn.value = true;
    let res = await RefundOrder({
      OrderId: refundAllID.value,
      Amt: AmtValue,
      Details: JSONList,
      Pays: JSONPaysList,
      Remark: Remark.value,
    });
    refundLoadingBtn.value = false;
    if (res.Code == 200) {
      ElMessage.success("操作成功");
      handleSearch();
      refundVisible.value = false;
    } else {
      ElMessage.error(res.Message);
    }
  };
  const handleSelectionRefundChange = (val) => {
    multipleRefundSelection.value = val;
  };
  
  const handleSelectionPaysRefundChange = (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i].PayType == "cash_ticket") {
        val[i].ApplyRefundAmt = (val[i].PayAmt / 100).toFixed(2);
      }
    }
    multiplePaysRefundSelection.value = val;
  };
  //全额退款
  const refundAllVisible = ref(false);
  const refundAllApprove = ref("");
  const refundAllID = ref("");
  const refundAllLoading = ref(false);
  
  const handleRefundAll = (orderIDPost) => {
    refundAllID.value = orderIDPost;
    refundAllApprove.value = "";
    refundAllVisible.value = true;
  };
  const refundAllBtn = async () => {
    if (refundAllApprove.value == "") {
      ElMessage.error("请输入退款理由");
      return;
    }
    refundAllLoading.value = true;
    let Amt = "";
    for (let i = 0; i < tableData.value.length; i++) {
      if (tableData.value[i].OrderId == refundAllID.value) {
        Amt = tableData.value[i].PayAmt + tableData.value[i].TicketAmt;
      }
    }
    let res = await RefundOrder({
      OrderId: refundAllID.value,
      Amt: Amt,
      Details: [],
      Remark: refundAllApprove.value,
    });
    refundAllLoading.value = false;
    if (res.Code == 200) {
      ElMessage.success("操作成功");
      handleSearch();
      refundAllVisible.value = false;
    } else {
      ElMessage.error(res.Message);
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  const sendTicketVisible = ref(false);
  const sendLoading = ref(false);
  const textareaSendTicket = ref("");
  //手工发券
  const handleSendOrderTicket = (ID) => {
    sendTicketVisible.value = true;
    orderIDValue.value = ID;
    textareaSendTicket.value = "";
  };
  const sendTicketModalBtn = async () => {
    if (textareaSendTicket.value == "") {
      ElMessage.warning("请先输入备注");
      return;
    }
    sendLoading.value = true;
    let res = await SendOrderTicket({
      OrderId: orderIDValue.value,
      Remark: textareaSendTicket.value,
    });
    sendLoading.value = false;
    if (res.Code == 200) {
      sendTicketVisible.value = false;
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  let orderType = ref(""); //参数区别自有，礼牛平台
  const expressList = ref([]);
  const loginUser = JSON.parse(Cookie.get("User"));
  const init = async () => {
    //一个月
    if (router.currentRoute.value.query.orderType) {
      orderType.value = router.currentRoute.value.query.orderType;
      const end = new Date();
      end.setHours(23, 59, 59);
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      start.setHours(0, 0, 0);
      // query.search.time = [start, end];
      let res = await GetDictionaryDetailList({
        DictionaryCode: "express_type",
      });
      if (res.Code == 200) {
        expressList.value = res.DataMap;
      }
      query.PageStartRow = 1;
      getData();
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //导出
  const handleOut = () => {
    ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    })
      .then(async () => {
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
        let res = await SearchOrders({
          PageStartRow: 0,
          PageRowCount: 100000,
          SearchCondition: query.search,
          NoPage: true,
        });
        tableLoading.value = false;
        if (res.Code == 200) {
          if (!res.DataMap.Data) {
            ElMessage.error("当前暂无数据");
            return;
          }
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
            const tHeader = [
              "小程序",
              "券商",
              "状态",
              "订单号",
              "下单时间",
              "卡券支付金额(元)",
              "微信支付金额(元)",
              "商品编码",
              "商品名称",
              "商品数量",
              "商品价格",
              "SKU编码",
              "SKU属性",
              "券批次号",
              "券名称",
              "券码",
              "券状态",
              "寄件人",
              "寄件人电话",
              "下单场景",
              "收件人",
              "收件人电话",
              "省份",
              "城市",
              "区域",
              "收件人地址",
              "订单备注",
              "快递信息",
              "发票号",
              "发票代码",
              "抬头",
              "纳税人识别号",
              "公司地址",
              "公司联系人",
              "公司电话",
              "公司开户银行",
              "公司开户银行帐号",
            ];
            let OutData = [];
            res.DataMap.Data.forEach((row) => {
              row.Details.forEach((rowDetail) => {
                let ObjData = {
                  SkuCode: "",
                  SkuPropertyDesc: "",
                  TicketStatusDesc: "", //券状态
                  TicketTemplateCode: "", //券批次
                  TicketCode: "", //券号
                  TicketTemplateTitle: "",
                  ExpressTypeList: "", //快递信息
                  //发票信息弄进去
                  InvoiceTypeDesc: "", //发票类型(0:普票;1:专票;)
                  InvoiceStatusDesc: "", //发票状态
                  InvoiceNo: "", //发票号
                  InvoiceCode: "", //发票代码
                  InvoiceTitle: "", //抬头
                  CompanyTaxno: "", //纳税人识别号
                  CompanyAddress: "", //公司地址
                  CompanyContact: "", //公司联系人
                  CompanyTel: "", //公司电话
                  CompanyBank: "", //公司开户银行
                  CompanyBankAccount: "", //公司开户银行帐号
                };
                ObjData.AccountName = row.AccountName;
                ObjData.OrderCode = row.OrderCode;
                ObjData.TicketAmt = row.TicketAmt / 100;
                ObjData.PayAmt = row.PayAmt / 100;
                ObjData.OrderTime = row.OrderTime;
                ObjData.UnitName = row.UnitName;
                ObjData.VipName = row.VipName;
                ObjData.VipCell = row.VipCell;
                ObjData.ContactName = row.ContactName;
                ObjData.OrderScene = row.OrderScene;
                ObjData.ContactCell = row.ContactCell;
                ObjData.ContactProvinceName = row.ContactProvinceName;
                ObjData.ContactCityName = row.ContactCityName;
                ObjData.ContactDistrictName = row.ContactDistrictName;
                ObjData.ContactAddress = row.ContactAddress;
                ObjData.OrderRemark = row.OrderRemark;
                ObjData.OrderStatusDesc = row.OrderStatusDesc;
                if (row.Expresses.length > 0) {
                  row.Expresses.forEach((rowExpresses, index) => {
                    if (index > 0) {
                      ObjData.ExpressTypeList =
                        ObjData.ExpressTypeList +
                        "," +
                        `${
                          rowExpresses.ExpressTypeDesc
                            ? rowExpresses.ExpressTypeDesc
                            : ""
                        } - ${
                          rowExpresses.ExpressCode ? rowExpresses.ExpressCode : ""
                        } - ${
                          rowExpresses.ExpressTime ? rowExpresses.ExpressTime : ""
                        }`;
                    } else {
                      ObjData.ExpressTypeList = `${
                        rowExpresses.ExpressTypeDesc
                          ? rowExpresses.ExpressTypeDesc
                          : ""
                      } - ${
                        rowExpresses.ExpressCode ? rowExpresses.ExpressCode : ""
                      } - ${
                        rowExpresses.ExpressTime ? rowExpresses.ExpressTime : ""
                      }`;
                    }
                  });
                }
                if (row.Invoice != null) {
                  ObjData.InvoiceTypeDesc = row.Invoice.InvoiceTypeDesc;
                  ObjData.InvoiceStatusDesc = row.Invoice.InvoiceStatusDesc;
                  ObjData.InvoiceNo = row.Invoice.InvoiceNo;
                  ObjData.InvoiceCode = row.Invoice.InvoiceCode;
                  ObjData.InvoiceTitle = row.Invoice.InvoiceTitle;
                  ObjData.CompanyTaxno = row.Invoice.CompanyTaxno;
                  ObjData.CompanyAddress = row.Invoice.CompanyAddress;
                  ObjData.CompanyContact = row.Invoice.CompanyContact;
                  ObjData.CompanyTel = row.Invoice.CompanyTel;
                  ObjData.CompanyBank = row.Invoice.CompanyBank;
                  ObjData.CompanyBankAccount = row.Invoice.CompanyBankAccount;
                }
                ObjData.GoodsCode = rowDetail.GoodsCode;
                ObjData.GoodsTitle = rowDetail.GoodsTitle;
                ObjData.OrgPrice = rowDetail.OrgPrice / 100;
                ObjData.Qty = rowDetail.Qty;
                if (rowDetail.SkuId != "") {
                  //代表当前有sku
                  ObjData.SkuCode = rowDetail.SkuCode;
                  ObjData.SkuPropertyDesc = rowDetail.SkuPropertyDesc;
                }
                if (rowDetail.Ticketes.length > 0) {
                  rowDetail.Ticketes.forEach((rowTickets) => {
                    ObjData.TicketStatusDesc = rowTickets.TicketStatusDesc;
                    ObjData.TicketTemplateCode = rowTickets.TicketTemplateCode;
                    ObjData.TicketCode = rowTickets.TicketCode;
                    ObjData.TicketTemplateTitle = rowTickets.TicketTemplateTitle;
                  });
                  OutData.push(ObjData);
                } else {
                  OutData.push(ObjData);
                }
              });
            });
            const filterVal = [
              "AccountName",
              "UnitName",
              "OrderStatusDesc",
              "OrderCode",
              "OrderTime",
              "TicketAmt",
              "PayAmt",
              "GoodsCode",
              "GoodsTitle",
              "Qty",
              "OrgPrice",
              "SkuCode",
              "SkuPropertyDesc",
              "TicketTemplateCode",
              "TicketTemplateTitle",
              "TicketCode",
              "TicketStatusDesc",
              "VipName",
              "VipCell",
              "OrderScene",
              "ContactName",
              "ContactCell",
              "ContactProvinceName",
              "ContactCityName",
              "ContactDistrictName",
              "ContactAddress",
              "OrderRemark",
              "ExpressTypeList",
              "InvoiceNo",
              "InvoiceCode",
              "InvoiceTitle",
              "CompanyTaxno",
              "CompanyAddress",
              "CompanyContact",
              "CompanyTel",
              "CompanyBank",
              "CompanyBankAccount",
            ];
  
            const data = formatJson(filterVal, OutData);
            excel.export_json_to_excel({
              header: tHeader,
              data: data,
              filename: "订单导出" + time,
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
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //展开表格
  const expandChangeData = ref([]);
  const multipleSelection = ref([]);
  
  //勾选需要组合发货的商品
  const handleSelectionChange = (val, GoodsId) => {
    let selectionData = multipleSelection.value;
    if (val.length > 0) {
      val.forEach((row) => {
        selectionData.push({
          OrderDetailId: row.OrderDetailId,
          OrderId: GoodsId,
        });
      });
    } else {
      let indexDel = 0;
      selectionData.forEach((row, index) => {
        if (row.GoodsId == GoodsId) {
          indexDel = index;
        }
      });
      selectionData.splice(indexDel, 1);
    }
    multipleSelection.value = selectionData;
  };
  
  const goodsInfo = ref({});
  const mouseoverGoods = async (GoodsId) => {
    goodsInfo.value = {};
    let res = await GetGoods({
      ObjectId: GoodsId,
    });
    if (res.Code == 200) {
      goodsInfo.value = res.DataMap;
    }
  };
  const jumpGoodsClick = async (GoodsId) => {
    common.ClosePageTag("售卖详情");
    router.push({
      path: "/selling_goods_info",
      query: {
        ID: GoodsId,
        Type: "View",
      },
    });
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //权限判断
  const IsApproveOrder = ref(false);
  const IsEditOrder = ref(false);
  const IsCancelOrder = ref(false);
  const IsExpressOrder = ref(false);
  const IsForceCancelOrder = ref(false);
  const IsRefundOrder = ref(false);
  const BoolRight = async () => {
    let arr = [
      "approve_order",
      "edit_order",
      "express_order",
      "force_cancel_order",
      "cancel_order",
      "refund_order",
    ];
    let res = await HasRightes({ RightCodes: arr });
    if (res.Code == 200) {
      IsApproveOrder.value = res.DataMap.approve_order;
      IsEditOrder.value = res.DataMap.edit_order;
      IsCancelOrder.value = res.DataMap.cancel_order;
      IsExpressOrder.value = res.DataMap.express_order;
      IsForceCancelOrder.value = res.DataMap.force_cancel_order;
      IsRefundOrder.value = res.DataMap.refund_order;
    }
  };
  //取消配送单权限控制
  BoolRight();
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //审核按钮
  const flag = ref(true);
  const Msg = ref("");
  const textareaApprove = ref("");
  const approveVisible = ref(false);
  const passLoading = ref(false);
  const handleOrderByApprove = (val) => {
    textareaApprove.value = "";
    orderIds.value = [];
    orderIds.value.push(val);
    approveVisible.value = true;
  };
  //确认审批
  const passModalBtn = async () => {
    ApproveOrdersApi(orderIds.value.length, orderIds.value);
  };
  const ApproveOrdersApi = async (icount, List) => {
    if (flag.value && icount > 0) {
      let index = icount;
      let OrderIdsArr = [List[index - 1]];
      let res = await ApproveOrders({
        OrderIds: OrderIdsArr,
        Remark: textareaApprove.value,
      });
      if (res.Code == 200) {
        icount--;
        Msg.value = "操作成功";
        if (icount > 0) {
          ApproveOrdersApi(icount, List);
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
      textareaApprove.value = "";
      handleSearch();
    }
  };
  //批量发货
  const handleApprove = () => {
    if (orderDataArr.value.length == 0) {
      ElMessage.error("请先勾选数据");
      return;
    }
    textareaApprove.value = "";
    approveVisible.value = true;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //查看日志
  //获取订单操作历史
  const tableHistoryLoading = ref(false);
  const hisesVisible = ref(false);
  const tableHistoryData = ref([]);
  //查看订单操作历史
  const handleHistoryBtn = async (ID) => {
    tableHistoryLoading.value = true;
    let res = await GetBillOperateHises({
      BillId: ID,
    });
    tableHistoryLoading.value = false;
    if (res.Code == 200) {
      hisesVisible.value = true;
      tableHistoryData.value = res.DataMap;
    } else {
      ElMessage.error(res.Message);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //修改收件信息
  const receivingVisible = ref(false);
  const formUpdate_modal = reactive({
    OrderId: "",
    ContactProvinceAreaId: "", //配送的省ID
    ContactProvinceName: "", //配送的省
    ContactCityAreaId: "", //配送的市ID
    ContactCityName: "", //配送的市
    ContactDistrictAreaId: "", //配送的区ID
    ContactDistrictName: "", //配送的区
    ContactAddress: "", //配送的详细地址
    ContactName: "", //联系人
    ContactCell: "", //联系电话
    OrderRemark: "",
  });
  const rules_modal = {};
  const formUpdateRef = ref(null);
  
  const editVisible = ref(false);
  const ModalLoadingBtn = ref(false);
  
  //省市区数据
  const SenderProvinces = ref([]);
  const SenderCitys = ref([]);
  const SenderDistricts = ref([]);
  const ContactProvinces = ref([]);
  const ContactCitys = ref([]);
  const ContactDistricts = ref([]);
  const handleOrderById = async (ID) => {
    let res = await GetOrderById({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      clearForm();
      formUpdate_modal.OrderId = ID;
      formUpdate_modal.ContactProvinceAreaId = res.DataMap.ContactProvinceAreaId;
      formUpdate_modal.ContactProvinceName = res.DataMap.ContactProvinceName;
      formUpdate_modal.ContactCityName = res.DataMap.ContactCityName;
      formUpdate_modal.ContactCell = res.DataMap.ContactCell;
      formUpdate_modal.ContactName = res.DataMap.ContactName;
      formUpdate_modal.ContactAddress = res.DataMap.ContactAddress;
      formUpdate_modal.ContactDistrictName = res.DataMap.ContactDistrictName;
      formUpdate_modal.OrderRemark = res.DataMap.OrderRemark;
      receivingVisible.value = true;
      GetCityListApi(
        res.DataMap.ContactProvinceAreaId,
        res.DataMap.ContactProvinceName,
        "Contact",
        res.DataMap.ContactCityAreaId
      );
      GetDistrictListApi(
        res.DataMap.ContactCityAreaId,
        res.DataMap.ContactCityName,
        "Contact",
        res.DataMap.ContactDistrictAreaId
      );
    }
  };
  const GetProvinceListApi = async () => {
    let res = await GetProvinceList({});
    if (res.Code == 200) {
      SenderProvinces.value = res.DataMap;
      ContactProvinces.value = res.DataMap;
    }
  };
  GetProvinceListApi();
  const GetCityListApi = async (AreaId, AreaName, type, ContactCityAreaId) => {
    let res = await GetCityList({
      ProvinceAreaId: AreaId,
      ProvinceName: AreaName,
    });
  
    if (res.Code == 200) {
      if (type == "Contact") {
        ContactCitys.value = res.DataMap;
      } else {
        SenderCitys.value = res.DataMap;
      }
    }
    formUpdate_modal.ContactCityAreaId = ContactCityAreaId;
  };
  const GetDistrictListApi = async (
    AreaId,
    CityName,
    type,
    ContactDistrictAreaId
  ) => {
    let res = await GetDistrictList({
      CityAreaId: AreaId,
      CityName: CityName,
    });
    if (res.Code == 200) {
      if (type == "Contact") {
        ContactDistricts.value = res.DataMap;
      } else {
        SenderDistricts.value = res.DataMap;
      }
    }
    formUpdate_modal.ContactDistrictAreaId = ContactDistrictAreaId;
  };
  //选中省份
  const changeProvinces = (key, type) => {
    if (type == "Contact") {
      ContactProvinces.value.forEach((row) => {
        if (key == row.AreaId) {
          ContactCitys.value = [];
          ContactDistricts.value = [];
          formUpdate_modal.ContactCityAreaId = "";
          formUpdate_modal.ContactDistrictAreaId = "";
          GetCityListApi(row.AreaId, row.AreaName, type);
          formUpdate_modal.ContactProvinceName = row.AreaName;
        }
      });
    } else {
      SenderProvinces.value.forEach((row) => {
        if (key == row.AreaId) {
          GetCityListApi(row.AreaId, row.AreaName, type);
        }
      });
    }
  };
  //选中城市
  const changeCitys = (key, type) => {
    if (type == "Contact") {
      ContactCitys.value.forEach((row) => {
        if (key == row.AreaId) {
          GetDistrictListApi(row.AreaId, row.AreaName, type);
          formUpdate_modal.ContactCityName = row.AreaName;
        }
      });
    } else {
      SenderCitys.value.forEach((row) => {
        if (key == row.AreaId) {
          GetDistrictListApi(row.AreaId, row.AreaName, type);
        }
      });
    }
  };
  const clearForm = () => {
    formUpdate_modal.ContactProvinceAreaId = "";
    formUpdate_modal.OrderId = "";
    formUpdate_modal.ContactProvinceName = "";
    formUpdate_modal.ContactCityAreaId = "";
    formUpdate_modal.ContactCityName = "";
    formUpdate_modal.ContactDistrictAreaId = "";
    formUpdate_modal.ContactDistrictName = "";
    formUpdate_modal.ContactAddress = "";
    formUpdate_modal.ContactName = "";
    formUpdate_modal.ContactCell = "";
    formUpdate_modal.OrderRemark = "";
  };
  
  //保存当前数据
  const onSaveModal = () => {
    // 表单校验
    formUpdateRef.value.validate(async (valid) => {
      if (valid) {
        ModalLoadingBtn.value = true;
        let Order = formUpdate_modal;
        let res = await ModifyOrderContactInfo({
          Order: Order,
        });
        ModalLoadingBtn.value = false;
        if (res.Code == 200) {
          ElMessage.success("操作成功");
          clearForm();
          receivingVisible.value = false;
        } else {
          ElMessage.error(res.Message);
        }
      } else {
        return false;
      }
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //发货
  const formSendRef = ref(null);
  const ModalSendLoadingBtn = ref(false);
  const form_send_modal = reactive({
    OrderId: "",
    Expresses: [
      {
        ExpressType: "",
        ExpressCode: "",
      },
    ],
  });
  const rules_send_modal = {};
  const deliverGoodsVisible = ref(false);
  const textareaSend = ref("");
  const isOrderExpress = ref(true); //是否为整券发货(不是的话需要传ids)
  const handleSend = async (ID) => {
    form_send_modal.OrderId = ID;
    form_send_modal.Expresses = [
      {
        ExpressType: "",
        ExpressCode: "",
      },
    ];
    textareaSend.value = "";
    isOrderExpress.value = true;
    deliverGoodsVisible.value = true;
  };
  const onSaveSendModal = () => {
    //发货
    formSendRef.value.validate(async (valid) => {
      if (valid) {
        ModalSendLoadingBtn.value = true;
        let isError = 0;
        form_send_modal.Expresses.forEach((row) => {
          if (!row.ExpressCode || !row.ExpressType) {
            isError = 1;
          }
        });
        if (isError > 0) {
          ElMessage.error("请选择快递公司或者输入快递单号");
          ModalSendLoadingBtn.value = false;
          return;
        }
        let OrderDetailGoodsIds = [];
        let OrderDetailIdsValue = [];
        if (!isOrderExpress.value) {
          //当前为组合发货
          if (OrderDetailId.value.length == 0) {
            ElMessage.error("请先选择组合商品");
            ModalSendLoadingBtn.value = false;
            return;
          }
          OrderDetailIdsValue = OrderDetailId.value;
        }
        let res = await AddOrderExpress({
          OrderDetailIds: OrderDetailIdsValue,
          OrderDetailGoodsIds: [],
          Expresses: form_send_modal.Expresses,
          OrderId: form_send_modal.OrderId,
          Remark: textareaSend.value,
        });
        ModalSendLoadingBtn.value = false;
        if (res.Code == 200) {
          deliverGoodsVisible.value = false;
          ElMessage.success("操作成功");
          query.PageStartRow = 1;
          getData();
          multipleSelection.value = [];
        } else {
          ElMessage.error(res.Message);
        }
      } else {
        return false;
      }
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //查看物流
  const logisticsVisible = ref(false);
  const viewLogisticsAll = () => {
    logisticsVisible.value = true;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //判断check是否可以选择（根据状态来判断)
  const selectedApprove = (row, index) => {
    if (row.OrderStatus == 20) {
      // 根据你的条件来设置
      return true; //可选择
    } else {
      return false; //不可选择
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //兑换的商品是否允许check
  const selected = (row) => {
    //如果有值，说明已经发货了
    if (row.OrderExpressId) {
      return false; //可选择
    } else {
      return true; //不可选择
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  const OrderDetailId = ref([]);
  //组合发货
  const handleSend1 = async (ID) => {
    form_send_modal.OrderId = ID;
    form_send_modal.Expresses = [
      {
        ExpressType: "",
        ExpressCode: "",
      },
    ];
    textareaSend.value = "";
    isOrderExpress.value = false;
    OrderDetailId.value = [];
    multipleSelection.value.forEach((row) => {
      if (row.OrderDetailId) {
        OrderDetailId.value.push(row.OrderDetailId);
      }
    });
    deliverGoodsVisible.value = true;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //查看物流
  const Logistics = ref([]);
  const mouseover = async (OrderExpressId, OrderId) => {
    let res = await GetDeliverOrderExpressDetail({
      OrderExpressId: OrderExpressId,
      OrderId: OrderId,
    });
    if (res.Code == 200) {
      Logistics.value = res.DataMap;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //编辑
  const handleEdit = (ID) => {
    common.ClosePageTag("订单详情");
    router.push({
      path: "/order_info",
      query: {
        Type: "",
        ID: ID,
      },
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
  //删除快递单号
  const handleDelExpress = (OrderExpressId, OrderId) => {
    ElMessageBox.confirm("确定要删除吗？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    })
      .then(async () => {
        let res = await DeleteOrderExpress({
          OrderExpressId: OrderExpressId,
          OrderId: OrderId,
        });
        if (res.Code == 200) {
          query.PageStartRow = 1;
          getData();
        } else {
          ElMessage.error(res.Message);
        }
      })
      .catch(() => {});
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
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
  //导入发货
  const fileList = ref([]);
  const fileparam = ref([]);
  const inDataVisible = ref(false);
  const activeIndex = ref(0);
  const isDataError = ref(false);
  const tableModalData = ref([]);
  const htmlValue = ref("");
  const subTitle = ref("");
  const handleIn = () => {
    fileList.value = [];
    activeIndex.value = 0;
    isDataError.value = false;
    inDataVisible.value = true;
  };
  const SuccessFile = async (param) => {
    fileparam.value = param;
  };
  const handleRemove = async (param) => {
    fileparam.value = {};
  };
  const beforeAvatarUpload = async (file) => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/plain"; // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (!isExcel) {
      ElMessage.warning(
        `当前只能上传xls或xlsx类型文件（即Excel表格)和以制表符分隔的文本文件`
      );
    }
    return isExcel;
  };
  //导入文件第一步
  const onNextOneBtn = async () => {
    if (fileparam.value.file) {
      let fd = new FormData();
      fd.append("file", fileparam.value.file); //传文件
      fd.append("DataType", "OrderExpress"); //传文件
      let res = await GetFileData(fd);
      if (res.Code == 200) {
        activeIndex.value = 1;
        tableModalData.value = res.DataMap;
      } else {
        isDataError.value = true;
        htmlValue.value = res.Message.replaceAll("\r\n", "</br>");
        // ElMessage.warning(`${res.Message}`)
      }
    } else {
      ElMessage.warning(`请先上传文件`);
    }
  };
  //导入文件第二步
  const onNextTwoBtn = async () => {
    let fd = new FormData();
    fd.append("file", fileparam.value.file); //传文件
    fd.append("DataType", "OrderExpress"); //传文件
    let res = await Import(fd);
    if (res.Code == 200) {
      activeIndex.value = 3;
      subTitle.value = res.DataMap;
      query.PageStartRow = 1;
      getData();
    } else {
      ElMessage.warning(`${res.Message}`);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //开票导出
  const InvoiceVisible = ref(false);
  const activeInvoiceIndex = ref(0);
  const isInvoiceDataError = ref(false);
  const tableModalInvoiceData = ref([]);
  const fileInvoiceList = ref([]);
  const fileInvoiceParam = ref([]);
  const htmlInvoiceValue = ref("");
  const SuccessInvoiceFile = async (param) => {
    fileInvoiceParam.value = param;
  };
  const handleInvoiceRemove = async (param) => {
    fileInvoiceParam.value = {};
  };
  const beforeInvoiceAvatarUpload = async (file) => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/plain"; // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (!isExcel) {
      ElMessage.warning(
        `当前只能上传xls或xlsx类型文件（即Excel表格)和以制表符分隔的文本文件`
      );
    }
    return isExcel;
  };
  const importInvoice = async () => {
    InvoiceVisible.value = true;
  };
  //导入文件第一步
  const onNextOneInvoiceBtn = async () => {
    if (fileInvoiceParam.value.file) {
      let fd = new FormData();
      fd.append("file", fileInvoiceParam.value.file); //传文件
      fd.append("DataType", "OrderInvoice"); //传文件
      let res = await GetFileData(fd);
      if (res.Code == 200) {
        activeInvoiceIndex.value = 1;
        tableModalInvoiceData.value = res.DataMap;
      } else {
        isInvoiceDataError.value = true;
        htmlInvoiceValue.value = res.Message.replaceAll("\r\n", "</br>");
        // ElMessage.warning(`${res.Message}`)
      }
    } else {
      ElMessage.warning(`请先上传文件`);
    }
  };
  //导入文件第二步
  const onNextTwoInvoiceBtn = async () => {
    let fd = new FormData();
    fd.append("file", fileInvoiceParam.value.file); //传文件
    fd.append("DataType", "OrderInvoice"); //传文件
    let res = await Import(fd);
    if (res.Code == 200) {
      activeInvoiceIndex.value = 3;
      subTitle.value = res.DataMap;
      query.PageStartRow = 1;
      getData();
    } else {
      activeInvoiceIndex.value = 0;
      fileInvoiceParam.value = [];
      ElMessage.warning(`${res.Message}`);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  init();
  ////////////////////////////////////////////////////////////////////////////////////////////////
  watch(
    () => router.currentRoute.value,
    (data) => {
      let isRenovate = 0;
      store.state.tags.tagsList.forEach((row) => {
        if (row.title == "订单列表") {
          isRenovate = 1;
        }
      });
      if (
        store.state.tags.pageSaerch.Search == 1 &&
        isRenovate == 1 &&
        store.state.tags.pageSaerch.titlePage == "订单列表"
      ) {
        query.PageStartRow = 1;
        getData();
        store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
      } else if (data.query.orderType) {
        orderType.value = data.query.orderType;
        query.PageStartRow = 1;
        getData();
      }
    }
  );
  </script>
  <style>
  .datatable-refund .el-table__body tr.current-row > td {
    color: #fff;
    background: #f56c6c !important;
  }
  </style>
  <style scoped>
  ::v-deep(.datatable-refund .el-dialog__body) {
    padding-top: 10px !important;
  }
  
  ::v-deep(.padding_top .el-dialog__body) {
    padding-top: 20px !important;
    height: 300px;
    overflow-y: scroll;
  }
  
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
  
  .child-contant {
    margin: 20px;
    margin-top: 0;
    padding-left: 90px;
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
  
  .out-bg {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    height: 100px;
    position: relative;
    border-radius: 10px;
    box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
    -webkit-box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
    -moz-box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
  }
  .out-error-bg {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    position: relative;
    /* border-radius: 10px; */
    box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
    -webkit-box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
    -moz-box-shadow: 0px 0px 20px 1px rgba(244, 244, 244, 0.5);
    max-height: 300px;
    overflow-y: scroll;
  }
  </style>
  
  <style lang="less">
  .handlerSteps {
    .el-step__icon {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 14px;
    }
  
    .el-step__title {
      font-size: 14px;
    }
  
    .el-step__head.is-finish {
      color: #fff;
      border-color: #ff8686;
    }
  
    .el-step__icon.is-text {
      border-radius: 33%;
    }
  
    .el-step.is-horizontal .el-step__line {
      top: 9px;
    }
  
    .is-process .el-step__icon {
      background-color: #ff8686;
      color: #fff;
      border-color: #ff8686;
    }
  
    .is-finish .el-step__icon {
      background-color: #ff8686;
    }
  
    .el-step__title.is-finish {
      color: #000;
    }
  
    .el-step__description.is-finish {
      color: #bbbbbb;
    }
  
    .el-step__description.is-process {
      color: #bbbbbb;
    }
  
    .el-step__title is-wait {
      color: #747474;
    }
  }
  
  .file-detail {
    position: relative;
  }
  
  .file-order-uploader {
    width: auto;
    height: 20px;
  }
  
  .file-order-uploader .el-upload {
    width: auto !important;
    height: 20px !important;
    border: none !important;
  }
  
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
    // margin-top: 1px;
    background-color: #fff;
    border-bottom: 1px solid #fff;
    border-top: 2px solid #f56c6c;
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
  </style>
  