<template>
  <div class="container">
    <div class="handle-box" style="padding: 12px 0 12px">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="" v-if="loginUser.UnitType == 1">
              <el-select
                v-model="query.search.create_unit_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入券商名称"
                :remote-method="remoteMethod"
                remote-show-suffix
                :loading="SelLoading"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in UnitData"
                  :key="index"
                  :label="item.UnitCode + '-' + item.UnitName"
                  :value="item.UnitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                v-if="IsEditTag"
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;添加标签
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
      <el-table-column
        align="center"
        label="图片"
        width="160"
        v-if="GroupID == 2"
      >
        <template #default="scope">
          <img :src="scope.row.ListImg" style="width: 120px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="TagCode"
        align="center"
        label="编码"
      ></el-table-column>
      <el-table-column
        prop="TagName"
        align="center"
        label="名称"
      ></el-table-column>
      <el-table-column
        prop="DisplayIndex"
        align="center"
        width="120"
        label="顺序"
      ></el-table-column>
      <el-table-column
        prop="CreateUserName"
        label="创建人"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        align="center"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="CreateUnitName"
        label="创建单位"
        align="center"
        width="160"
      >
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          {{ scope.row.TagStatus === 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              size="small"
              v-if="IsEditTag && loginUser.UnitName == scope.row.CreateUnitName"
              @click="handleEdit(scope.row.TagId)"
              >编辑
            </el-button>
            <el-button
              v-if="
                scope.row.TagStatus == 1 &&
                IsEditTag &&
                loginUser.UnitName == scope.row.CreateUnitName
              "
              class="button-op-del"
              size="small"
              @click="handleDisable(scope.row.TagId)"
              >停用
            </el-button>
            <el-button
              v-if="
                scope.row.TagStatus == 0 &&
                IsEditTag &&
                loginUser.UnitName == scope.row.CreateUnitName
              "
              class="button-op-enable"
              size="small"
              @click="handleEnable(scope.row.TagId)"
              >启用
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              v-if="
                IsEditTag &&
                IsEditTag &&
                loginUser.UnitName == scope.row.CreateUnitName
              "
              @click="handleAddGoods(scope.row.TagId, 'add')"
              >添加商品
            </el-button>
            <el-button
              class="button-op-edit"
              size="small"
              v-else
              @click="handleAddGoods(scope.row.TagId, 'view')"
              >查看商品
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
    <!-- 标签 -->
    <el-dialog
      title="标签"
      v-model="tagVisible"
      width="38%"
      :show-close="false"
    >
    <div style="width:100%;height: 18px;"></div>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="编码" prop="TagCode" style="width: 90%">
          <el-input
            :disabled="form.TagId != ''"
            v-model="form.TagCode"
            clearable
            placeholder="请输入编码"
          >
          </el-input>
          <span style="height: 15px; color: #ababb2"
            >编码为“home”则表示查询全部商品</span
          >
        </el-form-item>
        <el-form-item label="名称" prop="TagName" style="width: 90%">
          <el-input
            v-model="form.TagName"
            clearable
            placeholder="请输入名称"
            maxlength="4"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="顺序" style="width: 90%">
          <el-input
            v-model="form.DisplayIndex"
            clearable
            placeholder="请输入顺序"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="券商"
          style="width: 90%"
          v-if="loginUser.UnitName == '礼牛网'"
        >
          <el-input
            v-model="form.TagParam"
            clearable
            placeholder="请输入券商ID"
          >
          </el-input>
          <span style="height: 15px; color: #ababb2"
            >输入券商ID,以方便小程序端对应查询</span
          >
        </el-form-item>
        <el-form-item label="图片" prop="">
          <el-row>
            <el-col :span="24">
              <el-input v-model="form.ListImg" v-if="false"></el-input>
              <el-upload
                class="tag-uploader"
                ref="upload"
                :show-file-list="false"
                action="#"
                :http-request="SuccessImg"
                :auto-upload="true"
              >
                <img
                  v-if="form.ListImg"
                  :src="form.ListImg"
                  class="tag-uploader-avatar"
                />
                <i v-else class="el-icon-mpzengjia"></i>
              </el-upload>
              <p class="text">
                图片，188*306 且不超过500k
                <span
                  style="cursor: pointer; color: #ff6666"
                  class="el-icon-delete"
                  v-if="form.ListImg"
                  @click="clear"
                  >删除</span
                >
              </p>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="button1"
            :loading="tabBtnLoading"
            @click="tagSaveBtn"
          >
            保 存
          </el-button>
          <el-button class="button2" @click="tagVisible = false"
            >关 闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import common from "@/utils/common.js";
import Cookie from "js-cookie";
import { UploadSingle } from "@/api/imgapi.js";
import { SearchUnites, HasRightes } from "@/api/index.js";
import {
  GetTagListByGroupId,
  SaveTag,
  EnableTag,
  DisableTag,
  GetTag,
} from "@/api/shopApi.js";

const router = useRouter();
const store = useStore();
const loginUser = JSON.parse(Cookie.get("User"));
////////////////////////////////////////////////////////////////
//根据id获取数据
const GroupID = ref("");
const Init = async () => {
  if (router.currentRoute.value.query.id) {
    GroupID.value = router.currentRoute.value.query.id;
    getData(GroupID.value);
  }
};
////////////////////////////////////////////////////////////////
// 获取表格数据
const query = reactive({
  search: {
    GoodsCategoryCode: "",
    goods_category_name: "",
    create_unit_id: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const getData = async () => {
  tableLoading.value = true;
  let res = await GetTagListByGroupId({
    GroupId: GroupID.value,
    CreateUnitId: query.search.create_unit_id,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap ? res.DataMap : [];
    pageTotal.value = res.DataMap.length;
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
////////////////////////////////////////////////////////////////
//添加标签
const tagVisible = ref(false);
const tabBtnLoading = ref(false);
const formRef = ref(null);
let form = reactive({
  TagId: "",
  GroupId: "",
  TagCode: "",
  TagName: "",
  DisplayIndex: "",
  ListImg: "",
  TagParam: "", //经销商ID
});
const rules = {
  TagCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
  TagName: [{ required: true, message: "请输入名称", trigger: "blur" }],
};
const handleAdd = () => {
  form.TagId = "";
  form.TagCode = "";
  form.TagName = "";
  form.ListImg = "";
  form.DisplayIndex = "";
  tagVisible.value = true;
};
const tagSaveBtn = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      tabBtnLoading.value = true;
      form.GroupId = GroupID.value;
      let res = await SaveTag({ Tag: form });
      tabBtnLoading.value = false;
      if (res.Code == 200) {
        tagVisible.value = false;
        ElMessage.success("保存成功");
        handleSearch();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
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
const clear = () => {
  form.ListImg = "";
};
////////////////////////////////////////////////////////////////
//编辑
const handleEdit = async (ID) => {
  tagVisible.value = true;
  let res = await GetTag({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    form.TagId = res.DataMap.TagId;
    form.TagCode = res.DataMap.TagCode;
    form.TagName = res.DataMap.TagName;
    form.TagParam = res.DataMap.TagParam;
    form.ListImg = res.DataMap.ListImg;
    form.DisplayIndex = res.DataMap.DisplayIndex;
  }
};
////////////////////////////////////////////////////////////////
//停用
const handleDisable = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableTag({
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
//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableTag({
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
////////////////////////////////////////////////////////////////
const handleAddGoods = (ID, type) => {
  common.ClosePageTag("标签商品");
  router.push({
    path: "/tag_goods",
    query: {
      tagID: ID,
      tagType: type,
    },
  });
};
////////////////////////////////////////////////////////////////
const IsEditTag = ref(false);
const BoolRight = async () => {
  let arr = ["edit_tag"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsEditTag.value = res.DataMap.edit_tag;
  }
};
BoolRight();
////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//查询券商
const SelLoading = ref(false);
const UnitData = ref([]);
//券商
const remoteMethod = async (query) => {
  if (query) {
    let SearchQuery = "";
    if (query !== "") {
      SearchQuery = query;
    } else {
      return;
    }
    SelLoading.value = true;
    let res = await SearchUnites({
      SearchCondition: {
        search_keyword: SearchQuery,
        unit_type: 2,
      },
      NoPage: true,
      PageStartRow: 0,
      PageRowCount: 100000,
    });
    SelLoading.value = false;
    if (res.Code == 200) {
      UnitData.value = res.DataMap.Data ? res.DataMap.Data : [];
    }
  } else {
    UnitData.value = [];
  }
};
/////////////////////////////////////////////////////////////////////////////////
Init();
watch(
  () => router.currentRoute.value,
  (data) => {
    GroupID.value = data.query.id;
    if (data.query.id) {
      getData(GroupID.value);
    }
  }
);
</script>

<style scoped></style>
<style>
#goodsModal .el-dialog__body {
  padding-top: 0 !important;
}

.tag-uploader {
  width: 150.4px;
  height: 244.8px;
}

.tag-uploader .el-upload {
  width: 150.4px !important;
  height: 244.8px !important;
  line-height: 244.8px !important;
}

.tag-uploader-avatar {
  width: 100%;
}
</style>
