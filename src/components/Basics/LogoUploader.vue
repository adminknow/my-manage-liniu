<!--  -->
<template>
  <el-upload
    class="logo-uploader"
    ref="upload"
    :show-file-list="false"
    action="#"
    :http-request="SuccessImg1"
    :auto-upload="true"
    style="width: 100%"
  >
    <img v-if="valueImgUrl" :src="valueImgUrl" class="logo-uploader-avatar" />
    <i v-else class="el-icon-mpzengjia"></i>
  </el-upload>
  <div class="text">建议：810*350 且不超过1M</div>
</template>

<script setup>
import { toRefs, watch } from "vue";
import { UploadSingle } from "@/api/imgapi.js";
const props = defineProps({
  //子组件接收父组件传递过来的值
  valueImgUrl: String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const {valueImgUrl} = toRefs(props);
const SuccessImg1 = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      emit("update", res.DataMap.HttpsUrl);
    }
  });
};
////////////////////////////////////////////////////////////////
</script>
<style scoped>
.logo-uploader-avatar {
  width: 100%;
}
</style>
