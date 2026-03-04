<template>
  <el-form ref="formRef" :model="formOne" :rules="rulesOne" label-width="160px">
    <div>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="20">
              <el-form-item label="类型" prop="CouponType">
                <el-select @change="CouponTypeChange" :disabled="formData.TicketTemplateId != ''" :clearable="false"
                  v-model="formOne.CouponType" placeholder="请选择类型" style="width: 100%">
                  <el-option label="提货券(单选)" value="1" />
                  <el-option label="提货券(多选)" value="2" />
                  <el-option label="提货券包" value="3" />
                  <el-option label="折扣券" value="4" />
                  <el-option label="现金券" value="5" />
                  <el-option label="储值卡" value="6" />
                  <el-option v-if="User.UnitName == '礼牛网'" label="企业点卡" value="7" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="批次号">
                <el-input :disabled="Type == 'View'" maxlength="8" show-word-limit
                  v-model="formOne.TicketTemplateCode" clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数量">
                <el-input :disabled="Type == 'View'" v-model="formOne.CreateTicketCount">
                  <template #append>张</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="起始序号">
                <el-input :disabled="Type == 'View' || formData.TicketTemplateId != ''"
                  v-model="formOne.BeginIndex">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="有效期类型">
                <el-select v-model="formOne.ValidDateType" :disabled="Type == 'View'" style="width: 100%">
                  <el-option label="永久有效" value="0"></el-option>
                  <el-option label="固定时间内有效" value="1"></el-option>
                  <el-option label="自领取之日起多少天内有效" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.ValidDateType == 1">
              <el-form-item label="有效期" prop="time">
                <el-date-picker :disabled="Type == 'View'" :default-time="defaultTime2" v-model="formOne.time"
                  @change="changeDatetimeRange" type="datetimerange" range-separator="至" start-placeholder="开始"
                  end-placeholder="结束" />
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.ValidDateType == 2">
              <el-form-item label="领取之日起">
                <el-input :disabled="Type == 'View'" v-model="formOne.ValidDateAdd">
                  <template #append>天内有效</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="
              formOne.CouponType == 1 ||
              formOne.CouponType == 2 ||
              formOne.CouponType == 3
            ">
              <el-form-item label="配送期类型">
                <el-select :disabled="Type == 'View'" v-model="formOne.ExchangeDateType" style="width: 100%">
                  <el-option label="永久可兑换" value="0"></el-option>
                  <el-option label="固定时间内可兑换" value="1"></el-option>
                  <el-option label="自领取之日起多少天内可兑换" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="
              formOne.ExchangeDateType == 1 &&
              (formOne.CouponType == 1 ||
                formOne.CouponType == 2 ||
                formOne.CouponType == 3)
            ">
              <el-form-item label="线上配送期" prop="time1">
                <el-date-picker :disabled="Type == 'View'" :default-time="defaultTime2" v-model="formOne.time1"
                  type="datetimerange" range-separator="至" start-placeholder="开始" end-placeholder="结束" />
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.ExchangeDateType == 2">
              <el-form-item label="领取之日起">
                <el-input :disabled="Type == 'View'" v-model="formOne.ExchangeDateAdd">
                  <template #append>天内可兑换</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.CouponType == 1 || formOne.CouponType == 2">
              <el-form-item label="配送范围" prop="ExpressTemplateId">
                <el-select v-if="Type != 'View'" style="width: 55%" filterable v-model="formOne.ExpressTemplateId"
                  clearable placeholder="请选择配送模板">
                  <el-option v-for="item in Templates" :key="item.TemplateName" :label="item.TemplateName"
                    :value="item.TemplateId" />
                </el-select>
                <el-input v-if="Type == 'View'" :disabled="true" v-model="formData.TemplateName">
                </el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-link v-if="Type != 'View'" :underline="false" @click="btnRefresh" style="color: #f56c6c">
                  <el-icon>
                    <RefreshRight />
                  </el-icon>&nbsp;&nbsp;刷&nbsp;&nbsp;新 </el-link>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-link v-if="Type != 'View'" :underline="false" @click="btnTemplates" style="color: #f56c6c">
                  <el-icon>
                    <Tickets />
                  </el-icon>&nbsp;&nbsp;模&nbsp;&nbsp;板
                </el-link>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="创建人">
                <el-input disabled v-model="formOne.CreatedBy"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="创建时间">
                <el-input disabled v-model="formOne.CreatedTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.CouponType == 6">
              <el-form-item label="在指定门店使用">
                <el-radio-group :disabled="Type == 'View'" v-model="formOne.CanUseInSpecialShop">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="20">
              <el-form-item label="品牌" prop="BrandId">
                <el-select :disabled="Type == 'View'" v-model="formOne.BrandId" clearable filterable
                  placeholder="请选择品牌" style="width: 100%">
                  <el-option v-for="item in brands" :key="item.BrandName" :label="item.BrandName"
                    :value="item.BrandId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="名称" prop="TicketTemplateTitle">
                <el-input :disabled="Type == 'View'" maxlength="30" v-model="formOne.TicketTemplateTitle"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.CouponType != 4">
              <el-form-item label="面值" prop="OrgPrice">
                <el-input :disabled="Type == 'View' || formOne.CouponType == 7" v-model="formOne.OrgPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-else>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="折扣">
                    <el-input :disabled="Type == 'View'" type="number" :min="1" :max="100" v-model="formOne.Discount"
                      @input="validateDiscount">
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="10px">
                    <span style="color: #606266">tips:85%等于原价*0.85、等于打85折</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20" v-if="formOne.CouponType == 1||formOne.CouponType == 2">
              <el-form-item label="支付价格" prop="PayPrice">
                <el-input :disabled="Type == 'View'" v-model="formOne.PayPrice">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formOne.CouponType == 1 || formOne.CouponType == 2">
              <el-form-item label="配送类型">
                <el-select :disabled="Type == 'View'" v-model="formOne.DeliverType" placeholder="请选择配送类型"
                  style="width: 100%">
                  <el-option label="线上兑换配送到家" value="0"></el-option>
                  <el-option label="线上预约线下到店提货" value="21"></el-option>
                  <el-option label="既可线上配送,也可线下提货" value="22"></el-option>
                  <el-option label="只可线下门店提货" value="23"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="
              (formOne.CouponType == 1 || formOne.CouponType == 2) &&
              (formOne.DeliverType == 21 || formOne.DeliverType == 22)
            ">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="线下提货时">
                    <el-radio-group :disabled="Type == 'View'" v-model="formOne.NeedPreBookWhenPickupDesc">
                      <el-radio-button label="1">要</el-radio-button>
                      <el-radio-button label="0">不要</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label-width="90px" label="提前预约"></el-form-item>
                </el-col>
                <el-col :span="6" :offset="1" v-if="formOne.NeedPreBookWhenPickupDesc == 1">
                  <el-form-item label-width="80px" label="需提前">
                    <el-input :disabled="Type == 'View'" style="width: 100%" placeholder="多少" maxlength="3"
                      show-word-limit v-model="formOne.ForwardDaysWhenPreBook">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" v-if="formOne.NeedPreBookWhenPickupDesc == 1">
                  <el-form-item label-width="76px" label="天预约"></el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="密码">
                    <el-switch :disabled="Type == 'View'" style="--el-switch-on-color: #e57672"
                      v-model="formOne.HasPass" inline-prompt active-text="启" inactive-text="关" />
                  </el-form-item>
                </el-col>
                <el-col :span="10" v-if="formOne.HasPass">
                  <el-form-item label="密码的长度">
                    <el-input :disabled="Type == 'View'" v-model="formOne.PasswordLength" maxlength="2">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-if="formOne.HasPass">
                  <el-form-item label-width="100px" label="(最多10位)"></el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-form-item label="卡号/券码自定义">
                <el-switch :disabled="Type == 'View'" style="--el-switch-on-color: #e57672"
                  v-model="formOne.TicketCodeCustomize" inline-prompt active-text="是" inactive-text="否" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="10" v-if="formOne.TicketCodeCustomize">
                  <el-form-item label="序号的长度" prop="TicketIndexLengthInCode">
                    <el-input :disabled="Type == 'View'" type="number" v-model="formOne.TicketIndexLengthInCode"
                      maxlength="2">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-if="formOne.TicketCodeCustomize">
                  <el-form-item label-width="100px" label="(最大为10)"></el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="10" v-if="formOne.TicketCodeCustomize">
                  <el-form-item label="随机字符的长度" prop="RandomCharLengthInCode">
                    <el-input :disabled="Type == 'View'" type="number" v-model="formOne.RandomCharLengthInCode"
                      maxlength="1">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" v-if="formOne.TicketCodeCustomize">
                  <el-form-item label-width="92px" label="(最大为5)"></el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20" v-if="formOne.TicketCodeCustomize">
              <el-form-item label="随机字符的类型">
                <el-radio-group :disabled="Type == 'View'" v-model="formOne.RandomCharType">
                  <el-radio label="0">字母+数字</el-radio>
                  <el-radio label="1">仅字母</el-radio>
                  <el-radio label="2">仅数字</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="激活方式">
                <el-radio-group :disabled="Type == 'View'" v-model="formOne.ActivateKind">
                  <el-radio label="2">手动激活</el-radio>
                  <el-radio label="1">新建激活</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="允许赠送">
                <el-radio-group :disabled="Type == 'View' || formOne.CouponType == 7" v-model="formOne.CannotGive">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="
              User.UnitType == 2 &&
              (formOne.CouponType == 4 ||
                formOne.CouponType == 5 ||
                formOne.CouponType == 6)
            ">
              <el-form-item label="能否在平台使用">
                <el-radio-group :disabled="Type == 'View'" v-model="formOne.CanUsePublic">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="主图" prop="ListImg">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="formOne.ListImg" v-if="false"></el-input>
                    <el-upload class="ticket-uploader" ref="upload" :show-file-list="false" action="#"
                      :http-request="SuccessImg" :before-upload="beforeUpload" :auto-upload="true">
                      <img v-if="formOne.ListImg" :src="formOne.ListImg" class="ticket-uploader-avatar" />
                      <div v-else class="upload-placeholder">
                        <el-icon>
                          <Plus />
                        </el-icon>
                      </div>
                    </el-upload>
                    <p class="text">不超过1M 建议尺寸：300*300
                      <span style="cursor: pointer" class="el-icon-delete" v-if="formOne.ListImg && Type != 'View'"
                        @click="clear">删除</span>
                    </p>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="8">
          <el-button class="button2" :loading="onSubmitOneLoading" round @click="onSubmitOne">
            &nbsp;&nbsp;下一步&nbsp;&nbsp;</el-button>
          <el-button class="button1" round @click="onReturn">
            &nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshRight, Tickets, Plus } from '@element-plus/icons-vue';
