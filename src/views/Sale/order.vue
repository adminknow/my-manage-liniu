<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/order' }">
          <i class="el-icon-mpyemian"></i> 订单列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="margin-bottom: 14px; padding-bottom: 0">
      <div class="Condition_search">条件搜索</div>
      <div style="float: right; top: -25px; position: relative; right: 26px">
        <el-button type="primary" class="buttonBtn1" @click="handleSearch()"
          >查&nbsp;&nbsp;询</el-button
        >
        <el-button type="primary" class="buttonBtn1" @click="handleAdd()"
          >新&nbsp;&nbsp;增</el-button
        >
      </div>
      <el-divider></el-divider>
      <div
        class="handle-box"
        style="padding: 4px 5px 0px 16px; margin-bottom: 20px"
      >
        <el-form label-width="120px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="关键字">
                <el-input
                  v-model="query.title"
                  clearable
                  placeholder="帐号或电话"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        style="width: 100%; text-align: center; position: relative; top: 5px"
      >
        <div style="height: 12px"></div>
        <!-- <i :class="searchmore"></i> -->
      </div>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        v-loading="tableLoading"
        ref="multipleTable"
        :header-cell-style="{ 'text-align': 'center' }"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="UserId"
          align="center"
          label="ID"
          width="55"
        ></el-table-column>
        <el-table-column
          prop="UserAccount"
          align="center"
          label="帐号"
          width="180"
        ></el-table-column>
        <el-table-column prop="UserName" align="center" label="姓名">
          <template #default="scope">
            <el-link
              :underline="false"
              @click="handleEdit(scope.row.UserId, 'View')"
              style="color: #409eff"
            >
              {{ scope.row.UserName }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="UserCell"
          align="center"
          label="电话"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="CreateUnitName"
          align="center"
          label="创建单位"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="UserStatusDesc"
          align="center"
          label="状态"
          width="120"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row.UserId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="scope.row.UserStatus == 1"
              type="text"
              @click="handleStop(scope.row.UserId)"
              >停用
            </el-button>
            <el-button
              v-if="scope.row.UserStatus == 0"
              type="text"
              @click="handleEnable(scope.row.UserId)"
              >启用
            </el-button>
            <el-button type="text" @click="handleDel(scope.row.UserId)"
              >删除
            </el-button>
            <el-button
              type="text"
              v-if="IsRight"
              @click="handleReset(scope.row.UserId)"
              >重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          v-model:currentPage="query.PageStartRow"
          v-model:page-size="query.PageRowCount"
          :page-sizes="[20, 50, 100]"
          :total="pageTotal"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchUsers } from "../../api/index.js";

export default {
  name: "order",
  setup() {
    const router = useRouter();
    const query = reactive({});

    return {};
  },
};
</script>

<style scoped></style>
