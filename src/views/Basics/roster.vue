<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.roster_name"
                clearable
                placeholder="请输入名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                v-model="query.search.roster_type"
                clearable
                style="width: 100%"
                placeholder="请选择类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="员工花名册" value="1"></el-option>
                <el-option label="通用名单" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.staff_cell"
                clearable
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新建名单
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
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-select
                v-model="query.search.unit_id"
                clearable
                filterable
                style="width: 100%"
                placeholder="请选择关联客户"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.UnitId"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                v-model="query.search.roster_status"
                clearable
                style="width: 100%"
                placeholder="请选择状态"
              >
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1"> </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="tableLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column
        prop="RosterName"
        align="center"
        label="名称"
      ></el-table-column>
      <el-table-column align="center" label="名单类型" width="140">
        <template #default="scope">
          <p v-if="scope.row.RosterType == 1">员工花名册</p>
          <p v-if="scope.row.RosterType == 0">通用名单</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="其他" width="240">
        <template #default="scope">
          <p v-if="scope.row.RosterType == 1">
            初始会员等级：{{ scope.row.VipTypeName }}
          </p>
          <p v-if="scope.row.RosterType == 1">
            员工人数：{{ scope.row.PersonCount }}
          </p>
          <p v-if="scope.row.RosterType == 0">
            发放人数：{{ scope.row.PersonCount }}
          </p>
          <p v-if="scope.row.RosterType == 0">
            发放券数量：{{ scope.row.TicketCount }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="UnitName"
        label="关联客户"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center" width="90">
        <template #default="scope">
          <p v-if="scope.row.RosterStatus == 1">启用</p>
          <p v-if="scope.row.RosterStatus == 0">停用</p>
        </template></el-table-column
      >
      <el-table-column prop="" align="left" label="创建信息" width="200">
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
              v-if="scope.row.RosterStatus == 0"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.RosterId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.RosterStatus == 1"
              class="button-op-del"
              size="small"
              @click="DisableRosterBtn(scope.row.RosterId)"
              >停用
            </el-button>
            <el-button
              v-if="scope.row.RosterStatus == 0 && scope.row.RosterType == 0"
              class="button-op-edit"
              size="small"
              @click="EnableRosterBtn0(scope.row.RosterId)"
              >启用
            </el-button>
            <el-button
              v-if="scope.row.RosterStatus == 0 && scope.row.RosterType == 1"
              class="button-op-edit"
              size="small"
              @click="EnableRosterBtn1(scope.row.RosterId)"
              >启用
            </el-button>
            <el-button
              v-if="scope.row.RosterStatus == 0"
              class="button-op-edit"
              size="small"
              @click="FileModal(scope.row.RosterId)"
              >导入名单
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              @click="FileOutBtn(scope.row.RosterId)"
              >导出名单
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

    <!-- 编辑/新增花名册 -->
    <el-dialog
      title="名单操作"
      v-model="Visible"
      width="38%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
    <div style="width:100%;height: 18px;"></div>
      <el-form ref="formSubmit" :model="rosterFormModal" label-width="160px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称" label-width="120px">
              <el-input
                v-model="rosterFormModal.RosterName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="名单类型" label-width="120px">
              <el-select
                v-model="rosterFormModal.RosterType"
                clearable
                style="width: 100%"
                placeholder="请选择类型"
              >
                <el-option label="通用名单" value="0"></el-option>
                <el-option label="员工花名册" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="UnitId == ''">
          <el-col :span="20">
            <el-form-item label="客户" label-width="120px">
              <el-select
                v-model="rosterFormModal.UnitId"
                clearable
                filterable
                style="width: 100%"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.UnitId"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="rosterFormModal.RosterType == 1">
          <el-col :span="20">
            <el-form-item label="初始会员等级" label-width="120px">
              <el-select
                style="width: 100%"
                v-model="rosterFormModal.VipTypeId"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in vipList"
                  :key="item.VipTypeId"
                  :label="item.VipTypeName"
                  :value="item.VipTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="btnLoading" @click="saveBtnForm"
            >保 存</el-button
          >
          <el-button class="button2" @click="Visible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件导入弹出框 -->
    <el-dialog
      title="导入文件"
      v-model="fileVisible"
      width="38%"
      :show-close="false"
      :close-on-click-modal="false"
    >
    <div style="width:100%;height: 10px;"></div>
      <div class="file-detail" style="height: 100px">
        <el-upload
          v-model:file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          class="file-roster-uploader"
          action="#"
          :http-request="SuccessFile"
          :auto-upload="true"
        >
          <el-button class="button1" round>
            <el-icon>
              <DocumentAdd />
            </el-icon>
            &nbsp;&nbsp;上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              <el-link
                :underline="false"
                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/花名册名单.xlsx"
                style="color: #f56c6c"
              >
                下载模板</el-link
              >
            </div>
            <div class="el-upload__tip">支持上传excel文件</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="CennelFileModalBtn"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 启用弹框 -->
    <el-dialog
      title="审核操作"
      v-model="EnableVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div>
        如果员工手机号在别的员工花名册里存在时，是否停用别的员工花名册的员工？

        <el-form-item label="" label-width="0">
          <el-checkbox
            v-model="DisableWhenCellInOtherStaffRoster"
            label="是"
            size="large"
          />
        </el-form-item>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="EnableLoading"
            @click="saveEnableBtn"
            >确 定</el-button
          >
          <el-button class="button2" @click="EnableVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import {
  SearchRosters,
  SaveRoster,
  GetUnitList,
  EnableRoster,
  DisableRoster,
  GetRosterDetail,
  GetRoster,
} from "@/api/index.js";
import { Import } from "@/api/imgapi.js";
import { GetVipTypeList } from "@/api/vip.js";

