<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <!-- 搜索关键词 -->
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入名称/编码/手机"></el-input>
            </el-form-item>
          </el-col>
          <!-- 状态筛选 -->
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select v-model="query.search.unit_status" clearable style="width: 100%" placeholder="状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="正常" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="1"></el-col>
          <!-- 操作按钮 -->
          <el-col :span="8" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleOut()">
                导出数据
              </el-button>
              <el-button class="button2 button-float" round @click="handleAdd()">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;新建券商
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <!-- 选择列 -->
      <el-table-column type="selection" align="center" width="40" />
      <!-- ID列 -->
      <el-table-column prop="UnitId" align="center" label="ID" width="50"></el-table-column>
      <!-- 编码列 -->
      <el-table-column prop="UnitCode" align="center" label="编码" width="150"></el-table-column>
      <!-- 名称列 -->
      <el-table-column prop="UnitName" align="center" label="名称" width="220">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.UnitId, 'View')" style="color: #f56c6c">
            {{ scope.row.UnitName }}</el-link>
        </template>
      </el-table-column>
      <!-- 联系人信息列 -->
      <el-table-column align="left" label="联系人信息" width="180">
        <template #default="scope">
          <p>{{ scope.row.UnitContact }}</p>
          <p>{{ scope.row.UnitTel }}</p>
          <p v-if="scope.row.CustomerServiceTel">
            {{ "客服：" + scope.row.CustomerServiceTel }}
          </p>
          <p>缺省登陆帐号:{{ scope.row.DefaultUserAccount }}</p>
        </template>
      </el-table-column>
      <!-- 配置信息列 -->
      <el-table-column align="left" label="配置信息">
        <template #default="scope">
          <div v-if="scope.row.UnitConfig">
            <div v-if="scope.row.PaidBeginDate">
              <p>
                从{{ scope.row.PaidBeginDate }}到{{ scope.row.PaidEndDate }}额度期内
              </p>
              <p v-if="scope.row.MaxCreateTicketCount !== 0">
                {{ "最多可创建" + scope.row.MaxCreateTicketCount + "张券" }}
              </p>
              <p v-if="scope.row.MaxFreeExchangeTicketCount !== 0">
                {{ "最多可免费兑换" + scope.row.MaxFreeExchangeTicketCount + "张券" }}
              </p>
              <p v-if="scope.row.MaxUserCount !== 0">
                {{ "最多可创建" + scope.row.MaxUserCount + "个用户" }}
              </p>
            </div>
            <div v-else>
              <p v-if="scope.row.MaxCreateTicketCount !== 0">
                {{ "本年度最多可创建" + scope.row.MaxCreateTicketCount + "张券" }}
              </p>
              <p v-if="scope.row.MaxFreeExchangeTicketCount !== 0">
                {{ "本年度最多可免费兑换" + scope.row.MaxFreeExchangeTicketCount + "张券" }}
              </p>
              <p v-if="scope.row.MaxUserCount !== 0">
                {{ "最多可创建" + scope.row.MaxUserCount + "个用户" }}
              </p>
            </div>

            <p v-if="scope.row.AutoSubmitWhenCreateGoodsDesc !== '自动'">
              创建商品后需要人工审批
            </p>
            <p v-if="scope.row.AutoSubmitWhenCreateTicketDesc !== '自动'">
              创建券后需要人工审批
            </p>
          </div>
        </template>
      </el-table-column>
      <!-- 有效期列 -->
      <el-table-column label="有效期至" align="center" width="120">
        <template #default="scope">
          <div v-if="isExpiringSoon(scope.row.ValidDate)">
            <span style="color: #f56c6c">{{ scope.row.ValidDate }}</span>
          </div>
          <div v-else>{{ scope.row.ValidDate }}</div>
        </template>
      </el-table-column>
      <!-- 状态列 -->
      <el-table-column prop="UnitStatusDesc" label="客户状态" align="center" width="90"></el-table-column>
      <!-- 创建信息列 -->
      <el-table-column align="left" label="创建信息">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <!-- 编辑按钮 -->
            <el-button v-if="loginUser.UnitId === scope.row.CreateUnitId" class="button-op-edit" size="small"
              @click="handleEdit(scope.row.UnitId, 'Edit')">
              编辑
            </el-button>
            <!-- 停用按钮 -->
            <el-button v-if="scope.row.UnitStatus === 1 && loginUser.UnitId === scope.row.CreateUnitId"
              class="button-op-del" size="small" @click="handleDel(scope.row.UnitId)">
              停用
            </el-button>
            <!-- 启用按钮 -->
            <el-button v-if="scope.row.UnitStatus === 0 && loginUser.UnitId === scope.row.CreateUnitId"
              class="button-op-del" size="small" @click="handleEnable(scope.row.UnitId)">
              启用
            </el-button>
            <!-- 重置密码按钮 -->
            <el-button class="button-op-edit" size="small" v-if="IsRight && loginUser.UnitId === scope.row.CreateUnitId"
              @click="handleResetPws(scope.row.UnitId)">
              重置密码
            </el-button>
            <!-- 配置信息按钮 -->
            <el-button class="button-op-edit" size="small" @click="handleConfig(scope.row.UnitId)">
              配置信息
            </el-button>
            <!-- 券商二维码按钮 -->
            <el-button class="button-op-edit" size="small" @click="QrCodeClick(scope.row.UnitId)">
              券商二维码
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>

    <!-- 重置密码弹出框 -->
    <el-dialog title="重置密码" v-model="editVisible" width="38%" :show-close="false">
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password" type="password" show-password></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="onSaveModal">保 存</el-button>
          <el-button class="button2" @click="editVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑信息弹出框 -->
    <EditModal :visible="formeEitVisible" :unit-id="currentUnitId" :type="currentType" :unit-data="currentUnitData"
      :BrandList="BrandList" @close="formeEitVisible = false" @save="handleEditSave" />

    <!-- 配置信息弹出框 -->
    <ConfigModal :visible="ConfigVisible" :unit-id="currentConfigUnitId" :config-data="currentConfigData"
      :AllAccountList="AllAccountList" :loginUser="loginUser" @close="ConfigVisible = false" @save="handleConfigSave" />

    <!-- 二维码弹出框 -->
    <QrCodeModal :visible="QrCodeVisible" :title="QrCodeTitle" :qr-code-url="QrCodeImg"
      @close="QrCodeVisible = false" />
  </div>
