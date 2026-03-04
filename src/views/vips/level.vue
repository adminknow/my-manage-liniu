<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="6" :offset="18">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                &nbsp;&nbsp;新&nbsp;&nbsp;增&nbsp;&nbsp;
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
    <div style="width: 100%; height: 10px"></div>
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
        prop="VipTypeCode"
        align="center"
        label="编码"
      ></el-table-column>
      <el-table-column
        prop="VipTypeName"
        align="center"
        label="名称"
      ></el-table-column>
      <el-table-column align="center" label="购物时享受的折扣（%）">
        <template #default="scope">
          <p v-if="scope.row.ShoppingDiscount > 0">
            {{ scope.row.ShoppingDiscount }}
          </p>
        </template></el-table-column
      >
      <el-table-column align="center" label="注册手机号后即可拥有此等级">
        <template #default="scope">
          <p v-if="scope.row.OnlyHasCell == 1">是</p>
          <p v-if="scope.row.OnlyHasCell == 0">否</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template #default="scope">
          <p v-if="scope.row.VipTypeStatus == 1">正常</p>
          <p v-if="scope.row.VipTypeStatus == 0">停用</p>
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              class="button-op-edit"
              size="small"
              @click="EditClick(scope.row.VipTypeId)"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.VipTypeStatus == 1"
              class="button-op-del"
              size="small"
              @click="DisableClick(scope.row.VipTypeId)"
              >停用
            </el-button>
            <el-button
              v-if="scope.row.VipTypeStatus == 0"
              class="button-op-enable"
              size="small"
              @click="EnableClick(scope.row.VipTypeId)"
              >启用
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import { GetVipTypeList, EnableVipType, DisableVipType } from "@/api/vip.js";
const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    vip_type_code: "",
    vip_type_name: "",
    shopping_discount: "",
    sell_price: "",
    vip_type_status: "",
    create_unit_id: "",
  },
  PageStartRow: 1,
  PageRowCount: 1000000,
});
const tableLoading = ref(false);
const tableData = ref([]);
const init = async () => {
  getData();
};

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await GetVipTypeList({});
  tableLoading.value = false;
  if (res.Code == 200) {
    tableData.value = res.DataMap;
  }
};

const EditClick = async (ID) => {
  common.ClosePageTag("会员等级详情");
  router.push({
    path: "/levelInfo",
    query: {
      Type: "Edit",
      ID: ID,
    },
  });
};
const EnableClick = (ID) => {
  ElMessageBox.confirm("确定要启用吗？", "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  }).then(async () => {
    let res = await EnableVipType({
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
    let res = await DisableVipType({
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
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const handleAdd = () => {
  common.ClosePageTag("会员等级详情");
  router.push({
    path: "/levelInfo",
  });
};
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "会员等级") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "会员等级"
    ) {
      query.PageStartRow = 1;
      getData();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
</script>

<style scoped>
::v-deep(.level-modal .el-dialog__body) {
  padding-top: 10px !important;
}
</style>