import Cookie from "js-cookie";

const router = useRouter();
const query = reactive({
  search: {
    UnitId: "",
    roster_name: "",
    roster_type: "",
    roster_status: "",
    unit_id: "",
    create_unit_id: "",
    staff_cell: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchRosters({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach((row) => {
        row.GoodsDiscount = "";
        let UnitConfig = {};
        if (row.UnitConfig) {
          UnitConfig = JSON.parse(row.UnitConfig);
          row.GoodsDiscount = UnitConfig.GoodsDiscount + "%";
        }
      });
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }

    pageTotal.value = res.DataMap.ToalCount;
  }
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

const handleEdit = async (ID) => {
  let res = await GetRoster({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    rosterFormModal.RosterId = res.DataMap.RosterId;
    rosterFormModal.RosterName = res.DataMap.RosterName;
    rosterFormModal.RosterType = res.DataMap.RosterType.toString();
    rosterFormModal.VipTypeId =
      res.DataMap.VipTypeId == 0 ? "" : res.DataMap.VipTypeId;
    rosterFormModal.PersonCount = res.DataMap.PersonCount;
    rosterFormModal.TicketCount = res.DataMap.TicketCount;
    rosterFormModal.RosterConfig = res.DataMap.RosterConfig;
    rosterFormModal.UnitId = res.DataMap.UnitId;
    Visible.value = true;
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//新增花名册
const btnLoading = ref(false);
const vipList = ref([]);

const unitList = ref([]);
const UnitId = ref("");

const rosterFormModal = reactive({
  RosterId: "",
  RosterName: "",
  RosterType: "",
  VipTypeId: "",
  PersonCount: "",
  TicketCount: "",
  RosterConfig: "",
  RosterStatus: "",
  UnitId: "",
});
const Visible = ref(false);

const handleAdd = () => {
  if (UnitId.value == "") {
    //说明页面没有带参数
    rosterFormModal.UnitId = "";
  } else {
    rosterFormModal.UnitId = UnitId.value;
  }
  rosterFormModal.RosterType = "";
  rosterFormModal.RosterId = "";
  rosterFormModal.RosterName = "";
  rosterFormModal.VipTypeId = "";
  rosterFormModal.PersonCount = "";
  rosterFormModal.TicketCount = "";
  Visible.value = true;
};
const GetVipTypeListApi = async () => {
  let res = await GetVipTypeList({});
  if (res.Code == 200) {
    vipList.value = res.DataMap;
  }
};
const GetUnitListApi = async () => {
  let res = await GetUnitList({
    SearchCondition: {
      only_my_create: 1,
      unit_type_filter: "32",
    },
  });
  if (res.Code == 200) {
    unitList.value = res.DataMap;
  }
};

const saveBtnForm = async () => {
  if (rosterFormModal.RosterName == "") {
    ElMessage.error("请先输入名单名称");
    return;
  }
  if (rosterFormModal.UnitId == "") {
    ElMessage.error("请先选择客户");
    return;
  }
  if (rosterFormModal.RosterType == 1) {
    //花名册名单必须要选择会员类型
    if (rosterFormModal.VipTypeId == "") {
      ElMessage.error("请先选择会员等级");
      return;
    }
  }
  if (UnitId.value) {
    //别的页面带参数来的并且当前是新增
    rosterFormModal.UnitId = UnitId.value;
  }
  btnLoading.value = true;
  let res = await SaveRoster({ Roster: rosterFormModal, IsSubmit: false });
  btnLoading.value = false;
  if (res.Code == 200) {
    rosterFormModal.RosterId = "";
    rosterFormModal.RosterName = "";
    rosterFormModal.VipTypeId = "";
    rosterFormModal.PersonCount = "";
    rosterFormModal.TicketCount = "";
    ElMessage.success("操作成功！");
    Visible.value = false;
    handleSearch();
  } else {
    ElMessage.error(res.Message);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//文件导入
const RosterIdValue = ref("");
const FileModal = (ID) => {
  fileVisible.value = true;
  RosterIdValue.value = ID;
};
const fileVisible = ref(false);
const fileList = ref([]);
const fileParam = ref([]);
const handleExceed = async (files, fileList) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
};
const handleRemove = async (param) => {
  fileParam.value = {};
};
const SuccessFile = async (param) => {
  let fd = new FormData();
  fd.append("file", param.file); //传文件
  fd.append("DataType", "Roster"); //传数据
  fd.append("RosterId", RosterIdValue.value); //传数据
  let res = await Import(fd);
  if (res.Code == 200) {
    ElMessage.success("导入成功");
    fileVisible.value = false;
    fileList.value = [];
    getData();
  } else {
    ElMessage.warning(res.Message);
    fileList.value = [];
  }
};
const CennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};

const FileOutBtn = async (ID) => {
  let res = await GetRosterDetail({ ObjectId: ID });
  if (res.Code == 200) {
    if (res.DataMap.Details.length == 0) {
      ElMessage.warning("当前暂无名单");
      return;
    }
    let fileName = "";
    for (let i = 0; i < tableData.value.length; i++) {
      const row = tableData.value[i];
      if (row.RosterId == ID) {
        fileName = row.RosterName;
        break;
      }
    }
    var myDate = new Date();
    myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    var time =
      myDate.getFullYear() +
      "-" +
      (myDate.getMonth() + 1) +
      "-" +
      myDate.getDate();
    import("../../vendor/Export2Excel").then((excel) => {
      let tHeader = ["部门", "姓名", "手机", "邮箱", "张数", "备注"];
      let filterVal = [
        "StaffDept",
        "StaffName",
        "StaffCell",
        "StaffEmail",
        "TicketCount",
        "StaffRemark",
      ];
      if (res.DataMap.RosterType == 1) {
        //只有员工花名册的类型才能处理
        tHeader.push("是否处理");
        filterVal.push("isHandle");
        res.DataMap.Details.forEach((row) => {
          if (row.VipId) {
            row.isHandle = "是";
          } else {
            row.isHandle = "否";
          }
        });
      }
      const data = formatJson(filterVal, res.DataMap.Details);
      excel.export_json_to_excel({
        header: tHeader,
        data: data,
        filename: res.DataMap.UnitName + "-" + fileName + "的名单文件-" + time,
        autoWidth: true,
      });
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//启用
const EnableRosterBtn0 = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableRoster({
      RosterId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
//员工花名册启用
const EnableVisible = ref(false);
const DisableWhenCellInOtherStaffRoster = ref(false);
const EnableLoading = ref(false);
const EnableRosterBtn1 = (ID) => {
  EnableVisible.value = true;
  DisableWhenCellInOtherStaffRoster.value = false;
  RosterIdValue.value = ID;
};
const saveEnableBtn = async () => {
  EnableLoading.value = true;
  let res = await EnableRoster({
    RosterId: RosterIdValue.value,
    DisableWhenCellInOtherStaffRoster: DisableWhenCellInOtherStaffRoster.value,
  });
  EnableLoading.value = false;
  if (res.Code == 200) {
    handleSearch();
    EnableVisible.value = false;
    ElMessage.success("操作成功");
  } else {
    ElMessage.warning(res.Message);
  }
};

//停用
const DisableRosterBtn = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DisableRoster({
        RosterId: ID,
      });
      if (res.Code == 200) {
        handleSearch();
        ElMessage.success("操作成功");
      } else {
        ElMessage.warning(res.Message);
      }
    })
    .catch(() => {});
};

const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};
const init = () => {
  if (
    router.currentRoute.value.query.ID &&
    router.currentRoute.value.query.Type
  ) {
    //从我的客户跳转过来戴上了
    UnitId.value = Number(router.currentRoute.value.query.ID);
    query.search.roster_type = router.currentRoute.value.query.Type;
    query.search.unit_id = Number(router.currentRoute.value.query.ID);
  } else {
    UnitId.value = "";
    query.search.roster_type = "";
    query.search.unit_id = "";
  }
  getData();
  GetUnitListApi();
  GetVipTypeListApi();
};
////////////////////////////////////////////////////////////////////////////////////////////////////
init();
watch(
  () => router.currentRoute.value,
  (data) => {

  }
);
</script>

<style scoped></style>
<style>
.file-roster-uploader {
  width: 150px;
  height: 40px;
}

.file-roster-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.file-roster-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
