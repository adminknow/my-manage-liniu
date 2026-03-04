<template>
  <div class="container form_bm">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.ticket_code" clearable placeholder="请输入券码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div style="
                padding-left: 10px;
                font-size: 14px;
                color: red;
                position: relative;
                top: 6px;
              ">
              请先输入券码，再点击查询
            </div>
          </el-col>
          <el-col :span="1" :offset="1"> </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="IsRight" class="button2 button-float" round @click="CancelTicket()">取消添加卡券
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
    <el-form v-if="isShowData" ref="formRef" :model="form" label-width="120px">
      <el-row style="margin-top: 10px">
        <el-col class="send-local" :span="12">基本信息</el-col>
        <el-col class="send-local" :span="12">操作日志</el-col>
      </el-row>
      <el-row style="margin-top: 30px; padding-bottom: 100px">
        <el-col :span="12">
          <el-row>
            <el-col :span="12" style="text-align: center">
              <img :src="form.ListImg" style="width: 160px; height: 160px" />
            </el-col>
            <el-col :span="12">
              <el-form-item label="券批次号">
                <p>{{ form.TicketTemplateCode }}</p>
              </el-form-item>
              <el-form-item label="类型" prop="CouponType">
                <div>{{ form.TicketTemplateTypeDesc2 }}</div>
              </el-form-item>
              <el-form-item label="品牌">
                <p>{{ form.BrandIdDesc }}</p>
              </el-form-item>
              <el-form-item label="创建单位">
                <p>{{ form.CreateUnitName }}</p>
              </el-form-item>
              <el-form-item label="所属单位">
                <p>{{ form.CurrentUnitName }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="券名称">
                <p>{{ form.TicketTemplateTitle }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="有效日期">
                <p>{{ form.time1 }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="配送日期">
                <p>{{ form.time2 }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="form.TicketTemplateType == 0">
              <el-form-item label="配送范围">
                <p>{{ form.ExpressTemplateIdDesc }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="券面值">
                <p>{{ form.OrgPrice.toFixed(2) }}元</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="状态">
                <p>{{ form.TicketStatusDesc }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="挂起">
                <p v-if="form.IsSuspendDesc == '是'" style="color: red">
                  {{ form.IsSuspendDesc }}
                </p>
                <p v-if="form.IsSuspendDesc == '否'">
                  {{ form.IsSuspendDesc }}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.ExchangeGoodses.length > 0">
            <el-row>
              <el-col :span="24">
                <el-form-item label="可兑换商品">
                  <ul id="nav-batch">
                    <li v-for="(item, index) in form.ExchangeGoodses" :key="index">
                      <div class="inli-batch" style="margin-left: 0">
                        <el-row>
                          <el-col :span="8">
                            <div class="flex-col justify-center items-center goods-detail" style="height: 100px">
                              <img :src="item.GoodsListImg" style="width: 70px; height: 70px" />
                            </div>
                          </el-col>
                          <el-col :span="15">
                            <div class="flex-col justify-center goods-detail" style="height: 100px; font-size: 16px">
                              <div>
                                {{
                                  item.GoodsCode +
                                  "-" +
                                  item.GoodsTitle +
                                  " * " +
                                  item.Qty
                                }}

                              </div>
                              <div>
                                ¥<span>{{
                                  (item.GoodsOrgPrice / 100).toFixed(2)
                                }}</span>
                                <span style="position: relative;left: 12px;"
                                  :style="{ color: item.GoodsStatus == '1' ? '' : '#ff8686' }">{{ item.GoodsStatus == 1
                                    ?
                                    '正常' : '停用' }}</span>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </li>
                  </ul>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row v-if="form.SaleBillCode">
            <el-col :span="12">
              <el-form-item label="销售单号">
                <p>{{ form.SaleBillCode }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售时间">
                <p>{{ form.SaleTime }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.TakeVipName">
            <el-col :span="12">
              <el-form-item label="领取人姓名">
                <p>{{ form.TakeVipName }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领取人手机">
                <p>{{ form.TakeVipCell }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.DeliverOrderCode">
            <el-col :span="12">
              <el-form-item label="配送单号">
                <p>{{ form.DeliverOrderCode }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="兑换时间">
                <p>{{ form.DeliverOrderTime }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.PayOrderCode">
            <el-col :span="12">
              <el-form-item label="后付款单号">
                <p>{{ form.PayOrderCode }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后付款价格">
                <p>{{ form.PayPrice }}元</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.PayOrderCode">
            <el-col :span="24">
              <el-form-item label="支付人">
                <p>{{ form.PayerVipName + " " + form.PayerVipCell }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.PayOrderCode">
            <el-col :span="24">
              <el-form-item label="后付款状态">
                <p>{{ form.PayStatusDesc }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.ExchangedGoodses.length > 0">
            <el-col :span="24">
              <el-form-item label="已兑换商品">
                <ul id="nav-batch">
                  <li v-for="(item, index) in form.ExchangedGoodses" :key="index">
                    <div class="inli-batch" style="margin-left: 0">
                      <el-row>
                        <el-col :span="8">
                          <div class="flex-col justify-center items-center goods-detail" style="height: 100px">
                            <img :src="item.GoodsListImg" style="width: 70px; height: 70px" />
                          </div>
                        </el-col>
                        <el-col :span="10">
                          <div class="flex-col justify-center goods-detail" style="height: 100px; font-size: 16px">
                            <div>
                              {{
                                item.GoodsCode +
                                "-" +
                                item.GoodsTitle +
                                " * " +
                                item.Qty
                              }}
                            </div>
                            <div style="color: #f56c6c">
                              ¥<text>{{
                                (item.GoodsOrgPrice / 100).toFixed(2)
                              }}</text>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </li>
                </ul>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="
            form.TicketTemplate.PackageDetails &&
            form.TicketTemplate.PackageDetails.length > 0
          ">
            <el-col :span="22">
              <el-form-item label="兑换的卡券">
                <ul id="nav-batch">
                  <li v-for="(item, index) in form.TicketTemplate.PackageDetails" :key="index">
                    <div class="inli-batch" style="margin-left: 0">
                      <el-row>
                        <el-col :span="8">
                          <div class="flex-col justify-center items-center goods-detail" style="height: 100px">
                            <img :src="item.TicketTemplate.ListImg" style="width: 70px; height: 70px" />
                          </div>
                        </el-col>
                        <el-col :span="14">
                          <div class="flex-col justify-center goods-detail" style="height: 100px; font-size: 16px">
                            <div>
                              {{
                                item.TicketTemplate.Code +
                                " - " +
                                item.TicketTemplate.Title
                              }}
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="flex-col justify-center goods-detail" style="height: 100px; font-size: 16px">
                            <div style="color: #f56c6c">
                              {{ "×" + item.Qty }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </li>
                </ul>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
            <el-table-column prop="OpTime" label="时间" width="160" align="center"></el-table-column>
            <el-table-column prop="OpChannelTypeDesc" align="center" label="系统渠道"></el-table-column>
            <el-table-column prop="OpType" label="动作" align="center"></el-table-column>
            <el-table-column prop="OpUserName" align="center" label="操作人"></el-table-column>
            <el-table-column prop="OpUnitName" align="center" label="券归属"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total" v-model:currentPage="query.PageStartRow"
              v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
              @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
          </div>
          <el-row style="margin-top: 10px" v-if="
            form.PackageExchangedTicketes &&
            form.PackageExchangedTicketes.length > 0
          ">
            <el-col class="send-local" :span="12">兑换的券码</el-col>
          </el-row>

          <div v-for="(item, index) in form.PackageExchangedTicketes" :key="index"
            style="border: 1px solid #ebeef5; margin-top: 10px">
            <el-row>
              <el-col :span="1">
                <div class="el-form-item__label">
                  &nbsp;({{ index + 1 }})
                </div>
              </el-col>
              <el-col :span="14">
                <div class="el-form-item__label">
                  名称：{{
                    item.TicketTemplate.TicketTemplateCode +
                    "-" +
                    item.TicketTemplate.TicketTemplateTitle
                  }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="el-form-item__label">
                  券码：{{ item.TicketCode }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14" :offset="1">
                <div class="el-form-item__label">
                  有效期：{{ item.ValidDateDesc }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="el-form-item__label">
                  状态：{{ item.TicketStatusDesc }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14" :offset="1">
                <div class="el-form-item__label">
                  配送期：{{ item.ExchangeDateDesc }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="el-form-item__label" v-if="item.ExchangeTime">
                  兑换时间：{{ item.ExchangeTime }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作弹框 -->
    <delDialog ref="editor" :IDs="TicketId" :OpType="'ScKq'" :BillType="'删除卡券'" :Visible="OpVisible"
      @RefreshData="RefreshData" @CloseVisible="CloseVisible">
    </delDialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  GetTicketByCode,
  GetExpressTemplateList,
  SearchBrands,
} from "../../api/ticket.js";
import { HasRightes } from "@/api/index.js";
import delDialog from "@/components/common/del_dialog.vue";

const router = useRouter();
const query = reactive({
  search: {
    ticket_code: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const isShowData = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

const Templates = ref([]);
const brands = ref([]);

const formRef = ref(null);
const form = reactive({
  TicketId: "",
  CouponType: "1",
  CouponTypeDesc: "",
  TicketTemplateType: "",
  TicketTemplateCode: "",
  TicketTemplateTypeDesc2: "",
  time1: "",
  time2: "",
  ExpressTemplateId: "",
  ExpressTemplateIdDesc: "",
  BrandId: "",
  BrandIdDesc: "",
  CreateUnitName: "", //创建单位
  CurrentUnitName: "", //所属单位
  TicketTemplateTitle: "",
  OrgPrice: "",
  IsSuspendDesc: "", //是否挂起
  ListImg: "",
  DeliverOrderCode: "", //配送信息
  DeliverOrderTime: "",
  SaleBillCode: "", //销售信息
  TakeVipName: "",
  TakeVipCell: "",
  SaleTime: "",
  CreateTime: "", //兑换时间
  TicketStatusDesc: "",
  ExchangeGoodses: [], //兑换的商品信息
  ExchangedGoodses: [], //已兑换的商品
  TicketTemplate: {
    PackageDetails: [],
  }, //券信息
  PackageExchangedTicketes: [],
});

// 获取表格数据
const getData = async () => {
  if (!query.search.ticket_code) {
    return;
  }
  tableLoading.value = true;
  let res = await GetTicketByCode({
    TicketCode: query.search.ticket_code.trim(),
    ReturnPass: true,
  });
  tableLoading.value = false;
  isShowData.value = true;
  if (res.Code == 200) {
    form.TicketId = res.DataMap.TicketId;
    form.TicketTemplate = res.DataMap.TicketTemplate;
    form.PackageExchangedTicketes = res.DataMap.PackageExchangedTicketes
      ? res.DataMap.PackageExchangedTicketes
      : [];
    tableData.value = res.DataMap.OpHises ? res.DataMap.OpHises : [];
    pageTotal.value = res.DataMap.OpHises ? res.DataMap.OpHises.length : 0;
    form.TicketTemplateCode = res.DataMap.TicketTemplate.TicketTemplateCode;
    form.TicketTemplateTypeDesc2 =
      res.DataMap.TicketTemplate.TicketTemplateTypeDesc2;

    form.time1 = res.DataMap.ValidDateDesc;
    form.time2 = res.DataMap.ExchangeDateDesc;
    form.ExpressTemplateId = res.DataMap.TicketTemplate.ExpressTemplateId;
    Templates.value.forEach((row) => {
      if (row.TemplateId == res.DataMap.TicketTemplate.ExpressTemplateId) {
        form.ExpressTemplateIdDesc = row.TemplateName;
      }
    });
    form.BrandId = res.DataMap.TicketTemplate.BrandId;
    form.CreateUnitName = res.DataMap.CreateUnitName; //创建单位
    form.CurrentUnitName = res.DataMap.CurrentUnitName; //所属单位
    if (brands.value?.length > 0) {
      brands.value.forEach((row) => {
        if (row.BrandId == res.DataMap.TicketTemplate.BrandId) {
          form.BrandIdDesc = row.BrandName;
        }
      });
    }
    form.DeliverOrderCode = res.DataMap.DeliverOrderCode;
    form.PayOrderCode = res.DataMap.PayOrderCode;
    form.PayPrice = (res.DataMap.PayPrice / 100).toFixed(2);
    form.PayerVipName = res.DataMap.PayerVipName;
    form.PayerVipCell = res.DataMap.PayerVipCell;
    form.PayStatusDesc = res.DataMap.PayStatusDesc;
    form.DeliverOrderTime = res.DataMap.DeliverOrderTime;
    form.SaleBillCode = res.DataMap.SaleBillCode;
    form.TakeVipName = res.DataMap.TakeVipName;
    form.TakeVipCell = res.DataMap.TakeVipCell;
    form.SaleTime = res.DataMap.SaleTime;
    form.TicketTemplateTitle = res.DataMap.TicketTemplate.TicketTemplateTitle;
    form.OrgPrice = res.DataMap.TicketTemplate.OrgPrice / 100;
    form.IsSuspendDesc = res.DataMap.IsSuspendDesc;
    form.ListImg = res.DataMap.TicketTemplate.ListImg;
    form.ExchangeGoodses = res.DataMap.TicketTemplate.ExchangeGoodses
      ? res.DataMap.TicketTemplate.ExchangeGoodses
      : [];
    form.ExchangedGoodses = res.DataMap.ExchangedGoodses
      ? res.DataMap.ExchangedGoodses
      : [];
    form.CreateTime = res.DataMap.CreateTime;
    switch (res.DataMap.TicketStatus) {
      case -1:
        form.TicketStatusDesc = "已作废";
        break;
      case 0:
        form.TicketStatusDesc = "未激活";
        break;
      case 1:
        form.TicketStatusDesc = "已激活";
        break;
      case 2:
        form.TicketStatusDesc = "待兑换";
        break;
      case 3:
        form.TicketStatusDesc = "转赠中";
        break;
      case 10:
        form.TicketStatusDesc = "已兑换";
        break;
      default:
        break;
    }
    form.TicketTemplateType = res.DataMap.TicketTemplate.TicketTemplateType;
    if (res.DataMap.TicketTemplate.GoodsQty > 1) {
      form.CouponType = 2;
      form.CouponTypeDesc =
        res.DataMap.TicketTemplate.GoodsQty +
        "选" +
        res.DataMap.TicketTemplate.ExchangeGoodsQty;
    }
  }
};
const GetGetExpressTemplateList = async () => {
  // 获取配送模板列表
  let res = await GetExpressTemplateList({});
  if (res.Code == 200) {
    Templates.value = res.DataMap;
  }
};
const GetBrands = async () => {
  // 获品牌
  let res = await SearchBrands({
    PageStartRow: 0,
    PageRowCount: 1000000,
    NoPage: true,
  });
  if (res.Code == 200) {
    brands.value = res.DataMap.Data;
  }
};

// 查询操作
const handleSearch = () => {
  if (!query.search.ticket_code) {
    ElMessage.info("请先输入券码");
    return;
  }
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

////////////////////////////////////////////////////////////////
//是否有取消权限
const IsRight = ref("");
const BoolRight = async () => {
  let arr = ["cancel_add_ticket"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.cancel_add_ticket;
  }
};
BoolRight();

////////////////////////////////////////////////////////////////
//取消添加的卡券
const TicketId = ref([]);
const OpVisible = ref(false);
const RefreshData = (val) => { };
const CloseVisible = (isBoolean) => {
  OpVisible.value = isBoolean;
};
const CancelTicket = async () => {
  if (form.TicketId == "") {
    ElMessage.info("请先根据券号查询出数据");
    return;
  }
  TicketId.value = [];
  TicketId.value.push(form.TicketId);
  OpVisible.value = true;
};
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.No) {
    query.search.ticket_code = router.currentRoute.value.query.No;
  }
  GetGetExpressTemplateList();
  GetBrands();
  getData();
};
Init();
</script>

<style scoped>
.form_bm .el-form-item {
  margin-bottom: 0;
}

#nav-batch {
  list-style-type: none;
  width: 100%;
}

.inli-batch {
  position: relative;
  margin: 10px 10px 20px 40px;
  border-radius: 2px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
}

.goods-detail {
  height: 124px;
  position: relative;
}
</style>
