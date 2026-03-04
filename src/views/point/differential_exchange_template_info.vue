<template>
  <div class="container">
    <el-form
      ref="formRef"
      :rules="rules"
      :model="TemplateForm"
      label-width="170px"
    >
      <div style="margin-top: 20px; padding-bottom: 100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="名称" prop="TemplateName">
              <el-input
                :disabled="Type == 'View'"
                v-model="TemplateForm.TemplateName"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="备注" prop="TemplateRemark">
              <el-input
                :disabled="Type == 'View'"
                v-model="TemplateForm.TemplateRemark"
                maxlength="40"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="添加差异兑换商品">
              <el-button
                v-if="Type != 'View'"
                class="button1"
                round
                size
                @click="OpenModal"
              >
                &nbsp;&nbsp;添加&nbsp;&nbsp;
              </el-button>
              <el-button
                v-if="Type != 'View'"
                class="button1"
                round
                size
                @click="FileModal"
              >
                &nbsp;&nbsp;文件导入&nbsp;&nbsp;
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="">
              <el-table
                height="400"
                :data="TemplateForm.Details"
                border
                class="table"
                :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header"
                style="width: 100%"
              >
                <el-table-column align="center" label="序号" width="80">
                  <template #default="scope">
                    <p>{{ scope.$index + 1 }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="UnitName"
                  label="提货点"
                  align="center"
                ></el-table-column>
                <el-table-column align="center" label="差异兑换商品">
                  <template #default="scope">
                    <p>
                      {{ scope.row.GoodsCode + " - " + scope.row.GoodsTitle }}
                    </p>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="80">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button
                        class="button-op-del"
                        size="small"
                        v-if="Type != 'View'"
                        @click="DelRow(scope.row.GoodsId)"
                        >删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  layout="->,total"
                  :total="TemplateForm.Details.length"
                ></el-pagination>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button
          v-if="Type != 'View'"
          class="button1"
          round
          :loading="btnLoading"
          @click="onSubmit"
        >
          <el-icon> <CirclePlus /> </el-icon
          >&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
        </el-button>
        <el-button class="button2" round @click="onReturn"
          >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 商品弹窗 -->
    <el-dialog
      title="商品列表"
      v-model="GoodsVisible"
      width="48%"
      class="dataTable-current"
      :show-close="false"
    >
      <div class="handle-box">
        <el-form-item label="提货点">
          <el-select
            v-model="TemplateForm.DetailsObj.UnitId"
            filterable
            style="width: 40%"
            placeholder="请选择提货点"
            @change="CheckUnitID($event)"
          >
            <el-option
              v-for="item in unitList"
              :key="item.UnitId"
              :label="item.UnitName"
              :value="item.UnitId"
            />
          </el-select>
        </el-form-item>
        <el-form label-width="1px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="">
                <el-input
                  v-model="query.search.search_keyword"
                  clearable
                  placeholder="请输入编码/标题/条形码"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="1"> </el-col>
            <el-col :span="5" :offset="1"></el-col>
            <el-col :span="6" :offset="1">
              <div class="button-mgl">
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
        :data="
          GoodsData.slice(
            (query.PageStartRow - 1) * query.PageRowCount,
            query.PageStartRow * query.PageRowCount
          )
        "
        border
        class="table"
        v-loading="GoodsLoading"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
        style="width: 100%"
        height="300"
        ref="multipleGoodsTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="40" />
        <el-table-column prop="GoodsTypeDesc" align="center" label="类型">
        </el-table-column>
        <el-table-column
          prop="GoodsCode"
          align="center"
          label="商品编码"
        ></el-table-column>
        <el-table-column prop="GoodsTitle" align="center" label="标题">
        </el-table-column>
        <el-table-column prop="CreateUnitName" align="center" label="券商">
        </el-table-column>
        <el-table-column align="center" label="价格(元)">
          <template #default="scope">
            <p>{{ scope.row.OrgPrice / 100 }}</p>
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
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" @click="AddGoods">确 认</el-button>
          <el-button class="button2" @click="GoodsVisible = false"
            >关 闭</el-button
          >
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
      <div class="file-detail" style="height: 100px">
        <el-upload
          v-model:file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          class="file-uploader"
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
                href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/兑换差异模板.xlsx"
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
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  SaveExchangeTemplate,
  GetExchangeTemplate,
  SearchGoodses,
} from "@/api/goods.js";
import { SearchUnites } from "@/api/index.js";
import common from "@/utils/common.js";
import { GetFileData } from "@/api/imgapi.js";
const router = useRouter();
const store = useStore();
const formRef = ref(null);
const btnLoading = ref(false);
const Type = ref("");
let TemplateForm = reactive({
  TemplateId: "",
  TemplateName: "", //名称
  TemplateRemark: "", //备注
  TemplateStatus: "", //状态(1:正常;0:停用)
  Details: [],
  DetailsObj: {
    TemplateId: "", //兑换模板
    GoodsId: "", //兑换的商品
    UnitId: "", //兑换的门店
    GoodsCode: "",
    GoodsTitle: "",
    UnitCode: "",
    UnitName: "",
  },
});
const rules = {
  GoodsCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
};

