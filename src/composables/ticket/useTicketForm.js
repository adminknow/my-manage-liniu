import { ref, reactive } from 'vue';
import Cookie from 'js-cookie';
import common from '@/utils/common.js';

/**
 * 卡券表单组合式函数
 * 用于管理卡券表单的数据、验证规则和相关方法
 */
export function useTicketForm() {
  // 用户信息
  const User = JSON.parse(Cookie.get('User'));

  // 表单数据
  const formData = reactive({
    TicketTemplateId: "",
    TicketTemplateTitle: "", // 标题
    TicketTemplateCode: "", // 券批次号
    TicketTemplateSubTitle: "",
    ListImg: "",
    OrgPrice: "", // 券面值
    PayPrice: "", // 支付价格(分)
    CreateTicketCount: "0", // 券总量
    BeginIndex: "1", // 新建券批次时的起始序号(空代表从1开始)
    TicketTemplateType: "", // 类型(0:普通券;10:券包,5:现金券;6:不可充值储值卡)
    ValidDateType: "1",
    ValidDateAdd: "0",
    ValidBeginDate: "", // 有效开始日期
    ValidEndDate: "", // 有效结束日期
    ExchangeDateType: "1",
    ExchangeDateAdd: "0", // 兑换之日起多少天
    ValidDateAdd: "0", // 有效之日起多少天
    ExchangeBeginDate: "", // 兑换开始日期
    ExchangeEndDate: "", // 兑换结束日期
    GoodsQty: "", // 兑换商品数量(<=1:单选卡;>1:多选卡)
    ExchangeGoodsQty: 1, // 多选卡兑换时需要选择几种兑换商品(默认为1)
    ExchangeRemark: "", // 兑换说明
    HasPass: "", // 是否需要密码
    BrandId: "", // 品牌ID
    TicketTemplateConfig: "", // 配置
    ExpressTemplateId: "", // 配送模板ID
    TemplateName: "",
    ExchangeGoodses: [], // 可兑换的商品(多选)
    PackageDetails: [], // 券包下的券模板明细
    TicketCodeCustomize: "", // 券码自定义
    TicketIndexLengthInCode: 5, // 券码中序号的长度
    RandomCharType: "0", // 券码中随机字符的类型(0:字母+数字;1:仅字母;2:仅数字),默认0
    RandomCharLengthInCode: 3, // 券码中随机字符的长度
    DeliverType: "0", // 配送类型(0:无须单独配送;1:需单独配送;21:只能线下提货;22:既可线上配送,也可线下提货)
    NeedPreBookWhenPickup: "", // 线下提货时，是否需要提前预约(1:是)
    ForwardDaysWhenPreBook: "", // 线下提货时，需要提前几天预约(0:不控制)
    UsePayThreshold: "0", // 可使用的支付门槛(即订单总金额需要满多少分才能使用)
    FullAmountTypeOfCashTicket: "0", // 默认为0，即为单次总金额满多少使用，1，即为每次满多少都能使用
    UseGoodsScopeType: "", // 可使用的商品范围类型(0:所有商品;1:指定商品)
    UseGoodses: [], // 现金券/储值卡时，可使用的商品
    CanUsePublic: "0", // (0:不能，1:能) 能否在公域平台上使用(主要是针对券商创建的现金券/折扣券/储值卡)
  });

  // 基本信息表单数据
  const formOne = reactive({
    TicketTemplateId: "",
    TicketTemplateTitle: "", // 标题
    ValidDateType: "1", // 有效日期类型(0:无日期限制;1:固定日期内有效;2:购买之日起多少天内有效）
    ExchangeDateType: "1", // 兑换日期类型(0:无日期限制;1:固定日期内可兑换;2:购买之日起多少天内可兑换）
    ExchangeDateAdd: "0", // 兑换之日起多少天
    ValidDateAdd: "0", // 有效之日起多少天
    CouponType: "1", // 券类型
    TicketTemplateCode: "", // 券批次号
    CreateTicketCount: "0", // 券总量
    BeginIndex: "1", // 新建券批次时的起始序号(空代表从1开始)
    ListImg: "", // 列表图片
    CreatedBy: User.UserName, // 创建人
    CreatedTime: common.getTime(), // 创建时间
    ActivateKind: "2", // 激活方式(1:新建时激活;2:手动激活;)
    HasPass: true, // 是否需要密码
    PasswordLength: 5,
    Discount: "100", // 折扣券时的折扣
    BrandId: "", // 品牌ID,
    TicketTemplateConfig: "", // 配置
    ExpressTemplateId: "", // 配送模板ID
    ValidBeginDate: "", // 有效开始日期
    ValidEndDate: "", // 有效结束日期
    ExchangeBeginDate: "", // 兑换开始日期
    ExchangeEndDate: "", // 兑换结束日期
    DeliverType: "0", // 配送类型(0:无须单独配送;1:需单独配送;21:只能线下提货;22:既可线上配送,也可线下提货)
    NeedPreBookWhenPickupDesc: 0, // 线下提货时，是否需要提前预约(1:是)
    ForwardDaysWhenPreBook: "", // 线下提货时，需要提前几天预约(0:不控制)
    CanUseInSpecialShop: "0", // 储值卡，是否只能在指定门店使用（1：是）
    CannotGive: "0", // 不能转赠(1:是)
    CanUsePublic: "0", // (0:不能，1:能) 能否在公域平台上使用(主要是针对券商创建的现金券/折扣券/储值卡)
    time: [],
    time1: [],
    TicketCodeCustomize: false, // 券码自定义
    TicketIndexLengthInCode: 5, // 券码中序号的长度
    RandomCharType: "0", // 券码中随机字符的类型
    RandomCharLengthInCode: 3, // 券码中随机字符的长度
  });

  // 兑换信息表单数据
  const formTwo = reactive({
    chooseOne: "2",
    chooseTwo: "1",
    ExchangeRemark: "",
    UsePayThreshold: "", // 可使用的支付门槛(即订单总金额需要满多少分才能使用)
    UseGoodsScopeType: 0, // 可使用的商品范围类型(0:所有商品;1:指定商品)
    tableData: [],
    tableLoading: false,
    PageStartRow: 1,
    PageRowCount: 15,
    CanUseMultiInOneOrderOfCashTicket: "0", // 现金券：一张订单是否可能使用多张本券(0:一张订单只能使用一张)
    EveryGoodsCanSubOfCashTicket: "0", // 现金券：每种商品是否都可以使用本券(0:指定商品可使用;1:所有商品可使用)
    FullAmountTypeOfCashTicket: "0", // 0-是订单满多少金额可使用，1-订单每满多少金额可使用 
    CheckGoodsStockWhenExchangeShop: '0',// 线下门店兑换券时，是否校验商品的库存(1:是)
    CheckGoodsStockWhenExchangeOnline: '0',// 线上兑换券时，是否校验商品的库存(1:是)
    unitIdTableData: [],// 指定供应商使用的供应商列表
    unitIdPageStartRow: 1,
    unitIdPageRowCount: 15,
    CanUseTicketBrokerUnitIds: '',// 指定供应商使用（现金券、折扣券、储值卡时有用）,多个供应商的unit_id之间以;隔开
  });

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
        Type: "1", // 0:固定时间段;1:等同于有效期;(选择0的时候需要选择固定开始和结束时间，选择1的时候则默认取有效期)
      }, // 券包下的券模板的兑换时间配置
    },
  ]);

  // 表单验证规则
  const validatePass2 = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请输入券数量"));
    } else if (value > 100000) {
      callback(new Error("不超10万张"));
    } else {
      callback();
    }
  };

  const checkTicketCode = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请输入数值"));
    } else {
      if (value > 10 || value < 0) {
        callback(new Error("已超过最大值"));
      } else {
        callback();
      }
    }
  };

  const checkRandomCharCode = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请输入数值"));
    } else {
      if (value > 5 || value < 0) {
        callback(new Error("已超过最大值"));
      } else {
        callback();
      }
    }
  };

  const rulesOne = {
    BrandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
    TicketTemplateTitle: [
      { required: true, message: "请输入标题", trigger: "blur" },
    ],
    CreateTicketCount: [{ validator: validatePass2, trigger: "blur" }],
    OrgPrice: [{ required: true, message: "请输入券面值", trigger: "blur" }],
    time: [{ required: true, message: "请选择有效期时间", trigger: "blur" }],
    time1: [{ required: true, message: "请选择配送期时间", trigger: "blur" }],
    ListImg: [{ required: true, message: "请选择券图", trigger: "blur" }],
    ExpressTemplateId: [
      { required: true, message: "请选择配送范围", trigger: "blur" },
    ],
    TicketIndexLengthInCode: [{ validator: checkTicketCode, trigger: "blur" }],
    RandomCharLengthInCode: [{ validator: checkRandomCharCode, trigger: "blur" }],
  };

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

  /**
   * 处理券类型变化
   * @param {string} val - 券类型值
   */
  const CouponTypeChange = (val) => {
    if (val == 7) {
      // 企业点卡的时候，不允许赠送
      formOne.CannotGive = "1";
      formOne.OrgPrice = 0;
    }
  };

  /**
   * 验证折扣值
   * @param {number} value - 折扣值
   */
  const validateDiscount = (value) => {
    if (value < 1 || value > 100) {
      formOne.Discount = Math.min(Math.max(1, value), 100);
    }
  };

  /**
   * 处理日期范围变化
   * @param {Array} value - 日期范围值
   */
  const changeDatetimeRange = (value) => {
    if (formOne.time1 != "") {
      return;
    }
    formOne.time1 = value;
  };

  /**
   * 从 formOne 复制字段到 formData
   */
  const copyFormOneToFormData = () => {
    formData.ValidDateType = formOne.ValidDateType;
    formData.ValidDateAdd = formOne.ValidDateAdd;
    formData.ExchangeDateAdd = formOne.ExchangeDateAdd;
    formData.TicketTemplateTitle = formOne.TicketTemplateTitle;
    formData.TicketTemplateCode = formOne.TicketTemplateCode;
    formData.CanUsePublic = formOne.CanUsePublic;
    formData.ListImg = formOne.ListImg;
    formData.OrgPrice = formOne.OrgPrice * 100;
    formData.ValidBeginDate = formOne.ValidBeginDate;
    formData.ValidEndDate = formOne.ValidEndDate;
    formData.ExchangeBeginDate = formOne.ExchangeBeginDate;
    formData.ExchangeEndDate = formOne.ExchangeEndDate;

    // 优化布尔值转字符串的操作
    formData.HasPass = formOne.HasPass ? "1" : "0";
    formData.BrandId = formOne.BrandId;
    formData.TicketCodeCustomize = formOne.TicketCodeCustomize ? "1" : "0";

    let obj = {
      ActivateKind: formOne.ActivateKind, // 激活方式(1:新建时激活;2:手动激活;)
      PasswordLength: formOne.PasswordLength,
      CanUseInSpecialShop: formOne.CanUseInSpecialShop,
      CannotGive: formOne.CannotGive,

      CreateTicketCount: formOne.CreateTicketCount,
      BeginIndex: formOne.BeginIndex, // 新建券批次时的起始序号(空代表从1开始)
      TicketIndexLengthInCode: formOne.TicketIndexLengthInCode,
      RandomCharType: formOne.RandomCharType,
      RandomCharLengthInCode: formOne.RandomCharLengthInCode,
      TicketCodeCustomize: formOne.TicketCodeCustomize ? "1" : "0",
      Discount: formOne.Discount, // 如果选到了折扣券，那么把折扣数值保存进来
    };

    if (formOne.DeliverType == 21 || formOne.DeliverType == 22) {
      obj.NeedPreBookWhenPickup = formOne.NeedPreBookWhenPickupDesc;
      obj.ForwardDaysWhenPreBook = formOne.ForwardDaysWhenPreBook
        ? formOne.ForwardDaysWhenPreBook
        : 0;
    }

    formData.DeliverType = formOne.DeliverType;
    formOne.TicketTemplateConfig = JSON.stringify(obj);
    formData.TicketTemplateConfig = formOne.TicketTemplateConfig;
    formData.ExpressTemplateId = formOne.ExpressTemplateId;
  };

  return {
    formData,
    formOne,
    formTwo,
    goods,
    packageDetails,
    rulesOne,
    rulesTwo,
    defaultTime2,
    defaultDate2,
    CouponTypeChange,
    validateDiscount,
    changeDatetimeRange,
    copyFormOneToFormData,
  };
}
