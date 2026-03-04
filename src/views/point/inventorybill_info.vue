<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="BillForm" label-width="140px">
      <div style="margin-top: 20px; padding-bottom: 100px">
        <el-row v-if="BillForm.BillId">
          <el-col :span="10">
            <el-form-item label="单号">
              <el-input :disabled="true" v-model="BillForm.BillCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="BillForm.BillId">
          <el-col :span="10">
            <el-form-item label="单据类型">
              <el-input
                :disabled="true"
                v-model="BillForm.BillTypeDesc"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="创建日期">
              <el-input :disabled="true" v-model="BillForm.BillDate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="备注" prop="BillRemark">
              <el-input
                :disabled="Type == 'View'"
                v-model="BillForm.BillRemark"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="添加商品">
              <el-button
                v-if="Type != 'View'"
                class="button1"
                round
                size
                @click="OpenModal"
              >
                &nbsp;&nbsp;逐个添加&nbsp;&nbsp;
              </el-button>
              <el-button
                v-if="Type != 'View'"
                class="button1"
                round
                size
                @click="OpenMoreModal"
              >
                &nbsp;&nbsp;一键全部添加&nbsp;&nbsp;
              </el-button>
              <el-button
                v-if="Type != 'View'"
                class="button2"
                round
                size
                @click="DelQty"
              >
                &nbsp;&nbsp;过滤数量&nbsp;&nbsp;
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="">
              <el-table
                height="400"
                :data="BillForm.Details"
                border
                class="table"
                :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header"
                style="width: 100%"
              >
                <el-table-column align="center" label="序号" width="60">
                  <template #default="scope">
                    <p>{{ scope.$index + 1 }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="GoodsCode"
                  align="center"
                  label="商品编码"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="GoodsTitle"
                  align="center"
                  label="商品名称"
                >
                </el-table-column>
                <el-table-column
                  prop="SkuCode"
                  align="center"
                  label="SKU编码"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="SkuPropertyDesc"
                  align="center"
                  label="SKU属性"
                >
                </el-table-column>

                <el-table-column label="库存" width="100">
                  <template #default="scope">
                    <el-input
                      type="number"
                      :disabled="true"
                      v-model="scope.row.Qty"
                      placeholder=""
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="实际" width="120">
                  <template #default="scope">
                    <el-input
                      type="number"
                      v-model="scope.row.RealQty"
                      placeholder="请输入实际数量"
                    ></el-input>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="80">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button
                        v-if="Type != 'View'"
                        class="button-op-del"
                        size="small"
                        @click="DelRow(scope.$index)"
                        >删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  layout="->,total"
                  :total="BillForm.Details.length"
                ></el-pagination>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button
          v-if="Type != 'View'"
          class="button1"
          round
          :loading="btnLoading"
          @click="onSubmit"
        >
          <el-icon> <CirclePlus /> </el-icon
          >&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
        </el-button>
        <el-button class="button2" round @click="onReturn"
          >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 商品操作 -->
    <el-dialog
      title="选择商品"
      v-model="GoodsVisible"
      width="48%"
      :show-close="false"
    >
      <el-row>
        <el-col :span="23">
          <el-form-item label="">
            <el-select
              v-model="BillForm.DetailInfo.GoodsId"
              @change="ChangeGoodsId($event)"
              filterable
              remote
              reserve-keyword
              placeholder="请输入商品名称/编码"
              :remote-method="remoteMethod"
              remote-show-suffix
              :loading="SelLoading"
              style="width: 50%"
              clearable
            >
              <el-option
                v-for="(item, index) in goodsData"
                :key="index"
                :label="item.GoodsCode + '-' + item.GoodsTitle"
                :value="item.GoodsId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="">
            <el-table
              :data="GoodsTableData"
              border
              @selection-change="handleSelectionChange"
              class="table"
              v-loading="tableLoading"
              :header-cell-style="{ 'text-align': 'center' }"
              header-cell-class-name="table-header"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                align="center"
                label=""
                width="40"
              >
                <!-- <template #default="scope">
                  <el-checkbox
                    v-model="scope.row.Select"
                    @change="SelRow(scope.$index)"
                    label=""
                  />
                </template> -->
              </el-table-column>
              <el-table-column prop="GoodsCode" align="center" label="商品编码">
              </el-table-column>
              <el-table-column
                prop="GoodsTitle"
                align="center"
                label="商品名称"
              >
              </el-table-column>
              <el-table-column prop="SkuCode" align="center" label="Sku编码">
              </el-table-column>
              <el-table-column
                prop="SkuPropertyDesc"
                align="center"
                label="Sku"
              >
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="AddGoods">确 认</el-button>
          <el-button class="button2" @click="GoodsVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { GetGoodsList } from "@/api/goods.js";
import { SaveGoodsBills, GetGoodsBills } from "@/api/bill.js";
import common from "@/utils/common.js";
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
let BillForm = reactive({
  BillId: "",
  BillType: "",
  BillCode: "",
  BillDate: "",
  BillTypeDesc: "", //单据类型
  BillRemark: "",
  BillConfig: "",
  Details: [],
  DetailInfo: {
    GoodsName: "",
    GoodsId: "",
    SkuId: "",
    QtyBegin: "", //暂时不用管理
    Qty: "", //交易数量（出入库单的时候需要自己输入，盘点单的时候直接获取）
    QtyEnd: "", //暂时不用处理
    RealQty: "", //实际数量（盘点单的时候自己输入）
  },
});
const rules = {};

const onReturn = async (val) => {
  common.ClosePageTag("单据详情");
  router.back();
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let isSubmit = 0; //是否已完善数据
      BillForm.Details.forEach((row) => {
        if (row.Qty > 0) {
          isSubmit = 1;
        }
      });
      if (isSubmit == 0) {
        ElMessage.warning("请先输入交易数量");
        return;
      }
      btnLoading.value = true;
      let res = await SaveGoodsBills({
        Bill: BillForm,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("盘点单详情");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "盘点单",
        });
        setTimeout(function () {
          router.push({
            path: "/Inventory_bill",
          });
        }, 2000);
        ElMessage.success("保存成功");
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
////////////////////////////////////////////////////////////////////////
const GoodsVisible = ref(false);
const goodsData = ref([]);
const GoodsTableData = ref([]);

//逐条添加
const OpenModal = async () => {
  BillForm.DetailInfo.GoodsId = "";
  GoodsTableData.value = [];
  GoodsVisible.value = true;
};
//一键全部添加
const OpenMoreModal = async () => {
  let res = await GetGoodsList({
    SearchCondition: {
      goods_status: 1,
      goods_type: 2,
      is_sell: 0,
      get_sku: 1,
      get_stock: 1,
    },
  });
  if (res.Code == 200) {
    BillForm.Details = [];
    res.DataMap.forEach((row) => {
      if (row.SkuCount > 0) {
        row.Skus.forEach((SkuRow) => {
          let objSku = {
            Qty: SkuRow.TotalQty,
            RealQty: "",
          };
          objSku.GoodsTitle = row.GoodsTitle;
          objSku.GoodsCode = row.GoodsCode;
          objSku.OrgPrice = row.OrgPrice; //（分）
          objSku.SkuCode = SkuRow.SkuCode;
          objSku.SkuPropertyDesc = SkuRow.PropertyDesc;
          objSku.SkuId = SkuRow.SkuId;
          objSku.GoodsId = row.GoodsId;
          BillForm.Details.push(objSku);
        });
      } else {
        let objGood = {
          SkuCode: "",
          SkuPropertyDesc: "",
          SkuId: "",
          Qty: row.TotalQty,
          RealQty: "",
        };
        objGood.GoodsTitle = row.GoodsTitle;
        objGood.GoodsCode = row.GoodsCode;
        objGood.GoodsId = row.GoodsId;
        objGood.OrgPrice = row.OrgPrice; //（分）
        BillForm.Details.push(objGood);
      }
    });
  }
};
//把交易数量为0的行全部删除掉
const DelQty = () => {
  let NewList = [];
  for (let i = 0; i < BillForm.Details.length; i++) {
    const row = BillForm.Details[i];
    if (row.Qty > 0) {
      NewList.push(row);
    }
  }
  BillForm.Details = NewList;
};
//切换选择的商品信息
const ChangeGoodsId = async (ID) => {
  let list = [];
  goodsData.value.forEach((row) => {
    if (ID == row.GoodsId) {
      list.push(row);
    }
  });
  list.forEach((row) => {
    if (row.SkuCount > 0) {
      row.Skus.forEach((SkuRow) => {
        let objSku = {
          Select: false,
        };
        objSku.GoodsTitle = row.GoodsTitle;
        objSku.GoodsCode = row.GoodsCode;
        objSku.OrgPrice = row.OrgPrice; //（分）
        objSku.SkuCode = SkuRow.SkuCode;
        objSku.SkuPropertyDesc = SkuRow.PropertyDesc;
        objSku.Qty = row.TotalQty;
        objSku.SkuId = SkuRow.SkuId;
        objSku.GoodsId = row.GoodsId;
        GoodsTableData.value.push(objSku);
      });
    } else {
      let objGood = {
        SkuCode: "",
        SkuPropertyDesc: "",
        Select: false,
        SkuId: "",
      };
      objGood.Qty = row.TotalQty;
      objGood.GoodsTitle = row.GoodsTitle;
      objGood.GoodsCode = row.GoodsCode;
      objGood.GoodsId = row.GoodsId;
      objGood.OrgPrice = row.OrgPrice; //（分）
      GoodsTableData.value.push(objGood);
    }
  });
};
//输入框搜索查询
const SelLoading = ref(false);
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await GetGoodsList({
      SearchCondition: {
        search_keyword: SearchQuery,
        goods_status: 1,
        goods_type: 2,
        is_sell: 0,
        get_sku: 1,
        get_stock: 1,
      },
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      goodsData.value = res.DataMap;
    }
  } else {
    goodsData.value = [];
  }
};
//删除已选中的商品列表
const DelRow = (IndexRow) => {
  for (let i = 0; i < BillForm.Details.length; i++) {
    if (IndexRow == i) {
      BillForm.Details.splice(i, 1);
      break;
    }
  }
};
//确认选择的商品
const AddGoods = () => {
  //把选中的数据整理
  if (GoodsIds.value.length == 0) {
    ElMessage.error("请先选择商品");
    return;
  }
  for (let i = 0; i < GoodsIds.value.length; i++) {
    const row = GoodsIds.value[i];
    for (let j = 0; j < GoodsTableData.value.length; j++) {
      const row1 = GoodsTableData.value[j];
      if (row1.SkuId == row.SkuId && row1.GoodsId == row.GoodsId) {
        row1.Select = true;
      }
    }
  }
  GoodsTableData.value.forEach((row) => {
    row.Qty = "";
    row.RealQty = "";
    if (row.Select) {
      BillForm.Details.push(row);
    }
  });
  GoodsVisible.value = false;
};
////////////////////////////////////////////////////////////////////////
const GetGoodsBillsApi = async (ID) => {
  let res = await GetGoodsBills({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    BillForm.BillId = res.DataMap.BillId;
    BillForm.BillDate = res.DataMap.CreateTime;
    BillForm.BillCode = res.DataMap.BillCode;
    BillForm.BillTypeDesc = res.DataMap.BillTypeDesc;

    BillForm.BillRemark = res.DataMap.BillRemark;
    BillForm.Details = res.DataMap.Details;
  }
};
////////////////////////////////////////////////////////////////////////
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    GetGoodsBillsApi(router.currentRoute.value.query.ID);
    Type.value = router.currentRoute.value.query.Type;
  }
  BillForm.BillType = router.currentRoute.value.query.BillType;
  BillForm.BillDate = common.getTime(); //创建时间
};
////////////////////////////////////////////////////////////////////////
const GoodsIds = ref([]);
//订单列表多选
const handleSelectionChange = (val) => {
  GoodsIds.value = val;
};
////////////////////////////////////////////////////////////////////////
Init();
</script>

<style scoped>
::v-deep(.dataTable-current .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
