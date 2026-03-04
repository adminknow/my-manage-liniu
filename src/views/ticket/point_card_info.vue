<template>
  <div class="container">
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
      label-width="160px"
    >
      <el-row style="margin-top: 10px">
        <el-col class="send-local" :span="12">点卡信息</el-col>
        <el-col
          class="send-local"
          :span="12"
          v-if="formData.rechargeMethod == 0"
          >充值名单</el-col
        >
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <el-form-item label="主题" prop="billTitle" label-width="120px">
            <el-input
              style="width: 80%"
              :disabled="isView"
              v-model="formData.billTitle"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="点卡"
            prop="ticketTemplateId"
            label-width="120px"
          >
            <el-select
              v-model="formData.ticketTemplateId"
              clearable
              :disabled="isView"
              style="width: 80%"
              placeholder="企业点卡"
            >
              <el-option
                v-for="(item, index) in formData.ticketData"
                :key="index"
                :label="
                  item.TicketTemplateCode + '-' + item.TicketTemplateTitle
                "
                :value="item.TicketTemplateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="点卡号段"
            prop="ticketIndexScope"
            label-width="120px"
          >
            <el-input
              :disabled="isView"
              style="width: 80%"
              v-model="formData.ticketIndexScope"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="每人充值" prop="EveryoneAmt" label-width="120px">
            <el-input
              :disabled="isView"
              style="width: 80%"
              v-model="formData.EveryoneAmt"
            >
              <template #append>点</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总充值金额" prop="TotalAmt" label-width="120px">
            <el-input
              :disabled="isView"
              style="width: 80%"
              v-model="formData.TotalAmt"
            >
              <template #append>点</template>
            </el-input>
          </el-form-item>
          <el-form-item label="充值客户" prop="UnitId" label-width="120px">
            <el-select
              :disabled="isView"
              v-model="formData.UnitId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户名称"
              :remote-method="remoteMethod"
              remote-show-suffix
              style="width: 80%"
              clearable
            >
              <el-option
                v-for="(item, index) in formData.UnitData"
                :key="index"
                :label="item.UnitCode + '-' + item.UnitName"
                :value="item.UnitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="充值方式"
            prop="ticketTemplateId"
            label-width="120px"
          >
            <el-select
              v-model="formData.rechargeMethod"
              :disabled="isView"
              style="width: 80%"
              placeholder="请选择充值名单"
            >
              <el-option label="名单" value="0"></el-option>
              <el-option label="花名册" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="花名册"
            label-width="120px"
            v-if="formData.rechargeMethod == 1"
            prop="RosterId"
          >
            <el-select
              :disabled="isView"
              v-model="formData.RosterId"
              filterable
              placeholder="选择花名册"
              style="width: 80%"
              @change="handleRosterChange"
              clearable
            >
              <el-option
                v-for="(item, index) in formData.RosterData"
                :key="index"
                :label="item.RosterName"
                :value="item.RosterId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.rechargeMethod == 0">
          <roster-index
            @update-table-data="handleTableDataUpdate"
            :data="formData.TakeStaffs || []"
            :disabled="isView"
          ></roster-index>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          v-if="!isView"
          class="button1"
          :loading="loading"
          @click="handleSave"
          >保存
        </el-button>
        <el-button class="button2" @click="handleCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import rosterIndex from "@/components/pointCard/roster.vue";
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { SearchUnites, SearchRosters } from "@/api/index.js";
import { SearchTicketTemplates } from "@/api/ticket.js";

import { SaveTicketBillRecharge, GetTicketBillRecharge } from "@/api/bill.js";
import { useRouter, useRoute } from "vue-router";
import common from "@/utils/common.js";
const store = useStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const formRef = ref(null);
const billId = ref(route.query.id || null);
const type = ref(route.query.type || "add");
// 判断是否为查看模式
const isView = computed(() => type.value === "view");
// 添加一个标志来避免递归更新
const isUpdating = ref(false);
// 添加计算属性来管理二选一关系
// 修改计算属性定义
const hasCustomStaffs = computed(() => {
  if (isUpdating.value) return false;
  return Array.isArray(formData.TakeStaffs) && formData.TakeStaffs.length > 0;
});
// 表单数据
const formData = reactive({
  billId: "",
  UnitId: "",
  billTitle: "",
  ticketTemplateId: "",
  ticketIndexScope: "",
  SmsNotify: 0, //是否短信通知领取
  TotalAmt: 1, //总充值金额
  EveryoneAmt: 1, //每人充值金额
  rechargeMethod: "0", //1、花名册，0、名单
  EmailNotify: 0, //是否邮件通知领取
  UnitData: [],
  RosterId: "",
  RosterData: [],
  TakeStaffs: [],
  ticketData: [], //点卡
});