import Cookie from 'js-cookie';
import common from '@/utils/common.js';
import { UploadSingle } from '@/api/imgapi.js';

// 定义组件属性
const props = defineProps({
  formOne: {
    type: Object,
    default: () => ({})
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  Type: {
    type: String,
    default: ''
  },
  User: {
    type: Object,
    default: () => ({})
  },
  Templates: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  },
  defaultTime2: {
    type: Array,
    default: () => []
  },
  onSubmitOneLoading: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits([
  'submit-one',
  'return',
  'refresh-templates',
  'open-templates',
  'CouponTypeChange',
  'changeDatetimeRange',
  'SuccessImg',
  'beforeUpload',
  'clear',
  'validateDiscount',
  'onSubmitOne',
  'onReturn'
]);

// 用户信息
const { User } = props;

// 表单引用
const formRef = ref(null);

// 从 props 中解构 formOne
const { formOne } = props;

// 表单验证规则
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入券数量'));
  } else if (value > 100000) {
    callback(new Error('不超10万张'));
  } else {
    callback();
  }
};

const checkTicketCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入数值'));
  } else {
    if (value > 10 || value < 0) {
      callback(new Error('已超过最大值'));
    } else {
      callback();
    }
  }
};

const checkRandomCharCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入数值'));
  } else {
    if (value > 5 || value < 0) {
      callback(new Error('已超过最大值'));
    } else {
      callback();
    }
  }
};

