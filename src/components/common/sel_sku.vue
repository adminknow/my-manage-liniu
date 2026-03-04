<template>
  <div class="">
    <div v-for="(item, index) in DisplaySkuList" :key="index" :index="index">
      <div v-if="item.List.length == 0">
        <div class="sel-box" style="margin-top: 4px">
          <div class="sel-goods-title flex-row justify-between">
            {{ item.GoodsTitle }}
            <div
              class="sel-goods-title2"
              data-goodsindex="{{idx1}}"
              data-goodsid="{{item.GoodsId}}"
            >
              {{ "×" + item.Qty }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="sel-box" style="margin-top: 4px">
          <div class="sel-goods-title flex-row justify-between">
            {{ item.GoodsTitle }}
            <div
              class="sel-goods-title1"
              @click="syncBtn(item.skuindex, item.GoodsId)"
              v-if="item.Qty > 1 && item.List.length > 0"
            >
              同步规格
            </div>
          </div>
          <div
            class="sel-list"
            v-for="(wrapItem, wrapIndex) in item.List"
            :key="wrapItem"
            :index="wrapIndex"
          >
            <div class="sel-title">{{ wrapItem[0].Name }}</div>
            <div class="type-list">
              <div
                @click="
                  handleClick(
                    SkuItem.state,
                    item.skuindex,
                    wrapIndex,
                    SkuIndex,
                    item.GoodsId
                  )
                "
                :class="[SkuItem.state, 'type-item']"
                v-for="(SkuItem, SkuIndex) in wrapItem"
                :key="SkuItem"
                :index="SkuIndex"
              >
                {{ SkuItem.val }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="10" :offset="10">
        <el-button class="button1" :loading="SaveLoading" @click="SaveSkuBtn"
          >保 存</el-button
        >
        <el-button class="button2" @click="closeSkuBtn">关 闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  //子组件接收父组件传递过来的值
  openSkuModal: Boolean,
  ExchangeArr: {}, //传进来的兑换商品，
});
// //使用父组件传递过来的值
const { openSkuModal, ExchangeArr } = toRefs(props);
watch(
  () => props.openSkuModal,
  (newValue, oldValue) => {
    //这里是用来监控父组件 点击按钮打开
    if (newValue) {
      init();
      SyncSelSku();
    }
  }
);
const DisplaySkuList = ref([]); //自定义所有sku 属性与明细
const DisplayGoodsList = ref([]);
const SelSkus = ref([]); //用于把选中的sku 都返回到父组件
const ChangeSelSkus = ref([]); //当用户点击关闭时，之前却已经选好了所有数据，那么就传这个值给父组件
const sku_list = ref([]); //所有可以选择的sku明细

const skuindex = ref(""); //sku索引
const all_ids = ref([]); //sku相关数据，用于后续操作
const SaveLoading = ref(false);

