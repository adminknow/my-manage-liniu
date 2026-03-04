<template>
  <el-form ref="formRefT" :model="formTwo" :rules="rulesTwo" label-width="160px">
    <el-row>
      <el-col :span="10" v-if="formOne.CouponType == '2' || formOne.CouponType == '1'">
        <el-row>
          <el-col :span="24">
            <el-form-item label="线下兑换,校验商品的库存" label-width="auto">
              <el-radio-group :disabled="Type == 'View'"
                v-model="formTwo.CheckGoodsStockWhenExchangeShop">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="线上兑换,校验商品的库存" label-width="auto">
              <el-radio-group :disabled="Type == 'View'"
                v-model="formTwo.CheckGoodsStockWhenExchangeOnline">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formOne.CouponType == '2'">
            <el-form-item label="多选设置">
              <el-row>
                <el-col :span="7">
                  <el-form-item prop="chooseOne">
                    <el-input :disabled="Type == 'View'" v-model="formTwo.chooseOne" placeholder="从"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <div class="choose-desc">选</div>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item prop="chooseTwo">
                    <el-input :disabled="Type == 'View'" v-model="formTwo.chooseTwo" placeholder="从"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1">
                  <el-button :disabled="Type == 'View'" class="button-op-del" size="small" @click="addGoods">添加兑换商品
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p v-if="formOne.CouponType == '2'" style="margin: 10px 10px 14px 40px;color:#606266;font-size: 14px;">
              拖动兑换商品即可调整顺序</p>
            <draggable @start="onStart" @end="onEnd" v-model="goods" tag="ul" item-key="GoodsId"
              draggable=".inli-batch" class="nav-batch">
              <li class="inli-batch" v-for="(item, index) in goods" :key="index">
                <div>
                  <div class="goods-del" v-if="Type != 'View'" @click="delGoodBtn(index)">
                    <el-icon>
                      <CircleClose />
                    </el-icon>
                  </div>
                  <el-row>
                    <el-col :span="4">
                      <div class="flex-col justify-center items-center goods-detail">
                        <img @click="GoodsDetailClick(item.GoodsId)" :src="item.img
                          ? item.img
                          : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/img-order2.png'
                          " style="width: 60px; height: 60px; cursor: pointer" />
                      </div>
                    </el-col>
                    <el-col :span="11">
                      <div class="flex-col justify-center goods-detail">
                        <div class="goods-detail-title line_ellipsi">
                          <el-select :disabled="Type == 'View'" style="width: 100%" v-model="item.GoodsName"
                            filterable clearable remote reserve-keyword placeholder="输入商品名称添加商品"
                            :remote-method="remoteMethod" @clear="clearGoodsData($event, index)"
                            @change="changeGoodsData($event, index)">
                            <el-option v-for="itemGood in goodsData" :key="itemGood.GoodsTitle" :label="itemGood.GoodsCode + '-' + itemGood.GoodsTitle
                              " :value="itemGood.GoodsId" />
                          </el-select>
                        </div>
                        <div class="goods-detail-subtitle">
                          {{ item.subtitle }}
                        </div>
                        <div class="goods-detail-price">
                          ¥<text class="goods-detail-price1">{{
                            (item.price / 100).toFixed(2)
                          }}</text> <span style="padding-left: 4px;" :style="{color: item.GoodsStatusDesc=='停用' ? '#ff8686' : ''}">{{ item.GoodsStatusDesc }}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6" :offset="1">
                      <div class="flex-col justify-center items-center goods-detail">
                        <div class="goode-number flex-row items-center justify-center">
                          <div class="goode-number-add" v-if="Type != 'View'" @click="addNumberBtn(index)">
                            +
                          </div>
                          <div class="goode-number-value">
                            {{ item.number }}
                          </div>
                          <div class="goode-number-reduce" v-if="Type != 'View'" @click="reduceNumberBtn(index)">
                            -
                          </div>
                        </div>
                        <div style="
                              position: absolute;
                              top: 80px;
                              font-size: 12px;
                              color: #afafaf;
                            ">
                          兑换数量
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </li>
            </draggable>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10" v-if="formOne.CouponType == '3'">
        <el-row>
          <el-col :span="24">
            <el-form-item label="兑换的卡券设置">
              <el-button v-if="!isDisabled" class="button-op-del" style="margin-bottom: 0" size="small"
                @click="addTickets">添加卡券</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <ul class="nav-batch">
              <li v-for="(item, index) in packageDetails" :key="index">
                <div class="inli-batch">
                  <div class="goods-del" v-if="index > 0 && !isDisabled" @click="delTicketBtn(index)">
                    <el-icon>
                      <CircleClose />
                    </el-icon>
                  </div>
                  <el-row>
                    <el-col :span="4">
                      <div class="flex-col justify-center items-center goods-detail" style="height: 100px">
                        <img :src="item.ListImg
                          ? item.ListImg
                          : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png'
                          " style="width: 60px; height: 60px" />
                      </div>
                    </el-col>
                    <el-col :span="13">
                      <div class="flex-col justify-center goods-detail" style="height: 100px">
                        <div class="goods-detail-title line_ellipsi">
                          <el-select style="width: 100%" :disabled="isDisabled" v-model="item.TicketTemplateTitle"
                            filterable remote reserve-keyword placeholder="输入券批次号/券名称"
                            :remote-method="remoteMethodTicket" :loading="loading"
                            @clear="clearTicketsData($event, index)" @change="changeTicketsData($event, index)">
                            <el-option v-for="itemTicket in ticketsData" :key="itemTicket.TicketTemplateId" :label="itemTicket.TicketTemplateCode +
                              '-'
                              +
                              itemTicket.TicketTemplateTitle
                              " :value="itemTicket.TicketTemplateId" />
                          </el-select>
                        </div>
                        <div style="
                              position: absolute;
                              top: 68px;
                              font-size: 12px;
                              color: #afafaf;
                            " class="goods-detail-subtitle" v-if="item.Code">
                          券批次号：{{ item.Code }}
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6" :offset="1">
                      <div class="flex-col justify-center items-center goods-detail" style="height: 100px">
                        <div class="goode-number flex-row items-center justify-center">
                          <div class="goode-number-add" @click="addTicketNumberBtn(index)">
                            +
                          </div>
                          <div class="goode-number-value">{{ item.Qty }}</div>
                          <div class="goode-number-reduce" @click="reduceTicketNumberBtn(index)">
                            -
                          </div>
                        </div>
                        <div style="
                              position: absolute;
                              top: 70px;
                              font-size: 12px;
                              color: #afafaf;
                            ">
                          兑换数量
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.TicketTemplateId">
                    <el-col :span="14" :offset="1">
                      <el-form-item label="有效期类型" label-width="100px">
                        <el-select :disabled="isDisabled" v-model="item.ValidDateConfigDesc.Type"
                          placeholder="请选择有效期类型" style="width: 100%">
                          <el-option label="固定时间段" value="0"></el-option>
                          <el-option label="从领取时间开始" value="1"></el-option>
                          <el-option label="从固定时间开始" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.TicketTemplateId">
                    <el-col :span="10" :offset="1" v-if="
                      item.TicketTemplateId &&
                      item.ValidDateConfigDesc.Type == 0
                    ">
                      <el-form-item label="" label-width="0">
                        <el-date-picker :disabled="isDisabled" v-model="item.ValidDateConfigDesc.FixedBeginTime"
                          type="datetime" placeholder="开始时间" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="1" v-if="
                      item.TicketTemplateId &&
                      item.ValidDateConfigDesc.Type == 0
                    ">
                      <el-form-item label="" label-width="0">
                        <el-date-picker :disabled="isDisabled" :default-time="defaultDate2"
                          v-model="item.ValidDateConfigDesc.FixedEndTime" type="datetime" placeholder="结束时间" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.TicketTemplateId">
                    <el-col :span="20" :offset="1" v-if="
                      item.TicketTemplateId &&
                      item.ValidDateConfigDesc.Type == 2
                    ">
                      <el-form-item label="从固定时间" label-width="100px">
                        <el-date-picker :disabled="isDisabled" v-model="item.ValidDateConfigDesc.FixedBeginTime"
                          type="datetime" placeholder="开始时间" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="
                    item.TicketTemplateId &&
                    (item.ValidDateConfigDesc.Type == 1 ||
                      item.ValidDateConfigDesc.Type == 2)
                  ">
                    <el-col :span="20" :offset="1">
                      <el-form-item label="每隔">
                        <div style="float: left">
                          <el-input style="width: 20%" :disabled="isDisabled" type="text" placeholder="多少"
                            v-model="item.ValidDateConfigDesc.Interval">
                          </el-input>
                          <el-select :disabled="isDisabled" v-model="item.ValidDateConfigDesc.IntervalUnit"
                            placeholder="请选择间隔单位" style="width: 30%">
                            <el-option label="天" value="10"></el-option>
                            <el-option label="周" value="11"></el-option>
                            <el-option label="月" value="12"></el-option>
                            <el-option label="季度" value="13"></el-option>
                            <el-option label="年" value="14"></el-option>
                          </el-select>
                          <label style="width: 30px; padding-right: 0 !important"
                            class="el-form-item__label">开始</label>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.TicketTemplateId">
                    <el-col :span="14" :offset="1">
                      <el-form-item label="兑换期类型" label-width="100px">
                        <el-select :disabled="isDisabled" v-model="item.ExchangeDateConfigDesc.Type"
                          placeholder="请选择兑换期类型" style="width: 100%">
                          <el-option label="固定时间段" value="0"></el-option>
                          <el-option label="等同于有效期" value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="
                    item.TicketTemplateId &&
                    item.ExchangeDateConfigDesc.Type == 0
                  ">
                    <el-col :span="20" :offset="1">
                      <el-form-item label="" label-width="0">
                        <el-date-picker :clearable="false" :disabled="isDisabled" :default-time="defaultTime2"
                          v-model="item.ExchangeDateConfigDesc.time" type="datetimerange" range-separator="To"
                          start-placeholder="开始时间" end-placeholder="结束时间" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10" v-if="
        formOne.CouponType == '4' ||
        formOne.CouponType == '5' ||
        formOne.CouponType == '6' ||
        formOne.CouponType == '7'
      ">
        <el-row v-if="formOne.CouponType == '5'">
          <el-col :span="19">
            <el-form-item label="订单总金额">
              <el-radio-group style="width: 40%" :disabled="Type == 'View'"
                v-model="formTwo.FullAmountTypeOfCashTicket">
                <el-radio label="0">满</el-radio>
                <el-radio label="1">每满</el-radio>
              </el-radio-group>
              <el-input style="width: 60%" :disabled="Type == 'View'" clearable v-model="formTwo.UsePayThreshold"
                placeholder="">
                <template #append>元使用</template></el-input>
              <span style="font-size: 12px; color: #f56c6c">0表示无门槛</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formOne.CouponType == '5'">
          <el-col :span="19">
            <el-form-item label="使用方式">
              <el-radio-group :disabled="Type == 'View'" v-model="formTwo.CanUseMultiInOneOrderOfCashTicket">
                <el-radio label="0">一张订单限制只能使用一张</el-radio>
                <el-radio label="1">不限制</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="19">
            <el-form-item label="使用规则">
              <el-radio-group :disabled="Type == 'View'" v-model="formTwo.EveryGoodsCanSubOfCashTicket">
                <el-radio label="0">只能一件商品使用</el-radio>
                <el-radio label="1">不限制商品件数</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="可使用商品">
              <el-radio-group :disabled="Type == 'View'" v-model="formTwo.UseGoodsScopeType">
                <el-radio :label="0">所有商品</el-radio>
                <el-radio :label="1">指定商品</el-radio>
                <el-radio :label="2">指定供应商</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formTwo.UseGoodsScopeType == 1">
            <div class="goods-modal-add">
              <el-button :disabled="Type == 'View'" class="button-op-del" size="small" @click="addUseGoods">添加可使用商品
              </el-button>
            </div>
          </el-col>
          <el-col :span="6" v-if="formTwo.UseGoodsScopeType == 2">
            <div class="goods-modal-add">
              <el-button :disabled="Type == 'View'" class="button-op-del" size="small" @click="addUseSupplier">添加供应商
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="formTwo.UseGoodsScopeType == 1">
          <el-col :span="24">
            <el-table height="500" :data="formTwo.tableData.slice(
              (formTwo.PageStartRow - 1) * formTwo.PageRowCount,
              formTwo.PageStartRow * formTwo.PageRowCount
            )
              " border class="table" v-loading="formTwo.tableLoading" :header-cell-style="{ 'text-align': 'center' }"
              header-cell-class-name="table-header" style="width: 100%">
              <el-table-column prop="" align="center" label="券商" width="180">
                <template #default="scope">
                  <p>{{ scope.row.CreateUnitName }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="GoodsCode" align="center" label="编码">
              </el-table-column>
              <el-table-column prop="GoodsTitle" align="center" label="名称"></el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template #default="scope">
                  <div class="button-mgl">
                    <el-button class="button-op-del" size="small" @click="handleGoodsDel(scope.row.GoodsId)">
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background layout="->,total, sizes, prev, pager, next"
                v-model:currentPage="formTwo.PageStartRow" v-model:page-size="formTwo.PageRowCount"
                :page-sizes="[15, 50, 100]" :total="formTwo.tableData.length" @current-change="handlePageChange"
                @size-change="handleSizeChange"></el-pagination>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="formTwo.UseGoodsScopeType == 2">
          <el-col :span="24">
            <el-table height="500" :data="formTwo.unitIdTableData.slice(
              (formTwo.unitIdPageStartRow - 1) * formTwo.unitIdPageRowCount,
              formTwo.unitIdPageStartRow * formTwo.unitIdPageRowCount
            )
              " border class="table" v-loading="formTwo.tableLoading" :header-cell-style="{ 'text-align': 'center' }"
              header-cell-class-name="table-header" style="width: 100%">
              <el-table-column prop="UnitCode" align="center" label="编码">
              </el-table-column>
              <el-table-column prop="UnitName" align="center" label="名称"></el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template #default="scope">
                  <div class="button-mgl">
                    <el-button class="button-op-del" size="small" @click="handleUnitsDel(scope.row.UnitId)">
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background layout="->,total" :total="formTwo.unitIdTableData.length"></el-pagination>
            </div>
          </el-col>
          <div style="width:100%;height: 10px;"></div>
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="GoodsDetail" label="卡券说明">
              <tinymceEditor ref="editor" :value="formTwo.ExchangeRemark" @tinymceinput="getTinymceInput">
              </tinymceEditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-button class="button2" round @click="onBackOne">&nbsp;&nbsp;上一步&nbsp;&nbsp;</el-button>
        <el-button class="button1" v-if="Type != 'View'" :loading="onSubmitTwoLoading" round @click="onSubmitTwo">
          &nbsp;&nbsp;提&nbsp;&nbsp;交&nbsp;&nbsp;</el-button>
      </el-col>
    </el-row>
  </el-form>

  <!-- 可销售商品列表 -->
  <goods-modal :GoodsVisible="ComponentsGoodVisible" :list="{ data: formTwo.tableData }" @CloseVisible="CloseVisible"
    @ConFirm="SaveTable"></goods-modal>

  <!-- 添加供应商 -->
  <add-supplier :visible="addSupplierVisible" :selItemsOld="formTwo.unitIdTableData" @closeVisible="closeAddSupplierVisible"
    @conFirm="saveUnitList"></add-supplier>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, toRefs, watch } from 'vue';
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { ElMessage } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';
import tinymceEditor from "@/components/common/tinymce.vue";
import GoodsModal from "@/components/Modal/GoodsModal.vue";
import addSupplier from "@/components/ticket/addSupplier.vue";
import { SearchGoodses, GetGoods } from "@/api/goods.js";
import { GetTicketTemplateList, GetTicketTemplateById } from "@/api/ticket.js";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";

