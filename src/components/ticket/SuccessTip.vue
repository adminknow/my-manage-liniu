<template>
  <el-row>
    <el-col :span="24">
      <div class="success-tip">
        <img src="/src/assets/imgs/success_tip.png" style="width: 180px; height: 180px" />
        <div class="success-desc">
          <el-row>
            <el-col :span="6" :offset="4">
              <p>
                品牌：<text style="color: #f56c6c">{{
                  ticketTemplateInfo.BrandName
                }}</text>
              </p>
              <p>
                名称：<text style="color: #f56c6c">{{
                  ticketTemplateInfo.TicketTemplateTitle
                }}</text>
              </p>
              <p v-if="ticketTemplateInfo.TicketTemplateType == 4">
                折扣：<text style="color: #f56c6c">{{
                  ticketTemplateInfo.TicketTemplateConfigDesc.Discount
                }}%</text>
              </p>
              <p v-else>
                面值：<text style="color: #f56c6c">{{
                  (ticketTemplateInfo.OrgPrice / 100).toFixed(2)
                }}</text>
              </p>
              <p>有效期：{{ ticketTemplateInfo.ValidDateDesc2 }}</p>
              <p>配送期：{{ ticketTemplateInfo.ExchangeDateDesc2 }}</p>
              <p v-if="ticketTemplateInfo.TicketTemplateType == 0">
                配送范围：{{
                  ticketTemplateInfo.ExpressTemplate.TemplateName
                }}
              </p>
              <div v-if="ticketTemplateInfo.TicketTemplateType == 0">
                <p v-if="ticketTemplateInfo.GoodsQty > 1">
                  卡券类型：<text style="color: #f56c6c">多选卡</text>
                </p>
                <p v-else>
                  卡券类型：<text style="color: #f56c6c">单选卡</text>
                </p>
              </div>
              <div v-else-if="ticketTemplateInfo.TicketTemplateType == 10">
                <p>卡券类型：<text style="color: #f56c6c">券包</text></p>
              </div>
              <div v-else-if="ticketTemplateInfo.TicketTemplateType == 5">
                <p>卡券类型：<text style="color: #f56c6c">现金券</text></p>
              </div>
              <div v-else-if="ticketTemplateInfo.TicketTemplateType == 6">
                <p>卡券类型：<text style="color: #f56c6c">储值卡</text></p>
              </div>
              <div v-else-if="ticketTemplateInfo.TicketTemplateType == 7">
                <p>卡券类型：<text style="color: #f56c6c">企业点卡</text></p>
              </div>
            </el-col>
            <el-col :span="6" :offset="4">
              <div v-if="
                ticketTemplateInfo.GoodsQty > 1 &&
                ticketTemplateInfo.TicketTemplateType == 0
              ">
                <p style="height: 22px">多选商品</p>
                <ul class="nav-batch">
                  <li v-for="(
  item, index
                      ) in ticketTemplateInfo.ExchangeGoodses" :key="index">
                    <div class="inli-batch" style="margin-left: 0">
                      <el-row>
                        <el-col :span="8">
                          <div class="flex-col justify-center items-center goods-detail" style="height: 90px">
                            <img :src="item.GoodsListImg" style="width: 60px; height: 60px" />
                          </div>
                        </el-col>
                        <el-col :span="10">
                          <div class="flex-col justify-center goods-detail" style="height: 90px">
                            <div class="goods-detail-title">
                              {{ item.GoodsTitle + "* " + item.Qty }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-if="ticketTemplateInfo.TicketTemplateType == 10">
                <p style="height: 22px">兑换的卡券</p>
                <ul class="nav-batch">
                  <li v-for="(item, index) in ticketTemplateInfo.PackageDetails" :key="index">
                    <div class="inli-batch" style="margin-left: 0">
                      <el-row>
                        <el-col :span="8">
                          <div class="flex-col justify-center items-center goods-detail" style="height: 90px">
                            <img :src="item.TicketTemplate.ListImg" style="width: 60px; height: 60px" />
                          </div>
                        </el-col>
                        <el-col :span="14">
                          <div class="flex-col justify-center goods-detail" style="height: 90px">
                            <div class="goods-detail-title">
                              {{ item.TicketTemplate.Code + "-" + item.TicketTemplate.Title }}
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="flex-col justify-center goods-detail" style="height: 90px">
                            <div class="goods-detail-title">
                              ×{{ item.Qty }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row>
        <el-col :span="12" :offset="6" style="text-align: center">
          <el-button class="button2" round @click="onBackList">&nbsp;&nbsp;返回列表&nbsp;&nbsp;</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件属性
const props = defineProps({
  ticketTemplateInfo: {
    type: Object,
    default: () => ({})
  }
});

// 定义组件事件
const emit = defineEmits(['back-list']);

// 方法
const onBackList = () => {
  emit('back-list');
};
</script>

<style scoped>
.success-tip {
  margin: 0 12px;
  text-align: center;
  padding-bottom: 12px;
  position: relative;
  top: -46px;
}

.success-desc {
  top: 0;
  text-align: left;
  position: relative;
  width: 100%;
}

.success-desc p {
  height: 46px;
  color: #818181;
}

.nav-batch {
  list-style-type: none;
  margin-top: 10px;
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

.button2 {
  border-color: #f56c6c;
  color: #f56c6c;
}
</style>