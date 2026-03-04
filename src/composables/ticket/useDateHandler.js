import common from '@/utils/common.js';

/**
 * 日期处理组合式函数
 * 用于管理日期相关的处理逻辑
 */
export function useDateHandler() {
  /**
   * 格式化日期对象为需要的格式
   * @param {Date} date - 日期对象
   * @returns {string} - 格式化后的日期字符串
   */
  const formatDate = (date) => {
    if (!date) return '';
    return common
      .dateFormatByInt(common.dateFormat("YYYY-mm-dd HH:MM:SS", date))
      .toString();
  };

  /**
   * 格式化日期对象为字符串，处理空值
   * @param {Date} date - 日期对象
   * @returns {string} - 格式化后的日期字符串
   */
  const formatDateToString = (date) => {
    if (!date) {
      return "99991231235959"; // 返回最大日期而不是乱码
    }
    return common
      .dateFormatByInt(common.dateFormat("YYYY-mm-dd HH:MM:SS", date))
      .toString();
  };

  /**
   * 处理日期范围，返回开始和结束日期
   * @param {Array} dateRange - 日期范围数组
   * @returns {Object} - 包含开始和结束日期的对象
   */
  const handleDateRange = (dateRange) => {
    if (!dateRange || dateRange.length < 2) {
      return { beginDate: '', endDate: '' };
    }
    return {
      beginDate: formatDate(dateRange[0]),
      endDate: formatDate(dateRange[1])
    };
  };

  /**
   * 处理有效期时间
   * @param {Object} row - 券包详情行数据
   * @returns {boolean} - 是否有时间错误
   */
  const processValidTime = (row) => {
    if (row.ValidDateConfigDesc.Type == 0) {
      if (
        !row.ValidDateConfigDesc.FixedBeginTime ||
        !row.ValidDateConfigDesc.FixedEndTime
      ) {
        return true; // 时间错误
      }

      row.ValidDateConfigDesc.FixedBeginTime = common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        row.ValidDateConfigDesc.FixedBeginTime
      );
      row.ValidDateConfigDesc.FixedEndTime = common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        row.ValidDateConfigDesc.FixedEndTime
      );
    }

    if (
      row.ValidDateConfigDesc.Type == 2 &&
      !row.ValidDateConfigDesc.FixedBeginTime
    ) {
      return true; // 时间错误
    }

    const ValidDateConfigDesc = {
      FixedBeginTime: row.ValidDateConfigDesc.FixedBeginTime,
      Type: row.ValidDateConfigDesc.Type,
      FixedEndTime: row.ValidDateConfigDesc.FixedEndTime,
      Interval: row.ValidDateConfigDesc.Interval,
      IntervalUnit: row.ValidDateConfigDesc.IntervalUnit,
    };
    row.ValidDateConfig = JSON.stringify(ValidDateConfigDesc);

    return false; // 没有时间错误
  };

  /**
   * 处理兑换时间
   * @param {Object} row - 券包详情行数据
   */
  const processExchangeTime = (row) => {
    let fixedBeginTime, fixedEndTime;

    if (row.ExchangeDateConfigDesc.Type == 0) {
      // 类型0：固定时间段，使用time数组
      fixedBeginTime = common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        row.ExchangeDateConfigDesc.time[0]
      );
      fixedEndTime = common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        row.ExchangeDateConfigDesc.time[1]
      );
    } else if (row.ExchangeDateConfigDesc.Type == 1) {
      // 类型1：等同于有效期，使用有效期的数据
      fixedBeginTime = row.ValidDateConfigDesc.FixedBeginTime;
      fixedEndTime = row.ValidDateConfigDesc.FixedEndTime;
    }

    // 更新兑换期配置描述
    row.ExchangeDateConfigDesc.FixedBeginTime = fixedBeginTime;
    row.ExchangeDateConfigDesc.FixedEndTime = fixedEndTime;

    // 创建兑换期配置对象
    const ExchangeDateConfigDesc = {
      FixedBeginTime: fixedBeginTime,
      Type: row.ExchangeDateConfigDesc.Type,
      FixedEndTime: fixedEndTime,
    };

    row.ExchangeDateConfig = JSON.stringify(ExchangeDateConfigDesc);
  };

  /**
   * 获取日期字符串，处理可能为0的日期值
   * @param {number} date - 日期值
   * @returns {string} - 日期字符串
   */
  const getDateString = (date) => {
    return date != 0 ? date.toString() : "";
  };

  /**
   * 处理卡券模板的日期数据
   * @param {Object} data - 卡券模板数据
   * @param {Object} formOne - 表单数据
   * @param {Object} formData - 表单数据
   */
  const processTemplateDateData = (data, formOne, formData) => {
    // 处理有效期类型
    formData.ValidDateType = data.ValidDateType.toString();
    formOne.ValidDateType = data.ValidDateType.toString();
    formData.ExchangeDateType = data.ExchangeDateType.toString();
    formOne.ExchangeDateType = data.ExchangeDateType.toString();

    // 处理有效期
    if (data.ValidDateType == 1) {
      const validDates = [
        data.ValidBeginDate.toString(),
        data.ValidEndDate.toString(),
      ];

      formData.ValidBeginDate = validDates[0];
      formData.ValidEndDate = validDates[1];
      formOne.ValidBeginDate = validDates[0];
      formOne.ValidEndDate = validDates[1];
      formOne.time = validDates;
    }

    if (data.ValidDateType == 2) {
      formData.ValidDateAdd = data.ValidDateAdd;
      formOne.ValidDateAdd = data.ValidDateAdd;
    }

    // 处理配送期
    if (data.ExchangeDateType == 1) {
      // 处理可能为0的日期值
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
      formData.ExchangeDateAdd = data.ExchangeDateAdd;
      formOne.ExchangeDateAdd = data.ExchangeDateAdd;
    }
  };

  return {
    formatDate,
    formatDateToString,
    handleDateRange,
    processValidTime,
    processExchangeTime,
    getDateString,
    processTemplateDateData,
  };
}