// 定义组件属性
const props = defineProps({
  formOne: {
    type: Object,
    default: () => ({})
  },
  formTwo: {
    type: Object,
    default: () => ({
      CheckGoodsStockWhenExchangeShop: '0',
      CheckGoodsStockWhenExchangeOnline: '0',
      chooseOne: '2',
      chooseTwo: '1',
      ExchangeRemark: '',
      UsePayThreshold: '',
      UseGoodsScopeType: 0,
      tableData: [],
      tableLoading: false,
      PageStartRow: 1,
      PageRowCount: 15,
      CanUseMultiInOneOrderOfCashTicket: '0',
      EveryGoodsCanSubOfCashTicket: '0',
      FullAmountTypeOfCashTicket: '0',
      unitIdTableData: [],
      unitIdPageStartRow: 1,
      unitIdPageRowCount: 15,
      CanUseTicketBrokerUnitIds: ''
    })
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  Type: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  onSubmitTwoLoading: {
    type: Boolean,
    default: false
  },
  goods: {
    type: Array,
    default: () => []
  },
  packageDetails: {
    type: Array,
    default: () => []
  }
});

// 定义组件事件
const emit = defineEmits([
  'back-one',
  'submit-two',
  'save-table',
  'close-visible',
  'save-unit-list',
  'close-add-supplier',
  'update:goods',
  'update:packageDetails'
]);

// 路由
const router = useRouter();

// 表单引用
const formRefT = ref(null);

// 响应式数据
const loading = ref(false);
const goodsData = ref([]);
const ticketsData = ref([]);
const ComponentsGoodVisible = ref(false);
const addSupplierVisible = ref(false);

// 使用toRefs创建响应式引用
const { formTwo, goods, packageDetails } = toRefs(props);

// 监听formData变化，初始化商品数据
watch(() => props.formData, async (newFormData) => {
  if (newFormData) {
    // 首先检查formData是否直接包含ExchangeGoodses数据
    if (newFormData.ExchangeGoodses && newFormData.ExchangeGoodses.length > 0) {
      // 直接使用formData中的ExchangeGoodses数据
      const newGoods = [];
      for (const item of newFormData.ExchangeGoodses) {
        newGoods.push({
          title: item.GoodsCode + "-" + item.GoodsTitle,
          subtitle: item.GoodsSubTitle || "",
          price: item.OrgPrice || item.GoodsOrgPrice || "",
          img: item.ListImg || item.GoodsListImg || "",
          GoodsId: item.GoodsId,
          GoodsName: item.GoodsCode + "-" + item.GoodsTitle,
          number: item.ExchangeCount || item.Qty || "1",
          GoodsStatusDesc: item.GoodsStatus === 1 ? '正常' : '停用',
        });
      }
      emit('update:goods', newGoods);
    } else if (newFormData.TicketTemplateId) {
      // 如果formData中没有ExchangeGoodses，但有TicketTemplateId，则从API获取
      try {
        loading.value = true;
        const res = await GetTicketTemplateById({
          TicketTemplateId: newFormData.TicketTemplateId,
        });
        loading.value = false;
        if (res.Code === 200 && res.DataMap && res.DataMap.ExchangeGoodses) {
          // 处理ExchangeGoodses数据
          const exchangeGoodses = res.DataMap.ExchangeGoodses;
          if (exchangeGoodses.length > 0) {
            // 清空现有商品数组
            const newGoods = [];
            // 遍历ExchangeGoodses，添加到goods数组
            for (const item of exchangeGoodses) {
              newGoods.push({
                title: item.GoodsCode + "-" + item.GoodsTitle,
                subtitle: item.GoodsSubTitle || "",
                price: item.OrgPrice || item.GoodsOrgPrice || "",
                img: item.ListImg || item.GoodsListImg || "",
                GoodsId: item.GoodsId,
                GoodsName: item.GoodsCode + "-" + item.GoodsTitle,
                number: item.ExchangeCount || item.Qty || "1",
                GoodsStatusDesc: item.GoodsStatus === 1 ? '正常' : '停用',
              });
            }
            emit('update:goods', newGoods);
          }
        }
      } catch (error) {
        loading.value = false;
        console.error('Error loading ticket template:', error);
      }
    }
  }
}, { immediate: true });

// 表单验证规则
const rulesTwo = {
  chooseOne: [{ required: true, message: "输入多选设置", trigger: "blur" }],
  chooseTwo: [{ required: true, message: "输入多选设置", trigger: "blur" }],
  ExchangeRemark: [
    { required: true, message: "输入卡券说明", trigger: "blur" },
  ],
  UsePayThreshold: [
    { required: true, message: "输入可使用的支付门槛", trigger: "blur" },
  ],
};

// 日期默认值
const defaultTime2 = [
  new Date(2023, 1, 1, 0, 0, 0),
  new Date(2023, 2, 1, 23, 59, 59),
];
const defaultDate2 = [new Date(2023, 2, 1, 23, 59, 59)];

// 方法
const onBackOne = () => {
  emit('onBackOne');
};

const onSubmitTwo = () => {
  formRefT.value.validate((valid) => {
    if (valid) {
      emit('submit-two', formTwo, goods, packageDetails);
    }
  });
};

const getTinymceInput = (val) => {
  formTwo.value.ExchangeRemark = val;
};

const handlePageChange = (val) => {
  formTwo.value.PageStartRow = val;
};

const handleSizeChange = (val) => {
  formTwo.value.PageRowCount = val;
};

const SaveTable = (selListData) => {
  formTwo.value.tableData = selListData;
  ComponentsGoodVisible.value = false;
  emit('save-table', selListData);
};

const CloseVisible = () => {
  ComponentsGoodVisible.value = false;
  emit('close-visible');
};

const addUseSupplier = () => {
  addSupplierVisible.value = true;
};

const saveUnitList = (val) => {
  formTwo.value.unitIdTableData = val;
  addSupplierVisible.value = false;
  emit('save-unit-list', val);
};

const closeAddSupplierVisible = () => {
  addSupplierVisible.value = false;
  emit('close-add-supplier');
};

const addUseGoods = () => {
  ComponentsGoodVisible.value = true;
};

const handleGoodsDel = (ID) => {
  for (let i = 0; i < formTwo.value.tableData.length; i++) {
    if (ID == formTwo.value.tableData[i].GoodsId) {
      formTwo.value.tableData.splice(i, 1);
      break;
    }
  }
};

const handleUnitsDel = (ID) => {
  for (let i = 0; i < formTwo.value.unitIdTableData.length; i++) {
    if (ID == formTwo.value.unitIdTableData[i].UnitId) {
      formTwo.value.unitIdTableData.splice(i, 1);
      break;
    }
  }
};

const remoteMethod = async (query) => {
  if (query) {
    loading.value = true;
    let res = await SearchGoodses({
      PageStartRow: 0,
      PageRowCount: 100000,
      NoPage: true,
      SearchCondition: {
        search_keyword: query,
        goods_status: "1",
      },
    });
    loading.value = false;
    if (res.Code === 200) {
      if (res.DataMap.ToalCount == 0) {
        goodsData.value = [];
      } else {
        goodsData.value = res.DataMap.Data;
      }
    }
  } else {
    goodsData.value = [];
  }
};

const remoteMethodTicket = async (query) => {
  if (query) {
    loading.value = true;
    let res = await GetTicketTemplateList({
      SearchCondition: {
        display_status: "1",
        search_keyword: query,
        ticket_template_type: 0,
      },
    });
    loading.value = false;
    if (res.Code === 200) {
      ticketsData.value = res.DataMap;
    }
  } else {
    ticketsData.value = [];
  }
};

const clearGoodsData = async (value, dataIndex) => {
  // 删除商品
  const newGoods = [...goods.value];
  if (newGoods[dataIndex]) {
    newGoods[dataIndex] = {
      title: "",
      subtitle: "",
      price: "",
      img: "",
      GoodsId: "",
      GoodsName: "",
      number: "1",
      GoodsStatusDesc: "",
    };
  }
  emit('update:goods', newGoods);
};

const clearTicketsData = async (value, dataIndex) => {
  // 删除卡券
  const newPackageDetails = [...packageDetails.value];
  if (newPackageDetails[dataIndex]) {
    newPackageDetails[dataIndex] = {
      ListImg: "",
      TicketTemplateCode: "",
      PackageTicketTemplateId: "", // 券包的券模板ID
      TicketTemplateTitle: "",
      TicketTemplateId: "", // 券包下的券模板ID
      Qty: "", // 券包下的券模板的数量
      ValidDateConfig: "", // 券包下的券模板的有效期配置
      ValidDateConfigDesc: {
        FixedBeginTime: "", // 固定开始时间,
        FixedEndTime: "", // 固定结束时间
        Type: "0", // 0:固定时间段;1:从领取时间开始,每隔几天/周/月/季度/年开始;2:从固定时间开始,每隔几天/周/月/季度/年开始;
        Interval: "1", // 间隔天/周/月/季度/年
        IntervalUnit: "12", // 间隔单位: 10-天;11-周;12-月;13-季度;14-年;
        time: [],
      },
      ExchangeDateConfig: "", // 券包下的券模板的兑换时间配置
      ExchangeDateConfigDesc: {
        ListImg: "",
        TicketTemplateCode: "",
        time: [],
        FixedBeginTime: "", // 固定开始时间,
        FixedEndTime: "", // 固定结束时间
        Type: "1",
      }, // 券包下的券模板的兑换时间配置
    };
  }
  emit('update:packageDetails', newPackageDetails);
};

const changeGoodsData = async (value, dataIndex) => {
  // 选择商品
  if (value) {
    loading.value = true;
    try {
      let res = await GetGoods({
        ObjectId: value,
      });
      loading.value = false;
      if (res.Code == 200) {
        const newGoods = [...goods.value];
        if (newGoods[dataIndex]) {
          newGoods[dataIndex] = {
            ...newGoods[dataIndex],
            title: res.DataMap.GoodsCode + "-" + res.DataMap.GoodsTitle,
            subtitle: res.DataMap.GoodsSubTitle,
            price: res.DataMap.OrgPrice,
            img: res.DataMap.ListImg,
            GoodsId: res.DataMap.GoodsId,
            GoodsName: res.DataMap.GoodsCode + "-" + res.DataMap.GoodsTitle,
            GoodsStatusDesc: res.DataMap.GoodsStatus == 1 ? '正常' : '停用',
            number: newGoods[dataIndex].number || "1"
          };
        }
        emit('update:goods', newGoods);
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('网络错误，请稍后重试');
      console.error('Error fetching goods details:', error);
    }
  }
};

const GoodsDetailClick = (ID) => {
  common.ClosePageTag("商品详情");
  router.push({
    path: "/commodity_info",
    query: {
      ID: ID,
      PageType: "Ticket",
    },
  });
};

const changeTicketsData = async (value, dataIndex) => {
  // 选择商品
  if (value) {
    loading.value = true;
    let res = await GetTicketTemplateById({
      TicketTemplateId: value,
      ReturnStatData: false,
    });
    loading.value = false;
    if (res.Code == 200) {
      const newPackageDetails = [...packageDetails.value];
      if (newPackageDetails[dataIndex]) {
        newPackageDetails[dataIndex] = {
          ...newPackageDetails[dataIndex],
          ListImg: res.DataMap.ListImg,
          TicketTemplateId: res.DataMap.TicketTemplateId,
          TicketTemplateCode: res.DataMap.TicketTemplateCode,
          TicketTemplateTitle: res.DataMap.TicketTemplateCode + "-" + res.DataMap.TicketTemplateTitle,
          Qty: "1",
        };
      }
      emit('update:packageDetails', newPackageDetails);
    }
  }
};

const delGoodBtn = async (idx) => {
  const newGoods = [...goods.value];
  newGoods.splice(idx, 1);
  emit('update:goods', newGoods);
};

const delTicketBtn = async (idx) => {
  const newPackageDetails = [...packageDetails.value];
  newPackageDetails.splice(idx, 1);
  emit('update:packageDetails', newPackageDetails);
};

const addNumberBtn = async (dataIndex) => {
  const newGoods = [...goods.value];
  if (newGoods[dataIndex] && newGoods[dataIndex].GoodsId) {
    newGoods[dataIndex].number = String(Number(newGoods[dataIndex].number) + 1);
    emit('update:goods', newGoods);
  }
};

const reduceNumberBtn = async (dataIndex) => {
  const newGoods = [...goods.value];
  if (newGoods[dataIndex] && newGoods[dataIndex].GoodsId) {
    newGoods[dataIndex].number = String(Math.max(1, Number(newGoods[dataIndex].number) - 1));
    emit('update:goods', newGoods);
  }
};

const addTicketNumberBtn = async (dataIndex) => {
  const newPackageDetails = [...packageDetails.value];
  if (newPackageDetails[dataIndex] && newPackageDetails[dataIndex].TicketTemplateId) {
    newPackageDetails[dataIndex].Qty = String(Number(newPackageDetails[dataIndex].Qty) + 1);
    emit('update:packageDetails', newPackageDetails);
  }
};

const reduceTicketNumberBtn = async (dataIndex) => {
  const newPackageDetails = [...packageDetails.value];
  if (newPackageDetails[dataIndex] && newPackageDetails[dataIndex].TicketTemplateId) {
    newPackageDetails[dataIndex].Qty = String(Math.max(1, Number(newPackageDetails[dataIndex].Qty) - 1));
    emit('update:packageDetails', newPackageDetails);
  }
};

const addGoods = async () => {
  const newGoods = [...goods.value];
  newGoods.push({
    title: "",
    subtitle: "",
    price: "",
    img: "",
    GoodsId: "",
    GoodsName: "",
    number: "1",
    GoodsStatusDesc: "",
  });
  emit('update:goods', newGoods);
};

const addTickets = async (value) => {
  const newPackageDetails = [...packageDetails.value];
  newPackageDetails.push({
    ListImg: "",
    TicketTemplateCode: "",
    TicketTemplateTitle: "",
    PackageTicketTemplateId: "", // 券包的券模板ID
    TicketTemplateId: "", // 券包下的券模板ID
    Qty: "1", // 券包下的券模板的数量
    ValidDateConfig: "", // 券包下的券模板的有效期配置
    ValidDateConfigDesc: {
      FixedBeginTime: "", // 固定开始时间,
      FixedEndTime: "", // 固定结束时间
      Type: "0", // 0:固定时间段;1:从领取时间开始,每隔几天/周/月/季度/年开始;2:从固定时间开始,每隔几天/周/月/季度/年开始;
      Interval: "1", // 间隔天/周/月/季度/年
      IntervalUnit: "12", // 间隔单位: 10-天;11-周;12-月;13-季度;14-年;
      time: [],
    },
    ExchangeDateConfig: "", // 券包下的券模板的兑换时间配置
    ExchangeDateConfigDesc: {
      TicketTemplateTitle: "",
      ListImg: "",
      TicketTemplateCode: "",
      time: [],
      FixedBeginTime: "", // 固定开始时间,
      FixedEndTime: "", // 固定结束时间
      Type: "1", // 0:固定时间段;1:等同于有效期;(选择0的时候需要选择固定开始和结束时间，选择1的时候则默认取有效期)
    }, // 券包下的券模板的兑换时间配置
  });
  emit('update:packageDetails', newPackageDetails);
};

const onStart = () => { };

const onEnd = () => {
  console.log("拖拽结束，最新顺序：", goods.value);
  emit('update:goods', [...goods.value]);
};

// 暴露validate方法给父组件
const validate = (callback) => {
  formRefT.value.validate(callback);
};

defineExpose({
  validate
});
</script>

<style scoped>
.goods-modal-add {
  position: relative;
  top: 4px;
}

.choose-desc {
  text-align: center;
  width: 100%;
  color: #fff;
  background-color: #f56c6c;
}

.nav-batch {
  list-style-type: none;
  margin-top: 10px;
}

.nav-batch .el-form-item {
  margin-bottom: 6px;
}

.inli-batch {
  position: relative;
  margin: 10px 10px 14px 40px;
  border-radius: 2px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
}

.goods-detail {
  height: 124px;
  position: relative;
}

.goods-detail-title {
  color: #252525;
  font-size: 16px;
}

.goods-detail-subtitle {
  color: #757575;
  font-size: 12px;
  margin-top: 2px;
}

.goods-detail-price {
  font-size: 14px;
  margin-top: 2px;
}

.goods-detail-price1 {
  font-size: 16px;
}

.goode-number {
  border: solid 1px #f56c6c;
  border-radius: 20px;
  width: 90px;
  height: 27px;
  font-size: 16px;
  text-align: center;
}

.goode-number .goode-number-add {
  width: 40px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #f56c6c;
  cursor: pointer;
}

.goode-number .goode-number-value {
  width: 38px;
  height: 28px;
  line-height: 28px;
  background-color: #f56c6c;
  font-size: 14px;
  color: #fff;
}

.goode-number .goode-number-reduce {
  width: 40px;
  height: 30px;
  line-height: 28px;
  font-size: 22px;
  color: #6d6d6d;
  cursor: pointer;
}

.goods-del {
  position: absolute;
  right: 16px;
  top: 8px;
  font-size: 14px;
  color: #f56c6c;
  cursor: pointer;
  z-index: 9;
}

.button1 {
  background-color: #f56c6c;
  color: white;
  margin-left: 20px;
}

.button2 {
  border-color: #f56c6c;
  color: #f56c6c;
}

.button-op-del {
  background-color: #f56c6c;
  color: white;
}

.pagination {
  margin-top: 10px;
  text-align: right;
}

.line_ellipsi {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}
</style>