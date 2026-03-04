<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ticket_template' }">
          <i class="el-icon-mpyemian"></i> 券模板
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
              <el-form-item label="状态">
                <el-input
                  v-model="query.ticket_status"
                  clearable
                  placeholder=""
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
          prop="TicketTemplateTitle"
          align="center"
          label="标题"
        ></el-table-column>
        <el-table-column
          prop="TicketTemplateCode"
          align="center"
          label="编码"
        ></el-table-column>
        <el-table-column
          prop="TicketTemplateSubTitle"
          align="left"
          label="副标题"
        ></el-table-column>

        <el-table-column
          prop="OrgPrice"
          align="center"
          label="原价(元)"
          width="80"
        >
          <template #default="scope">
            <p v-if="scope.row.OrgPrice">{{ scope.row.OrgPrice / 100 }}</p>
          </template></el-table-column
        >
        <el-table-column prop="" align="center" label="有效日期类型">
          <template #default="scope">
            <p v-if="scope.row.ValidDateType == 1">固定日期内有效</p>
            <p v-if="scope.row.ValidDateType == 0">无有效日期限制</p>
            <p v-if="scope.row.ValidDateType == 2">购买之日起多少天内有效</p>
          </template></el-table-column
        >
        <el-table-column prop="ValidDateDesc" align="left" label="描述">
          <template #default="scope">
            <p>
              图片：
              <img
                style="width: 100px; height: 100px"
                :src="scope.row.ListImg ? scope.row.ListImg : ''"
              />
            </p>
            <p>有效期：{{ scope.row.ValidDateDesc }}</p>
            <p>兑换期：{{ scope.row.ExchangeDateDesc }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" align="center" label="兑换说明">
          <template #default="scope">
            <el-popover
              placement="top-start"
              title="详情"
              :width="200"
              trigger="hover"
              :content="scope.row.ExchangeRemark"
            >
              <template #reference>
                <p>{{ scope.row.ExchangeRemark.substring(0, 10) }}...</p>
              </template>
            </el-popover>
          </template></el-table-column
        >

        <el-table-column prop="" align="center" label="状态">
          <template #default="scope">
            <p v-if="scope.row.TicketTemplateStatus == 1">正常</p>
            <p v-if="scope.row.TicketTemplateStatus == 0">停用</p>
          </template></el-table-column
        >
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          v-model:currentPage="tableParameter.PageStartRow"
          v-model:page-size="tableParameter.PageRowCount"
          :page-sizes="[15, 50, 100]"
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
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { SearchTicketTemplates } from "../../api/ticket.js";

export default {
  name: "ticketlist",
  setup() {
    const router = useRouter();
    const tableLoading = ref(false);
    const query = reactive({
      ticket_status: "",
    });
    const tableParameter = reactive({
      PageStartRow: 1,
      PageRowCount: 15,
    });
    const pageTotal = ref(0);
    const tableData = ref([]);
    // 获取表格数据
    const getData = async () => {
      let data = query;
      tableLoading.value = true;
      let res = await SearchTicketTemplates({
        PageStartRow:
          (tableParameter.PageStartRow - 1) * tableParameter.PageRowCount,
        PageRowCount: tableParameter.PageRowCount,
        NoPage: false,
        SearchCondition: data,
      });
      tableLoading.value = false;
      if (res.Code == 200) {
        tableData.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotal.value = res.DataMap.ToalCount;
      } else {
        ElMessage.error(res.Message);
      }
    };
    getData();
    // 查询操作
    const handleSearch = () => {
      tableParameter.PageStartRow = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      tableParameter.PageStartRow = val;
      getData();
    };
    const handleSizeChange = (val) => {
      tableParameter.PageRowCount = val;
      getData();
    };
    return {
      query,
      tableParameter,
      tableLoading,
      handleSearch,
      tableData,
      handlePageChange,
      handleSizeChange,
    };
  },
};
</script>

<style scoped></style>