//初始化把数据加载好
const init = () => {
  DisplayGoodsList.value = [];
  DisplaySkuList.value = [];
  let SelectedSkus = []; //处理当前点击的商品
  let SkuIndex = 0; //为了方便后续操作定位索引
  let ExchangeArrValue = ExchangeArr.value;
  //处理当前点击的商品
  SelectedSkus = ExchangeArrValue.SelectedSkus
    ? ExchangeArrValue.SelectedSkus
    : [];
  SelSkus.value = SelectedSkus;
  ChangeSelSkus.value = JSON.parse(JSON.stringify(SelectedSkus));
  if (ExchangeArrValue.GoodsType == 2) {
    //普通商品有sku
    if (ExchangeArrValue.GoodsSkuCount > 0) {
      DisplayGoodsList.value.push(ExchangeArrValue);
    }
  } else {
    //组合装商品有sku
    if (ExchangeArrValue.PackageDetailHasSku) {
      ExchangeArrValue.PackageDetails.forEach((PackageDetailRow) => {
        PackageDetailRow.Qty = ExchangeArrValue.Qty * PackageDetailRow.GoodsQty;
        PackageDetailRow.PackageGoodsTitle = ExchangeArrValue.GoodsTitle;
        PackageDetailRow.GoodsProperties = PackageDetailRow.Goods
          .GoodsProperties
          ? PackageDetailRow.Goods.GoodsProperties
          : [];
        PackageDetailRow.GoodsSkus = PackageDetailRow.Goods.Skus
          ? PackageDetailRow.Goods.Skus
          : [];
        PackageDetailRow.GoodsId = PackageDetailRow.GoodsId;
        PackageDetailRow.GoodsTitle = PackageDetailRow.Goods.GoodsTitle;
        PackageDetailRow.GoodsCode = PackageDetailRow.Goods.GoodsCode;
        PackageDetailRow.PackageDetailHasSku =
          ExchangeArrValue.PackageDetailHasSku;
        PackageDetailRow.GoodsType = ExchangeArrValue.GoodsType;
        DisplayGoodsList.value.push(PackageDetailRow);
      });
    }
  }
  for (
    let GoodsIndex = 0;
    GoodsIndex < DisplayGoodsList.value.length;
    GoodsIndex++
  ) {
    const Frow = DisplayGoodsList.value[GoodsIndex];
    if (Frow.GoodsSkus.length == 0 && Frow.GoodsType == 3) {
      //初始化数据
      let AddSku = {
        GoodsId: Frow.GoodsId,
        PackageGoodsId: Frow.PackageGoodsId ? Frow.PackageGoodsId : "",
        GoodsTitle:
          Frow.GoodsCode +
          "-" +
          Frow.GoodsTitle +
          " " +
          (Frow.PackageGoodsTitle ? Frow.PackageGoodsTitle : ""),
        all_idsDesc: "",
        GoodsSkuIndex: 0,
        sku_id: "",
        Qty: Frow.Qty,
        skuindex: SkuIndex,
        List: [],
        hasSku: false,
      };
      SkuIndex++;
      DisplaySkuList.value.push(AddSku);
    } else {
      for (let index = 0; index < Frow.Qty; index++) {
        let sku = null;
        for (let SelSkuI = 0; SelSkuI < SelectedSkus.length; SelSkuI++) {
          if (SelectedSkus[SelSkuI].GoodsId == Frow.GoodsId) {
            sku = SelectedSkus[SelSkuI];
            SelectedSkus.splice(SelSkuI, 1);
            break;
          }
        }
        //初始化数据
        let AddSku = {
          GoodsId: Frow.GoodsId,
          PackageGoodsId: Frow.PackageGoodsId ? Frow.PackageGoodsId : "",
          GoodsTitle:
            Frow.GoodsCode +
            "-" +
            Frow.GoodsTitle +
            " " +
            (Frow.PackageGoodsTitle ? Frow.PackageGoodsTitle : ""),
          all_idsDesc: "",
          GoodsSkuIndex: index,
          sku_id: "",
          Qty: Frow.Qty,
          skuindex: SkuIndex,
          List: [],
          hasSku: false,
        };
        SkuIndex++;
        //SelectedSkus 是之前选中的sku数据，把选中的sku明细赋值到临时变量，方便下面操作
        if (sku) {
          AddSku.sku_id = sku.sku_id;
          AddSku.all_idsDesc = sku.all_idsDesc;
        }
        Frow.GoodsProperties.forEach((PropertiesRow) => {
          AddSku.hasSku = true;
          //循环所有属性，
          let prop = [];
          PropertiesRow.Details.forEach((propDetailsRow) => {
            //循环所有属性明细，设置sel或ban，
            let obj = {
              GoodsId: Frow.GoodsId,
              val: propDetailsRow.Name,
              state: "",
              Name: PropertiesRow.Name,
              images: "",
              PropId: PropertiesRow.Id,
            };
            let isBen = false;
            //初始化的时候，把后台停用的sku节点禁止点击
            for (let i = 0; i < Frow.GoodsSkus.length; i++) {
              for (let j = 0; j < Frow.GoodsSkus[i].SkuProperties.length; j++) {
                if (
                  Frow.GoodsSkus[i].SkuProperties[j].PropDetailId ==
                    propDetailsRow.Id &&
                  Frow.GoodsSkus[i].SkuProperties[j].SkuStatus == 1
                ) {
                  isBen = true;
                  break;
                }
              }
              if (isBen) {
                break;
              }
            }
            if (!isBen) {
              obj.state = "ban";
              obj.Status = 0;
            } else {
              obj.Status = 1;
            }
            //如果当前有选中的sku 那么把sku节点设置为选中
            if (sku) {
              // sku.sku_id = "";
              let SkuProperties = [];
              for (let Goodsi = 0; Goodsi < Frow.GoodsSkus.length; Goodsi++) {
                if (Frow.GoodsSkus[Goodsi].SkuId == sku.sku_id) {
                  SkuProperties = Frow.GoodsSkus[Goodsi].SkuProperties;
                  break;
                }
              }
              for (
                let skuIndex = 0;
                skuIndex < SkuProperties.length;
                skuIndex++
              ) {
                if (SkuProperties[skuIndex].PropDetailId == propDetailsRow.Id) {
                  obj.state = "sel";
                  break;
                }
              }
            }
            prop.push(obj);
          });
          AddSku.List.push(prop);
        });
        DisplaySkuList.value.push(AddSku);
      }
    }
    getSkuList(Frow);
  }
  updateSeletSku();
};

