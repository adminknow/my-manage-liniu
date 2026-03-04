<!-- 订单列表收件组件 -->
<template>
    <el-dialog title="修改收件信息" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-row>
            <el-col :span="22">
                <el-form ref="formUpdateRef" :model="receiveForm" :rules="receiveRules" label-width="140px">
                    <el-form-item label="收件人" prop="ContactName">
                        <el-input v-model="receiveForm.ContactName"></el-input>
                    </el-form-item>
                    <el-form-item label="收件手机" prop="ContactCell">
                        <el-input v-model="receiveForm.ContactCell"></el-input>
                    </el-form-item>
                    <el-form-item label="收件城市">
                        <el-row>
                            <el-col :span="7">
                                <el-select v-model="receiveForm.ContactProvinceAreaId" filterable style="width: 100%"
                                    placeholder="请选择" @change="changeProvinces($event, 'Contact')">
                                    <el-option v-for="item in ContactProvinces" :key="item.AreaName"
                                        :label="item.AreaName" :value="item.AreaId" />
                                </el-select>
                            </el-col>
                            <el-col :span="7" :offset="1">
                                <el-select v-model="receiveForm.ContactCityAreaId" filterable style="width: 100%"
                                    placeholder="请选择" @change="changeCitys($event, 'Contact')">
                                    <el-option v-for="item in ContactCityItems" :key="item.AreaName"
                                        :label="item.AreaName" :value="item.AreaId" />
                                </el-select>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <el-select v-model="receiveForm.ContactDistrictAreaId" filterable style="width: 100%"
                                    placeholder="请选择">
                                    <el-option v-for="item in ContactDistricts" :key="item.AreaName"
                                        :label="item.AreaName" :value="item.AreaId" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="收件详细地址" prop="ContactAddress">
                        <el-input v-model="receiveForm.ContactAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="receiveForm.OrderRemark" maxlength="100" :rows="4" show-word-limit
                            type="textarea">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" :loading="btnLoading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose(1)">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
import { ElMessage } from "element-plus";
import {
    GetProvinceList,
    GetCityList,
    GetDistrictList,
    GetDictionaryDetailList,
} from "@/api/common.js";
import {
    GetOrderById,
    ModifyOrderContactInfo
} from "@/api/order.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,

    orderId: {
        type: String,
        default: "",
    },
});
// 从属性中解构
const { visible } = toRefs(props);
const btnLoading = ref(false);
const emit = defineEmits(["CloseVisible"]);
// 创建本地状态跟踪对话框的可见性
const dialogVisible = ref(false);


