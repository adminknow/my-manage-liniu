<!--
  卡券批次信息页面
  功能：创建和编辑卡券批次信息，包括基本信息、兑换信息和成功提示三个步骤
  使用组件：
  - TicketSteps: 步骤导航组件
  - BasicInfoForm: 基本信息表单组件
  - ExchangeInfoForm: 兑换信息表单组件
  - SuccessTip: 成功提示组件
  使用可组合函数：
  - useTicketForm: 表单数据管理
  - useTicketApi: API 调用逻辑
  - useDateHandler: 日期处理逻辑
  - useGoodsHandler: 商品处理逻辑
-->
<template>
  <div class="container">
    <!-- 步骤导航组件 -->
    <TicketSteps :activeIndex="activeIndex" />

    <!-- 基本信息表单组件 -->
    <BasicInfoForm
      v-if="activeIndex == 0"
      ref="formRef"
      :formOne="formOne"
      :formData="formData"
      :Type="Type"
      :User="User"
      :brands="brands"
      :Templates="Templates"
      :defaultTime2="defaultTime2"
      @CouponTypeChange="CouponTypeChange"
      @changeDatetimeRange="changeDatetimeRange"
      @btnRefresh="btnRefresh"
      @btnTemplates="btnTemplates"
      @SuccessImg="SuccessImg"
      @beforeUpload="beforeUpload"
      @clear="clear"
      @validateDiscount="validateDiscount"
      @onSubmitOne="onSubmitOne"
      @onReturn="onReturn"
      :onSubmitOneLoading="onSubmitOneLoading"
    />

    <!-- 兑换信息表单组件 -->
    <ExchangeInfoForm
      v-if="activeIndex == 1"
      ref="formRefT"
      :formTwo="formTwo"
      :formOne="formOne"
      :formData="formData"
      :Type="Type"
      :isDisabled="isDisabled"
      :goods="goods"
      :packageDetails="packageDetails"
      @onBackOne="onBackOne"
      @submit-two="onSubmitTwo"
      @update:goods="goods = $event"
      @update:packageDetails="updatePackageDetails"
      :onSubmitTwoLoading="onSubmitTwoLoading"
    />

    <!-- 成功提示组件 -->
    <SuccessTip
      v-if="activeIndex == 2"
      :ticketTemplateInfo="ticketTemplateInfo"
      @back-list="onBackList"
    />

    <!-- 选择兑换点弹出框 -->
    <el-dialog title="新增模板" v-model="distributionTemplateModal" width="60%" :show-close="false">
      <distributionTemplate ref="editor"> </distributionTemplate>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="distributionTemplateModal = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 可销售商品列表 -->
    <goods-modal :GoodsVisible="ComponentsGoodVisible" :list="{ data: formTwo.tableData }" @CloseVisible="CloseVisible"
      @ConFirm="SaveTable"></goods-modal>

    <!-- 添加供应商 -->
    <add-supplier :visible="addSupplierVisible" :selItems="formTwo.unitIdTableData" @conFirm="saveUnitList"
      @closeVisible="closeAddSupplierVisible"></add-supplier>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";

// 导入组件
import TicketSteps from "@/components/ticket/TicketSteps.vue";
import BasicInfoForm from "@/components/ticket/BasicInfoForm.vue";
import ExchangeInfoForm from "@/components/ticket/ExchangeInfoForm.vue";
import SuccessTip from "@/components/ticket/SuccessTip.vue";

// 导入其他组件
import tinymceEditor from "@/components/common/tinymce.vue";
import distributionTemplate from "@/components/common/ticketlete.vue";
import GoodsModal from "@/components/Modal/GoodsModal.vue";
import addSupplier from "@/components/ticket/addSupplier.vue";

// 导入可组合函数
import { useTicketForm } from "@/composables/ticket/useTicketForm.js";
import { useTicketApi } from "@/composables/ticket/useTicketApi.js";
import { useDateHandler } from "@/composables/ticket/useDateHandler.js";
import { useGoodsHandler } from "@/composables/ticket/useGoodsHandler.js";

// 初始化
const store = useStore();
const router = useRouter();
const User = JSON.parse(Cookie.get("User"));

// 使用可组合函数
const {
  formData,
  formOne,
  formTwo,
  rulesOne,
  rulesTwo,
  validatePass2,
  checkTicketCode,
  checkRandomCharCode,
  validateDiscount
} = useTicketForm();

const {
  getTicketTemplateById,
  saveTicketTemplate,
  searchTicketTemplates,
  getBrands,
  getExpressTemplates,
  searchGoods,
  getGoodsById,
  uploadImage,
  getSuppliers,
  brands,
  Templates
} = useTicketApi();

