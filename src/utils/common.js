import store from "@/store";
import { computed } from "vue";
//转换选择的时间控件
var dateFormat = function (fmt, date) {
  let ret = "";
  date = new Date(date);
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
};
//把转换的时间 String转换成int类型
const dateFormatByInt = (value) => {
  const res = value.split(" ");
  return res[0].replaceAll("-", "") + res[1].replaceAll(":", "");
};
var dateFortime = function (date) {
  date = new Date(date);
  const opt = {
    y: date.getFullYear().toString(), // 年
    m: (date.getMonth() + 1).toString(), // 月
    d: date.getDate().toString(), // 日
    H: date.getHours().toString(), // 时
    M: date.getMinutes().toString(), // 分
    S: date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  return opt;
};
const ClosePageTag = (PageName) => {
  const tagsList = computed(() => store.state.tags.tagsList);
  let list = tagsList.value;
  list.forEach((tag, index) => {
    if (tag.title === PageName) {
      store.commit("tags/delTagsItem", { index });
    }
  });
};
const numFormat = (value) => {
  const res = value.toString().replace(/d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(d)(?=(d{3})+$)/g, function ($1) {
      return $1 + ",";
    });
  });
  return res;
};
var guid = function (fmt, date) {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};
//获取当前时间
const getTime = () => {
  let myDate = new Date();
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  let getHours =
    myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours();
  let getMinutes =
    myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();
  let getSeconds =
    myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
  let time =
    myDate.getFullYear() +
    "-" +
    (myDate.getMonth() + 1) +
    "-" +
    myDate.getDate() +
    " " +
    getHours +
    ":" +
    getMinutes +
    ":" +
    getSeconds;
  return time;
};
const windowScreenHeight = () => {
  return window.screen.height * 0.58;
};

/**
 * 获取当前日期
 * @returns {string} 当前日期字符串
 */
const getNowDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dateStr = `${year}-${getFormatDate(month)}-${getFormatDate(day)}`;
  return dateStr;
};

/**
 * 格式化日期
 * @param {number} value - 日期值
 * @returns {string} 格式化后的日期字符串
 */
const getFormatDate = (value) => {
  return value < 10 ? `0${value}` : value;
};

/**
 * 计算日期差值
 * @param {string} firstDate - 开始日期
 * @param {string} secondDate - 结束日期
 * @param {number} differ - 差值类型
 * @returns {number} 日期差值
 */
const getDifferDate = (firstDate, secondDate, differ) => {
  // 1)将两个日期字符串转化为日期对象
  const startDate = new Date(firstDate);
  const endDate = new Date(secondDate);
  // 2)计算两个日期相差的毫秒数
  const msecNum = endDate.getTime() - startDate.getTime();
  // 3)计算两个日期相差的天数
  const dayNum = Math.floor(msecNum / (24 * 60 * 60 * 1000));
  return dayNum;
};

export default {
  guid,
  dateFormat,
  dateFortime,
  ClosePageTag,
  numFormat,
  getTime,
  dateFormatByInt,
  windowScreenHeight,
  getNowDate,
  getFormatDate,
  getDifferDate,
};
