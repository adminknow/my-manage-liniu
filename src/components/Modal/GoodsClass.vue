<template>
  <!-- 修改商品分类 -->
  <el-dialog
    title="商品分类操作"
    v-model="GoodsVisible"
    width="38%"
    :show-close="false"
  >
    <el-form label-width="100px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="商品分类" style="position: relative">
            <el-tree-select
              v-model="GoodsCategoriesValue"
              :data="GoodsCategoriesList"
              multiple
              show-checkbox
              :render-after-expand="false"
              style="width: 100%"
              placeholder=""
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button1" :loading="modifyLoading" @click="modifyClass"
          >保 存</el-button
        >
        <el-button class="button2" @click="CloseVisible1">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from "vue";
import { GetPublicGoodsCategoryList } from "@/api/goods.js";
import { SearchUnites } from "@/api/index.js";
import { ElMessage } from "element-plus";
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsIDs: [],
  MallUnitId: String,
});
// //使用父组件传递过来的值
const { GoodsIDs, MallUnitId } = toRefs(props);
const GoodsCategoriesList = ref([]);
const GoodsCategoriesValue = ref([]);

const emit = defineEmits(["CloseVisible1"]);
let modifyLoading = ref(false);
const CloseVisible1 = async () => {
  emit("CloseVisible1", false);
};
const GetPublicGoodsCategoryListApi = async () => {
  let dataValue = [];
  let res = await GetPublicGoodsCategoryList({});
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      //第一级(大类)
      let object = {};
      object.value = row.GoodsCategoryId;
      object.label = row.GoodsCategoryName;
      object.children = [];
      row.SubGoodsCategories.forEach((row1) => {
        //第二级(中类)
        let objectChildren = {};
        objectChildren.value = row1.GoodsCategoryId;
        objectChildren.label = row1.GoodsCategoryName;
        objectChildren.children = [];
        row1.SubGoodsCategories.forEach((row2) => {
          //第三级(小类)
          let objectChildren2 = {};
          objectChildren2.value = row2.GoodsCategoryId;
          objectChildren2.label = row2.GoodsCategoryName;
          objectChildren.children.push(objectChildren2);
        });
        object.children.push(objectChildren);
      });
      dataValue.push(object);
    });
    GoodsCategoriesList.value = dataValue;
  }
};
watch(
  () => props.GoodsVisible,
  (newValue, oldValue) => {
    console.log(newValue);
    GetPublicGoodsCategoryListApi();
  }
);
</script>
<style scoped></style>