const {
  changeDatetimeRange,
  processValidTime,
  processExchangeTime
} = useDateHandler();

const {
  addGoods,
  delGoodBtn,
  addNumberBtn,
  reduceNumberBtn,
  remoteMethod,
  changeGoodsData,
  clearGoodsData,
  GoodsDetailClick,
  addTickets,
  delTicketBtn,
  addTicketNumberBtn,
  reduceTicketNumberBtn,
  remoteMethodTicket,
  changeTicketsData,
  clearTicketsData
} = useGoodsHandler();

// 页面状态
const activeIndex = ref(0);
const Type = ref("");
const formRef = ref(null);
const formRefT = ref(null);
const isDisabled = ref(false);
const onSubmitOneLoading = ref(false);
const onSubmitTwoLoading = ref(false);
const distributionTemplateModal = ref(false);

// 数据列表
const goodsData = ref([]);
const ticketsData = ref([]);
const loading = ref(false);
const ticketTemplateInfo = ref([]);

// 商品数组
const goods = ref([
  {
    title: "",
    subtitle: "",
    price: "",
    img: "",
    GoodsId: "",
    GoodsName: "",
    number: "1",
    GoodsStatusDesc: "",
  },
]);

// 卡券数组
const packageDetails = reactive([
  {
    ListImg: "",
    TicketTemplateCode: "",
    PackageTicketTemplateId: "",
    TicketTemplateTitle: "",
    TicketTemplateId: "",
    Qty: "",
    ValidDateConfig: "",
    ValidDateConfigDesc: {
      FixedBeginTime: "",
      FixedEndTime: "",
      Type: "0",
      Interval: "1",
      IntervalUnit: "12",
      time: [],
    },
    ExchangeDateConfig: "",
    ExchangeDateConfigDesc: {
      ListImg: "",
      TicketTemplateCode: "",
      time: [],
      FixedBeginTime: "",
      FixedEndTime: "",
      Type: "1",
    },
  },
]);

// 默认时间
const defaultTime2 = [
  new Date(2023, 1, 1, 0, 0, 0),
  new Date(2023, 2, 1, 23, 59, 59),
];
const defaultDate2 = [new Date(2023, 2, 1, 23, 59, 59)];

// 商品选择相关
const ComponentsGoodVisible = ref(false);
const addSupplierVisible = ref(false);

/**
 * 更新 packageDetails 数组
 * @param {Array} newPackageDetails - 新的 packageDetails 数组
 */
const updatePackageDetails = (newPackageDetails) => {
  // 清空现有的 packageDetails 数组
  packageDetails.splice(0, packageDetails.length);
  // 添加新的元素
  newPackageDetails.forEach(item => {
    packageDetails.push(item);
  });
};

/**
 * 处理第一步提交
 * 验证基本信息表单并跳转到第二步
 */