const rulesOne = {
  BrandId: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
  TicketTemplateTitle: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  CreateTicketCount: [{ validator: validatePass2, trigger: 'blur' }],
  OrgPrice: [{ required: true, message: '请输入券面值', trigger: 'blur' }],
  PayPrice: [{ required: true, message: '请输入支付价格', trigger: 'blur' }],
  time: [{ required: true, message: '请选择有效期时间', trigger: 'blur' }],
  time1: [{ required: true, message: '请选择配送期时间', trigger: 'blur' }],
  ListImg: [{ required: true, message: '请选择券图', trigger: 'blur' }],
  ExpressTemplateId: [
    { required: true, message: '请选择配送范围', trigger: 'blur' },
  ],
  TicketIndexLengthInCode: [{ validator: checkTicketCode, trigger: 'blur' }],
  RandomCharLengthInCode: [{ validator: checkRandomCharCode, trigger: 'blur' }],
};

// 从 props 中解构 defaultTime2
const { defaultTime2 } = props;

// 方法
const onSubmitOne = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('onSubmitOne');
    }
  });
};

const onReturn = () => {
  emit('onReturn');
};

const btnRefresh = () => {
  emit('btnRefresh');
};

const btnTemplates = () => {
  emit('btnTemplates');
};

const changeDatetimeRange = (value) => {
  if (formOne.time1 != '') {
    return;
  }
  formOne.time1 = value;
  emit('changeDatetimeRange', value);
};

const validateDiscount = (value) => {
  if (value < 1 || value > 100) {
    formOne.Discount = Math.min(Math.max(1, value), 100);
  }
  emit('validateDiscount', value);
};

const CouponTypeChange = (val) => {
  if (val == 7) {
    // 企业点卡的时候，不允许赠送
    formOne.CannotGive = '1';
    formOne.OrgPrice = 0;
    formOne.PayPrice = 0;
  }
  emit('CouponTypeChange', val);
};

const SuccessImg = async (param) => {
  emit('SuccessImg', param);
};

const beforeUpload = (file) => {
  const result = emit('beforeUpload', file);
  return result !== false;
};

const clear = () => {
  emit('clear');
};

// 暴露validate方法给父组件
const validate = (callback) => {
  formRef.value.validate(callback);
};

defineExpose({
  validate
});
</script>

<style scoped>
.ticket-uploader {
  width: 150px;
  height: 150px;

  .el-upload {
    width: 150px !important;
    height: 150px !important;
    line-height: 150px !important;
  }

  .ticket-uploader-avatar {
    width: 100%;
  }
}

.upload-placeholder {
  width: 150px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  overflow: hidden;
}

.text {
  margin-top: 12px;
  color: #606266;
}

.button1 {
  background-color: #f56c6c;
  color: white;
  margin-left: 20px;
}

.button2 {
  border-color: #f56c6c;
  color: #f56c6c;
}
</style>