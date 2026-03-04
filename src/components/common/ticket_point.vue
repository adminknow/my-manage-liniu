<template>
    <div class="">
        <div class="handle-box" style="padding: 0;">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="2">
                        <el-form-item label="兑换时间从" label-width="400">
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <!-- <el-form-item label="">
                            <el-date-picker v-model="value1"  type="datetime" placeholder="提货开始日期" />
                        </el-form-item> -->
                        <el-date-picker v-model="time" @change="changeValue1" type="datetimerange" range-separator="到"
                            start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <!-- <el-form-item label="">
                            <el-date-picker v-model="value2" @change="changeValue2" type="datetime" placeholder="提货结束日期" />
                        </el-form-item> -->
                    </el-col>

                    <el-col :span="6" :offset="1">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.search_keyword" clearable placeholder="请输入名称/编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">

                    </el-col>
                    <el-col :span="5" :offset="1">

                    </el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button class="button1 button-float" round @click="handleSearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table :data="tableData" ref="multipleTable" border class="table" v-loading="tableLoading"
            @selection-change="handleSelectionChange" :header-cell-style="{ 'text-align': 'center' }"
            header-cell-class-name="table-header" style="width: 100%">
            <el-table-column type="selection" align="center" width="40" />
            <!-- <el-table-column prop="UnitId" align="center" label="ID" width="50"></el-table-column> -->
            <el-table-column prop="UnitCode" align="center" label="编码" width="100"></el-table-column>
            <el-table-column prop="UnitName" align="center" label="名称">
            </el-table-column>
            <el-table-column prop="UnitCityName" align="center" label="城市"></el-table-column>
            <el-table-column prop="UnitAddress" align="center" label="地址"></el-table-column>
            <!-- <el-table-column prop="UnitContact" align="center" label="联系人" width="90"></el-table-column> -->
            <el-table-column prop="UnitTel" align="center" label="电话" width="160"></el-table-column>
            <el-table-column prop="UnitStatusDesc" label="状态" align="center" width="60"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
                v-model:page-size="query.PageRowCount" :page-sizes="[5, 20, 100]" :total="pageTotal"
                @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
        </div>
    </div>
</template>
    
<script setup>
import { ref, reactive, toRefs,  watch } from "vue";
import { SearchUnites } from "../../api/index.js";
import common from "@/utils/common.js";

const props = defineProps({
    //子组件接收父组件传递过来的值
    openPointTable: Boolean,
})
// //使用父组件传递过来的值
const { openPointTable } = toRefs(props)

watch(
    () => props.openPointTable,
    (newValue, oldValue) => {
        if (newValue) {
            getData();
            changeValue1();
            time.value = [];
        }
    },
);
const emit = defineEmits(['clickChild'])
const multipleTable = ref(null);
const multipleSelection = ref([])
const query = reactive({
    search: {
        filter: "",
        unit_type: "33",
        search_keyword: "",
        unit_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 5,
});
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const value1 = ref("");
const value2 = ref("");
const time = ref([]);



// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    let res = await SearchUnites({
        PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
        PageRowCount: query.PageRowCount,
        SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        if (res.DataMap.Data) {
            tableData.value = res.DataMap.Data;
        } else {
            tableData.value = []
        }

        pageTotal.value = res.DataMap.ToalCount;
    }
};
getData();

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

const changeValue1 = (val) => {
    let dateValue1 = "";
    let dateValue2 = "";
    if (val) {
        if (val.length > 0) {
            dateValue1 = common.dateFormat("YYYY-mm-dd HH:MM:SS", val[0]);
            dateValue2 = common.dateFormat("YYYY-mm-dd HH:MM:SS", val[1]);
        }
    }
    //传递给父组件
    let postData = {
        list: multipleSelection.value,
        dateValue1: dateValue1,
        dateValue2: dateValue2,
        type: "time"
    };
    emit('selectPointValue', postData)
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    //传递给父组件
    let postData = {
        list: val,
        dateValue1: value1.value,
        dateValue2: value2.value,
        type: "arr"
    };
    emit('selectPointValue', postData)
}
</script>
<style scoped></style>