// 当本地对话框关闭时，通知父组件更新Visible值
const handleClose = (op) => {
    emit("CloseVisible", op);
};
const formUpdateRef = ref(null);
const receiveForm = reactive({
    OrderId: "",
    ContactProvinceAreaId: "", //配送的省ID
    ContactProvinceName: "", //配送的省
    ContactCityAreaId: "", //配送的市ID
    ContactCityName: "", //配送的市
    ContactDistrictAreaId: "", //配送的区ID
    ContactDistrictName: "", //配送的区
    ContactAddress: "", //配送的详细地址
    ContactName: "", //收件人
    ContactCell: "", //收件手机
    OrderRemark: "",
})
const receiveRules = {
    ContactName: [{ required: true, message: "请输入收件人", trigger: "blur" }],
    ContactCell: [{ required: true, message: "请输入收件手机", trigger: "blur" }],
    ContactAddress: [{ required: true, message: "请输入收件详细地址", trigger: "blur" }]
};
const SenderProvinces = ref([]);
const SenderCityItems = ref([]);
const SenderDistricts = ref([]);
const ContactProvinces = ref([]);
const ContactCityItems = ref([]);
const ContactDistricts = ref([]);
const GetOrderByIdApi = async (id) => {
    let res = await GetOrderById({
        ObjectId: id,
    });
    if (res.Code == 200) {
        clearForm();
        receiveForm.OrderId = id;
        receiveForm.ContactProvinceAreaId = res.DataMap.ContactProvinceAreaId;
        receiveForm.ContactProvinceName = res.DataMap.ContactProvinceName;
        receiveForm.ContactCityName = res.DataMap.ContactCityName;
        receiveForm.ContactCell = res.DataMap.ContactCell;
        receiveForm.ContactName = res.DataMap.ContactName;
        receiveForm.ContactAddress = res.DataMap.ContactAddress;
        receiveForm.ContactDistrictName = res.DataMap.ContactDistrictName;
        receiveForm.OrderRemark = res.DataMap.OrderRemark;
        GetCityListApi(
            res.DataMap.ContactProvinceAreaId,
            res.DataMap.ContactProvinceName,
            "Contact",
            res.DataMap.ContactCityAreaId
        );
        GetDistrictListApi(
            res.DataMap.ContactCityAreaId,
            res.DataMap.ContactCityName,
            "Contact",
            res.DataMap.ContactDistrictAreaId
        );
    }
}
const GetProvinceListApi = async () => {
    let res = await GetProvinceList({});
    if (res.Code == 200) {
        SenderProvinces.value = res.DataMap;
        ContactProvinces.value = res.DataMap;
    }
};
GetProvinceListApi();
const GetCityListApi = async (AreaId, AreaName, type, ContactCityAreaId) => {
    let res = await GetCityList({
        ProvinceAreaId: AreaId,
        ProvinceName: AreaName,
    });
    if (res.Code == 200) {
        if (type == "Contact") {
            ContactCityItems.value = res.DataMap;
        } else {
            SenderCityItems.value = res.DataMap;
        }
    }
    receiveForm.ContactCityAreaId = ContactCityAreaId;
};
const GetDistrictListApi = async (
    AreaId,
    CityName,
    type,
    ContactDistrictAreaId
) => {
    let res = await GetDistrictList({
        CityAreaId: AreaId,
        CityName: CityName,
    });
    if (res.Code == 200) {
        if (type == "Contact") {
            ContactDistricts.value = res.DataMap;
        } else {
            SenderDistricts.value = res.DataMap;
        }
    }
    receiveForm.ContactDistrictAreaId = ContactDistrictAreaId;
};
//选中省份
const changeProvinces = (key, type) => {
    if (type == "Contact") {
        ContactProvinces.value.forEach((row) => {
            if (key == row.AreaId) {
                ContactCityItems.value = [];
                ContactDistricts.value = [];
                receiveForm.ContactCityAreaId = "";
                receiveForm.ContactDistrictAreaId = "";
                GetCityListApi(row.AreaId, row.AreaName, type);
                receiveForm.ContactProvinceName = row.AreaName;
            }
        });
    } else {
        SenderProvinces.value.forEach((row) => {
            if (key == row.AreaId) {
                GetCityListApi(row.AreaId, row.AreaName, type);
            }
        });
    }
};
//选中城市
const changeCitys = (key, type) => {
    if (type == "Contact") {
        ContactCityItems.value.forEach((row) => {
            if (key == row.AreaId) {
                GetDistrictListApi(row.AreaId, row.AreaName, type);
                receiveForm.ContactCityName = row.AreaName;
            }
        });
    } else {
        SenderCityItems.value.forEach((row) => {
            if (key == row.AreaId) {
                GetDistrictListApi(row.AreaId, row.AreaName, type);
            }
        });
    }
};
const clearForm = () => {
    receiveForm.ContactProvinceAreaId = "";
    receiveForm.OrderId = "";
    receiveForm.ContactProvinceName = "";
    receiveForm.ContactCityAreaId = "";
    receiveForm.ContactCityName = "";
    receiveForm.ContactDistrictAreaId = "";
    receiveForm.ContactDistrictName = "";
    receiveForm.ContactAddress = "";
    receiveForm.ContactName = "";
    receiveForm.ContactCell = "";
    receiveForm.OrderRemark = "";
};
const onSubmit = () => {
    formUpdateRef.value.validate(async (valid) => {
        if (valid) {
            if (!receiveForm.ContactProvinceAreaId || !receiveForm.ContactCityAreaId || !receiveForm.ContactDistrictAreaId) {
                ElMessage.error("请选择完整的收件地址");
                return false;
            }
            btnLoading.value = true;
            let res = await ModifyOrderContactInfo({
                Order: receiveForm,
            });
            btnLoading.value = false;
            if (res.Code == 200) {
                ElMessage.success('操作成功');
                emit("CloseVisible", 'save');
            } else {
                ElMessage.error(res.Message);
            }
        } else {
            ElMessage.error("请填写完整信息");
            return false;
        }
    })
}
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (dialogVisible.value) {

            GetOrderByIdApi(props.orderId)
        }
    }
);
</script>