////////////////////////////////////////////////////////////////
//一键同步
const syncBtn = (skuindexPost, GoodsId) => {
  skuindex.value = skuindexPost; //数据索引
  let handleSku = DisplaySkuList.value[skuindex.value]; //正在操作的SKU
  if (handleSku.sku_id == "") {
    ElMessage.error("请选择全部规格");
    return;
  }
  for (let index = 0; index < DisplaySkuList.value.length; index++) {
    //当前点击同步的索引在所有选择的节点里面，那么就是可以同步
    let copySKu = DisplaySkuList.value[index];
    if (
      handleSku.GoodsId == copySKu.GoodsId &&
      handleSku.skuindex != copySKu.skuindex
    ) {
      for (let n = 0; n < handleSku.List.length; n++) {
        for (let s = 0; s < handleSku.List[n].length; s++) {
          copySKu.List[n][s].state = handleSku.List[n][s].state;
        }
      }
      copySKu.sku_id = handleSku.sku_id;
      copySKu.all_idsDesc = handleSku.all_idsDesc;
    }
  }
  SyncSelSku();
};

//选中节点
const handleClick = (
  statePost,
  skuindexPost,
  trindexPost,
  tdindexPost,
  goodsidPost
) => {
  //(state:状态，skuindex:sku索引,trindex:属性索引,tdindex：明细索引，)
  //选择商品类型
  let state = statePost;
  skuindex.value = skuindexPost;
  let trindex = trindexPost;
  let tdindex = tdindexPost;
  let goodsid = goodsidPost; //组合券里面的goodsid
  let handleSku = DisplaySkuList.value[skuindex.value]; //正在操作的规格
  if (state == "ban") {
    //被锁定
    return;
  } else if (state == "sel") {
    //被选择取反
    handleSku.List[trindex][tdindex].state = "";
  } else if (state == "") {
    //选择
    //优化结果
    for (let i = 0; i < handleSku.List[trindex].length; i++) {
      //将原来同一属性下所有选中的明细 设置为不选中
      if (handleSku.List[trindex][i].state == "sel") {
        handleSku.List[trindex][i].state = "";
        break;
      }
    }
    handleSku.List[trindex][tdindex].state = "sel";
  }
  let select_ids = getSelAttrId(); //已选择的ids数组
  all_ids.value = filterAttrs(select_ids, goodsid); //已选择包含的所有节点，且有库存
  set_block();
  update(goodsid);
  let selLength = 0;
  for (let s = 0; s < handleSku.List.length; s++) {
    for (let e = 0; e < handleSku.List[s].length; e++) {
      if (handleSku.List[s][e].state == "sel") {
        selLength++;
        break;
      }
    }
  }
  if (selLength == handleSku.List.length) {
    let v1_all_ids = all_ids.value.filter((item, index, array) => {
      return array.indexOf(item) === index;
    });
    let attrsVal = v1_all_ids.join("|");
    for (let i = 0; i < sku_list.value.length; i++) {
      if (
        sku_list.value[i].attrs == attrsVal &&
        sku_list.value[i].GoodsId == goodsid
      ) {
        //找到了对应的skuid
        handleSku.sku_id = sku_list.value[i].sku_id;
        handleSku.all_idsDesc =
          sku_list.value[i].SkuCode +
          " " +
          handleSku.GoodsTitle +
          "（" +
          v1_all_ids.join("、") +
          "）";
        break;
      }
    }
  } else {
    //属性明细没有全选，就删掉sku；
    handleSku.sku_id = "";
    handleSku.all_idsDesc = "";
  }
  SyncSelSku();
};