////////////////////////////////////////////////////////////////////////
const tableLoading = ref(false);
const GoodsVisible = ref(false);
const GoodsData = ref([]);
const query = reactive({
  search: {
    search_keyword: "",
    goods_status: "1",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const GoodsLoading = ref(false);
const pageTotal = ref(0);
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};

// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  requestTableData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  requestTableData();
};
// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchGoodses({
    PageStartRow: 0,
    PageRowCount: 100000,
    SearchCondition: query.search,
    NoPage: true,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    GoodsData.value = res.DataMap.Data ? res.DataMap.Data : [];
    pageTotal.value = res.DataMap.ToalCount;
  }
};

////////////////////////////////////////////////////////////////////////
const OpenModal = () => {
  GoodsVisible.value = true;
  handleSearch();
  setTimeout(() => {
    toggleRowSelectionApi();
  }, 1000);
};
////////////////////////////////////////////////////////////////////////
//文件导入
const FileModal = () => {
  fileVisible.value = true;
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
  fd.append("DataType", "GoodsDiffExchangeTemplateDetail"); //传文件
  let res = await GetFileData(fd);
  if (res.Code == 200) {
    fileVisible.value = false;
    fileList.value = [];
    TemplateForm.Details = res.DataMap;
  } else {
    ElMessage.warning(res.Message);
    fileList.value = [];
  }
};

const CennelFileModalBtn = async () => {
  fileVisible.value = false;
  fileList.value = [];
};
////////////////////////////////////////////////////////////////////////
//批量选择商品
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  nextTick(() => {
    multipleSelection.value = val;
  });
};
//确认选择
const AddGoods = () => {
  if (TemplateForm.DetailsObj.UnitId == "") {
    ElMessage.error("请先选择提货点");
    return;
  }
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请先勾选数据");
    return;
  }
  multipleSelection.value.forEach((row) => {
    row.UnitName = TemplateForm.DetailsObj.UnitName;
    row.UnitId = TemplateForm.DetailsObj.UnitId;
  });
  TemplateForm.Details = TemplateForm.Details.concat(multipleSelection.value);
  let hasSet = () => {
    //对象数组去重
    let tempArr = TemplateForm.Details;
    for (let i = 0; i < tempArr.length; i++) {
      for (let j = i + 1; j < tempArr.length; j++) {
        if (
          tempArr[i].UnitId == tempArr[j].UnitId &&
          tempArr[i].GoodsId == tempArr[j].GoodsId
        ) {
          tempArr.splice(j, 1);
          j--;
        }
      }
    }
    return tempArr;
  };

  TemplateForm.Details = hasSet();
  GoodsVisible.value = false;
};
//删除选中的一行商品
const DelRow = async (GoodsID) => {
  for (let i = 0; i < TemplateForm.Details.length; i++) {
    if (TemplateForm.Details[i].GoodsId == GoodsID) {
      TemplateForm.Details.splice(i, 1);
      break;
    }
  }
};

