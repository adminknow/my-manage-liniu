<template>
  <el-dialog 
    class="unit-top" 
    title="券商" 
    v-model="dialogVisible" 
    width="38%" 
    :show-close="false" 
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="24">
        <el-form 
          ref="formRef" 
          :model="form" 
          :rules="rules" 
          label-width="160px"
        >
          <el-tabs type="border-card">
            <!-- 基础信息标签页 -->
            <el-tab-pane label="基础信息">
              <el-form-item prop="UnitCode" label="编码" label-width="120px">
                <el-input 
                  v-model="form.UnitCode" 
                  maxlength="15" 
                  show-word-limit 
                  style="width: 60%"
                  placeholder="请输入编码"
                ></el-input>
                <p style="font-size: 12px; width: 100%; height: 20px">
                  必须为英文、数字、或者下划线长度在6-15之间
                </p>
              </el-form-item>
              <el-form-item prop="UnitName" label="简称" label-width="120px">
                <el-input 
                  maxlength="8" 
                  show-word-limit 
                  style="width: 60%" 
                  v-model="form.UnitName"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="地址" label-width="120px">
                <el-input 
                  maxlength="100" 
                  :rows="2" 
                  show-word-limit 
                  type="textarea" 
                  placeholder="请输入地址"
                  v-model="form.UnitAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人" label-width="120px">
                <el-input 
                  v-model="form.UnitContact" 
                  maxlength="20" 
                  show-word-limit 
                  style="width: 60%"
                  placeholder="请输入联系人"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="120px">
                <el-input 
                  v-model="form.UnitTel" 
                  maxlength="20" 
                  show-word-limit 
                  style="width: 60%"
                  placeholder="请输入电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="授权品牌" label-width="120px" prop="BrandsDesc">
                <el-select 
                  v-model="form.BrandsDesc" 
                  multiple 
                  filterable 
                  :max-collapse-tags="3"
                  placeholder="选择品牌" 
                  style="width: 60%"
                >
                  <el-option 
                    v-for="item in BrandList" 
                    :key="item.BrandId" 
                    :label="item.BrandName"
                    :value="item.BrandId" 
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="客服电话" prop="CustomerServiceTel" label-width="120px">
                <el-input 
                  maxlength="20" 
                  show-word-limit 
                  style="width: 60%" 
                  v-model="form.CustomerServiceTel"
                  placeholder="请输入客服电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="有效期至" prop="ValidDate" label-width="120px">
                <div style="width: 100%">
                  <el-date-picker 
                    style="width: 60%" 
                    v-model="form.ValidDate" 
                    type="date" 
                    placeholder="请选择日期" 
                  />
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <!-- 额度标签页 -->
            <el-tab-pane label="额度">
              <el-form-item label="额度日期" label-width="200px">
                <el-date-picker 
                  style="width: 100%" 
                  v-model="PaidTime" 
                  clearable="false" 
                  type="daterange"
                  range-separator="To" 
                  start-placeholder="开始日期" 
                  end-placeholder="结束日期" 
                />
              </el-form-item>
              <el-form-item label="额度期内最多可创建" label-width="200px">
                <el-input v-model="form.MaxCreateTicketCount" placeholder="请输入张数">
                  <template #append>张券（0：不控制）</template>
                </el-input>
              </el-form-item>
              <el-form-item label="额度期内最多可免费兑换" label-width="200px">
                <el-input v-model="form.MaxFreeExchangeTicketCount" placeholder="请输入张数">
                  <template #append>张券</template>
                </el-input>
              </el-form-item>
              <el-form-item label="额度期内最多可创建" label-width="200px">
                <el-input v-model="form.MaxUserCount" placeholder="请输入个数">
                  <template #append>个用户（0：不控制）</template>
                </el-input>
              </el-form-item>
              <el-form-item label="创建商品时" label-width="200px">
                <el-radio-group v-model="form.AutoSubmitWhenCreateGoodsDesc">
                  <el-radio-button label="1">自动</el-radio-button>
                  <el-radio-button label="0">不自动</el-radio-button>
                </el-radio-group>
                &nbsp;提交为通过
              </el-form-item>
              <el-form-item label="创建券模板时" label-width="200px">
                <el-radio-group v-model="form.AutoSubmitWhenCreateTicketDesc">
                  <el-radio-button label="1">自动</el-radio-button>
                  <el-radio-button label="0">不自动</el-radio-button>
                </el-radio-group>
                &nbsp;提交为通过
              </el-form-item>
            </el-tab-pane>
            
            <!-- 开票信息标签页 -->
            <el-tab-pane label="开票信息">
              <el-form-item label="税号" label-width="100px">
                <el-input 
                  v-model="form.TaxNo" 
                  maxlength="20" 
                  style="width: 60%" 
                  show-word-limit
                  placeholder="请输入税号"
                ></el-input>
              </el-form-item>
              <el-form-item label="抬头" label-width="100px" prop="InvoiceTitle">
                <el-input 
                  maxlength="100" 
                  show-word-limit 
                  v-model="form.InvoiceTitle"
                  placeholder="请输入发票抬头"
                ></el-input>
              </el-form-item>
              <el-form-item label="地址" label-width="100px">
                <el-input 
                  maxlength="100" 
                  show-word-limit 
                  v-model="form.InvoiceAddress"
                  placeholder="请输入发票地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人" label-width="100px">
                <el-input 
                  maxlength="20" 
                  style="width: 60%" 
                  show-word-limit 
                  v-model="form.InvoiceContract"
                  placeholder="请输入发票联系人"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话" label-width="100px">
                <el-input 
                  maxlength="20" 
                  style="width: 60%" 
                  show-word-limit 
                  v-model="form.InvoiceTel"
                  placeholder="请输入发票联系电话"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button 
          class="button1" 
          v-if="Type !== 'View'" 
          :loading="btnLoading" 
          @click="handleSave"
        >
          保 存
        </el-button>
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 券商编辑弹窗组件
 * 功能：编辑券商的基础信息、额度配置和开票信息
 */

