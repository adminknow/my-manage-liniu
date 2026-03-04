<template>
  <div class="container">
    <div class="handle-box" style="padding: 12px 0 12px">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.scene_name"
                clearable
                placeholder="请输入名称"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.scene_status"
                placeholder="单据状态"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option label="停用" value="0"> </el-option>
                <el-option label="启用" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增场景码
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
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
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
      style="width: 100%"
    >
      <el-table-column align="center" label="小程序码" width="120">
        <template #default="scope">
          <el-link
            v-if="scope.row.SceneType == 'wxxcx.url.scheme'"
            :underline="false"
            @click="copyToClipboard(scope.row.QrcodeUrl)"
            style="color: #f56c6c"
          >
            {{ scope.row.QrcodeUrl }}</el-link
          >
          <img
            v-else
            :src="scope.row.QrcodeUrl"
            @click="showQrModal(scope.row.QrcodeUrl)"
            style="width: 100%"
          />
        </template>
      </el-table-column>
      <el-table-column prop="SceneName" align="center" label="名称" width="160">
      </el-table-column>
      <el-table-column prop="SceneId" align="center" label="ID">
      </el-table-column>
      <el-table-column
        prop="AccountName"
        align="center"
        label="小程序"
        width="140"
      >
      </el-table-column>
      <el-table-column align="center" label="地址">
        <template #default="scope">
          <p>{{ scope.row.SceneUrl + "?" + scope.row.SceneParams }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template #default="scope">
          <p v-if="scope.row.SceneStatus == 0">停用</p>
          <p v-if="scope.row.SceneStatus == 1">正常</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建信息" width="160">
        <template #default="scope">
          <p>{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateUnitName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="
                scope.row.SceneStatus == 1 &&
                scope.row.CreateUnitId == loginUser.UnitId
              "
              class="button-op-del"
              size="small"
              @click="DisableClick(scope.row.SceneId)"
              >停用
            </el-button>
            <el-button
              v-if="
                scope.row.SceneStatus == 0 &&
                scope.row.CreateUnitId == loginUser.UnitId
              "
              class="button-op-enable"
              size="small"
              @click="EnableClick(scope.row.SceneId)"
              >启用
            </el-button>
            <el-button
              v-if="scope.row.SceneType != 'wxxcx.url.scheme'"
              class="button-op-enable"
              size="small"
              @click="showQrModal(scope.row.QrcodeUrl)"
              >小程序码
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

    <!-- 新增/编辑场景码 -->
    <el-dialog
      title="操作场景码"
      v-model="Visible"
      width="38%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称" prop="SceneName">
              <el-input v-model="form.SceneName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="活动ID" prop="ActId">
              <el-input v-model="form.ActId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="子活动ID">
              <el-input v-model="form.SubActId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="小程序appid" prop="WxxcxAppid">
              <el-select
                v-model="form.WxxcxAppid"
                style="width: 100%"
                placeholder="小程序APPID"
              >
                <el-option
                  v-for="item in WxxcxAccountList"
                  :key="item.AppId"
                  :label="item.AppName"
                  :value="item.AppId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="小程序码">
              <el-select
                v-model="form.SceneType"
                style="width: 100%"
                placeholder=""
              >
                <el-option label="小程序码" value="0" />
                <el-option
                  v-if="loginUser.UnitName == '礼牛网'"
                  label="小程序二维码"
                  value="1"
                />
                <el-option label="短信链接" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="小程序页面路径" prop="WxxcxPagePath">
              <el-input v-model="form.WxxcxPagePath"></el-input>
              <p style="height: 10px; color: #909399">/pages/activity/index</p>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="小程序页面参数">
              <el-input
                :rows="2"
                type="textarea"
                maxlength="200"
                show-word-limit
                v-model="form.WxxcxPageParams"
              ></el-input>
              <p
                style="
                  height: 20px;
                  color: #909399;
                  width: 100%;
                  font-size: 12px;
                "
              >
                PageId={活动页面ID}&scenevalue={场景值}&UnitId={券商ID}
              </p>
              <p style="height: 12px; color: #909399; font-size: 12px">
                scenevalue为场景值
              </p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" :loading="BtnLoading" @click="onSubmit"
            >确 认</el-button
          >
          <el-button class="button2" @click="Visible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看小程序码 -->
    <QrCodeModal
      :QrCodeVisible="showModal"
      :QrCodeUrl="QrCodeValue"
      :QrTitle="'小程序码'"
      @CloseVisible="CloseVisible"
    ></QrCodeModal>
  </div>
</template>

<script setup>
import QrCodeModal from "@/components/Modal/QRCode.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import {
  SearchActScenes,
  GetAllAccount,
  CreateActScene,
  EnableActScene,
  DisableActScene,
} from "@/api/wxxcx.js";

////////////////////////////////////////////////////////////////////////////////////////////////
const loginUser = JSON.parse(Cookie.get("User"));
const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    scene_name: "",
    obj_type: "",
    account_id: "",
    create_unit_id: "",
    scene_status: "",
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

  let res = await SearchActScenes({
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
/////////////////////////////////////////////////////////////////////////////////

//新增场景码
const Visible = ref(false);
const handleAdd = () => {
  Visible.value = true;
};
const EnableClick = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableActScene({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
const DisableClick = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableActScene({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      handleSearch();
      ElMessage.success("操作成功");
    } else {
      ElMessage.warning(res.Message);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////
const showModal = ref(false);
const QrCodeValue = ref(false);
//查看小程序二维码
const showQrModal = async (QrcodeUrl) => {
  showModal.value = true;
  QrCodeValue.value = QrcodeUrl;
};
const CloseVisible = async (BooleanValue) => {
  showModal.value = BooleanValue;
};
/////////////////////////////////////////////////////////////////////////////////
//保存场景码
const BtnLoading = ref(false);
const formRef = ref(null);
const WxxcxAccountList = ref([]);

let form = reactive({
  ActId: "",
  SubActId: "",
  SceneName: "",
  SceneType: "0",
  WxxcxAppid: "",
  WxxcxPagePath: "",
  WxxcxPageParams: "",
});
const rules = {
  ActId: [{ required: true, message: "请输入活动ID", trigger: "blur" }],
  SceneName: [{ required: true, message: "请输入场景码名称", trigger: "blur" }],
  WxxcxAppid: [
    { required: true, message: "请输入小程序appid", trigger: "blur" },
  ],
  WxxcxPagePath: [{ required: true, message: "", trigger: "blur" }],
  WxxcxPageParams: [{ required: true, message: "", trigger: "blur" }],
};

const GetAllAccountApi = async () => {
  //获取下拉小程序ID
  let res = await GetAllAccount({});
  if (res.Code == 200) {
    WxxcxAccountList.value = res.DataMap;
  }
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      BtnLoading.value = true;
      let res = await CreateActScene({
        ActId: form.ActId,
        SubActId: form.SubActId,
        SceneName: form.SceneName,
        WxxcxAppid: form.WxxcxAppid,
        WxxcxPagePath: form.WxxcxPagePath,
        WxxcxPageParams: form.WxxcxPageParams,
        SceneType: form.SceneType,
      });
      BtnLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功！");
        setTimeout(() => {
          handleSearch();
          form.ActId = "";
          form.SubActId = "";
          form.SceneName = "";
          form.WxxcxPagePath = "";
          form.WxxcxPageParams = "";
          Visible.value = false;
        }, 2000);
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success("复制成功！");
  } catch (err) {
    ElMessage.success("复制失败");
  }
};
/////////////////////////////////////////////////////////////////////////////////
const Init = () => {
  getData();
  GetAllAccountApi();
};
Init();
/////////////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "场景码") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "场景码"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped></style>
