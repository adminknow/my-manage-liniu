<template>
  <el-form-item label="开关">
    <el-switch disabled v-model="switchValue" inline-prompt active-text="开" inactive-text="关" />
  </el-form-item>
  <el-form-item label="商品分类的层级" v-if="switchValue" label-width="160px">
    <el-select disabled style="width: 40%" v-model="categoryLevel" placeholder="请选择层级">
      <el-option label="小类(1级)" value="1"> </el-option>
      <el-option label="中类-小类(2级)" value="2"> </el-option>
      <el-option label="大类-中类-小类(3级)" value="3"> </el-option>
    </el-select>
  </el-form-item>
  <!-- 仅限券商操作，需要加一个判断 -->
  <el-form-item label="商城是否开放外部供应商" v-if="switchValue" >
    <!-- 1:不开放，0开放 -->
    <el-select :disabled="unitType!=2" style="width: 40%" v-model="onlyMySel" placeholder="请选择" @update:model-value="updateOnlyMySel">
      <el-option label="否" value="1"> </el-option>
      <el-option label="是" value="0"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="是否隐藏商品库存" v-if="switchValue" label-width="160px">
    <el-select disabled style="width: 40%" v-model="stockHide" placeholder="请选择层级">
      <el-option label="是" value="1"> </el-option>
      <el-option label="否" value="0"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label-width="180px" label="从券跳转至购买的提示">
    <el-input v-model="buyNotice" :disabled="unitName == '礼牛网' ? true : false" style="width: 40%" maxlength="200"
      show-word-limit :rows="2" type="textarea" placeholder="商城跳转说明提示" @update:model-value="updateBuyNotice"></el-input>
  </el-form-item>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
const props = defineProps({
  //子组件接收父组件传递过来的值
  switchComponent: {
    type: String,
    default: "",
  },
  categoryLevel: {
    type: String,
    default: "",
  },
  stockHide: String,
  onlyMy: String,
  buyNotice: String,
  unitName: String,
  unitType:String,
});
const emit = defineEmits(["update"]);
// //使用父组件传递过来的值
const { switchComponent, categoryLevel, stockHide, onlyMy,buyNotice, unitName,unitType } = toRefs(props);
// 计算属性
const switchValue = ref(false);
const onlyMySel = ref(onlyMy.value);
// 封装数据更新函数
const emitUpdate = (key, value) => {
  emit("update", { [key]: value });
};

// 各个字段的更新方法
const updateBuyNotice = (value) => {
  emitUpdate("buyNotice", value);
};

const updateOnlyMySel = (value) => {
  emitUpdate("onlyMy", value);
};
watch(
  () => props.switchComponent,
  (newValue) => {
    switchValue.value = newValue;
  }
);
watch(
  () => props.onlyMy,
  (newValue) => {
    onlyMySel.value = newValue;
  }
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
