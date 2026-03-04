import md5 from "js-md5";
export const GetSign = (type, postData) => {
  let dataValue = Date.parse(new Date()) / 1000;
  postData.zySign = "";
  postData.Timestamp = dataValue;
  postData.Nonce = dataValue;
  let PropertyNamesKeys = [
    "CallAppId=" + `${import.meta.env.VITE_APP_BASE_API}`,
    "Nonce=" + dataValue,
    "Timestamp=" + dataValue,
  ];
  let Names = [];
  switch (type) {
    case "AdjustVipAccountAmount":
      Names = ["VipId", "VipAccountId", "Amount", "Remark"];
      break;
  }
  for (let j = 0; j < Names.length; j++) {
    if (postData[Names[j]]) {
      PropertyNamesKeys.push(`${Names[j]}=` + postData[Names[j]]);
    }
  }
  PropertyNamesKeys = PropertyNamesKeys.sort();
  let md5Value = "";
  PropertyNamesKeys.forEach((row, index) => {
    if (index == 0) {
      md5Value = row;
    } else {
      md5Value = md5Value + "&" + row;
    }
  });
  postData.zySign = md5(
    md5Value + "&CallAppSecret=" + `${import.meta.env.VITE_CALL_APP_SECRET}`
  );
  if (Names.length == 0) {
    //走老签名
    postData.zySign = "";
  }
  return postData;
};