const onSubmitOne = async () => {
  try {
    const valid = await new Promise((resolve) => {
      formRef.value.validate((valid) => {
        resolve(valid);
      });
    });

    if (valid) {
      let form = formOne;
      onSubmitOneLoading.value = true;
      try {
        if (form.ValidDateType == 1) {
          if (form.time && form.time.length === 2 && typeof form.time[0] != "string") {
            const formatDate = (date) => {
              if (!date) {
                return "";
              }
              try {
                return common
                  .dateFormatByInt(common.dateFormat("YYYY-mm-dd HH:MM:SS", date))
                  .toString();
              } catch (error) {
                console.error("日期格式化错误:", error);
                return "";
              }
            };
            const beginDate = formatDate(form.time[0]);
            const endDate = formatDate(form.time[1]);

            form.ValidBeginDate = beginDate;
            form.ValidEndDate = endDate;
            form.ExchangeBeginDate = beginDate;
            form.ExchangeEndDate = endDate;
          }
        }
        if (form.ExchangeDateType == 1) {
          if (form.time1 && form.time1.length === 2 && typeof form.time1[0] != "string") {
            const formatDateToString = (date) => {
              if (!date) {
                return "99991231235959";
              }
              try {
                return common
                  .dateFormatByInt(common.dateFormat("YYYY-mm-dd HH:MM:SS", date))
                  .toString();
              } catch (error) {
                console.error("日期格式化错误:", error);
                return "99991231235959";
              }
            };

            form.ExchangeBeginDate = formatDateToString(form.time1[0]);
            form.ExchangeEndDate = formatDateToString(form.time1[1]);
          }
        }
        const cashCardTypes = [4, 5, 6, 7];
        formData.ExchangeDateType = cashCardTypes.includes(
          Number(formOne.CouponType)
        )
          ? 0
          : form.ExchangeDateType;

        formData.ValidDateType = form.ValidDateType;
        formData.ValidDateAdd = form.ValidDateAdd;
        formData.ExchangeDateAdd = form.ExchangeDateAdd;
        formData.TicketTemplateTitle = form.TicketTemplateTitle;
        formData.TicketTemplateCode = form.TicketTemplateCode;
        formData.CanUsePublic = form.CanUsePublic;
        formData.ListImg = form.ListImg;
        formData.OrgPrice = form.OrgPrice * 100;
        formData.PayPrice = form.PayPrice * 100;//支付价格
        formData.ValidBeginDate = form.ValidBeginDate;
        formData.ValidEndDate = form.ValidEndDate;
        formData.ExchangeBeginDate = form.ExchangeBeginDate;
        formData.ExchangeEndDate = form.ExchangeEndDate;

        formData.HasPass = form.HasPass ? "1" : "0";
        formData.BrandId = form.BrandId;
        formData.TicketCodeCustomize = form.TicketCodeCustomize ? "1" : "0";

        let obj = {
          ActivateKind: form.ActivateKind,
          PasswordLength: form.PasswordLength,
          CanUseInSpecialShop: form.CanUseInSpecialShop,
          CannotGive: form.CannotGive,
          CreateTicketCount: form.CreateTicketCount,
          BeginIndex: form.BeginIndex,
          TicketIndexLengthInCode: form.TicketIndexLengthInCode,
          RandomCharType: form.RandomCharType,
          RandomCharLengthInCode: form.RandomCharLengthInCode,
          TicketCodeCustomize: form.TicketCodeCustomize ? "1" : "0",
          Discount: form.Discount,
        };
        if (form.DeliverType == 21 || form.DeliverType == 22) {
          obj.NeedPreBookWhenPickup = form.NeedPreBookWhenPickupDesc;
          obj.ForwardDaysWhenPreBook = form.ForwardDaysWhenPreBook
            ? form.ForwardDaysWhenPreBook
            : 0;
        }
        formData.DeliverType = form.DeliverType;
        form.TicketTemplateConfig = JSON.stringify(obj);
        formData.TicketTemplateConfig = form.TicketTemplateConfig;
        formData.ExpressTemplateId = form.ExpressTemplateId;
        
        // 确保所有操作完成后再更新状态
        setTimeout(() => {
          onSubmitOneLoading.value = false;
          activeIndex.value = 1;
        }, 0);
      } catch (error) {
        console.error("提交基本信息出错:", error);
        ElMessage.error("提交失败，请重试");
        onSubmitOneLoading.value = false;
      }
    }
  } catch (error) {
    console.error("表单验证出错:", error);
    ElMessage.error("验证失败，请检查表单");
  }
};

/**
 * 处理第二步提交
 * 验证兑换信息表单并提交数据
 */
const onSubmitTwo = async () => {
  try {
    const valid = await new Promise((resolve) => {
      formRefT.value.validate((valid) => {
        resolve(valid);
      });
    });

    if (!valid) {
      console.warn("兑换信息表单验证失败");
      return false;
    }

    try {
      const form = formTwo;

      formData.ExchangeGoodses = [];
      formData.PackageDetails = [];

      processTicketTemplateConfig();

      const couponHandlers = {
        1: processSingleChoiceCard,
        2: processMultipleChoiceCard,
        3: processTicketPackage,
        6: processStoredValueCard,
        5: processCashTicket,
        4: processDiscountTicket,
        7: processPointCard,
      };

      const couponType = Number(formOne.CouponType);
      console.log("处理券类型:", couponType);
      
      if (couponHandlers[couponType]) {
        const validationResult = await couponHandlers[couponType]();
        if (!validationResult) {
          console.warn("券类型验证失败:", couponType);
          return;
        }
      } else {
        console.warn("未找到券类型处理函数:", couponType);
        ElMessage.error("券类型处理失败，请联系管理员");
        return;
      }

      formData.ExchangeRemark = form.ExchangeRemark;
      onSubmitTwoLoading.value = true;
      console.log("提交卡券模板数据:", formData);
      
      const res = await saveTicketTemplate(formData);
      console.log("提交卡券模板结果:", res);
      
      onSubmitTwoLoading.value = false;

      if (res.Code == 200) {
        console.log("卡券模板提交成功:", res.DataMap);
        activeIndex.value = 2;
        try {
          res.DataMap.TicketTemplateConfigDesc = JSON.parse(
            res.DataMap.TicketTemplateConfig
          );
        } catch (e) {
          console.error("解析票据配置失败:", e);
        }
        ticketTemplateInfo.value = res.DataMap;
      } else {
        console.warn("卡券模板提交失败:", res.Message);
        ElMessage.info(res.Message || "提交失败，请重试");
      }
    } catch (error) {
      console.error("提交兑换信息出错:", error);
      onSubmitTwoLoading.value = false;
      // ElMessage.error(`提交出错: ${error.message || "未知错误"}`);
    }
  } catch (error) {
    console.error("表单验证出错:", error);
    ElMessage.error("验证失败，请检查表单");
  }
};

