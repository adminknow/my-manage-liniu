<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="10">
          <el-row>
            <el-col :span="23">
              <el-form-item label="商品类型">
                <el-select
                  :disabled="Type == 'View'"
                  @change="changeGoodsType"
                  v-model="form.GoodsType"
                  style="width: 100%"
                  placeholder="商品类型"
                >
                  <el-option label="普通商品" value="2"></el-option>
                  <el-option label="组合装商品" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="品牌">
                <el-select
                  :disabled="Type == 'View'"
                  v-model="form.BrandId"
                  clearable
                  filterable
                  placeholder="请选择品牌"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in brands"
                    :key="item.BrandName"
                    :label="item.BrandName"
                    :value="item.BrandId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="首图" ref="uploadElement" prop="">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="form.ListImg" v-if="false"></el-input>
                    <el-upload
                      class="commodity-home-uploader"
                      ref="upload"
                      :show-file-list="false"
                      action="#"
                      :http-request="SuccessImg"
                      :before-upload="beforeUpload"
                      :auto-upload="true"
                    >
                      <img
                        v-if="form.ListImg"
                        :src="form.ListImg"
                        class="commodity-home-uploader-avatar"
                      />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      首图，300*300 且不超过500k
                      <span
                        style="cursor: pointer; color: #ff6666"
                        class="el-icon-delete"
                        v-if="form.ListImg && Type != 'View'"
                        @click="clear"
                        >删除</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="商品编码" prop="GoodsCode">
                <el-input
                  :disabled="Type == 'View'"
                  v-model="form.GoodsCode"
                  maxlength="15"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="商品标题" prop="GoodsTitle">
                <el-input
                  :disabled="Type == 'View'"
                  v-model="form.GoodsTitle"
                  maxlength="40"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="商品副标题">
                <el-input
                  :disabled="Type == 'View'"
                  v-model="form.GoodsSubTitle"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="差异兑换模板">
                <el-input
                  :disabled="true"
                  v-model="form.DiffExchangeTemplateName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button
                v-if="Type != 'View'"
                class="button1"
                round
                @click="AddExchangeTemplateListBtn"
              >
                &nbsp;&nbsp;选择模板&nbsp;&nbsp;
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="价格" prop="OrgPrice">
                <el-input v-model="form.OrgPrice" :disabled="Type == 'View'">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="条形码" label-width="100px">
                <el-input
                  v-model="form.GoodsBarcode"
                  :disabled="Type == 'View'"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px" v-if="form.GoodsType == 3">
            <el-col :span="23">
              <el-form-item label="组合商品">
                <el-button
                  v-if="Type != 'View'"
                  class="button1"
                  round
                  @click="addGoodBtn"
                >
                  &nbsp;&nbsp;添加商品&nbsp;&nbsp;
                </el-button>
              </el-form-item>
            </el-col>
            <div style="padding-left: 140px">
              <ul id="nav-goods">
                <li v-for="(item, index) in PackageDetails" :key="index">
                  <div class="inli-goods">
                    <div
                      class="goods-edit"
                      v-if="Type != 'View'"
                      @click="goodEditBtn(item.GoodsId, index, 'Edit')"
                    >
                      <img src="/src/assets/imgs/send-edit.png" />
                    </div>
                    <div
                      class="goods-del"
                      v-if="Type != 'View'"
                      @click="goodDelBtn(index)"
                    >
                      <img src="/src/assets/imgs/send-del.png" />
                    </div>
                    <el-row>
                      <el-col :span="6">
                        <div
                          class="flex-col justify-center items-center goods-detail"
                        >
                          <img
                            :src="
                              item.ListImg
                                ? item.ListImg
                                : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/img-order2.png'
                            "
                            style="width: 70px; height: 70px"
                          />
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="goods-detail-title line_ellipsi">
                          {{ item.GoodsCode + "-" + item.GoodsTitle }}
                        </div>
                        <div class="goods-detail-rmb">¥{{ item.OrgPrice }}</div>
                        <div class="goods-detail-addorreduce">
                          <div
                            class="goode-number flex-row items-center justify-center"
                          >
                            <div
                              class="goode-number-add"
                              @click="addNumberBtn(index)"
                            >
                              +
                            </div>
                            <div class="goode-number-value">
                              {{ item.number }}
                            </div>
                            <div
                              class="goode-number-reduce"
                              @click="reduceNumberBtn(index)"
                            >
                              -
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </li>
              </ul>
            </div>
          </el-row>
          <!-- 设置商品熟悉 -->
          <attributes
            v-if="form.GoodsType == 2"
            :type="Type"
            :GoodsProperties="GoodsPropertiesSaveDesc"
            :goodID="form.GoodsId"
            @SaveProperties="SaveProperties"
          ></attributes>
        </el-col>
        <el-col :span="14">
          <el-form-item prop="GoodsDetail" label="商品描述">
            <tinymceEditor
              ref="editor"
              :value="form.GoodsDetail"
              @tinymceinput="gettinymceinput"
            ></tinymceEditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          v-if="Type != 'View'"
          class="button1"
          round
          :loading="btnLoading"
          @click="onSubmit"
        >
          <el-icon> <CirclePlus /> </el-icon
          >&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
        </el-button>
        <el-button
          v-if="
            Type != 'View' && IsRight && PageType != '' && form.GoodsStatus == 1
          "
          class="button2"
          round
          @click="DisableClick()"
          >&nbsp;&nbsp;停&nbsp;&nbsp;用&nbsp;&nbsp;
        </el-button>
        <el-button
          v-if="
            Type != 'View' && IsRight && PageType != '' && form.GoodsStatus == 0
          "
          class="button1"
          round
          @click="EnableClick()"
          >&nbsp;&nbsp;启&nbsp;&nbsp;用&nbsp;&nbsp;
        </el-button>
        <el-button class="button2" round @click="onReturn"
          >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 添加商品出框 -->
    <el-dialog
      title="添加/编辑"
      v-model="addGoodsVisible"
      width="38%"
      :show-close="false"
    >
      <el-form
        ref="formTicketRef"
        :rules="GoodsRules"
        :model="GoodsForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="添加商品">
              <el-select
                v-model="GoodsForm.GoodsTitle"
                @change="changeGoodsId($event)"
                filterable
                remote
                reserve-keyword
                placeholder="请输入商品名称/编码"
                :remote-method="remoteMethod"
                remote-show-suffix
                :loading="SelLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in goodsData"
                  :key="index"
                  :label="item.GoodsCode + '-' + item.GoodsTitle"
                  :value="item.GoodsId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="金额">
                  <el-input disabled v-model="GoodsForm.OrgPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格">
                  <el-input disabled v-model="GoodsForm.GoodsSubTitle">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="条形码">
                  <el-input disabled v-model="GoodsForm.GoodsBarcode">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品类型">
                  <el-input disabled v-model="GoodsForm.GoodsTypeDesc">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <el-form-item label="数量">
                  <el-input v-model="GoodsForm.number"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="addGoodsLoading"
            @click="SaveGoodsBtn"
            >保 存</el-button
          >
          <el-button class="button2" @click="colseGoodsBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <differenceTemplate
      :Visible="ExchangeTemplateListVisible"
      @confirm="SaveExchangeTemplate"
      @closeVisible="ExchangeTemplateListVisible = false"
    ></differenceTemplate>
  </div>
