<template>
  <!-- 针对商品修改价格 -->
  <el-dialog title="商品设置" v-model="localGoodsVisible" width="30%" :show-close="false" :close-on-click-modal="false">
    <div style="width:100%;height: 18px;"></div>
    <div class="" style="padding: 0 20px">
      <el-form label-width="90px">
        <el-form-item label="原价">
          <el-input v-model="goodsForm.OrgPrice"><template #append>元</template></el-input>
        </el-form-item>
        <el-form-item label="零售价">
          <el-input v-model="goodsForm.SellPrice"><template #append>元</template></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="满">
              <el-input v-model="goodsForm.WholesaleBeginQty">
                <template #append>件</template></el-input>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="每件">
              <el-input v-model="goodsForm.WholesalePrice">
                <template #append>元</template></el-input>
            </el-form-item></el-col>
        </el-row>
        <el-form-item label="商品分类" style="position: relative">
          <el-tree-select ref="treeRef" v-model="goodsForm.GoodsCategories" :data="GoodsCategoriesList" multiple
            show-checkbox :render-after-expand="false" style="width: 100%" placeholder="" />
        </el-form-item>
        <el-form-item label="排序" v-if="loginUser.UnitId == 2">
          <el-input v-model="goodsForm.CompositeIndex"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="button1" :loading="passLoading" @click="modifyClass">保 存</el-button>
        <el-button class="button2" @click="CloseVisible1">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  nextTick,
} from "vue";
import {
  GetMallGoods,
  SaveGoodsMallPrice,
  SaveGoodsMallInfo,
  GetPublicGoodsCategoryList,
  GetGoodsCategoryList,
} from "@/api/goods.js";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";
const { proxy } = getCurrentInstance();
const props = defineProps({
  //子组件接收父组件传递过来的值
  GoodsVisible: Boolean,
  SkuID: String,
  GoodsID: String,
  CreateUnitId: String,
});
// //使用父组件传递过来的值
const { SkuID, GoodsID, CreateUnitId } = toRefs(props);

const localGoodsVisible = ref(props.GoodsVisible);

const loginUser = JSON.parse(Cookie.get("User"));
const emit = defineEmits(["CloseVisible"]);
const CloseVisible1 = async () => {
  emit("CloseVisible", false);
};
const GoodsCategoriesList = ref([]);
let passLoading = ref(false);
let goodsForm = reactive({
  GoodsId: GoodsID,
  MallUnitId: CreateUnitId,
  SkuId: "",
  OrgPrice: "",
  SellPrice: "",
  WholesalePrice: "",
  WholesaleBeginQty: "",
  GoodsCategories: [],
  CompositeIndex: "",
});
const GetMallGoodsApi = async () => {
  let res = await GetMallGoods({
    GoodsId: goodsForm.GoodsId,
    UnitId: goodsForm.MallUnitId,
  });
  if (res.Code == 200) {
    if (res.DataMap.Index) {
      goodsForm.CompositeIndex = res.DataMap.Index.CompositeIndex;
    }
    goodsForm.GoodsCategories = [];
    for (let i = 0; i < res.DataMap.Malls.length; i++) {
      const el = res.DataMap.Malls[i];
      if (el.UnitId == goodsForm.MallUnitId) {
        let data = el.Price;
        if (data) {
          goodsForm.OrgPrice = (data.OrgPrice / 100).toFixed(2);
          goodsForm.SellPrice = (data.SellPrice / 100).toFixed(2);
          goodsForm.WholesalePrice = (data.WholesalePrice / 100).toFixed(2);
          goodsForm.WholesaleBeginQty = data.WholesaleBeginQty;
          goodsForm.SkuId = data.SkuId;
        }
        el.Categories.forEach((row) => {
          goodsForm.GoodsCategories.push(row.Id);
        });
        break;
      }
    }
    //判断一下当前初始化价格没有
    if (goodsForm.OrgPrice == "") {
      goodsForm.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
      goodsForm.SellPrice = (res.DataMap.SellPrice / 100).toFixed(2);
    }
  }
};
const modifyClass = async () => {
  //修改价格
  let formSubmitData = JSON.parse(JSON.stringify(goodsForm));
  passLoading.value = true;
  let list = [];
  goodsForm.GoodsCategories.forEach((row) => {
    list.push({
      Id: row,
    });
  });
  let res = await SaveGoodsMallInfo({
    GoodsId: formSubmitData.GoodsId,
    UnitId: formSubmitData.MallUnitId,
    GoodsCategories: list,
    DeleteOldCategory: true,
    Price: {
      SkuId: formSubmitData.SkuId,
      SellPrice: formSubmitData.SellPrice * 100,
      OrgPrice: formSubmitData.OrgPrice * 100,
      WholesalePrice: formSubmitData.WholesalePrice * 100,
      WholesaleBeginQty: formSubmitData.WholesaleBeginQty,
    },
    Index: {
      CompositeIndex: goodsForm.CompositeIndex,
    },
  });
  passLoading.value = false;
  if (res.Code == 200) {
    ElMessage.success("修改成功");
    emit("CloseVisible", 1);
  }else{
    ElMessage.error(res.Message);
  }
};
const GetPublicGoodsCategoryListApi = async () => {
  let dataValue = [];
  let res = null;
  if (goodsForm.MallUnitId == 1 || goodsForm.MallUnitId == 2) {
    res = await GetPublicGoodsCategoryList({
      UnitId: goodsForm.MallUnitId,
    });
  } else {
    res = await GetPublicGoodsCategoryList({
      UnitId: goodsForm.MallUnitId,
    });
  }
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
    GetMallGoodsApi();
  }
};
watch(
  () => props.GoodsVisible,
  (newValue, oldValue) => {
    localGoodsVisible.value = newValue;
    goodsForm.OrgPrice = "";
    goodsForm.SellPrice = "";
    goodsForm.WholesalePrice = "";
    goodsForm.WholesaleBeginQty = "";
    goodsForm.SkuId = "";
    goodsForm.GoodsCategories = [];
    if (localGoodsVisible.value) {
      GetPublicGoodsCategoryListApi();
    }

  }
);
</script>
<style scoped></style>
