<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="17">
            <el-form-item label="">
              <h3>
                {{ formData.GoodsCode + " " + formData.GoodsTitle }}-{{
                  (formData.OrgPrice / 100).toFixed(2)
                }}
              </h3>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button v-if="pageType != 'public'" class="button2 button-float" round @click="handleAdd()">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;新增
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
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable1"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column align="center" label="图片" width="160">
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="基础信息">
        <template #default="scope">
          <p><span>商品规格编码: {{ scope.row.SkuCode }}</span></p>
          <p v-if="scope.row.SkuBarcode">条形码: {{ scope.row.SkuBarcode }}</p>
          <p>属性: {{ scope.row.PropertyDesc }}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="价格(元)" v-if="formData.IsSell == 1">
        <template #default="scope">
          <p>原价:{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
          <p>售价:{{ (scope.row.SellPrice / 100).toFixed(2) }}</p>
          <p v-if="formData.WholesaleBeginQty > 0">
            批发价:满{{ formData.WholesaleBeginQty }}件，每件{{
              (scope.row.WholesalePrice / 100).toFixed(2)
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="StockQty" align="center" label="可售" width="80" v-if="formData.IsSell == 1">
      </el-table-column>
      <el-table-column v-if="IsInventory1 == 1" align="center" label="库存（线上）" width="150">
        <template #default="scope">
          <p v-if="IsInventory1 == 1 && scope.row.TotalQty > 0">
            {{ scope.row.TotalQty }}
          </p>
        </template></el-table-column>
      <el-table-column v-if="IsInventory == 1" align="center" label="库存（线下）" width="150">
        <template #default="scope">
          <p v-if="IsInventory == 1 && scope.row.TotalQty2 > 0">
            {{ scope.row.TotalQty2 }}
          </p>
        </template></el-table-column>
      <el-table-column v-if="goodsForm.MallUnitId != formData.CreateUnitId" align="left" label="商城信息(元)">
        <template #default="scope">
          <div v-if="scope.row.MallPrices.length > 0">
            <p>原价：{{ (scope.row.MallPrices[0].OrgPrice / 100).toFixed(2) }}</p>
            <p>售价：{{
              (scope.row.MallPrices[0].SellPrice / 100).toFixed(2) }}</p>
            <p>商城:{{ MallUnitName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template #default="scope">
          <p>{{ scope.row.SkuStatus == 0 ? "停用" : "正常" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="pageType != 'public' && (scope.row.CreateUnitId == loginUser.UnitId)"
              class="button-op-edit" size="small" @click="handleEdit(scope.row.SkuId)">编辑
            </el-button>
            <el-button
              v-if="scope.row.SkuStatus == 1 && pageType != 'public' && (scope.row.CreateUnitId == loginUser.UnitId)"
              class="button-op-edit" size="small" @click="handleDisable(scope.row.SkuId)">停用
            </el-button>
            <el-button
              v-if="scope.row.SkuStatus == 0 && pageType != 'public' && (scope.row.CreateUnitId == loginUser.UnitId)"
              class="button-op-edit" size="small" @click="handleEnable(scope.row.SkuId)">启用
            </el-button>
            <el-button v-if="
              loginUser.UnitId == scope.row.CreateUnitId &&
              IsRight2 &&
              formData.IsSell == 1 &&
              pageType != 'public'
            " class="button-op-edit" size="small" @click="handleAddInventory(scope.row.SkuId)">增加库存
            </el-button>
            <el-button v-if="formData.IsSell == 1" class="button-op-edit" size="small"
              @click="handleViewInventory(scope.row.SkuId)">库存变动历史
            </el-button>
            <el-button v-if="pageType == 'public' && loginUser.UnitId == scope.row.CreateUnitId" class="button-op-edit"
              size="small" @click="setBtn(scope.row.SkuId)">设置
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增Sku -->
    <el-dialog title="编辑/新增SKU" v-model="SkuVisible" width="38%" :show-close="true">
      <div style="width:100%;height: 18px;"></div>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-row>
          <el-col :span="18">
            <el-form-item prop="SkuCode" label="商品规格编码">
              <el-input v-model="form.SkuCode" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="OrgPrice" label="原价">
              <el-input type="number" v-model="form.OrgPrice">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.IsSell == 1">
          <el-col :span="18">
            <el-form-item prop="SellPrice" label="售价">
              <el-input type="number" v-model="form.SellPrice">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.IsSell == 1 && formData.WholesaleBeginQty > 0">
          <el-col :span="18">
            <el-form-item label="每满">
              <el-input v-model="formData.WholesaleBeginQty" disabled>
                <template #append>件</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="每件">
              <el-input v-model="form.WholesalePrice">
                <template #append>元</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="条形码">
              <el-input v-model="form.SkuBarcode" maxlength="20" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.SkuId == '' && formData.IsSell == 1">
          <el-col :span="18">
            <el-form-item label="库存">
              <el-input v-model="form.TotalQty"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <div v-for="(item, index) in GoodsPropertiesList" :key="index">
              <el-form-item :label="item.Name">
                <el-radio-group v-model="item.value" :key="index">
                  <div style="padding-right: 20px" v-for="(item, index) in item.Details" :key="index">
                    <el-radio v-if="item.Status == 1" :label="item.Id">{{
                      item.Name
                    }}</el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="图片">
              <el-input v-model="form.ListImg" v-if="false"></el-input>
              <el-upload class="sku-uploader" ref="upload" :show-file-list="false" action="#" :http-request="SuccessImg"
                :auto-upload="true">
                <img v-if="form.ListImg" :src="form.ListImg" class="sku-uploader-avatar" />
                <i v-else class="el-icon-mpzengjia"></i>
              </el-upload>
              <p class="text">
                300*300 且不超过500k
                <span style="cursor: pointer; color: #ff6666" class="el-icon-delete" v-if="form.ListImg"
                  @click="clear">删除</span>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button class="button1" round :loading="btnSkuLoading" @click="SkuSaveBtn">
            <el-icon>
              <CirclePlus />
            </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
          </el-button>
          <el-button class="button2" round
            @click="SkuVisible = false">&nbsp;&nbsp;关&nbsp;&nbsp;闭&nbsp;&nbsp;</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 增加库存 -->
    <el-dialog title="增加库存" v-model="inventoryVisible" width="40%" :show-close="false">
      <div style="width:100%;height:10px"></div>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="数量">
              <el-input v-model="inventory" clearable placeholder="请输入数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入备注"
                v-model="inventoryRemark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="inventoryLoading" @click="saveInventoryBtn">保 存</el-button>
          <el-button class="button2" @click="inventoryVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 库存变更历史 -->
    <el-dialog class="inventory-top" title="库存变更历史" v-model="inventoryHistoryVisible" width="60%" :show-close="false">
      <goodsQty ref="editor" :goodID="goodID" :skuID="skuID" :openModal="inventoryHistoryVisible">
      </goodsQty>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="inventoryHistoryVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 价格设置 -->
    <el-dialog title="价格设置" v-model="PriceVisible" width="30%" :show-close="false">
      <div style="width:100%;height:18px"></div>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="原价">
              <el-input v-model="goodsForm.OrgPrice">
                <template #append>元</template></el-input>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="零售价">
              <el-input v-model="goodsForm.SellPrice">
                <template #append>元</template></el-input>
            </el-form-item></el-col>
        </el-row>
        <el-row v-if="formData.WholesaleBeginQty > 0">
          <!-- <el-col :span="12">
            <el-form-item label="满">
              <el-input v-model="goodsForm.WholesaleBeginQty">
                <template #append>件</template></el-input
              >
            </el-form-item></el-col
          > -->
          <el-col :span="12">
            <el-form-item label="批发价">
              <el-input v-model="goodsForm.WholesalePrice">
                <template #append>元</template></el-input>
            </el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="PriceLoading" @click="SavePriceBtn">保 存</el-button>
          <el-button class="button2" @click="PriceVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { UploadSingle } from "@/api/imgapi.js";
import Cookie from "js-cookie";
import goodsQty from "@/components/common/GoodsQty.vue";
import { HasRightes, GetUnitConfigs, GetTicketBrokerUnitList } from "@/api/index.js";
import {
  GetGoods,
  GetMallGoods,
  GetSkuById,
  SaveSku,
  EnableSku,
  DisableSku,
  GetPropertyList,
  AddGoodsTotalQty,
  SaveGoodsMallPrice,
} from "@/api/goods.js";
const router = useRouter();

const tableLoading = ref(false);
const tableData = ref([]);
const IsRight = ref(false);
const IsRight1 = ref(false);
const IsRight2 = ref(false);

const multipleTable1 = ref(null);

//获取商品详情信息
const formData = reactive({
  GoodsId: "",
  GoodsType: "",
  GoodsCode: "",
  GoodsTitle: "",
  GoodsSubTitle: "",
  OrgPrice: "",
  IsSell: "", //是否能销售
  GoodsBarcode: "",
  GoodsTypeDesc: "",
  CreateUnitId: "",
});
const BoolRight = async () => {
  let arr = ["view_ticket_password", "edit_tickettemplate", "edit_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.view_ticket_password;
    IsRight1.value = res.DataMap.edit_tickettemplate;
    IsRight2.value = res.DataMap.edit_goods;
  }
};
//Sku编辑弹框
const editType = ref(""); //编辑权限操作
const GoodsPropertiesList = ref([]);
const GoodsPropertiesDetailList = ref([]); //属性明细
const loginUser = JSON.parse(Cookie.get("User"));
const SkuVisible = ref(false);
const rules = {
  SkuCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
  SkuBarcode: [{ required: true, message: "请输入条形码", trigger: "blur" }],
  OrgPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
};
const formRef = ref(null);
//获取商品SKU详情信息
let form = reactive({
  UnitId: "", //商城所属的单位
  GoodsId: "",
  SkuId: "",
  SkuCode: "",
  SkuBarcode: "",
  ListImg: "",
  OrgPrice: "",
  WholesalePrice: "", //批发价
  WholesaleBeginQty: "", //批发价起批量
  SellPrice: "",
  SkuConfig: "",
  GoodsConfig: "",
  TotalQty: "", //库存
  SkuProperties: [],
});
const btnSkuLoading = ref(false);
//Sku保存
const SkuSaveBtn = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnSkuLoading.value = true;
      let Sku = JSON.parse(JSON.stringify(form));
      let SkuProperties = [];

      let isError = "";
      let ErrDesc = "";
      GoodsPropertiesList.value.forEach((row) => {
        if (row.value == "") {
          isError = 1;
          ErrDesc += `属性：${row.Name}，尚未选择对应sku明细，`;
        }
        SkuProperties.push({
          PropId: row.Id,
          PropDetailId: row.value,
        });
      });
      if (isError == 1) {
        ElMessage.error(ErrDesc);
        btnSkuLoading.value = false;
        return;
      }
      Sku.SkuProperties = SkuProperties;
      Sku.OrgPrice = Sku.OrgPrice * 100;
      Sku.SellPrice = Sku.SellPrice * 100;
      Sku.WholesalePrice = Sku.WholesalePrice * 100;
      let res = await SaveSku({
        Sku: Sku,
      });
      btnSkuLoading.value = false;
      if (res.Code == 200) {
        GetGoodsID(form.GoodsId);
        SkuVisible.value = false;
        ElMessage.success("保存成功");
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
// 新增Sku
const handleAdd = () => {
  SkuVisible.value = true;
  editType.value = "add";
  form.SkuId = "";
  form.SkuCode = "";
  form.SkuBarcode = "";
  form.ListImg = "";
  form.TotalQty = "";
  form.WholesalePrice = "";
  form.WholesaleBeginQty = "";
  form.OrgPrice = (formData.OrgPrice / 100).toFixed(2);
  form.SellPrice = (formData.SellPrice / 100).toFixed(2);
  form.SkuProperties = [];
  GoodsPropertiesList.value.forEach((row) => {
    row.value = "";
  });
};
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.ListImg = res.DataMap.HttpsUrl;
    }
  });
};
const clear = () => {
  form.ListImg = "";
};
//获取属性数据
const GetPropertbyList = async () => {
  let res = await GetPropertyList({
    SearchCondition: {
      get_prop_detail: 1,
      prop_detail_goods_id: formData.GoodsId,
    },
  });
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      row.value = "";
    });
    GoodsPropertiesList.value = res.DataMap;
  }
};
//选中了某个属性值
const chooseProperties = async (value, PropId) => {
  if (value) {
    GoodsPropertiesList.value.forEach((row) => {
      if (PropId == row.Id) {
        GoodsPropertiesDetailList.value.push({
          propId: PropId,
          value: "",
          arr: row.Details,
          PropName: row.PropName,
        });
      }
    });
  } else {
    GoodsPropertiesDetailList.value.forEach((row, index) => {
      if (PropId == row.propId) {
        GoodsPropertiesDetailList.value.splice(index, 1);
      }
    });
  }
};
// 查询操作
const handleSearch = () => {
  GetGoodsID(form.GoodsId);
};
//停用
const handleDisable = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableSku({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      GetGoodsID(form.GoodsId);
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableSku({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      GetGoodsID(form.GoodsId);
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//编辑
const handleEdit = async (ID) => {
  editType.value = "edit";
  let res = await GetSkuById({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    SkuVisible.value = true;
    form.SkuId = ID;
    form.GoodsId = res.DataMap.GoodsId;
    form.WholesalePrice = (res.DataMap.WholesalePrice / 100).toFixed(2);
    form.SkuCode = res.DataMap.SkuCode;
    form.SkuBarcode = res.DataMap.SkuBarcode;
    form.ListImg = res.DataMap.ListImg;
    form.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
    form.SellPrice = (res.DataMap.SellPrice / 100).toFixed(2);

    form.SkuProperties = res.DataMap.SkuProperties;
    GoodsPropertiesList.value.forEach((row) => {
      row.Details.forEach((row1) => {
        res.DataMap.SkuProperties.forEach((row2) => {
          if (row2.PropDetailId == row1.Id) {
            row.value = row2.PropDetailId;
          }
        });
      });
    });
  } else {
    ElMessage.error(res.Message);
  }
};
const GetGoodsID = async (ID) => {
  tableLoading.value = true;
  let res = null;
  if (form.UnitId) {
    res = await GetMallGoods({
      GoodsId: ID,
      UnitId: form.UnitId,
    });
  } else {
    res = await GetGoods({
      ObjectId: ID,
    });
  }
  tableLoading.value = false;
  if (res.Code == 200) {
    formData.CreateUnitId = res.DataMap.CreateUnitId;
    formData.GoodsId = res.DataMap.GoodsId;
    formData.GoodsType = res.DataMap.GoodsType;
    formData.GoodsTitle = res.DataMap.GoodsTitle;
    formData.GoodsCode = res.DataMap.GoodsCode;
    formData.GoodsSubTitle = res.DataMap.GoodsSubTitle;
    formData.OrgPrice = res.DataMap.OrgPrice;
    formData.SellPrice = res.DataMap.SellPrice;
    formData.IsSell = res.DataMap.IsSell;
    formData.GoodsBarcode = res.DataMap.GoodsBarcode;
    formData.GoodsTypeDesc = res.DataMap.GoodsTypeDesc;
    formData.WholesaleBeginQty = res.DataMap.WholesaleBeginQty;
    tableData.value = res.DataMap.Skus;
    res.DataMap.GoodsProperties.forEach((row) => {
      row.value = "";
    });
    GoodsPropertiesList.value = res.DataMap.GoodsProperties;
  }
  // GetPropertbyList();
};
////////////////////////////////////////////////////////////////
const inventoryVisible = ref(false);
const inventoryLoading = ref(false);

const inventory = ref("");
const inventoryRemark = ref("");
const SkuIdID = ref("");

const handleAddInventory = (ID) => {
  SkuIdID.value = ID;
  inventory.value = "";
  inventoryRemark.value = "";
  inventoryVisible.value = true;
};
const saveInventoryBtn = async () => {
  if (inventory.value == "") {
    ElMessage.error("数量不能为空");
    return;
  }
  inventoryLoading.value = true;
  let res = await AddGoodsTotalQty({
    GoodsId: formData.GoodsId,
    SkuId: SkuIdID.value,
    Qty: inventory.value,
    Remark: inventoryRemark.value,
  });
  inventoryLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("操作成功！");
    handleSearch();
    inventoryVisible.value = false;
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////
const goodID = ref("");
const skuID = ref("");
const inventoryHistoryVisible = ref(false);
//查看库存变更历史
const handleViewInventory = (ID) => {
  goodID.value = form.GoodsId;
  skuID.value = ID;
  inventoryHistoryVisible.value = true;
};
////////////////////////////////////////////////////////////////
let PriceLoading = ref(false);
let PriceVisible = ref(false);
let goodsForm = reactive({
  GoodsId: "",
  OrgPrice: "",
  SellPrice: "",
  SkuId: "",
  MallUnitId: "",
  WholesaleBeginQty: "",
  WholesalePrice: "",
});
const setBtn = (SkuID) => {
  goodsForm.SkuId = SkuID;
  tableData.value.forEach((row) => {
    if (row.SkuId == SkuID) {
      goodsForm.OrgPrice = (row.OrgPrice / 100).toFixed(2);
      goodsForm.SellPrice = (row.SellPrice / 100).toFixed(2);
      goodsForm.WholesalePrice = (row.WholesalePrice / 100).toFixed(2);
      goodsForm.WholesaleBeginQty = formData.WholesaleBeginQty;
    }
  });
  PriceVisible.value = true;
};
const SavePriceBtn = async () => {
  if (goodsForm.SellPrice == "") {
    ElMessage.error("请输入零售价");
    return;
  }
  if (goodsForm.OrgPrice == "") {
    ElMessage.error("请输入原价");
    return;
  }
  PriceLoading.value = true;
  let res = await SaveGoodsMallPrice({
    GoodsId: goodsForm.GoodsId,
    MallUnitId: goodsForm.MallUnitId,
    SkuId: goodsForm.SkuId,
    SellPrice: goodsForm.SellPrice * 100,
    OrgPrice: goodsForm.OrgPrice * 100,
    WholesalePrice: goodsForm.WholesalePrice * 100,
    WholesaleBeginQty: formData.WholesaleBeginQty,
  });
  PriceLoading.value = false;
  if (res.Code == 200) {
    goodsForm.SellPrice = "";
    goodsForm.OrgPrice = "";
    goodsForm.WholesalePrice = "";
    goodsForm.WholesaleBeginQty = "";
    ElMessage.success("保存成功");
    PriceVisible.value = false;
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////
//获取当前券商是否线下库存
const IsInventory = ref(""); //是否校验商品的库存线下(1:是)
const IsInventory1 = ref(""); //是否校验商品的库存线上(1:是)
const GetUnitConfigsApi = async () => {
  let res = await GetUnitConfigs({
    ObjectId: loginUser.UnitId,
  });
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      if (row.ConfigKey == "check.goods.stock.when.exchange.in.shop") {
        IsInventory.value = row.ConfigValue;
      }
      if (row.ConfigKey == "check.goods.stock.when.exchange.online") {
        IsInventory1.value = row.ConfigValue;
      }
    });
  }
};
const MallUnitName = ref("礼牛商城");
const GetUnitListAPi = async (MallUnitId) => {
  if (MallUnitId) {
    let res = await GetTicketBrokerUnitList({
      SearchCondition: {
        unit_status: 1,
      },
    });
    if (res.Code == 200) {
      for (let i = 0; i < res.DataMap.length; i++) {
        const element = res.DataMap[i];
        if (element.UnitId == MallUnitId) {
          MallUnitName.value = element.UnitName;
          break;
        }
      }
    }
  }

};
GetUnitConfigsApi();
////////////////////////////////////////////////////////////////
//价格设置
////////////////////////////////////////////////////////////////
const pageType = ref(""); //private:平台 public:私域
if (router.currentRoute.value.query.ID) {
  //根据id来查询详情
  goodsForm.GoodsId = router.currentRoute.value.query.ID;
  goodsForm.MallUnitId = router.currentRoute.value.query.UnitID
    ? router.currentRoute.value.query.UnitID
    : "";
  form.UnitId = goodsForm.MallUnitId;
  form.GoodsId = router.currentRoute.value.query.ID;
  pageType.value = router.currentRoute.value.query.type
    ? router.currentRoute.value.query.type
    : "";

  GetGoodsID(router.currentRoute.value.query.ID);
  // getData();
  //审批权限控制
  BoolRight();
  GetUnitListAPi(goodsForm.MallUnitId)
}

////////////////////////////////////////////////////////////////
</script>

<style scoped>
::v-deep(.inventory-top .el-dialog__body) {
  padding-top: 10px !important;
}

.radio_group_list .el-radio-group {
  padding-right: 20px;
}

.detail-desc {
  text-align: center;
  width: 100%;
}
</style>
<style>
.sku-uploader {
  width: 150px;
  height: 150px;
}

.sku-uploader .el-upload {
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.sku-uploader-avatar {
  width: 100%;
}
</style>
