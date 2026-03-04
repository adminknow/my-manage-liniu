<template>
    <div class="container">
        <div class="handle-box">
            <h3 style="padding-bottom:12px">{{ info.TicketTemplateCode + ' - ' + info.TicketTemplateTitle }}</h3>
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="">
                            <el-input v-model="query.search.search_keyword" clearable
                                placeholder="请输入编码/名称/地址/联系人/联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="1">

                    </el-col>
                    <el-col :span="5" :offset="1">

                    </el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button v-if="IsRight" class="button2 button-float" round @click="handleAdd()">
                                <el-icon>
                                    <Plus />
                                </el-icon>&nbsp;&nbsp;新增门店
                            </el-button>
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
        <el-table :data="tableData" border class="table" v-loading="tableLoading"
            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
            <el-table-column align="left" label="门店信息">
                <template #default="scope">
                    <p>{{ scope.row.PickupUnit.UnitCode + "  " + scope.row.PickupUnit.UnitName }}</p>
                    <p>{{ scope.row.PickupUnit.UnitCityName + "  " + scope.row.PickupUnit.UnitAddress }}</p>
                    <p>{{ scope.row.PickupUnit.UnitContact + "  " + scope.row.PickupUnit.UnitTel }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="PickupBeginDate" align="center" label="兑换开始时间" width="180">
            </el-table-column>
            <el-table-column prop="PickupEndDate" align="center" label="兑换结束时间" width="180">
            </el-table-column>
            <el-table-column prop="" align="left" label="创建信息" width="250">
                <template #default="scope">
                    <p>创建单位：{{ scope.row.CreateUnitName }}</p>
                    <p>创建人：{{ scope.row.CreateUserName }}</p>
                    <p>{{ scope.row.CreateTime }}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="button-mgl">
                        <el-button v-if="(loginUser.UnitId == scope.row.CreateUnitId && IsRight)" class="button-op-del"
                            size="small" @click="handleDel(scope.row.PickupUnitId)">删除
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
        <!-- 选择兑换点弹出框 -->
        <el-dialog title="门店" class="padding_top" v-model="PointVisible" width="60%" :show-close="false" :close-on-click-modal="false">
            <ticketPoint ref="editor" @selectPointValue="selectPointValue" :openPointTable="openPointTable">
            </ticketPoint>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button1" :loading="pointLoading" @click="savePointModalBtn">保 存</el-button>
                    <el-button class="button2" @click="closePointModalBtn">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>


import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchTicketTemplatePickupUnites, DeleteTicketTemplatePickupUnites } from "@/api/order.js";
import { GetTicketTemplateById } from "@/api/ticket.js";
import ticketPoint from "@/components/common/ticket_point.vue";
import { AddTicketTemplatePickupUnites } from "@/api/order.js";
import { HasRightes } from "@/api/index.js";
import Cookie from "js-cookie";
const router = useRouter();
const query = reactive({
    search: {
        search_keyword: "",
        ticket_template_id: router.currentRoute.value.query.ID
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const info = reactive({
    TicketTemplateCode: "",
    TicketTemplateTitle: ""
});

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    let res = await SearchTicketTemplatePickupUnites({
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
const loginUser = JSON.parse(Cookie.get("User"));
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
//停用
const handleDel = (ID) => {
    ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async () => {
            let res = await DeleteTicketTemplatePickupUnites({
                PickupUnitIds: [ID],
                TicketTemplateId: router.currentRoute.value.query.ID
            });
            if (res.Code == 200) {
                query.PageStartRow = 1;
                getData();
                ElMessage.success("操作成功");
            } else {
                ElMessage.warning(res.Message);
            }
        })
        .catch(() => { });
};

const GetTicketTemplateByID = async (ID) => {
    // 获取品牌
    let res = await GetTicketTemplateById({
        TicketTemplateId: ID,
        ReturnStatData: false,
    })
    if (res.Code == 200) {
        //所有保存的数据
        info.TicketTemplateTitle = res.DataMap.TicketTemplateTitle;
        info.TicketTemplateCode = res.DataMap.TicketTemplateCode;
    }
};

//添加兑换点
const PointVisible = ref(false);
const TicketTemplateId = ref("");
const pointLoading = ref(false);
const openPointTable = ref(false);
const PickupUnites = ref([]);
const BeginDate = ref("");
const EndaDate = ref("");
const selectPointValue = (postVal) => {
    PickupUnites.value = postVal.list
    if (postVal.type == "time") {
        BeginDate.value = postVal.dateValue1;
        EndaDate.value = postVal.dateValue2;
    }
};
//保存已选择的提货点
const savePointModalBtn = async () => {
    pointLoading.value = true;
    let PickupArr = [];
    if (PickupUnites.value.length == 0) {
        ElMessage.error(`请选择兑换点`);
        pointLoading.value = false;
        return;
    }
    PickupUnites.value.forEach(row => {
        PickupArr.push(row.UnitId);
    })
    let res = await AddTicketTemplatePickupUnites({
        PickupUnitIds: PickupArr,
        TicketTemplateId: TicketTemplateId.value,
        BeginDate: BeginDate.value,
        EndaDate: EndaDate.value,
    })
    pointLoading.value = false;
    openPointTable.value = false;
    if (res.Code == 200) {
        PointVisible.value = false;
        ElMessage.success(res.DataMap);
        query.PageStartRow = 1;
        getData();
    } else {
        ElMessage.info(res.Message);
        return;
    }
};
const closePointModalBtn = () => {
    openPointTable.value = false;
    PointVisible.value = false;
};
const handleAdd = () => {
    PointVisible.value = true;
    openPointTable.value = true;
};
if (router.currentRoute.value.query.ID) {
    GetTicketTemplateByID(router.currentRoute.value.query.ID)
    TicketTemplateId.value = router.currentRoute.value.query.ID;
}

const IsRight = ref(false);
const BoolRight = async () => {
    let arr = ["edit_tickettemplate"];
    let res = await HasRightes({ RightCodes: arr });
    if (res.Code == 200) {
        IsRight.value = res.DataMap.edit_tickettemplate;
    }
};
//新增和删除权限控制
BoolRight()
</script>

<style scoped></style>
