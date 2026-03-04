<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="13">
          <el-row>
            <el-col :span="24">
              <el-form-item label="类型">
                <p v-if="form.ActType == 2">满减</p>
                <p v-if="form.ActType == 1">买赠</p>
                <p v-if="form.ActType == 5">指定价格</p>
              </el-form-item>
            </el-col>
            <el-row v-if="form.ActType == 2">
              <el-col :span="24">
                <el-form-item label="每满多少减多少">
                  <el-radio-group v-model="form.JsonData.IsEveryFullCut" @change="IsEveryFullCutChange">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-col :span="24">
              <el-form-item label="名称" prop="ActName">
                <el-input v-model="form.ActName" placeholder="请输入活动名称">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动时间" prop="time">
                <el-date-picker :default-time="defaultTime2" v-model="form.time" type="datetimerange"
                  range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.ActRemark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.ActType == 2 || form.ActType == 1">
              <el-form-item label="与券共用">
                <el-radio-group :disabled="Type == 'View'" v-model="form.CanUseWithTicket">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.ActType == 2 || form.ActType == 1">
              <el-row>
                <el-col :span="18">
                  <div>
                    <el-form-item label="明细">
                      <el-button :disabled="Type == 'View'" class="button-op-del" @click="DetailClick">添加活动规则
                      </el-button>
                      <p style="padding-left: 6px;color: #f56c6c;"
                        v-if="form.ActType == 2 && form.JsonData.IsEveryFullCut == 0">多档规则，满额必须逐级递增</p>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <!-- 满减金额 -->
              <el-form-item label="" v-if="form.ActType == 2">
                <el-row style="width: 100%" v-for="(item, index) in MoneyTableData" :key="index">
                  <el-col :span="22">
                    <p v-html="item.DescribeDescAll"></p>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="button-op-del" size="small" :disabled="Type == 'View'"
                      @click="MoneyDelClick(index)">删除
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 满减礼品 -->
              <el-form-item label="" v-if="form.ActType == 1">
                <el-row style="width: 100%" v-for="(item, index) in GoodTableData" :key="index">
                  <el-col :span="22">
                    <p v-html="item.DescribeDescAll"></p>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="button-op-del" size="small" :disabled="Type == 'View'"
                      @click="GoodsDelClick(index)">删除
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 指定商品 -->
              <el-form-item label="添加商品" v-if="form.ActType == 5">
                <el-button :disabled="Type == 'View'" class="button-op-del" @click="AddGoodsData">添加
                </el-button>
              </el-form-item>
              <el-form-item label="" v-if="form.ActType == 5">
                <el-table height="500" v-if="processTableData.length > 0" :data="processTableData.slice(
                  (query.PageStartRow - 1) * query.PageRowCount,
                  query.PageStartRow * query.PageRowCount
                )
                  " border class="table" v-loading="tableLoading" :header-cell-style="{ 'text-align': 'center' }"
                  header-cell-class-name="table-header" style="width: 100%">
                  <el-table-column prop="" align="left" label="基础信息">
                    <template #default="scope">
                      <p>供应商：{{ scope.row.GoodsCreateUnitName }} </p>
                      <p>编码：{{ scope.row.GoodsCode }} </p>
                      <p>名称：{{ scope.row.GoodsTitle }}<span v-if="scope.row.SkuId">-{{ scope.row.SkuPropertyDesc
                      }}</span> </p>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="原价(元)" width="120">
                    <template #default="scope">
                      <p v-if="scope.row.OrgPrice > 0"> {{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
                    </template></el-table-column>
                  <el-table-column align="center" label="指定售价(元)" width="120">
                    <template #default="scope">
                      <el-input v-model="scope.row.SellPrice" placeholder="指定价格" />
                    </template></el-table-column>

                  <el-table-column label="操作" align="center" width="80">
                    <template #default="scope">
                      <div class="button-mgl">
                        <el-button :disabled="Type == 'View'" class="button-op-del" size="small"
                          @click="handleGoodsSpecifyDel(scope.row.GoodsId, scope.row.SkuId)">删除
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" :offset="1" v-if="form.ActType == 2">
          <el-row>
            <el-col :span="18">
              <el-form-item label="可使用商品" label-width="100px">
                <el-radio-group :disabled="Type == 'View'" v-model="form.CanUseGoodsScope">
                  <el-radio label="0">所有商品都</el-radio>
                  <el-radio label="1">指定商品</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.CanUseGoodsScope == 1">
              <div class="goods-modal-add">
                <el-button :disabled="Type == 'View'" class="button-op-del" size="small" @click="addUseGoods">添加商品
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="form.CanUseGoodsScope == 1">
            <el-col :span="24">
              <el-table height="500" :data="UseTableData.slice(
                (query.PageStartRow - 1) * query.PageRowCount,
                query.PageStartRow * query.PageRowCount
              )
                " border class="table" v-loading="tableLoading" :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header" style="width: 100%">
                <el-table-column prop="GoodsCode" align="center" label="编码">
                </el-table-column>
                <el-table-column prop="GoodsTitle" align="center" label="名称"></el-table-column>
                <el-table-column label="操作" align="center" width="80">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button :disabled="Type == 'View'" class="button-op-del" size="small"
                        @click="handleGoodsDel(scope.row.GoodsId)">删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination background layout="->,total, sizes, prev, pager, next"
                  v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                  :page-sizes="[15, 50, 100]" :total="UseTableData.length" @current-change="handlePageChange"
                  @size-change="handleSizeChange"></el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" v-if="form.ActType == 5">
          <!-- 背景图片 -->
          <el-form-item label="背景图片">
            <div class="flex-col">
              <el-upload class="mall-uploader" ref="upload" :show-file-list="false" action="#"
                :http-request="SuccessImg" :auto-upload="true">
                <el-image v-if="form.JsonData.MainImage" class="mall-uploader-avatar" :src="form.JsonData.MainImage"
                  fit="contain" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <div class="text">宽度375px, 高度自适应
                <span style="cursor: pointer" class="el-icon-delete" v-if="form.JsonData.MainImage"
                  @click="clearUploadImg">删除</span>
              </div>
            </div>

          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button v-if="Type != 'View'" class="button1" round :loading="btnLoading" @click="onSubmit">
          <el-icon>
            <CirclePlus />
          </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
        </el-button>
        <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
      </el-form-item>
    </el-form>
    <!-- 可销售商品列表 -->
    <goods-modal :GoodsVisible="ComponentsGoodVisible" :list="form.Goodses" @CloseVisible="CloseVisible"
      @ConFirm="SaveTable"></goods-modal>
    <!-- 明细编辑 -->
    <el-dialog class="sell-top" title="明细编辑" v-model="DetailVisible" width="30%" :close-on-click-modal="false"
      :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <div v-if="form.ActType == 2">
        <!-- 满减金额 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="满" label-width="60px">
              <el-input style="width: 90%" v-model="formMoney.FullAmt">
                <template #append>(元)</template>
              </el-input>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="减" label-width="60px">
              <el-input style="width: 90%" v-model="formMoney.CutAmt">
                <template #append>(元)</template>
              </el-input>
            </el-form-item></el-col>
        </el-row>
      </div>
      <div v-if="form.ActType == 1">
        <!-- 买赠 -->
        <el-form-item label="购买" label-width="90px">
          <el-select v-model="formGoods.SrcGoodsId" filterable remote reserve-keyword placeholder="请输入商品名称"
            :remote-method="remoteMethod1" remote-show-suffix :loading="SelLoading" style="width: 90%" clearable>
            <el-option v-for="(item, index) in GoodsListData" :key="index" :label="item.Code + ' - ' + item.Title + ' - ' + item.yuan + '(元)'
              " :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" label-width="90px">
          <el-input style="width: 90%" v-model="formGoods.SrcGoodsQty">
          </el-input>
        </el-form-item>
        <el-form-item label="赠送类型" label-width="90px">
          <el-select clearable style="width: 90%" v-model="formGoods.DstType" placeholder="类型" @change="changeDstType">
            <el-option label="商品" value="2"> </el-option>
            <el-option label="券" value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赠送商品" label-width="90px" v-if="formGoods.DstType != ''">
          <el-select v-model="formGoods.DstGoodsId" filterable remote reserve-keyword placeholder="请输入商品、券名称"
            :remote-method="remoteMethod2" remote-show-suffix :loading="SelLoading" style="width: 90%" clearable>
            <div v-if="formGoods.DstType == 2">
              <el-option v-for="(item, index) in GoodsOrTicketListData" :key="index" :label="item.Code + ' - ' + item.Title + ' - ' + item.yuan + '(元)'
                " :value="item.ID">
              </el-option>
            </div>
            <div v-else>
              <el-option v-for="(item, index) in GoodsOrTicketListData" :key="index"
                :label="item.Code + '-' + item.Title" :value="item.ID">
              </el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" label-width="90px">
          <el-input style="width: 90%" v-model="formGoods.DstGoodsQty">
          </el-input>
        </el-form-item>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="AddDetailClick()">保 存</el-button>
          <el-button class="button2" @click="DetailVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import { GetMallAct, SaveMallAct } from "@/api/market.js";
import { SearchGoodMalls } from "@/api/goods.js";
import GoodsModal from "@/components/Modal/GoodsModal.vue";
import { UploadSingle } from "@/api/imgapi.js";
import { SearchTicketTemplates } from "@/api/ticket.js";
import Cookie from "js-cookie";
// 用户信息
const loginUser = JSON.parse(Cookie.get("User") || "{}");
import {
  GetMallGoods
} from "@/api/goods.js";
////////////////////////////////////////////////////////////////////////////////////////////////
const router = useRouter();
let form = reactive({
  ActId: "",
  ActCode: "",
  ActType: "",
  ActName: "",
  ActConfig: "",
  BeginTime: "",
  EndTime: "",
  CanUseWithTicket: "0",
  CanUseGoodsScope: "0",
  ActRemark: "",
  UseGoodsCount: "",
  IsPrivate: 1,
  ActStatus: "",
  Details: [],
  DetailDesc: "",
  Goodses: [],
  JsonData: {
    IsEveryFullCut: "0",//（1：是）0:否
    MainImage: "",//主背景图片
  },

});

const rules = {
  ActName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  time: [{ required: true, message: "请选择起始时间", trigger: "blur" }],
};
const formRef = ref(null);
const defaultTime2 = [
  new Date(2023, 1, 1, 0, 0, 0),
  new Date(2023, 2, 1, 23, 59, 59),
];

const Type = ref("");
const btnLoading = ref(false);
const UseTableData = ref([]);
const GoodTableData = ref([]); //选择的商品数据
const MoneyTableData = ref([]); //选择的金额数据
const processTableData = ref([]);//需要处理的数组

const tableLoading = ref("");
const ComponentsGoodVisible = ref(false);
const query = reactive({
  PageStartRow: 1,
  PageRowCount: 15,
});
const handlePageChange = (val) => {
  query.PageStartRow = val;
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
};
//添加可使用商品
const addUseGoods = () => {
  ComponentsGoodVisible.value = true;
};
const CloseVisible = () => {
  ComponentsGoodVisible.value = false;
};
// 保存选中商品（去重）
const SaveTable = (val) => {
  UseTableData.value = val;
  ComponentsGoodVisible.value = false;
  ComponentsGoodVisible.value = false;

};
const processArray = async (tableData) => {
  const promises = [];
  for (const row of tableData) {
    if (row.SkuCount > 0) {
      promises.push(addSpecificationsData(row));
    } else {
      row.SellPrice = row.SellPrice ? (row.SellPrice / 100).toFixed(2) : '';
      pushProcessItem(row);
    }
  }
  await Promise.all(promises);
};
// 去重集合（商品+规格）
const processKeySet = new Set();
const pushProcessItem = (item) => {
  if (!item || !item.GoodsId) return;
  const key = item.GoodsId + '_' + (item.SkuId || 0);
  if (processKeySet.has(key)) return;
  processKeySet.add(key);
  processTableData.value.push(item);
  console.log(processTableData.value);
};
// 获取规格并填充 processTableData
const addSpecificationsData = async (rowData) => {
  try {
    const res = await GetMallGoods({ GoodsId: rowData.GoodsId, UnitId: rowData.CreateUnitId, });
    if (res.Code !== 200) {
      pushProcessItem(rowData);
      return;
    }
    // 下面根据实际返回结构调整字段名称
    const skuList = res.DataMap?.SkuList || res.DataMap?.Skus || [];
    if (!Array.isArray(skuList) || skuList.length === 0) {
      // 没有规格，直接加入原商品
      pushProcessItem(rowData);
      return;
    }
    skuList.forEach(sku => {
      pushProcessItem({
        GoodsId: rowData.GoodsId,
        GoodsCode: rowData.GoodsCode,
        GoodsTitle: rowData.GoodsTitle + "-" + sku.PropertyDesc,
        ListImg: rowData.ListImg,
        SkuId: sku.SkuId || sku.ID,
        SkuTitle: sku.SkuTitle || sku.Title,
        SkuCode: sku.SkuCode,
        OrgPrice: rowData.OrgPrice ? (rowData.OrgPrice).toFixed(2) : '',
        SellPrice: sku.SellPrice ? (sku.SellPrice / 100).toFixed(2) : '',
      });
    });
  } catch (e) {
    pushProcessItem(rowData);
  }
};
//删除已经添加到池子里面的商品
const handleGoodsDel = (ID) => {
  for (let i = 0; i < UseTableData.value.length; i++) {
    if (ID == UseTableData.value[i].GoodsId) {
      UseTableData.value.splice(i, 1);
      break;
    }
  }
};
const handleGoodsSpecifyDel = (goodsId, skuID = "") => {
  if (!goodsId) return;

  // 构造匹配函数
  const match = skuID
    ? (row) => row.GoodsId === goodsId && String(row.SkuId || "") === String(skuID)
    : (row) => row.GoodsId === goodsId;

  // 反向遍历删除，支持删除同一商品的多个规格
  for (let i = processTableData.value.length - 1; i >= 0; i--) {
    const row = processTableData.value[i];
    if (match(row)) {
      processTableData.value.splice(i, 1);
      // 同步移除去重集合中的 key，允许后续重新添加
      const key = row.GoodsId + "_" + (row.SkuId || 0);
      processKeySet.delete(key);
      // 若仅删除单个规格则跳出；若 skuID 为空表示要删除该商品所有规格，继续循环
      if (skuID) break;
    }
  }
};
// 删除满减金额
const MoneyDelClick = (Index) => {
  MoneyTableData.value.splice(Index, 1);
};
// 删除买赠礼品
const GoodsDelClick = (Index) => {
  GoodTableData.value.splice(Index, 1);
};
//商品Or券搜索
const SelLoading = ref(false);
const GoodsListData = ref([]);
const GoodsOrTicketListData = ref([]);

const remoteMethod1 = async (queryValue) => {
  if (queryValue) {
    let SearchQuery = "";
    if (queryValue != "") {
      SearchQuery = queryValue;
    } else {
      return;
    }
    SelLoading.value = true;
    const query = reactive({
      search: {
        search_keyword: SearchQuery,
        mall_status: "10",
        goods_status: 1,
        mall_unit_id: loginUser.UnitId,
        get_my_goods: 1,
      },
    });
    let res = await SearchGoodMalls({
      PageStartRow: 0,
      PageRowCount: 1000,
      NoPage: true,
      SearchCondition: query.search,
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      let DataList = res.DataMap.Data ? res.DataMap.Data : [];
      for (let i = 0; i < DataList.length; i++) {
        const row = DataList[i];
        row.ID = row.Goods.GoodsId;
        row.Code = row.Goods.GoodsCode;
        row.Title = row.Goods.GoodsTitle;
        row.yuan = (row.Goods.SellPrice / 100).toFixed(2);
      }
      GoodsListData.value = DataList;
    }
  }
};
const remoteMethod2 = async (queryValue) => {
  if (queryValue) {
    let SearchQuery = "";
    if (queryValue != "") {
      SearchQuery = queryValue;
    } else {
      return;
    }
    SelLoading.value = true;
    const query = reactive({
      search: {
        search_keyword: SearchQuery,
        mall_status: "10",
        mall_unit_id: loginUser.UnitId,
        get_my_goods: 1,
      },
    });
    let res = null;
    if (formGoods.DstType == "3") {
      //券弹框
      res = await SearchTicketTemplates({
        PageStartRow: 0,
        PageRowCount: 1000,
        NoPage: true,
        SearchCondition: query.search,
      });
    } else {
      res = await SearchGoodMalls({
        PageStartRow: 0,
        PageRowCount: 1000,
        NoPage: true,
        SearchCondition: query.search,
      });
    }
    SelLoading.value = false;
    if (res.Code == 200) {
      let DataList = res.DataMap.Data ? res.DataMap.Data : [];
      for (let i = 0; i < DataList.length; i++) {
        const row = DataList[i];
        if (formGoods.DstType == "3") {
          row.ID = row.TicketTemplateId;
          row.Code = row.TicketTemplateCode;
          row.Title = row.TicketTemplateTitle;
        } else {
          row.ID = row.Goods.GoodsId;
          row.Code = row.Goods.GoodsCode;
          row.Title = row.Goods.GoodsTitle;
          row.yuan = (row.Goods.SellPrice / 100).toFixed(2);
        }
      }
      GoodsOrTicketListData.value = DataList;
    }
  }
};
//赠送类型切换的时候需要把数据清空
const changeDstType = () => {
  formGoods.DstGoodsId = "";
  GoodsOrTicketListData.value = [];
};
const onReturn = async () => {
  common.ClosePageTag("营销活动详情");
  router.back();
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let formData = form;
      if (form.time) {
        if (form.time.length > 0) {
          formData.BeginTime = common.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            form.time[0]
          );
          formData.EndTime = common.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            form.time[1]
          );
        }
      }
      if (formData.ActType == "2") {
        //满减金额
        formData.Details = [];
        if (
          MoneyTableData.value.length > 0 &&
          MoneyTableData.value[0].FullAmt
        ) {
          let JSONList = JSON.parse(JSON.stringify(MoneyTableData.value));
          for (let i = 0; i < JSONList.length; i++) {
            const row = JSONList[i];
            row.FullAmt = row.FullAmt * 100;
            row.CutAmt = row.CutAmt * 100;
            formData.Details.push(row);
          }
        }
        if (formData.Details.length == 0) {
          ElMessage.info("请完善活动规则");
          return;
        }
        //参加商品的范围(0:所有商品都参与;1:指定商品参与)
        if (formData.CanUseGoodsScope == 1) {
          if (UseTableData.value.length == 0) {
            ElMessage.info("请先选择参与活动商品");
            return;
          }
          formData.Goodses = [];
          for (let i = 0; i < UseTableData.value.length; i++) {
            const row = UseTableData.value[i];
            let objUse = {};
            objUse.ActId = "";
            objUse.GoodsId = row.GoodsId;
            formData.Goodses.push(objUse);
          }
        }

        //把每满配置加入到json里面
        form.ActConfig = JSON.stringify({ IsEveryFullCut: form.JsonData.IsEveryFullCut });
      } else if (formData.ActType == "1") {
        //买赠
        if (GoodTableData.value.length == 0) {
          ElMessage.info("请完善活动规则");
          return;
        }
        formData.Details = GoodTableData.value;
      } else if (formData.ActType == "5") {
        //选择商品，指定价格
        formData.ActConfig = JSON.stringify({ MainImage: form.JsonData.MainImage });
        formData.Goodses = processTableData.value.map(item => ({
          ActId: "",
          GoodsId: item.GoodsId,
          SkuId: item.SkuId || null,
          SellPrice: item.SellPrice * 100,
        }));
      }
      btnLoading.value = true;
      let res = await SaveMallAct({
        Act: formData,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("营销活动详情");
        ElMessage.success("保存成功");
        let url = "";

        switch (form.ActType.toString()) {
          case '1':
            url = "/market_page_buy";
            break;
          case '2':
            url = "/market_page_full";
            break;
          case '5':
            url = "/market_page_specify_price";
            break;

          default:
            break;
        }
        router.push({
          path: url,
        });

      } else {
        ElMessage.info(res.Message);
      }
    } else {
      return false;
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////
const GetMallActApi = async (ID) => {
  let res = await GetMallAct({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    form.ActType = res.DataMap.ActType;
    form.ActName = res.DataMap.ActName;
    form.ActStatus = res.DataMap.ActStatus;
    form.DetailDesc = res.DataMap.DetailDesc;
    form.ActRemark = res.DataMap.ActRemark;
    form.CanUseWithTicket = res.DataMap.CanUseWithTicket.toString();
    form.CanUseGoodsScope = res.DataMap.CanUseGoodsScope.toString();
    form.time = [
      res.DataMap.BeginTime.toString(),
      res.DataMap.EndTime.toString(),
    ];
    form.Details = res.DataMap.Details;
    form.Goodses = res.DataMap.Goodses;
    UseTableData.value = res.DataMap.Goodses;
    if (form.ActType == 2) {
      MoneyTableData.value = [];
      if (res.DataMap.ActConfig) {
        let ActConfigJson = JSON.parse(res.DataMap.ActConfig);
        form.JsonData.IsEveryFullCut = ActConfigJson.IsEveryFullCut
      }
      //满减 逻辑
      let JSONList = JSON.parse(JSON.stringify(res.DataMap.Details));
      for (let i = 0; i < JSONList.length; i++) {
        const row = JSONList[i];
        row.FullAmt = row.FullAmt / 100;
        row.CutAmt = row.CutAmt / 100;
        let DescribeDescAll =
          "满 <span style='color:red'>" + row.FullAmt + "</span> (元)，立减 <span style='color:red'>" + row.CutAmt + "</span> (元)";
        row.DescribeDescAll = DescribeDescAll;
        MoneyTableData.value.push(row);
      }
    } else if (form.ActType == 1) {
      //买赠 逻辑
      res.DataMap.Details.forEach((row) => {
        row.DstType = row.DstType.toString();
        let DescribeDescAll = "";
        DescribeDescAll =
          "购买 [<span style='color:red'>" +
          row.SrcGoodsTitle +
          "</span>] ×" +
          row.SrcGoodsQty;
        if (row.DstType == 3) {
          //礼品卡
          DescribeDescAll +=
            " 赠送 [<img style='width: 22px;height: 22px;position: relative;top: 7px;' src='https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img3-sp_mall/ticket.png?v=1'/><span style='color:red'>" +
            row.DstGoodsCode +
            " " +
            row.DstGoodsTitle +
            "</span>] × " +
            row.DstGoodsQty;
        } else {
          //商品
          DescribeDescAll +=
            " 赠送 [<span style='color:red'>" +
            row.DstGoodsTitle +
            "</span>] ×" +
            row.DstGoodsQty;
        }
        row.DescribeDescAll = DescribeDescAll;
      });
      GoodTableData.value = res.DataMap.Details;
    } else if (form.ActType == 5) {
      if (res.DataMap.ActConfig) {
        let ActConfigJson = JSON.parse(res.DataMap.ActConfig);
        form.JsonData.MainImage = ActConfigJson.MainImage
      }
      //指定价格 逻辑
      processArray(res.DataMap.Goodses);
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////
//明细编辑
const DetailVisible = ref(false);
let formMoney = reactive({
  FullType: 1,
  FullAmt: "", //满金额(分)
  CutType: 1, //减类型(1:金额;2:件数)
  CutAmt: "", //减金额(分)
});
let formGoods = reactive({
  SrcType: "2", //原商品类型(1:金额;2:件数)
  SrcGoodsId: "", //原商品ID
  SrcGoodsAmt: "", //原商品金额(分)
  SrcGoodsQty: "1", //原商品件数
  DstType: "", //目标商品类型(1:金额;2:件数;3:券)
  DstGoodsId: "", //目标商品ID
  DstGoodsAmt: "", //目标商品金额(分)
  DstGoodsQty: "1", //目标商品件数
});
//添加编辑明细
const DetailClick = () => {
  if (form.ActType == 2) {
    //满减金额
    if (form.JsonData.IsEveryFullCut == 1) {
      //当前设置了 每满多少减多少功能，那么明细只能设置一档
      if (MoneyTableData.value.length >= 1) {
        ElMessage.error("当前活动已设置每满多少减多少功能，明细只能设置一档");
        return;
      }
    }
    formMoney.FullAmt = "";
    formMoney.CutAmt = "";
  } else {
    //买赠
    formGoods.SrcGoodsId = "";
    formGoods.SrcGoodsAmt = "";
    formGoods.SrcGoodsQty = "1";
    formGoods.DstGoodsId = "";
    formGoods.DstGoodsAmt = "1";
  }
  DetailVisible.value = true;
};
//保存明细
const AddDetailClick = () => {
  if (form.ActType == 2) {
    if (formMoney.FullAmt == "" || formMoney.CutAmt == "") {
      ElMessage.info("请输入满减金额");
      return;
    }
    //满减金额
    let DescribeDescAll =
      "满 <span style='color:red'>" +
      formMoney.FullAmt +
      "</span> (元)，立减 <span style='color:red'>" +
      formMoney.CutAmt +
      "</span> (元)";
    MoneyTableData.value.push({
      DescribeDescAll: DescribeDescAll,
      FullType: 1,
      FullAmt: formMoney.FullAmt, //满金额(分)
      CutType: 1, //减类型(1:金额;2:件数)
      CutAmt: formMoney.CutAmt, //减金额(分)
    });
  } else {
    if (formGoods.SrcGoodsId == "") {
      ElMessage.info("请选择要买的商品");
      return;
    }
    if (formGoods.SrcGoodsQty == "") {
      ElMessage.info("请输入购买的商品数量");
      return;
    }
    if (formGoods.DstType == "") {
      ElMessage.info("请选择赠送类型");
      return;
    }
    if (formGoods.DstGoodsId == "") {
      ElMessage.info("请选择赠送的商品");
      return;
    }
    if (formGoods.DstGoodsQty == "") {
      ElMessage.info("请输入赠送的商品数量");
      return;
    }
    let DescribeDescAll = "";
    let SrcGoodsAmt = "";
    let DstGoodsAmt = "";
    for (let i = 0; i < GoodsListData.value.length; i++) {
      const row = GoodsListData.value[i];
      if (row.Goods.GoodsId == formGoods.SrcGoodsId) {
        SrcGoodsAmt = row.Goods.OrgPrice;
        DescribeDescAll +=
          "购买 [<span style='color:red'>" +
          row.Goods.GoodsTitle +
          "</span>] ×" +
          formGoods.SrcGoodsQty;
        break;
      }
    }
    // DescribeDescAll += " 赠送类型：";
    // DescribeDescAll += formGoods.DstType == 2 ? "商品 " : "券 ";
    for (let j = 0; j < GoodsOrTicketListData.value.length; j++) {
      const row = GoodsOrTicketListData.value[j];
      if (formGoods.DstType == 2) {
        //当前是商品用goodis匹配
        if (row.Goods.GoodsId == formGoods.DstGoodsId) {
          DstGoodsAmt = row.Goods.OrgPrice;
          DescribeDescAll +=
            " 赠送 [<span style='color:red'>" +
            row.Goods.GoodsTitle +
            "</span>] ×" +
            formGoods.DstGoodsQty;

          break;
        }
      } else {
        //当前是券 用ticketid匹配
        if (row.ID == formGoods.DstGoodsId) {
          DescribeDescAll +=
            " 赠送 [<img style='width: 22px;height: 22px;position: relative;top: 7px;' src='https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img3-sp_mall/ticket.png?v=1'/><span style='color:red'>" +
            row.TicketTemplateCode +
            "" +
            row.TicketTemplateTitle +
            "</span>] ×" +
            formGoods.DstGoodsQty;
          break;
        }
      }
    }
    //满减礼品
    GoodTableData.value.push({
      DescribeDescAll: DescribeDescAll, //描述
      SrcType: "2", //原商品类型(1:金额;2:件数)
      SrcGoodsId: formGoods.SrcGoodsId, //原商品ID
      SrcGoodsAmt: SrcGoodsAmt, //原商品金额(分)
      SrcGoodsQty: "1", //原商品件数
      DstType: formGoods.DstType, //目标商品类型(1:金额;2:件数;3:券)
      DstGoodsId: formGoods.DstGoodsId, //目标商品ID
      DstGoodsAmt: DstGoodsAmt, //目标商品金额(分)
      DstGoodsQty: "1", //目标商品件数
    });
  }
  DetailVisible.value = false;
};
//切换每满多少减多少提示
const IsEveryFullCutChange = () => {
  if (form.JsonData.IsEveryFullCut == 1) {
    ElMessageBox.confirm("切换每满多少减多少功能，明细只能设置一档", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).then(async () => {
      MoneyTableData.value = [];
    }).catch(() => {
      form.JsonData.IsEveryFullCut = 0;
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////
const AddGoodsData = () => {
  ComponentsGoodVisible.value = true
}
/////////////////////////////////////////////////////////////////////////////////
// 上传背景图片
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.JsonData.MainImage = res.DataMap.HttpsUrl;
    }
  });
};
//删除上传的图片
const clearUploadImg = () => {
  form.JsonData.MainImage = "";
};
/////////////////////////////////////////////////////////////////////////////////
const Init = () => {
  Type.value = router.currentRoute.value.query.Type;
  if (router.currentRoute.value.query.ID) {
    form.ActId = router.currentRoute.value.query.ID;
    GetMallActApi(form.ActId);
  } else {
    form.ActType = router.currentRoute.value.query.mkType;
  }
};
Init();
</script>

<style scoped>
.goods-modal-add {
  float: right;
}
</style>
<style>
.mall-uploader {
  width: 250px;
  height: 300px;
}

.mall-uploader .el-upload {
  width: 250px !important;
  height: 300px !important;
  line-height: 300px !important;
}

.mall-uploader-avatar {
  width: 100%;
}
</style>