////////////////////////////////////////////////////////////////
//同步选择的sku
const SyncSelSku = () => {
  let SelSkuListFather = [];
  for (let i = 0; i < DisplaySkuList.value.length; i++) {
    const row = DisplaySkuList.value[i];
    if (row.sku_id != "") {
      //把选中的sku全部拧出来
      SelSkuListFather.push({
        GoodsId: row.GoodsId,
        PackageGoodsId: row.PackageGoodsId ? row.PackageGoodsId : "",
        sku_id: row.sku_id,
        all_idsDesc: row.all_idsDesc,
      });
    }
  }
  SelSkus.value = SelSkuListFather;
};

////////////////////////////////////////////////////////////////
//获取选中的id数组
const getSelAttrId = () => {
  let list = [];
  let SelectSku = DisplaySkuList.value[skuindex.value];
  for (let i = 0; i < SelectSku.List.length; i++) {
    for (let j = 0; j < SelectSku.List[i].length; j++) {
      if (SelectSku.List[i][j].state == "sel") {
        list.push(SelectSku.List[i][j].val);
      }
    }
  }
  return list;
};

////////////////////////////////////////////////////////////////
//获取经过已选节点 所有线路上的全部节点
// 根据已经选择得属性值，得到余下还能选择的属性值
const filterAttrs = (ids, goodsid) => {
  var products = filterProduct(ids, goodsid);
  var result = [];
  products.forEach(function (v, k) {
    result = result.concat(v["attrs"].split("|"));
  });
  return result;
};
//获取所有包含指定节点的路线
const filterProduct = (ids, goodsid) => {
  let result = [];
  sku_list.value.forEach(function (v, k) {
    if (goodsid == v.GoodsId) {
      let _attr = "|" + v["attrs"] + "|";
      let _all_ids_in = true;
      for (k in ids) {
        if (_attr.indexOf("|" + ids[k] + "|") == -1) {
          _all_ids_in = false;
          break;
        }
      }
      if (_all_ids_in) {
        result.push(v);
      }
    }
  });
  return result;
};
const set_block = () => {
  //sku相关操作
  let list = [];
  let listTemp = [];
  let SelectSku = DisplaySkuList.value[skuindex.value];
  for (let a = 0; a < SelectSku.List.length; a++) {
    listTemp.push(a);
  }
  for (let k = 0; k < SelectSku.List.length; k++) {
    for (let z = 0; z < SelectSku.List[k].length; z++) {
      if (SelectSku.List[k][z].state == "sel") {
        list.push(k);
        break;
      }
    }
  }
  let aSet = new Set(listTemp);
  let bSet = new Set(list);
  let differenceNew = Array.from(
    new Set(listTemp.concat(list).filter((v) => aSet.has(v) && !bSet.has(v)))
  );
  for (let i = 0; i < differenceNew.length; i++) {
    for (let j = 0; j < SelectSku.List[differenceNew[i]].length; j++) {
      if (SelectSku.List[differenceNew[i]][j].state != "sel") {
        if (all_ids.value.includes(SelectSku.List[differenceNew[i]][j].val)) {
          SelectSku.List[differenceNew[i]][j].state = "";
        } else {
          SelectSku.List[differenceNew[i]][j].state = "ban";
        }
      }
    }
  }
};
const update = (goodsid) => {
  //sku相关操作
  let list = [];
  let select_ids = getSelAttrId();
  let SelectSku = DisplaySkuList.value[skuindex.value];
  for (let i = 0; i < SelectSku.List.length; i++) {
    for (let j = 0; j < SelectSku.List[i].length; j++) {
      if (SelectSku.List[i][j].state == "sel") {
        list.push(i);
        break;
      }
    }
  }
  for (let a = select_ids.length - 1; a >= 0; a--) {
    let select_ids2 = del_array_val(select_ids, select_ids[a]);
    let all_ids = filterAttrs(select_ids2, goodsid);
    SelectSku.List[list[a]].forEach((v1, k1) => {
      if (v1.state != "sel") {
        if (all_ids.includes(v1.val) && v1.Status == 1) {
          SelectSku.List[list[a]][k1].state = "";
        } else {
          SelectSku.List[list[a]][k1].state = "ban";
        }
      }
    });
  }
};
//用于组合券
const updateSeletSku = () => {
  //sku相关操作
  for (let i = 0; i < DisplaySkuList.value.length; i++) {
    if (DisplaySkuList.value[i].sku_id != "") {
      skuindex.value = i;
      update(DisplaySkuList.value[i].GoodsId);
    }
  }
};
const del_array_val = (arr, val) => {
  //去除 数组 arr中的 val ，返回一个新数组
  var a = [];
  for (let k in arr) {
    if (arr[k] != val) {
      a.push(arr[k]);
    }
  }
  return a;
};