/**
 * 处理模板配置
 */
function processTicketTemplateConfig() {
  if (formData.TicketTemplateConfig != "") {
    const config = JSON.parse(formData.TicketTemplateConfig);
    config.FullAmountTypeOfCashTicket = formTwo.FullAmountTypeOfCashTicket;
    config.CanUseMultiInOneOrderOfCashTicket =
      formTwo.CanUseMultiInOneOrderOfCashTicket;
    config.EveryGoodsCanSubOfCashTicket =
      formTwo.EveryGoodsCanSubOfCashTicket;

    formData.TicketTemplateConfig = JSON.stringify(config);
  }

  goods.value.forEach((row) => {
    formData.ExchangeGoodses.push({
      Qty: row.number,
      GoodsId: row.GoodsId,
    });
  });

  formData.TicketTemplateType = 0;
  formData.GoodsQty = 1;
}

/**
 * 处理单选卡
 */
function processSingleChoiceCard() {
  if (formData.ExchangeGoodses[0]?.GoodsId == "") {
    formData.ExchangeGoodses = [];
  }
  CheckGoodsStock();
  return true;
}

/**
 * 处理多选卡
 */
function processMultipleChoiceCard() {
  formData.GoodsQty = formTwo.chooseOne;
  formData.ExchangeGoodsQty = formTwo.chooseTwo;
  CheckGoodsStock();
  if (formData.GoodsQty == 1) {
    ElMessage.info("多选商品卡券类型，商品数必须大于1");
    return false;
  }

  const invalidGoods = formData.ExchangeGoodses.filter(
    (row) => row.GoodsId == ""
  ).length;
  if (invalidGoods > 0) {
    ElMessage.info("请设置好商品数量");
    return false;
  }
  return true;
}

/**
 * 检查商品库存
 */
function CheckGoodsStock() {
  if (formData.TicketTemplateConfig != "") {
    const config = JSON.parse(formData.TicketTemplateConfig);
    config.CheckGoodsStockWhenExchangeShop = formTwo.CheckGoodsStockWhenExchangeShop;
    config.CheckGoodsStockWhenExchangeOnline =
      formTwo.CheckGoodsStockWhenExchangeOnline;

    formData.TicketTemplateConfig = JSON.stringify(config);
  }
}

/**
 * 处理券包
 */
function processTicketPackage() {
  formData.TicketTemplateType = 10;
  formData.ExchangeGoodses = [];

  if (packageDetails.length == 0 || packageDetails[0].TicketTemplateId == "") {
    ElMessage.info("请先添加卡券");
    return false;
  }

  let hasTimeError = false;

  packageDetails.forEach((row) => {
    hasTimeError = processValidTime(row) || hasTimeError;
    processExchangeTime(row);
    formData.PackageDetails.push({
      PackageTicketTemplateId: row.PackageTicketTemplateId,
      TicketTemplateId: row.TicketTemplateId,
      Qty: row.Qty,
      ValidDateConfig: row.ValidDateConfig,
      ExchangeDateConfig: row.ExchangeDateConfig,
    });
  });

  if (hasTimeError) {
    ElMessage.info("请选择起始时间");
    return false;
  }
  return true;
}

/**
 * 处理现金券
 */
function processCashTicket() {
  formData.ExchangeGoodses = [];
  formData.TicketTemplateType = 5;
  formData.UsePayThreshold = formTwo.UsePayThreshold * 100;

  return processUsableGoods();
}

/**
 * 处理储值卡
 */
function processStoredValueCard() {
  formData.ExchangeGoodses = [];
  formData.TicketTemplateType = 6;

  return processUsableGoods();
}

/**
 * 处理折扣券
 */
function processDiscountTicket() {
  formData.ExchangeGoodses = [];
  formData.TicketTemplateType = 4;
  formData.OrgPrice = formData.OrgPrice / 100;

  return processUsableGoods();
}

/**
 * 处理点卡
 */
function processPointCard() {
  formData.ExchangeGoodses = [];
  formData.TicketTemplateType = 7;

  return processUsableGoods();
}

/**
 * 处理可使用商品
 */