//选择兑换点
const CheckUnitID = async (val) => {
  unitList.value.forEach((row) => {
    if (val == row.UnitId) {
      TemplateForm.DetailsObj.UnitName = row.UnitName;
    }
  });
  multipleGoodsTable.value.clearSelection();
  toggleRowSelectionApi();
};
////////////////////////////////////////////////////////////////////////

const toggleRowSelectionApi = () => {
  if (TemplateForm.Details.length > 0) {
    GoodsData.value.forEach(function (item, i) {
      TemplateForm.Details.forEach(function (multItem, j) {
        if (
          GoodsData.value[i].GoodsId == TemplateForm.Details[j].GoodsId &&
          TemplateForm.DetailsObj.UnitId == TemplateForm.Details[j].UnitId
        ) {
          multipleGoodsTable.value.toggleRowSelection(GoodsData.value[i], true); //这步操作是让  页面显示选中的数据
        }
      });
    });
  }
};
////////////////////////////////////////////////////////////////////////
const unitList = ref([]);
//获取提货点下拉列表
const SearchUnitesApi = async () => {
  let res = await SearchUnites({
    PageStartRow: 0,
    PageRowCount: 100000,
    SearchCondition: {
      unit_type: "33",
    },
    NoPage: true,
  });
  if (res.Code == 200) {
    unitList.value = res.DataMap.Data ? res.DataMap.Data : [];
    TemplateForm.DetailsObj.UnitId = res.DataMap.Data[0].UnitId;
    TemplateForm.DetailsObj.UnitName = res.DataMap.Data[0].UnitName;
  }
};
////////////////////////////////////////////////////////////////////////
const multipleGoodsTable = ref(null);
const requestTableData = () => {
  nextTick(() => {
    if (multipleSelection.value.length > 0) {
      GoodsData.value.forEach(function (item, i) {
        multipleSelection.value.forEach(function (multItem, j) {
          if (
            GoodsData.value[i].GoodsId == multipleSelection.value[j].GoodsId
          ) {
            multipleGoodsTable.value.toggleRowSelection(
              GoodsData.value[i],
              true
            ); //这步操作是让  页面显示选中的数据
          }
        });
      });
    }
  });
};
const onReturn = async (val) => {
  common.ClosePageTag("差异兑换详情");
  router.back();
};
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      let res = await SaveExchangeTemplate({
        Template: TemplateForm,
      });
      btnLoading.value = false;
      if (res.Code == 200) {
        common.ClosePageTag("差异兑换详情");
        store.commit("tags/setPageSaerch", {
          Search: 1,
          titlePage: "差异兑换模板",
        });
        ElMessage.success("保存成功");
        setTimeout(function () {
          router.push({
            path: "/differential_exchange_template",
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
////////////////////////////////////////////////////////////////////////
//根据ID获取详情
const Init = async () => {
  if (router.currentRoute.value.query.ID) {
    GetExchangeTemplateApi(router.currentRoute.value.query.ID);
    Type.value = router.currentRoute.value.query.Type;
  }
  getData();
  SearchUnitesApi();
};
////////////////////////////////////////////////////////////////////////
const GetExchangeTemplateApi = async (ID) => {
  let res = await GetExchangeTemplate({
    ObjectId: ID,
  });
  if (res.Code == 200) {
    TemplateForm.TemplateId = res.DataMap.TemplateId;
    TemplateForm.TemplateName = res.DataMap.TemplateName;
    TemplateForm.TemplateRemark = res.DataMap.TemplateRemark;
    TemplateForm.TemplateStatus = res.DataMap.TemplateStatus;
    TemplateForm.Details = res.DataMap.Details;
  } else {
  }
};

////////////////////////////////////////////////////////////////////////
Init();
</script>

<style scoped>
::v-deep(.dataTable-current .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
<style>
.file-uploader {
  width: 150px;
  height: 40px;
}

.file-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.file-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