////////////////////////////////////////////////////////////////
//获取所有可选择的skuList
const getSkuList = (GoodsPost) => {
  let SkuList = sku_list.value;
  for (let q = 0; q < GoodsPost.GoodsSkus.length; q++) {
    let arr = {
      attrs: "",
      price: GoodsPost.GoodsSkus[q].OrgPrice / 100,
      sku_id: GoodsPost.GoodsSkus[q].SkuId,
      GoodsId: GoodsPost.GoodsId,
      SkuCode: GoodsPost.GoodsSkus[q].SkuCode,
    };
    let isInsert = true;
    for (let w = 0; w < GoodsPost.GoodsSkus[q].SkuProperties.length; w++) {
      if (GoodsPost.GoodsSkus[q].SkuProperties[w].SkuStatus == 1) {
        if (w == 0) {
          arr.attrs = GoodsPost.GoodsSkus[q].SkuProperties[w].PropDetailName;
        } else {
          arr.attrs =
            arr.attrs +
            "|" +
            GoodsPost.GoodsSkus[q].SkuProperties[w].PropDetailName;
        }
      } else {
        isInsert = false;
      }
    }
    if (!isInsert) {
      continue;
    }
    SkuList.push(arr);
  }
  const map = new Map();
  const newArr = SkuList.filter(
    (v) => !map.has(v.sku_id) && map.set(v.sku_id, 1)
  );
};