function processUsableGoods() {
  formData.CanUseTicketBrokerUnitIds = "";
  formData.UseGoodsScopeType = formTwo.UseGoodsScopeType;

  if (formTwo.UseGoodsScopeType == 1 && formTwo.tableData.length == 0) {
    ElMessage.info("请先添加可使用商品");
    return false;
  }
  if (formTwo.UseGoodsScopeType == 2 && formTwo.unitIdTableData.length == 0) {
    ElMessage.info("请先添加可使用供应商");
    return false;
  }
  if (formTwo.UseGoodsScopeType == 2) {
    let list = JSON.parse(formData.TicketTemplateConfig);
    formData.CanUseTicketBrokerUnitIds = formTwo.unitIdTableData
      .map((item) => item.UnitId)
      .join(";");
    list.CanUseTicketBrokerUnitIds = formData.CanUseTicketBrokerUnitIds;
    formData.TicketTemplateConfig = JSON.stringify(list);
  }
  formData.UseGoodses = formTwo.tableData;
  return true;
}

/**
 * 返回上一步
 */
const onBackOne = () => {
  activeIndex.value = 0;
};

/**
 * 返回列表页
 */
const onBackList = () => {
  common.ClosePageTag("卡券详情");
  store.commit("tags/setPageSaerch", {
    Search: 1,
    titlePage: "卡券列表",
  });
  router.push({
    path: "/ticket_batch_more",
  });
};

/**
 * 返回上一页
 */
const onReturn = async () => {
  common.ClosePageTag("卡券详情");
  router.back();
};

/**
 * 刷新配送模板
 */
const btnRefresh = () => {
  GetGetExpressTemplateList();
};

/**
 * 跳转到配送模板页面
 */
const btnTemplates = () => {
  router.push({
    path: "/distribution_template",
  });
};

/**
 * 获取富文本编辑器输入
 */
const getTinymceInput = async (val) => {
  formTwo.ExchangeRemark = val;
};

/**
 * 获取品牌列表
 */
const GetBrands = async () => {
  await getBrands();
  // getBrands 函数内部已经处理了 brands 的赋值
};

/**
 * 获取配送模板列表
 */
const GetGetExpressTemplateList = async () => {
  await getExpressTemplates();
  // getExpressTemplates 函数内部已经处理了 Templates 的赋值
};

/**
 * 上传图片
 */
const SuccessImg = async (param) => {
  const imgUrl = await uploadImage(param.file);
  if (imgUrl) {
    formOne.ListImg = imgUrl;
  }
};

/**
 * 上传前验证
 */
const beforeUpload = async (file) => {
  const isJPG = file.type == "image/jpeg" || file.type == "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 格式!");
  }
  return isLt2M;
};

/**
 * 清除图片
 */
const clear = async () => {
  formOne.ListImg = "";
};

/**
 * 类型选择变化
 */
const CouponTypeChange = (val) => {
  if (val == 7) {
    formOne.CannotGive = "1";
    formOne.OrgPrice = 0;
  }
};

/**
 * 拖拽开始
 */
const onStart = () => { };

/**
 * 拖拽结束
 */
const onEnd = () => {
  console.log("拖拽结束，最新顺序：", goods.value);
};

/**
 * 分页变化
 */
const handlePageChange = (val) => {
  formTwo.PageStartRow = val;
};

/**
 * 每页数量变化
 */
const handleSizeChange = (val) => {
  formTwo.PageRowCount = val;
};

/**
 * 保存选中的商品
 */
const SaveTable = (selListData) => {
  formTwo.tableData = selListData;
  ComponentsGoodVisible.value = false;
};

/**
 * 关闭商品选择弹窗
 */
const CloseVisible = () => {
  ComponentsGoodVisible.value = false;
};

/**
 * 添加可使用供应商
 */
const addUseSupplier = () => {
  addSupplierVisible.value = true;
};

/**
 * 保存供应商列表
 */
const saveUnitList = (val) => {
  console.log(val);
  formTwo.unitIdTableData = val;
  addSupplierVisible.value = false;
};

/**
 * 关闭供应商选择弹窗
 */
const closeAddSupplierVisible = () => {
  addSupplierVisible.value = false;
};

/**
 * 添加可使用商品
 */
const addUseGoods = () => {
  ComponentsGoodVisible.value = true;
};

/**
 * 删除已添加的商品
 */
const handleGoodsDel = (ID) => {
  for (let i = 0; i < formTwo.tableData.length; i++) {
    if (ID == formTwo.tableData[i].GoodsId) {
      formTwo.tableData.splice(i, 1);
      break;
    }
  }
};

/**
 * 删除已添加的供应商
 */
const handleUnitsDel = (ID) => {
  for (let i = 0; i < formTwo.unitIdTableData.length; i++) {
    if (ID == formTwo.unitIdTableData[i].UnitId) {
      formTwo.unitIdTableData.splice(i, 1);
      break;
    }
  }
};

