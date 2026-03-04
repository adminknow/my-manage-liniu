<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <div class="list-card" v-if="true">
                    <div class="list-info">
                        <div class="list-info-detail">
                            <div class="list-info-detail-info">
                                <el-row>
                                    <el-col :span="2">
                                        <div class="card-img">
                                            <img @click="handleOpenQr(FormData.TakeWxxcxQRCode)"
                                                :src="FormData.TakeWxxcxQRCode" style="width:80px;height:80px" />
                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                创建时间
                                            </div>
                                            <div class="list-info-detail-info-tr">
                                                {{ FormData.CreateTime }}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                发券备注
                                            </div>
                                            <div class="list-info-detail-info-tr">
                                                {{ FormData.TakeRemark }}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                销售券
                                            </div>
                                            <div class="list-info-detail-info-tr">
                                                <div v-for="(obj, index) in FormData.TicketTemplateDetails"
                                                    :key="index">
                                                    {{ obj.TicketTemplateCode+'-'+obj.TicketTemplateTitle + "：" + obj.TicketCount + "张" }}</div>
                                                <p>总数：{{ FormData.TicketCount + "张" }}</p>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                发券类型
                                            </div>
                                            <div class="list-info-detail-info-tr">
                                                {{ FormData.TakeTypeDesc }}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                领取进度({{ FormData.TakePercent }}%)
                                            </div>
                                            <div class="list-info-detail-info-tr" style="width:100%;text-align:center">
                                                <div style="height:15.67px"></div>
                                                <el-progress :percentage="FormData.TakePercent" :show-text="false" />
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                                未领(张)
                                            </div>
                                            <div class="list-info-detail-info-tr send-number">
                                                {{ FormData.TicketCount - FormData.TakenCount }}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="3">
                                        <div class="list-info-detail-info-th flex-col justify-center items-center ">
                                            <div class="list-info-detail-info-td">
                                            </div>
                                            <div class="list-info-detail-info-tr send-number">
                                                <el-button
                                                class="button1 button-float"
                                                round
                                                @click="refreshBtn()"
                                                >
                                                <el-icon> <refresh /> </el-icon
                                                >&nbsp;&nbsp;刷&nbsp;&nbsp;新&nbsp;&nbsp;
                                                </el-button>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="4">

                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="发券信息" name="first">
                        <div v-if="true">
                            <el-row style="margin-top: 10px; ">
                                <el-col class="send-local" :span="24">基础信息</el-col>
                            </el-row>
                            <div class="table-css">
                                <el-row>
                                    <el-col :span="6" class="table-tr flex-col justify-center ">发券类型</el-col>
                                    <el-col v-if="form.TakeType == 2" :span="6"
                                        class="table-tr flex-col justify-center ">每人领取</el-col>
                                    <el-col v-if="form.TakeType == 2" :span="6"
                                        class="table-tr flex-col justify-center ">领取概率</el-col>
                                    <el-col v-if="form.TakeType == 3" :span="6"
                                        class="table-tr flex-col justify-center ">通知方式</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" class="table-td flex-col justify-center ">{{ form.TakeTypeDesc }}
                                    </el-col>
                                    <el-col v-if="form.TakeType == 2" :span="6"
                                        class="table-td flex-col justify-center ">
                                        <p>{{ form.EveryoneTakeCount }}张</p>
                                    </el-col>
                                    <el-col v-if="form.TakeType == 2" :span="6"
                                        class="table-td flex-col justify-center ">
                                        <p>{{ form.EveryoneTakeProbability }}</p>
                                    </el-col>
                                    <el-col v-if="form.TakeType == 3" :span="6"
                                        class="table-td flex-col justify-center ">
                                        <p>{{ form.EmailNotify+' '+form.SmsNotify }}</p>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" class="table-tr flex-col justify-center ">发券备注</el-col>
                                    <el-col :span="6" class="table-tr flex-col justify-center ">祝福语</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" class="table-td flex-col justify-center ">{{ form.TakeRemark }}
                                    </el-col>
                                    <el-col :span="6" class="table-td flex-col justify-center ">{{ form.TakeWish }}
                                    </el-col>
                                </el-row>
                            </div>

                            <el-row style="margin-top: 35px; ">
                                <el-col class="send-local" :span="24" style="margin-bottom:15px">卡券明细</el-col>
                                <el-table :data="form.TicketTemplateDetails" border class="table"
                                    v-loading="tableLoading" ref="multipleTable"
                                    :header-cell-style="{ 'text-align': 'center' }"
                                    header-cell-class-name="table-header" style="width: 100%">
                                    <el-table-column prop="" align="center" label="券面" width="160">
                                        <template #default="scope">
                                            <img :src="scope.row.ListImg" style="width:80px;height:80px" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="TicketTemplateCode" align="center" label="券批次号">
                                    </el-table-column>
                                    <el-table-column prop="TicketTemplateTitle" align="center" label="券名称">
                                    </el-table-column>
                                    <el-table-column prop="" align="center" label="券类型" width="100">
                                        <template #default="scope">
                                            <div v-if="scope.row.GoodsQty > 1">{{
                                                scope.row.GoodsQty + '选' +
                                                    scope.row.ExchangeGoodsQty
                                            }}</div>
                                            <div v-else>单选卡</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="面值" width="100">
                                        <template #default="scope">
                                            {{ (scope.row.OrgPrice / 100).toFixed(2) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="ValidDateDesc" label="有效期" align="center">
                                    </el-table-column>
                                    <el-table-column prop="TicketCount" label="发放券数" align="center" width="100">
                                    </el-table-column>
                                    <el-table-column prop="TakeCount" label="已领数" align="center" width="100">
                                    </el-table-column>

                                </el-table>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="领取日志" name="second">
                        <div class="handle-box">
                            <el-form label-width="1px">
                                <el-row>
                                    <el-col :span="5">
                                        <el-form-item label="">
                                            <el-input v-if="form.TakeType == 1 || form.TakeType == 2"
                                                v-model="query.search.search_keyword" clearable placeholder="输入搜索关键词">
                                            </el-input>
                                            <el-input v-if="form.TakeType == 3"
                                                v-model="queryStaffs.search.search_keyword" clearable
                                                placeholder="部门/姓名/电话/邮箱">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="5" :offset="1">
                                        <el-form-item v-if="form.TakeType == 3" label="">
                                            <el-date-picker v-model="queryStaffs.search.time" type="daterange"
                                                range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="5" :offset="1">
                                        <el-form-item v-if="form.TakeType == 3" label="">
                                            <el-select v-model="queryStaffs.search.take_status" clearable
                                                style="width: 100%" placeholder="请选择状态">
                                                <el-option label="已领取" value="1"></el-option>
                                                <el-option label="未领取" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :offset="1">
                                        <div class="button-mgl" v-if="form.TakeType == 3">
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
                        <el-table v-if="form.TakeType == 1 || form.TakeType == 2" :data="filterTableData.slice(
                            (query.PageStartRow - 1) * query.PageRowCount,
                            query.PageStartRow * query.PageRowCount
                        )" border class="table" v-loading="tableLoading" ref="multipleTable"
                            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                            style="width: 100%">
                            <el-table-column align="center" prop="TakeVipName" label="领取人"></el-table-column>
                            <el-table-column prop="TakeVipCell" align="center" label="电话"></el-table-column>
                            <el-table-column prop="TakeTime" label="领取时间" align="center">
                            </el-table-column>
                            <el-table-column label="领取信息" align="center">
                                <template #default="scope">
                                    <div v-for="(obj, index) in scope.row.TakeDetails" :key="index">
                                        <p>{{ obj.TicketTemplateCode+'-'+obj.TicketTemplateTitle + ' No. ' + obj.TicketCode }}</p>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <div class="pagination" v-if="form.TakeType == 1 || form.TakeType == 2">
                            <el-pagination background layout="->,total, sizes, prev, pager, next"
                                v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                                :page-sizes="[15, 50, 100]" :total="pageTotal" @current-change="handlePageChange"
                                @size-change="handleSizeChange"></el-pagination>
                        </div> -->
                        <el-table v-if="form.TakeType == 3" :data="tableDataStaffs" border class="table"
                            v-loading="tableLoading" ref="multipleTable" :header-cell-style="{ 'text-align': 'center' }"
                            header-cell-class-name="table-header" style="width: 100%">
                            <el-table-column align="center" prop="StaffDept" label="部门" width="100"></el-table-column>
                            <el-table-column align="center" prop="StaffName" label="领取人" width="100"></el-table-column>
                            <el-table-column align="center" prop="StaffCell" label="电话" width="160"></el-table-column>
                            <el-table-column align="center" prop="StaffEmail" label="邮箱"></el-table-column>
                            <el-table-column align="center" prop="TicketCount" label="发放张数" width="100"></el-table-column>
                            <el-table-column align="center" prop="TakeQty" label="领取张数" width="100"></el-table-column>
                            <el-table-column align="center" prop="StaffRemark" label="备注"></el-table-column>
                            <el-table-column label="领取信息" align="center">
                                <template #default="scope">
                                    <div v-if="scope.row.TakeTicketes">
                                        <div v-for="(obj, index) in scope.row.TakeTicketes" :key="index">
                                            <p>{{ obj.TicketTemplateTitle + '-' + obj.TicketCode }}</p>
                                        </div>
                                    </div>

                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="TakeTime" label="领取时间" width="160"></el-table-column>
                            <el-table-column label="操作" align="center" width="100">
                                <template #default="scope">
                                    <div class="button-mgl">
                                        <el-button v-if="form.SmsNotify!=''&&scope.row.StaffCell && (scope.row.TakeQty==0)"
                                            class="button-op-edit" size="small"
                                            @click="handleSendCell(scope.row.BillId, scope.row.StaffCell)">短信通知
                                        </el-button>
                                        <el-button v-if="form.EmailNotify!=''&&scope.row.StaffEmail && (scope.row.TakeQty==0)"
                                            class="button-op-edit" size="small"
                                            @click="handleSendEmail(scope.row.BillId, scope.row.StaffEmail)">邮件通知
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination" v-if="form.TakeType == 3">
                            <el-pagination background layout="->,total, sizes, prev, pager, next"
                                v-model:currentPage="queryStaffs.PageStartRow"
                                v-model:page-size="queryStaffs.PageRowCount" :page-sizes="[15, 50, 100]"
                                :total="pageTotalStaffs" @current-change="handlePageChangeStaffs"
                                @size-change="handleSizeChangeStaffs"></el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!-- 二维码图片弹框 -->
        <el-dialog title="小程序码" v-model="QrCodeVisible" width="38%" :show-close="false">
            <div style="width:100%;text-align: center">
                <img :src="QrCodeImg" style="width: 300px" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button2" @click="QrCodeVisible = false">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>
    
<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SearchTicketBillTakeStaffs,GetTicketBillTake,SendTicketTakeSMSNotify,SendTicketTakeEmailNotify} from "@/api/bill.js";
import common from "@/utils/common.js";

