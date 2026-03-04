<template>
    <div class="container">
        <div class="handle-box">
            <el-form label-width="1px">
                <el-row>
                    <el-col :span="5">
                        <!-- <el-form-item label="">
                            <el-input v-model="query.search.bill_name" clearable placeholder="请输入姓名">
                            </el-input>
                        </el-form-item> -->
                        <el-form-item label="">
                            <el-select v-model="query.search.bill_status" clearable style="width: 100%" placeholder="请选择状态">
                                <el-option label="待处理" value="0"></el-option>
                                <!-- <el-option label="已删除" value="-1"></el-option> -->
                                <el-option label="已处理" value="1000"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <!-- <el-form-item label="">
                            <el-date-picker style="width:100%" v-model="query.search.time" type="daterange"
                                range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="5" :offset="1">
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <div class="button-mgl">
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
            <el-table-column prop="VipName" align="center" label="会员姓名"></el-table-column>
            <el-table-column prop="VipCell" align="center" label="会员电话">
            </el-table-column>
            <el-table-column prop="FieldV1" align="center" label="联系方式">
            </el-table-column>
            <el-table-column align="center" label="反馈类型">
                <template #default="scope">
                    <p v-if="scope.row.FieldI1 == 1">建议</p>
                    <p v-if="scope.row.FieldI1 == 2">缺陷</p>
                </template>
            </el-table-column>
            <el-table-column prop="FieldLv1" align="center" label="反馈内容"></el-table-column>
            <el-table-column prop="CreateTime" align="center" label="提交时间"></el-table-column>
            <el-table-column label="状态" align="center">
                <template #default="scope">
                    <p>{{ scope.row.BillStatusDesc }}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="button-mgl">
                        <el-button v-if="scope.row.AttachmentFileCount>0" class="button-op-edit" size="small" @click="handleView(scope.row.BillId)">文件查看
                        </el-button>
                        <el-button v-if="scope.row.BillStatus == 0" class="button-op-del" size="small"
                            @click="handleDel(scope.row.BillId)">已处理
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
        <!-- 编辑弹出框 -->
        <el-dialog title="图片查看" v-model="editVisible" width="38%" :show-close="true">
            <el-row :gutter="24">
                <el-col :span="24">
                    <img :src="imgArr[imgIndex].FileUrl" style="width:100%" />
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button1" @click="lastPage">上一张</el-button>
                    <el-button class="button2" @click="nextPage">下一张</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import common from "@/utils/common.js";
import { GetObjectFileList } from "../../api/common.js";
import { SearchApplyBills, CloseApplyBill } from "../../api/bill.js";
const router = useRouter();
const query = reactive({
    search: {
        bill_name: "",
        bill_status: "",
        time: [],
        bill_type: "c_feedback",
        bill_date_begin: "",
        bill_date_end: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

const editVisible = ref(false);
const imgArr = ref([]);
const imgIndex = ref(0);

const tableLoading = ref(false);
const tableData = ref([]);

const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    if (query.search.time) {
        if (query.search.time.length > 0) {
            query.search.bill_date_begin = common.dateFormat("YYYY-mm-dd", query.search.time[0]);
            query.search.bill_date_end = common.dateFormat("YYYY-mm-dd", query.search.time[1]);
        }
    }
    let res = await SearchApplyBills({
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
//编辑
const handleEdit = (ID, type) => {
    router.push({
        path: "/commodity_info",
        query: {
            Type: type,
            ID: ID,
        },
    });

};
//停用
const handleStop = (ID) => {
    ElMessageBox.confirm("确定要停用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await DisableUser({
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
//启用
const handleEnable = (ID) => {
    ElMessageBox.confirm("确定要启用吗？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await EnableUser({
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
//删除
const handleDel = (ID) => {
    ElMessageBox.prompt('请输入备注', '关闭单据', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    })
        .then(async ({ value }) => {
            let res = await CloseApplyBill({
                BillId: ID,
                Remark: value,
            })
            if (res.Code == 200) {
                ElMessage({
                    type: 'success',
                    message: "操作成功",
                })
                query.PageStartRow = 1;
                getData();
            } else {
                ElMessage({
                    type: 'error',
                    message: res.Message,
                })
            }

        })
        .catch(() => {
        })
};
//查看图片
const handleView = async (ID) => {
    let res = await GetObjectFileList({
        ObjectType: "apply_bill",
        ObjectId: ID,
        FileType: "",
    })
    if (res.Code == 200) {
        if (res.DataMap.length > 0) {
            imgIndex.value = 0;
            editVisible.value = true
            imgArr.value = res.DataMap;
        } else {
            ElMessage({
                type: 'info',
                message: "当前暂无文件",
            })
        }
    }
};
const lastPage = () => {
    if (imgIndex.value-- == 0) {
        imgIndex.value = 0
        ElMessage({
            type: 'info',
            message: "已经是第一张了",
        })
    } else {
        imgIndex.value = imgIndex.value--
    }

};
const nextPage = () => {
    if (imgIndex.value++ == (imgArr.value.length - 1)) {
        imgIndex.value = imgArr.value.length - 1
        ElMessage({
            type: 'info',
            message: "已经是最后一张了",
        })
    } else {
        imgIndex.value = imgIndex.value++
    }
};


</script>
  
<style scoped></style>
  