</template>

<script setup>
import differenceTemplate from "@/components/commodity/differenceTemplate.vue";
import attributes from "@/components/commodity/attributes.vue";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SaveExchangeGoods,
  GetGoods,
  GetGoodsList,
  EnableGoods,
  DisableGoods,
} from "@/api/goods.js";
import { SearchBrands } from "@/api/ticket.js";
import { HasRightes } from "@/api/index.js";
import { UploadSingle } from "@/api/imgapi.js";
import tinymceEditor from "@/components/common/tinymce.vue";
import common from "@/utils/common.js";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
const PageType = ref("");
let form = reactive({
  GoodsId: "",
  GoodsCode: "",
  GoodsType: "2",
  BrandId: "", //品牌
  GoodsTitle: "",
  GoodsSubTitle: "",
  ListImg: "",
  GoodsBarcode: "",
  GoodsConfig: "",
  GoodsDetail: "",
  OrgPrice: "",
  GoodsStatus: "",
  ImgUrl: "",
  ImgUrl1: "",
  ImgUrl2: "",
  ImgUrl3: "",
  ImgUrl4: "",
  DiffExchangeTemplateId: "", //差异模板ID
  DiffExchangeTemplateName: "",
  GoodsCategories: [],
  PackageDetails: [],
});
const rules = {
  GoodsCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
  GoodsTitle: [{ required: true, message: "请输入名称", trigger: "blur" }],
  GoodsSubTitle: [{ required: true, message: "请输入规格", trigger: "blur" }],
  ListImg: [{ required: true, message: "请选择首图", trigger: "blur" }],
  OrgPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
  GoodsBarcode: [{ required: true, message: "请输入条形码", trigger: "blur" }],
  GoodsDetail: [{ required: true, message: "请输入商品描述", trigger: "blur" }],
};
const brands = ref([]);
const SuccessImg = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  UploadSingle(fd).then((res) => {
    if (res.Code == 200) {
      form.ListImg = res.DataMap.HttpsUrl;
    }
  });
};
const beforeUpload = async (file) => {
  const isJPG = file.type == "image/jpeg" || file.type == "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 格式!");
  }
  // if (!isLt2M) {
  //   this.$message.error("上传头像图片大小不能超过 2MB!");
  // }
  return isLt2M;
};