// 表单校验规则
const formRules = {
  billCode: [
    { required: true, message: "请输入点卡编码", trigger: "blur" },
    { max: 50, message: "编码长度不能超过50个字符", trigger: "blur" },
  ],
  ticketIndexScope: [
    { required: true, message: "请输入点卡号段", trigger: "blur" },
  ],
  billTitle: [
    { required: true, message: "请输入点卡标题", trigger: "blur" },
    { max: 100, message: "标题长度不能超过100个字符", trigger: "blur" },
  ],
  ticketTemplateId: [
    // 修正大小写以匹配表单绑定
    { required: true, message: "请选择点卡", trigger: "change" },
  ],
  EveryoneAmt: [
    { required: true, message: "请输入每人充值金额", trigger: "blur" },
    {
      pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/,
      message: "请输入有效的金额格式",
      trigger: "blur",
    },
  ],
  UnitId: [{ required: true, message: "请选择充值客户", trigger: "change" }],
  rechargeCount: [
    { required: true, message: "请输入充值数量", trigger: "blur" },
    { type: "number", min: 1, message: "充值数量必须大于0", trigger: "blur" },
  ],
  RosterId: [
    {
      validator: (rule, value, callback) => {
        if (formData.rechargeMethod === "1" && !value) {
          // 只在花名册模式下且没有选择花名册时报错
          const hasStaffs =
            Array.isArray(formData.TakeStaffs) &&
            formData.TakeStaffs.length > 0;
          if (!hasStaffs) {
            callback(new Error("请下拉选择花名册"));
            return;
          }
        }
        callback();
      },
      trigger: "change",
    },
  ],
};

// 获取点卡信息
const getPointCardInfo = async (id) => {
  if (!id) return;

  loading.value = true;
  try {
    const res = await GetTicketBillRecharge({ ObjectId: id });
    if (res.Code === 200 && res.DataMap) {
      const data = res.DataMap;
      // 确保 TakeStaffs 数据是数组格式
      const staffs = Array.isArray(data.TakeStaffs) ? data.TakeStaffs : [];
      // 先处理二选一关系
      let finalRosterId = "";
      let finalTakeStaffs = [];

      if (data.RosterId) {
        // 如果有预设名单，使用预设名单
        finalRosterId = data.RosterId;
        finalTakeStaffs = []; // 清空自定义名单
      } else if (staffs && staffs.length > 0) {
        // 如果有自定义名单，使用自定义名单
        finalRosterId = "";
        finalTakeStaffs = staffs;
      }
      Object.assign(formData, {
        billId: data.BillId,
        billCode: data.BillCode,
        billTitle: data.BillTitle,
        ticketTemplateId: data.TicketTemplateId,
        EveryoneAmt: (data.EveryoneAmt / 100).toFixed(2) || 1,
        TotalAmt: (data.TotalAmt / 100).toFixed(2) || 1,
        billStatus: data.BillStatus,
        TakeStaffs: finalTakeStaffs, // 使用处理后的值
        UnitId: data.UnitId, // 不需要转换类型
        RosterId: finalRosterId, // 使用处理后的值
        ticketIndexScope: data.TicketIndexScope,
      });
      // 如果有客户ID，获取客户详情以显示在下拉框中
      if (data.UnitId) {
        await fetchUnitDetails(data.UnitId);
      }
      //通过保存的名单数据 动态显示界面名单选择
      if (data.TakeStaffs.length > 0) {
        formData.rechargeMethod = "0"; // 设置为花名册
      } else {
        formData.rechargeMethod = "1"; // 设置为名单
      }
    } else {
      ElMessage.error(res.Message || "获取点卡信息失败");
      handleCancel();
    }
  } catch (error) {
    console.error("获取点卡信息出错:", error);
    ElMessage.error("系统异常，请稍后再试");
    handleCancel();
  } finally {
    loading.value = false;
  }
};

