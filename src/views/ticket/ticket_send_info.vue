<template>
    <div class="container">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
            <el-row style="margin-top: 10px; ">
                <el-col class="send-local" :span="12">发券信息</el-col>
                <el-col v-if="form.TakeType == 3" class="send-local" :span="12">领取名单</el-col>
            </el-row>
            <el-row style="margin-top: 30px; padding-bottom: 100px">
                <el-col :span="12">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="领取方式">
                                <el-radio-group v-model="form.TakeType" size="large">
                                    <el-radio-button :label="1">好友</el-radio-button>
                                    <el-radio-button :label="2">微信群</el-radio-button>
                                    <el-radio-button :label="3">名单</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.TakeType == 2">
                        <el-col :span="20">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="每人领取">
                                        <el-input v-model="form.EveryoneTakeCount">
                                            <template #append>张</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="领取概率">
                                        <el-input v-model="form.EveryoneTakeProbability">
                                            <template #append>%</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.TakeType == 3">
                        <el-col :span="22">
                            <el-form-item label="邮件通知">
                                <el-switch v-model="form.EmailNotifyDesc" inline-prompt active-text="启" inactive-text="关" />
                            </el-form-item>
                            <el-form-item v-if="form.EmailNotifyDesc" label="发送人">
                                <el-input style="width:60%" v-model="BillConfigDesc.EmailSenderDisplayName">
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="form.EmailNotifyDesc" label="主题">
                                <el-input style="width:60%" v-model="BillConfigDesc.EmailSubject">
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="form.EmailNotifyDesc" label="内容">
                                <tinymceEditor
                                ref="editor"
                                :height="300"
                                :value="BillConfigDesc.EmailBody"
                                @tinymceinput="gettinymceinput"
                                ></tinymceEditor>
                                <p style="font-size: 13px;">邮件中<span style="color:#f56c6c">${dept}</span>代表员工所在部门；<span style="color:#f56c6c">${name}</span>代表姓名；<span style="color:#f56c6c">${cell}</span>代表手机；<span style="color:#f56c6c">${wxxcx_qrcode}</span>代表领取的小程序码</p>
                            </el-form-item>
                            <el-form-item label="短信通知">
                                <el-switch v-model="form.SmsNotifyDesc" inline-prompt active-text="启" inactive-text="关" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="13">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="祝福卡片">
                                        <el-select v-model="form.TakeThemeId" style="width: 100%"
                                            @change="changeTakeTheme">
                                            <el-option v-for="(obj, index) in ThemeIdArr" :key="index"
                                                :label="obj.ThemeName" :value="obj.ThemeId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="form.TakeThemeId == ''">
                                <el-col :span="22">
                                    <div style="height:30px"></div>
                                    <!-- <el-form-item label="自定义名称">
                                        <el-input v-model="form.CustomName">
                                        </el-input>
                                    </el-form-item> -->
                                </el-col>
                            </el-row>
                            <el-row v-if="form.TakeThemeId == ''">
                                <el-col :span="22">
                                    <div style="position: relative;">
                                        <el-form-item label="自定义卡片">
                                            <el-upload v-model:file-list="fileList1" class="send-home-uploader"
                                                action="#" :http-request="SuccessImg" :before-upload="beforeUpload"
                                                :auto-upload="true">
                                                <el-button class="button1" round>
                                                    <el-icon>
                                                        <DocumentAdd />
                                                    </el-icon>
                                                    &nbsp;&nbsp;上传图片
                                                </el-button>
                                                <template #tip>
                                                    <div class="el-upload__tip" style="width:193px">
                                                        建议 400*375,支持格式：.jpg .png不能超过20MB
                                                    </div>
                                                </template>
                                            </el-upload>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="10">
                            <img :src="form.backgroundImg" style="width:240px;height:225px" />
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 15px;">
                        <el-col :span="20">
                            <el-form-item label="祝福语" prop="TakeWish">
                                <el-input v-model="form.TakeWish"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="发券备注" prop="TakeRemark">
                                <el-input v-model="form.TakeRemark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:20px">
                        <el-col :span="22">
                            <el-form-item label="发券卡券">
                                <el-button v-if="Type != 'View'" class="button1" round @click="addTicketBtn">
                                    &nbsp;&nbsp;添加卡券&nbsp;&nbsp;
                                </el-button>
                            </el-form-item>
                        </el-col>
                        <div style="padding-left:160px">
                            <ul id="nav-send">
                                <li v-for="(item, index) in goods" :key="index">
                                    <div class="inli-send">
                                        <div class="send-type" v-if="item.GoodsQty > 1">{{
                                            item.GoodsQty + '选' +
                                                item.ExchangeGoodsQty
                                        }}</div>
                                        <div class="send-edit"
                                        v-if="Type != 'View'"
                                            @click="goodEditBtn(item.TicketTemplateId, index, 'Edit')">
                                            <img src="/src/assets/imgs/send-edit.png" />
                                        </div>
                                        <div class="send-del" @click="goodDelBtn(index)">
                                            <img src="/src/assets/imgs/send-del.png" />
                                        </div>
                                        <el-row>
                                            <el-col :span="6">
                                                <div class="flex-col justify-center items-center send-detail">
                                                    <img :src="item.ListImg ? item.ListImg : 'https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img1/img-order2.png'"
                                                        style="width:70px;height:70px" />
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div class="send-detail-title line_ellipsi">{{
                                                    item.TicketTemplateTitle
                                                }}</div>
                                                <div class="send-detail-time ">{{ item.ValidDateDesc2 }}</div>
                                                <div class="send-detail-rmb ">¥{{ item.OrgPrice }}</div>
                                                <div class="send-detail-no " v-if="item.TicketIndexScope">号段：{{ item.TicketIndexScope }}</div>
                                                <div class="send-detail-count " v-if="item.TicketCount > 0">X{{
                                                    item.TicketCount
                                                }}
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-row>
                </el-col>
                <el-col :span="12" v-if="form.TakeType == 3">
                    <el-col :span="24">
                        <div class="handle-box">
                            <el-form label-width="1px">
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item label="">
                                            <el-input class="input-with-icon" v-model="query.search.search_keyword"
                                                clearable placeholder="名称/编码/手机">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="17" :offset="1">
                                        <div class="button-mgl">
                                            <!-- <el-button class="button2 button-float" round @click="handleReset()">
                                                <el-icon>
                                                    <RefreshRight />
                                                </el-icon>&nbsp;&nbsp;删&nbsp;&nbsp;除
                                            </el-button> -->
                                            <el-button class="button2 button-float" round @click="handleInFile()">
                                                <el-icon>
                                                    <RefreshRight />
                                                </el-icon>&nbsp;&nbsp;导&nbsp;&nbsp;入
                                            </el-button>
                                            <el-button class="button1 button-float" round @click="handleAdd()">
                                                <el-icon>
                                                    <Search />
                                                </el-icon>&nbsp;&nbsp;添&nbsp;&nbsp;加
                                            </el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <el-table :data="filterTableData.slice(
                            (query.PageStartRow - 1) * query.PageRowCount,
                            query.PageStartRow * query.PageRowCount
                        )" border class="table" v-loading="tableLoading" ref="multipleTable"
                            :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                            style="width: 100%">
                            <!-- <el-table-column type="selection" fixed align="center" width="40" /> -->
                            <el-table-column prop="StaffDept" align="center" label="部门"></el-table-column>
                            <el-table-column prop="StaffName" align="center" label="姓名">
                            </el-table-column>
                            <el-table-column prop="StaffCell" align="center" label="电话">
                            </el-table-column>
                            <el-table-column prop="StaffEmail" align="center" label="邮件">
                            </el-table-column>
                            <el-table-column prop="TicketCount" align="center" label="张数">
                            </el-table-column>
                            <el-table-column prop="StaffRemark" align="center" label="备注">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template #default="scope">
                                    <div class="button-mgl">
                                        <el-button class="button-op-edit " size="small"
                                            @click="handleEdit(scope.$index, 'Edit')">编辑
                                        </el-button>
                                        <el-button class="button-op-del " size="small" @click="handleDel(scope.$index)">
                                            删除
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination background layout="->,total, sizes, prev, pager, next"
                                v-model:currentPage="query.PageStartRow" v-model:page-size="query.PageRowCount"
                                :page-sizes="[15, 50, 100]" :total="pageTotal" @current-change="handlePageChange"
                                @size-change="handleSizeChange"></el-pagination>
                        </div>
                    </el-col>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button v-if="Type != 'View'" class="button1" round :loading="btnLoading" @click="onSubmit">
                    &nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;</el-button>
                <el-button class="button2" round @click="onReturn">&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 文件导入弹出框 -->
        <el-dialog title="导入文件" v-model="fileVisible" width="38%" :show-close="false">
            <div class="file-detail">
                <el-upload v-model:file-list="fileList" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
                    class="send-file-home-uploader" action="#" :http-request="SuccessFile" :auto-upload="true">
                    <el-button class="button1" round>
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>
                        &nbsp;&nbsp;上传文件
                    </el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            <el-link :underline="false" href="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/template/名单.xlsx"
                                style="color: #f56c6c">
                                下载模板</el-link>
                        </div>
                        <div class="el-upload__tip">
                            支持上传excel文件
                        </div>
                    </template>
                </el-upload>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button1" :loading="FileLoading" @click="SaveFileModalBtn">保 存</el-button>
                    <el-button class="button2" @click="cennelFileModalBtn">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加名单弹出框 -->
        <el-dialog title="添加名单" v-model="addVisible" width="38%" :show-close="false">
            <el-form ref="formFileRef" :rules="addRules" :model="addForm" label-width="100px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="部门">
                            <el-input v-model="addForm.StaffDept" clearable placeholder="请输入部门">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="姓名" prop="StaffName">
                            <el-input v-model="addForm.StaffName" clearable placeholder="请输入姓名">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="电话" prop="StaffCell">
                            <el-input v-model="addForm.StaffCell" clearable placeholder="请输入电话">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="发放" prop="TicketCount">
                            <el-input v-model="addForm.TicketCount" clearable placeholder="请输入发放张数">
                                <template #append>张</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="邮件">
                            <el-input v-model="addForm.StaffEmail" clearable placeholder="请输入邮件">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="备注">
                            <el-input v-model="addForm.StaffRemark" clearable placeholder="请输入备注">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button1" :loading="addLoading" @click="SaveAddModalBtn">保 存</el-button>
                    <el-button class="button2" @click="cennelAddModalBtn">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加卡券弹出框 -->
        <el-dialog title="添加/编辑" v-model="addTicketVisible" width="38%" :show-close="false">
            <div style="width:100%;height: 18px;"></div>
            <el-form ref="formTicketRef" :rules="TicketRules" :model="TicketForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="选择卡券" prop="TicketTemplateId">
                            <el-select v-model="TicketForm.TicketTemplateTitle" filterable style="width: 100%" placeholder="请输入卡券名称"
                                @change="changeTicketTemplateId($event, index)">
                                <el-option v-for="(obj, index) in tickets" :key="index" :label="obj.TicketTemplateCode+'-'+obj.TicketTemplateTitle"
                                    :value="obj.TicketTemplateId">
                                </el-option>
                            </el-select>
                            <!-- <el-select v-model="TicketForm.TicketTemplateId" clearable style="width: 100%"
                                placeholder="请选择卡券" @change="changeTicketTemplateId($event, index)">
                                <el-option v-for="(item, index) in tickets" :key="index"
                                    :label="item.TicketTemplateTitle" :value="item.TicketTemplateId" />
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="卡券类型">
                            <el-input disabled v-model="TicketForm.GoodsQtyDesc">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="有效期">
                            <el-input disabled v-model="TicketForm.ValidDateDesc2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="剩余数量">
                                    <el-input disabled v-model="TicketForm.LeftCount">
                                        <template #append>张</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="面值">
                                    <el-input disabled v-model="TicketForm.OrgPrice">
                                        <template #append>元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="发券数量" prop="TicketCount">
                            <el-input v-model="TicketForm.TicketCount">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="券号段">
                        <el-input v-model="TicketForm.TicketIndexScope"></el-input>
                        <span style="color: #f56c6c;">提示：1,5-8 代表要券号为1/5/6/7/8</span
                        >
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="button1" :loading="addTicketLoading" @click="SaveTicketModalBtn">保 存</el-button>
                    <el-button class="button2" @click="cennelTicketModalBtn">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { ref, reactive, nextTick, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { GetTicketTemplateById, GetMyValidTicketTemplateList } from "@/api/ticket.js";
import { GetTicketBillTake,SaveTicketBillTake } from "@/api/bill.js";
import { UploadSingle, GetFileData } from "@/api/imgapi.js";
import common from "@/utils/common.js";
import { GetTakeThemeList } from "@/api/index.js";
import tinymceEditor from "@/components/common/tinymce.vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const formRef = ref(null);
const btnLoading = ref(false);
const ThemeIdArr = ref([]);
const isBatch = ref("0");
const chooseIdx = ref("0");
let Type = ref("");
const rules = {
    TakeWish: [{ required: true, message: "请输入祝福语", trigger: "blur" }],
    TakeRemark: [{ required: true, message: "请输入发券备注", trigger: "blur" }],

};
let form = reactive({
    BillId: "",
    BillCode: "",//单号
    BillDate: "",//创建日期
    TakeType: "1",//类型(1:好友;2:群;3:名单)
    EveryoneTakeCount: "1",//每个领取张数(类型为群时有用)
    EveryoneTakeProbability: "50",//每个的领取概率(类型为群时有用)
    EmailNotifyDesc: false,//是否邮件通知领取(类型为名单时有用)
    SmsNotifyDesc: false,//是否短信通知领取(类型为名单时有用)
    EmailNotify: "",//是否邮件通知领取(类型为名单时有用)0、否 1、是
    SmsNotify: "",//是否短信通知领取(类型为名单时有用)0、否 1、是
    EmailNotifyAndSmsNotify: [],
    RosterId: "",//发放花名册
    TakeWish: "",//祝福语
    TakeWish1: "",//临时保存祝福语
    TakeRemark: "",//备注(标记发放给谁,备查)
    TakeThemeId: "",//主题(如果是自定义的话，则为空)
    CustomName: "",//自定义名称
    backgroundImg: "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/img/img-order1.png",//自定义图片
    backgroundImg1: "",//临时保存自定义图片
    TakeConfig: "",//配置(封面)
    BillConfig: "",//配置
    TakeThemeConfig: "",//领取主题配置
    TicketTemplateDetails: [],//可以领取的券模板列表
    TakeStaffs: [],//领取名单
});
let BillConfigDesc=reactive({
    EmailSenderDisplayName:"",
    EmailSubject:"",
    EmailBody:""
})
form.BillId = router.currentRoute.value.query.ID
    ? router.currentRoute.value.query.ID
    : "";

Type = router.currentRoute.value.query.Type
    ? router.currentRoute.value.query.Type
    : "";
//文件导入
const fileVisible = ref(false);
const FileLoading = ref(false);
const fileList = ref([]);
const fileList1 = ref([]);

const fileparam = ref([]);

//名单添加
const addVisible = ref(false);
const addLoading = ref(false);
const formFileRef = ref(null);
const addFormType = ref("");
const addFormIndex = ref("");
const addRules = {
    StaffDept: [{ required: true, message: "请输入部门", trigger: "blur" }],
    StaffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    StaffCell: [{ required: true, message: "请输入电话", trigger: "blur" }],
    TicketCount: [{ required: true, message: "请输入发放张数", trigger: "blur" }],
};
let addForm = reactive({
    StaffDept: "",//部门
    StaffName: "",//姓名
    StaffCell: "",//电话
    TicketCount: "",//发放
    StaffEmail: "",//邮件
    StaffRemark: "",//备注
});

//添加卡券
const addTicketLoading = ref(false);
const isEditTicket = ref("");
const addTicketVisible = ref(false);
const formTicketRef = ref(null);
const TicketRules = {
    TicketTemplateId: [{ required: true, message: "请选择卡券", trigger: "blur" }],
    TicketCount: [{ required: true, message: "请输入发券数量", trigger: "blur" }],
};
let TicketForm = reactive({
    BillDetailId: "",
    BillId: "",
    TicketTemplateId: "",
    TicketCount: "",
    LeftCount: "",//剩余总量(=券总量-销售券总量-发放券总量)
    OrgPrice: "",//面值
    TicketIndexScope:"",
    ValidDateDesc2: "",//有效期
    GoodsQtyDesc: "",//卡券类型
    TicketTemplateTitle: "",
    TicketTemplateCode: "",
    GoodsQty: 1,//兑换商品数量(<=1:单选卡;>1:多选卡)
    ExchangeGoodsQty: "",//多选卡兑换时需要选择几种兑换商品(默认为1)
    ListImg: "",
});
const tickets = ref([]);

//右侧列表查询
const query = reactive({
    search: {
        unit_type: "2",
        unit_type_filter: "",
        search_keyword: "",
        unit_status: "",
    },
    PageStartRow: 1,
    PageRowCount: 15,
});
const tableLoading = ref(false);
const multipleTableRef = ref([]);
const tableData = ref([]);
const pageTotal = ref(0);
//卡券数组
const goods = reactive([]);
const GetTakeThemeListByID = async (ID) => {
    let res = await GetTakeThemeList({});
    if (res.Code == 200) {
        let objArr = [{
            ThemeId: "",
            ThemeName: "自定义"
        }]
        res.DataMap.forEach(row => {
            objArr.push(row)
        })
        ThemeIdArr.value = objArr;
    }
};
GetTakeThemeListByID()
const requestTableData = () => {
    nextTick(() => {
        if (multipleTableRef.value.length > 0) {
            tableData.value.forEach(function (item, i) {
                multipleTableRef.value.forEach(function (multItem, j) {
                    if (
                        tableData.value[i].ResponseID ==
                        multipleTableRef.value[j].ResponseID
                    ) {
                        multipleTable.toggleRowSelection(
                            tableData.value[i],
                            true
                        ); //这步操作是让  页面显示选中的数据
                    }
                });
            });
        }
    });
};

//操作
const onReturn = () => {
    common.ClosePageTag("发券详情");
    router.go(-1);
};

const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let submitForm = form;
            if (goods.length == 0) {
                ElMessage.warning("请先添加卡券");
                return;
            }
            let ThemeConfig={
                BackgroundImg:"",
                CustomName:"",
                EmailSenderDisplayName:"",
                EmailSubject:"",
                EmailBody:"",
            };
            submitForm.TicketTemplateDetails = [];
            goods.forEach(row => {
                submitForm.TicketTemplateDetails.push({
                    TicketTemplateId: row.TicketTemplateId,
                    TicketCount: row.TicketCount,
                    TicketIndexScope: row.TicketIndexScope,
                })
            })
            if (submitForm.TakeThemeId == "") {
                ThemeConfig.BackgroundImg=submitForm.backgroundImg;
                ThemeConfig.CustomName=submitForm.CustomName;
                if (submitForm.backgroundImg == "") {
                    ElMessage.error("请先上传图片");
                    return
                }
        
            }
            if (submitForm.TakeType == 3) {
                if (filterTableData.value.length == 0) {
                    ElMessage.warning("请先添加领取名单");
                    return;
                }
                submitForm.TakeStaffs = [];
                filterTableData.value.forEach(row => {
                    submitForm.TakeStaffs.push({
                        StaffDept: row.StaffDept,
                        StaffName: row.StaffName,
                        StaffCell: row.StaffCell,
                        StaffEmail: row.StaffEmail,
                        StaffRemark: row.StaffRemark,
                        TicketCount: row.TicketCount,
                    })
                })
                submitForm.EmailNotify = form.EmailNotifyDesc ? 1 : 0;
                submitForm.SmsNotify = form.SmsNotifyDesc ? 1 : 0;

                if(submitForm.EmailNotify==1){
                    if(BillConfigDesc.EmailSenderDisplayName==""||BillConfigDesc.EmailSubject==""||BillConfigDesc.EmailBody==""){
                        //三个只要有一个为空那么就提示
                        ElMessage.warning("请完善邮件信息");
                        return;
                    }
                    ThemeConfig.EmailSenderDisplayName=BillConfigDesc.EmailSenderDisplayName;
                    ThemeConfig.EmailSubject=BillConfigDesc.EmailSubject;
                    ThemeConfig.EmailBody=BillConfigDesc.EmailBody;
                }
            }
            submitForm.TakeConfig = JSON.stringify(ThemeConfig);
            btnLoading.value = true;
            let res = await SaveTicketBillTake({ Bill: submitForm });
            btnLoading.value = false;
            if (res.Code == 200) {
                common.ClosePageTag("发券详情");
                store.commit("tags/setPageSaerch", {
                    Search: 1, titlePage: "发券单"
                });
                ElMessage.success("保存成功");
                setTimeout(() => {
                    router.push({
                        path: "/ticket_send",
                    });
                }, 2000);
            } else {
                ElMessage.error(res.Message);
            }
        } else {
            return false;
        }
    });
};
const handleSizeChange = (val) => {
    query.PageRowCount = val;
    requestTableData();
};
const handlePageChange = (val) => {
    query.PageStartRow = val;
    requestTableData();
};
const SuccessImg = async (param) => {
    //上传图片
    let fd = new FormData();
    fd.append("file", param.file); //传文件
    UploadSingle(fd).then((res) => {
        if (res.Code == 200) {
            fileList1.value = [];
            form.backgroundImg = res.DataMap.HttpsUrl;
        }
    });
};
const SuccessFile = async (param) => {
    fileparam.value = param;
};
const handleRemove = async (param) => {
    fileparam.value = {}
};
const handleExceed = async (files, fileList) => {
    ElMessage.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
};
const changeTakeTheme = async (key) => {
    //切换主题
    if (key == "") {
        form.backgroundImg = form.backgroundImg1 ? form.backgroundImg1 : "";
        form.TakeWish = form.TakeWish1 ? form.TakeWish1 : "";
    }
    ThemeIdArr.value.forEach(row => {
        if (row.ThemeId == key && row.ThemeId != "") {
            form.backgroundImg = JSON.parse(row.ThemeConfig).BackgroundImg
            form.TakeWish = row.ThemeWishing;
        }
    })
};
const handleAdd = async (param) => {
    addFormType.value = "Add";
    addVisible.value = true;

};
//编辑领取名单
const handleEdit = (idIndex) => {
    addVisible.value = true;
    addFormType.value = "Edit";
    addFormIndex.value = idIndex;
    tableData.value.forEach((row, index) => {
        if (idIndex === index) {
            addForm.StaffDept = row.StaffDept;
            addForm.StaffName = row.StaffName;
            addForm.StaffCell = row.StaffCell;
            addForm.TicketCount = row.TicketCount;
            addForm.StaffEmail = row.StaffEmail;
            addForm.StaffRemark = row.StaffRemark;
        }
    })
};
//删除领取名单
const handleDel = (idIndex) => {
    tableData.value.forEach((row, index) => {
        if (idIndex === index) {
            tableData.value.splice(index, 1)
        }
    })
};
const handleInFile = async (param) => {
    fileVisible.value = true;
};
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !query.search.search_keyword ||
            data.StaffName.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.StaffDept.toLowerCase().includes(query.search.search_keyword.toLowerCase()) || data.StaffCell.toLowerCase().includes(query.search.search_keyword.toLowerCase())
    )
)
const SaveFileModalBtn = async () => {
    let fd = new FormData();
    fd.append("file", fileparam.value.file); //传文件
    fd.append("DataType", "Roster"); //传文件
    FileLoading.value = true;
    let res = await GetFileData(fd);
    FileLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success(`导入成功`)
        tableData.value = res.DataMap;
        pageTotal.value = tableData.value.length;
        fileList.value = []
        fileVisible.value = false;
    } else {
        ElMessage.warning(`${res.Message}`)
    }
};
const cennelFileModalBtn = async () => {
    fileVisible.value = false;
    fileList.value = []
};
const SaveAddModalBtn = async () => {
    formFileRef.value.validate(async (valid) => {
        if (valid) {
            addLoading.value = true;
            if (addFormType.value == "Edit") {
                tableData.value.forEach((row, index) => {
                    if (index == addFormIndex.value) {
                        row.StaffDept = addForm.StaffDept;
                        row.StaffName = addForm.StaffName;
                        row.StaffCell = addForm.StaffCell;
                        row.TicketCount = addForm.TicketCount;
                        row.StaffEmail = addForm.StaffEmail;
                        row.StaffRemark = addForm.StaffRemark;
                    }
                })
            } else {
                tableData.value.push({
                    StaffDept: addForm.StaffDept,
                    StaffName: addForm.StaffName,
                    StaffCell: addForm.StaffCell,
                    TicketCount: addForm.TicketCount,
                    StaffEmail: addForm.StaffEmail,
                    StaffRemark: addForm.StaffRemark,
                })

            }
            pageTotal.value = tableData.value.length;
            setTimeout(() => {
                addForm.StaffDept = "";
                addForm.StaffName = "";
                addForm.StaffCell = "";
                addForm.TicketCount = "";
                addForm.StaffEmail = "";
                addForm.StaffRemark = "";
                addVisible.value = false;
                addLoading.value = false;
            }, 1000)
        } else {
            return false;
        }
    });
};
const cennelAddModalBtn = async () => {
    addVisible.value = false;
};
const addTicketBtn = async () => {
    addTicketVisible.value = true;
    isEditTicket.value = "";
    TicketForm.GoodsQtyDesc = "";
    TicketForm.TicketTemplateId = "";
    TicketForm.TicketCount = "";
    TicketForm.OrgPrice = "";
    TicketForm.ValidDateDesc2 = "";
    TicketForm.LeftCount = "";
    TicketForm.BillDetailId = "";
    TicketForm.BillId = "";
    TicketForm.TicketIndexScope = "";

    TicketForm.TicketTemplateTitle = "";
    TicketForm.TicketTemplateId = "";
};
const goodEditBtn = async (ID, idx, type) => {
    isEditTicket.value = type;
    changeTicketTemplateId(ID);
    chooseIdx.value = idx;
    goods.forEach((row, index) => {
        if (index == idx) {
            TicketForm.TicketCount = row.TicketCount;
            TicketForm.BillDetailId = row.BillDetailId;
            TicketForm.BillId = row.BillId;
            TicketForm.TicketIndexScope = row.TicketIndexScope;
        }
    })
    addTicketVisible.value = true;
};
const goodDelBtn = async (idx) => {
    goods.forEach((row, index) => {
        if (idx == index) {
            goods.splice(index, 1)
        }
    })
};
const cennelTicketModalBtn = async () => {
    addTicketVisible.value = false;
    TicketForm.GoodsQtyDesc = "";
    TicketForm.OrgPrice = "";
    TicketForm.TicketIndexScope = "";
    TicketForm.ValidDateDesc2 = "";
    TicketForm.LeftCount = "";
    formTicketRef.value.resetFields();
};
const changeTicketTemplateId = async (key) => {
    let res = await GetTicketTemplateById({
        TicketTemplateId: key,
        ReturnStatData: true,
    })
    if (res.Code == 200) {
        // TicketForm.TicketCount = res.DataMap.TicketCount;
        TicketForm.TicketTemplateId = res.DataMap.TicketTemplateId;
        TicketForm.TicketTemplateTitle = res.DataMap.TicketTemplateCode+"-"+res.DataMap.TicketTemplateTitle;
        TicketForm.TicketTemplateCode = res.DataMap.TicketTemplateCode;
        TicketForm.GoodsQty = res.DataMap.GoodsQty;
        TicketForm.ExchangeGoodsQty = res.DataMap.ExchangeGoodsQty;
        TicketForm.ListImg = res.DataMap.ListImg;
        TicketForm.ValidDateDesc2 = res.DataMap.ValidDateDesc2;
        TicketForm.OrgPrice = (res.DataMap.OrgPrice / 100).toFixed(2);
        TicketForm.LeftCount = res.DataMap.LeftCount;
        if (res.DataMap.GoodsQty > 1) {
            TicketForm.GoodsQtyDesc = `多选卡 ${res.DataMap.GoodsQty}选${res.DataMap.ExchangeGoodsQty}`;
        } else {
            TicketForm.GoodsQtyDesc = `单选卡`;
        }
    }
};
const SaveTicketModalBtn = async () => {
    formTicketRef.value.validate(async (valid) => {
        if (valid) {
            addTicketLoading.value = true;
            if (isEditTicket.value != "Edit") {
                goods.push({
                    TicketTemplateId: TicketForm.TicketTemplateId,
                    TicketCount: TicketForm.TicketCount,
                    TicketTemplateTitle: TicketForm.TicketTemplateTitle,
                    TicketTemplateCode: TicketForm.TicketTemplateCode,
                    GoodsQty: TicketForm.GoodsQty,
                    TicketIndexScope: TicketForm.TicketIndexScope,
                    ExchangeGoodsQty: TicketForm.ExchangeGoodsQty,
                    ListImg: TicketForm.ListImg,
                    ValidDateDesc2: TicketForm.ValidDateDesc2,
                    OrgPrice: TicketForm.OrgPrice,
                    BillDetailId: TicketForm.BillDetailId,
                    BillId: TicketForm.BillId,
                })
            } else {
                goods[chooseIdx.value].TicketIndexScope = TicketForm.TicketIndexScope;
                goods[chooseIdx.value].TicketTemplateId = TicketForm.TicketTemplateId;
                goods[chooseIdx.value].TicketCount = TicketForm.TicketCount;
                goods[chooseIdx.value].TicketTemplateTitle = TicketForm.TicketTemplateTitle;
                goods[chooseIdx.value].TicketTemplateCode = TicketForm.TicketTemplateCode;
                goods[chooseIdx.value].GoodsQty = TicketForm.GoodsQty;
                goods[chooseIdx.value].ExchangeGoodsQty = TicketForm.ExchangeGoodsQty;
                goods[chooseIdx.value].ListImg = TicketForm.ListImg;
                goods[chooseIdx.value].ValidDateDesc2 = TicketForm.ValidDateDesc2;
                goods[chooseIdx.value].OrgPrice = TicketForm.OrgPrice;
                goods[chooseIdx.value].BillDetailId = TicketForm.BillDetailId;
                goods[chooseIdx.value].BillId = TicketForm.BillId;
            }
            setTimeout(() => {
                addTicketLoading.value = false;
                addTicketVisible.value = false;

            }, 800)
        } else {
            return false;
        }
    });
};
const GetTicketBillTakeById = async (key) => {
    let res = await GetTicketBillTake({
        ObjectId: key
    })
    if (res.Code == 200) {
        form.TakeType = res.DataMap.TakeType;
        form.EveryoneTakeCount = res.DataMap.EveryoneTakeCount;
        form.EveryoneTakeProbability = res.DataMap.EveryoneTakeProbability;
        form.SmsNotify = res.DataMap.SmsNotify;
        form.EmailNotify = res.DataMap.EmailNotify;
        form.SmsNotifyDesc = res.DataMap.SmsNotify == 1 ? true : false;
        form.EmailNotifyDesc = res.DataMap.EmailNotify == 1 ? true : false;
        form.TakeWish = res.DataMap.TakeWish;
        form.TakeRemark = res.DataMap.TakeRemark;
        form.TakeThemeId = res.DataMap.TakeThemeId;
        form.TakeThemeConfig = res.DataMap.TakeThemeConfig;


        if (form.TakeThemeId == "") {
            let TakeConfigObj = JSON.parse(res.DataMap.TakeConfig);
            form.TakeConfig = res.DataMap.TakeConfig;
            form.backgroundImg = TakeConfigObj.BackgroundImg;
            form.backgroundImg1 = TakeConfigObj.BackgroundImg;
            form.TakeWish1 = res.DataMap.TakeWish;
        } else {
            let TakeThemeConfigObj = JSON.parse(res.DataMap.TakeThemeConfig);
            form.backgroundImg = TakeThemeConfigObj.BackgroundImg;
        }
        res.DataMap.TicketTemplateDetails.forEach(row => {
            goods.push({
                TicketTemplateId: row.TicketTemplateId,
                TicketCount: row.TicketCount,
                TicketTemplateTitle: row.TicketTemplateTitle,
                TicketTemplateCode: row.TicketTemplateCode,
                GoodsQty: row.GoodsQty,
                ExchangeGoodsQty: row.ExchangeGoodsQty,
                TicketIndexScope: row.TicketIndexScope,
                ListImg: row.ListImg,
                ValidDateDesc2: row.ValidDateDesc,
                OrgPrice: Number((row.OrgPrice / 100).toFixed(2)),
                BillDetailId: row.BillDetailId,
                BillId: row.BillId,
            })
        })
        form.TakeStaffs = [];
        tableData.value = res.DataMap.TakeStaffs ? res.DataMap.TakeStaffs : [];
        pageTotal.value = tableData.value.length;

        if(form.TakeType==3){
            if(res.DataMap.EmailNotify == 1){
                let JsonItem=JSON.parse(res.DataMap.TakeConfig);
                BillConfigDesc.EmailSenderDisplayName=JsonItem.EmailSenderDisplayName;
                BillConfigDesc.EmailSubject=JsonItem.EmailSubject;
                BillConfigDesc.EmailBody=JsonItem.EmailBody;
            }

        }
    }
};
if (form.BillId != "") {
    GetTicketBillTakeById(form.BillId)
}
const GetMyValidTicketTemplateListApi = async () => {
    let res = await GetMyValidTicketTemplateList({})
    if (res.Code === 200) {
        tickets.value = res.DataMap
    }
}
GetMyValidTicketTemplateListApi();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const gettinymceinput = async (val) => {
  BillConfigDesc.EmailBody=val;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//通过批次页面进来的数据
if (router.currentRoute.value.query.isBatch) {
    let getTicketIds = store.state.ticket.ticketIds;
    getTicketIds.forEach(async row => {
        let res = await GetTicketTemplateById({
            TicketTemplateId: row,
            ReturnStatData: true,
        })
        if (res.Code == 200) {
            goods.push({
                TicketTemplateId: res.DataMap.TicketTemplateId,
                TicketTemplateTitle: res.DataMap.TicketTemplateTitle,
                TicketTemplateCode: res.DataMap.TicketTemplateCode,
                GoodsQty: res.DataMap.GoodsQty,
                ExchangeGoodsQty: res.DataMap.ExchangeGoodsQty,
                ListImg: res.DataMap.ListImg,
                ValidDateDesc2: res.DataMap.ValidDateDesc2,
                OrgPrice: (res.DataMap.OrgPrice / 100).toFixed(2),
                BillDetailId: "",
                BillId: "",
                LeftCount: res.DataMap.LeftCount,
                TicketCount: 1,
            })
        }
    })
    isBatch.value = router.currentRoute.value.query.isBatch;
}

</script>
  
<style scoped>
#nav-send {
    list-style-type: none;
    margin-top: 10px;
}