const router = useRouter();
const FormData = reactive({
    CreateTime: "",
    TakeRemark: "",
    TakeTypeDesc: "",
    BillStatusDesc: "",
    TicketCount: "",//发
    TakenCount: "",//领
    TakePercent: "",
    TakeWxxcxQRCode: "",//小程序码
    TicketTemplateDetails: [],
});

//二维码
const QrCodeImg = ref("");
const QrCodeVisible = ref(false);
const activeName = ref('first')
const query = reactive({
    search: {
        search_keyword: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
//卡券明细
let form = reactive({
    BillId: "",
    TakeTypeDesc: "",//扩展字段发券类型
    EveryoneTakeCount: "",//每个领取数量
    EveryoneTakeProbability: "",//领取概率
    EmailNotify: "",//是否邮件通知领取(类型为名单时有用)
    EmailNotifyAndSmsNotify: "",
    SmsNotify: "",//是否短信通知领取(类型为名单时有用)
    TakeRemark: "",//备注(标记发放给谁,备查)
    TakeWish: "",//祝福语
    BillStatusDesc: "",//发券状态
    TicketCount: "",//发券数量
    TakenCount: "",//已领取
    TakenStaffCount: "",//已领取人数(名单领取/微信群领取时有效)
    TakeType: "",//领取类型
    TicketTemplateDetails: [],//卡券明细
})
//领取日志
const tableLoading = ref(false);
const tableLogData = ref([]);
const tableDataStaffs = ref([]);
const pageTotalStaffs = ref(0);
const pageTotal = ref(0);
const queryStaffs = reactive({
    search: {
        bill_id: "",
        search_keyword: "",
        time: [],
        take_time_begin: "",
        take_time_end: "",
        take_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});

//* 操作*//
// 获取表格数据
const getData = async () => {
    tableLoading.value = true;
    queryStaffs.search.bill_id = form.BillId;
    if (queryStaffs.search.time && queryStaffs.search.time.length > 0) {
        queryStaffs.search.take_time_begin = common.dateFormat("YYYY-mm-dd", queryStaffs.search.time[0]);
        queryStaffs.search.take_time_end = common.dateFormat("YYYY-mm-dd", queryStaffs.search.time[1]);
    } else {
        queryStaffs.search.take_time_begin = "";
        queryStaffs.search.take_time_end = "";
    }
    let res = await SearchTicketBillTakeStaffs({
        PageStartRow: (queryStaffs.PageStartRow - 1) * queryStaffs.PageRowCount,
        PageRowCount: queryStaffs.PageRowCount,
        SearchCondition: queryStaffs.search,
    });
    tableLoading.value = false;
    if (res.Code == 200) {
        if (res.DataMap.Data) {
            tableDataStaffs.value = res.DataMap.Data;
        } else {
            tableDataStaffs.value = []
        }

        pageTotalStaffs.value = res.DataMap.ToalCount;
    }
};
// 分页导航
const handlePageChange = (val) => {
    query.PageStartRow = val;
    requestTableData();
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
    requestTableData();
};
const refreshBtn = (val) => {
    GetTicketBillTakeByID(form.BillId)
};

// 分页导航
const handlePageChangeStaffs = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChangeStaffs = (val) => {
  query.PageRowCount = val;
  getData();
};
const GetTicketBillTakeByID = async (ID) => {
    let res = await GetTicketBillTake({
        ObjectId: ID
    })
    if (res.Code == 200) {
        form.TakeTypeDesc = res.DataMap.TakeTypeDesc;
        form.EveryoneTakeCount = res.DataMap.EveryoneTakeCount;
        form.EveryoneTakeProbability = res.DataMap.EveryoneTakeProbability;
        form.EmailNotify = res.DataMap.EmailNotify == 1 ? "邮件" : "";
        form.SmsNotify = res.DataMap.SmsNotify == 1 ? "短信" : "";
        form.EmailNotifyAndSmsNotify = form.EmailNotify ? form.EmailNotify + "、" : "" + form.SmsNotify
        form.TakeWish = res.DataMap.TakeWish;
        form.BillStatusDesc = res.DataMap.BillStatusDesc;
        form.TicketCount = res.DataMap.TicketCount;
        form.TakenCount = res.DataMap.TakenCount;
        form.TakenStaffCount = res.DataMap.TakenStaffCount;
        form.TakeRemark = res.DataMap.TakeRemark;
        form.TicketTemplateDetails = res.DataMap.TicketTemplateDetails;
        form.TakeType = res.DataMap.TakeType;

        FormData.TicketTemplateDetails = res.DataMap.TicketTemplateDetails;
        FormData.CreateTime = res.DataMap.CreateTime;
        FormData.TakeRemark = res.DataMap.TakeRemark;
        FormData.TakeTypeDesc = res.DataMap.TakeTypeDesc;
        FormData.BillStatusDesc = res.DataMap.BillStatusDesc;
        FormData.TicketCount = res.DataMap.TicketCount;
        FormData.TakenCount = res.DataMap.TakenCount;
        FormData.TakePercent = res.DataMap.TakePercent;
        FormData.TakeWxxcxQRCode = res.DataMap.TakeWxxcxQRCode ? res.DataMap.TakeWxxcxQRCode : "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png";


        if (res.DataMap.TakeType == 1 || res.DataMap.TakeType == 2) {
            tableLogData.value = res.DataMap.TakeHises ? res.DataMap.TakeHises : [];
            pageTotal.value = res.DataMap.TakeHises.length;
        } else {
            getData()
        }

    }
};
const handleOpenQr = (imgValue) => {
    QrCodeVisible.value = true;
    QrCodeImg.value = imgValue
};
const requestTableData = () => {
    nextTick(() => {
        if (multipleTableRef.value.length > 0) {
            tableLogData.value.forEach(function (item, i) {
                multipleTableRef.value.forEach(function (multItem, j) {
                    if (
                        tableLogData.value[i].TakeHisId ==
                        multipleTableRef.value[j].TakeHisId
                    ) {
                        multipleTable.toggleRowSelection(
                            tableLogData.value[i],
                            true
                        ); //这步操作是让  页面显示选中的数据
                    }
                });
            });
        }
    });
};
const filterTableData = computed(() =>
    tableLogData.value.filter(
        (data) =>
            !query.search.search_keyword ||
            data.TakeVipName.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.TakeVipCell.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.TakeTime.toLowerCase().includes(query.search.search_keyword.toLowerCase())


    )
)
const filterTableDataStaff = computed(() =>
    tableLogData.value.filter(
        (data) => !query.search.search_keyword ||
            data.StaffDept.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.StaffName.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.StaffCell.toLowerCase().includes(query.search.search_keyword.toLowerCase())


    )
)
if (router.currentRoute.value.query.ID) {
    form.BillId = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : "";
    GetTicketBillTakeByID(form.BillId)
}
const handleSearch = () => {
    queryStaffs.PageStartRow = 1;
    getData()
};
//发送通知
const handleSendCell = async (postID, postCell) => {
    let res = await SendTicketTakeSMSNotify({
        BillId: postID,
        Cell: postCell
    })
    if (res.Code == 200) {
        ElMessage.success("操作成功");
        queryStaffs.PageStartRow = 1;
        getData()
    } else {
        ElMessage.warning(res.Message);
    }
};
const handleSendEmail = async (postID, postEmail) => {
    let res = await SendTicketTakeEmailNotify({
        BillId: postID,
        Email: postEmail
    })
    if (res.Code == 200) {
        ElMessage.success("操作成功");
        queryStaffs.PageStartRow = 1;
        getData()
    } else {
        ElMessage.warning(res.Message);
    }
};
</script>
    
<style scoped>
.card-img {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100px;
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

.list-card {}

.list-info {
    width: 100%;
}

.list-info-detail {
    padding: 10px 0;
    position: relative;
    margin: 0 0 20px 0;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
    -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.09);
}

.list-info-detail-info {
    margin: 0 10px;
    height: 100px;
}

.list-info-detail-info-th {
    margin-top: 16px;
}

.list-info-detail-info-td {
    margin-bottom: 10px;
    color: #909399;
}

.send-number {
    font-size: 16px;
    color: #f56c6c;
    font-weight: 600;
}

.table-css {
    margin: 10px 0;
}

.table-tr {
    background-color: #f5f7fa;
    height: 40px;
    color: #909399;
    font-weight: 600;
    padding-left: 12px;
}

.table-td {
    height: 40px;
    padding-left: 12px;
}
</style>