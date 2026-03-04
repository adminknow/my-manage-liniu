<template>
    <div class="container">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-row style="margin-top: 20px; padding-bottom: 100px">
          <el-col :span="10">
            <el-row>
              <el-col :span="23">
                <el-form-item label="类型">
                  <el-select  @change="changeGoodsType" v-model="form.GoodsType" style="width: 100%" placeholder="商品类型">
                    <el-option label="普通商品" value="2"></el-option>
                    <el-option label="组合装商品" value="3"></el-option>
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
                      <el-upload class="commodity-home-uploader" ref="upload" :show-file-list="false" action="#"
                        :http-request="SuccessImg" :before-upload="beforeUpload" :auto-upload="true">
                        <img v-if="form.ListImg" :src="form.ListImg" class="commodity-home-uploader-avatar" />
                        <i v-else class="el-icon-mpzengjia"></i>
                      </el-upload>
                      <p class="text">首图，100*100 且不超过500k
                        <span style="cursor: pointer;color: #ff6666 ;" class="el-icon-delete" v-if="form.ListImg"
                          @click="clear">删除</span>
                      </p>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="编码" prop="GoodsCode">
                  <el-input v-model="form.GoodsCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="名称" prop="GoodsTitle">
                  <el-input v-model="form.GoodsTitle"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="规格" prop="GoodsSubTitle">
                  <el-input v-model="form.GoodsSubTitle"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="价格" prop="OrgPrice">
                  <el-input v-model="form.OrgPrice">
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="条形码" prop="GoodsBarcode">
                  <el-input v-model="form.GoodsBarcode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button v-if="Type != 'View'" class="button1" round :loading="btnLoading" @click="onSubmit">
            <el-icon>
              <CirclePlus />
            </el-icon>&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
          </el-button>
          <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
        </el-form-item>
      </el-form>
      <!-- 添加商品出框 -->
      <el-dialog title="添加/编辑" v-model="addGoodsVisible" width="38%" :show-close="false">
          <el-form ref="formTicketRef" :rules="GoodsRules" :model="GoodsForm" label-width="120px">
              <el-row>
                  <el-col :span="22">
                      <el-form-item label="添加商品" >
                          <!-- <el-select v-model="GoodsForm.GoodsId" clearable style="width: 100%" filterable
                              placeholder="请选择商品" @change="changeGoodsId($event)">
                              <el-option v-for="(item, index) in goodsData" :key="index"
                                  :label="item.GoodsCode+'-'+item.GoodsTitle" :value="item.GoodsId" />
                          </el-select> -->
                        <el-select v-model="GoodsForm.GoodsTitle" @change="changeGoodsId($event)" filterable remote reserve-keyword placeholder="请输入商品名称"
                        :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading" style="width: 100%" clearable>
                          <el-option v-for="(item, index) in goodsData" :key="index" :label="item.GoodsCode+'-'+item.GoodsTitle" :value="item.GoodsId">
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
                            <el-form-item label="条码">
                                <el-input disabled v-model="GoodsForm.GoodsBarcode">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型">
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
                                <el-input v-model="GoodsForm.number">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                  </el-col>
              </el-row>
          </el-form>
          <template #footer>
              <span class="dialog-footer">
                  <el-button class="button1" :loading="addGoodsLoading" @click="SaveGoodsBtn">保 存</el-button>
                  <el-button class="button2" @click="colseGoodsBtn">关 闭</el-button>
              </span>
          </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from "vue";
  import { useStore } from "vuex";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { useRouter } from "vue-router";
  import { SaveExchangeGoods,GetGoods,GetGoodsList} from "@/api/goods.js";
  import { UploadSingle } from "@/api/imgapi.js";
  import common from "@/utils/common.js";
  const router = useRouter();
  const store = useStore();
  const formRef = ref(null);
  const btnLoading = ref(false);
  const Type = ref("");
  let form = reactive({
    GoodsId: "",
    GoodsCode: "",
    GoodsType:"2",
    GoodsTitle: "",
    GoodsSubTitle: "",
    ListImg: "",
    GoodsBarcode: "",
    GoodsConfig: "",
    GoodsDetail: "",
    OrgPrice: "",
    ImgUrl: "",
    ImgUrl1: "",
    ImgUrl2: "",
    ImgUrl3: "",
    ImgUrl4: "",
    GoodsCategories: [],
    PackageDetails:[],
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
  const SuccessImg = async (param) => {
    let fd = new FormData();
    fd.append("file", param.file); //传文件
    UploadSingle(fd).then((res) => {
      if (res.Code == 200) {
        form.ListImg = res.DataMap.HttpsUrl;
      }
    });
  };
  const SuccessImg1 = async (param) => {
    let fd = new FormData();
    fd.append("file", param.file); //传文件
    UploadSingle(fd).then((res) => {
      if (res.Code == 200) {
        form.ImgUrl1 = res.DataMap.HttpsUrl;
      }
    });
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
        Goods.PackageDetails=[]
        PackageDetails.value.forEach(row=>{
          Goods.PackageDetails.push({
            GoodsId:row.GoodsId,
            GoodsQty:row.number
          })
        })
        if(Goods.GoodsType==3){
          if(Goods.PackageDetails.length==0){
            btnLoading.value = false;
            ElMessage.info("请先添加商品");
            return
          }
        }
        Goods.OrgPrice = Number((Goods.OrgPrice * 100).toFixed(2));
        let res = await SaveExchangeGoods({ Goods: Goods });
        btnLoading.value = false;
        if (res.Code == 200) {
          common.ClosePageTag("属性详情");
          store.commit("tags/setPageSaerch", {
            Search:1,
            titlePage:"商品属性"
          });
          ElMessage.success("保存成功");
          setTimeout(function () {
            router.push({
              path: "/attributes"
            });
          }, 2000);
        } else {
          ElMessage.error(res.Message);
        }
      } else {
        return false;
      }
    });
  };
  const GetGoodsById = async (ID) => {
    let res = await GetGoods({
      ObjectId: ID
    })
    if (res.Code === 200) {
      form.ListImg = res.DataMap.ListImg;
      form.GoodsCode = res.DataMap.GoodsCode;
      form.GoodsType = res.DataMap.GoodsType.toString();
      form.GoodsTitle = res.DataMap.GoodsTitle;
      form.GoodsSubTitle = res.DataMap.GoodsSubTitle;
      form.GoodsBarcode = res.DataMap.GoodsBarcode;
      form.GoodsConfig = res.DataMap.GoodsConfig;
      form.GoodsCategories = res.DataMap.GoodsCategories;
      form.GoodsDetail = res.DataMap.GoodsDetail;
      form.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
      form.PackageDetails=res.DataMap.PackageDetails;
      res.DataMap.PackageDetails.forEach(row => {
        PackageDetails.value.push({
          GoodsId: row.GoodsId,
          GoodsCode: row.Goods.GoodsCode,
          GoodsTitle: row.Goods.GoodsTitle,
          OrgPrice: (row.Goods.OrgPrice / 100).toFixed(2),
          GoodsSubTitle: row.Goods.GoodsSubTitle,
          GoodsTypeDesc: row.Goods.GoodsTypeDesc,
          GoodsBarcode: row.Goods.GoodsBarcode,
          ListImg: row.Goods.ListImg,
          number: row.GoodsQty,
        })
      })
    }
  };
  const onReturn = async (val) => {
    common.ClosePageTag("属性详情")
    router.back();
  };
  const gettinymceinput = async (val) => {
    form.GoodsDetail = val
  };
  const changeGoodsType = async (val) => {
  
  };
  
  const addGoodsVisible = ref(false);
  const isEditGoods = ref("");
  const chooseIdx = ref(0);//选中的修改组合商品
  
  
  const goodsData = ref([]);
  const PackageDetails = ref([]);
  
  
  const addGoodsLoading = ref(false);
  
  const GoodsRules = {
      TicketTemplateId: [{ required: true, message: "请选择卡券", trigger: "blur" }],
      TicketCount: [{ required: true, message: "请输入发券数量", trigger: "blur" }],
  };
  let GoodsForm = reactive({
    GoodsId:"",
    GoodsCode:"",
    GoodsTitle:"",
    GoodsSubTitle:"",
    GoodsBarcode:"",
    OrgPrice:"",
    GoodsTypeDesc:"",
    ListImg:"",
    number:1
  });
  
  const changeGoodsId = async (ID) => {
    goodsData.value.forEach(row=>{
      if(ID==row.GoodsId){
        GoodsForm.GoodsId=row.GoodsId;
        GoodsForm.GoodsCode=row.GoodsCode;
        GoodsForm.GoodsTitle=row.GoodsTitle;
        GoodsForm.OrgPrice=Number((row.OrgPrice / 100)).toFixed(2);
        GoodsForm.GoodsSubTitle=row.GoodsSubTitle;
        GoodsForm.GoodsTypeDesc=row.GoodsTypeDesc;
        GoodsForm.GoodsBarcode=row.GoodsBarcode;
        GoodsForm.ListImg=row.ListImg;
        GoodsForm.number=1;
      }
    })
  }
  const SaveGoodsBtn = async () => {
    addGoodsLoading.value = true;
    if(isEditGoods.value=="Edit"){
      PackageDetails.value.forEach((row,index)=>{
        if (row.GoodsId != GoodsForm.GoodsId&&(chooseIdx.value==index)) {
          row.GoodsId = GoodsForm.GoodsId;
          row.GoodsCode = GoodsForm.GoodsCode;
          row.GoodsTitle = GoodsForm.GoodsTitle;
          row.OrgPrice = GoodsForm.OrgPrice;
          row.GoodsSubTitle = GoodsForm.GoodsSubTitle;
          row.GoodsTypeDesc = GoodsForm.GoodsTypeDesc;
          row.GoodsBarcode = GoodsForm.GoodsBarcode;
          row.ListImg = GoodsForm.ListImg;
          row.number = GoodsForm.number?GoodsForm.number:1;
        }
      })
    }else{
      PackageDetails.value.push(JSON.parse(JSON.stringify(GoodsForm)));
    }
  
    addGoodsLoading.value = false;
    addGoodsVisible.value = false;
  }
  const colseGoodsBtn = async () => {
    addGoodsVisible.value=false;
  }
  
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
          goods_title: SearchQuery,
          goods_status: 1,
          goods_type: 2
        },
      });
      SelLoading.value = false;
      if (res.Code == 200) {
        goodsData.value = res.DataMap;
      }
    } else {
      goodsData.value = []
    }
  };
  const addGoodBtn = async () => {
    addGoodsVisible.value=true;
    isEditGoods.value="";
    GoodsForm.GoodsId="";
    GoodsForm.GoodsCode="";
    GoodsForm.GoodsTitle="";
    GoodsForm.GoodsSubTitle="";
    GoodsForm.GoodsBarcode="";
    GoodsForm.OrgPrice="";
    GoodsForm.GoodsTypeDesc="";
    GoodsForm.number=1;
    
  }
  const goodDelBtn = async (idx) => {
    PackageDetails.value.forEach((row, index) => {
      if (idx == index) {
        PackageDetails.value.splice(index, 1)
      }
    })
  };
  const goodEditBtn = async (ID, idx, type) => {
    isEditGoods.value = type;
    chooseIdx.value = idx;
    if(type=="Edit"){
      PackageDetails.value.forEach(row=>{
        if(row.GoodsId==ID){
          GoodsForm.GoodsId = row.GoodsId;
          GoodsForm.GoodsCode = row.GoodsCode;
          GoodsForm.GoodsTitle = row.GoodsTitle;
          GoodsForm.OrgPrice = row.OrgPrice;
          GoodsForm.GoodsSubTitle = row.GoodsSubTitle;
          GoodsForm.GoodsTypeDesc = row.GoodsTypeDesc;
          GoodsForm.GoodsBarcode = row.GoodsBarcode;
          GoodsForm.ListImg = row.ListImg;
          GoodsForm.number = row.number?row.number:1;
        }
      })
    }else{
      changeGoodsId(ID);
    }
    addGoodsVisible.value = true;
  };
  //增加数量
  const addNumberBtn = async (dataIndex) => {
    if(Type.value=='View'){
      ElMessage.info("当前状态不允许添加数量");
      return;
    }
    PackageDetails.value.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.GoodsId) {
          row.number++
        }
      }
    })
  };
  //减少数量
  const reduceNumberBtn = async (dataIndex) => {
    if(Type.value=='View'){
      ElMessage.info("当前状态不允许添加数量");
      return;
    }
    PackageDetails.value.forEach((row, index) => {
      if (index == dataIndex) {
        if (row.GoodsId) {
          row.number--
          if (Number(row.number) == 0) {
            row.number = 1;
          }
        }
      }
    })
  };
  //根据ID获取详情
  const Init = async () => {
    if (router.currentRoute.value.query.ID) {
    form.GoodsId = router.currentRoute.value.query.ID;
    Type.value = router.currentRoute.value.query.Type;
    GetGoodsById(form.GoodsId)
  }
  };
  Init()
  </script>
  
  <style scoped>
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
    box-shadow:
      1px 1px 10px rgba(0, 0, 0, 0.07);
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
  .goods-detail-addorreduce{
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
  </style>
  