.inli-send {
    border-bottom: solid 8px #f56c6c;
    position: relative;
    margin: 10px 10px 20px 0;
    border-radius: 4px;
    border-bottom-right-radius: 8px;
    border-bottom-right-radius: 8px;
    width: 442px;
    box-shadow:
        1px 1px 10px rgba(0, 0, 0, 0.07);
    height: 120px;
}

.send-edit {
    position: absolute;
    right: 72px;
    z-index: 9;
    top: 32px;
}

.send-edit img {
    width: 35px;
    height: 35px;
}

.send-del {
    position: absolute;
    right: 22px;
    z-index: 9;
    top: 32px;
}

.send-del img {
    width: 35px;
    height: 35px;
}

.send-detail {
    height: 120px;
}

.send-detail-title {
    position: absolute;
    top: 20px;
    color: #252525;
}

.send-detail-time {
    position: absolute;
    top: 42px;
    font-size: 12px;
    color: #757575;
}

.send-detail-rmb {
    position: absolute;
    top: 66px;
    color: #f56c6c;
}

.send-detail-no {
    position: absolute;
    top: 87px;
    color: #f56c6c;
    font-size: 14px;
}

.send-detail-count {
    position: absolute;
    right: 14px;
    top: 80px;
    color: #313131;
}

.send-type {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f56c6c;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 10px;
    font-size: 12px;
    color: #fff;
    line-height: 22px;
    width: 60px;
    text-align: center;
    height: 22px;
    letter-spacing: 1px;
}



.file-detail {
    position: relative;
    height: 80px;
    top: -10px;
}
</style>
  
<style>
.send-home-uploader {
    width: 150px;
    height: 40px;
}

.send-home-uploader .el-upload {
    width: 150px !important;
    height: 40px !important;
    border: none !important;
    justify-content: start !important;
}

.send-home-uploader .el-upload__tip {
    width: 300px;
}


.send-file-home-uploader {
    width: 150px;
    height: 40px;
}

.send-file-home-uploader .el-upload {
    width: 150px !important;
    height: 40px !important;
    border: none !important;
    justify-content: start !important;
}

.send-file-home-uploader .el-upload__tip {
    width: 300px;
    padding-left: 5px;
}
</style>