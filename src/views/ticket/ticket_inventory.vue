<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.search_keyword" clearable placeholder="请输入批次号/品牌/名称">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select v-model="query.search.display_status" placeholder="请选择类型" style="width: 100%">
                                <el-option label="全部" value="0" />
                                <el-option label="有效中" value="1" />
                                <el-option label="已过期" value="2" />
                                <el-option label="已取消" value="3" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-date-picker v-model="query.search.time" type="daterange" :default-time="defaultTime2"
                                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
                        </el-form-item></el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button class="button2 button-float" round @click="handleOut()">导&nbsp;&nbsp;出
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
            <el-table-column prop="TicketTemplateTypeDesc2" align="center" label="类型" width="160"></el-table-column>
            <el-table-column prop="TicketTemplateCode" align="center" label="批次号" width="160"></el-table-column>
            <el-table-column prop="BrandName" align="center" label="品牌" width="160"></el-table-column>
            <el-table-column prop="TicketTemplateTitle" align="center" label="名称"></el-table-column>
            <el-table-column align="center" label="面值(元)" width="160">
                <template #default="scope">
                    <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="TicketCount" align="center" label="总数" width="100"></el-table-column>
            <el-table-column prop="SaleCount" align="center" label="已售" width="100"></el-table-column>
            <el-table-column prop="TakeCount" align="center" label="已发放" width="100"></el-table-column>
            <el-table-column prop="ExchangeCount" align="center" label="已兑" width="100"></el-table-column>
            <el-table-column prop="LeftCount" align="center" label="剩余" width="100"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
                v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
                @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import common from "@/utils/common.js";
import { SearchTicketTemplateQty } from "@/api/ticket.js";

const query = reactive({
    search: {
        search_keyword: "",
        create_time_begin: "",
        create_time_end: "",
        display_status: '1',
        time: [],
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

const defaultTime2 = [
    new Date(2023, 1, 1, 0, 0, 0),
    new Date(2023, 2, 1, 23, 59, 59),
];
const init = async () => {
    //三个月
    const end = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    );
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    query.search.time = [start, end];
    // getData();
};

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    query.search.create_date_begin = "";
    query.search.create_date_end = "";
    if (query.search.time) {
        if (query.search.time.length > 0) {
            query.search.create_date_begin = common.dateFormat(
                "YYYY-mm-dd",
                query.search.time[0]
            );
            query.search.create_date_end = common.dateFormat(
                "YYYY-mm-dd",
                query.search.time[1]
            );
        }
    }
    let res = await SearchTicketTemplateQty({
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
const handleOut = () => {
    //导出
    ElMessageBox.confirm("是否确认导出？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async () => {
            tableLoading.value = true;
            query.search.create_date_begin = "";
            query.search.create_date_end = "";
            if (query.search.time) {
                if (query.search.time.length > 0) {
                    query.search.create_date_begin = common.dateFormat(
                        "YYYY-mm-dd",
                        query.search.time[0]
                    );
                    query.search.create_date_end = common.dateFormat(
                        "YYYY-mm-dd",
                        query.search.time[1]
                    );
                }
            }
            let res = await SearchTicketTemplateQty({
                PageStartRow: 0,
                PageRowCount: 100000,
                SearchCondition: query.search,
                NoPage: true,
            });
            tableLoading.value = false;
            if (res.Code == 200) {
                if (!res.DataMap.Data) {
                    ElMessage.error("当前暂无数据");
                    return;
                }
                tableData.value = res.DataMap.Data;
                var myDate = new Date();
                myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                myDate.getMonth(); //获取当前月份(0-11,0代表1月)
                var time =
                    myDate.getFullYear() +
                    "-" +
                    (myDate.getMonth() + 1) +
                    "-" +
                    myDate.getDate();

                import("../../vendor/Export2Excel").then((excel) => {
                    const tHeader = [
                        "类型",
                        "批次号",
                        "品牌",
                        "名称",
                        "面值(元)",
                        "总数",
                        "已售",
                        "已发放",
                        "已兑",
                        "剩余",
                    ];
                    const filterVal = [
                        "TicketTemplateTypeDesc2",
                        "TicketTemplateCode",
                        "BrandName",
                        "TicketTemplateTitle",
                        "OrgPriceDesc",
                        "TicketCount",
                        "SaleCount",
                        "TakeCount",
                        "ExchangeCount",
                        "LeftCount"
                    ];
                    res.DataMap.Data.forEach((row) => {
                        row.OrgPriceDesc = (row.OrgPrice / 100).toFixed(2);
                    });
                    const data = formatJson(filterVal, res.DataMap.Data);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data: data,
                        filename: "卡券库存数据导出" + time,
                        autoWidth: true,
                    });
                });
            }
        })
        .catch(() => { });
};
const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
init();
//////////////////////////////////////////////////////////////////////////////////////////////////////////
</script>

<style scoped></style>
