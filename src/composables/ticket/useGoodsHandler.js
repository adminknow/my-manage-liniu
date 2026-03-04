import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

/**
 * 商品处理组合式函数
 * 用于管理商品相关的处理逻辑
 */
export function useGoodsHandler() {
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

  /**
   * 清除商品数据
   * @param {number} dataIndex - 商品索引
   */
  const clearGoodsData = (dataIndex) => {
    goods.value.forEach((row, index) => {
      if (dataIndex === index) {
        row.title = "";
        row.subtitle = "";
        row.price = 0;
        row.img = "";
        row.GoodsId = "";
        row.number = 1;
        row.GoodsStatusDesc = "";
      }
    });
  };

  /**
   * 清除卡券数据
   * @param {number} dataIndex - 卡券索引
   */
  const clearTicketsData = (dataIndex) => {
    packageDetails.forEach((row, index) => {
      if (dataIndex === index) {
        row.ListImg = "";
        row.TicketTemplateCode = "";
        row.PackageTicketTemplateId = 0;
        row.TicketTemplateTitle = "";
        row.TicketTemplateId = "";
        row.Qty = 1;
        row.ValidDateConfig = "";
        row.ValidDateConfig = {
          FixedBeginTime: "", // 固定开始时间,
          FixedEndTime: "", // 固定结束时间
          Type: "0", // 0:固定时间段;1:从领取时间开始,每隔几天/周/月/季度/年开始;2:从固定时间开始,每隔几天/周/月/季度/年开始;
          Interval: "1", // 间隔天/周/月/季度/年
          IntervalUnit: "12", // 间隔单位: 10-天;11-周;12-月;13-季度;14-年;
          time: [],
        };
        row.ExchangeDateConfig = "";
        row.ExchangeDateConfigDesc = {
          ListImg: "",
          TicketTemplateCode: "",
          time: [],
          FixedBeginTime: "", // 固定开始时间,
          FixedEndTime: "", // 固定结束时间
          Type: "1",
        };
      }
    });
  };

  /**
   * 更新商品数据
   * @param {Object} goodsData - 商品数据
   * @param {number} dataIndex - 商品索引
   */
  const changeGoodsData = (goodsData, dataIndex) => {
    goods.value.forEach((row, index) => {
      if (dataIndex === index) {
        row.title = goodsData.GoodsCode + "-" + goodsData.GoodsTitle;
        row.subtitle = goodsData.GoodsSubTitle;
        row.price = goodsData.OrgPrice;
        row.img = goodsData.ListImg;
        row.GoodsId = goodsData.GoodsId;
        row.GoodsName = goodsData.GoodsCode + "-" + goodsData.GoodsTitle;
        row.GoodsStatusDesc = goodsData.GoodsStatus == 1 ? '正常' : '停用';
      }
    });
  };

  /**
   * 更新卡券数据
   * @param {Object} ticketData - 卡券数据
   * @param {number} dataIndex - 卡券索引
   */
  const changeTicketsData = (ticketData, dataIndex) => {
    packageDetails.forEach((row, index) => {
      if (dataIndex === index) {
        row.ListImg = ticketData.ListImg;
        row.TicketTemplateId = ticketData.TicketTemplateId;
        row.TicketTemplateCode = ticketData.TicketTemplateCode;
        row.TicketTemplateTitle = ticketData.TicketTemplateCode + "-" + ticketData.TicketTemplateTitle;
        row.Qty = 1;
      }
    });
  };

  /**
   * 删除商品
   * @param {number} index - 商品索引
   */
  const delGoodBtn = (index) => {
    goods.value.splice(index, 1);
  };

  /**
   * 删除卡券
   * @param {number} index - 卡券索引
   */
  const delTicketBtn = (index) => {
    packageDetails.splice(index, 1);
  };

  /**
   * 增加商品数量
   * @param {number} dataIndex - 商品索引
   */
  const addNumberBtn = (dataIndex) => {
    goods.value.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.GoodsId) {
          row.number++;
        }
      }
    });
  };

  /**
   * 减少商品数量
   * @param {number} dataIndex - 商品索引
   */
  const reduceNumberBtn = (dataIndex) => {
    goods.value.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.GoodsId) {
          row.number--;
          if (Number(row.number) == 0) {
            row.number = 1;
          }
        }
      }
    });
  };

  /**
   * 增加卡券数量
   * @param {number} dataIndex - 卡券索引
   */
  const addTicketNumberBtn = (dataIndex) => {
    packageDetails.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.TicketTemplateId) {
          row.Qty++;
        }
      }
    });
  };

  /**
   * 减少卡券数量
   * @param {number} dataIndex - 卡券索引
   */
  const reduceTicketNumberBtn = (dataIndex) => {
    packageDetails.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.TicketTemplateId) {
          row.Qty--;
          if (Number(row.Qty) == 0) {
            row.Qty = 1;
          }
        }
      }
    });
  };

  /**
   * 添加商品
   */
  const addGoods = () => {
    goods.value.push({
      title: "",
      subtitle: "",
      price: "",
      img: "",
      GoodsId: "",
      GoodsName: "",
      number: "1",
      GoodsStatusDesc: "",
    });
  };

  /**
   * 添加卡券
   */
  const addTickets = () => {
    packageDetails.push({
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
  };

  /**
   * 处理可使用商品
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processUsableGoods = (formTwo, formData) => {
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
  };

  /**
   * 处理卡券模板配置
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   */
  const processTicketTemplateConfig = (formTwo, formData) => {
    if (formData.TicketTemplateConfig != "") {
      const config = JSON.parse(formData.TicketTemplateConfig);
      config.FullAmountTypeOfCashTicket = formTwo.FullAmountTypeOfCashTicket;
      config.CanUseMultiInOneOrderOfCashTicket = formTwo.CanUseMultiInOneOrderOfCashTicket;
      config.EveryGoodsCanSubOfCashTicket = formTwo.EveryGoodsCanSubOfCashTicket;

      formData.TicketTemplateConfig = JSON.stringify(config);
    }

    // 添加通用商品数据
    goods.value.forEach((row) => {
      formData.ExchangeGoodses.push({
        Qty: row.number,
        GoodsId: row.GoodsId,
      });
    });

    // 设置基础券类型
    formData.TicketTemplateType = 0;
    formData.GoodsQty = 1; // 商品数量必须>=1
  };

  /**
   * 处理单选卡
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processSingleChoiceCard = (formData) => {
    // 单选卡特有处理
    if (formData.ExchangeGoodses[0]?.GoodsId == "") {
      formData.ExchangeGoodses = [];
    }
    return true;
  };

  /**
   * 处理多选卡
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processMultipleChoiceCard = (formTwo, formData) => {
    // 多选卡特有处理
    formData.GoodsQty = formTwo.chooseOne;
    formData.ExchangeGoodsQty = formTwo.chooseTwo;

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
  };

  /**
   * 处理券包
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processTicketPackage = (formData, processValidTime, processExchangeTime) => {
    formData.TicketTemplateType = 10;
    formData.ExchangeGoodses = [];

    // 验证券包内容
    if (packageDetails.length == 0 || packageDetails[0].TicketTemplateId == "") {
      ElMessage.info("请先添加卡券");
      return false;
    }

    let hasTimeError = false;

    // 处理每个券的日期配置
    packageDetails.forEach((row) => {
      // 处理有效日期配置
      hasTimeError = processValidTime(row) || hasTimeError;
      // 处理兑换日期配置
      processExchangeTime(row);
      // 添加到表单数据
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
  };

  /**
   * 处理现金券
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processCashTicket = (formTwo, formData, processUsableGoods) => {
    formData.ExchangeGoodses = []; // 清空兑换商品数据
    formData.TicketTemplateType = 5;
    formData.UsePayThreshold = formTwo.UsePayThreshold * 100;

    return processUsableGoods(formTwo, formData);
  };

  /**
   * 处理储值卡
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processStoredValueCard = (formTwo, formData, processUsableGoods) => {
    formData.ExchangeGoodses = []; // 清空兑换商品数据
    formData.TicketTemplateType = 6;

    return processUsableGoods(formTwo, formData);
  };

  /**
   * 处理折扣券
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processDiscountTicket = (formTwo, formData, processUsableGoods) => {
    formData.ExchangeGoodses = []; // 清空兑换商品数据
    formData.TicketTemplateType = 4;
    formData.OrgPrice = formData.OrgPrice / 100;

    return processUsableGoods(formTwo, formData);
  };

  /**
   * 处理企业点卡
   * @param {Object} formTwo - 表单数据
   * @param {Object} formData - 表单数据
   * @returns {boolean} - 是否处理成功
   */
  const processPointCard = (formTwo, formData, processUsableGoods) => {
    formData.ExchangeGoodses = []; // 清空兑换商品数据
    formData.TicketTemplateType = 7;

    return processUsableGoods(formTwo, formData);
  };

  return {
    goods,
    packageDetails,
    clearGoodsData,
    clearTicketsData,
    changeGoodsData,
    changeTicketsData,
    delGoodBtn,
    delTicketBtn,
    addNumberBtn,
    reduceNumberBtn,
    addTicketNumberBtn,
    reduceTicketNumberBtn,
    addGoods,
    addTickets,
    processUsableGoods,
    processTicketTemplateConfig,
    processSingleChoiceCard,
    processMultipleChoiceCard,
    processTicketPackage,
    processCashTicket,
    processStoredValueCard,
    processDiscountTicket,
    processPointCard,
  };
}