const clear = () => {
  form.ListImg = "";
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      let Goods = JSON.parse(JSON.stringify(form));
      if (Goods.ListImg == "") {
        ElMessage.info("请先选择头图");
        return;
      }
      Goods.PackageDetails = [];
      PackageDetails.value.forEach((row) => {
        Goods.PackageDetails.push({
          GoodsId: row.GoodsId,
          GoodsQty: row.number,
        });
      });
      if (Goods.GoodsType == 3) {
        if (Goods.PackageDetails.length == 0) {
          btnLoading.value = false;
          ElMessage.info("请先添加商品");
          return;
        }
      }
      Goods.OrgPrice = Number((Goods.OrgPrice * 100).toFixed(2));
      Goods.GoodsProperties = [];

      if (GoodsPropertiesSaveDesc.value.length > 0) {
        GoodsPropertiesSaveDesc.value.forEach((row1) => {
          let Details = [];
          row1.arr.forEach((row3) => {
            Details.push({
              Id: row3.PropDetailId,
              Name: row3.PropDetailName,
              Status: 1,
            });
          });
          Goods.GoodsProperties.push({
            Id: row1.id,
            Details: Details,
            Status: 1,
          });
        });
      }
      let res = await SaveExchangeGoods({ Goods: Goods });
      btnLoading.value = false;
      if (res.Code == 200) {
        handleSaveSuccess();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
// 保存成功处理
const handleSaveSuccess = () => {
  common.ClosePageTag("商品详情");
  store.commit("tags/setPageSaerch", {
    Search: 1,
    titlePage: "商品列表",
  });
  ElMessage.success("保存成功");

  setTimeout(() => {
    router.push({ path: "/commodity" });
  }, 2000);
};
// 优化后的 GetGoodsById 函数
const GetGoodsById = async (ID) => {
  try {
    const res = await GetGoods({ ObjectId: ID });

    if (res.Code !== 200) {
      ElMessage.error("获取商品信息失败");
      return;
    }

    const { DataMap } = res;

    // 基础信息赋值
    Object.assign(form, {
      ListImg: DataMap.ListImg,
      BrandId: DataMap.BrandId === 0 ? "" : DataMap.BrandId,
      GoodsCode: DataMap.GoodsCode,
      GoodsType: DataMap.GoodsType.toString(),
      GoodsTitle: DataMap.GoodsTitle,
      GoodsSubTitle: DataMap.GoodsSubTitle,
      GoodsBarcode: DataMap.GoodsBarcode,
      GoodsConfig: DataMap.GoodsConfig,
      GoodsCategories: DataMap.GoodsCategories,
      GoodsDetail: DataMap.GoodsDetail,
      GoodsStatus: DataMap.GoodsStatus,
      DiffExchangeTemplateId: DataMap.DiffExchangeTemplateId,
      DiffExchangeTemplateName: DataMap.DiffExchangeTemplateName,
      OrgPrice: (DataMap.OrgPrice / 100).toFixed(2),
      PackageDetails: DataMap.PackageDetails,
    });

    // 处理组合商品详情
    if (DataMap.PackageDetails) {
      PackageDetails.value = DataMap.PackageDetails.map((item) => ({
        GoodsId: item.GoodsId,
        GoodsCode: item.Goods.GoodsCode,
        GoodsTitle: item.Goods.GoodsTitle,
        OrgPrice: (item.Goods.OrgPrice / 100).toFixed(2),
        GoodsSubTitle: item.Goods.GoodsSubTitle,
        GoodsTypeDesc: item.Goods.GoodsTypeDesc,
        GoodsBarcode: item.Goods.GoodsBarcode,
        ListImg: item.Goods.ListImg,
        number: item.GoodsQty,
      }));
    }

    // 处理商品属性
    if (DataMap.GoodsProperties) {
      GoodsPropertiesSaveDesc.value = processGoodsProperties(
        DataMap.GoodsProperties
      );
    }

    // 权限控制
    handlePermissionControl(DataMap.CreateUnitId);
  } catch (error) {
    console.error("获取商品详情失败:", error);
    ElMessage.error("获取商品详情失败");
  }
};

// 将商品属性数据处理逻辑提取为独立函数
const processGoodsProperties = (properties) => {
  const result = [];

  properties.forEach((row) => {
    let desc = "";
    const leftDelList = [];

    const processedDetails = row.Details.map((detail) => {
      desc += detail.Name + ",";
      return {
        PropDetailId: detail.Id,
        PropId: row.Id,
        PropDetailName: detail.Name,
        right: 1,
        SkuCount: detail.SkuCount || 0,
      };
    });

    result.push({
      id: row.Id,
      desc: `${row.Name}：${desc.slice(0, -1)}`, // 移除最后的逗号
      arr: processedDetails,
      leftDelList,
      SkuCount: row.SkuCount || 0,
    });
  });

  return result;
};

// 权限控制逻辑提取
const handlePermissionControl = (createUnitId) => {
  if (PageType.value && loginUser.UnitId === createUnitId && IsRight.value) {
    Type.value = "Edit";
  } else if (PageType.value) {
    Type.value = "View";
  }
};
const onReturn = async (val) => {
  common.ClosePageTag("商品详情");
  router.back();
};
const gettinymceinput = async (val) => {
  form.GoodsDetail = val;
};
const changeGoodsType = async (val) => {};

const addGoodsVisible = ref(false);
const isEditGoods = ref("");
const chooseIdx = ref(0); //选中的修改组合商品

const goodsData = ref([]);
const PackageDetails = ref([]);

const addGoodsLoading = ref(false);

const GoodsRules = {
  TicketTemplateId: [
    { required: true, message: "请选择卡券", trigger: "blur" },
  ],
  TicketCount: [{ required: true, message: "请输入发券数量", trigger: "blur" }],
};
let GoodsForm = reactive({
  GoodsId: "",
  GoodsCode: "",
  GoodsTitle: "",
  GoodsSubTitle: "",
  GoodsBarcode: "",
  OrgPrice: "",
  GoodsTypeDesc: "",
  ListImg: "",
  number: 1,
});

const changeGoodsId = async (ID) => {
  goodsData.value.forEach((row) => {
    if (ID == row.GoodsId) {
      GoodsForm.GoodsId = row.GoodsId;
      GoodsForm.GoodsCode = row.GoodsCode;
      GoodsForm.GoodsTitle = row.GoodsTitle;
      GoodsForm.OrgPrice = Number(row.OrgPrice / 100).toFixed(2);
      GoodsForm.GoodsSubTitle = row.GoodsSubTitle;
      GoodsForm.GoodsTypeDesc = row.GoodsTypeDesc;
      GoodsForm.GoodsBarcode = row.GoodsBarcode;
      GoodsForm.ListImg = row.ListImg;
      GoodsForm.number = 1;
    }
  });
};
const SaveGoodsBtn = async () => {
  addGoodsLoading.value = true;
  if (isEditGoods.value == "Edit") {
    PackageDetails.value.forEach((row, index) => {
      if (chooseIdx.value == index) {
        row.GoodsId = GoodsForm.GoodsId;
        row.GoodsCode = GoodsForm.GoodsCode;
        row.GoodsTitle = GoodsForm.GoodsTitle;
        row.OrgPrice = GoodsForm.OrgPrice;
        row.GoodsSubTitle = GoodsForm.GoodsSubTitle;
        row.GoodsTypeDesc = GoodsForm.GoodsTypeDesc;
        row.GoodsBarcode = GoodsForm.GoodsBarcode;
        row.ListImg = GoodsForm.ListImg;
        row.number = GoodsForm.number ? GoodsForm.number : 1;
      }
    });
  } else {
    PackageDetails.value.push(JSON.parse(JSON.stringify(GoodsForm)));
  }

  addGoodsLoading.value = false;
  addGoodsVisible.value = false;
};
const colseGoodsBtn = async () => {
  addGoodsVisible.value = false;
};

const SelLoading = ref(false);
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await GetGoodsList({
      SearchCondition: {
        search_keyword: SearchQuery,
        goods_status: 1,
        goods_type: 2,
        is_sell: 0,
      },
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      goodsData.value = res.DataMap;
    }
  } else {
    goodsData.value = [];
  }
};
const addGoodBtn = async () => {
  addGoodsVisible.value = true;
  isEditGoods.value = "";
  GoodsForm.GoodsId = "";
  GoodsForm.GoodsCode = "";
  GoodsForm.GoodsTitle = "";
  GoodsForm.GoodsSubTitle = "";
  GoodsForm.GoodsBarcode = "";
  GoodsForm.OrgPrice = "";
  GoodsForm.GoodsTypeDesc = "";
  GoodsForm.number = 1;
};
const goodDelBtn = async (idx) => {
  PackageDetails.value.forEach((row, index) => {
    if (idx == index) {
      PackageDetails.value.splice(index, 1);
    }
  });
};
const goodEditBtn = async (ID, idx, type) => {
  isEditGoods.value = type;
  chooseIdx.value = idx;
  if (type == "Edit") {
    PackageDetails.value.forEach((row) => {
      if (row.GoodsId == ID) {
        GoodsForm.GoodsId = row.GoodsId;
        GoodsForm.GoodsCode = row.GoodsCode;
        GoodsForm.GoodsTitle = row.GoodsTitle;
        GoodsForm.OrgPrice = row.OrgPrice;
        GoodsForm.GoodsSubTitle = row.GoodsSubTitle;
        GoodsForm.GoodsTypeDesc = row.GoodsTypeDesc;
        GoodsForm.GoodsBarcode = row.GoodsBarcode;
        GoodsForm.ListImg = row.ListImg;
        GoodsForm.number = row.number ? row.number : 1;
      }
    });
  } else {
    changeGoodsId(ID);
  }
  addGoodsVisible.value = true;
};
//增加数量
const addNumberBtn = async (dataIndex) => {
  if (Type.value == "View") {
    ElMessage.info("当前状态不允许添加数量");
    return;
  }
  PackageDetails.value.forEach((row, index) => {
    if (index == dataIndex) {
      if (row.GoodsId) {
        row.number++;
      }
    }
  });
};
//减少数量
const reduceNumberBtn = async (dataIndex) => {
  if (Type.value == "View") {
    ElMessage.info("当前状态不允许添加数量");
    return;
  }
  PackageDetails.value.forEach((row, index) => {
    if (index == dataIndex) {
      if (row.GoodsId) {
        row.number--;
        if (Number(row.number) == 0) {
          row.number = 1;
        }
      }
    }
  });
};

//属性

const GoodsPropertiesSaveDesc = ref([]);

//保存子组件传过来的属性值
const SaveProperties = async (val) => {
  if (val.length > 0) {
    GoodsPropertiesSaveDesc.value = val;
  } else {
    GoodsPropertiesSaveDesc.value = [];
  }
  //计算SKU数量
  GoodsPropertiesSaveDesc.value.forEach((row) => {
    row.SkuCount = 1;
    row.arr.forEach((row1) => {
      row.SkuCount *= row1.SkuCount;
    });
  });
};

////////////////////////////////////////////////////////////////////////////////

const ExchangeTemplateListVisible = ref(false);

//添加
const AddExchangeTemplateListBtn = async () => {
  ExchangeTemplateListVisible.value = true;
};
//确认添加
const SaveExchangeTemplate = (TemplateObject) => {
  let templates = TemplateObject.templates;
  for (let i = 0; i < templates.length; i++) {
    const row = templates[i];
    if (row.Select) {
      form.DiffExchangeTemplateId = row.TemplateId; //差异模板ID
      form.DiffExchangeTemplateName = row.TemplateName;
      break;
    }
  }
  ExchangeTemplateListVisible.value = false;
};
////////////////////////////////////////////////////////////////////////////////
//权限判断
const IsRight = ref("");
const BoolRight = async () => {
  let arr = ["edit_goods"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goods;
  }
};
BoolRight();
//停用
const DisableClick = () => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableGoods({
      ObjectId: form.GoodsId,
    });
    if (res.Code == 200) {
      GetGoodsById(form.GoodsId);
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//启用
const EnableClick = () => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableGoods({
      ObjectId: form.GoodsId,
    });
    if (res.Code == 200) {
      GetGoodsById(form.GoodsId);
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
////////////////////////////////////////////////////////////////////////////////
const GetBrands = async () => {
  // 获品牌
  let res = await SearchBrands({
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
  });
  if (res.Code == 200) {
    brands.value = res.DataMap.Data;
  }
};
////////////////////////////////////////////////////////////////////////////////
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    form.GoodsId = router.currentRoute.value.query.ID;
    Type.value = router.currentRoute.value.query.Type;
  }
  if (router.currentRoute.value.query.PageType) {
    PageType.value = router.currentRoute.value.query.PageType;
  }
  if (form.GoodsId) {
    GetGoodsById(form.GoodsId);
  }
  GetBrands();
};
Init();
</script>

<style scoped>
::v-deep(.dataTable-current .el-dialog__body) {
  padding-top: 10px !important;
}
#nav-goods {
  list-style-type: none;
  margin-top: 10px;
}

