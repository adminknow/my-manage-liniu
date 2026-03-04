<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="140px">
      <el-row style="margin-top: 20px; padding-bottom: 100px">
        <el-col :span="12">
          <el-row>
            <el-col :span="23">
              <el-form-item label="商品类型">
                <el-select :disabled="Type == 'View' || form.GoodsId != ''" v-model="form.GoodsType" style="width: 100%"
                  placeholder="商品类型">
                  <el-option v-if="loginUser.UnitName != '礼牛严选'" label="电子券" value="1"></el-option>
                  <el-option label="普通商品" value="2"></el-option>
                  <el-option v-if="loginUser.UnitName == '礼牛严选'" label="虚拟商品" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="品牌">
                <el-select :disabled="Type == 'View'" v-model="form.BrandId" clearable filterable placeholder="请选择品牌"
                  style="width: 100%">
                  <el-option v-for="item in brands" :key="item.BrandName" :label="item.BrandName"
                    :value="item.BrandId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="classificationShow">
            <el-col :span="23">
              <el-form-item label="商品分类" style="position: relative">
                <el-tree-select v-model="GoodsCategoriesValue" :data="GoodsCategoriesList" multiple show-checkbox
                  :render-after-expand="false" style="width: 100%" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="loginUser.UnitName != '礼牛严选'">
            <el-col :span="23">
              <el-form-item label="编码" prop="GoodsCode">
                <el-input :disabled="Type == 'View' || form.GoodsSrc == 1" v-model="form.GoodsCode" maxlength="10"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="23">
              <el-form-item label="编码" prop="GoodsCode">
                <el-input :disabled="Type == 'View' || form.GoodsSrc == 1" v-model="form.GoodsCode" show-word-limit>
                  <template #append>
                    <div @click="yzhFindCode" style="cursor: pointer">
                      从云中鹤查询
                    </div>
                  </template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="名称" prop="GoodsTitle">
                <el-input :disabled="Type == 'View'" v-model="form.GoodsTitle" maxlength="40"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="卖点">
                <el-input :disabled="Type == 'View'" v-model="form.GoodsSubTitle" maxlength="50"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.GoodsType != 1">
            <el-col :span="23">
              <el-form-item label="配送模板">
                <el-select :disabled="Type == 'View' || form.GoodsSrc == 1" v-model="form.ExpressTemplateId"
                  style="width: 100%" placeholder="请选择配送模板">
                  <el-option v-for="item in ExpressTemplateList" :key="item.TemplateId" :label="item.TemplateName"
                    :value="item.TemplateId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.GoodsType == 1">
            <el-col :span="23">
              <el-form-item label="售卖的券" prop="TicketTemplateTitle">
                <el-select v-model="form.TicketTemplateTitle" filterable remote :disabled="Type == 'View'"
                  reserve-keyword placeholder="请输入券名称" @change="ChangeTicketTemplateId($event)"
                  :remote-method="remoteMethod" remote-show-suffix :loading="SelLoading" style="width: 100%" clearable>
                  <el-option v-for="(item, index) in TicketTemplateList" :key="index" :label="item.TicketTemplateCode + '-' + item.TicketTemplateTitle
                    " :value="item.TicketTemplateId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.GoodsSrc == 1">
            <el-col :span="12">
              <el-form-item label="未税价">
                <el-input @input="handleInput" :disabled="Type == 'View'" v-model="form.JtglobleUntaxPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="税率" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.JtglobleTaxRate">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="原价" prop="OrgPrice">
                <el-input :disabled="Type == 'View'" v-model="form.OrgPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="售价" prop="SellPrice" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.SellPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="采购价">
                <el-input :disabled="Type == 'View'" v-model="form.PurchasePrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="平台进货价" label-width="120px">
                <el-input :disabled="Type == 'View' || form.GoodsSrc == 1" v-model="form.BuyPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="批发价满">
                <el-input :disabled="Type == 'View'" v-model="form.WholesaleBeginQty">
                  <template #append>个</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="批发单价" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.WholesalePrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="排序">
                <el-input type="number" :disabled="Type == 'View'" v-model="form.Index.CompositeIndex">
                </el-input>
                <span style="
                    position: relative;
                    height: 10px;
                    color: rgb(255, 102, 102);
                    font-size: 12px;
                  ">数值越大，排序越靠前</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最长供货天数" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.MaxSupplyDays">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="长">
                <el-input :disabled="Type == 'View'" v-model="form.Length">
                  <template #append>厘米</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="宽" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.Width">
                  <template #append>厘米</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="高">
                <el-input :disabled="Type == 'View'" v-model="form.Height">
                  <template #append>厘米</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="重量" label-width="120px">
                <el-input :disabled="Type == 'View'" v-model="form.Weight">
                  <template #append>&nbsp;&nbsp;克&nbsp;&nbsp;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="loginUser.UnitName == '礼牛严选'">
            <el-col :span="12">
              <el-form-item label="上架数量" prop="TotalQty">
                <el-input v-model="form.TotalQty" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="12">
              <el-form-item v-if="form.GoodsId == ''" label="上架数量" prop="TotalQty">
                <el-input v-model="form.TotalQty"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="首图" prop="ListImg">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="form.ListImg" v-if="false"></el-input>
                    <el-upload class="commodity-home-uploader" ref="upload" :show-file-list="false" action="#"
                      :http-request="SuccessImg" :auto-upload="true">
                      <img v-if="form.ListImg" :src="form.ListImg" class="commodity-home-uploader-avatar" />
                      <i v-else class="el-icon-mpzengjia"></i>
                    </el-upload>
                    <p class="text">
                      首图,300*300 且不超过1M,推荐传正方形
                      <span style="cursor: pointer; color: #ff6666" class="el-icon-delete"
                        v-if="form.ListImg && Type != 'View'" @click="clear">删除</span>
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="轮播图片">
                <draggable v-model="fileImgList" @start="onStart1" @end="onEnd1">
                  <transition-group>
                    <div v-for="(item, index) in fileImgList" :key="index" :index="index" style="
                        float: left;
                        margin-right: 20px;
                        position: relative;
                        height: 120px;
                        margin-bottom: 10px;
                      ">
                      <div style="
                          position: absolute;
                          right: 4px;
                          top: 2px;
                          z-index: 9;
                        " @click="DelBannerClick(index)">
                        <el-icon color="#f56c6c" size="25px">
                          <CircleClose />
                        </el-icon>
                      </div>
                      <img v-if="item" :src="item" style="height: 120px; margin-bottom: 10px"
                        @click="PreviewBannerClick(index)" />
                    </div>
                  </transition-group>
                </draggable>
                <el-upload v-if="Type != 'View' && fileImgList.length < 5" class="bannerImg-uploader1" ref="upload"
                  :show-file-list="false" action="#" :http-request="SuccessImgBanner" :auto-upload="true" multiple>
                  <i class="el-icon-mpzengjia"></i>
                  <template #tip>
                    <div class="el-upload__tip" style="width: 200px">
                      <p class="text">建议尺寸 400*300，且不超过500K</p>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label=""> </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px" v-if="form.GoodsType == 3">
            <el-col :span="23">
              <el-form-item label="组合商品">
                <el-button v-if="Type != 'View'" class="button1" round @click="addGoodBtn">
                  &nbsp;&nbsp;添加商品&nbsp;&nbsp;
                </el-button>
              </el-form-item>
            </el-col>
            <div style="padding-left: 140px">
              <ul id="nav-goods">
                <li v-for="(item, index) in PackageDetails" :key="index">
                  <div class="inli-goods">
                    <div class="goods-edit" v-if="Type != 'View'" @click="goodEditBtn(item.GoodsId, index, 'Edit')">
                      <img src="/src/assets/imgs/send-edit.png" />
                    </div>
                    <div class="goods-del" v-if="Type != 'View'" @click="goodDelBtn(index)">
                      <img src="/src/assets/imgs/send-del.png" />
                    </div>
                    <el-row>
                      <el-col :span="6">
                        <div class="flex-col justify-center items-center goods-detail">
                          <img :src="item.ListImg
                              ? item.ListImg
                              : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/img-order2.png'
                            " style="width: 70px; height: 70px" />
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="goods-detail-title line_ellipsi">
                          {{ item.GoodsCode + "-" + item.GoodsTitle }}
                        </div>
                        <div class="goods-detail-rmb">¥{{ item.OrgPrice }}</div>
                        <div class="goods-detail-addorreduce">
                          <div class="goode-number flex-row items-center justify-center">
                            <div class="goode-number-add" @click="addNumberBtn(index)">
                              +
                            </div>
                            <div class="goode-number-value">
                              {{ item.number }}
                            </div>
                            <div class="goode-number-reduce" @click="reduceNumberBtn(index)">
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
          <el-row v-if="form.GoodsType == 2 && form.GoodsSrc == 0">
            <el-col :span="23">
              <el-form-item label="规格属性">
                <el-button v-if="Type != 'View'" class="button1" round @click="addPropertiesBtn">
                  &nbsp;&nbsp;添加&nbsp;&nbsp;
                </el-button>
              </el-form-item>
              <div style="padding-left: 140px" v-if="GoodsPropertiesSaveDesc.length > 0">
                <div v-for="(item, index) in GoodsPropertiesSaveDesc" :key="index">
                  <el-row>
                    <el-col :span="18">
                      <div style="color: #606266; padding-bottom: 10px">
                        {{ item.desc }}
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <el-button class="button-op-edit" v-if="Type != 'View'" size="small"
                        @click="PropertiesEditBtn(index, item.id)">编辑
                      </el-button>
                    </el-col>
                    <el-col :span="3">
                      <el-button class="button-op-del" v-if="Type != 'View'" size="small"
                        @click="PropertiesDelBtn(index, item.id)">删除
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
          <div v-if="form.GoodsSrc == 1" style="color: #606266">
            <el-row style="margin-top: 20px; padding-bottom: 10px; color: #000">
              <el-col class="send-local flex-row items-center" :span="20">保税商品</el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <p>
                  分类：{{ form.properties.jtgloble_skuClassify1Name
                  }}<span v-if="form.properties.jtgloble_skuClassify2Name">
                    / {{ form.properties.jtgloble_skuClassify2Name }}</span><span
                    v-if="form.properties.jtgloble_skuClassify3Name">
                    / {{ form.properties.jtgloble_skuClassify3Name }}</span>
                </p>
              </el-col>
              <el-col :span="11">
                <p>
                  未税含邮供货价：{{ form.properties.jtgloble_untaxedPrice }}
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <p>含税含邮供货价：{{ form.properties.jtgloble_price }}</p>
              </el-col>
              <el-col :span="11">
                <p>税率：{{ form.properties.jtgloble_skuRate }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <p>单品容量：{{ form.properties.jtgloble_capacity }}</p>
              </el-col>
              <el-col :span="11">
                <p>规格：{{ form.properties.jtgloble_spec }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <p>规格内商品数量：{{ form.properties.jtgloble_specQty }}</p>
              </el-col>
              <el-col :span="11">
                <p>原产国：{{ form.properties.jtgloble_originCountry }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="1">
                <p>发货地：{{ form.properties.jtgloble_shippingAddress }}</p>
              </el-col>
              <el-col :span="11">
                <p>有效期：{{ form.properties.jtgloble_validityPeriod }}</p>
              </el-col>
            </el-row>
            <el-row v-if="form.properties.jtgloble_skuType">
              <el-col :span="12" :offset="1">
                <p>SKU类型：{{ form.properties.jtgloble_skuType }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23" :offset="1">
                <p>
                  容量单价=未税价格÷(单品容量×规格内商品数量)
                  {{
                    form.JtglobleUntaxPrice +
                    "÷(" +
                    form.properties.jtgloble_capacity +
                    "×" +
                    form.properties.jtgloble_specQty +
                    ")=" +
                    (
                      form.JtglobleUntaxPrice /
                      (form.properties.jtgloble_capacity *
                        form.properties.jtgloble_specQty)
                    ).toFixed(2)
                  }}
                </p>
              </el-col>
            </el-row>
            <el-row v-if="form.SpecTaxRates.length > 0">
              <el-col :span="8" :offset="1">
                <div v-if="form.SpecTaxRates.length > 0">
                  <el-table :data="form.SpecTaxRates" border class="table"
                    :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                    <el-table-column prop="CompareType" label="容量单价(元)" align="center">
                      <template #default="scope">
                        {{ scope.row.CompareType + scope.row.CapacityPrice }}
                      </template></el-table-column>
                    <el-table-column prop="TaxRate" label="税率" align="center"></el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品描述">
            <draggable v-model="fileDetailImgList" @start="onStart" @end="onEnd">
              <transition-group>
                <div v-for="(item, index) in fileDetailImgList" :key="index" :index="index" style="
                    float: left;
                    margin-right: 20px;
                    position: relative;
                    height: 200px;
                    margin-bottom: 10px;
                    width: 180px;
                    text-align: center;
                  ">
                  <div style="position: absolute; right: 4px; top: 2px; z-index: 9" @click="DelDetailClick(index)">
                    <el-icon color="#f56c6c" size="25px">
                      <CircleClose />
                    </el-icon>
                  </div>
                  <img v-if="item.HttpsUrl" :src="item.HttpsUrl"
                    style="height: 200px; margin-bottom: 10px; max-width: 180px" @click="PreviewImgClick(index)" />
                </div>
              </transition-group>
            </draggable>
            <el-upload class="bannerImg-uploader1" ref="upload" :show-file-list="false" action="#"
              :http-request="SuccessImgDetail" :auto-upload="true" multiple>
              <i class="el-icon-mpzengjia"></i>
            </el-upload>
          </el-form-item>
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
            <el-form-item label="添加商品">
              <el-select v-model="GoodsForm.GoodsTitle" @change="changeGoodsId($event)" filterable remote
                reserve-keyword placeholder="请输入商品名称" :remote-method="remoteGoodMethod" remote-show-suffix
                :loading="SelLoading" style="width: 100%" clearable>
                <el-option v-for="(item, index) in goodsData" :key="index"
                  :label="item.GoodsCode + '-' + item.GoodsTitle" :value="item.GoodsId">
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
          <el-button class="button1" :loading="addGoodsLoading" @click="SaveGoodsBtn">保 存</el-button>
          <el-button class="button2" @click="colseGoodsBtn">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 属性明细 -->
    <el-dialog title="添加/编辑属性" v-model="addPropertiesVisible" width="68%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="属性名称" label-width="140px">
            <el-select v-model="GoodsPropertiesID" filterable style="width: 100%" placeholder="请选择属性"
              :disabled="PropertiesType == 'edit'" @change="changeProperties($event)">
              <el-option v-for="item in GoodsPropertiesList" :key="item.PropId"
                :label="item.PropName + ' - ' + item.PropDesc" :value="item.PropId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="tranferbox">
            <el-row>
              <el-col :span="11">
                <el-table :data="GoodsPropertiesDetailList" border height="400" class="table" ref="multipleTable"
                  :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                  style="width: 100%">
                  <el-table-column align="center" label="明细">
                    <template #default="scope">
                      {{ scope.row.PropDetailName }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="SKU数量" width="100">
                    <template #default="scope">
                      <div>
                        {{ scope.row.SkuCount }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <div class="button-mgl">
                        <el-button class="button-op-del" size="small" @click="
                          handleLeft(scope.$index, scope.row.PropDetailId)
                          ">添加
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="2">
                <div class="el-transfer__buttons flex-col justify-center items-center" style="height: 400px">
                  <div class="button-mgl">
                    <el-button class="button-op-del" size="small" @click="handleLeftAll()">全增<el-icon>
                        <ArrowRightBold />
                      </el-icon>
                    </el-button>
                  </div>
                  <div class="button-mgl">
                    <el-button class="button-op-del" size="small" @click="handleRightAll()">全删<el-icon>
                        <ArrowLeftBold />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </el-col>
              <el-col :span="11">
                <div class="conbox">
                  <div class="wordbox">
                    <el-table :data="GoodsPropertiesDetailList1" border height="400" class="table" ref="multipleTable"
                      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                      style="width: 100%">
                      <el-table-column prop="PropDetailName" align="center" label="明细">
                        <template #default="scope">
                          {{ scope.row.PropDetailName }}
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="SKU数量" width="100">
                        <template #default="scope">
                          <div>
                            {{ scope.row.SkuCount }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center">
                        <template #default="scope">
                          <div class="button-mgl">
                            <el-button class="button-op-del" size="small" @click="
                              handleRight(
                                scope.$index,
                                scope.row.PropDetailId
                              )
                              ">删除
                            </el-button>
                            <el-icon :size="20" class="icon_top" v-if="scope.$index > 0"
                              @click="handleModalAdTop(scope.row, scope.$index)">
                              <Top />
                            </el-icon>
                            <el-icon :size="20" class="icon_top" v-if="
                              scope.$index <
                              GoodsPropertiesDetailList1.length - 1
                            " @click="
                                handleModalAdDown(scope.row, scope.$index)
                                ">
                              <Bottom />
                            </el-icon>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
            </el-row>

            <i class="el-icon-arrow-right"></i>&emsp;
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="addPropertiesLoading" @click="SavePropertiesBtn">保 存</el-button>
          <el-button class="button2" @click="addPropertiesVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="图片查看" v-model="FileVisible" width="38%" :show-close="true">
      <el-row :gutter="24">
        <el-col :span="24">
          <img :src="ImgDetailValue" style="width: 100%" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { GetUnitConfigs } from "@/api/index.js";
import {
  SearchTicketTemplates,
  GetExpressTemplateList,
  SearchBrands,
} from "@/api/ticket.js";
import {
  SaveSellGoods,
  GetGoods,
  GetGoodsList,
  GetPropertyList,
  GetGoodsCategoryList,
  GetPublicGoodsCategoryList,
  GetGoodsFromHaoxiny,
} from "@/api/goods.js";
import { UploadSingle } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import { VueDraggableNext } from "vue-draggable-next";
import Cookie from "js-cookie";
export default defineComponent({
  name: "selling_goods_info",
  components: { draggable: VueDraggableNext },
  setup() {
    const router = useRouter();
    const store = useStore();
    const formRef = ref(null);
    const btnLoading = ref(false);
    const Type = ref("");
    const mallValue = ref("");
    const fileImgList = ref([]);
    const fileDetailImgList = ref([]); //用于保存商品详情
    const brands = ref([]);
    let form = reactive({
      GoodsId: "",
      GoodsCode: "",
      BrandId: "",
      GoodsType: "2",
      GoodsTitle: "",
      GoodsSubTitle: "",
      ListImg: "",
      GoodsBarcode: "",
      GoodsConfig: "",
      GoodsDetail: "",
      OrgPrice: "", //列表价格必须大于0
      SellPrice: "", //销售价格必须大于0
      PurchasePrice: "", //采购价(分)
      WholesalePrice: "", //批发价(分)
      WholesaleBeginQty: "", //批发起始数量
      BuyPrice: "", //平台进货价(分)
      IsSell: 1, //必须可售
      TotalQty: "",
      ExpressTemplateId: "", //配送模板ID
      TicketTemplate: {
        TicketTemplateId: "",
      },
      GoodsCategories: [],
      Malls: [],
      TicketTemplateTitle: "",
      GoodsProperties: [], //商品的规格属性列表
      PackageDetails: [], //组合装商品时的商品明细
      GoodsSrc: "", //0:境内;1:保税
      Index: {
        CompositeIndex: 0,
      },
      properties: {}, //境外商品基础信息展示
      SpecTaxRates: [], //可变税率
      JtglobleUntaxPrice: "", //境外商品的未税价(分)
      JtglobleTaxRate: 0, //境外商品的税率(%)

      Length: 0, //长（厘米）
      Width: 0, //宽（厘米）
      Height: 0, //高（厘米）
      Weight: 0, //重量（克）
      MaxSupplyDays: 0, //最长供货天数
      SubType: "",//子类型(虚拟商品用)
    });
    const loginUser = JSON.parse(Cookie.get("User"));
    //商品分类
    const GoodsCategoriesList = ref([]);
    const classificationShow = ref(false);
    const GoodsCategoriesValue = ref([]);
    const rules = {
      GoodsCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
      GoodsTitle: [{ required: true, message: "请输入名称", trigger: "blur" }],
      OrgPrice: [{ required: true, message: "请输入原价", trigger: "blur" }],
      SellPrice: [{ required: true, message: "请输入售价", trigger: "blur" }],
      TicketTemplateTitle: [
        { required: true, message: "请选择券", trigger: "blur" },
      ],

      TotalQty: [
        { required: true, message: "请输入上架数量", trigger: "blur" },
      ],
      ListImg: [{ required: true, message: "请选择图片", trigger: "blur" }],
    };

    const onSubmit = async () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          btnLoading.value = true;

          form.GoodsCategories = [];
          GoodsCategoriesValue.value.forEach((row) => {
            form.GoodsCategories.push({ Id: row });
          });
          form.Malls = [
            {
              UnitId: loginUser.UnitId,
              Categories: form.GoodsCategories,
            },
          ];
          let GoodsValue = JSON.parse(JSON.stringify(form));
          if (GoodsValue.GoodsSrc == 1) {
            //如果是全球购的商品，
            let leftValue = (
              GoodsValue.JtglobleUntaxPrice *
              (1 + GoodsValue.JtglobleTaxRate / 100)
            ).toFixed(2);
            if (Number(leftValue) != Number(GoodsValue.SellPrice)) {
              ElMessage.error("未税价乘以税率与售价不匹配");
              btnLoading.value = false;
              return;
            }
          }
          GoodsValue.OrgPrice = GoodsValue.OrgPrice * 100;
          GoodsValue.SellPrice = GoodsValue.SellPrice * 100;
          GoodsValue.PurchasePrice = GoodsValue.PurchasePrice * 100;
          GoodsValue.BuyPrice = GoodsValue.BuyPrice * 100;
          GoodsValue.WholesalePrice = GoodsValue.WholesalePrice * 100;

          if (GoodsValue.GoodsType == 3) {
            GoodsValue.PackageDetails = [];
            PackageDetails.value.forEach((row) => {
              GoodsValue.PackageDetails.push({
                GoodsId: row.GoodsId,
                GoodsQty: row.number,
              });
            });
            if (GoodsValue.PackageDetails.length == 0) {
              btnLoading.value = false;
              ElMessage.info("请先添加商品");
              return;
            }
          }
          if (GoodsValue.GoodsType == 2) {
            GoodsValue.GoodsProperties = [];
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
                GoodsValue.GoodsProperties.push({
                  Id: row1.id,
                  Details: Details,
                  Status: 1,
                });
              });
            }
          }
          let GoodsConfig = {
            TopRotationImages: fileImgList.value, //轮播图
            DetailImages: fileDetailImgList.value, //商品详情
            ExtProperties: GoodsValue.properties, //商品详情
            JtglobleUntaxPrice: (GoodsValue.JtglobleUntaxPrice * 100).toFixed(
              0
            ),
            JtglobleTaxRate: GoodsValue.JtglobleTaxRate,
            Length: GoodsValue.Length,
            Width: GoodsValue.Width,
            Height: GoodsValue.Height,
            Weight: GoodsValue.Weight,
            MaxSupplyDays: GoodsValue.MaxSupplyDays,
            SubType: GoodsValue.SubType, //虚拟商品时的充值手机或者帐号
          };
          GoodsValue.GoodsConfig = JSON.stringify(GoodsConfig);
          let res = await SaveSellGoods({ Goods: GoodsValue });
          btnLoading.value = false;
          if (res.Code == 200) {
            common.ClosePageTag("售卖详情");
            let url="/selling_goods";
            if (mallValue.value) {
              store.commit("tags/setPageSaerch", {
                Search: 1,
                titlePage: "售卖商品",
              });
              url = "/my_product";
            } else {
              store.commit("tags/setPageSaerch", {
                Search: 1,
                titlePage: "售卖商品",
              });
            }
            ElMessage.success("保存成功");
            setTimeout(function () {
              router.push({
                path: url,
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
    const GetGoodsById = async (ID, Type) => {
      let res = null;
      if (Type == "id") {
        res = await GetGoods({
          ObjectId: ID,
        });
      } else {
        res = await GetGoodsFromHaoxiny({
          GoodsCode: form.GoodsCode,
          IsVirtualGoods: form.GoodsType == 4 ? 1 : 0,
        });
      }
      if (res.Code === 200) {
        form.GoodsSrc = res.DataMap.GoodsSrc;
        form.GoodsType = res.DataMap.GoodsType.toString();
        form.GoodsId = res.DataMap.GoodsId ? res.DataMap.GoodsId : "";
        form.BrandId = res.DataMap.BrandId == 0 ? "" : res.DataMap.BrandId;
        form.Index.CompositeIndex = res.DataMap.Index
          ? res.DataMap.Index.CompositeIndex
          : 0;
        form.GoodsCode = res.DataMap.GoodsCode;
        form.GoodsTitle = res.DataMap.GoodsTitle;
        form.GoodsSubTitle = res.DataMap.GoodsSubTitle;
        form.TotalQty = res.DataMap.TotalQty;
        form.ListImg = res.DataMap.ListImg;
        form.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
        form.SellPrice = (res.DataMap.SellPrice / 100).toFixed(2);
        form.PurchasePrice = (res.DataMap.PurchasePrice / 100).toFixed(2);
        form.WholesalePrice = (res.DataMap.WholesalePrice / 100).toFixed(2);
        form.WholesaleBeginQty = res.DataMap.WholesaleBeginQty;
        form.BuyPrice = (res.DataMap.BuyPrice / 100).toFixed(2);
        form.GoodsDetail = res.DataMap.GoodsDetail;
        form.ExpressTemplateId =
          res.DataMap.ExpressTemplateId == 0
            ? ""
            : res.DataMap.ExpressTemplateId;
        form.PackageDetails = res.DataMap.PackageDetails;
        form.SpecTaxRates = res.DataMap.SpecTaxRates;
        //商品分类
        res.DataMap.Malls.forEach((row) => {
          if (row.UnitId == loginUser.UnitId) {
            row.Categories.forEach((row1) => {
              GoodsCategoriesValue.value.push(row1.Id);
            });
          }
        });
        if (form.GoodsType == 1) {
          form.TicketTemplateTitle =
            res.DataMap.TicketTemplate.TicketTemplateCode +
            res.DataMap.TicketTemplate.TicketTemplateTitle;
          //当前为券商品
          form.TicketTemplate = {
            TicketTemplateId: res.DataMap.TicketTemplate.TicketTemplateId,
          };
        } else if (form.GoodsType == 2) {
          //当前为普通商品
          if (res.DataMap.GoodsProperties) {
            res.DataMap.GoodsProperties.forEach((row) => {
              let Desc = "";
              let NewDelList = [];
              let leftDelList = [];
              row.Details.forEach((row1) => {
                Desc += row1.Name + ",";
                row1.PropDetailId = row1.Id;
                row1.PropId = row.Id;
                row1.PropDetailName = row1.Name;
                row1.right = 1;
              });
              NewDelList = row.Details;
              temporaryList.value.forEach((row2) => {
                if (row2.PropId == row.Id) {
                  NewDelList = NewDelList.concat(row2.Details);
                  const res = new Map();
                  let NewList = NewDelList.filter(
                    (item) =>
                      !res.has(item["PropDetailId"]) &&
                      res.set(item["PropDetailId"], 1)
                  );
                  NewList.forEach((row) => {
                    if (!row.right) {
                      leftDelList.push(row);
                    }
                  });
                }
              });
              GoodsPropertiesSaveDesc.value.push({
                id: row.Id,
                desc: row.Name + "：" + Desc,
                arr: JSON.parse(JSON.stringify(row.Details)),
                leftDelList: leftDelList,
                SkuCount: row.SkuCount,
              });
            });
          }
        } else if (form.GoodsType == 3) {
          //当前为组合商品
          res.DataMap.PackageDetails.forEach((row) => {
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
            });
          });
        }

        if (res.DataMap.GoodsConfig) {
          let GoodsConfigJsonData = JSON.parse(res.DataMap.GoodsConfig);
          //轮播图
          fileImgList.value = JSON.parse(res.DataMap.GoodsConfig)
            .TopRotationImages
            ? JSON.parse(res.DataMap.GoodsConfig).TopRotationImages
            : [];
          //商品详情
          fileDetailImgList.value = GoodsConfigJsonData.DetailImages
            ? GoodsConfigJsonData.DetailImages
            : [];
          let fileDetailImgListV1 = [];
          fileDetailImgList.value.forEach((row, index) => {
            let obj = {
              HttpsUrl: row.HttpsUrl ? row.HttpsUrl : row,
              Name: index,
            };
            fileDetailImgListV1.push(obj);
          });
          fileDetailImgList.value = fileDetailImgListV1;

          form.properties = GoodsConfigJsonData.ExtProperties
            ? GoodsConfigJsonData.ExtProperties
            : {};
          form.JtglobleUntaxPrice = GoodsConfigJsonData.JtglobleUntaxPrice
            ? GoodsConfigJsonData.JtglobleUntaxPrice
            : "";
          form.JtglobleUntaxPrice = (form.JtglobleUntaxPrice / 100).toFixed(2);
          form.JtglobleTaxRate = GoodsConfigJsonData.JtglobleTaxRate
            ? GoodsConfigJsonData.JtglobleTaxRate
            : 0;

          form.Length = GoodsConfigJsonData.Length
            ? GoodsConfigJsonData.Length
            : 0;
          form.Width = GoodsConfigJsonData.Width
            ? GoodsConfigJsonData.Width
            : 0;
          form.Height = GoodsConfigJsonData.Height
            ? GoodsConfigJsonData.Height
            : 0;
          form.Weight = GoodsConfigJsonData.Weight
            ? GoodsConfigJsonData.Weight
            : 0;
          form.MaxSupplyDays = GoodsConfigJsonData.MaxSupplyDays
            ? GoodsConfigJsonData.MaxSupplyDays
            : 0;
          form.SubType = GoodsConfigJsonData.SubType
            ? GoodsConfigJsonData.SubType
            : "";

        }
      } else {
        ElMessage.warning(res.Message);
      }
    };

    const onReturn = async (val) => {
      common.ClosePageTag("售卖详情");
      router.back();
    };
    //根据ID获取详情
    const Init = async () => {
      if (router.currentRoute.value.query.ID) {
        form.GoodsId = router.currentRoute.value.query.ID;
        Type.value = router.currentRoute.value.query.Type;
      }

      if (router.currentRoute.value.query.mall) {
        mallValue.value = router.currentRoute.value.query.mall;
      }
      GetExpressTemplateListApi();
      if (loginUser.UnitName == "礼牛网") {
        GetPublicGoodsCategoryListApi();
      } else {
        GetGoodsCategoryListApi();
      }
      GetPropertbyListApi();
      GetBrands();
      isShowApi();
    };

    const TicketTemplateList = ref([]);
    const SelectLoading = ref(false);
    //获取券信息
    const remoteMethod = async (query) => {
      if (query) {
        let SearchQuery = "";
        if (query !== "") {
          SearchQuery = query;
        } else {
          return;
        }
        SelectLoading.value = true;
        let res = await SearchTicketTemplates({
          PageStartRow: 0,
          PageRowCount: 1000,
          NoPage: true, //不分页,分页（true,false)
          SearchCondition: {
            search_keyword: SearchQuery,
          },
        });
        SelectLoading.value = false;
        if (res.Code == 200) {
          TicketTemplateList.value = res.DataMap.Data;
        }
      } else {
        TicketTemplateList.value = [];
      }
    };
    //上传图片
    const SuccessImg = async (param) => {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          form.ListImg = res.DataMap.HttpsUrl;
        }
      });
    };
    const clear = () => {
      form.ListImg = "";
    };
    const ChangeTicketTemplateId = async (ID) => {
      form.TicketTemplate.TicketTemplateId = ID;
      TicketTemplateList.value.forEach((row) => {
        if (row.TicketTemplateId == ID) {
          form.TicketTemplateTitle =
            row.TicketTemplateCode + "-" + row.TicketTemplateTitle;
        }
      });
    };
    const GetGoodsCategoryListApi = async () => {
      let dataValue = [];
      let res = await GetGoodsCategoryList({});
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

    ////////////////////////////////////////////////////////////////
    //商品属性（当选择的类型为2的时候）
    const GoodsPropertiesList = ref([]);
    const GoodsPropertiesDetailList = ref([]); //明细
    const GoodsPropertiesDetailList1 = ref([]); //明细1

    const GoodsPropertiesDesc = ref("");
    const GoodsPropertiesDesc1 = ref("");
    const GoodsPropertiesSaveDesc = ref([]);
    const GoodsPropertiesID = ref("");
    const addPropertiesVisible = ref(false);
    const PropertiesType = ref("add");
    const GoodsProperties = ref([]);
    const addPropertiesLoading = ref(false);
    const temporaryList = ref([]); //临时用来处理下拉属性

    const GetPropertbyListApi = async () => {
      let res = await GetPropertyList({
        SearchCondition: {
          get_prop_detail: 1,
          prop_detail_goods_id: form.GoodsId,
        },
      });
      if (res.Code == 200) {
        res.DataMap.forEach((row) => {
          if (row.SkuCount > 0) {
            row.PropName =
              row.PropName + "(有" + row.SkuCount + "个SKU引用了本属性)";
          }
        });
        GoodsPropertiesList.value = res.DataMap;
        temporaryList.value = res.DataMap;
      }
      if (form.GoodsId) {
        GetGoodsById(form.GoodsId, "id");
      }
    };
    //保存属性
    const SavePropertiesBtn = async () => {
      let Desc = "";
      if (GoodsPropertiesID.value == "") {
        ElMessage.info("请先选择属性名称");
        return;
      }
      GoodsPropertiesDetailList1.value.forEach((row) => {
        //把选择的明细保存描述方便展示
        Desc += row.PropDetailName + ",";
      });
      GoodsPropertiesDesc1.value = `${Desc}`;
      if (PropertiesType.value == "edit") {
        GoodsPropertiesSaveDesc.value.forEach((row) => {
          if (GoodsPropertiesID.value == row.id) {
            row.arr = JSON.parse(
              JSON.stringify(GoodsPropertiesDetailList1.value)
            );
            row.desc =
              GoodsPropertiesDesc.value + "：" + GoodsPropertiesDesc1.value;
            row.leftDelList = JSON.parse(
              JSON.stringify(GoodsPropertiesDetailList.value)
            ); //把左边的表格数据存进去方便后续使用
          }
        });
      } else {
        let isRepeat = false;
        GoodsPropertiesSaveDesc.value.forEach((row) => {
          if (GoodsPropertiesID.value == row.id) {
            isRepeat = true;
          }
        });
        if (isRepeat) {
          ElMessage.error("请勿重复添加");
          return;
        }

        GoodsPropertiesSaveDesc.value.push({
          id: GoodsPropertiesID.value,
          arr: JSON.parse(JSON.stringify(GoodsPropertiesDetailList1.value)),
          desc: GoodsPropertiesDesc.value + "：" + GoodsPropertiesDesc1.value,
          leftDelList: JSON.parse(
            JSON.stringify(GoodsPropertiesDetailList.value)
          ), //把左边的表格数据存进去方便后续使用
          SkuCount: 0,
        });
      }
      addPropertiesVisible.value = false;
    };
    const addPropertiesBtn = async () => {
      addPropertiesVisible.value = true;
      PropertiesType.value = "add";
      GoodsPropertiesDesc.value = "";
      GoodsPropertiesDesc1.value = "";
      GoodsProperties.value = [];
      GoodsPropertiesDetailList.value = [];
      GoodsPropertiesDetailList1.value = [];
      GoodsPropertiesID.value = "";
    };
    const changeProperties = async (ID) => {
      GoodsPropertiesList.value = JSON.parse(
        JSON.stringify(temporaryList.value)
      );
      GoodsPropertiesList.value.forEach((row) => {
        if (ID == row.PropId) {
          GoodsPropertiesDetailList.value = [];
          GoodsPropertiesDetailList1.value = [];
          GoodsPropertiesDesc.value = `${row.PropName}`;
          GoodsPropertiesDesc1.value = "";
          GoodsProperties.value = [];
          GoodsPropertiesDetailList.value = row.Details;
        }
      });
    };
    //删除其中一个属性明细
    const PropertiesDelBtn = async (indexPost) => {
      let isNo = "";
      GoodsPropertiesSaveDesc.value.forEach((row, index) => {
        if (index == indexPost) {
          isNo = row.SkuCount;
          if (row.SkuCount == 0) {
            GoodsPropertiesSaveDesc.value.splice(indexPost, 1);
          }
        }
      });
      if (isNo > 0) {
        ElMessage.error("禁止删除，(有" + isNo + "个SKU引用了本属性)");
      }
    };
    //编辑单个属性
    const PropertiesEditBtn = async (indexPost, idPost) => {
      PropertiesType.value = "edit";
      //循环保存的属性数据
      GoodsPropertiesSaveDesc.value.forEach((row, index) => {
        if (index == indexPost) {
          //先把表格数据清空
          GoodsPropertiesDetailList.value = [];
          GoodsPropertiesDetailList1.value = [];
          GoodsPropertiesDesc.value = row.desc.split("：")[0];
          GoodsPropertiesDesc1.value = row.desc.split("：")[1];
          GoodsPropertiesID.value = row.id;
          GoodsProperties.value = row.arr; //保存的明细数据
          GoodsPropertiesDetailList1.value = row.arr;
          GoodsPropertiesDetailList.value = row.leftDelList;
          addPropertiesVisible.value = true;
        }
      });
    };

    const handleLeft = async (indexPost, ID) => {
      GoodsPropertiesDetailList.value.forEach((row, index) => {
        if (row.PropDetailId == ID) {
          if (row.SkuCount > 0) {
            ElMessage.error(
              "禁止添加(有" + row.SkuCount + "个SKU引用了本属性)"
            );
            return;
          }
          GoodsPropertiesDetailList1.value.push(row);
          GoodsPropertiesDetailList.value.splice(index, 1);
        }
      });
    };
    //把左边的数据全部移到右边
    const handleLeftAll = async () => {
      if (GoodsPropertiesDetailList.value.length == 0) {
        ElMessage.error("当前暂无数据");
        return;
      }
      if (GoodsPropertiesDetailList1.value.length > 0) {
        //说明已经添加了数据进来，那么只能依依添加进来了
        for (let i = 0; i < GoodsPropertiesDetailList.value.length; i++) {
          let list1 = GoodsPropertiesDetailList.value[i];
          GoodsPropertiesDetailList1.value.push(list1);
        }
        GoodsPropertiesDetailList.value = [];
      } else {
        //否则直接全部添加
        GoodsPropertiesDetailList1.value = JSON.parse(
          JSON.stringify(GoodsPropertiesDetailList.value)
        );
        GoodsPropertiesDetailList.value = [];
      }
    };
    //把右边的数据全部移到左边
    const handleRightAll = async () => {
      if (GoodsPropertiesDetailList1.value.length == 0) {
        ElMessage.error("当前暂无数据");
        return;
      }
      if (GoodsPropertiesDetailList.value.length > 0) {
        //说明已经添加了数据进来，那么只能依依添加进来了
        for (let i = 0; i < GoodsPropertiesDetailList1.value.length; i++) {
          let list1 = GoodsPropertiesDetailList.value[i];
          GoodsPropertiesDetailList.value.push(list1);
        }
        GoodsPropertiesDetailList1.value = [];
      } else {
        //否则直接全部添加
        GoodsPropertiesDetailList.value = JSON.parse(
          JSON.stringify(GoodsPropertiesDetailList1.value)
        );
        GoodsPropertiesDetailList1.value = [];
      }
    };
    const handleRight = async (indexPost, ID) => {
      GoodsPropertiesDetailList1.value.forEach((row, index) => {
        if (row.PropDetailId == ID) {
          if (row.SkuCount > 0) {
            ElMessage.error(
              "禁止删除(有" + row.SkuCount + "个SKU引用了本属性)"
            );
            return;
          }
          GoodsPropertiesDetailList.value.push(row);
          GoodsPropertiesDetailList1.value.splice(index, 1);
        }
      });
    };

    //删除图片
    const DelDetailClick = async (index) => {
      fileDetailImgList.value.splice(index, 1);
    };
    //删除轮播图片
    const DelBannerClick = async (index) => {
      fileImgList.value.splice(index, 1);
    };
    //预览图片
    const ImgDetailValue = ref("");
    const FileVisible = ref(false);

    const PreviewImgClick = async (index) => {
      FileVisible.value = true;
      ImgDetailValue.value = fileDetailImgList.value[index].HttpsUrl;
    };

    const PreviewBannerClick = async (index) => {
      FileVisible.value = true;
      ImgDetailValue.value = fileImgList.value[index];
    };

    ////////////////////////////////////////////////////////////////
    //增加组合商品 （当选择的类型为3的时候）
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
      TicketCount: [
        { required: true, message: "请输入发券数量", trigger: "blur" },
      ],
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
    const remoteGoodMethod = async (query) => {
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
            goods_type: 2,
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
    ////////////////////////////////////////////////////////////////
    //获取配送模板数据
    const ExpressTemplateList = ref([]);
    const GetExpressTemplateListApi = async () => {
      let res = await GetExpressTemplateList({});
      if (res.Code == 200) {
        if (res.DataMap) {
          ExpressTemplateList.value = res.DataMap;
        } else {
          ExpressTemplateList.value = [];
        }
      }
    };
    ////////////////////////////////////////////////////////////////
    //上传图片
    const SuccessImgBanner = (param) => {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      UploadSingle(fd).then((res) => {
        fileImgList.value.push(res.DataMap.HttpsUrl);
      });
    };
    const SuccessImgDetail = (param) => {
      let fd = new FormData();
      fd.append("file", param.file); //传文件
      let FileName = param.file.name.split(".")[0];
      UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
          fileDetailImgList.value.push({
            HttpsUrl: res.DataMap.HttpsUrl,
            Name: FileName,
          });
          sortKey(fileDetailImgList.value, "Name");
        }
      });
    };
    //正序
    const sortKey = (array, key) => {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    };
    //倒序
    const sortKey1 = (array, key) => {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    };
    ////////////////////////////////////////////////////////////////
    const handleModalAdTop = async (key, index) => {
      GoodsPropertiesDetailList1.value[index] =
        GoodsPropertiesDetailList1.value.splice(
          index - 1,
          1,
          GoodsPropertiesDetailList1.value[index]
        )[0];
    };
    const handleModalAdDown = async (key, index) => {
      if (index != GoodsPropertiesDetailList1.value.length - 1) {
        GoodsPropertiesDetailList1.value[index] =
          GoodsPropertiesDetailList1.value.splice(
            index + 1,
            1,
            GoodsPropertiesDetailList1.value[index]
          )[0];
      }
    };
    ////////////////////////////////////////////////////////////////
    const onStart = () => { };
    const onEnd = () => { };
    const onStart1 = () => { };
    const onEnd1 = () => { };
    ////////////////////////////////////////////////////////////////
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
    ////////////////////////////////////////////////////////////////
    const isShowApi = async () => {
      if (loginUser.UnitType == 1) {
        //如果是礼牛网直接露出分类
        classificationShow.value = true;
      } else {
        //如果是券商，那么就要判断一下当前是否有商城开启
        let res = await GetUnitConfigs({
          ObjectId: loginUser.UnitId,
        });
        if (res.Code == 200) {
          res.DataMap.forEach((row) => {
            if (row.ConfigKey == "mall.switch") {
              //如果商城开起了
              if (row.ConfigValue == "on") {
                classificationShow.value = true;
              }
            }
          });
        }
      }
    };
    ////////////////////////////////////////////////////////////////

    const handleInput = () => {
      //容量单价
      let capacityUnitPrice = (
        form.JtglobleUntaxPrice /
        (form.properties.jtgloble_capacity * form.properties.jtgloble_specQty)
      ).toFixed(2);
      if (form.SpecTaxRates.length > 0) {
        //说明需要先看税率比较
        if (capacityUnitPrice >= form.SpecTaxRates[0].CapacityPrice) {
          //如果大于
          form.JtglobleTaxRate = form.SpecTaxRates[0].TaxRate;
        } else {
          form.JtglobleTaxRate = form.SpecTaxRates[1].TaxRate;
        }
        form.SellPrice = (
          form.JtglobleUntaxPrice *
          (1 + form.JtglobleTaxRate / 100)
        ).toFixed(2);
      } else {
        form.SellPrice = (
          form.JtglobleUntaxPrice *
          (1 + form.JtglobleTaxRate / 100)
        ).toFixed(2);
      }
      form.OrgPrice = form.SellPrice;
    };
    ////////////////////////////////////////////////////////////////
    //根绝编码查询云中鹤商品数据
    const yzhFindCode = async () => {
      if (form.GoodsCode == "") {
        return;
      }
      GetGoodsById(form.GoodsCode, "code");
    };
    ////////////////////////////////////////////////////////////////
    Init();
    return {
      formRef,
      btnLoading,
      Type,
      form,
      rules,
      onSubmit,
      onReturn,
      remoteMethod,
      SuccessImg,
      clear,
      ChangeTicketTemplateId,
      addPropertiesLoading,
      SavePropertiesBtn,
      addPropertiesBtn,
      changeProperties,
      PropertiesDelBtn,
      PropertiesEditBtn,
      handleLeft,
      handleLeftAll,
      handleRightAll,
      handleRight,
      DelDetailClick,
      DelBannerClick,
      PreviewImgClick,
      PreviewBannerClick,
      GoodsRules,
      addGoodsLoading,
      GoodsForm,
      changeGoodsId,
      SaveGoodsBtn,
      colseGoodsBtn,
      remoteGoodMethod,
      addGoodBtn,
      goodDelBtn,
      goodEditBtn,
      addNumberBtn,
      reduceNumberBtn,
      SuccessImgBanner,
      SuccessImgDetail,
      handleModalAdTop,
      handleModalAdDown,
      onStart,
      onEnd,
      onStart1,
      onEnd1,
      fileImgList,
      brands,
      GoodsPropertiesSaveDesc,
      fileDetailImgList,
      addPropertiesVisible,
      FileVisible,
      addGoodsVisible,
      GoodsCategoriesList,
      GoodsCategoriesValue,
      TicketTemplateList,
      SelectLoading,
      GoodsPropertiesList,
      GoodsPropertiesDetailList,
      GoodsPropertiesDetailList1,
      GoodsPropertiesDesc,
      GoodsPropertiesDesc1,
      GoodsPropertiesID,
      PropertiesType,
      GoodsProperties,
      temporaryList,
      ImgDetailValue,
      isEditGoods,
      chooseIdx,
      goodsData,
      PackageDetails,
      SelLoading,
      ExpressTemplateList,
      sortKey,
      classificationShow,
      handleInput,
      loginUser,
      yzhFindCode,
    };
  },
});
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
.bannerImg-uploader1 {
  width: 120px;
  height: 80px;
}

.bannerImg-uploader1 .el-upload {
  width: 120px;
  height: 80px;
  line-height: 80px;
}

.bannerImg-avatar {
  width: 100%;
}

.commodity-home-uploader {
  width: 200px;
  height: 200px;
}

.commodity-home-uploader .el-upload {
  width: 200px !important;
  height: 200px !important;
  line-height: 200px !important;
}

.commodity-home-uploader-avatar {
  width: 100%;
}
</style>