////////////////////////////////////////////////////////////////
//初始化
init();
const emit = defineEmits(["clickChild"]);
const SaveSkuBtn = () => {
  SaveLoading.value = true;
  let SelSkuList = [];
  let passBool = true;
  for (let i = 0; i < DisplaySkuList.value.length; i++) {
    const Sku = DisplaySkuList.value[i];
    if (Sku.hasSku) {
      if (Sku.sku_id == "") {
        passBool = false;
        break;
      }
    }
    //把选中的sku全部拧出来
    SelSkuList.push({
      GoodsId: Sku.GoodsId,
      PackageGoodsId: Sku.PackageGoodsId ? Sku.PackageGoodsId : "",
      sku_id: Sku.sku_id,
      all_idsDesc: Sku.all_idsDesc
        ? Sku.all_idsDesc
        : Sku.GoodsTitle + " × " + Sku.Qty,
    });
  }
  if (!passBool) {
    ElMessage.error("请选择全部规格");
    SaveLoading.value = false;
    return;
  }

  //传递给父组件,把已经选好的sku 返还给父组件
  SaveLoading.value = false;
  let post = {
    SelSkus: SelSkuList,
    GoodsId: ExchangeArr.value.GoodsId,
  };
  if (DetermineInventory(post, ExchangeArr.value)) {
    SaveLoading.value = false;
    return;
  }
  emit("saveSku", post);
};
const DetermineInventory = (SelSkuIDList, ExchangeArr) => {
  let isInventory = true;
  let ErrorDesc = "";
  //先获取到所有选中的skuID，然后把选中的SKUID拿到池子里去匹配是否有库存
  let SelSkuIDListValue = [];
  for (let n = 0; n < SelSkuIDList.SelSkus.length; n++) {
    if (SelSkuIDList.SelSkus[n].sku_id) {
      SelSkuIDListValue.push(SelSkuIDList.SelSkus[n].sku_id);
    }
  }
  if (ExchangeArr.PackageDetailHasSku) {
    for (let i = 0; i < SelSkuIDListValue.length; i++) {
      const row = SelSkuIDListValue[i];
      for (let m = 0; m < ExchangeArr.PackageDetails.length; m++) {
        for (
          let j = 0;
          j < ExchangeArr.PackageDetails[m].GoodsSkus.length;
          j++
        ) {
          const row1 = ExchangeArr.PackageDetails[m].GoodsSkus[j];
          if (row == row1.SkuId && row1.SkuStatus == 0) {
            //如果选中的skuID是没有库存的那么直接break
            isInventory = false;
            ErrorDesc =
              ExchangeArr.PackageDetails[m].GoodsTitle +
              "(" +
              row1.PropertyDesc +
              ")库存不足";
            break;
          }
        }
        if (!isInventory) {
          //只要轮到的第一个没有库存的话直接就break；
          break;
        }
      }
      if (!isInventory) {
        //只要轮到的第一个没有库存的话直接就break；
        break;
      }
    }
  } else {
    for (let i = 0; i < SelSkuIDListValue.length; i++) {
      const row = SelSkuIDListValue[i];
      for (let j = 0; j < ExchangeArr.GoodsSkus.length; j++) {
        const row1 = ExchangeArr.GoodsSkus[j];
        if (row == row1.SkuId && row1.SkuStatus == 0) {
          //如果选中的skuID是没有库存的那么直接break
          isInventory = false;
          ErrorDesc =
            ExchangeArr.GoodsTitle +
            "(" +
            row1.PropertyDesc +
            ")库存不足";
          break;
        }
      }
      if (!isInventory) {
        //只要轮到的第一个没有库存的话直接就break；
        break;
      }
    }
  }
  if (!isInventory) {
    ElMessage.error(ErrorDesc);
  }
  return !isInventory;
};
const closeSkuBtn = () => {
  let post = {
    SelSkus: ChangeSelSkus.value,
    GoodsId: ExchangeArr.value.GoodsId,
  };
  emit("closeSku", post);
};
</script>
<style scoped>
.sel-box {
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.sel-box .sel-list {
  margin-top: 4px;
}

.sel-goods-title {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  font-size: 15px;
  position: relative;
  padding-left: 12px;
  height: 35px;
  line-height: 35px;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(255, 134, 134, 1) 0%,
    rgba(200, 30, 87, 1) 100%
  );
}

.sel-goods-title1 {
  position: absolute;
  right: 12px;
  border-radius: 5px;
  height: 25px;
  margin-top: 5px;
  line-height: 25px;
  padding: 0 6px;
  font-size: 11px;
  border: solid 1px #fff;
}

.sel-goods-title2 {
  position: absolute;
  right: 12px;
  border-radius: 5px;
  height: 25px;
  margin-top: 5px;
  line-height: 25px;
  padding: 0 6px;
  font-size: 15px;
}

.sel-box .sel-list .sel-title {
  font-size: 13px;
  color: #333;

  line-height: 20px;
  padding-left: 12px;
  font-weight: 600;
}

.sel-box .sel-list .type-list {
  padding-left: 12px;
}

.sel-box .sel-list .type-list {
  overflow: hidden;
}

.sel-box .sel-list .type-list .type-item {
  display: inline-block;
  float: left;
  height: 25px;
  line-height: 24px;
  padding-left: 7px;
  padding-right: 7px;
  font-size: 12px;
  color: #080808;
  border-radius: 2px;
  margin-right: 12px;
  margin-bottom: 7px;
  background-color: #f6f6f6;
  cursor: pointer;
}

.sel-box .sel-list .type-list .sel {
  border: solid 1px #c81e57;
  color: #c81e57;
  background-color: #fff;
}

.sel-box .sel-list .type-list .ban {
  background-color: #f7f7f7;
  color: #d8d8d8;
}
</style>