</template>

<script setup>
/**
 * 券商管理列表页面
 * 功能：显示券商列表，支持搜索、筛选、分页，以及编辑、停用、启用、重置密码、配置信息、查看二维码等操作
 */

// 导入依赖
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import EditModal from "@/components/IssueUnit/EditModal.vue";
import ConfigModal from "@/components/IssueUnit/ConfigModal.vue";
import QrCodeModal from "@/components/IssueUnit/QrCodeModal.vue";
import { useIssueUnit } from "@/composables/useIssueUnit.js";
import common from "@/utils/common.js";

// 使用券商管理组合式函数
const {
  tableLoading,
  tableData,
  pageTotal,
  IsRight,
  BrandList,
  AllAccountList,
  loginUser,
  query,
  getData,
  GetUnitById,
  handleEnable,
  handleDel,
  getUnitConfigs,
  getQrCode,
  resetPassword,
  handleOut,
  handlePageChange,
  handleSizeChange,
  handleSearch,
  init
} = useIssueUnit();

// 弹窗状态
const editVisible = ref(false);
const formeEitVisible = ref(false);
const ConfigVisible = ref(false);
const QrCodeVisible = ref(false);

// 当前操作数据
const currentUnitId = ref(0);
const currentType = ref("");
const currentUnitData = ref({});
const currentConfigUnitId = ref(0);
const currentConfigData = ref({});
const currentResetUnitId = ref("");

// 二维码数据
const QrCodeTitle = ref("");
const QrCodeImg = ref("");

// 密码重置表单
const formRef = ref(null);
const form = reactive({
  password: "",
});
const rules = {
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

/**
 * 处理编辑操作
 * @param {string} ID - 券商ID
 * @param {string} type - 操作类型 (Edit/View)
 */
const handleEdit = async (ID, type) => {
  currentUnitId.value = ID;
  currentType.value = type;

  if (ID) {
    const unitData = await GetUnitById(ID);
    currentUnitData.value = unitData;
  } else {
    currentUnitData.value = {};
  }

  formeEitVisible.value = true;
};

/**
 * 处理编辑保存
 */
const handleEditSave = () => {
  // 编辑保存后重新获取数据
  getData();
};

/**
 * 处理配置操作
 * @param {string} ID - 券商ID
 */
const handleConfig = async (ID) => {
  currentConfigUnitId.value = ID;
  const configData = await getUnitConfigs(ID);
  currentConfigData.value = configData;
  ConfigVisible.value = true;
};

/**
 * 处理配置保存
 */
const handleConfigSave = () => {
  // 配置保存后重新获取数据
  getData();
};

/**
 * 处理二维码操作
 * @param {string} unitId - 券商ID
 */
const QrCodeClick = async (unitId) => {
  // 获取券商名称
  const unitInfo = tableData.value.find(item => item.UnitId === unitId);
  if (unitInfo) {
    QrCodeTitle.value = unitInfo.UnitName;
  }

  // 获取二维码
  const result = await getQrCode(unitId);
  if (result.success) {
    QrCodeImg.value = result.url;
    QrCodeVisible.value = true;
  }
};

/**
 * 处理新增操作
 */
const handleAdd = () => {
  handleEdit(0, "Edit");
};

/**
 * 处理重置密码
 * @param {string} ID - 券商ID
 */
const handleResetPws = (ID) => {
  currentResetUnitId.value = ID;
  editVisible.value = true;
};

/**
 * 保存密码重置
 */
const onSaveModal = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      const success = await resetPassword(currentResetUnitId.value, form.password);
      if (success) {
        editVisible.value = false;
        // 重置表单
        form.password = "";
      }
    }
  });
};



/**
 * 检查券商是否即将过期
 * @param {string} validDate - 有效期
 * @returns {boolean} 是否即将过期
 */
const isExpiringSoon = (validDate) => {
  return common.getDifferDate(common.getNowDate(), validDate, 1) < 10;
};

// 初始化
onMounted(async () => {
  //加上 await 是为了告诉程序：“这里有一个耗时的后台初始化任务，请等待
  //它完成后（Promise resolve）再认为这个步骤结束。”
  await init();
});
</script>

<style scoped>
.el-tag {
  border: solid 1px #f56c6c;
  color: #f56c6c;
  background-color: white;
}

.button-mgl {
  margin-left: 20px;
}

.button-float {
  margin-right: 10px;
}

.button-op-edit {
  margin-right: 5px;
}

.button-op-del {
  margin-right: 5px;
}

.table {
  margin-top: 20px;
}

.table-header {
  background-color: #f5f7fa;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  text-align: center;
}

.button1 {
  background-color: #f56c6c;
  border-color: #f56c6c;
  color: white;
}


</style>

<style>
.el-tag .el-tag__close {
  color: #f56c6c !important;
}

.el-tag .el-tag__close:hover {
  background-color: #f56c6c;
  color: white !important;
}

.kf1-uploader {
  width: 100px;
  height: 100px;
  line-height: 100px !important;
}

.kf1-uploader-avatar {
  width: 100%;
}
</style>
