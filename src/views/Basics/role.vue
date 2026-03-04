<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="searchKeyword"
                clearable
                @keyup.enter="handleSearch"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleAdd()"
              >
                <el-icon> <Plus /> </el-icon>&nbsp;&nbsp;新增角色
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

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      border
      class="table"
      v-loading="isLoading"
      ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="RoleCode" align="center" label="编码" width="180">
        <template #default="scope">
          <el-link
            :underline="false"
            @click="handleEdit(scope.row.RoleId, 'View')"
            style="color: #f56c6c"
          >
            {{ scope.row.RoleCode }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="RoleName"
        align="center"
        label="名称"
      ></el-table-column>
      <el-table-column prop="" align="left" label="创建信息" width="250">
        <template #default="scope">
          <p>创建单位：{{ scope.row.CreateUnitName }}</p>
          <p>创建人：{{ scope.row.CreateUserName }}</p>
          <p>{{ scope.row.CreateTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="RolwTypeDesc"
        label="类型"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="RolwStatusDesc"
        label="状态"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <div class="button-mgl">
            <el-button
              v-if="canModifyRole(scope.row)"
              class="button-op-edit"
              size="small"
              @click="handleEdit(scope.row.RoleId, 'Edit')"
              >编辑
            </el-button>
            <el-button
              v-if="canDisableRole(scope.row)"
              class="button-op-del"
              size="small"
              @click="handleStop(scope.row.RoleId)"
              >停用
            </el-button>
            <el-button
              v-if="canEnableRole(scope.row)"
              class="button-op-edit"
              size="small"
              @click="handleEnable(scope.row.RoleId)"
              >启用
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="pagination.PageStartRow"
        v-model:page-size="pagination.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pagination.total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchRoles, EnableRole, DisableRole } from "../../api/index.js";
export default {
  name: "role",
  setup() {
    const router = useRouter();
    const store = useStore();

    // 用户信息
    const loginUser = JSON.parse(Cookie.get("User") || "{}");

    // 搜索和状态
    const searchKeyword = ref("");
    const isLoading = ref(false);
    const tableData = ref([]);

    // 分页配置
    const pagination = reactive({
      currentPage: 1,
      pageSize: 15,
      total: 0,
    });

    /**
     * 获取角色列表数据
     */
    const fetchRoleData = async () => {
      isLoading.value = true;
      try {
        const res = await SearchRoles({
          PageStartRow: (pagination.currentPage - 1) * pagination.pageSize,
          PageRowCount: pagination.pageSize,
          SearchCondition: {
            search_keyword: searchKeyword.value,
          },
        });

        if (res.Code === 200) {
          tableData.value = res.DataMap.Data || [];
          pagination.total = res.DataMap.ToalCount;
        } else {
          ElMessage.warning(res.Message || "获取数据失败");
        }
      } catch (error) {
        console.error("获取角色数据出错:", error);
        ElMessage.error("获取角色数据出错");
      } finally {
        isLoading.value = false;
      }
    };

    // 防抖处理的搜索方法
    const handleSearch = () => {
      pagination.currentPage = 1;
      fetchRoleData();
    };

    // 分页变化
    const handlePageChange = (val) => {
      pagination.currentPage = val;
      fetchRoleData();
    };

    const handleSizeChange = (val) => {
      pagination.pageSize = val;
      pagination.currentPage = 1;
      fetchRoleData();
    };

    const query = reactive({
      UserID: "",
      title: "",
      search: {
        search_keyword: "",
      },
      PageStartRow: 1,
      PageRowCount: 15,
    });
    const tableLoading = ref(false);
    const pageTotal = ref(0);

    /**
     * 编辑角色
     */
    const handleEdit = (id, type) => {
      common.ClosePageTag("角色详情");
      router.push({
        path: "/roleInfo",
        query: {
          Type: type,
          ID: id,
        },
      });
    };
    /**
     * 新增角色
     */
    const handleAdd = () => {
      router.push({
        path: "/roleInfo",
        query: {
          Type: "Add",
        },
      });
    };
    /**
     * 启用角色
     */
    const handleEnable = (id) => {
      ElMessageBox.confirm("确定要启用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      })
        .then(async () => {
          try {
            const res = await EnableRole({
              ObjectId: id,
            });

            if (res.Code === 200) {
              pagination.currentPage = 1;
              fetchRoleData();
              ElMessage.success("启用成功");
            } else {
              ElMessage.warning(res.Message || "操作失败");
            }
          } catch (error) {
            console.error("启用角色出错:", error);
            ElMessage.error("操作失败");
          }
        })
        .catch(() => {
          // 用户取消操作
        });
    };
    /**
     * 停用角色
     */
    const handleStop = (id) => {
      ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
      })
        .then(async () => {
          try {
            const res = await DisableRole({
              ObjectId: id,
            });

            if (res.Code === 200) {
              pagination.currentPage = 1;
              fetchRoleData();
              ElMessage.success("停用成功");
            } else {
              ElMessage.warning(res.Message || "操作失败");
            }
          } catch (error) {
            console.error("停用角色出错:", error);
            ElMessage.error("操作失败");
          }
        })
        .catch(() => {
          // 用户取消操作
        });
    };

    // 权限判断逻辑
    const canModifyRole = (role) => {
      return (
        role.RoleCode !== "sys.superadmins" &&
        loginUser.UnitId === role.CreateUnitId
      );
    };
    const canDisableRole = (role) => {
      return (
        role.RoleCode !== "sys.superadmins" &&
        role.RoleStatus === 1 &&
        loginUser.UnitId === role.CreateUnitId
      );
    };

    const canEnableRole = (role) => {
      return (
        role.RoleCode !== "sys.superadmins" &&
        role.RoleStatus === 0 &&
        loginUser.UnitId === role.CreateUnitId
      );
    };
    // 监听路由变化，用于刷新数据
    watch(
      () => router.currentRoute.value,
      () => {
        const isRenovate = store.state.tags.tagsList.some(
          (row) => row.title === "角色"
        );
        const shouldRefresh =
          store.state.tags.pageSaerch.Search === 1 &&
          isRenovate &&
          store.state.tags.pageSaerch.titlePage === "角色";

        if (shouldRefresh) {
          pagination.currentPage = 1;
          fetchRoleData();
          store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
      }
    );
    // 初始化加载数据
    onMounted(() => {
      fetchRoleData();
    });
    return {
      searchKeyword,
      tableData,
      pagination,
      isLoading,
      handleSearch,
      handlePageChange,
      handleSizeChange,
      handleEdit,
      handleAdd,
      handleEnable,
      handleStop,
      loginUser,
      canModifyRole,
      canDisableRole,
      canEnableRole
    };
  },
};
</script>

<style scoped></style>
