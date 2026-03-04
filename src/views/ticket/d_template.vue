<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-input v-model="query.search.template_name" clearable placeholder="请输入模板名称">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-form-item label="">
                            <el-select v-model="query.search.template_status" clearable style="width: 100%"
                                placeholder="请选择模板状态">
                                <el-option label="正常" value="1"></el-option>
                                <el-option label="停用" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1"></el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
                            <el-button class="button2 button-float" round @click="handleAdd()">
                                <el-icon>
                                    <Plus />
                                </el-icon>&nbsp;&nbsp;新&nbsp;&nbsp;增&nbsp;&nbsp;
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
            <el-table-column align="center" label="模板名称">
                <template #default="scope">
                    <el-link :underline="false" @click="handleEdit(scope.row.TemplateId, 'View')" style="color: #f56c6c">
                        {{ scope.row.TemplateName }}</el-link>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否免费配送">
                <template #default="scope">
                    <p v-if="scope.row.HasFee==1">否</p>
                    <p v-if="scope.row.HasFee==0">是</p>
                </template>
            </el-table-column>
            <el-table-column prop="TemplateRemark" align="center" label="备注" width="250">
            </el-table-column>
            <el-table-column prop="TemplateStatusDesc" align="center" label="状态" width="100"></el-table-column>
            <el-table-column prop="CreateUnitName" align="center" label="创建单位" width="160">
            </el-table-column>
            <el-table-column prop="CreateUserName" align="center" label="创建人" width="160">
            </el-table-column>
            <el-table-column prop="CreateTime" align="center" label="创建时间" width="160">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template #default="scope">
                    <div class="button-mgl">
                        <el-button v-if="loginUser.UnitId == scope.row.CreateUnitId" class="button-op-edit" size="small"
                            @click="handleEdit(scope.row.TemplateId, 'Edit')">编辑
                        </el-button>
                        <el-button v-if="(scope.row.TemplateStatus == 1 && loginUser.UnitId == scope.row.CreateUnitId)"
                            class="button-op-del" size="small" @click="handleDel(scope.row.TemplateId)">停用
                        </el-button>
                        <el-button v-if="(scope.row.TemplateStatus == 0 && loginUser.UnitId == scope.row.CreateUnitId)"
                            class="button-op-enable" size="small" @click="handleEnable(scope.row.TemplateId)">启用
                        </el-button>
                        <el-button v-if="(loginUser.UnitId == scope.row.CreateUnitId)" class="button-op-edit" size="small"
                            @click="handleBind(scope.row.CreateUnitId, scope.row.TemplateId,scope.$index)">绑定的卡券
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 绑定的卡券 -->
        <el-dialog class="bind_up" :title="titleModal" v-model="tickeyVisible" width="58%" :show-close="false">
            <div class="handle-box">
                <el-form label-width="1px">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="">
                                <el-input v-model="queryModal.search.search_keyword" clearable placeholder="请输入关键字"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        </el-col>
                        <el-col :span="2"></el-col>
                        <el-col :span="6" :offset="1">
                            <div class="button-mgl">
                                <el-button class="button1 button-float" round @click="handleSearchModal()">
                                    <el-icon>
                                        <Search />
                                    </el-icon>&nbsp;&nbsp;查&nbsp;&nbsp;询
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table height="400" :data="tableDataModal" border class="table" v-loading="tableLoadingModal"
                ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column align="center" label="类型" width="130">
                    <template #default="scope">
                        <p>{{ scope.row.TicketTemplateTypeDesc2 }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="批次号" width="130">
                    <template #default="scope">
                        <p>{{ scope.row.TicketTemplateCode }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称" >
                    <template #default="scope">
                        <p>{{ scope.row.TicketTemplateTitle }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="有效期" >
                    <template #default="scope">
                        <p>{{ scope.row.ValidDateDesc }}</p>
                        <img v-if="scope.row.DeliverType == 21 || scope.row.DeliverType == 22"
                            class="list-info-detail_1-point"
                            src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/pick_up_1.png"
                            style="width:86.4px;height:13.92px" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="面值(元)" width="100">
                    <template #default="scope">
                        <p>{{ (scope.row.OrgPrice / 100).toFixed(2) }}</p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="->,total, sizes, prev, pager, next"
                    v-model:currentPage="queryModal.PageStartRow" v-model:page-size="queryModal.PageRowCount"
                    :page-sizes="[15, 50, 100]" :total="pageTotalModal" @current-change="handlePageChange"
                    @size-change="handleSizeChange"></el-pagination>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button2" @click="tickeyVisible = false">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { GetExpressTemplateList, DisableExpressTemplate, EnableExpressTemplate, SearchTicketTemplates } from "../../api/ticket.js";
const store = useStore();
const router = useRouter();
const query = reactive({
    search: {
        template_name: "",
        template_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    let res = await GetExpressTemplateList({
        SearchCondition: query.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        if (res.DataMap) {
            tableData.value = res.DataMap;
        } else {
            tableData.value = []
        }
    }
};
getData();
const loginUser = JSON.parse(Cookie.get("User"));
// 查询操作
const handleSearch = () => {
    query.PageStartRow = 1;
    getData();
};
const handleSearchModal = () => {
    queryModal.PageStartRow = 1;
    getDataModal();
};

//新增商品
const handleAdd = () => {
    router.push({
        path: "/distribution_template",
        query: {
            Type: "Add",
        },
    });
};
// 分页导航
const handlePageChange = (val) => {
    queryModal.PageStartRow = val;
    getDataModal();
};
const handleSizeChange = (val) => {
    queryModal.PageRowCount = val;
    getDagetDataModalta();
};
//编辑
const handleEdit = (ID, type) => {
    router.push({
        path: "/distribution_template",
        query: {
            Type: type,
            ID: ID,
        },
    });
};
//启用
const handleEnable = (ID) => {
    ElMessageBox.confirm("确定要启用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await EnableExpressTemplate({
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
//停用
const handleDel = (ID) => {
    ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async () => {
            let res = await DisableExpressTemplate({
                ObjectId: ID,
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
const titleModal = ref("");
const handleBind = (ID, TemplateId,Index) => {
    queryModal.search.search_keyword="";
    queryModal.search.create_unit_id = ID;
    queryModal.search.express_template_id = TemplateId;
    titleModal.value=tableData.value[Index].TemplateName+" - 绑定的卡券";
    getDataModal();
    tickeyVisible.value = true;
};

const tickeyVisible = ref(false);
const tableLoadingModal = ref(false);
const tableDataModal = ref([]);
const pageTotalModal = ref(0);
const queryModal = reactive({
    search: {
        search_keyword: "",
        create_unit_id: "",
        express_template_id: "",
        not_get_stat_data:1,
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const getDataModal = async () => {
    tableLoadingModal.value = true;
    let res = await SearchTicketTemplates({
        PageStartRow: (queryModal.PageStartRow - 1) * queryModal.PageRowCount,
        PageRowCount: queryModal.PageRowCount,
        SearchCondition: queryModal.search,
    });
    tableLoadingModal.value = false;
    if (res.Code == 200) {
        tableDataModal.value = res.DataMap.Data ? res.DataMap.Data : [];
        pageTotalModal.value = res.DataMap.ToalCount;
    }
};
watch(
    () => router.currentRoute.value,
    (data) => {
        let isRenovate = 0;
        store.state.tags.tagsList.forEach(row => {
            if (row.title == "模板列表") {
                isRenovate = 1
            }
        });
        if (store.state.tags.pageSaerch.Search == 1 && isRenovate == 1 && store.state.tags.pageSaerch.titlePage == "模板列表") {
            query.PageStartRow = 1;
            getData();
            store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
        }
    },
);
</script>

<style >
.bind_up .el-dialog__body {
    padding-top: 10px !important;
}
</style>
