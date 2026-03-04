<template>
  <div class="container">
    <div class="handle-box" style="padding: 12px 0 0">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5"> </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="12" :offset="1">
            <div class="button-mgl">
              <el-button
                v-if="IsRight && loginUser.UnitType == 2"
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;添加分类
              </el-button>
              <el-button
                v-if="loginUser.UnitType == 2"
                class="button2 button-float"
                round
                @click="fileUploadClick('GoodsCategory')"
              >
                <el-icon> <DocumentAdd /> </el-icon>&nbsp;&nbsp;导入分类
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
    <el-row style="margin-top: 4px">
      <el-col :md="6">
        <el-row style="padding-bottom: 10px">
          <el-col class="send-local flex-row items-center" :span="20"
            >商品分类</el-col
          >
        </el-row>
        <div class="left" style="margin: 2px; border: solid 1px white">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            ref="tree"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-popover
                  trigger="hover"
                  v-if="data.SubGoodsCategories.length == 0"
                >
                  <template #reference>
                    <span>{{
                      data.GoodsCategoryCode + "-" + data.GoodsCategoryName
                    }}</span>
                  </template>
                  <template #default>
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="data.ListImg"
                      fit="fill"
                    />
                  </template>
                </el-popover>
                <span v-else>{{
                  data.GoodsCategoryCode + "-" + data.GoodsCategoryName
                }}</span>
                <el-tooltip
                  style=""
                  v-if="loginUser.UnitType == 2"
                  effect="dark"
                  content="编辑"
                  placement="top-start"
                >
                  <span style="position: relative; top: 2px; left: 10px">
                    <el-icon :size="14" @click.stop="edit(node, data)"
                      ><Edit
                    /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip
                  style=""
                  v-if="loginUser.UnitType == 2"
                  effect="dark"
                  content="删除"
                  placement="top-start"
                >
                  <span style="position: relative; top: 2px; left: 20px">
                    <el-icon :size="14" @click.stop="remove(node, data)"
                      ><Delete
                    /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip
                  style=""
                  v-if="
                    data.GoodsCategoryStatus == 1 && loginUser.UnitType == 2
                  "
                  effect="dark"
                  content="停用"
                  placement="top-start"
                >
                  <el-image
                    @click="handleDisable(data.GoodsCategoryId)"
                    style="
                      width: 14px;
                      height: 14px;
                      position: relative;
                      top: 2px;
                      left: 30px;
                      color: #417bd5;
                    "
                    src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/treeDisable.png?v=1"
                    fit="fit"
                  />
                </el-tooltip>
                <el-tooltip
                  style=""
                  v-if="
                    data.GoodsCategoryStatus == 0 && loginUser.UnitType == 2
                  "
                  effect="dark"
                  content="启用"
                  placement="top-start"
                >
                  <el-image
                    @click="handleEnable(data.GoodsCategoryId)"
                    style="
                      width: 14px;
                      height: 14px;
                      position: relative;
                      top: 2px;
                      left: 30px;
                      color: #417bd5;
                    "
                    src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/website/treeEnable.png?v=1"
                    fit="fit"
                  />
                </el-tooltip>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <el-col :md="18">
        <el-row style="padding-bottom: 10px">
          <el-col class="send-local flex-row items-center" :span="20"
            >商品列表</el-col
          >
        </el-row>
        <el-table
          :data="
            tableData.slice(
              (query.PageStartRow - 1) * query.PageRowCount,
              query.PageStartRow * query.PageRowCount
            )
          "
          border
          class="table"
          v-loading="tableLoading"
          ref="multipleTable"
          :header-cell-style="{ 'text-align': 'center' }"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="GoodsCode"
            align="center"
            label="编码"
            width="120"
          ></el-table-column>
          <el-table-column align="center" label="名称">
            <template #default="scope">
              <el-link
                :underline="false"
                @click="handleEdit(scope.row.GoodsId, 'View')"
                style="color: #f56c6c"
              >
                {{ scope.row.GoodsTitle }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="BrandName"
            align="center"
            label="品牌"
            width="120"
          ></el-table-column>
          <el-table-column align="center" label="原价(元)" width="120">
            <template #default="scope">
              {{ (scope.row.OrgPrice / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="售价(元)" width="120">
            <template #default="scope">
              {{ (scope.row.SellPrice / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品状态" width="120">
            <template #default="scope">
              {{ scope.row.GoodsStatus === 1 ? "正常" : "停用" }}
            </template>
          </el-table-column>

          <el-table-column prop="" align="left" label="创建信息" width="160">
            <template #default="scope">
              <div v-if="loginUser.UnitName == '礼牛网'">
                <p>{{ scope.row.CreateUnitName }}</p>
                <p>{{ scope.row.CreateTime }}</p>
              </div>
              <div v-else>
                <p>{{ scope.row.CreateUserName }}</p>
                <p>{{ scope.row.CreateTime }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template #default="scope">
              <div class="button-mgl">
                <el-button
                  v-if="
                    scope.row.sort > 0 && IsRight && loginUser.UnitType == 2
                  "
                  size="small"
                  class="button-op-del"
                  @click="handleModalAdTop(scope.row)"
                  >上移</el-button
                >
                <el-button
                  v-if="
                    scope.row.sort < tableData.length - 1 &&
                    IsRight &&
                    loginUser.UnitType == 2
                  "
                  size="small"
                  class="button-op-del"
                  @click="handleModalAdDown(scope.row)"
                  >下移</el-button
                >
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
            :total="tableData.length"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- 上传文件通用弹窗 -->
    <uploadModal
      :fileUploadVisible="fileUploadVisible"
      :fileType="fileType"
      :mallGoodsCategoryLevel="mallGoodsCategoryLevel"
      @closeUploadVisible="closeUploadVisible"
    ></uploadModal>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { Import } from "@/api/imgapi.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { HasRightes, GetUnitConfigs } from "../../api/index.js";
import uploadModal from "@/components/upload/index.vue";
import {
  GetGoodsCategory,
  MoveGoodsInCategory,
  GetGoodsCategoryList,
  DisableGoodsCategory,
  EnableGoodsCategory,
  GetGoodsList,
  DeleteGoodsCategory,
} from "@/api/goods.js";

const router = useRouter();
const store = useStore();
const query = reactive({
  search: {
    count_goods: 1,
  },
  PageStartRow: 1,
  PageRowCount: 15,
});
const tableLoading = ref(false);
const tableData = ref([]);

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await GetGoodsCategoryList({
    onlyValid: false,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    treeData.value = res.DataMap;
  }
};
////////////////////////////////////////////////////////////////
//左侧分类树节点
let treeData = ref([]);
const defaultProps = {
  children: "SubGoodsCategories",
  label: "GoodsCategoryName",
};
const GoodsCategoryId = ref("");
const handleNodeClick = (data) => {
  GoodsCategoryId.value = data.GoodsCategoryId;
  GetGoodsListApi(data.GoodsCategoryId);
};

////////////////////////////////////////////////////////////////
const GetGoodsListApi = async (GoodsCategoryId) => {
  tableLoading.value = true;
  let res = await GetGoodsList({
    SearchCondition: {
      goods_category_id: GoodsCategoryId,
    },
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    res.DataMap.forEach((row, index) => {
      row.sort = index;
    });
    tableData.value = res.DataMap;
  }
};
getData();

const loginUser = JSON.parse(Cookie.get("User"));

const handleSearch = () => {
  getData();
};
//新增商品
const handleAdd = () => {
  common.ClosePageTag("我的分类详情");
  router.push({
    path: "/my_category_info",
    query: {
      Type: "Add",
    },
  });
};
//编辑
const handleEdit = (ID, type) => {
  common.ClosePageTag("售卖详情");
  router.push({
    path: "/selling_goods_info",
    query: {
      Type: type,
      ID: ID,
    },
  });
};

//停用
const handleDisable = (ID) => {
  ElMessageBox.confirm("确定要停用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await DisableGoodsCategory({
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
//启用
const handleEnable = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableGoodsCategory({
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
//删除
const remove = (node, data) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      let res = await DeleteGoodsCategory({
        ObjectId: data.GoodsCategoryId,
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
const edit = (node, data) => {
  //data.GoodsCategoryId
  common.ClosePageTag("我的分类详情");
  router.push({
    path: "/my_category_info",
    query: {
      Type: "edit",
      ID: data.GoodsCategoryId,
    },
  });
};
////////////////////////////////////////////////////////////////
//权限控制
const IsRight = ref(false);
const BoolRight = async () => {
  let arr = ["edit_goodscategory"];
  let res = await HasRightes({ RightCodes: arr });
  if (res.Code == 200) {
    IsRight.value = res.DataMap.edit_goodscategory;
  }
};
//审批权限控制
BoolRight();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const fileUploadVisible = ref(false);
const fileType = ref("");
const fileUploadClick = (pValue) => {
  fileType.value = pValue;
  fileUploadVisible.value = true;
};
const closeUploadVisible = (pValue) => {
  fileUploadVisible.value = false;
  if(pValue){
    handleSearch()
  }
};
////////////////////////////////////////////////////////////////////////
//上移下移
const handleModalAdTop = async (key) => {
  MoveGoodsInCategoryApi(key.GoodsId, GoodsCategoryId.value, true);
};
const handleModalAdDown = async (key) => {
  MoveGoodsInCategoryApi(key.GoodsId, GoodsCategoryId.value, false);
};
const MoveGoodsInCategoryApi = async (GoodsId, GoodsCategoryId, IsUp) => {
  let res = await MoveGoodsInCategory({
    GoodsId: GoodsId,
    GoodsCategoryId: GoodsCategoryId,
    IsUp: IsUp,
  });
  if (res.Code == 200) {
    GetGoodsListApi(GoodsCategoryId);
  }
};
////////////////////////////////////////////////////////////////////////
//获取当前券商商城属于哪一类
const mallGoodsCategoryLevel = ref(false);
const GetUnitConfigsApi = async () => {
  let res = await GetUnitConfigs({
    ObjectId: loginUser.UnitId,
  });
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      if (row.ConfigKey == "mall.goods.category.level") {
        mallGoodsCategoryLevel.value = row.ConfigValue;
      }
    });
  }
};
GetUnitConfigsApi();
////////////////////////////////////////////////////////////////////////
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "我的分类") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "我的分类"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style>
.file-category-uploader {
  width: 150px;
  height: 40px;
}

.file-category-uploader .el-upload {
  width: 150px !important;
  height: 40px !important;
  border: none !important;
  justify-content: start !important;
}

.file-category-uploader .el-upload__tip {
  width: 300px;
  padding-left: 5px;
}
</style>