import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import common from "@/utils/common.js";
import { SaveUnit } from "@/api/index.js";

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  unitId: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: ""
  },
  unitData: {
    type: Object,
    default: () => ({})
  },
  BrandList: {
    type: Array,
    default: () => []
  }
});

// 定义emit
const emit = defineEmits(["close", "save"]);

// 响应式数据
const dialogVisible = ref(false);
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
const PaidTime = ref([]);

// 表单数据
const form = reactive({
  UnitId: "",
  UnitType: "2",
  UnitCode: "",
  UnitName: "",
  UnitAddress: "",
  UnitContact: "",
  UnitTel: "",
  CustomerServiceTel: "", // 客服电话
  ValidDate: "", // 有效期
  UnitConfig: "",
  MaxCreateTicketCount: 0, // 每年最多可创建多少张券(0:不控制)
  MaxFreeExchangeTicketCount: 0, // 每年最多可免费兑换多少张券
  MaxUserCount: 0, // 最多可创建多少个用户(0:不控制)
  AutoSubmitWhenCreateGoods: true, // 创建商品时，是否自动提交为通过
  AutoSubmitWhenCreateGoodsDesc: 1,
  AutoSubmitWhenCreateTicket: true, // 创建券模板时，是否自动提交为通过
  AutoSubmitWhenCreateTicketDesc: 1,
  CanExchangeTicketOnlyAfterSold: false, // 是否只有在被销售后券才能兑换
  CanExchangeTicketOnlyAfterSoldDesc: 0,
  TaxNo: "", // 税号
  InvoiceTitle: "", // 发票抬头（必输入）
  InvoiceAddress: "", // 发票地址
  InvoiceContract: "", // 发票联系人
  InvoiceTel: "", // 发票联系电话
  Brands: [], // 授权的品牌
  BrandsDesc: [], // 授权的品牌
});

/**
 * 验证编码格式
 * @param {Object} rule - 验证规则
 * @param {string} value - 编码值
 * @param {Function} callback - 回调函数
 */
