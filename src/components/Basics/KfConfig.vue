<template>
  <el-form-item label="开关">
    <el-switch v-model="switchKF" @update:model-value="updateSwitch" inline-prompt active-text="开" inactive-text="关" />
  </el-form-item>

  <el-form-item label="客服昵称" v-if="switchKF">
    <el-input v-model="nickname" style="width: 50%" maxlength="200" show-word-limit :rows="2" type="textarea"
      @update:model-value="updateNickname">
    </el-input>
    <div style="width: 100%; height: 30px; font-size: 12px">
      会在客户端会话里展示，最好由中文、英文、数字组成
    </div>
  </el-form-item>
  <el-form-item label="客服头像" v-if="switchKF">
    <el-upload class="kf-uploader" ref="upload" :show-file-list="false" action="#" :http-request="SuccessImg1"
      :auto-upload="true" style="width: 100%">
      <img v-if="headimg" :src="headimg" class="kf-uploader-avatar" />
      <i v-else class="el-icon-mpzengjia"></i>
    </el-upload>
    <p class="text">
      头像，200*200 且不超过500k
      <span style="cursor: pointer; color: #ff6666" class="el-icon-delete" v-if="headimg" @click="clear">删除</span>
    </p>
  </el-form-item>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { UploadSingle } from "@/api/imgapi.js";
const props = defineProps({
  //子组件接收父组件传递过来的值
  switchKF: {
    type: String,
    default: "",
  },
  nickname: {
    type: String,
    default: "",
  },
  headimg: String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const { switchKF ,nickname,headimg} = toRefs(props);
// 计算属性
// 封装数据更新函数
const emitUpdate = (key, value) => {
  emit("update", { [key]: value });
};

// 各个字段的更新方法
const updateSwitch = (value) => {
  emitUpdate("switch-kf", value);
};

const updateNickname = (value) => {
  emitUpdate("nickname", value);
};

const SuccessImg1 = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      emitUpdate("headimg", res.DataMap.HttpsUrl);
    }
  });
};
const clear = () => {
  emitUpdate("headimg", "");
};
watch(
  () => props.switchKF,
  (newValue) => { }
);
////////////////////////////////////////////////////////////////
</script>
<style scoped>
.kf-uploader {
  width: 150px;
  height: 150px;
}

.kf-uploader .el-upload {
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.kf-uploader-avatar {
  width: 100%;
}
</style>
