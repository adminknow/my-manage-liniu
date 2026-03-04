import axios from "../utils/request";
//分页查询某个会员的券
export function SearchPayBills(data) {
  return axios({
    url: "/api/Finance/SearchPayBills",
    method: "post",
    data,
  });
}
//分页查询会员
export function GetPayBill(data) {
  return axios({
    url: "/api/Finance/GetPayBill",
    method: "post",
    data,
  });
}