// 添加获取客户详情的方法
const fetchUnitDetails = async (unitId) => {
  try {
    const res = await SearchUnites({
      SearchCondition: {
        unit_id: unitId, // 通过ID精确查询
        get_liniu: 1,
        unit_type_filter: "31,32",
        only_my_create: 1,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });

    if (res.Code === 200 && res.DataMap?.Data?.length > 0) {
      // 将查询到的客户信息添加到UnitData中
      formData.UnitData = res.DataMap.Data;
    }
  } catch (error) {
    console.error("获取客户详情失败:", error);
  }
};

const searchLoading = ref(false);
const remoteMethod = async (queryString) => {
  if (queryString) {
    searchLoading.value = true;
    const res = await SearchUnites({
      SearchCondition: {
        search_keyword: queryString,
        get_liniu: 1,
        unit_type_filter: "32",
        only_my_create: 1,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    searchLoading.value = false;
    if (res.Code == 200) {
      formData.UnitData = res.DataMap.Data || [];
    } else {
      ElMessage.warning("获取客户下拉数据失败");
      formData.UnitData = [];
    }
  } else {
    formData.UnitData = [];
  }
};

// 修改 handleTableDataUpdate 函数，使用 nextTick 避免递归
const handleTableDataUpdate = async (data) => {
  if (isUpdating.value) return;

  isUpdating.value = true;

  try {
    await nextTick();

    // 如果添加了自定义名单，清空预设名单选择
    if (data && data.length > 0) {
      formData.RosterId = "";
    }

    // 将数据保存到父组件的状态中
    formData.TakeStaffs = Array.isArray(data) ? data : [];

    await nextTick();
  } finally {
    isUpdating.value = false;
  }
};
// 保存点卡信息
const handleSave = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请完善表单信息");
      return;
    }

    loading.value = true;
    try {
      const Bill = {
        BillId: formData.billId || "",
        BillTitle: formData.billTitle,
        TicketTemplateId: formData.ticketTemplateId,
        UnitId: formData.UnitId,
        TicketIndexScope: formData.ticketIndexScope,
        EveryoneAmt: parseFloat(formData.EveryoneAmt * 100),
        TotalAmt: parseFloat(formData.TotalAmt * 100),

        RechargeCount: formData.rechargeCount,
        // 根据二选一关系提交充值名单数据
        RosterId: formData.RosterId || "",
        TakeStaffs: formData.TakeStaffs || [],
        // 其他通知相关字段
        SmsNotify: formData.SmsNotify || 0,
        EmailNotify: formData.EmailNotify || 0,
      };
      const res = await SaveTicketBillRecharge({
        Bill: Bill,
      });
      if (res.Code === 200) {
        common.ClosePageTag("充值单详情");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "点卡充值单",
        });
        ElMessage.success("保存成功");
        handleCancel();
      } else {
        ElMessage.error(res.Message || "保存失败");
      }
    } catch (error) {
      console.error("保存点卡信息出错:", error);
      ElMessage.error("系统异常，请稍后再试");
    } finally {
      loading.value = false;
    }
  });
};

// 修改充值名单选择方法，同样使用防护
const handleRosterChange = async (value) => {
  if (isUpdating.value) return;

  isUpdating.value = true;

  try {
    await nextTick();

    if (value) {
      // 如果选择了预设名单，清空自定义名单
      formData.TakeStaffs = [];
    }

    await nextTick();
  } finally {
    isUpdating.value = false;
  }
};

const SearchRostersApi = async () => {
  let res = await SearchRosters({
    NoPage: true,
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
  });
  if (res.Code === 200) {
    formData.RosterData = res.DataMap.Data || [];
  } else {
    ElMessage.error(res.Message || "获取充值名单失败");
  }
};
const SearchTicketTemplatesApi = async () => {
  let res = await SearchTicketTemplates({
    SearchCondition: {
      ticket_template_type: "7",
    },
    NoPage: true,
    PageStartRow: 0,
    PageRowCount: 100000,
    NoPage: true,
  });
  if (res.Code === 200) {
    formData.ticketData = res.DataMap.Data || [];
  } else {
    ElMessage.error(res.Message || "获取充值名单失败");
  }
};

// 取消操作
const handleCancel = () => {
  common.ClosePageTag("点卡详情");
  store.commit("tags/setPageSaerch", {
    Search: 1,
    titlePage: "充值单",
  });
  setTimeout(() => {
    router.push({
      path: "/point_card",
    });
  }, 1000);
};

// 初始化
onMounted(async () => {
  // 先加载基础数据
  await Promise.all([SearchRostersApi(""), SearchTicketTemplatesApi("")]);
  // 编辑或查看模式，获取详情
  if (billId.value && (type.value === "edit" || type.value === "view")) {
    await getPointCardInfo(billId.value);
  }
});
</script>

<style scoped></style>
