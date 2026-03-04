<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-row class="card-box">
          <el-col :span="4">
            <div class="card">
              <el-row>
                <el-col :span="11">
                  <div class="card-img">
                    <img
                      style="width: 65px; height: 65px"
                      src="../../assets/imgs/img-order1.png"
                    />
                  </div>
                </el-col>
                <el-col :span="13">
                  <div class="card-text">
                    <div class="card-text-desc">卡券剩余</div>
                    <div class="card-text-number">200</div>
                    <div class="card-text-type">
                      卡券总量
                      <text>12332</text>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div></el-col
          >
          <el-col :span="4" :offset="1">
            <div class="card">
              <el-row>
                <el-col :span="11">
                  <div class="card-img">
                    <img
                      style="width: 65px; height: 65px"
                      src="../../assets/imgs/img-order2.png"
                    />
                  </div>
                </el-col>
                <el-col :span="13">
                  <div class="card-text">
                    <div class="card-text-desc">即将过期</div>
                    <div class="card-text-number">2000</div>
                    <div class="card-text-type">
                      过期总量
                      <text>3652</text>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div></el-col
          >
          <el-col :span="4" :offset="1">
            <div class="card">
              <el-row>
                <el-col :span="11">
                  <div class="card-img">
                    <img
                      style="width: 65px; height: 65px"
                      src="../../assets/imgs/img-order3.png"
                    />
                  </div>
                </el-col>
                <el-col :span="13">
                  <div class="card-text">
                    <div class="card-text-desc">今日兑换</div>
                    <div class="card-text-number">2000</div>
                    <div class="card-text-type">
                      对比昨日
                      <text>+12%</text>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div></el-col
          >
          <el-col :span="4" :offset="1">
            <div class="card">
              <el-row>
                <el-col :span="11">
                  <div class="card-img">
                    <img
                      style="width: 65px; height: 65px"
                      src="../../assets/imgs/img-order4.png"
                    />
                  </div>
                </el-col>
                <el-col :span="13">
                  <div class="card-text">
                    <div class="card-text-desc">今日销售</div>
                    <div class="card-text-number">200</div>
                    <div class="card-text-type">
                      对比昨日
                      <text>+12%</text>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div></el-col
          >
          <el-col :span="4" :offset="1">
            <div class="card">
              <el-row>
                <el-col :span="11">
                  <div class="card-img">
                    <img
                      style="width: 65px; height: 65px"
                      src="../../assets/imgs/img-order4.png"
                    />
                  </div>
                </el-col>
                <el-col :span="13">
                  <div class="card-text">
                    <div class="card-text-desc">今日发券</div>
                    <div class="card-text-number">200</div>
                    <div class="card-text-type">
                      对比昨日
                      <text>+12%</text>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div></el-col
          >
        </el-row>
        <el-form label-width="1px">
          <el-row>
            <el-col :span="6">
              <ul id="nav">
                <li
                  v-for="(item, index) in ulData"
                  :key="index"
                  :index="index"
                  :class="{ active: activeIndex == index, item: 'item' }"
                  @click="selectStyle(item, index)"
                >
                  {{ item.key }}
                </li>
              </ul>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-form-item label="">
                <el-input
                  v-model="query.search.search_keyword"
                  clearable
                  placeholder="请输入配送单号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-button class="button2" @click="handleSearch()"
                ><i class="el-icon-mppinleizengjia_o"></i
                >&nbsp;&nbsp;创建卡券</el-button
              >
              <el-button class="button2" @click="handleShow()"
                ><i class="el-icon-mpdaohang"></i
                >&nbsp;&nbsp;我要发券</el-button
              >
              <el-button class="button2" @click="handleAdd()"
                ><i class="el-icon-mptianmaohaoquan"></i
                >&nbsp;&nbsp;我要卖券</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="list-card">
            <div
              class="list-info"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="list-info-detail">
                <div class="list-info-detail_1">{{ item.CreateUnitName }}</div>
                <div class="list-info-detail_2"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="pagination">
        <el-pagination
          background
          layout="->,total, sizes, prev, pager, next"
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

<script setup>
import { ref, reactive } from "vue";
import md5 from "js-md5";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchTicketTemplateBatchs } from "@/api/ticket.js";

const router = useRouter();
const query = reactive({
  search: {
    search_keyword: "",
    ticket_template_status: "",
  },
  PageStartRow: 1,
  PageRowCount: 20,
});
const ulData = reactive([
  { value: "", key: "全部卡券" },
  { value: "1", key: "有效中" },
  { value: "2", key: "已过期" },
  { value: "3", key: "已取消" },
]);
const activeIndex = ref(0);
const tableData = ref([]);
const pageTotal = ref(0);

//* 操作*//
const selectStyle = async (item, index) => {
  activeIndex.value = index;
};
// 获取表格数据
const getData = async () => {
  let res = await SearchTicketTemplateBatchs({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  if (res.Code == 200) {
    tableData.value = res.DataMap.Data;
    pageTotal.value = res.DataMap.ToalCount;
  }
};
getData();

// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
const handleShow = () => {};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};

const handleEdit = (ID, type) => {
  router.push({
    path: "/roleInfo",
    query: {
      Type: type,
      ID: ID,
    },
  });
};
//新增任务
const handleAdd = () => {
  router.push({
    path: "/roleInfo",
  });
};
</script>

<style scoped>
.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 150px;
}
.card-text {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.card-text-desc {
  color: #797979;
  font-size: 16px;
  letter-spacing: 1px;
}
.card-text-number {
  color: #f56c6c;
  font-weight: 600;
  font-size: 24px;
}
.card-text-type {
  font-size: 12px;
  color: #797979;
}
.card-text-type text {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}
#nav {
  list-style-type: none;
  border: solid 1px #dcdfe6;

  border-radius: 4px;
}
.item {
  display: inline-block;
  letter-spacing: 1px;
  width: 25%;
  height: 31px;
  line-height: 31px;
  text-align: center;
  font-size: 14px;
  color: #6a6a6a;
}
.active {
  background-color: #f56c6c;
  color: white;
}
.list-card {
  width: 100%;
  height: auto;
  padding-bottom: 30px;
}
.list-info {
  float: left;
  width: 320px;
  border-radius: 10px;
}
.list-info-detail {
  position: relative;
  margin: 8px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.07);
  -moz-box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.07);
  /* border: solid 1px red; */
}
.list-info-detail_1 {
  height: 140px;
  background-color: #fff;
}
.list-info-detail_2 {
  background-color: #f56c6c;
  height: 40px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
