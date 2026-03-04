<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
          </el-col>
          <el-col :span="5" :offset="1">
          </el-col>
          <el-col :span="5" :offset="1"></el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button class="button1 button-float" round @click="AddPage">
                <el-icon>
                  <Plus />
                </el-icon>&nbsp;&nbsp;新建权限
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row style="margin-top: 4px">
      <el-col :md="4">
        <div class="left" style="margin: 2px; border: solid 1px white">
          <el-tree :data="Treedata" :props="defaultProps" node-key="RightName" ref="tree"
            :default-expanded-keys="['统一权限管理系统']" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :md="20">
        <div class="right" style="margin: 2px; border: solid 1px white">
            <el-table :data="tableData.slice((query.pageIndex - 1) * query.pageSize, query.pageIndex * query.pageSize)"
            v-loading.body="loading" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column align="center" label="编码">
              <template #default="scope">
              <el-link :underline="false" @click="handleEdit(scope.$index, scope.row, 'view')" style="color: #f56c6c">
                {{ scope.row.RightCode }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="RightName" align="center" label="名称"></el-table-column>
            <el-table-column prop="DisplayIndex" align="center" label="次序"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template #default="scope">
              <div class="button-mgl">
                <el-button class="button-op-edit" size="small" @click="handleEdit(scope.$index, scope.row, 'Edit')">编辑
                </el-button>
              </div>

              <!-- <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
            </el-table>
          <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.pageIndex"
              v-model:page-size="query.pageSize" :page-sizes="[15, 50, 100]" :total="pageTotal"
              @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetAppList, GetSubRightList } from "../../api/index.js";
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import common from "@/utils/common.js";
export default {
  name: "jurisdiction",
  setup() {
    const router = useRouter();
    const query = reactive({
      AppName: "",
      Rightname: "",
      RightID: "",
      AppID: "",
      pageIndex: 1,
      pageSize: 15,
    });
    const loading = ref(false);
    const tableData = ref([]);
    let Treedata = ref([]);
    const defaultProps = {
      children: "childen",
      label: "RightName",
    };
    const pageTotal = ref(0);
    const handleNodeClick = (data) => {
      if (data.AppName) {
        query.AppName = data.AppName;
      } else {
        query.AppName = data.RightName;
      }
      query.Rightname = data.RightName;
      query.AppID = data.AppId;
      if (data.RightId) {
        query.RightID = data.RightId;
        getData(data.AppId, query.RightID);
      } else {
        getData(data.AppId, "");
      }
    };
    //新增权限
    const AddPage = () => {
      if (query.AppName != "") {
        common.ClosePageTag("权限编辑");
        router.push({
          path: "/jurisdictionEdit",
          query: {
            ParentRightID: query.RightID,
            Type: "Add",
            AppName: query.AppName,
            RightName: query.Rightname,
            AppID: query.AppID,
          },
        });
      } else {
        ElMessage.warning("请先点击应用");
        return;
      }
    };
    // 获取表格数据
    const getData = async (appid, id) => {
      let res = await GetSubRightList({
        RightId: id,
        AppId: appid,
      });
      if (res.Code == 200) {
        if (res.DataMap.length > 0) {
          tableData.value = res.DataMap;
        } else {
          tableData.value = [];
        }
        pageTotal.value = res.DataMap.length;
      }
    };
    getData(1, "");
    //获取左侧菜单
    const letfData = () => {
      GetAppList({
        ReturnRight: true,
        OnlyValid: true,
        CascadeRight: true,
      }).then((res) => {
        if (res.Code == 200) {
          const treedata_new = [];
          for (var m = 0; m < res.DataMap.length; m++) {
            if (true) {
              if (res.DataMap[m].Rightes.length > 0) {
                res.DataMap[m].childen = res.DataMap[m].Rightes;
                res.DataMap[m].RightName = res.DataMap[m].AppName;
              } else {
                res.DataMap[m].childen = [];
                res.DataMap[m].RightName = res.DataMap[m].AppName;
              }
              for (var i = 0; i < res.DataMap[m].Rightes.length; i++) {
                if (res.DataMap[m].Rightes[i].SubRightes) {
                  if (res.DataMap[m].Rightes[i].SubRightes.length > 0) {
                    res.DataMap[m].Rightes[i].childen =
                      res.DataMap[m].Rightes[i].SubRightes;
                  }
                }
              }
              treedata_new.push(res.DataMap[m]);
            }
          }
          Treedata.value = treedata_new; //res.DataMap;
        }
      });
    };
    letfData();
    //编辑or查看
    const handleEdit = (index, row, type) => {
      common.ClosePageTag("权限编辑");
      router.push({
        path: "/jurisdictionEdit",
        query: {
          AppName: query.AppName,
          ParentRightID: row.RightId,
          Type: type,
          RightName: row.RightName,
          RightID: row.RightId,
          AppID: query.AppId,
        },
      });
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };
    const handleSizeChange = (val) => {
      query.pageSize = val;
      getData();
    };
    return {
      query,
      letfData,
      tableData,
      pageTotal,
      loading,
      handlePageChange,
      handleSizeChange,
      handleNodeClick,
      Treedata,
      defaultProps,
      handleEdit,
      AddPage,
    };
  },
};
</script>
<style>

</style>
