<template>
  <div class="container">
    <div class="handle-box">
      <!-- 使用配送订单搜索表单组件 -->
      <DeliverOrderSearchForm v-model="query.search" :showImportButton="IsExpressDeliverOrder"
        :showBatchApproveButton="IsApproveDeliverOrder" :showAddButton="IsEditDeliverOrder"
        :showUnitSelect="loginUser.UnitType == 1" :unitOptions="UnitData" :loading="SelLoading" @search="handleSearch"
        @export="handleOut" @import="handleIn" @batchApprove="handleApprove" @add="handleAdd"
        @remoteMethod="remoteMethod" />
    </div>

    <!-- 状态标签 -->
    <div class="order_tags">
      <ul>
        <li @click="choosetag(index)" class="order_tags-li" v-for="(item, index) in statusList"
          :class="{ active: item.active }" :key="index">
          {{ item.key
          }}<text v-if="item.key == '待审核' && StatData.wait_approve_cnt > 0">({{ StatData.wait_approve_cnt }})</text>
          <text v-if="item.key == '待发货' && StatData.wait_deliver_cnt > 0">({{ StatData.wait_deliver_cnt }})</text>
        </li>
      </ul>
    </div>
    <div style="width: 100%; height: 8px"></div>
    <el-table @expand-change="expandChange" @selection-change="handleSelectionOrderChange" :data="tableData" border
      class="table" v-loading="tableLoading" ref="tableDataRef" :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header">
      <el-table-column type="expand">
        <template #default="props">
          <div class="child-contant" v-for="(item, index) in props.row.Details" :key="index">
            <el-row>
              <el-col :span="17">
                {{ index + 1 }}.
                {{
                  item.VipTicket.TicketTemplate.Code +
                  " " +
                  item.VipTicket.TicketTemplate.Title +
                  " ¥" +
                  (item.VipTicket.TicketTemplate.OrgPrice / 100).toFixed(2)
                }}
                <text>{{ item.VipTicket.TicketCode }}</text>
                <text v-if="item.ExpressCode">{{
                  " 物流信息：" + item.ExpressCode
                }}</text>
                <text v-if="item.PayPrice > 0"> 后付款 支付单号：{{ item.PayOrderCode }} 支付金额：{{ (item.PayPrice /
                  100).toFixed(2)
                }}元 {{ item.PayStatusDesc }} 支付人：{{ item.PayerVipName + ' ' + item.PayerVipCell }} </text>
              </el-col>
              <div class="button-mgl">
                <el-button class="button-op-edit" size="small" v-if="
                  !item.ExpressCode &&
                  (props.row.OrderStatus == 9 || props.row.OrderStatus == 11)
                " @click="handleGoodsSend(item.ExchangeGoods, item.OrderId)">整券发货
                </el-button>
                <el-button class="button-op-edit" :loading="loading" size="small" v-if="item.PayStatusDesc!='已支付'&&item.PayPrice > 0 && isPushPayTicketOrderPayNotify && props.row.OrderStatus == 0
                " @click="handleSendPay(item.PayOrderId)">推送支付通知
                </el-button>
              </div>
            </el-row>
            <el-form-item label="" style="" v-if="
              item.ExchangeGoods[0] && item.ExchangeGoods[0].GoodsId != ''
            ">
              <el-table @selection-change="
                handleSelectionChange(
                  $event,
                  item.TicketId,
                  item.ExchangeGoods,
                  index,
                  item.OrderId
                )
                " :span-method="(param) => objectSpanMethod(param, item.ExchangeGoods.length)
                  " :data="item.ExchangeGoods" style="width: 90%" border
                :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column prop="GoodsTitle" align="center" label="" width="105">
                  <template #default="scope">
                    <p v-if="false">{{ scope.row.GoodsTitle }}</p>
                    <p>已兑换商品</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" :selectable="selected" type="selection" width="55" />
                <el-table-column align="center" label="所属组合装商品">
                  <template #default="scope">
                    <p v-if="scope.row.PackageGoodsId">
                      {{
                        scope.row.PackageGoodsCode +
                        " - " +
                        scope.row.PackageGoodsTitle
                      }}
                      × {{ scope.row.PackageGoodsQty }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品">
                  <template #default="scope">
                    <el-popover :width="300"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                      <template #default>
                        <el-icon v-if="!goodsInfo.GoodsDetail">
                          <Loading />
                        </el-icon>
                        <p v-else v-html="goodsInfo.GoodsDetail"></p>
                      </template>
                      <template #reference>
                        <el-link @mouseover="mouseoverGoods(scope.row.GoodsId)"
                          @click="jumpGoodsClick(scope.row.GoodsId)" style="color: #f56c6c; font-size: 12px"
                          :underline="false">{{
                            scope.row.GoodsCode + " - " + scope.row.GoodsTitle
                          }}</el-link>
                      </template>
                    </el-popover>
                    <p>{{ (scope.row.GoodsOrgPrice / 100).toFixed(2) }}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="SKU">
                  <template #default="scope">
                    <p v-if="scope.row.SkuCode">
                      {{
                        scope.row.SkuCode + " - " + scope.row.SkuPropertyDesc
                      }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="GoodsBarcode" align="center" label="商品条码" width="150">
                </el-table-column>
                <el-table-column prop="GoodsQty" align="center" label="数量" width="55">
                </el-table-column>
                <el-table-column prop="ExpressCode" align="center" label="物流信息" width="150">
                  <template #default="scope">
                    <p>{{ scope.row.ExpressTypeDesc }}</p>
                    <p>{{ scope.row.ExpressCode }}</p>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" :selectable="selectedApprove" align="center" width="55" />
      <el-table-column prop="OrderCode" align="left" label="配送信息" width="220">
        <template #default="scope">
          <p>{{ scope.row.OrderCode }}</p>
          <p>{{ scope.row.OrderTime }}</p>
          <p>{{ scope.row.DeliverUnitName }}</p>
          <p>{{ scope.row.AccountName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="OrderCode" align="left" label="寄件/收件" width="200">
        <template #default="scope">
          <p>{{ scope.row.Openid }}</p>
          <div v-if="scope.row.VipName">
            <p>{{ scope.row.VipName }}</p>
            <p>{{ scope.row.VipCell }}</p>
            <div class="send-hx" style=""></div>
          </div>
          <p>{{ scope.row.ContactName }}&nbsp;{{ scope.row.ContactCell }}</p>
          <p>
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
      <el-table-column align="left" label="券明细">
        <template #default="scope">
          <div v-for="(item, index) in scope.row.Details" :key="item.OrderDetailId">
            <span style="cursor: pointer;color: #f56c6c;" @click="TicketDetailClick(item.VipTicket.TicketTemplate.Id)">
              {{
                index +
                1 +
                ". " +
                item.VipTicket.TicketTemplate.Code +
                " " +
                item.VipTicket.TicketTemplate.Title
              }}
            </span>
            <span style="cursor: pointer;color: #f56c6c;" @click="TicketNoClick(item.VipTicket.TicketCode)">{{
              " - " +
              item.VipTicket.TicketCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="物流信息" width="200">
        <template #default="scope">
          <div v-for="(item, index) in scope.row.Expresses" :key="index">
            <p>{{ item.ExpressTypeDesc }}</p>
            <div>
              <p>
                {{ item.ExpressCode }}
                <span v-if="IsExpressDeliverOrder"><el-link style="color: #f56c6c; font-size: 12px" :underline="false"
                    @click="
                      handleDelExpress(item.OrderExpressId, scope.row.OrderId)
                      ">删除快递</el-link></span>
              </p>
            </div>
            <p>{{ item.ExpressTime }}</p>
            <el-popover :width="300"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
              <template #default>
                <div v-if="Logistics.data">
                  <h5>{{ Logistics.data[0].context }}</h5>
                  <p style="margin-top: 6px">{{ Logistics.data[0].time }}</p>
                  <p style="font-size: 12px; margin-top: 6px">
                    以上为最新跟踪信息<el-link @click="viewLogisticsAll" style="color: #f56c6c; font-size: 12px"
                      :underline="false">查看全部</el-link>
                  </p>
                </div>
                <el-icon v-else>
                  <Loading />
                </el-icon>
              </template>
              <template #reference>
                <el-link @mouseover="mouseover(item.OrderExpressId, scope.row.OrderId)" @mouseleave="mouseleave"
                  style="color: #f56c6c; font-size: 12px" :underline="false">查看物流</el-link>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="快递费" width="200">
        <template #default="scope">
          <div v-if="scope.row.ExpressFeeStatus > 0">
            <p>¥{{ (scope.row.ExpressFee / 100).toFixed(2)
            }}<span>&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.ExpressFeeStatusDesc }}</span></p>
          </div>
          <div v-if="scope.row.Pays.length > 0">
            <div v-for="(item, index) in scope.row.Pays" :key="index">
              {{ item.PayTypeDesc }}单号：{{ item.PayRelNo1 }}
              <p>{{ item.CreateTime }}</p>
            </div>
          </div>
          <div v-if="scope.row.Refunds.length > 0" style="border-top: solid 1px #cecece;">
            <div v-for="(item, index) in scope.row.Refunds" :key="index">
              <p>微信退款单号：{{ item.RefundRelNo1 }}</p>
              <p>{{ item.CreateTime }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="OrderStatusDesc" label="状态" align="center" width="70"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="
              scope.row.OrderStatus == 0 &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsApproveDeliverOrder && scope.row.ExpressFeeStatus != 1
            " class="button-op-edit" size="small" @click="handleOrderByApprove(scope.row.OrderId)">审核
            </el-button>
            <el-button v-if="
              scope.row.OrderStatus == 0 &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsEditDeliverOrder
            " class="button-op-edit" size="small" @click="handleOrderById(scope.row.OrderId)">修改收件
            </el-button>
            <el-button v-if="
              scope.row.OrderStatus == 9 &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsExpressDeliverOrder
            " class="button-op-edit" size="small" @click="handleSend(scope.row.OrderId)">整单发货
            </el-button>
            <el-button v-if="
              (scope.row.OrderStatus == 9 || scope.row.OrderStatus == 11) &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsExpressDeliverOrder &&
              !scope.row.IsSend
            " class="button-op-edit" size="small" @click="handleSend1(scope.row.OrderId)">组合发货
            </el-button>
            <el-button v-if="
              scope.row.OrderStatus == 0 &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsRight
            " class="button-op-del" size="small" @click="handleCannel(scope.row.OrderId)">取消
            </el-button>
            <el-button class="button-op-edit" size="small" @click="handleHistoryBtn(scope.row.OrderId)">日志
            </el-button>
            <el-button v-if="
              (scope.row.OrderStatus == '10' ||
                scope.row.OrderStatus == '21' ||
                scope.row.OrderStatus == '20') &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsExpressDeliverOrder
            " class="button-op-edit" size="small" @click="handleSend(scope.row.OrderId)">补发货
            </el-button>
            <el-button v-if="
              (scope.row.OrderStatus == '10' ||
                scope.row.OrderStatus == '21') &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsExpressDeliverOrder
            " class="button-op-edit" size="small" @click="handleSend2(scope.row.OrderId)">手工确认收货
            </el-button>
            <el-button v-if="
              (scope.row.OrderStatus == '9' ||
                scope.row.OrderStatus == '11' ||
                scope.row.OrderStatus == '10' ||
                scope.row.OrderStatus == '21' ||
                scope.row.OrderStatus == '20') &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsForceCancelDeliverOrder
            " class="button-op-del" size="small" @click="handleForceCannel(scope.row.OrderId)">强制取消
            </el-button>
            <el-button v-if="
              scope.row.OrderStatus == 9 &&
              loginUser.UnitId == scope.row.DeliverUnitId &&
              IsApproveDeliverOrder
            " class="button-op-edit" size="small" @click="handleReturn(scope.row.OrderId)">退回
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
    <!-- 导入发货 -->
    <el-dialog title="导入发货" v-model="inDataVisible" width="45%">
      <div style="width:100%;height: 18px;"></div>
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
                  <img src="../../assets/imgs/order_out1.png" style="width: 100px; height: 100px" />
                </el-col>
                <el-col :span="19" :offset="1">
                  <div class="out-bg1 flex-col justify-center">
                    <div>填写导入数据信息</div>
                    <div>
                      请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，多运单号'，'分开
                    </div>
                    <div>
                      <el-link :underline="false"
                        href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/发货模板.xlsx"
                        style="color: #f56c6c">
                        下载模板</el-link>
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
                  <img src="../../assets/imgs/order_out2.png" style="width: 100px; height: 100px" />
                </el-col>
                <el-col :span="19" :offset="1">
                  <div class="out-bg1 flex-col justify-center">
                    <div>上传填好的信息表</div>
                    <div>
                      文件后缀名必须为xls 或xlsx
                      （即Excel格式）和以制表符分隔的文本文件，文件大小不得大于10M，最多支持导入3000条数据
                    </div>
                    <div class="file-detail">
                      <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed"
                        :on-remove="handleRemove" class="file-order-uploader" action="#" :http-request="SuccessFile"
                        :auto-upload="true" :before-upload="beforeAvatarUpload">
                        <el-link :underline="false" style="color: #f56c6c">
                          上传文件</el-link>
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
                <div class="" style="background-color: #f8f8f8; overflow-y: scroll">
                  <p>错误信息:</p>
                  <p v-html="htmlValue"></p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="activeIndex == 1">
        <el-table :data="tableModalData" border class="table" ref="multipleTable"
          :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
          <el-table-column prop="OrderCode" align="center" label="配送单号" width="200">
          </el-table-column>
          <el-table-column prop="OrderCode" align="left" label="收件信息">
            <template #default="scope">
              <p>
                {{ scope.row.ContactName }}&nbsp;{{ scope.row.ContactCell }}
              </p>
              <p>{{ scope.row.ContactAddress }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="ExpressTypeName" label="快递公司" align="center" width="100"></el-table-column>
          <el-table-column prop="ExpressCode" label="运单号" align="center" width="160"></el-table-column>
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
            <el-button v-if="isDataError" class="button1" @click="isDataError = false">重新上传</el-button>
            <el-button class="button1" @click="onNextOneBtn">下一步</el-button>
          </div>
          <div v-if="activeIndex == 1">
            <el-button class="button1" @click="onNextTwoBtn">发货</el-button>
          </div>
          <!-- <el-button class="button2" @click="editVisible = false">关 闭</el-button>
          <el-button class="button1" @click="onSaveModal">保 存</el-button> -->
        </span>
      </template>
    </el-dialog>
    <!-- 修改收件信息弹出框 -->
    <el-dialog title="修改收件信息" v-model="receivingVisible" width="40%">
      <el-row>
        <el-col :span="22">
          <el-form ref="formRef" :model="form_modal" :rules="rules_modal" label-width="120px">
            <el-form-item label="收件人">
              <el-input v-model="form_modal.ContactName"></el-input>
            </el-form-item>
            <el-form-item label="收件手机">
              <el-input v-model="form_modal.ContactCell"></el-input>
            </el-form-item>
            <el-form-item label="收件城市">
              <el-row>
                <el-col :span="7">
                  <el-select v-model="form_modal.ContactProvinceAreaId" filterable style="width: 100%" placeholder="请选择"
                    @change="changeProvinces($event, 'Contact')">
                    <el-option v-for="item in ContactProvinces" :key="item.AreaName" :label="item.AreaName"
                      :value="item.AreaId" />
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-select v-model="form_modal.ContactCityAreaId" filterable style="width: 100%" placeholder="请选择"
                    @change="changeCitys($event, 'Contact')">
                    <el-option v-for="item in ContactCitys" :key="item.AreaName" :label="item.AreaName"
                      :value="item.AreaId" />
                  </el-select>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-select v-model="form_modal.ContactDistrictAreaId" filterable style="width: 100%" placeholder="请选择"
                    @change="changeDistricts($event, 'Contact')">
                    <el-option v-for="item in ContactDistricts" :key="item.AreaName" :label="item.AreaName"
                      :value="item.AreaId" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="收件详细地址">
              <el-input v-model="form_modal.ContactAddress"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form_modal.OrderRemark" type="textarea">
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="ModalLoadingBtn" @click="onSaveModal">保 存</el-button>
          <el-button class="button2" @click="receivingVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 发货弹出框 -->
    <el-dialog title="发货" v-model="deliverGoodsVisible" width="38%">
      <el-row>
        <el-col :span="24">
          <el-form ref="formSendRef" :model="form_send_modal" :rules="rules_send_modal" label-width="100px">
            <el-row>
              <el-col :span="20">
                <el-form-item label="备注">
                  <el-input style="width: 100%" type="textarea" maxlength="100" :rows="4" show-word-limit
                    placeholder="请输入备注" v-model="textareaSend">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="物流信息">
              <div v-for="(item, index) in form_send_modal.Expresses" :key="index">
                <el-row style="padding-bottom: 8px">
                  <el-col :span="11">
                    <el-select v-model="item.ExpressType" filterable clearable style="width: 100%" placeholder="请选择快递公司"
                      @change="changeProvinces($event, 'Sender')">
                      <el-option v-for="itemChild in expressList" :key="itemChild.Name" :label="itemChild.Name"
                        :value="itemChild.Code" />
                    </el-select>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-input v-model="item.ExpressCode" placeholder="输入快递单号"></el-input>
                  </el-col>
                  <el-col :span="1">
                    <el-icon v-if="index > 0" :size="18" style="position: relative; top: 5px; left: 2px"
                      @click="delExpressesBtn(index)">
                      <CloseBold />
                    </el-icon>
                    <el-icon v-else :size="18" style="position: relative; top: 5px; left: 2px"
                      @click="delExpressesBtn(index)">
                    </el-icon>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <div style="width: 68%; margin: 0 auto" v-if="isOrderExpress">
              <el-row>
                <el-col :span="24">
                  <el-button style="width: 100%" class="button2" @click="addExpressesBtn">添 加</el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="ModalSendLoadingBtn" @click="onSaveSendModal">保 存</el-button>
          <el-button class="button2" @click="deliverGoodsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 显示兑换商品信息 -->
    <el-dialog v-model="exchangeGoodsVisible" width="55%">
      <template #header="{ }">
        <div class="my-header">
          <p>
            {{ exchangeGoodsTitle
            }}<text style="color: #f56c6c">({{ exchangeGoodsTitleDesc }})</text>
          </p>
        </div>
      </template>
      <el-table ref="multipleTableRef" border :data="exchangeGoodsList.ExchangeGoodses" style="width: 100%">
        <el-table-column label="" align="center" width="60">
          <template #default="scope">
            <el-checkbox v-model="scope.row.IsSelected" :disabled="scope.row.GoodsStatus == 0 ? true : false"
              @change="handleCheckChange($event, scope.$index)" label="" size="large" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" width="120">
          <template #default="scope">
            <img :src="scope.row.GoodsListImg" style="width: 70%" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template #default="scope">
            <el-popover v-if="
              scope.row.PackageDetails && scope.row.PackageDetails.length > 0
            " :width="250"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
              <template #default>
                <div v-for="(item, index) in scope.row.PackageDetails" :key="index">
                  <p>
                    {{
                      item.Goods.GoodsCode + " - " + item.Goods.GoodsTitle
                    }}*{{ item.GoodsQty }}
                  </p>
                </div>
              </template>
              <template #reference>
                <el-link style="color: #f56c6c; font-size: 12px" :underline="false">{{
                  scope.row.GoodsCode + " - " + scope.row.GoodsTitle
                }}</el-link>
              </template>
            </el-popover>
            <p v-else>
              {{ scope.row.GoodsCode + " - " + scope.row.GoodsTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="GoodsCode" align="center" label="编码" width="100">
        </el-table-column>
        <el-table-column align="center" label="价格(元)" width="80">
          <template #default="scope">
            <p>{{ (scope.row.GoodsOrgPrice / 100).toFixed(2) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="GoodsBarcode" align="center" label="条码" width="150">
        </el-table-column>
        <!-- <el-table-column prop="GoodsSubTitle" align="center" label="规格" width="100">
        </el-table-column> -->
        <el-table-column prop="Qty" align="center" label="兑换数量" width="100">
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="exchangeGoodsLoadingBtn" @click="saveExchangeGoodsBtn">保 存</el-button>
          <el-button class="button2" @click="exchangeGoodsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 显示订单操作记录 -->

    <!-- 使用操作记录对话框组件 -->
    <OperationHistoryDialog v-model="hisesVisible" title="操作记录" :historyData="tableHistoryData"
      :loading="tableHistoryLoading" @close="handleHistoryClose" />
    <!-- 批量操作审核 -->
    <el-dialog title="审核" v-model="approveVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入审核内容"
        v-model="textareaApprove">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="passLoading" @click="passModalBtn">确 认</el-button>
          <el-button class="button2" @click="approveVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
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
    <!-- 操作 -->
    <el-dialog title="取消" v-model="cancelVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入取消原因"
        v-model="textareaCancel">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="cancelLoading" @click="cancelModalBtn">确 认</el-button>
          <el-button class="button2" @click="cancelVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 操作 -->
    <el-dialog title="手工确认收货" v-model="send2Visible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注" v-model="textareasend2">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="send2Loading" @click="send2ModalBtn">确 认</el-button>
          <el-button class="button2" @click="send2Visible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 退回操作 -->
    <el-dialog title="退回" v-model="ReturnVisible" width="38%" :show-close="false">
      <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
        v-model="textareaReturnInput">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="ReturnLoading" @click="ReturnModalBtn">确 认</el-button>
          <el-button class="button2" @click="ReturnVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增配送单弹出框 -->
    <el-dialog title="新增配送单" class="delivery-modal" v-model="DeliveryVisible" width="68%" :show-close="false"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="width:100%;height: 18px;"></div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleChangeClick">
        <el-tab-pane label="券查询" name="first">
          <el-row>
            <el-col :span="24">
              <el-form ref="DeliveryRef" :model="FormDeliveryModal" :rules="RulesDeliveryModal" label-width="120px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="券码">
                      <el-input v-model="FormDeliveryModal.TicketCode">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="密码">
                      <el-input v-model="FormDeliveryModal.TicketPass">
                        <template #append>
                          <el-button :loading="btnLoading" class="button1"
                            @click="handleView1(FormDeliveryModal.TicketPass)">查询
                          </el-button>
                        </template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div v-if="FormDeliveryModal.TicketStatus == 2">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="券批次号">
                        <el-input v-model="FormDeliveryModal.TicketTemplateCode" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="券名称">
                        <el-input v-model="FormDeliveryModal.TicketTemplateTitle" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="领取人">
                        <el-input disabled v-model="FormDeliveryModal.TakeVipNameDesc"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="状态">
                        <el-input v-model="FormDeliveryModal.TicketStatusDesc" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="FormDeliveryModal.ExchangeGoodsIdsAll.length > 0">
                    <el-col :span="22">
                      <el-form-item label="兑换商品">
                        <el-table ref="multipleTableRef" border :data="FormDeliveryModal.ExchangeGoodsIdsAll"
                          style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
                          header-cell-class-name="table-header">
                          <el-table-column label="" align="center" width="50">
                            <template #default="scope">
                              <el-checkbox v-model="scope.row.IsSelected" @change="
                                handleCheckChangeSku($event, scope.$index)
                                " label="" size="large" />
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="名称" width="250">
                            <template #default="scope">
                              <p>{{ scope.row.GoodsTitle }}</p>
                              <p v-if="scope.row.GoodsStatus == 0" style="color: #f56c6c">(库存不足)</p>
                            </template>
                          </el-table-column>
                          <el-table-column prop="GoodsBarcode" align="left" label="其他信息">
                            <template #default="scope">
                              <p>商品条码：{{ scope.row.GoodsBarcode }}</p>
                              <p>
                                价格：{{
                                  (scope.row.GoodsOrgPrice / 100).toFixed(2)
                                }}
                              </p>
                              <p>规格：{{ scope.row.GoodsSubTitle }}</p>
                              <p>数量：{{ scope.row.Qty }}</p>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="兑换的SKU">
                            <template #default="scope">
                              <div v-if="scope.row.SelectedSkus">
                                <p v-for="(SkusItem, SkusIndex) in scope.row
                                  .SelectedSkus" :key="SkusItem" :index="SkusIndex">
                                  {{ SkusItem.all_idsDesc }}
                                </p>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="操作" width="100">
                            <template #default="scope">
                              <div class="button-mgl">
                                <el-button v-if="
                                  scope.row.GoodsType == 2 &&
                                  scope.row.GoodsSkuCount > 0
                                " class="button-op-edit" size="small" @click="handleSkuEdit(scope.row)">选规格
                                </el-button>
                                <el-button v-if="
                                  scope.row.GoodsType == 3 &&
                                  scope.row.PackageDetailHasSku
                                " class="button-op-edit" size="small" @click="handleSkuEdit(scope.row)">选规格
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <p style="color: #f56c6c">
                          卡券类型：{{
                            FormDeliveryModal.TicketTemplateTypeDesc2
                          }}
                        </p>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="">
                        <el-button class="button1" :loading="takeTableDataLoading" @click="takeTableDataBtn">添
                          加</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="收件信息" name="second">
          <el-row>
            <el-col :span="22">
              <el-form ref="FormReceivingInformationRef" :model="FormReceivingInformation" label-width="120px">
                <el-form-item label="收件人">
                  <el-input style="width: 50%" maxlength="20" show-word-limit
                    v-model="FormReceivingInformation.ContactName"></el-input>
                </el-form-item>
                <el-form-item label="收件手机">
                  <el-input style="width: 50%" maxlength="13" show-word-limit
                    v-model="FormReceivingInformation.ContactCell"></el-input>
                </el-form-item>
                <el-form-item label="收件城市">
                  <el-row>
                    <el-col :span="7">
                      <el-select v-model="FormReceivingInformation.ContactProvinceAreaId" filterable style="width: 100%"
                        placeholder="请选择" @change="changeFormProvinces($event)">
                        <el-option v-for="item in ContactFormProvinces" :key="item.AreaName" :label="item.AreaName"
                          :value="item.AreaId" />
                      </el-select>
                    </el-col>
                    <el-col :span="7" :offset="1">
                      <el-select v-model="FormReceivingInformation.ContactCityAreaId" filterable style="width: 100%"
                        placeholder="请选择" @change="changeFormCitys($event)">
                        <el-option v-for="item in ContactFormCitys" :key="item.AreaName" :label="item.AreaName"
                          :value="item.AreaId" />
                      </el-select>
                    </el-col>
                    <el-col :span="8" :offset="1">
                      <el-select v-model="FormReceivingInformation.ContactDistrictAreaId" filterable style="width: 100%"
                        placeholder="请选择" @change="changeFormDistricts($event)">
                        <el-option v-for="item in ContactFormDistricts" :key="item.AreaName" :label="item.AreaName"
                          :value="item.AreaId" />
                      </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="收件详细地址">
                  <el-input maxlength="200" show-word-limit
                    v-model="FormReceivingInformation.ContactAddress"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input maxlength="200" :rows="4" type="textarea" show-word-limit
                    v-model="formTakeDeliveryGoodsModalRmark"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div style="height: 10px; width: 100%"></div>
        </el-tab-pane>
        <el-tab-pane label="已添加的券" name="third">
          <el-table :data="takeTable" height="350" border class="table" ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
            <el-table-column prop="" align="left" label="券信息">
              <template #default="scope">
                <p>{{ scope.row.TicketTemplateTypeDesc2 }}</p>
                <p>
                  {{
                    scope.row.TicketTemplateCode +
                    "-" +
                    scope.row.TicketTemplateTitle
                  }}
                </p>
                <p>No.{{ scope.row.TicketCode }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="" align="left" label="兑换的商品信息">
              <template #default="scope">
                <div v-for="item in scope.row.ExchangeGoodsIdsAll" :key="item.GoodsId">
                  <!-- <p v-if="item.IsSelected">{{ item.GoodsCode + '-' + item.GoodsTitle }}</p> -->
                  <div v-if="item.IsSelected">
                    <p v-for="(SkusItem, SkusIndex) in item.SelectedSkus" :key="SkusIndex">
                      {{ SkusItem.all_idsDesc }}
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="TicketStatusDesc" align="center" label="状态" width="100"></el-table-column>
            <el-table-column prop="" align="center" label="操作" width="100">
              <template #default="scope">
                <div class="button-mgl">
                  <el-button class="button-op-del" size="small" @click="handleDel(scope.$index)">删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 10px; width: 100%"></div>
        </el-tab-pane>
        <el-tab-pane label="汇总" name="four">
          <div style="width: 100%; height: 10rpx; background-color: #fff"></div>
          <div class="ticket_gather_detail">
            <div class="ticket_gather_detail2 flex-row justify-between">
              <div style="width: 65%">
                礼券总计<text style="color: #e12563">({{ gatherArr1.length }})</text>
              </div>
              <div style="" v-show="count1 != ''">X {{ count1 }}</div>
            </div>
            <div style="width: 100%; height: 6px; background-color: #fff"></div>
            <div v-for="(item, index) in gatherArr1" :key="item.TicketTemplateCode"
              class="ticket_gather_detail1 flex-row justify-between" style="height: 25px">
              <div style="width: 65%">
                {{ index + 1 }}. {{ item.TicketTemplateTitle }}
              </div>
              <div style="">X {{ item.titleQty }}</div>
            </div>
          </div>
          <div style="width: 100%; height: 10px; background-color: #fff"></div>
          <div class="ticket_gather_detail">
            <div class="ticket_gather_detail2 flex-row justify-between">
              <div style="width: 65%">
                待发货商品总计<text style="color: #e12563">({{ gatherArr.length }})</text>
              </div>
              <div style="" v-show="count != ''">X {{ count }}</div>
            </div>
            <div style="width: 100%; height: 6px; background-color: #fff"></div>
            <div v-for="(item, index) in gatherArr" :key="item.GoodsId"
              class="ticket_gather_detail1 flex-row justify-between" style="height: 25px">
              <div style="width: 65%">
                {{ index + 1 }}. {{ item.goodTitle }}
              </div>
              <div style="">X {{ item.goodQty }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" v-show="activeName == 'second' ||
            activeName == 'third' ||
            activeName == 'four'
            " :loading="DeliveryLoading" @click="DeliverySubMit">确认兑换</el-button>
          <el-button class="button2" @click="DeliveryVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 选择规格弹框 -->
    <el-dialog title="规格" class="padding_top1" v-model="skuVisible" width="40%" :show-close="false">
      <selsku ref="editor" @saveSku="saveSku" @closeSku="closeSku" :ExchangeArr="ExchangeArr"
        :openSkuModal="openSkuModal">
      </selsku>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { usePayApi } from "@/composables/order/usePayApi.js";
import {
  SearchDeliverOrders,
  GetDeliverOrderById,
  SaveDeliverOrder,
  AddDeliverOrderExpress,
  ModifyDeliverOrderTicketExchangeGoods,
  GetBillOperateHises,
  CancelDeliverOrder,
  ApproveDeliverOrders,
  GetDeliverOrderExpressDetail,
  CloseDeliverOrder,
  ForceCancelDeliverOrder,
  DeleteDeliverOrderExpress,
  RejectApproveDeliverOrders,
} from "@/api/order.js";
import {
  GetProvinceList,
  GetCityList,
  GetDistrictList,
  GetDictionaryDetailList,
} from "@/api/common.js";
import common from "@/utils/common.js";
import { StatSingle, HasRightes, SearchUnites } from "@/api/index.js";
import { GetGoods } from "@/api/goods.js";
import Cookie from "js-cookie";
import { GetFileData, Import } from "@/api/imgapi.js";
import {
  GetTicketByCode,
  BatchExchangeTicketesWithSkuByCell,
} from "@/api/ticket.js";
import selsku from "@/components/common/sel_sku.vue";
import DeliverOrderSearchForm from "@/components/deliver/deliver-order-search-form.vue";
import OperationHistoryDialog from "@/components/deliver/operation-history-dialog.vue";
import { useDeliverOrderExport } from "@/hooks/use-export.js";
const router = useRouter();
const query = reactive({
  UserID: "",
  title: "",
  name: "",
  search: {
    order_code: "",
    order_status: "0", //状态 待审核（0），需发货（9，11），待发货（9），部分已发货（11），已发货（10），部分已收货（21），已收货（20），取消（-1）进页面默认需发货)
    contact_cell: "", //联系电话
    contact_name: "", //联系人
    express_code: "", //物流单号
    goods_name: "", //商品名称
    ticket_code: "", //券码
    time: [],
    order_date_begin: "",
    order_date_end: "",
    deliver_unit_id: "", //券商ID
    openid: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
//表格数据
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const StatData = reactive({
  wait_approve_cnt: "", //待审核
  wait_deliver_cnt: "", //待发货
});

//修改收件信息
const receivingVisible = ref(false);
const form_modal = reactive({
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
  SenderProvinceAreaId: "", //寄件人的省ID
  SenderProvinceName: "", //寄件人的省
  SenderCityAreaId: "", //寄件人的市ID
  SenderCityName: "", //寄件人的市
  SenderDistrictAreaId: "", //寄件人的区ID
  SenderDistrictName: "", //寄件人的区
  SenderAddress: "", //寄件人的详细地址
  SenderName: "", //寄件人
  SenderCell: "", //寄件人联系电话
  OrderRemark: "",
});
const rules_modal = {};
const formRef = ref(null);

const editVisible = ref(false);
const ModalLoadingBtn = ref(false);

//省市区数据
const SenderProvinces = ref([]);
const SenderCitys = ref([]);
const SenderDistricts = ref([]);
const ContactProvinces = ref([]);
const ContactCitys = ref([]);
const ContactDistricts = ref([]);

//发货
const deliverGoodsVisible = ref(false);
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
const textareaSend = ref("");

const expressList = ref([]);

//导入文件
const inDataVisible = ref(false);
const activeIndex = ref(0);
const isDataError = ref(false);
const fileList = ref([]);
const fileparam = ref([]);
const tableModalData = ref([]);
const htmlValue = ref("");
const subTitle = ref("");
const IsRight = ref(false);
const IsEditDeliverOrder = ref(false);
const IsExpressDeliverOrder = ref(false);
const IsApproveDeliverOrder = ref(false);
const IsForceCancelDeliverOrder = ref(false);
const IsAdjustOutofstockExchangegoodsDeliverOrder = ref(false);

const statusList = ref([
  {
    value: "",
    key: "全部订单",
    active: false,
  },
  {
    value: "0",
    key: "待审核",
    active: true,
  },
  {
    value: "9,11",
    key: "待发货",
    active: false,
  },
  {
    value: "10,21,11",
    key: "已发货",
    active: false,
  },
  {
    value: "20",
    key: "已收货",
    active: false,
  },
  {
    value: "-1",
    key: "已取消",
    active: false,
  },
  {
    value: "30",
    key: "近三个月订单",
    active: false,
  },
]);
const statusListActive = ref("");

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
  if (query.search.order_status == 30) {
    query.search.order_status = "";
  }
  let res = await SearchDeliverOrders({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach((row) => {
        row.Details.forEach((row1) => {
          for (let index = 0; index < row1.ExchangeGoods.length; index++) {
            if (!row1.ExchangeGoods[index].ExpressCode) {
              row.IsSend = false;
              break;
            }
          }
        });
      });
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }
    pageTotal.value = res.DataMap.ToalCount;
  } else {
    pageTotal.value = 0;
    tableData.value = [];
    ElMessage.error(res.Message);
  }
  StatSingleData();
};
const isPushPayTicketOrderPayNotify = ref(false);
const BoolRight = async () => {
  let arr = [
    "cancel_deliver_order",
    "edit_deliver_order",
    "express_deliver_order",
    "approve_deliver_order",
    "adjust_outofstock_exchangegoods_deliver_order",
    "force_cancel_deliver_order",
    "push_payticket_order_pay_notify",
  ];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.cancel_deliver_order;
    IsEditDeliverOrder.value = res.DataMap.edit_deliver_order;
    IsExpressDeliverOrder.value = res.DataMap.express_deliver_order;
    IsApproveDeliverOrder.value = res.DataMap.approve_deliver_order;
    IsForceCancelDeliverOrder.value = res.DataMap.force_cancel_deliver_order;
    IsAdjustOutofstockExchangegoodsDeliverOrder.value =
      res.DataMap.adjust_outofstock_exchangegoods_deliver_order;
    isPushPayTicketOrderPayNotify.value = res.DataMap.push_payticket_order_pay_notify;
  }
};
//取消配送单权限控制
BoolRight();
const loginUser = JSON.parse(Cookie.get("User"));
const init = async () => {
  let res = await GetDictionaryDetailList({
    DictionaryCode: "express_type",
  });
  if (res.Code == 200) {
    expressList.value = res.DataMap;
  }
  handleSearch();
};
init();

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
const orderIDValue = ref("");
const cancelVisible = ref(false);
const cancelLoading = ref(false);
const textareaCancel = ref("");
const ForceOrder = ref(false);
const handleCannel = (ID) => {
  ForceOrder.value = false;
  textareaCancel.value = "";
  cancelVisible.value = true;
  orderIDValue.value = ID;
};
const handleForceCannel = (ID) => {
  ForceOrder.value = true;
  textareaCancel.value = "";
  cancelVisible.value = true;
  orderIDValue.value = ID;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//配送单退回
const ReturnVisible = ref(false);
const ReturnLoading = ref(false);
const textareaReturnInput = ref("");
const handleReturn = (ID) => {
  ReturnVisible.value = true;
  textareaReturnInput.value = "";
  orderIDValue.value = ID;
};

const ReturnModalBtn = async () => {
  if (textareaReturnInput.value == "") {
    ElMessage.warning("请先输入备注");
    return;
  }
  ReturnLoading.value = true;
  let res = await RejectApproveDeliverOrders({
    OrderIds: [orderIDValue.value],
    Remark: textareaReturnInput.value,
  });
  ReturnLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功");
    handleSearch();
    ReturnVisible.value = false;
  } else {
    ElMessage.warning(res.Message);
  }
};
const cancelModalBtn = async () => {
  if (textareaCancel.value == "") {
    ElMessage.warning("请先输入备注");
    return;
  }
  cancelLoading.value = true;
  if (ForceOrder.value) {
    let res = await ForceCancelDeliverOrder({
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
  } else {
    let res = await CancelDeliverOrder({
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
  }
};

//修改收件信息
const handleOrderById = async (ID) => {
  let res = await GetDeliverOrderById({
    OrderId: ID,
  });
  if (res.Code == 200) {
    clearForm();
    form_modal.OrderId = ID;
    form_modal.ContactProvinceAreaId = res.DataMap.ContactProvinceAreaId;
    form_modal.ContactProvinceName = res.DataMap.ContactProvinceName;
    setTimeout(() => {
      form_modal.SenderCityAreaId =
        res.DataMap.SenderCityAreaId != 0 ? res.DataMap.SenderCityAreaId : "";
      form_modal.SenderProvinceAreaId =
        res.DataMap.SenderProvinceAreaId != 0
          ? res.DataMap.SenderProvinceAreaId
          : "";
      form_modal.SenderDistrictAreaId =
        res.DataMap.SenderDistrictAreaId != 0
          ? res.DataMap.SenderDistrictAreaId
          : "";
    }, 2000);
    form_modal.ContactCityName = res.DataMap.ContactCityName;
    form_modal.ContactCell = res.DataMap.ContactCell;
    form_modal.ContactName = res.DataMap.ContactName;
    form_modal.ContactAddress = res.DataMap.ContactAddress;
    form_modal.ContactDistrictName = res.DataMap.ContactDistrictName;
    form_modal.SenderCityName = res.DataMap.SenderCityName;
    form_modal.SenderProvinceName = res.DataMap.SenderProvinceName;
    form_modal.SenderDistrictName = res.DataMap.SenderDistrictName;
    form_modal.SenderAddress = res.DataMap.SenderAddress;
    form_modal.SenderName = res.DataMap.SenderName;
    form_modal.SenderCell = res.DataMap.SenderCell;
    form_modal.OrderRemark = res.DataMap.OrderRemark;
    receivingVisible.value = true;
    GetCityLists(
      res.DataMap.ContactProvinceAreaId,
      res.DataMap.ContactProvinceName,
      "Contact",
      res.DataMap.ContactCityAreaId
    );
    GetDistrictLists(
      res.DataMap.ContactCityAreaId,
      res.DataMap.ContactCityName,
      "Contact",
      res.DataMap.ContactDistrictAreaId
    );
  }
};
//发货
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
  goodsIds.value = [];
  multipleSelection.value.forEach((row) => {
    if (row.arr.OrderDetailGoodsId) {
      goodsIds.value.push(row.arr.OrderDetailGoodsId);
    }
  });
  deliverGoodsVisible.value = true;
};

const GetProvinceLists = async () => {
  let res = await GetProvinceList({});
  if (res.Code == 200) {
    SenderProvinces.value = res.DataMap;
    ContactProvinces.value = res.DataMap;
  }
};
GetProvinceLists();
const GetCityLists = async (AreaId, AreaName, type, ContactCityAreaId) => {
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
  form_modal.ContactCityAreaId = ContactCityAreaId;
};
const GetDistrictLists = async (
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
  form_modal.ContactDistrictAreaId = ContactDistrictAreaId;
};
//选中省份
const changeProvinces = (key, type) => {
  if (type == "Contact") {
    ContactProvinces.value.forEach((row) => {
      if (key == row.AreaId) {
        ContactCitys.value = [];
        ContactDistricts.value = [];
        form_modal.ContactCityAreaId = "";
        form_modal.ContactDistrictAreaId = "";
        GetCityLists(row.AreaId, row.AreaName, type);
        form_modal.ContactProvinceName = row.AreaName;
      }
    });
  } else {
    SenderProvinces.value.forEach((row) => {
      if (key == row.AreaId) {
        GetCityLists(row.AreaId, row.AreaName, type);
      }
    });
  }
};
//选中城市
const changeCitys = (key, type) => {
  if (type == "Contact") {
    ContactCitys.value.forEach((row) => {
      if (key == row.AreaId) {
        GetDistrictLists(row.AreaId, row.AreaName, type);
        form_modal.ContactCityName = row.AreaName;
      }
    });
  } else {
    SenderCitys.value.forEach((row) => {
      if (key == row.AreaId) {
        GetDistrictLists(row.AreaId, row.AreaName, type);
      }
    });
  }
};
//选中区域
const changeDistricts = (key, type) => {
  if (type == "Contact") {
    ContactDistricts.value.forEach((row) => {
      if (key == row.AreaId) {
        form_modal.ContactDistrictName = row.AreaName;
      }
    });
  }
};

const handleIn = () => {
  fileList.value = [];
  activeIndex.value = 0;
  isDataError.value = false;
  inDataVisible.value = true;
};

const { handleExport } = useDeliverOrderExport();
const handleOut = () => {
  handleExport(query, tableLoading);
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
      if (!isOrderExpress.value) {
        OrderDetailGoodsIds = goodsIds.value;
        if (OrderDetailGoodsIds.length == 0) {
          ElMessage.error("请先选择组合商品");
          ModalSendLoadingBtn.value = false;
          return;
        }
      }
      let res = await AddDeliverOrderExpress({
        OrderDetailIds: [],
        OrderDetailGoodsIds: OrderDetailGoodsIds,
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
        goodsIds.value = [];
        multipleSelection.value = [];
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const addExpressesBtn = () => {
  form_send_modal.Expresses.push({
    ExpressType: "",
    ExpressCode: "",
  });
};
const delExpressesBtn = (Index) => {
  if (Index == 0) {
    return;
  }
  form_send_modal.Expresses.forEach((row, index) => {
    if (Index == index) {
      form_send_modal.Expresses.splice(index, 1);
    }
  });
};

//导入文件第一步
const onNextOneBtn = async () => {
  if (fileparam.value.file) {
    let fd = new FormData();
    fd.append("file", fileparam.value.file); //传文件
    fd.append("DataType", "DeliverOrderExpress"); //传文件
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
  fd.append("DataType", "DeliverOrderExpress"); //传文件
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

const clearForm = () => {
  form_modal.ContactProvinceAreaId = "";
  form_modal.OrderId = "";
  form_modal.ContactProvinceName = "";
  form_modal.ContactCityAreaId = "";
  form_modal.ContactCityName = "";
  form_modal.ContactDistrictAreaId = "";
  form_modal.ContactDistrictName = "";
  form_modal.ContactAddress = "";
  form_modal.ContactName = "";
  form_modal.ContactCell = "";
  form_modal.SenderProvinceAreaId = "";
  form_modal.SenderProvinceName = "";
  form_modal.SenderCityAreaId = "";
  form_modal.SenderCityName = "";
  form_modal.SenderDistrictAreaId = "";
  form_modal.SenderDistrictName = "";
  form_modal.SenderAddress = "";
  form_modal.SenderName = "";
  form_modal.SenderCell = "";
  form_modal.OrderRemark = "";
};
//保存当前数据
const onSaveModal = () => {
  // 表单校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      ModalLoadingBtn.value = true;
      let Order = form_modal;
      let res = await SaveDeliverOrder({
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
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
    } 个文件`
  );
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

const StatSingleData = async () => {
  //获取头部数据
  let res = await StatSingle({
    StatType: 6,
  });
  if (res.Code == 200) {
    StatData.wait_approve_cnt = res.DataMap.wait_approve_cnt;
    StatData.wait_deliver_cnt = res.DataMap.wait_deliver_cnt;
  }
};

const exchangeGoodsLoadingBtn = ref(false);
const exchangeGoodsVisible = ref(false);
const exchangeGoodsTitle = ref("");
const exchangeGoodsTitleDesc = ref("");
const VipTicketIdValue = ref("");
const OrderIdValue = ref("");
const multipleSelection = ref([]);
const expandChangeData = ref([]);
const isOrderExpress = ref(true); //是否为整券发货(不是的话需要传ids)
const goodsIds = ref([]);

const exchangeGoodsList = reactive({
  ExchangeGoodses: [],
  GoodsQty: "", //几选几（前）
  ExchangeGoodsQty: "", //几选几（后）
});

//删除某张待提货的券
const handleDel = (indexPost) => {
  takeTable.value.forEach((row, index) => {
    if (indexPost == index) {
      takeTable.value.splice(index, 1);
    }
  });
};
const tableDataRef = ref(null);
//保存修改的商品
const saveExchangeGoodsBtn = async () => {
  exchangeGoodsLoadingBtn.value = true;
  let GoodsIds = [];
  exchangeGoodsList.ExchangeGoodses.forEach((row) => {
    if (row.IsSelected) {
      GoodsIds.push(row.GoodsId);
    }
  });
  if (GoodsIds.length == 0) {
    exchangeGoodsLoadingBtn.value = false;
    ElMessage.error("请先选择商品");
    return;
  }
  let res = await ModifyDeliverOrderTicketExchangeGoods({
    VipTicketId: VipTicketIdValue.value,
    GoodsIds: GoodsIds,
    OrderId: OrderIdValue.value,
  });
  exchangeGoodsLoadingBtn.value = false;
  if (res.Code == 200) {
    ElMessage.success(res.Message);
    let indexValue = 0;
    tableData.value.forEach((row, index) => {
      if (OrderIdValue.value == row.OrderId) {
        indexValue = index;
        row.Details.forEach((row1) => {
          if (row1.TicketId == res.DataMap.TicketId) {
            row1.ExchangeGoods = res.DataMap.ExchangeGoods;
          }
        });
        setTimeout(() => {
          tableDataRef.value.toggleRowExpansion(
            tableData.value[indexValue],
            true
          );
        }, 800);
      }
    });
    exchangeGoodsVisible.value = false;
  } else {
    ElMessage.error(res.Message);
  }
};
const handleCheckChange = async (val, index) => {
  let IsSelectedIndex = 0;
  exchangeGoodsList.ExchangeGoodses[index].IsSelected = val;
  exchangeGoodsList.ExchangeGoodses.forEach((row) => {
    if (row.IsSelected) {
      IsSelectedIndex++;
    }
  });
  if (IsSelectedIndex > exchangeGoodsList.ExchangeGoodsQty) {
    exchangeGoodsList.ExchangeGoodses[index].IsSelected = false;
    ElMessage.error("超出可选择数量");
  }
};
//勾选需要组合发货的商品
const handleSelectionChange = (
  val,
  TicketId,
  arrPost,
  indexPost,
  orderIdPost
) => {
  let selectionData = multipleSelection.value;
  if (val.length > 0) {
    selectionData.forEach((row, index) => {
      if (row.ticketIdId == TicketId) {
        row.arr = [];
      }
    });
    val.forEach((row) => {
      selectionData.push({
        arr: row,
        ticketIdId: TicketId,
        goodsId: row.GoodsId,
        OrderId: orderIdPost,
      });
    });
  } else {
    let indexDel = 0;
    selectionData.forEach((row, index) => {
      if (row.ticketIdId == TicketId) {
        indexDel = index;
      }
    });
    selectionData.splice(indexDel, 1);
  }
  multipleSelection.value = selectionData;
};
const expandChange = (row, expandedRows) => {
  expandChangeData.value = expandedRows;
  const isExpend = expandedRows.some((r) =>
    r.OrderId ? r.OrderId : "" === row.OrderId
  ); // 判断当前行展开状态
  if (!isExpend) {
    multipleSelection.value.forEach((row1) => {
      if (row1.OrderId == row.OrderId) {
        row1.arr = [];
      }
    });
  }
};
//卡券单独发货
const handleGoodsSend = (arrPost, idPost) => {
  form_send_modal.OrderId = idPost;
  form_send_modal.Expresses = [
    {
      ExpressType: "",
      ExpressCode: "",
    },
  ];
  isOrderExpress.value = false;
  goodsIds.value = [];
  arrPost.forEach((row) => {
    goodsIds.value.push(row.OrderDetailGoodsId);
  });
  deliverGoodsVisible.value = true;
};
//判断是否已经发货，发货的话就禁用选项
const selected = (row, index) => {
  if (!row.ExpressTypeDesc) {
    // 根据你的条件来设置
    return true; //可选择
  } else {
    return false; //不可选择
  }
};

//合并列
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }, item) => {
  if (columnIndex === 0) {
    if (rowIndex % item === 0) {
      return {
        rowspan: item,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

// 操作记录相关状态
const tableHistoryLoading = ref(false);
const hisesVisible = ref(false);
const tableHistoryData = ref([]);
// 查看订单操作历史
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
// 操作记录对话框关闭处理
const handleHistoryClose = () => {
  tableHistoryData.value = [];
};

const flag = ref(true);
const Msg = ref("");
const orderDataArr = ref([]);
const orderIds = ref([]);
const approveVisible = ref(false);
const passLoading = ref(false);
const textareaApprove = ref("");

//批量发货
const handleApprove = () => {
  if (orderDataArr.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  textareaApprove.value = "";
  approveVisible.value = true;
};
//订单列表多选
const handleSelectionOrderChange = (val) => {
  orderDataArr.value = val;
  orderIds.value = [];
  val.forEach((row) => {
    orderIds.value.push(row.OrderId);
  });
};
//审核按钮
const handleOrderByApprove = (val) => {
  textareaApprove.value = "";
  orderIds.value = [];
  orderIds.value.push(val);
  approveVisible.value = true;
};

//确认审批
const passModalBtn = async () => {
  ApproveOrders(orderIds.value.length, orderIds.value);
};
const ApproveOrders = async (icount, List) => {
  if (flag.value && icount > 0) {
    let index = icount;
    let OrderIdsArr = [List[index - 1]];
    let res = await ApproveDeliverOrders({
      OrderIds: OrderIdsArr,
      Remark: textareaApprove.value,
    });
    if (res.Code == 200) {
      icount--;
      Msg.value = "操作成功";
      if (icount > 0) {
        ApproveOrders(icount, List);
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
    query.PageStartRow = 1;
    getData();
  }
};
const selectedApprove = (row, index) => {
  if (true) {
    // 根据你的条件来设置
    return true; //可选择
  } else {
    return false; //不可选择
  }
};

const choosetag = (valIndex) => {
  statusList.value.forEach((row) => {
    row.active = false;
  });
  statusList.value[valIndex].active = true;
  statusListActive.value = statusList.value[valIndex].value;
  query.search.order_status = statusList.value[valIndex].value;
  if (statusList.value[valIndex].value == 30) {
    //三个月
    const end = new Date();
    end.setHours(23, 59, 59);
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    start.setHours(0, 0, 0);
    query.search.time = [start, end];
  } else if (statusList.value[valIndex].value == "") {
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
  if (statusList.value[valIndex].value != "") {
    handleSearch();
  }
};

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
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: {
      ID: GoodsId,
      Type: "View",
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
      let res = await DeleteDeliverOrderExpress({
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
    .catch(() => { });
};
////////////////////////////////////////////////////////////////////////////////////////////////
const logisticsVisible = ref(false);
const viewLogisticsAll = () => {
  logisticsVisible.value = true;
};

const textareasend2 = ref("");
const send2Visible = ref(false);
const send2Loading = ref(false);
const handleSend2 = async (ID) => {
  form_send_modal.OrderId = ID;
  send2Visible.value = true;
};
//手工发货
const send2ModalBtn = async () => {
  if (textareasend2.value == "") {
    ElMessage.error("请输入备注");
    return;
  }
  send2Loading.value = true;
  let res = await CloseDeliverOrder({
    Remark: textareasend2.value,
    OrderId: form_send_modal.OrderId,
  });
  send2Loading.value = false;
  if (res.Code == 200) {
    send2Visible.value = false;
    ElMessage.success("操作成功");
    query.PageStartRow = 1;
    textareasend2.value = "";
    getData();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//批量创建配送单
const formTakeDeliveryGoodsModalRmark = ref(""); //备注
const FormDeliveryModal = reactive({
  TicketId: "",
  TicketTemplateId: "",
  TicketTemplateTitle: "",
  TicketCode: "", //券码
  TicketPass: "", //密码
  TakeVipNameDesc: "",
  TicketTemplateCode: "", //券批次号
  TicketStatusDesc: "", //状态
  ExchangeGoodsIdsAll: [], //券包含商品
  ExchangeGoodsIds: [], //选择商品
  Remark: "", //备注
  TicketStatus: "",
  ExchangeGoodsQty: "", //最多只能选几个商品
  GoodsQty: "", //总共有多少个商品
  PrebookDate: "", //预约提货日期
  PrebookDateDesc: "", //预约提货日期
  TicketTemplateTypeDesc: "", //
  TicketTemplateTypeDesc2: "", //
});
const DeliveryVisible = ref(false);
const DeliveryLoading = ref(false);
const activeName = ref("first");
const DeliveryRef = ref(null);
const gatherArr = ref([]); //商品汇总
const count = ref("");
const count1 = ref("");
const gatherArr1 = ref([]); //券汇总
const btnLoading = ref(false);
//批量新增
const handleAdd = () => {
  FormDeliveryModal.TicketCode = "";
  FormDeliveryModal.TicketPass = "";
  FormDeliveryModal.TicketStatus = "";
  //调用获取省份信息
  GetProvinceListApi();
  DeliveryVisible.value = true;
};
//根据券号密码查询券数据
const handleView1 = async (postVal) => {
  if (FormDeliveryModal.TicketCode == "") {
    ElMessage.error("券码不能为空");
    btnLoading.value = false;
    return;
  }
  if (postVal == "") {
    ElMessage.error("密码不能为空");
    btnLoading.value = false;
    return;
  }
  GetTicketByCodeApi(postVal);
};
//判断选择的商品是否大于当前所限制的商品数量含sku的并且需要加判断
const handleCheckChangeSku = async (val, index) => {
  let IsSelectedIndex = 0;
  FormDeliveryModal.ExchangeGoodsIdsAll[index].IsSelected = val;
  let ExchangeGoodInfo = FormDeliveryModal.ExchangeGoodsIdsAll[index];
  if (!val) {
    ExchangeGoodInfo.SelectedSkus = [];
    return;
  }
  FormDeliveryModal.ExchangeGoodsIdsAll.forEach((row) => {
    if (row.IsSelected) {
      IsSelectedIndex++;
    }
  });
  if (IsSelectedIndex > FormDeliveryModal.ExchangeGoodsQty) {
    FormDeliveryModal.ExchangeGoodsIdsAll[index].IsSelected = false;
    ElMessage.error("超出可选择数量");
    return;
  }
  if (FormDeliveryModal.ExchangeGoodsIdsAll[index].GoodsStatus == 0) {
    FormDeliveryModal.ExchangeGoodsIdsAll[index].IsSelected = false;
    ElMessage.error("当前商品缺货");
    return;
  }
  if (!ExchangeGoodInfo.SelectedSkus) {
    ExchangeGoodInfo.SelectedSkus = [];
  }
  if (ExchangeGoodInfo.GoodsType == 2 && ExchangeGoodInfo.GoodsSkuCount == 0) {
    ExchangeGoodInfo.SelectedSkus = [];
    ExchangeGoodInfo.SelectedSkus.push({
      all_idsDesc: ExchangeGoodInfo.GoodsTitle + " × " + ExchangeGoodInfo.Qty,
    });
  } else if (
    ExchangeGoodInfo.GoodsType == 3 &&
    !ExchangeGoodInfo.PackageDetailHasSku
  ) {
    ExchangeGoodInfo.SelectedSkus = [];
    ExchangeGoodInfo.SelectedSkus.push({
      all_idsDesc: ExchangeGoodInfo.GoodsTitle + " × " + ExchangeGoodInfo.Qty,
    });
  }
};
//选规格
const ExchangeArr = ref({});
const skuVisible = ref(false);
const openSkuModal = ref(false);
const handleSkuEdit = (arrPost) => {
  arrPost.SelectedSkus = arrPost.SelectedSkus ? arrPost.SelectedSkus : [];
  ExchangeArr.value = arrPost;
  skuVisible.value = true;
  openSkuModal.value = true;
};

//关闭弹框
const closeSku = (SelSkusPost) => {
  let GoodsId = SelSkusPost.GoodsId;
  let ExchangeGoodsIds = FormDeliveryModal.ExchangeGoodsIdsAll;
  //当goodsid相等那么把选中的属性明细，直接赋值
  ExchangeGoodsIds.forEach((row) => {
    if (row.GoodsId == GoodsId) {
      row.SelectedSkus = SelSkusPost.SelSkus;
    }
  });
  skuVisible.value = false;
  openSkuModal.value = false;
};
//保存选中的sku
const saveSku = (SelSkusPost) => {
  let GoodsId = SelSkusPost.GoodsId;
  let ExchangeGoodsIds = FormDeliveryModal.ExchangeGoodsIdsAll;
  //当goodsid相等那么把选中的属性明细，直接赋值
  ExchangeGoodsIds.forEach((row) => {
    if (row.GoodsId == GoodsId) {
      row.SelectedSkus = SelSkusPost.SelSkus;
    }
  });
  skuVisible.value = false;
  openSkuModal.value = false;
};

const takeTableDataLoading = ref(false);
const takeTable = ref([]);
//添加到待确认提货单列表
const takeTableDataBtn = () => {
  takeTableDataLoading.value = true;
  let isChange = 0;
  FormDeliveryModal.ExchangeGoodsIdsAll.forEach((row) => {
    if (row.IsSelected) {
      isChange++;
    }
  });
  //当前是多选的时候
  if (FormDeliveryModal.GoodsQty > 1) {
    if (isChange == 0) {
      ElMessage.error("请先选择商品");
      takeTableDataLoading.value = false;
      return;
    }
    if (isChange < FormDeliveryModal.ExchangeGoodsQty) {
      ElMessage.error("勾选的兑换商品数量不匹配");
      takeTableDataLoading.value = false;
      return;
    }
  } else if (FormDeliveryModal.GoodsQty == 1) {
    FormDeliveryModal.ExchangeGoodsIdsAll.forEach((row) => {
      row.IsSelected = true;
    });
    if (FormDeliveryModal.ExchangeGoodsIdsAll.length > 0) {
      let ExchangeGoodInfo = FormDeliveryModal.ExchangeGoodsIdsAll[0];
      if (
        ExchangeGoodInfo.GoodsType == 2 &&
        ExchangeGoodInfo.GoodsSkuCount == 0
      ) {
        ExchangeGoodInfo.SelectedSkus = [];
        ExchangeGoodInfo.SelectedSkus.push({
          all_idsDesc:
            ExchangeGoodInfo.GoodsTitle + " × " + ExchangeGoodInfo.Qty,
        });
      } else if (
        ExchangeGoodInfo.GoodsType == 3 &&
        !ExchangeGoodInfo.PackageDetailHasSku
      ) {
        ExchangeGoodInfo.SelectedSkus = [];
        ExchangeGoodInfo.SelectedSkus.push({
          all_idsDesc:
            ExchangeGoodInfo.GoodsTitle + " × " + ExchangeGoodInfo.Qty,
        });
      }
    }
  }

  let objectInfo = JSON.parse(JSON.stringify(FormDeliveryModal));
  let isChongfu = 0;
  if (takeTable.value.length > 0) {
    takeTable.value.forEach((row) => {
      //判断是否重复添加
      if (row.TicketId == FormDeliveryModal.TicketId) {
        isChongfu++;
      }
    });
  }
  if (isChongfu > 0) {
    ElMessage.error("请勿重复添加");
    takeTableDataLoading.value = false;
    return;
  }

  for (
    let EGIndex = 0;
    EGIndex < FormDeliveryModal.ExchangeGoodsIdsAll.length;
    EGIndex++
  ) {
    const ExchangeGoods = FormDeliveryModal.ExchangeGoodsIdsAll[EGIndex];
    if (ExchangeGoods.IsSelected) {
      //普通商品 并且需要选择sku
      if (ExchangeGoods.GoodsType == 2 && ExchangeGoods.GoodsSkuCount > 0) {
        if (
          ExchangeGoods.GoodsSkus.length > 0 &&
          (!ExchangeGoods.SelectedSkus ||
            ExchangeGoods.SelectedSkus.length == 0)
        ) {
          ElMessage.error("请先添加" + ExchangeGoods.GoodsTitle + "的规格");
          takeTableDataLoading.value = false;
          return;
        }
      } else if (
        ExchangeGoods.GoodsType == 3 &&
        ExchangeGoods.PackageDetailHasSku
      ) {
        //普通商品 并且需要选择sku
        //先找到Package里面是否需要选择sku
        if (
          !ExchangeGoods.SelectedSkus ||
          ExchangeGoods.SelectedSkus.length == 0
        ) {
          ElMessage.error("请先添加" + ExchangeGoods.GoodsTitle + "的规格");
          takeTableDataLoading.value = false;
          return;
        }
      }
    }
  }

  takeTable.value.push(objectInfo);
  takeTableDataLoading.value = false;
  activeName.value = "second";
  FormDeliveryModal.TicketTemplateTitle = "";
  FormDeliveryModal.TicketId = "";
  FormDeliveryModal.TicketTemplateId = "";
  FormDeliveryModal.TicketCode = "";
  FormDeliveryModal.TicketPass = "";
  FormDeliveryModal.TicketTemplateCode = "";
  FormDeliveryModal.TicketStatusDesc = "";
  FormDeliveryModal.ExchangeGoodsIdsAll = [];
  FormDeliveryModal.Remark = "";
  FormDeliveryModal.TicketStatus = "";
  FormDeliveryModal.TakeVipNameDesc = "";
  FormDeliveryModal.PrebookDate = "";
  FormDeliveryModal.PrebookDateDesc = "";
  FormDeliveryModal.TicketTemplateTypeDesc = "";
  FormDeliveryModal.TicketTemplateTypeDesc2 = "";
};

const GetTicketByCodeApi = async (Value) => {
  btnLoading.value = true;
  let res = await GetTicketByCode({
    TicketCode: FormDeliveryModal.TicketCode,
    TicketPwd: Value,
    ReturnPass: true,
    ReturnSku: true,
    CheckCanExchange: true,
    NotReturnHis: true,
  });
  btnLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.TicketStatus == 2) {
      if (Value.indexOf("@") > 1) {
        FormDeliveryModal.TicketPass = Value.split("@")[0];
        FormDeliveryModal.TicketCode = Value.split("@")[1];
      }
      FormDeliveryModal.TicketStatus = res.DataMap.TicketStatus;
      FormDeliveryModal.TicketId = res.DataMap.TicketId;
      FormDeliveryModal.TicketTemplateId =
        res.DataMap.TicketTemplate.TicketTemplateId;
      FormDeliveryModal.ExchangeGoodsQty =
        res.DataMap.TicketTemplate.ExchangeGoodsQty;
      FormDeliveryModal.TicketTemplateTitle =
        res.DataMap.TicketTemplate.TicketTemplateTitle;
      FormDeliveryModal.TicketStatusDesc = res.DataMap.TicketStatusDesc;
      FormDeliveryModal.GoodsQty = res.DataMap.TicketTemplate.GoodsQty;
      FormDeliveryModal.TicketTemplateCode =
        res.DataMap.TicketTemplate.TicketTemplateCode;
      FormDeliveryModal.ExchangeGoodsIdsAll = res.DataMap.TicketTemplate
        .ExchangeGoodses
        ? res.DataMap.TicketTemplate.ExchangeGoodses
        : [];
      FormDeliveryModal.TicketTemplateTypeDesc =
        res.DataMap.TicketTemplate.TicketTemplateTypeDesc;
      FormDeliveryModal.TicketTemplateTypeDesc2 =
        res.DataMap.TicketTemplate.TicketTemplateTypeDesc2;
      if (res.DataMap.TakeVipName) {
        FormDeliveryModal.TakeVipNameDesc =
          res.DataMap.TakeVipName + "-" + res.DataMap.TakeVipCell;
      }
      if (res.DataMap.TicketTemplate.TicketTemplateConfig) {
        let TicketTemplateConfig = JSON.parse(
          res.DataMap.TicketTemplate.TicketTemplateConfig
        );
        if (TicketTemplateConfig.NeedPreBookWhenPickup == 1) {
          FormDeliveryModal.PrebookDateDesc =
            TicketTemplateConfig.ForwardDaysWhenPreBook;
        }
      }
      FormDeliveryModal.Remark = "";
    } else {
      let Message = "";
      switch (res.DataMap.TicketStatus) {
        case -1:
          Message = "已作废";
          break;
        case 0:
          Message = "未激活";
          break;
        case 1:
          Message = "已激活";
          break;
        case 2:
          Message = "待兑换";
          break;
        case 3:
          Message = "转赠中";
          break;
        case 10:
          Message = "已兑换";
          break;
        default:
          break;
      }
      ElMessage.error(`当前券状态为${Message},无法创建提货单`);
    }
  } else {
    ElMessage.error(res.Message);
    return;
  }
};

const RulesDeliveryModal = {};
const handleChangeClick = (event) => {
  if (event.props.name == "four") {
    let arrGood = [];
    let arrTicket1 = [];
    takeTable.value.forEach((row) => {
      for (let i = 0; i < row.ExchangeGoodsIdsAll.length; i++) {
        let GoodsesRow = row.ExchangeGoodsIdsAll[i];
        if (!GoodsesRow.SelectedSkus) {
          continue;
        }
        for (let j = 0; j < GoodsesRow.SelectedSkus.length; j++) {
          let SelectedSkus = GoodsesRow.SelectedSkus[j];
          if (SelectedSkus.sku_id) {
            AddGoods(arrGood, SelectedSkus.all_idsDesc, 1, SelectedSkus.sku_id);
          }
        }
      }
      if (row.GoodsQty > 1) {
        //多选商品
        row.ExchangeGoodsIdsAll.forEach((ExchangeRow1) => {
          if (ExchangeRow1.IsSelected) {
            if (
              ExchangeRow1.GoodsType == 2 &&
              (!ExchangeRow1.GoodsSkus || ExchangeRow1.GoodsSkus.length == 0)
            ) {
              AddGoods(
                arrGood,
                ExchangeRow1.GoodsCode + " " + ExchangeRow1.GoodsTitle,
                ExchangeRow1.Qty,
                ExchangeRow1.GoodsId
              );
            } else {
              if (ExchangeRow1.GoodsType == 3) {
                ExchangeRow1.PackageDetails.forEach((row2) => {
                  //组合商品里面也有不需要选择sku的数据
                  if (!row2.Goods.Skus || row2.Goods.Skus.length == 0) {
                    AddGoods(
                      arrGood,
                      row2.Goods.GoodsCode + " " + row2.Goods.GoodsTitle,
                      row2.GoodsQty * ExchangeRow1.Qty,
                      row2.GoodsId
                    );
                  }
                });
              }
            }
          }
        });
      } else {
        //单选券
        if (row.ExchangeGoodsIdsAll && row.ExchangeGoodsIdsAll.length > 0) {
          //单品券下有商品
          row.ExchangeGoodsIdsAll.forEach((ExchangeRow2) => {
            if (
              ExchangeRow2.GoodsType == 2 &&
              (!ExchangeRow2.GoodsSkus || ExchangeRow2.GoodsSkus.length == 0)
            ) {
              AddGoods(
                arrGood,
                ExchangeRow2.GoodsCode + " " + ExchangeRow2.GoodsTitle,
                ExchangeRow2.Qty,
                ExchangeRow2.GoodsId
              );
            } else {
              if (ExchangeRow2.GoodsType == 3) {
                ExchangeRow2.PackageDetails.forEach((PackageRow2) => {
                  //组合商品里面也有不需要选择sku的数据
                  if (
                    !PackageRow2.Goods.Skus ||
                    PackageRow2.Goods.Skus.length == 0
                  ) {
                    AddGoods(
                      arrGood,
                      PackageRow2.Goods.GoodsCode +
                      " " +
                      PackageRow2.Goods.GoodsTitle,
                      PackageRow2.GoodsQty * ExchangeRow2.Qty,
                      PackageRow2.GoodsId
                    );
                  }
                });
              }
            }
          });
        } else {
          //单品券下无商品
          //当前券下，没有添加兑换商品
          AddGoods(
            arrGood,
            "(券) " + row.TicketTemplateCode + " " + row.TicketTemplateTitle,
            1,
            row.TicketTemplateId
          );
        }
      }
      //礼券数据
      let strInfo1 = null;
      for (let index = 0; index < arrTicket1.length; index++) {
        if (arrTicket1[index].TicketTemplateId == row.TicketTemplateId) {
          strInfo1 = arrTicket1[index];
          break;
        }
      }
      if (strInfo1 == null) {
        arrTicket1.push({
          TicketTemplateTitle:
            row.TicketTemplateCode + " " + row.TicketTemplateTitle,
          titleQty: 1,
          TicketTemplateId: row.TicketTemplateId,
        });
      } else {
        strInfo1.titleQty = strInfo1.titleQty + 1;
      }
    });

    count.value = "";
    arrGood.forEach((row) => {
      count.value = parseInt(count.value + row.goodQty);
    });
    count1.value = "";
    arrTicket1.forEach((row) => {
      count1.value = parseInt(count1.value + row.titleQty);
    });
    gatherArr.value = arrGood;
    gatherArr1.value = arrTicket1;
  }
};

const AddGoods = (arrPost, goodTitlePost, goodQtyPost, goodIdPost) => {
  let strInfo = null;
  for (let index = 0; index < arrPost.length; index++) {
    if (arrPost[index].goodId == goodIdPost) {
      strInfo = arrPost[index];
      break;
    }
  }
  if (strInfo == null) {
    arrPost.push({
      goodTitle: goodTitlePost,
      goodQty: goodQtyPost,
      goodId: goodIdPost,
      takeIn: false,
    });
  } else {
    strInfo.goodQty = strInfo.goodQty + goodQtyPost;
  }
};
//确认添加
const DeliverySubMit = () => {
  DeliveryRef.value.validate(async (valid) => {
    if (valid) {
      if (takeTable.value.length == 0) {
        ElMessage.info("请先添加兑换券");
        return;
      }
      let Ticketes = [];
      for (let index = 0; index < takeTable.value.length; index++) {
        const rowTicket = takeTable.value[index];
        let isGoods = 0;
        if (
          !rowTicket.ExchangeGoodsIdsAll ||
          rowTicket.ExchangeGoodsIdsAll.length == 0
        ) {
          Ticketes.push({
            Code: rowTicket.TicketCode,
            Pwd: rowTicket.TicketPass,
            ExchangeGoodsIdsAll: [],
          });
          //券没有添加兑换商品 直接跳过
          continue;
        }
        for (let i = 0; i < rowTicket.ExchangeGoodsIdsAll.length; i++) {
          let ExchangeGood = rowTicket.ExchangeGoodsIdsAll[i];
          if (rowTicket.GoodsQty <= 1 || ExchangeGood.IsSelected) {
            let boolValue = CheckSelectSku(rowTicket, ExchangeGood);
            if (!boolValue) {
              //当前选择的sku选择不匹配
              return;
            }
          }
          if (rowTicket.GoodsQty > 1) {
            //多选券
            if (ExchangeGood.IsSelected) {
              isGoods++;
            }
          }
        }
        //多选券 几选几判断
        if (rowTicket.GoodsQty > 1 && isGoods != rowTicket.ExchangeGoodsQty) {
          if (isGoods != rowTicket.ExchangeGoodsQty) {
            ElMessage.info(
              "请选择" +
              rowTicket.TicketTemplateTitle +
              "(" +
              rowTicket.TicketCode +
              ")的兑换商品"
            );
            return;
          }
          return;
        }
        let ExchangeGoodsIdsAll = [];
        //把数据整理成需要的结构
        ExchangeGoodsIdsAll = GetPostExchangeGoodses(
          rowTicket.ExchangeGoodsIdsAll
        );
        Ticketes.push({
          Code: rowTicket.TicketCode,
          Pwd: rowTicket.TicketPass,
          ExchangeGoodses: ExchangeGoodsIdsAll,
        });
      }
      if (
        FormReceivingInformation.ContactCell == "" ||
        FormReceivingInformation.ContactName == "" ||
        FormReceivingInformation.ContactAddress == ""
      ) {
        ElMessage.info("请输入联系人、联系电话、收件地址");
        return;
      }
      if (
        FormReceivingInformation.ContactProvinceAreaId == "" ||
        FormReceivingInformation.ContactCityAreaId == "" ||
        FormReceivingInformation.ContactDistrictAreaId == ""
      ) {
        ElMessage.info("请选择省市区");
        return;
      }
      DeliveryLoading.value = true;
      let res = await BatchExchangeTicketesWithSkuByCell({
        Ticketes: Ticketes,
        Remark: formTakeDeliveryGoodsModalRmark.value,
        ContactProvinceAdeaId: FormReceivingInformation.ContactProvinceAreaId,
        ContactCityAdeaId: FormReceivingInformation.ContactCityAreaId,
        ContactDistrictAdeaId: FormReceivingInformation.ContactDistrictAreaId,
        ContactAddress: FormReceivingInformation.ContactAddress,
        ContactName: FormReceivingInformation.ContactName,
        ContactCell: FormReceivingInformation.ContactCell,
      });
      DeliveryLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功！");
        DeliveryVisible.value = false;
        takeTable.value = [];
        gatherArr.value = [];
        gatherArr1.value = [];
        count.value = "";
        count1.value = "";
        activeName.value = "first";
        formTakeDeliveryGoodsModalRmark.value = "";
        FormReceivingInformation.ContactAddress = "";
        FormReceivingInformation.ContactName = "";
        FormReceivingInformation.ContactCell = "";
        FormReceivingInformation.ContactProvinceAreaId = "";
        FormReceivingInformation.ContactCityAreaId = "";
        FormReceivingInformation.ContactDistrictAreaId = "";

        //新增配送单 初始化数据
        FormDeliveryModal.TicketCode = "";
        FormDeliveryModal.TicketPass = "";
        ContactFormCitys.value = [];
        ContactFormDistricts.value = [];
        DeliveryVisible.value = false;
        handleSearch();
      } else {
        ElMessage.info(res.Message);
      }
    } else {
      return false;
    }
  });
};

//验证
const GetPostExchangeGoodses = (ExchangeGoodsPost) => {
  let ExchangeGoodses = [];
  for (let i = 0; i < ExchangeGoodsPost.length; i++) {
    const row = ExchangeGoodsPost[i];
    let obj = {
      GoodsId: "",
      SkuIds: [],
      PackageGoodsDetails: [],
    };
    if (!row.SelectedSkus || row.SelectedSkus.length == 0) {
      continue;
    }
    if (row.GoodsType == 2) {
      obj.GoodsId = row.GoodsId;
      row.SelectedSkus.forEach((row1) => {
        if (row1.sku_id) {
          obj.SkuIds.push(row1.sku_id);
        }
      });
      ExchangeGoodses.push(obj);
    } else {
      //当前数据为组合券的时候
      obj.GoodsId = row.GoodsId;
      let ExchangeGoodsesChild = [];
      let GoodsIdChild = "";
      row.PackageDetails.forEach((row2) => {
        GoodsIdChild = row2.GoodsId;
        let SkuIdsChild = [];
        if (row2.GoodsSkus && row2.GoodsSkus.length > 0) {
          for (let a = row.SelectedSkus.length - 1; a >= 0; a--) {
            if (row.SelectedSkus[a].GoodsId == row2.GoodsId) {
              if (row.SelectedSkus[a].sku_id) {
                SkuIdsChild.push(row.SelectedSkus[a].sku_id);
              }
            }
          }
        }
        ExchangeGoodsesChild.push({
          GoodsId: GoodsIdChild,
          SkuIds: SkuIdsChild,
        });
      });
      obj.PackageGoodsDetails = ExchangeGoodsesChild;
      ExchangeGoodses.push(obj);
    }
  }
  return ExchangeGoodses;
};

const CheckSelectSku = (TicketPost, ExchangeGoodsPost) => {
  if (ExchangeGoodsPost.GoodsType == 2) {
    //普通券
    let CountSku = 0; //sku数量
    if (ExchangeGoodsPost.GoodsSkuCount > 0) {
      //有SKU
      CountSku = countSelectSku(
        TicketPost.ExchangeGoodsIdsAll,
        ExchangeGoodsPost.GoodsId
      );
      if (CountSku == 0) {
        ElMessage.error(
          "请选择" +
          TicketPost.TicketTemplateTitle +
          "(" +
          TicketPost.TicketCode +
          ")的兑换商品的规格"
        );
        return false;
      }
    } else {
      return true;
    }
  } else {
    //组合券
    if (ExchangeGoodsPost.PackageDetailHasSku) {
      for (
        let index = 0;
        index < ExchangeGoodsPost.PackageDetails.length;
        index++
      ) {
        const element = ExchangeGoodsPost.PackageDetails[index];
        let CountSkuddd = 0; //sku数量
        if (element.Goods.SkuCount > 0) {
          if (ExchangeGoodsPost.SelectedSkus) {
            CountSkuddd++;
          }
          if (CountSkuddd == 0) {
            ElMessage.error(
              "请选择" +
              TicketPost.TicketTemplate.TicketTemplateTitle +
              "(" +
              TicketPost.TicketCode +
              ")的兑换商品的规格"
            );
            return false;
          }
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  return true;
};

const countSelectSku = (ExchangeGoodsIdsAll, GoodsIdPost) => {
  let count = 0;
  ExchangeGoodsIdsAll.forEach((row) => {
    if (row.GoodsId == GoodsIdPost && row.SelectedSkus) {
      count = count + row.SelectedSkus.length;
    }
  });
  return count;
};
//跳转到券详情
const TicketDetailClick = (TicketID) => {
  common.ClosePageTag("卡券详情");
  router.push({
    path: "/ticket_batch_info",
    query: {
      Type: "View",
      ID: TicketID,
    },
  });
};

//跳转到卡券号搜索详情
const TicketNoClick = (TicketNo) => {
  common.ClosePageTag("券码查询");
  router.push({
    path: "/find_no",
    query: {
      No: TicketNo,
    },
  });
};
//收件信息
const ContactFormProvinces = ref([]); //省份
const ContactFormCitys = ref([]); //城市
const ContactFormDistricts = ref([]); //区域
const FormReceivingInformationRef = ref(null);
const FormReceivingInformation = reactive({
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
//选中省份
const changeFormProvinces = (key) => {
  ContactFormProvinces.value.forEach((row) => {
    if (key == row.AreaId) {
      //选中之后 先清空城市和区域，然后调用城市获取信息
      ContactFormCitys.value = [];
      ContactFormDistricts.value = [];
      FormReceivingInformation.ContactCityAreaId = "";
      FormReceivingInformation.ContactDistrictAreaId = "";
      GetCityListApi(row.AreaId, row.AreaName, "");
      FormReceivingInformation.ContactProvinceName = row.AreaName;
    }
  });
};
//选中城市
const changeFormCitys = (key) => {
  ContactFormCitys.value.forEach((row) => {
    if (key == row.AreaId) {
      GetDistrictListApi(row.AreaId, row.AreaName, "");
      FormReceivingInformation.ContactCityName = row.AreaName;
    }
  });
};
//获取省份数据
const GetProvinceListApi = async () => {
  let res = await GetProvinceList({});
  if (res.Code == 200) {
    ContactFormProvinces.value = res.DataMap;
  }
};
const GetCityListApi = async (AreaId, AreaName, ContactCityAreaId) => {
  let res = await GetCityList({
    ProvinceAreaId: AreaId,
    ProvinceName: AreaName,
  });
  if (res.Code == 200) {
    ContactFormCitys.value = res.DataMap;
  }
  FormReceivingInformation.ContactCityAreaId = ContactCityAreaId;
};
const GetDistrictListApi = async (AreaId, CityName, ContactDistrictAreaId) => {
  let res = await GetDistrictList({
    CityAreaId: AreaId,
    CityName: CityName,
  });
  if (res.Code == 200) {
    ContactFormDistricts.value = res.DataMap;
  }
  FormReceivingInformation.ContactDistrictAreaId = ContactDistrictAreaId;
};
//选中区
const changeFormDistricts = (key) => {
  ContactFormDistricts.value.forEach((row) => {
    if (key == row.AreaId) {
      FormReceivingInformation.ContactDistrictName = row.AreaName;
    }
  });
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
const {
  SendPayTicketOrderPayNotifyApi, loading
} = usePayApi();
const handleSendPay = async (id) => {
  const res = await SendPayTicketOrderPayNotifyApi(id);
  if (res.Code == 200) {
    ElMessage.success("发送成功");
  }
}
</script>

<style scoped>
::v-deep(.padding_top1 .el-dialog__body) {
  padding-top: 10px !important;
}

.delivery-modal .el-dialog__body {
  padding-top: 20px !important;
}

::v-deep(.padding_top .el-dialog__body) {
  padding-top: 20px !important;
  height: 300px;
  overflow-y: scroll;
}

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

.out-bg1 {
  height: 100px;
}

.child-contant {
  margin: 20px;
  margin-top: 0;
  padding-left: 126px;
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

.send-hx {
  width: 100%;
  border-bottom: solid 1px #cecece;
}
</style>