const validateUnitCode = (rule, value, callback) => {
  const unitCodePattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
  if (!unitCodePattern.test(value)) {
    callback(new Error("编码必须为英文、数字、或者下划线长度在6-15之间"));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = {
  UnitCode: [
    { required: true, message: "请输入编码", trigger: "blur" },
    {
      validator: validateUnitCode,
      trigger: "blur"
    }
  ],
  UnitName: [{ required: true, message: "请输入简称", trigger: "blur" }],
  BrandsDesc: [{ required: true, message: "请选择授权品牌", trigger: "blur" }],
  CustomerServiceTel: [
    { required: true, message: "请输入客服电话", trigger: "blur" },
  ],
  ValidDate: [{ required: true, message: "请选择有效期", trigger: "blur" }],
  InvoiceTitle: [
    { required: true, message: "请输入发票抬头", trigger: "blur" },
  ],
};

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

// 监听unitData变化，更新表单数据
watch(() => props.unitData, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal);
    // 处理额度日期
    if (newVal.UnitConfig) {
      try {
        const JsonConfig = JSON.parse(newVal.UnitConfig);
        if (JsonConfig.PaidBeginDate && JsonConfig.PaidEndDate) {
          PaidTime.value = [
            JsonConfig.PaidBeginDate.toString(),
            JsonConfig.PaidEndDate.toString(),
          ];
        } else {
          PaidTime.value = ["", ""];
        }
      } catch (error) {
        console.error("解析配置数据失败:", error);
        PaidTime.value = ["", ""];
      }
    } else {
      PaidTime.value = ["", ""];
    }
  }
}, { deep: true });

// 监听type变化
watch(() => props.type, (newVal) => {
  Type.value = newVal;
});

/**
 * 保存表单
 */
const handleSave = async () => {
  if (!formRef.value) return;
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 构建配置对象
      const JsonConfig = {
        MaxCreateTicketCount: form.MaxCreateTicketCount,
        MaxFreeExchangeTicketCount: form.MaxFreeExchangeTicketCount,
        MaxUserCount: form.MaxUserCount,
        AutoSubmitWhenCreateGoods: form.AutoSubmitWhenCreateGoodsDesc === 1,
        AutoSubmitWhenCreateTicket: form.AutoSubmitWhenCreateTicketDesc === 1,
        CanExchangeTicketOnlyAfterSold: form.CanExchangeTicketOnlyAfterSoldDesc === 1,
      };
      
      // 处理额度日期
      if (PaidTime.value && PaidTime.value.length > 0) {
        JsonConfig.PaidBeginDate = common.dateFormat("YYYY-mm-dd", PaidTime.value[0]);
        JsonConfig.PaidEndDate = common.dateFormat("YYYY-mm-dd", PaidTime.value[1]);
      } else {
        JsonConfig.PaidBeginDate = "";
        JsonConfig.PaidEndDate = "";
      }
      
      form.UnitConfig = JSON.stringify(JsonConfig);
      
      // 处理品牌数据
      form.Brands = form.BrandsDesc.map((brandId) => ({
        Id: brandId,
      }));
      
      // 处理有效期
      if (form.ValidDate) {
        form.ValidDate = common.dateFormat("YYYY-mm-dd", form.ValidDate);
      }
      
      // 提交保存
      btnLoading.value = true;
      try {
        const res = await SaveUnit({
          Unit: form,
          IsSubmit: true,
          AddUser: true,
        });
        
        if (res.Code === 200) {
          ElMessage.success("保存成功");
          emit("save");
          handleClose();
        } else {
          ElMessage.error(res.Message);
        }
      } catch (error) {
        console.error("保存失败:", error);
        ElMessage.error("保存失败，请重试");
      } finally {
        btnLoading.value = false;
      }
    }
  });
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit("close");
};

/**
 * 初始化表单数据
 */
const initForm = () => {
  // 重置表单数据
  Object.assign(form, {
    UnitId: "",
    UnitType: "2",
    UnitCode: "",
    UnitName: "",
    UnitAddress: "",
    UnitContact: "",
    UnitTel: "",
    CustomerServiceTel: "",
    ValidDate: "",
    UnitConfig: "",
    MaxCreateTicketCount: 0,
    MaxFreeExchangeTicketCount: 0,
    MaxUserCount: 0,
    AutoSubmitWhenCreateGoods: true,
    AutoSubmitWhenCreateGoodsDesc: 1,
    AutoSubmitWhenCreateTicket: true,
    AutoSubmitWhenCreateTicketDesc: 1,
    CanExchangeTicketOnlyAfterSold: false,
    CanExchangeTicketOnlyAfterSoldDesc: 0,
    TaxNo: "",
    InvoiceTitle: "",
    InvoiceAddress: "",
    InvoiceContract: "",
    InvoiceTel: "",
    Brands: [],
    BrandsDesc: [],
  });
  PaidTime.value = ["", ""];
};

// 暴露方法
defineExpose({
  initForm
});
</script>

<style scoped>
::v-deep(.unit-top .el-dialog__body) {
  padding-top: 10px !important;
}
</style>