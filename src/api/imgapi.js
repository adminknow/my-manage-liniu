import axios from "@/api/imgindex";
//素材接口

export function UploadSingle(data) {
  return axios({
    url: "/api/File/UploadSingle",
    method: "post",
    data: data
  });
}
export function UploadSingleToImage(data) {
  return axios({
    url: "/api/File/UploadSingleToImage",
    method: "post",
    data: data
  });
}
export function Import(data) {
  return axios({
    url: "/api/File/Import",
    method: "post",
    data: data
  });
}
//获取文件中的数据
export function GetFileData(data) {
  return axios({
    url: "/api/File/GetFileData",
    method: "post",
    data: data
  });
}