/**
 * 根据ID获取卡券详情
 */
const GetTicketTemplateByIDApi = async (ID) => {
  try {
    const res = await getTicketTemplateById(ID);
    if (res.Code !== 200) {
      ElMessage.error(res.Message || "获取票据模板失败");
      return;
    }

    processBasicData(res.DataMap);
    const ticketConfig = processConfigData(res.DataMap);
    processDateData(res.DataMap);

    const templateType = res.DataMap.TicketTemplateType;
    const typeHandlers = {
      10: processPackageTicket,
      0: processDeliveryTicket,
      5: processCashTicketById,
      6: processStoredValueCardById,
      4: processDiscountTicketById,
      7: processPointCardById,
    };

    if (typeHandlers[templateType]) {
      typeHandlers[templateType](res.DataMap, ticketConfig);
    }
  } catch (error) {
    console.error("获取票据模板出错:", error);
    ElMessage.error("获取票据模板失败");
  }
};

/**
 * 处理基础数据
 */
const processBasicData = (data) => {
  if (!data) {
    console.error("处理基础数据失败：数据为空");
    return;
  }

  const basicFields = [
    "TicketTemplateId",
    "TicketTemplateTitle",
    "TicketTemplateCode",
    "TicketTemplateSubTitle",
    "ListImg",
    "CreateTicketCount",
    "BeginIndex",
    "GoodsQty",
    "ExchangeGoodsQty",
    "ExchangeRemark",
    "BrandId",
    "ExpressTemplateId",
    "DeliverType",
    "CanUsePublic",
  ];

  basicFields.forEach((field) => {
    formData[field] = data[field] || '';
    if (field in formOne) {
      // 确保CreateTicketCount有默认值
      if (field === 'CreateTicketCount' && (data[field] === undefined || data[field] === null)) {
        formOne[field] = '0';
      } else {
        formOne[field] = data[field] || '';
      }
    }
  });
  formOne.CanUsePublic = (formData.CanUsePublic || '').toString();

  formData.OrgPrice =
    data.TicketTemplateType === 4
      ? data.OrgPrice || 0
      : ((data.OrgPrice || 0) / 100).toFixed(2);

  formOne.OrgPrice =
    data.TicketTemplateType === 4
      ? data.OrgPrice || 0
      : ((data.OrgPrice || 0) / 100).toFixed(2);

  //支付价格
  formData.PayPrice =
  data.TicketTemplateType === 4
    ? data.PayPrice || 0
    : ((data.PayPrice || 0) / 100).toFixed(2);

  formOne.PayPrice =
    data.TicketTemplateType === 4
      ? data.PayPrice || 0
      : ((data.PayPrice || 0) / 100).toFixed(2);

  if (data.ExpressTemplate) {
    formData.TemplateName = data.ExpressTemplate.TemplateName || '';
  }

  formOne.CreatedBy = data.CreateUserName || '';
  formOne.CreatedTime = data.CreateTime || '';

  formData.HasPass = data.HasPass;
  formOne.HasPass = data.HasPass === 1;

  formTwo.ExchangeRemark = data.ExchangeRemark || '';
  formOne.DeliverType = data.DeliverType !== undefined && data.DeliverType !== null ? data.DeliverType.toString() : '';
};

/**
 * 处理配置数据
 */
const processConfigData = (data) => {
  if (!data) {
    console.error("处理配置数据失败：数据为空");
    return {};
  }

  let ticketConfig = {};
  if (data.TicketTemplateConfig) {
    try {
      ticketConfig = JSON.parse(data.TicketTemplateConfig);

      const configFields = [
        "ActivateKind",
        "PasswordLength",
        "BeginIndex",
        "TicketIndexLengthInCode",
        "RandomCharType",
        "RandomCharLengthInCode",
        "CanUseInSpecialShop",
        "CannotGive",
      ];

      configFields.forEach((field) => {
        if (ticketConfig[field] !== undefined) {
          formOne[field] = ticketConfig[field].toString();
        }
      });

      formOne.TicketCodeCustomize = ticketConfig.TicketCodeCustomize === "1";

      if (data.DeliverType == 21 || data.DeliverType == 22) {
        formData.NeedPreBookWhenPickup = ticketConfig.NeedPreBookWhenPickup || 0;
        formOne.NeedPreBookWhenPickupDesc = ticketConfig.NeedPreBookWhenPickup || 0;
        formData.ForwardDaysWhenPreBook = ticketConfig.ForwardDaysWhenPreBook || 0;
        formOne.ForwardDaysWhenPreBook = ticketConfig.ForwardDaysWhenPreBook || 0;
      }
    } catch (e) {
      console.error("解析票据配置失败:", e);
    }

    formData.TicketTemplateConfig = data.TicketTemplateConfig;
    formOne.TicketTemplateConfig = data.TicketTemplateConfig;
  }

  return ticketConfig;
};

