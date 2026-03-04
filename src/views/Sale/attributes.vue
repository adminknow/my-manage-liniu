<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.search_keyword" clearable placeholder="请输入关键字查询">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button2 button-float" round @click="handleAdd()">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;添加属性
              </el-button>
              <el-button class="button1 button-float" round @click="handleSearch()">
                <el-icon>
                  <Search />
                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column prop="PropName" align="center" label="名称" width="100"></el-table-column>
      <el-table-column align="center" label="明细">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.Details" :key="index">{{
            item.PropDetailName + "，"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="PropDesc" align="center" label="描述"></el-table-column>
      <el-table-column prop="GoodsCount" align="center" width="160" label="引用的商品数量"></el-table-column>
      <el-table-column prop="" align="left" label="创建信息">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId" class="button-op-edit" size="small"
              @click="handleEdit(scope.row.PropId, 'Edit')">编辑
            </el-button>
            <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId" class="button-op-del" size="small"
              @click="handleDetail(scope.row.PropId)">属性明细
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>
    <!-- 创建属性 -->
    <el-dialog title="新增/修改属性" v-model="attributesVisible" width="38%" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
        <div style="padding-bottom: 60px">
          <el-row>
            <el-col :span="23">
              <el-form-item label="名称" prop="PropName">
                <el-input v-model="form.PropName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述">
                <el-input type="textarea" maxlength="100" :rows="4" show-word-limit placeholder="请输入描述内容"
                  v-model="form.PropDesc">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="width:100%;text-align: center;">
          <el-button class="button1" round :loading="btnLoading"
            @click="onSubmit">&nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
          </el-button>
          <el-button class="button2" round
            @click="attributesVisible = false">&nbsp;&nbsp;关&nbsp;&nbsp;闭&nbsp;&nbsp;</el-button>
        </div>

      </el-form>
    </el-dialog>
    <!-- 属性明细 -->
    <el-dialog class="detailAttr" title="明细" v-model="detailVisible" width="60%" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <div style="width:100%;height: 18px;"></div>
      <div class="flex-row justify-between">
        <p>名称：{{ form.PropName }} 描述：{{ form.PropDesc }}</p>
        <el-button class="button-op-edit" size="small" @click="handleAddDetail()">新增明细
        </el-button>
      </div>
      <el-table :data="dateilData" border class="table" v-loading="dateilLoading" ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
        <el-table-column prop="PropDetailName" label="明细的名称" align="center">
          <template #default="scope">
            <el-input v-show="scope.row.isEdit" v-model="PropDetailName"></el-input>
            <p v-show="!scope.row.isEdit">{{ scope.row.PropDetailName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="PropDetailDesc" label="明细的描述" align="center">
          <template #default="scope">
            <el-input v-show="scope.row.isEdit" v-model="PropDetailDesc"></el-input>
            <p v-show="!scope.row.isEdit">{{ scope.row.PropDetailDesc }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="button-mgl">
              <el-button class="button-op-edit" size="small" v-if="scope.row.isEdit"
                @click="handleAddModal(scope.$index, scope.row.PropDetailId)">确认保存
              </el-button>
              <el-button class="button-op-edit" size="small" v-if="!scope.row.isEdit"
                @click="handleEditModal(scope.$index)">编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button2" @click="closedetailVisible">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import { SearchProperties, GetPropertyById, SaveProperty, SavePropertyDetail } from "@/api/goods.js";

const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    search_keyword: "",
    get_prop_detail: 1,
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const Type = ref("");

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchProperties({
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
//关闭弹框
const closedetailVisible = () => {
  detailVisible.value = false;
  query.PageStartRow = 1;
  getData();
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const attributesVisible = ref(false);
//新增属性
const handleAdd = () => {
  attributesVisible.value = true;
  form.PropId = "";
  form.PropName = "";
  form.PropDesc = "";
  form.Details = [];
  Type.value = "";
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

//明细操作
const detailVisible = ref(false);
const dateilData = ref([]);
const dateilLoading = ref(false);
const PropDetailName = ref(""); //属性的明细的名称
const PropDetailDesc = ref(""); //属性的明细的描述
//编辑属性
const handleEdit = async (PropId, type) => {
  let res = await GetPropertyById({
    ObjectId: PropId,
  });
  if (res.Code == 200) {
    attributesVisible.value = true;
    form.PropId = res.DataMap.PropId;
    form.PropName = res.DataMap.PropName;
    form.PropDesc = res.DataMap.PropDesc;
  } else {
    ElMessage.error(res.Message);
  }
};
//属性明细
const handleDetail = async (PostID) => {
  detailVisible.value = true;
  dateilData.value = [];
  let res = await GetPropertyById({
    ObjectId: PostID,
  });
  if (res.Code == 200) {
    form.PropId = res.DataMap.PropId;
    form.PropName = res.DataMap.PropName;
    form.PropDesc = res.DataMap.PropDesc;
    form.Details = res.DataMap.Details;
    res.DataMap.Details.forEach((row) => {
      dateilData.value.push({
        PropDetailId: row.PropDetailId,
        isEdit: false,
        PropDetailName: row.PropDetailName,
        PropDetailDesc: row.PropDetailDesc,
      });
    });
  }
};
//新增一条属性
const handleAddDetail = async () => {
  if (isAddIng() > 0) {
    ElMessage.info("请先确认保存正在编辑的数据");
    return;
  }
  dateilData.value.push({
    PropDetailId: "",
    sort: "",
    isEdit: true,
    PropDetailName: "",
    PropDetailDesc: "",
  });
  PropDetailName.value = "";
  PropDetailDesc.value = "";
};

const isAddIng = () => {
  //判断是否操作不妥
  let isAddIng = 0; //是否有正在编辑的数据
  if (dateilData.value.length > 0) {
    dateilData.value.forEach((row) => {
      if (row.isEdit) {
        isAddIng++;
      }
    });
  }
  return isAddIng;
};
//编辑一条属性明细
const handleEditModal = async (IndexPost) => {
  if (isAddIng() > 0) {
    ElMessage.info("请先确认保存正在编辑的数据");
    return;
  }
  dateilData.value.forEach((row, index) => {
    if (IndexPost == index) {
      row.isEdit = true;
      PropDetailName.value = row.PropDetailName;
      PropDetailDesc.value = row.PropDetailDesc;
    }
  });
};
const handleAddModal = async (IndexPost, DetailIdPost) => {
  if (PropDetailName.value == "") {
    ElMessage.info("请输入明细的名称");
    return;
  }
  let PropertyDetail = {
    PropDetailId: DetailIdPost,
    PropDetailName: PropDetailName.value,
    PropDetailDesc: PropDetailDesc.value,
    PropId: form.PropId,
  };
  let res = await SavePropertyDetail({
    PropertyDetail: PropertyDetail,
  });
  if (res.Code == 200) {
    dateilData.value[IndexPost].sort = IndexPost;
    dateilData.value[IndexPost].PropDetailId = res.DataMap.PropDetailId;
    dateilData.value[IndexPost].isEdit = false;
    dateilData.value[IndexPost].PropDetailName = PropDetailName.value;
    dateilData.value[IndexPost].PropDetailDesc = PropDetailDesc.value;
  } else {
    ElMessage.error(res.Message);
  }
};

const formRef = ref(null);
let form = reactive({
  PropId: "",
  PropName: "",
  PropDesc: "",
  Details: [], //明细
  GoodsCount: "",
});
const rules = {
  PropName: [{ required: true, message: "请输入名称", trigger: "blur" }],
};
const btnLoading = ref(false);
const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true;
      let Property = form;
      let res = await SaveProperty({ Property: Property });
      btnLoading.value = false;
      if (res.Code == 200) {
        ElMessage.success("操作成功！");
        query.PageStartRow = 1;
        attributesVisible.value = false;
        getData();
      } else {
        ElMessage.error(res.Message);
      }
    } else {
      return false;
    }
  });
};
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "商品属性") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "商品属性"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style>
.detailAttr .el-dialog__body {
  padding-top: 10px !important;
}
</style>
