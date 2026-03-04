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
                placeholder="请输入配送单号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.openid"
                clearable
                placeholder="请输入OpenID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-date-picker
                style="width: 100%"
                v-model="query.search.time1"
                :shortcuts="shortcuts"
                type="daterange"
                range-separator="To"
                start-placeholder="预约提货开始"
                end-placeholder="预约提货结束"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()"
                >导&nbsp;&nbsp;出
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
              <el-date-picker
                style="width: 100%"
                v-model="query.search.time"
                :clearable="false"
                type="daterange"
                :shortcuts="shortcuts"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="" v-if="loginUser.UnitType == 2">
              <el-select
                v-model="query.search.deliver_unit_id"
                clearable
                placeholder="提货点"
                style="width: 100%"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.UnitId"
                  :label="item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                v-if="IsRight"
                class="button2 button-float"
                round
                @click="handleAdd1()"
                >批量提货
              </el-button>
              <el-button
                class="button2 button-float"
                v-if="IsRight2"
                round
                @click="handleApprove()"
                >批量审核
              </el-button>
              <el-button
                class="button2 button-float"
                v-if="IsRight"
                round
                @click="handleSend()"
                >批量发货
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="lading_tags">
      <ul>
        <li
          @click="choosetag(index)"
          class="lading_tags-li"
          v-for="(item, index) in statusList"
          :class="{ active: item.active }"
          :key="index"
        >
          {{ item.key
          }}<text v-if="item.key == '待审核'"
            >({{ StatData.wait_approve_cnt }})</text
          >
          <text v-if="item.key == '待发货'"
            >({{ StatData.wait_deliver_cnt }})</text
          >
        </li>
      </ul>
    </div>
    <div style="width: 100%; height: 8px"></div>
    <el-table
      @expand-change="expandChange"
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
          <div
            class="child-contant"
            v-for="(item, index) in props.row.Details"
            :key="index"
          >
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
              </el-col>
            </el-row>
            <el-form-item
              label=""
              style=""
              v-if="
                item.ExchangeGoods.length > 0 &&
                item.ExchangeGoods[0].GoodsId != ''
              "
            >
              <el-table
                :span-method="
                  (param) => objectSpanMethod(param, item.ExchangeGoods.length)
                "
                :data="item.ExchangeGoods"
                style="width: 90%"
                border
                :header-cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column prop="GoodsTitle" align="center" label="">
                  <template #default="scope">
                    <p v-if="false">{{ scope.row.GoodsTitle }}</p>
                    <p>已兑换商品</p>
                  </template>
                </el-table-column>
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
                <el-table-column align="center" label="商品">
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
                <el-table-column align="center" label="差异兑换" width="100">
                  <template #default="scope">
                    <p>
                      {{ scope.row.IsDiff == 1 ? "是" : "否" }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="GoodsQty"
                  align="center"
                  label="数量"
                  width="80"
                >
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        :selectable="selectedApprove"
        align="center"
        width="55"
      />
      <el-table-column
        prop="OrderCode"
        align="left"
        label="配送信息"
        width="210"
      >
        <template #default="scope">
          <p>{{ scope.row.OrderCode }}</p>
          <p>{{ scope.row.OrderTime }}</p>
          <p v-if="scope.row.AccountName">{{ scope.row.AccountName }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="券归属人" width="200">
        <template #default="scope">
          <p>{{ scope.row.Openid }}</p>
          <p>{{ scope.row.VipName }}&nbsp;{{ scope.row.VipCell }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loginUser.UnitType != '33'"
        prop="DeliverUnitName"
        label="提货点"
        align="center"
        width="100"
      >
        <template #default="scope">
          <p>{{ scope.row.DeliverUnitName }}</p>
        </template>
      </el-table-column>

      <el-table-column align="left" label="券明细">
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.Details"
            :key="item.OrderDetailId"
          >
            <span
              style="cursor: pointer; color: #f56c6c"
              @click="TicketDetailClick(item.VipTicket.TicketTemplate.Id)"
            >
              {{
                index +
                1 +
                ". " +
                item.VipTicket.TicketTemplate.Code +
                " " +
                item.VipTicket.TicketTemplate.Title
              }}
            </span>
            <span
              style="cursor: pointer; color: #f56c6c"
              @click="TicketNoClick(item.VipTicket.TicketCode)"
              >{{ " - " + item.VipTicket.TicketCode }}</span
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="提货日期" align="left" width="160">
        <template #default="scope">
          <p v-if="scope.row.PrebookPickupDate2">
            预约：{{ scope.row.PrebookPickupDate2 }}
          </p>
          <p v-if="scope.row.PickupDate2">提货：{{ scope.row.PickupDate2 }}</p>
        </template>
      </el-table-column>

      <el-table-column
        prop="PickupUserName"
        label="发货人"
        align="center"
        width="100"
      ></el-table-column>
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
              v-if="scope.row.OrderStatus == 0 && IsRight2"
              class="button-op-edit"
              size="small"
              @click="handleApproveBtn(scope.row.OrderId)"
              >审核
            </el-button>
            <el-button
              v-if="scope.row.OrderStatus == 9"
              class="button-op-edit"
              size="small"
              @click="handleSendBtn(scope.row.OrderId)"
              >发货
            </el-button>
            <el-button
              v-if="scope.row.OrderStatus == 0 && IsRight1"
              class="button-op-del"
              size="small"
              @click="handleCannel(scope.row.OrderId)"
              >取消
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="handleHistoryBtn(scope.row.OrderId)"
              >日志
            </el-button>
            <el-button
              v-if="scope.row.OrderStatus == 9 && IsRight2"
              class="button-op-del"
              size="small"
              @click="handleReturn(scope.row.OrderId)"
              >退回
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
    <!-- 提货单弹出框 -->
    <el-dialog
      title="提货单"
      v-model="takeDeliveryGoodsVisible"
      width="54%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="24">
          <el-form
            ref="formTakeDeliveryGoodsRef"
            :model="formTakeDeliveryGoodsModal"
            :rules="rulesTakeDeliveryGoodsModal"
            label-width="120px"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item label="券码">
                  <el-input v-model="formTakeDeliveryGoodsModal.TicketCode">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="密码">
                  <el-input v-model="formTakeDeliveryGoodsModal.TicketPass">
                    <template #append>
                      <el-button
                        :loading="btnLoading"
                        class="button1"
                        @click="
                          handleView(formTakeDeliveryGoodsModal.TicketPass)
                        "
                        >查询
                      </el-button>
                    </template></el-input
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="formTakeDeliveryGoodsModal.TicketStatus == 2">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="券批次号">
                    <el-input
                      v-model="formTakeDeliveryGoodsModal.TicketTemplateCode"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="券名称">
                    <el-input
                      v-model="formTakeDeliveryGoodsModal.TicketTemplateTitle"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="领取人">
                    <el-input
                      disabled
                      v-model="formTakeDeliveryGoodsModal.TakeVipNameDesc"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="状态">
                    <el-input
                      v-model="formTakeDeliveryGoodsModal.TicketStatusDesc"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="formTakeDeliveryGoodsModal.PrebookDateDesc > 0">
                <el-col :span="11">
                  <el-form-item label="提货日期">
                    <el-date-picker
                      style="width: 100%"
                      v-model="formTakeDeliveryGoodsModal.PrebookDate"
                      type="date"
                      placeholder="选择日期"
                    />
                    <div>
                      需提前{{
                        formTakeDeliveryGoodsModal.PrebookDateDesc
                      }}天预约
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                v-if="formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.length > 0"
              >
                <el-col :span="22">
                  <el-form-item label="兑换商品">
                    <el-table
                      ref="multipleTableRef"
                      border
                      :data="formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll"
                      style="width: 100%"
                      :header-cell-style="{ 'text-align': 'center' }"
                      header-cell-class-name="table-header"
                    >
                      <el-table-column label="" align="center" width="50">
                        <template #default="scope">
                          <el-checkbox
                            v-model="scope.row.IsSelected"
                            @change="handleCheckChange($event, scope.$index)"
                            label=""
                            size="large"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="GoodsTitle"
                        align="center"
                        label="名称"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="GoodsCode"
                        align="center"
                        label="编码"
                        width="100"
                      >
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="价格(元)"
                        width="80"
                      >
                        <template #default="scope">
                          <p>
                            {{ (scope.row.GoodsOrgPrice / 100).toFixed(2) }}
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="GoodsBarcode"
                        align="left"
                        label="其他信息"
                        width="250"
                      >
                        <template #default="scope">
                          <p>商品条码：{{ scope.row.GoodsBarcode }}</p>
                          <p>规格：{{ scope.row.GoodsSubTitle }}</p>
                          <p>数量：{{ scope.row.Qty }}</p>
                          <p
                            v-if="scope.row.GoodsStatus == 0"
                            style="color: #f56c6c"
                          >
                            缺货
                          </p>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p style="color: #f56c6c">
                      卡券类型：{{
                        formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2
                      }}
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="备注">
                    <el-input
                      maxlength="100"
                      :rows="4"
                      show-word-limit
                      type="textarea"
                      v-model="formTakeDeliveryGoodsModal.Remark"
                    ></el-input>
                  </el-form-item>
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
            :loading="takeDeliveryGoodsLoading"
            @click="takeDeliveryGoodsBtn"
            >发 货</el-button
          >
          <el-button class="button2" @click="takeDeliveryGoodsVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 提货单弹出框 -->
    <el-dialog
      title="批量提货"
      class="takeModal"
      v-model="takeDeliveryGoodsVisible1"
      width="68%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-tabs
        type="border-card"
        v-model="activeName"
        @tab-click="handleChangeClick"
      >
        <el-tab-pane label="券查询" name="first">
          <el-row>
            <el-col :span="24">
              <el-form
                ref="formTakeDeliveryGoodsRef"
                :model="formTakeDeliveryGoodsModal"
                :rules="rulesTakeDeliveryGoodsModal"
                label-width="120px"
              >
                <el-row>
                  <el-col :span="3">
                    <el-form-item label="差异兑换">
                      <el-switch
                        style="--el-switch-on-color: #e57672"
                        v-model="formTakeDeliveryGoodsModal.IsByDiff"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="券码">
                      <el-input v-model="formTakeDeliveryGoodsModal.TicketCode">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="密码">
                      <el-input v-model="formTakeDeliveryGoodsModal.TicketPass">
                        <template #append>
                          <el-button
                            :loading="btnLoading"
                            class="button1"
                            @click="
                              handleView1(formTakeDeliveryGoodsModal.TicketPass)
                            "
                            >查询
                          </el-button>
                        </template></el-input
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <div v-if="formTakeDeliveryGoodsModal.TicketStatus == 2">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="券批次号">
                        <el-input
                          v-model="
                            formTakeDeliveryGoodsModal.TicketTemplateCode
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="券名称">
                        <el-input
                          v-model="
                            formTakeDeliveryGoodsModal.TicketTemplateTitle
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="领取人">
                        <el-input
                          disabled
                          v-model="formTakeDeliveryGoodsModal.TakeVipNameDesc"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="状态">
                        <el-input
                          v-model="formTakeDeliveryGoodsModal.TicketStatusDesc"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="
                      formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.length > 0
                    "
                  >
                    <el-col :span="22">
                      <el-form-item label="兑换商品">
                        <el-table
                          ref="multipleTableRef"
                          border
                          :data="formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll"
                          style="width: 100%"
                          :header-cell-style="{ 'text-align': 'center' }"
                          header-cell-class-name="table-header"
                        >
                          <el-table-column label="" align="center" width="50">
                            <template #default="scope">
                              <el-checkbox
                                v-model="scope.row.IsSelected"
                                @change="
                                  handleCheckChangeSku($event, scope.$index)
                                "
                                label=""
                                size="large"
                              />
                            </template>
                          </el-table-column>
                          <el-table-column
                            align="center"
                            label="名称"
                            width="250"
                          >
                            <template #default="scope">
                              <p>{{ scope.row.GoodsTitle }}</p>
                              <p
                                v-if="scope.row.GoodsStatus == 0"
                                style="color: #f56c6c"
                              >
                                (库存不足)
                              </p>
                            </template>
                          </el-table-column>
                          <!-- <el-table-column prop="GoodsCode" align="center" label="编码" width="100">
                          </el-table-column> -->
                          <el-table-column
                            prop="GoodsBarcode"
                            align="left"
                            label="其他信息"
                          >
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
                                <p
                                  v-for="(SkusItem, SkusIndex) in scope.row
                                    .SelectedSkus"
                                  :key="SkusItem"
                                  :index="SkusIndex"
                                >
                                  {{ SkusItem.all_idsDesc }}
                                </p>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            align="center"
                            label="操作"
                            width="100"
                          >
                            <template #default="scope">
                              <div class="button-mgl">
                                <el-button
                                  v-if="
                                    scope.row.GoodsType == 2 &&
                                    scope.row.GoodsSkuCount > 0
                                  "
                                  class="button-op-edit"
                                  size="small"
                                  @click="handleSkuEdit(scope.row)"
                                  >选规格
                                </el-button>
                                <el-button
                                  v-if="
                                    scope.row.GoodsType == 3 &&
                                    scope.row.PackageDetailHasSku
                                  "
                                  class="button-op-edit"
                                  size="small"
                                  @click="handleSkuEdit(scope.row)"
                                  >选规格
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <p style="color: #f56c6c">
                          卡券类型：{{
                            formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2
                          }}
                        </p>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="">
                        <el-button
                          class="button1"
                          :loading="takeTableDataLoading"
                          @click="takeTableDataBtn"
                          >添 加</el-button
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="已添加的券" name="second">
          <el-table
            :data="takeTable"
            height="350"
            border
            class="table"
            ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header"
          >
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
                <div
                  v-for="item in scope.row.ExchangeGoodsIdsAll"
                  :key="item.GoodsId"
                >
                  <!-- <p v-if="item.IsSelected">{{ item.GoodsCode + '-' + item.GoodsTitle }}</p> -->
                  <div v-if="item.IsSelected">
                    <p
                      v-for="(SkusItem, SkusIndex) in item.SelectedSkus"
                      :key="SkusIndex"
                    >
                      {{ SkusItem.all_idsDesc }}
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="TicketStatusDesc"
              align="center"
              label="差异兑换"
              width="100"
            >
              <template #default="scope">
                <p>{{ scope.row.IsByDiff ? "是" : "否" }}</p>
              </template></el-table-column
            >
            <el-table-column
              prop="TicketStatusDesc"
              align="center"
              label="状态"
              width="100"
            ></el-table-column>
            <el-table-column prop="" align="center" label="操作" width="100">
              <template #default="scope">
                <div class="button-mgl">
                  <el-button
                    class="button-op-del"
                    size="small"
                    @click="handleDel(scope.$index)"
                    >删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 10px; width: 100%"></div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  maxlength="100"
                  :rows="4"
                  show-word-limit
                  type="textarea"
                  v-model="formTakeDeliveryGoodsModalRmark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="汇总" name="third">
          <div style="width: 100%; height: 10rpx; background-color: #fff"></div>
          <div class="ticket_gather_detail">
            <div class="ticket_gather_detail2 flex-row justify-between">
              <div style="width: 65%">
                礼券总计<text style="color: #e12563"
                  >({{ gatherArr1.length }})</text
                >
              </div>
              <div style="" v-show="count1 != ''">X {{ count1 }}</div>
            </div>
            <div style="width: 100%; height: 6px; background-color: #fff"></div>
            <div
              v-for="(item, index) in gatherArr1"
              :key="item.TicketTemplateCode"
              class="ticket_gather_detail1 flex-row justify-between"
              style="height: 25px"
            >
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
                待发货商品总计<text style="color: #e12563"
                  >({{ gatherArr.length }})</text
                >
              </div>
              <div style="" v-show="count != ''">X {{ count }}</div>
            </div>
            <div style="width: 100%; height: 6px; background-color: #fff"></div>
            <div
              v-for="(item, index) in gatherArr"
              :key="item.GoodsId"
              class="ticket_gather_detail1 flex-row justify-between"
              style="height: 25px"
            >
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
          <el-button
            class="button1"
            v-show="activeName == 'second' || activeName == 'third'"
            :loading="takeDeliveryGoodsLoading"
            @click="takeDeliveryGoodsBtn1"
            >发 货</el-button
          >
          <el-button class="button2" @click="closetakeDeliveryGoodsVisible"
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
    <div style="width:100%;height: 18px;"></div>
      <el-table
        v-loading="tableHistoryLoading"
        border
        :data="tableHistoryData"
        style="width: 100%"
      >
        <el-table-column align="left" label="操作人" width="200">
          <template #default="scope">
            <p>姓名：{{ scope.row.OpUserName }}</p>
            <p>角色：{{ scope.row.OpRoleName }}</p>
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
    <!-- 批量操作审核 -->
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
    <!-- 操作 -->
    <el-dialog
      title="取消"
      v-model="cancelVisible"
      width="38%"
      :show-close="false"
    >
    <div style="width:100%;height: 18px;"></div>
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
    <!-- 发货 -->
    <bill-of-lading
      :Visible="sendVisible"
      :orderIds="sendIds"
      @close-send-visible="sendVisible = false"
      @success-visible="CloseSendVisible"
    ></bill-of-lading>
    <!-- 选择规格弹框 -->
    <el-dialog
      title="规格"
      class="padding_top"
      v-model="skuVisible"
      width="40%"
      :show-close="false"
    >
      <selsku
        ref="editor"
        @saveSku="saveSku"
        @closeSku="closeSku"
        @closeSKUModal="closeSKUModal"
        :ExchangeArr="ExchangeArr"
        :openSkuModal="openSkuModal"
      >
      </selsku>
    </el-dialog>
    <!-- 退回操作 -->
    <el-dialog
      title="退回"
      v-model="ReturnVisible"
      width="38%"
      :show-close="false"
    >
      <el-input
        type="textarea"
        maxlength="100"
        :rows="4"
        show-word-limit
        placeholder="请输入备注"
        v-model="textareaReturnInput"
      >
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="ReturnLoading"
            @click="ReturnModalBtn"
            >确 认</el-button
          >
          <el-button class="button2" @click="ReturnVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SearchPickupDeliverOrders,
  PickupDeliverOrder,
  GetBillOperateHises,
  CancelDeliverOrder,
  ApproveDeliverOrders,
  RejectApproveDeliverOrders,
} from "@/api/order.js";
import common from "@/utils/common.js";
import { StatSingle, HasRightes, SearchUnites } from "@/api/index.js";
import { GetGoods } from "@/api/goods.js";
import Cookie from "js-cookie";
import {
  GetTicketByCode,
  PickupTicketByCode,
  BatchPickupTicketesWithSku,
} from "@/api/ticket.js";
import selsku from "@/components/common/sel_sku.vue";
import billOfLading from "@/components/Point/billOfLading.vue";
const router = useRouter();
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

const query = reactive({
  UserID: "",
  title: "",
  name: "",
  search: {
    order_code: "",
    openid: "",
    order_status: "0", //状态(-1:取消;0:待审核;9:已审核，待发货;10:已发货;11:部分已发货;20:已收货;21:部分已收货)
    deliver_unit_id: "",
    contact_cell: "", //联系人
    ticket_code: "", //券码
    time: [],
    time1: [],
    order_date_begin: "",
    order_date_end: "",
    prebook_pickup_date_begin: "",
    prebook_pickup_date_end: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
//表格数据
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const StatData = reactive({
  wait_approve_cnt: 0, //待审核
  wait_deliver_cnt: 0, //待发货
  deliver_cnt: 0, //已发货
});

//提货单
const activeName = ref("first");
const takeDeliveryGoodsVisible = ref(false);
const takeDeliveryGoodsLoading = ref(false);
const formTakeDeliveryGoodsRef = ref(null);
const formTakeDeliveryGoodsModalRmark = ref("");

const formTakeDeliveryGoodsModal = reactive({
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
  IsByDiff: false, //是否显示差异兑换商品
});
const rulesTakeDeliveryGoodsModal = {};

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
    value: "9",
    key: "待发货",
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

const getData = async () => {
  query.search.order_date_begin = "";
  query.search.order_date_end = "";
  query.search.prebook_pickup_date_begin = "";
  query.search.prebook_pickup_date_end = "";
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
  if (query.search.time1) {
    if (query.search.time1.length > 0) {
      query.search.prebook_pickup_date_begin = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time1[0]
      );
      query.search.prebook_pickup_date_end = common.dateFormat(
        "YYYY-mm-dd",
        query.search.time1[1]
      );
    }
  }
  if (query.search.order_status == 30) {
    query.search.order_status = "";
  }
  tableLoading.value = true;
  let res = await SearchPickupDeliverOrders({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      let IsSend = false;
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
const loginUser = JSON.parse(Cookie.get("User"));

//发货权限
const IsRight = ref(false);
const IsRight1 = ref(false);
const IsRight2 = ref(false);
const BoolRight = async () => {
  let arr = [
    "pickup_deliver_order",
    "cancel_deliver_order",
    "approve_deliver_order",
  ];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.pickup_deliver_order;
    IsRight1.value = res.DataMap.cancel_deliver_order;
    IsRight2.value = res.DataMap.approve_deliver_order;
  }
};
//审批权限控制
BoolRight();
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

const takeDeliveryGoodsVisible1 = ref(false);
//新增批量提货单
const handleAdd1 = () => {
  takeDeliveryGoodsVisible1.value = true;
  formTakeDeliveryGoodsModal.TicketId = "";
  formTakeDeliveryGoodsModal.IsByDiff = false; //是否显示差异兑换商品
  formTakeDeliveryGoodsModal.TicketTemplateId = "";
  formTakeDeliveryGoodsModal.TicketTemplateTitle = "";
  formTakeDeliveryGoodsModal.TicketCode = "";
  formTakeDeliveryGoodsModal.TicketPass = "";
  formTakeDeliveryGoodsModal.TicketTemplateCode = "";
  formTakeDeliveryGoodsModal.TicketStatusDesc = "";
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll = [];
  formTakeDeliveryGoodsModal.Remark = "";
  formTakeDeliveryGoodsModal.TicketStatus = "";
  formTakeDeliveryGoodsModal.TakeVipNameDesc = "";
  formTakeDeliveryGoodsModal.PrebookDate = "";
  formTakeDeliveryGoodsModal.PrebookDateDesc = "";
  formTakeDeliveryGoodsModal.TicketTemplateTypeDesc = "";
  formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2 = "";
};

const gatherArr = ref([]); //商品汇总
const gatherArr1 = ref([]); //券汇总
const count = ref("");
const count1 = ref("");
const handleChangeClick = (event) => {
  if (event.props.name == "third") {
    let arrGood = [];
    let arrTicket1 = [];
    takeTable.value.forEach((row) => {
      for (let i = 0; i < row.ExchangeGoodsIdsAll.length; i++) {
        let GoodsesRow = row.ExchangeGoodsIdsAll[i];
        if (!GoodsesRow.IsSelected) {
          continue;
        }
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
const handleOut = () => {
  //导出
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
      query.search.prebook_pickup_date_begin = "";
      query.search.prebook_pickup_date_end = "";
      if (query.search.time1) {
        if (query.search.time1.length > 0) {
          query.search.prebook_pickup_date_begin = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time1[0]
          );
          query.search.prebook_pickup_date_end = common.dateFormat(
            "YYYY-mm-dd",
            query.search.time1[1]
          );
        }
      }
      if (query.search.order_status == 30) {
        query.search.order_status = "";
      }
      tableLoading.value = true;
      let res = await SearchPickupDeliverOrders({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: query.search,
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
            "订单号",
            "提货时间",
            "预约时间",
            "商品编码",
            "商品名称",
            "商品数量",
            "商品价格",
            "组合商品编码",
            "组合商品名称",
            "SKU编码",
            "SKU属性",
            "是否差异兑换",
            "券批次号",
            "券名称",
            "券码",
            "券归属信息",
            "提货点",
            "商品描述详情",
            "发货人",
            "状态",
          ];
          let OutData = [];
          res.DataMap.Data.forEach((row) => {
            row.Details.forEach((rowDetails) => {
              rowDetails.ExchangeGoods.forEach((rowGoods) => {
                let ObjData = {
                  PackageGoodsCode: "",
                  PackageGoodsTitle: "",
                  DisplayTitle: "",
                  ExpressTypeList: "",
                  SkuCode: "",
                  SkuPropertyDesc: "",
                  GoodsDetail: "",
                  PrebookPickupDate2: "",
                  IsDiffDesc: "",
                };
                ObjData.GoodsCode = rowGoods.GoodsCode;
                ObjData.IsDiffDesc = rowGoods.IsDiff == 1 ? "是" : "否";
                ObjData.GoodsTitle = rowGoods.GoodsTitle;
                ObjData.GoodsQty = rowGoods.GoodsQty;
                ObjData.GoodsOrgPrice = rowGoods.GoodsOrgPrice / 100;
                if (rowGoods.PackageGoodsQty > 0) {
                  //只有组合装的时候就会显示
                  ObjData.PackageGoodsCode = rowGoods.PackageGoodsCode;
                  ObjData.PackageGoodsTitle = rowGoods.PackageGoodsTitle;
                }
                if (rowGoods.SkuId != "") {
                  ObjData.SkuCode = rowGoods.SkuCode;
                  ObjData.SkuPropertyDesc = rowGoods.SkuPropertyDesc;
                }
                ObjData.Code = rowDetails.VipTicket.TicketTemplate.Code;
                ObjData.TicketCode = rowDetails.VipTicket.TicketCode;
                ObjData.Title = rowDetails.VipTicket.TicketTemplate.Title;
                ObjData.OrderCode = row.OrderCode;
                ObjData.AccountName = row.AccountName;
                ObjData.PickupDate2 = row.PickupDate2;
                if (row.PrebookPickupDate2) {
                  ObjData.PrebookPickupDate2 = row.PrebookPickupDate2;
                }
                ObjData.DeliverUnitName = row.DeliverUnitName;
                ObjData.OrderStatusDesc = row.OrderStatusDesc;
                ObjData.PickupUserName = row.PickupUserName;
                //券归属信息
                ObjData.TicketDesc = `${row.Openid} ${row.VipName} ${row.VipCell}`;
                if (rowGoods.GoodsDetail) {
                  ObjData.GoodsDetail = rowGoods.GoodsDetail.replace(
                    /<[^<>]+>/g,
                    ""
                  ).replace(/&nbsp;/gi, "");
                }
                OutData.push(ObjData);
              });
            });
          });
          const filterVal = [
            "AccountName",
            "OrderCode",
            "PickupDate2",
            "PrebookPickupDate2",
            "GoodsCode",
            "GoodsTitle",
            "GoodsQty",
            "GoodsOrgPrice",
            "PackageGoodsCode",
            "PackageGoodsTitle",
            "SkuCode",
            "SkuPropertyDesc",
            "IsDiffDesc",
            "Code",
            "Title",
            "TicketCode",
            "TicketDesc",
            "DeliverUnitName",
            "GoodsDetail",
            "PickupUserName",
            "OrderStatusDesc",
          ];
          const data = formatJson(filterVal, OutData);
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: "提货单据导出" + time,
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

const StatSingleData = async () => {
  //获取头部数据
  let res = await StatSingle({
    StatType: 7,
  });
  if (res.Code == 200) {
    StatData.wait_approve_cnt = res.DataMap.wait_approve_cnt;
    StatData.wait_deliver_cnt = res.DataMap.wait_deliver_cnt;
    StatData.deliver_cnt = res.DataMap.deliver_cnt;
  }
};
StatSingleData();

const multipleSelection = ref([]);
const expandChangeData = ref([]);

const tableDataRef = ref(null);
const expandChange = (row, expandedRows) => {
  expandChangeData.value = expandedRows;
  const isExpend = expandedRows.some((r) => r.OrderId === row.OrderId); // 判断当前行展开状态
  if (!isExpend) {
    multipleSelection.value.forEach((row1) => {
      if (row1.OrderId == row.OrderId) {
        row1.arr = [];
      }
    });
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
//提货单发货
const sendVisible = ref(false);
const sendIds = ref([]);

const handleSendBtn = (ID) => {
  sendIds.value = [];
  sendIds.value.push(ID);
  sendVisible.value = true;
};

const CloseSendVisible = () => {
  ElMessage({
    type: "success",
    message: "操作成功",
  });
  query.PageStartRow = 1;
  getData();
  sendVisible.value = false;
};

const btnLoading = ref(false);
//券码查询券信息
const handleView = async (postVal) => {
  btnLoading.value = true;
  if (formTakeDeliveryGoodsModal.TicketCode == "") {
    ElMessage.error("券码不能为空");
    btnLoading.value = false;
    return;
  }
  if (postVal == "") {
    ElMessage.error("密码不能为空");
    btnLoading.value = false;
    return;
  }
  let res = await GetTicketByCode({
    TicketCode: formTakeDeliveryGoodsModal.TicketCode,
    TicketPwd: postVal,
    ReturnPass: true,
    CheckCanExchange: true,
    NotReturnHis: true,
  });
  btnLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.TicketStatus == 2) {
      if (postVal.indexOf("@") > 1) {
        formTakeDeliveryGoodsModal.TicketPass = postVal.split("@")[0];
        formTakeDeliveryGoodsModal.TicketCode = postVal.split("@")[1];
      }
      formTakeDeliveryGoodsModal.TicketId = res.DataMap.TicketId;
      formTakeDeliveryGoodsModal.TicketStatus = res.DataMap.TicketStatus;
      formTakeDeliveryGoodsModal.ExchangeGoodsQty =
        res.DataMap.TicketTemplate.ExchangeGoodsQty;
      formTakeDeliveryGoodsModal.TicketTemplateTitle =
        res.DataMap.TicketTemplate.TicketTemplateTitle;
      formTakeDeliveryGoodsModal.TicketStatusDesc =
        res.DataMap.TicketStatusDesc;
      formTakeDeliveryGoodsModal.GoodsQty = res.DataMap.TicketTemplate.GoodsQty;
      formTakeDeliveryGoodsModal.TicketTemplateCode =
        res.DataMap.TicketTemplate.TicketTemplateCode;
      formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll = res.DataMap
        .TicketTemplate.ExchangeGoodses
        ? res.DataMap.TicketTemplate.ExchangeGoodses
        : [];
      formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2 =
        res.DataMap.TicketTemplate.TicketTemplateTypeDesc2;
      if (res.DataMap.TakeVipName) {
        formTakeDeliveryGoodsModal.TakeVipNameDesc =
          res.DataMap.TakeVipName + "-" + res.DataMap.TakeVipCell;
      }
      if (res.DataMap.TicketTemplate.TicketTemplateConfig) {
        let TicketTemplateConfig = JSON.parse(
          res.DataMap.TicketTemplate.TicketTemplateConfig
        );
        if (TicketTemplateConfig.NeedPreBookWhenPickup == 1) {
          formTakeDeliveryGoodsModal.PrebookDateDesc =
            TicketTemplateConfig.ForwardDaysWhenPreBook;
        }
      }
      formTakeDeliveryGoodsModal.Remark = "";
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
const handleView1 = async (postVal) => {
  btnLoading.value = true;
  if (formTakeDeliveryGoodsModal.TicketCode == "") {
    ElMessage.error("券码不能为空");
    btnLoading.value = false;
    return;
  }
  if (postVal == "") {
    ElMessage.error("密码不能为空");
    btnLoading.value = false;
    return;
  }
  let res = await GetTicketByCode({
    TicketCode: formTakeDeliveryGoodsModal.TicketCode,
    TicketPwd: postVal,
    ReturnPass: true,
    ReturnSku: true,
    CheckCanExchange: true,
    NotReturnHis: true,
    IsByDiff: formTakeDeliveryGoodsModal.IsByDiff,
  });
  btnLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.TicketStatus == 2) {
      if (postVal.indexOf("@") > 1) {
        formTakeDeliveryGoodsModal.TicketPass = postVal.split("@")[0];
        formTakeDeliveryGoodsModal.TicketCode = postVal.split("@")[1];
      }
      formTakeDeliveryGoodsModal.TicketStatus = res.DataMap.TicketStatus;
      formTakeDeliveryGoodsModal.TicketId = res.DataMap.TicketId;
      formTakeDeliveryGoodsModal.TicketTemplateId =
        res.DataMap.TicketTemplate.TicketTemplateId;
      formTakeDeliveryGoodsModal.ExchangeGoodsQty =
        res.DataMap.TicketTemplate.ExchangeGoodsQty;
      formTakeDeliveryGoodsModal.TicketTemplateTitle =
        res.DataMap.TicketTemplate.TicketTemplateTitle;
      formTakeDeliveryGoodsModal.TicketStatusDesc =
        res.DataMap.TicketStatusDesc;
      formTakeDeliveryGoodsModal.GoodsQty = res.DataMap.TicketTemplate.GoodsQty;
      formTakeDeliveryGoodsModal.TicketTemplateCode =
        res.DataMap.TicketTemplate.TicketTemplateCode;
      formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll = res.DataMap
        .TicketTemplate.ExchangeGoodses
        ? res.DataMap.TicketTemplate.ExchangeGoodses
        : [];
      formTakeDeliveryGoodsModal.TicketTemplateTypeDesc =
        res.DataMap.TicketTemplate.TicketTemplateTypeDesc;
      formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2 =
        res.DataMap.TicketTemplate.TicketTemplateTypeDesc2;
      if (res.DataMap.TakeVipName) {
        formTakeDeliveryGoodsModal.TakeVipNameDesc =
          res.DataMap.TakeVipName + "-" + res.DataMap.TakeVipCell;
      }
      if (res.DataMap.TicketTemplate.TicketTemplateConfig) {
        let TicketTemplateConfig = JSON.parse(
          res.DataMap.TicketTemplate.TicketTemplateConfig
        );
        if (TicketTemplateConfig.NeedPreBookWhenPickup == 1) {
          formTakeDeliveryGoodsModal.PrebookDateDesc =
            TicketTemplateConfig.ForwardDaysWhenPreBook;
        }
      }
      formTakeDeliveryGoodsModal.Remark = "";
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
//保存新增提货单
const takeDeliveryGoodsBtn = () => {
  formTakeDeliveryGoodsRef.value.validate(async (valid) => {
    if (valid) {
      takeDeliveryGoodsLoading.value = true;
      let ExchangeGoodsIds = [];
      //     ExchangeGoodsQty: "",//最多只能选几个商品
      // GoodsQty: "",//总共有多少个商品
      let isCheck = 0;
      formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.forEach((row) => {
        if (row.IsSelected) {
          isCheck++;
          ExchangeGoodsIds.push(row.GoodsId);
        }
      });
      if (formTakeDeliveryGoodsModal.ExchangeGoodsQty > 1) {
        if (isCheck == 0) {
          takeDeliveryGoodsLoading.value = false;
          ElMessage.error("请先选择商品！");
          return;
        }
        if (isCheck < formTakeDeliveryGoodsModal.ExchangeGoodsQty) {
          takeDeliveryGoodsLoading.value = false;
          ElMessage.error("选择的商品数量与卡券要求数量不匹配");
          return;
        }
      }
      let res = await PickupTicketByCode({
        TicketCode: formTakeDeliveryGoodsModal.TicketCode,
        TicketPass: formTakeDeliveryGoodsModal.TicketPass,
        ExchangeGoodsIds: ExchangeGoodsIds,
        Remark: formTakeDeliveryGoodsModal.Remark,
        PrebookDate: formTakeDeliveryGoodsModal.PrebookDate,
      });
      takeDeliveryGoodsLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功！");
        takeDeliveryGoodsVisible.value = false;
        query.PageStartRow = 1;
        getData();
      } else {
        ElMessage.info(res.Message);
      }
    } else {
      return false;
    }
  });
};
//关闭批量新增提货单
const closetakeDeliveryGoodsVisible = () => {
  takeTable.value = [];
  gatherArr.value = [];
  count.value = "";
  takeDeliveryGoodsVisible1.value = false;
};

////////////////////////////////////////////////////////////////
//验证
const GetPostExchangeGoodses = (ExchangeGoodsPost) => {
  let ExchangeGoodses = [];
  for (let i = 0; i < ExchangeGoodsPost.length; i++) {
    const row = ExchangeGoodsPost[i];
    if (!row.IsSelected) {
      continue;
    }
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

//保存批量提货单
const takeDeliveryGoodsBtn1 = () => {
  formTakeDeliveryGoodsRef.value.validate(async (valid) => {
    if (valid) {
      takeDeliveryGoodsLoading.value = true;
      if (takeTable.value.length == 0) {
        ElMessage.info("请先添加提货券");
        takeDeliveryGoodsLoading.value = false;
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
              takeDeliveryGoodsLoading.value = false;
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
            takeDeliveryGoodsLoading.value = false;
            return;
          }
          takeDeliveryGoodsLoading.value = false;
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
          IsDiff: rowTicket.IsByDiff,
          ExchangeGoodses: ExchangeGoodsIdsAll,
        });
      }
      let res = await BatchPickupTicketesWithSku({
        Ticketes: Ticketes,
        Remark: formTakeDeliveryGoodsModalRmark.value,
      });
      takeDeliveryGoodsLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功！");
        takeDeliveryGoodsVisible.value = false;
        query.PageStartRow = 1;
        takeTable.value = [];
        gatherArr.value = [];
        count.value = "";
        takeDeliveryGoodsVisible1.value = false;
        getData();
      } else {
        ElMessage.info(res.Message);
      }
    } else {
      return false;
    }
  });
};

const takeTableDataLoading = ref(false);
const takeTable = ref([]);

//添加到待确认提货单列表
const takeTableDataBtn = () => {
  takeTableDataLoading.value = true;
  let isChange = 0;
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.forEach((row) => {
    if (row.IsSelected) {
      isChange++;
    }
  });
  //当前是多选的时候
  if (formTakeDeliveryGoodsModal.GoodsQty > 1) {
    if (isChange == 0) {
      ElMessage.error("请先选择商品");
      takeTableDataLoading.value = false;
      return;
    }
    if (isChange < formTakeDeliveryGoodsModal.ExchangeGoodsQty) {
      ElMessage.error("勾选的兑换商品数量不匹配");
      takeTableDataLoading.value = false;
      return;
    }
  } else if (formTakeDeliveryGoodsModal.GoodsQty == 1) {
    formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.forEach((row) => {
      row.IsSelected = true;
    });
    if (formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.length > 0) {
      let ExchangeGoodInfo = formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[0];
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

  let objectInfo = JSON.parse(JSON.stringify(formTakeDeliveryGoodsModal));
  let isChongfu = 0;
  if (takeTable.value.length > 0) {
    takeTable.value.forEach((row) => {
      //判断是否重复添加
      if (row.TicketId == formTakeDeliveryGoodsModal.TicketId) {
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
    EGIndex < formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.length;
    EGIndex++
  ) {
    const ExchangeGoods =
      formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[EGIndex];
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
  formTakeDeliveryGoodsModal.TicketTemplateTitle = "";
  formTakeDeliveryGoodsModal.IsByDiff = false; //是否显示差异兑换商品
  formTakeDeliveryGoodsModal.TicketId = "";
  formTakeDeliveryGoodsModal.TicketTemplateId = "";
  formTakeDeliveryGoodsModal.TicketCode = "";
  formTakeDeliveryGoodsModal.TicketPass = "";
  formTakeDeliveryGoodsModal.TicketTemplateCode = "";
  formTakeDeliveryGoodsModal.TicketStatusDesc = "";
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll = [];
  formTakeDeliveryGoodsModal.Remark = "";
  formTakeDeliveryGoodsModal.TicketStatus = "";
  formTakeDeliveryGoodsModal.TakeVipNameDesc = "";
  formTakeDeliveryGoodsModal.PrebookDate = "";
  formTakeDeliveryGoodsModal.PrebookDateDesc = "";
  formTakeDeliveryGoodsModal.TicketTemplateTypeDesc = "";
  formTakeDeliveryGoodsModal.TicketTemplateTypeDesc2 = "";
};
//删除某张待提货的券
const handleDel = (indexPost) => {
  takeTable.value.forEach((row, index) => {
    if (indexPost == index) {
      takeTable.value.splice(index, 1);
    }
  });
};
//判断选择的商品是否大于当前所限制的商品数量
const handleCheckChange = async (val, index) => {
  let IsSelectedIndex = 0;
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].IsSelected = val;
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.forEach((row) => {
    if (row.IsSelected) {
      IsSelectedIndex++;
    }
  });
  if (IsSelectedIndex > formTakeDeliveryGoodsModal.ExchangeGoodsQty) {
    formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].IsSelected = false;
    ElMessage.error("超出可选择数量");
  }
};
//判断选择的商品是否大于当前所限制的商品数量含sku的并且需要加判断
const handleCheckChangeSku = async (val, index) => {
  let IsSelectedIndex = 0;
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].IsSelected = val;
  let ExchangeGoodInfo = formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index];
  if (!val) {
    ExchangeGoodInfo.SelectedSkus = [];
    return;
  }
  formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll.forEach((row) => {
    if (row.IsSelected) {
      IsSelectedIndex++;
    }
  });
  if (IsSelectedIndex > formTakeDeliveryGoodsModal.ExchangeGoodsQty) {
    formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].IsSelected = false;
    ElMessage.error("超出可选择数量");
    return;
  }
  if (formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].GoodsStatus == 0) {
    formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll[index].IsSelected = false;
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
const unitList = ref([]);
const UnitList = async () => {
  let res = await SearchUnites({
    PageStartRow: 0,
    PageRowCount: 100000,
    SearchCondition: {
      unit_type: "33",
    },
    NoPage: true,
  });
  if (res.Code == 200) {
    unitList.value = res.DataMap.Data;
  }
};
UnitList();
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
    ElMessage.warning("请先输入备注");
    return;
  }
  cancelLoading.value = true;
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
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
const handleSend = () => {
  if (orderDataArr.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  sendIds.value = [];
  orderDataArr.value.forEach((row) => {
    sendIds.value.push(row.OrderId);
  });
  sendVisible.value = true;
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
const handleApproveBtn = (val) => {
  textareaApprove.value = "";
  orderIds.value = [];
  orderIds.value.push(val);
  approveVisible.value = true;
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
    query.PageStartRow = 1;
    getData();
  }
};
getData();

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

const saveSku = (SelSkusPost) => {
  let GoodsId = SelSkusPost.GoodsId;
  let ExchangeGoodsIds = formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll;
  //当goodsid相等那么把选中的属性明细，直接赋值
  ExchangeGoodsIds.forEach((row) => {
    if (row.GoodsId == GoodsId) {
      row.SelectedSkus = SelSkusPost.SelSkus;
    }
  });
  skuVisible.value = false;
  openSkuModal.value = false;
};
//关闭弹框
const closeSku = (SelSkusPost) => {
  let GoodsId = SelSkusPost.GoodsId;
  let ExchangeGoodsIds = formTakeDeliveryGoodsModal.ExchangeGoodsIdsAll;
  //当goodsid相等那么把选中的属性明细，直接赋值
  ExchangeGoodsIds.forEach((row) => {
    if (row.GoodsId == GoodsId) {
      row.SelectedSkus = SelSkusPost.SelSkus;
    }
  });
  skuVisible.value = false;
  openSkuModal.value = false;
};
</script>

<style scoped>
::v-deep(.padding_top .el-dialog__body) {
  padding-top: 10px !important;
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

.send-file-home-uploader .el-upload__tip {
}

.lading_tags {
  position: relative;
  height: 34px;
  overflow: hidden;
}

.lading_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #e9eaec;
}

.lading_tags-li.active {
  color: #f56c6c;
  font-weight: 500;
  // margin-top: 1px;
  background-color: #fff;
  border-bottom: 1px solid #fff;
  border-top: 2px solid #f56c6c;
  border-left: 1px solid #e9eaec;
  border-right: 1px solid #e9eaec;
}

.lading_tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.lading_tags-li {
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

.takeModal {
  .el-dialog__body {
    padding-top: 16px;
  }
}
</style>