/**
 * 处理日期数据
 */
const processDateData = (data) => {
  if (!data) {
    console.error("处理日期数据失败：数据为空");
    return;
  }

  formData.ValidDateType = (data.ValidDateType || "0").toString();
  formOne.ValidDateType = (data.ValidDateType || "0").toString();
  formData.ExchangeDateType = (data.ExchangeDateType || "0").toString();
  formOne.ExchangeDateType = (data.ExchangeDateType || "0").toString();

  if (data.ValidDateType == 1) {
    const validDates = [
      data.ValidBeginDate ? data.ValidBeginDate.toString() : "",
      data.ValidEndDate ? data.ValidEndDate.toString() : "",
    ];

    formData.ValidBeginDate = validDates[0];
    formData.ValidEndDate = validDates[1];
    formOne.ValidBeginDate = validDates[0];
    formOne.ValidEndDate = validDates[1];
    formOne.time = validDates;
  }

  if (data.ValidDateType == 2) {
    formData.ValidDateAdd = data.ValidDateAdd || 0;
    formOne.ValidDateAdd = data.ValidDateAdd || 0;
  }

  if (data.ExchangeDateType == 1) {
    const getDateString = (date) => (date && date != 0 ? date.toString() : "");

    formData.ExchangeBeginDate = getDateString(data.ExchangeBeginDate);
    formData.ExchangeEndDate = getDateString(data.ExchangeEndDate);
    formOne.ExchangeBeginDate = getDateString(data.ExchangeBeginDate);
    formOne.ExchangeEndDate = getDateString(data.ExchangeEndDate);

    if (data.ExchangeBeginDate && data.ExchangeEndDate) {
      formOne.time1 = [
        data.ExchangeBeginDate.toString(),
        data.ExchangeEndDate.toString(),
      ];
    }
  }

  if (data.ExchangeDateType == 2) {
    formData.ExchangeDateAdd = data.ExchangeDateAdd || 0;
    formOne.ExchangeDateAdd = data.ExchangeDateAdd || 0;
  }
};

/**
 * 处理券包
 */
const processPackageTicket = (data) => {
  formOne.CouponType = "3";
  packageDetails.splice(0, 1);

  if (data.PackageDetails && data.PackageDetails.length > 0) {
    data.PackageDetails.forEach((row) => {
      const exchangeConfig = JSON.parse(row.ExchangeDateConfig);
      const validConfig = JSON.parse(row.ValidDateConfig);

      packageDetails.push({
        ListImg: row.TicketTemplate.ListImg,
        TicketTemplateCode: row.TicketTemplate.Code,
        TicketTemplateTitle: `${row.TicketTemplate.Code}-${row.TicketTemplate.Title}`,
        PackageTicketTemplateId: row.PackageTicketTemplateId,
        TicketTemplateId: row.TicketTemplateId,
        Qty: row.Qty,
        ValidDateConfig: "",
        ValidDateConfigDesc: {
          FixedBeginTime: validConfig.FixedBeginTime,
          FixedEndTime: validConfig.FixedEndTime,
          Type: validConfig.Type.toString(),
          Interval: validConfig.Interval,
          IntervalUnit: validConfig.IntervalUnit,
          time: [validConfig.FixedBeginTime, validConfig.FixedEndTime],
        },
        ExchangeDateConfig: "",
        ExchangeDateConfigDesc: {
          TicketTemplateCode: exchangeConfig.TicketTemplateCode,
          time: [exchangeConfig.FixedBeginTime, exchangeConfig.FixedEndTime],
          FixedBeginTime: exchangeConfig.FixedBeginTime,
          FixedEndTime: exchangeConfig.FixedEndTime,
          Type: exchangeConfig.Type.toString(),
        },
      });
    });
  }
};

/**
 * 处理提货券
 */