.inli-goods {
  border-bottom: solid 8px #f56c6c;
  position: relative;
  margin: 10px 10px 20px 0;
  border-radius: 4px;
  border-bottom-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 442px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.07);
  height: 110px;
}

.goods-edit {
  position: absolute;
  right: 72px;
  z-index: 9;
  top: 32px;
}

.goods-edit img {
  width: 35px;
  height: 35px;
}

.goods-del {
  position: absolute;
  right: 22px;
  z-index: 9;
  top: 32px;
}

.goods-del img {
  width: 35px;
  height: 35px;
}

.goods-detail {
  height: 110px;
}

.goods-detail-title {
  position: absolute;
  top: 20px;
  color: #252525;
}

.goods-detail-time {
  position: absolute;
  top: 42px;
  font-size: 12px;
  color: #757575;
}

.goods-detail-rmb {
  position: absolute;
  top: 66px;
  color: #f56c6c;
}

.goods-detail-addorreduce {
  position: absolute;
  top: 58px;
  margin-left: 80px;
}

.goods-detail-no {
  position: absolute;
  top: 87px;
  color: #f56c6c;
  font-size: 14px;
}

.goods-detail-count {
  position: absolute;
  right: 14px;
  top: 80px;
  color: #313131;
}

.goods-type {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f56c6c;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 12px;
  color: #fff;
  line-height: 22px;
  width: 60px;
  text-align: center;
  height: 22px;
  letter-spacing: 1px;
}

.goode-number {
  border: solid 1px #f56c6c;
  border-radius: 20px;
  width: 90px;
  height: 27px;
  font-size: 16px;
  text-align: center;
}

.goode-number .goode-number-add {
  width: 40px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #f56c6c;
  cursor: pointer;
}

.goode-number .goode-number-value {
  width: 38px;
  height: 28px;
  line-height: 28px;
  background-color: #f56c6c;
  font-size: 14px;
  color: #fff;
}

.goode-number .goode-number-reduce {
  width: 40px;
  height: 30px;
  line-height: 28px;
  font-size: 22px;
  color: #6d6d6d;
  cursor: pointer;
}
</style>

<style>
.commodity-uploader {
  width: 320px;
  height: 150px;
}

.commodity-uploader .el-upload {
  width: 320px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.commodity-uploader-avatar {
  width: 100%;
}

.commodity-home-uploader {
  width: 150px;
  height: 150px;
}

.commodity-home-uploader .el-upload {
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}

.commodity-home-uploader-avatar {
  width: 100%;
}

.icon_top {
  position: relative;
  top: 5px;
  left: 10px;
}
</style>
