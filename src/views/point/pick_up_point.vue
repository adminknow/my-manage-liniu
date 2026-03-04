<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入编码/名称/城市/地址/联系人"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="12" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleQr(0)"
                >门店绑定小程序码
              </el-button>
              <el-button class="button2 button-float" round @click="handleQr(1)"
                >门店登录小程序码
              </el-button>
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增提货点
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column
        prop="UnitCode"
        align="center"
        label="编码"
        width="100"
      ></el-table-column>
      <el-table-column prop="UnitName" align="center" label="名称">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.UnitId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.UnitName }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column align="left" label="城市" width="300">
        <template #default="scope">
          <p>{{ scope.row.UnitCityName }}</p>
          <p>{{ scope.row.UnitAddress }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="" align="left" label="联系方式" width="180">
        <template #default="scope">
          <p v-if="scope.row.UnitContact">{{ scope.row.UnitContact }}</p>
          <p v-if="scope.row.UnitTel">{{ scope.row.UnitTel }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="UnitStatusDesc"
        label="状态"
        align="center"
        width="90"
      ></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="250">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="loginUser.UnitId == scope.row.CreateUnitId"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.UnitId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="
                scope.row.UnitStatus == 1 &&
                loginUser.UnitId == scope.row.CreateUnitId
              "
              class="button-op-del"
              size="small"
              @click="handleDel(scope.row.UnitId)"
              >停用
            </el-button>
            <el-button
              v-if="
                scope.row.UnitStatus == 0 &&
                loginUser.UnitId == scope.row.CreateUnitId
              "
              class="button-op-enable"
              size="small"
              @click="handleEnable(scope.row.UnitId)"
              >启用
            </el-button>
            <el-button
              v-if="loginUser.UnitId == scope.row.CreateUnitId"
              class="button-op-enable"
              size="small"
              @click="handleBind(scope.row.UnitId, scope.$index)"
              >可提货的券
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <!-- 编辑信息弹出框 -->
    <el-dialog
      title="操作"
      v-model="formeEitVisible"
      width="38%"
      :show-close="false"
    >
    <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="22">
          <el-form
            ref="formSubmit"
            :model="form_modal"
            :rules="rules_modal"
            label-width="120px"
          >
            <el-form-item prop="UnitCode" label="编码">
              <el-input
                v-model="form_modal.UnitCode"
                placeholder="请输入编码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="UnitName" label="名称">
              <el-input
                v-model="form_modal.UnitName"
                placeholder="请输入提货点"
              ></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="UnitLatitude">
              <el-input
                v-model="form_modal.UnitLatitude"
                style="width: 60%"
                placeholder="请输入纬度"
              ></el-input>
            </el-form-item>
            <el-form-item label="经度" prop="UnitLongitude">
              <el-input
                v-model="form_modal.UnitLongitude"
                style="width: 60%"
                placeholder="请输入经度"
              ></el-input>
              <el-link
                style="color: #f56c6c"
                href="https://lbs.qq.com/getPoint/"
                :underline="false"
                target="_blank"
                >&nbsp;&nbsp;&nbsp;腾讯位置服务</el-link
              >
            </el-form-item>
            <el-form-item label="城市">
              <el-row>
                <el-col :span="7">
                  <el-select
                    v-model="form_modal.ProvinceAreaId"
                    filterable
                    clearable
                    style="width: 100%"
                    placeholder="请选择"
                    @change="changeProvinces($event)"
                  >
                    <el-option
                      v-for="item in Provinces"
                      :key="item.AreaName"
                      :label="item.AreaName"
                      :value="item.AreaId"
                    />
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-select
                    v-model="form_modal.CityAreaId"
                    filterable
                    clearable
                    style="width: 100%"
                    placeholder="请选择"
                    @change="changeCitys($event)"
                  >
                    <el-option
                      v-for="item in Citys"
                      :key="item.AreaName"
                      :label="item.AreaName"
                      :value="item.AreaId"
                    />
                  </el-select>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-select
                    v-model="form_modal.UnitCityId"
                    filterable
                    clearable
                    style="width: 100%"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in Districts"
                      :key="item.AreaName"
                      :label="item.AreaName"
                      :value="item.AreaId"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="地址" prop="UnitAddress">
              <el-input
                maxlength="100"
                :rows="4"
                show-word-limit
                type="textarea"
                placeholder="请输入地址"
                v-model="form_modal.UnitAddress"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="UnitContact">
              <el-input
                v-model="form_modal.UnitContact"
                placeholder="请输入联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="UnitTel">
              <el-input
                v-model="form_modal.UnitTel"
                placeholder="请输入电话"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            v-if="form_modal.viewType == 'Edit'"
            :loading="btnLoading"
            @click="saveBtnForm"
            >保 存</el-button
          >
          <el-button class="button2" @click="formeEitVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 可提货的券 -->
    <el-dialog
      class="pick_up"
      :title="titleModal"
      v-model="tickeyVisible"
      width="68%"
      :show-close="false"
    >
        <div style="width:100%;height: 18px;"></div>
      <div class="handle-box">
        <el-form label-width="1px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="">
                <el-input
                  v-model="queryModal.search.search_keyword"
                  clearable
                  placeholder="请输入关键字"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10"> </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="6" :offset="1">
              <div class="button-mgl">
                <el-button
                  class="button1 button-float"
                  round
                  @click="handleSearchModal()"
                >
                  <el-icon> <Search /> </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        height="400"
        :data="tableDataModal"
        border
        class="table"
        v-loading="tableLoadingModal"
        ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
      >
        <el-table-column align="center" label="类型" width="130">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplateTypeDesc2 }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="券批次号" width="130">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplateCode }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="券名称">
          <template #default="scope">
            <p>{{ scope.row.TicketTemplateTitle }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格(元)" width="100">
          <template #default="scope">
            <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可提货时间">
          <template #default="scope">
            <p>
              {{ scope.row.PickupBeginDate + " - " + scope.row.PickupEndDate }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="->,total, sizes, prev, pager, next"
          v-model:currentPage="queryModal.PageStartRow"
          v-model:page-size="queryModal.PageRowCount"
          :page-sizes="[15, 50, 100]"
          :total="pageTotalModal"
          @current-change="handlePageChangeModal"
          @size-change="handleSizeChangeModal"
        ></el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="tickeyVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 小程序门店二维码 -->
    <QrCodeModal
      :QrCodeVisible="showModal"
      :QrCodeUrl="QrCodeValue"
      :QrTitle="QrTitle"
      @CloseVisible="CloseVisible"
    ></QrCodeModal>
  </div>
</template>

<script setup>
import QrCodeModal from "@/components/Modal/QRCode.vue";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  SearchUnites,
  GetUnit,
  SaveUnit,
  DisableUnit,
  EnableUnit,
  DisableUser,
  GetUnitWxxcxQRCode,
} from "../../api/index.js";
import { SearchTicketTemplates } from "../../api/ticket.js";
import { GetProvinceList, GetCityList, GetDistrictList } from "@/api/common.js";
import Cookie from "js-cookie";
const query = reactive({
  search: {
    filter: "",
    unit_type: "33",
    search_keyword: "",
    unit_status: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);

const tableData = ref([]);
const pageTotal = ref(0);
const formeEitVisible = ref(false);
const btnLoading = ref(false);

//初始化表格
const formSubmit = ref(null);
const form_modal = reactive({
  UnitId: "",
  UnitType: "33",
  UnitCode: "",
  UnitName: "",
  UnitCityId: "",
  CityAreaId: "",
  ProvinceAreaId: "",
  UnitAddress: "",
  UnitContact: "",
  UnitTel: "",
  UnitLongitude: "", //经度
  UnitLatitude: "", //纬度
  viewType: "",
});
const rules_modal = {
  UnitCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
  UnitName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  UnitAddress: [{ required: true, message: "请输入地址", trigger: "blur" }],
  UnitContact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  UnitTel: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  UnitLongitude: [{ required: true, message: "请输入经度", trigger: "blur" }],
  UnitLatitude: [{ required: true, message: "请输入纬度", trigger: "blur" }],
};
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchUnites({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }
    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
const GetUnitById = async (ID) => {
  let res = await GetUnit({ ObjectId: ID });
  if (res.Code == 200) {
    form_modal.UnitId = res.DataMap.UnitId;
    form_modal.UnitCode = res.DataMap.UnitCode;
    form_modal.UnitName = res.DataMap.UnitName;
    form_modal.UnitAddress = res.DataMap.UnitAddress;
    form_modal.UnitContact = res.DataMap.UnitContact;
    form_modal.UnitTel = res.DataMap.UnitTel;
    form_modal.UnitLongitude = res.DataMap.UnitLongitude;
    form_modal.UnitLatitude = res.DataMap.UnitLatitude;
    form_modal.UnitCityId = "";
    let strValue = res.DataMap.UnitCityName.split("/");
    Provinces.value.forEach((row) => {
      if (row.AreaName == strValue[0]) {
        form_modal.ProvinceAreaId = row.AreaId;
        GetCityLists(row.AreaId, row.AreaName);
      }
    });
    setTimeout(() => {
      Citys.value.forEach((row) => {
        if (row.AreaName == strValue[1]) {
          form_modal.CityAreaId = row.AreaId;
          GetDistrictLists(row.AreaId, row.AreaName);
        }
      });
    }, 1000);
    setTimeout(() => {
      form_modal.UnitCityId = res.DataMap.UnitCityId;
    }, 1400);
  }
};

const saveBtnForm = async () => {
  formSubmit.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      let res = await SaveUnit({
        AddUser: false,
        Unit: form_modal,
        IsSubmit: true,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        formSubmit.value.resetFields();
        ElMessage.success("保存成功");
        formeEitVisible.value = false;
        query.PageStartRow = 1;
        getData();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};

const handleEdit = (ID, type) => {
  form_modal.viewType = type;
  formeEitVisible.value = true;
  GetUnitById(ID);
};

//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableUnit({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      query.PageStartRow = 1;
      getData();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//停用
const handleDel = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DisableUnit({
        ObjectId: ID,
      });
      if (res.Code == 200) {
        query.PageStartRow = 1;
        getData();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => {});
};

//新增任务
const handleAdd = () => {
  formeEitVisible.value = true;
  form_modal.viewType = "Edit";
  form_modal.UnitId = "";
  form_modal.UnitCode = "";
  form_modal.UnitName = "";
  form_modal.UnitAddress = "";
  form_modal.UnitContact = "";
  form_modal.UnitTel = "";
  form_modal.UnitLongitude = "";
  form_modal.UnitLatitude = "";
  form_modal.UnitCityId = "";
  form_modal.CityAreaId = "";
  form_modal.ProvinceAreaId = "";
};
//展示二维码
const showModal = ref(false);
const QrCodeValue = ref(false);
const QrTitle = ref("");
const handleQr = async (QRCodeType) => {
  let res = await GetUnitWxxcxQRCode({
    UnitId: loginUser.UnitId,
    Appid: "",
    QRCodeType: QRCodeType,
  });
  if (res.Code == 200) {
    if (QRCodeType == 0) {
      QrTitle.value = "门店绑定小程序码";
    } else {
      QrTitle.value = "门店登录小程序码";
    }
    showModal.value = true;
    QrCodeValue.value = res.DataMap;
  }
};
const CloseVisible = async (BooleanValue) => {
  showModal.value = BooleanValue;
};
//省市区数据
const Provinces = ref([]);
const Citys = ref([]);
const Districts = ref([]);

const GetProvinceLists = async () => {
  let res = await GetProvinceList({});
  if (res.Code == 200) {
    Provinces.value = res.DataMap;
  }
};
GetProvinceLists();
//选中省份
const changeProvinces = (key) => {
  form_modal.CityAreaId = "";
  Provinces.value.forEach((row) => {
    if (key == row.AreaId) {
      GetCityLists(row.AreaId, row.AreaName);
    }
  });
};
const GetCityLists = async (AreaId, AreaName) => {
  let res = await GetCityList({
    ProvinceAreaId: AreaId,
    ProvinceName: AreaName,
  });
  if (res.Code == 200) {
    Citys.value = res.DataMap;
  }
};
//选中城市
const changeCitys = (key) => {
  form_modal.UnitCityId = "";
  Citys.value.forEach((row) => {
    if (key == row.AreaId) {
      GetDistrictLists(row.AreaId, row.AreaName);
    }
  });
};
const GetDistrictLists = async (AreaId, CityName) => {
  let res = await GetDistrictList({
    CityAreaId: AreaId,
    CityName: CityName,
  });
  if (res.Code == 200) {
    Districts.value = res.DataMap;
  }
};

//绑定的券
const tickeyVisible = ref(false);
const tableLoadingModal = ref(false);
const tableDataModal = ref([]);
const pageTotalModal = ref(0);
const queryModal = reactive({
  search: {
    search_keyword: "",
    create_unit_id: "",
    express_template_id: "",
    not_get_stat_data: 1,
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const getDataModal = async () => {
  tableLoadingModal.value = true;
  let res = await SearchTicketTemplates({
    PageStartRow: (queryModal.PageStartRow - 1) * queryModal.PageRowCount,
    PageRowCount: queryModal.PageRowCount,
    SearchCondition: queryModal.search,
  });
  tableLoadingModal.value = false;
  if (res.Code == 200) {
    tableDataModal.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotalModal.value = res.DataMap.ToalCount;
  }
};
const handleSearchModal = () => {
  queryModal.PageStartRow = 1;
  getDataModal();
};

const titleModal = ref("");
////////////////////////////////////////////////////////////////
const handleBind = (ID, Index) => {
  queryModal.search.search_keyword = "";
  queryModal.search.create_unit_id = ID;
  queryModal.search.pickup_unit_id = ID;
  titleModal.value = tableData.value[Index].UnitName + " - 可提货的券";
  getDataModal();
  tickeyVisible.value = true;
};
// 分页导航
const handlePageChangeModal = (val) => {
  queryModal.PageStartRow = val;
  getDataModal();
};
const handleSizeChangeModal = (val) => {
  queryModal.PageRowCount = val;
  getDagetDataModalta();
};
</script>

<style>
.pick_up .el-dialog__body {
  padding-top: 10px !important;
}
</style>