const processDeliveryTicket = (data, config) => {
  formOne.CouponType = "1";
  formTwo.chooseOne = data.GoodsQty;
  formTwo.chooseTwo = data.ExchangeGoodsQty;

  goods.value.splice(0, goods.value.length);

  if (data.GoodsQty > 1) {
    formOne.CouponType = "2";
  }
  if (config) {
    formTwo.CheckGoodsStockWhenExchangeShop =
      config.CheckGoodsStockWhenExchangeShop || "0";
    formTwo.CheckGoodsStockWhenExchangeOnline =
      config.CheckGoodsStockWhenExchangeOnline || "0";
  }
  if (data.ExchangeGoodses && data.ExchangeGoodses.length > 0) {
    data.ExchangeGoodses.forEach((row) => {
      goods.value.push({
        title: `${row.GoodsCode}-${row.GoodsTitle}`,
        subtitle: row.GoodsSubTitle,
        price: row.GoodsOrgPrice,
        img: row.GoodsListImg,
        GoodsId: row.GoodsId,
        GoodsName: `${row.GoodsCode}-${row.GoodsTitle}`,
        number: row.Qty,
        GoodsStatusDesc: row.GoodsStatus == 1 ? '正常' : '停用',
      });
    });
  }
};

/**
 * 处理现金券
 */
const processCashTicketById = (data, config) => {
  processCashOrStoredValueCard(data, config, 5);
};

/**
 * 处理储值卡
 */
const processStoredValueCardById = (data, config) => {
  processCashOrStoredValueCard(data, config, 6);
};

/**
 * 处理点卡
 */
const processPointCardById = (data, config) => {
  processCashOrStoredValueCard(data, config, 7);
};

/**
 * 处理现金券和储值卡和点卡共通逻辑
 */
const processCashOrStoredValueCard = (data, config, type) => {
  formOne.CouponType = type.toString();
  formTwo.UseGoodsScopeType = data.UseGoodsScopeType;

  if (config) {
    formTwo.FullAmountTypeOfCashTicket =
      config.FullAmountTypeOfCashTicket || "0";

    if (type === 5) {
      formTwo.EveryGoodsCanSubOfCashTicket =
        config.EveryGoodsCanSubOfCashTicket;
      formTwo.CanUseMultiInOneOrderOfCashTicket =
        config.CanUseMultiInOneOrderOfCashTicket;
      formTwo.UsePayThreshold = (data.UsePayThreshold / 100).toFixed(2);
    }
  }

  if (formTwo.UseGoodsScopeType == 1 && data.UseGoodses) {
    formTwo.tableData = data.UseGoodses;
  }
  if (formTwo.UseGoodsScopeType == 2) {
    let unitIds = JSON.parse(data.TicketTemplateConfig).CanUseTicketBrokerUnitIds;
    if (unitIds) {
      processSupplierTableData(unitIds, data.CreateUnitId);
    }
  }
};

/**
 * 处理供应商表格数据
 */
const processSupplierTableData = async (unitIds, createUnitId) => {
  let res = await getSuppliers(unitIds, createUnitId);
  if (res && res.Code == 200) {
    formTwo.unitIdTableData = res.DataMap;
  }
};

/**
 * 处理折扣券
 */
const processDiscountTicketById = (data, config) => {
  formOne.CouponType = "4";
  formOne.Discount = config.Discount;
  formTwo.UseGoodsScopeType = data.UseGoodsScopeType;
  processCashOrStoredValueCard(data, config, 4);
};

/**
 * 初始化页面
 */
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    GetTicketTemplateByIDApi(router.currentRoute.value.query.ID);
    Type.value = router.currentRoute.value.query.Type;
    isDisabled.value = true;
  }
};

// 页面加载时初始化
onMounted(() => {
  GetGetExpressTemplateList();
  GetBrands();
  Init();
});
</script>

<style scoped>
/* 页面容器样式 */
.container {
  min-height: 100vh;
  background-color: #fff;
}

/* 商品选择按钮样式 */
.goods-modal-add {
  position: relative;
  top: 4px;
}

/* 多选描述样式 */
.choose-desc {
  text-align: center;
  width: 100%;
  color: #fff;
  background-color: #f56c6c;
}

/* 商品列表样式 */
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

/* 商品详情样式 */
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

/* 商品数量控制样式 */
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

/* 商品删除按钮样式 */
.goods-del {
  position: absolute;
  right: 16px;
  top: 8px;
  font-size: 14px;
  color: #f56c6c;
  cursor: pointer;
  z-index: 9;
}

/* 成功提示样式 */
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
</style>

<style lang="less">
/* 步骤条样式 */
.handlerSteps {
  .el-step__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    font-size: 18px;
  }

  .el-step__head.is-finish {
    color: #fff;
    border-color: #ff8686;
  }

  .el-step__icon.is-text {
    border-radius: 33%;
  }

  .el-step.is-horizontal .el-step__line {
    top: 22px;
    background-color: #c0c4cc;
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

/* 图片上传样式 */
.ticket-uploader {
  width: 150px;
  height: 150px;

  .el-upload {
    width: 150px !important;
    height: 150px !important;
    line-height: 150px !important;
  }

  .ticket-uploader-avatar {
    width: 100%;
  }
}
</style>
