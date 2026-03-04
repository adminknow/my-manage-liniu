<!-- 券商配置信息弹窗 -->
<template>
    <el-dialog title="配置信息" :model-value="visible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <!-- 将原有的配置表单 template 代码移到这里 -->
        <el-form ref="formConfigRef" :model="formConfig" label-width="160px">
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="旺店通" name="first">
                    <el-form-item label="对接">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false" v-model="formConfig.switch"
                            inline-prompt active-text="开" inactive-text="关" />
                    </el-form-item>
                    <el-form-item label="版本" v-if="formConfig.switch">
                        <el-radio-group v-model="formConfig.version"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false">
                            <el-radio label="qyb">企业版</el-radio>
                            <el-radio label="qjb">旗舰版</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="卖家账号(sid)" v-if="formConfig.switch">
                        <el-input v-model="formConfig.sid" :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            style="width: 74%" @input="InputSid"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺编号(shop_no)" v-if="formConfig.switch">
                        <el-input v-model="formConfig.shop_no" style="width: 74%"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false" @input="InputShopNo"></el-input>
                    </el-form-item>
                    <el-form-item label="接口账号(appkey)" v-if="formConfig.switch">
                        <el-input v-model="formConfig.appkey" style="width: 74%"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false" @input="InputAppkey"></el-input>
                    </el-form-item>
                    <el-form-item label="接口秘钥(appsecret)" v-if="formConfig.switch">
                        <el-input v-model="formConfig.appsecret" style="width: 74%"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false" @input="InputAppsecret"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="平台" name="second">
                    <el-form-item label="扣除费率" label-width="200px">
                        <el-input v-model="formConfig.deduct" style="width: 74%" @input="InputDeduct">
                            <template #append>%</template></el-input>
                    </el-form-item>
                    <el-form-item label="使用的小程序类型" label-width="200px">
                        <el-select v-model="formConfig.Configs[12].ConfigValue" clearable style="width: 74%"
                            placeholder="请选择">
                            <el-option label="平台公域" value="0"></el-option>
                            <el-option label="平台私域" value="1"></el-option>
                            <el-option label="礼牛卡券兑换" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="私域时可以跳转礼牛商城" label-width="200px">
                        <el-select v-model="formConfig.Configs[22].ConfigValue" clearable style="width: 74%"
                            placeholder="请选择">
                            <el-option label="否" value="1"></el-option>
                            <el-option label="是" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="库存" name="three">
                    <el-form-item label="线下兑换，校验商品的库存" label-width="220px">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.InventorySwitch" inline-prompt active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="线上兑换，校验商品的库存" label-width="220px">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.InventorySwitch1" inline-prompt active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="线下兑换，校验商品提前预约" label-width="220px">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.InventorySwitch2" inline-prompt active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="发货通知" label-width="220px">
                        <el-input :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.deliverNotice" style="width: 80%" maxlength="200" show-word-limit
                            :rows="2" type="textarea">
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="小程序客服" name="four">
                    <el-form-item label="开关">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.wxxcxKfSwitch" inline-prompt active-text="开" inactive-text="关" />
                    </el-form-item>
                    <div v-if="formConfig.wxxcxKfSwitch">
                        <el-form-item v-for="(item, index) in LabelList" :key="index" :label="item.labelDesc"
                            label-width="340px">
                            <el-input v-model="item.value" style="width: 80%" disabled></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="客服昵称" v-if="formConfig.wxxcxKfSwitch">
                        <el-input v-model="formConfig.wxxcxKfNickname" style="width: 80%" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客服头像" v-if="formConfig.wxxcxKfSwitch">
                        <div class="kf1-uploader">
                            <img :src="formConfig.wxxcxKfHeadimgUrl" class="kf1-uploader-avatar" />
                        </div>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="监管平台" name="five">
                    <el-form-item label="开关">
                        <el-switch :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            v-model="formConfig.shmcmpSwitchDesc" inline-prompt active-text="开" inactive-text="关" />
                    </el-form-item>
                    <el-form-item label="联网发行唯一标识" v-if="formConfig.shmcmpSwitchDesc">
                        <el-input v-model="formConfig.shmcmpUniqueNo"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false" style="width: 74%"
                            @input="InputShmcmpUniqueNo"></el-input>
                    </el-form-item>
                    <el-form-item label="AK" v-if="formConfig.shmcmpSwitchDesc">
                        <el-input v-model="formConfig.shmcmpAk" :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            style="width: 74%" @input="InputShmcmpAk"></el-input>
                    </el-form-item>
                    <el-form-item label="SK" v-if="formConfig.shmcmpSwitchDesc">
                        <el-input v-model="formConfig.shmcmpSk" :disabled="loginUser.UnitName == '礼牛网' ? true : false"
                            style="width: 74%" @input="InputShmcmpSk"></el-input>
                    </el-form-item>
                    <el-form-item label="私钥" v-if="formConfig.shmcmpSwitchDesc">
                        <el-input v-model="formConfig.shmcmpPrivatekey"
                            :disabled="loginUser.UnitName == '礼牛网' ? true : false" style="width: 74%"
                            :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                            @input="InputShmcmpPrivatekey"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商城" name="six">
                    <el-form-item label="开关" label-width="180px">
                        <el-switch v-model="formConfig.mallSwitchDesc" inline-prompt active-text="开"
                            inactive-text="关" />
                    </el-form-item>
                    <el-form-item label="商品分类的层级" v-if="formConfig.mallSwitchDesc" label-width="180px">
                        <el-select style="width: 50%" v-model="formConfig.mallGoodsCategoryLevel" placeholder="请选择层级">
                            <el-option label="小类(1级)" value="1"> </el-option>
                            <el-option label="中类-小类(2级)" value="2"> </el-option>
                            <el-option label="大类-中类-小类(3级)" value="3"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="14">
                            <el-form-item label="商城是否开放外部供应商" v-if="formConfig.mallSwitchDesc" label-width="210px">
                                <!-- 1:不开放，0开放 -->
                                <el-select style="width: 100%" disabled v-model="formConfig.Configs[25].ConfigValue"
                                    placeholder="请选择是否">
                                    <el-option label="否" value="1"> </el-option>
                                    <el-option label="是" value="0"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="是否隐藏商品库存" v-if="formConfig.mallSwitchDesc" label-width="180px">
                        <el-select style="width: 50%" v-model="formConfig.Configs[23].ConfigValue" placeholder="请选择是否">
                            <el-option label="是" value="1"> </el-option>
                            <el-option label="否" value="0"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="从券跳转至购买的提示" label-width="180px">
                        <el-input v-model="formConfig.Configs[24].ConfigValue" disabled style="width: 50%"
                            maxlength="200" show-word-limit :rows="2" type="textarea" placeholder="商城跳转说明提示"></el-input>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button class="button1" @click="handleSave">保 存</el-button>
                <el-button class="button2" @click="handleClose">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { GetUnitConfigs, ModifyUnitConfigs } from "@/api/index.js";
import { GetAllAccount } from "@/api/wxxcx.js";
import Cookie from "js-cookie";
const loginUser = JSON.parse(Cookie.get("User"));
const props = defineProps(['visible', 'unitId']);
const emit = defineEmits(['update:visible', 'success']);

// 将原文件中 formConfig, InputSid 等相关逻辑移入此处
const activeName = ref("first");
const formConfigRef = ref(null);

// 定义映射关系：Key -> 处理函数 或 属性名
const configMappers = {
    'wdt.api.switch': (val) => formConfig.switch = val === 'on',
    'wdt.api.version': (val) => formConfig.version = val || 'qyb',
    'wdt.api.sid': 'sid', // 简写，直接赋值给 formConfig.sid
    'wdt.api.shop_no': 'shop_no',
    'check.goods.stock.when.exchange.in.shop': (val) => formConfig.InventorySwitch = val === '1',
    // ... 其他字段
};

const formConfig = reactive({
    UnitId: "",
    UnitType: "2",
    Configs: [
        {
            //0
            ObjectId: "",
            ConfigKey: "wdt.api.switch",
            ConfigValue: "",
            ConfigDesc: "开关(on:打开)",
        },
        {
            ObjectId: "",
            ConfigKey: "wdt.api.version",
            ConfigValue: "qyb",
            ConfigDesc: "版本(qjb:旗舰版;qyb:企业版;空默认为企业版)",
        },
        {
            //2
            ObjectId: "",
            ConfigKey: "wdt.api.sid",
            ConfigValue: "",
            ConfigDesc: "卖家账号，接口请求的公共参数sid",
        },
        {
            ObjectId: "",
            ConfigKey: "wdt.api.shop_no",
            ConfigValue: "",
            ConfigDesc: "店铺编号，接口请求时的业务参数shop_no",
        },
        {
            //4
            ObjectId: "",
            ConfigKey: "wdt.api.appsecret",
            ConfigValue: "",
            ConfigDesc: "接口秘钥，接口请求的参数appsecret",
        },
        {
            //5
            ObjectId: "",
            ConfigKey: "wdt.api.appkey",
            ConfigValue: "",
            ConfigDesc: "接口账号，接口请求的公共参数appkey",
        },
        {
            ObjectId: "",
            ConfigKey: "order.fee.deduct.rate",
            ConfigValue: "",
            ConfigDesc: "订单费用的平台扣除比例(%)",
        },
        {
            //7
            ObjectId: "",
            ConfigKey: "check.goods.stock.when.exchange.in.shop",
            ConfigValue: "",
            ConfigDesc: "线下门店兑换券时，是否校验商品的库存(1:是)",
        },
        {
            ObjectId: "",
            ConfigKey: "check.goods.stock.when.exchange.online",
            ConfigValue: "",
            ConfigDesc: "线上兑换券时，是否校验商品的库存(1:是)",
        },
        {
            //9
            ObjectId: "",
            ConfigKey: "wxxcx.kf.headimg.url",
            ConfigValue: "",
            ConfigDesc: "【微信小程序客服】头像URL",
        },
        {
            //10
            ObjectId: "",
            ConfigKey: "wxxcx.kf.nickname",
            ConfigValue: "",
            ConfigDesc: "【微信小程序客服】昵称",
        },
        {
            ObjectId: "",
            ConfigKey: "wxxcx.kf.switch",
            ConfigValue: "",
            ConfigDesc: "【微信小程序客服】开关(on:打开)",
        },
        {
            //12
            ObjectId: "",
            ConfigKey: "wxxcx.ticket.broker",
            ConfigValue: "",
            ConfigDesc: "是否启用券商私域小程序(1:是)",
        },
        {
            ObjectId: "",
            ConfigKey: "check.prebook.when.exchange.in.shop",
            ConfigValue: "",
            ConfigDesc:
                "线下门店兑换券时，如果券设置了需要提前预约，是否需要校验(1:是)",
        },
        {
            //14
            ObjectId: "",
            ConfigKey: "shmcmp.ak",
            ConfigValue: "",
            ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】AK",
        },
        {
            ObjectId: "",
            ConfigKey: "shmcmp.privatekey",
            ConfigValue: "",
            ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】私钥",
        },
        {
            //16
            ObjectId: "",
            ConfigKey: "shmcmp.sk",
            ConfigValue: "",
            ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】SK",
        },
        {
            ObjectId: "",
            ConfigKey: "shmcmp.switch",
            ConfigValue: "",
            ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】开关(on:打开)",
        },
        {
            //18
            ObjectId: "",
            ConfigKey: "shmcmp.uniqueno",
            ConfigValue: "",
            ConfigDesc: "【上海市商务委单用途预付卡协同监管平台】联网发行唯一标识",
        },
        {
            ObjectId: "",
            ConfigKey: "deliver.notice",
            ConfigValue: "",
            ConfigDesc: "快递发货通知",
        },
        {
            //20
            ObjectId: "",
            ConfigKey: "mall.switch",
            ConfigValue: "",
            ConfigDesc: "【商城】开关(on:打开)",
        },
        {
            ObjectId: "",
            ConfigKey: "mall.goods.category.level",
            ConfigValue: "",
            ConfigDesc:
                "【商城】商品分类的层级(1级:小类;2级:中类-小类;3级:大类-中类-小类)",
        },
        {
            //22
            ObjectId: "",
            ConfigKey: "liniu.mall.hide",
            ConfigValue: "0",
            ConfigDesc: "券商小程序类型是私域时，不显示礼牛商城(1:不显示)",
        },
        {
            //23
            ObjectId: "",
            ConfigKey: "mall.goods.stock.hide",
            ConfigValue: "0",
            ConfigDesc: "【商城】是否隐藏商品的库存(1:是)",
        },
        {
            //24
            ObjectId: "",
            ConfigKey: "ticket.buy.notice",
            ConfigValue: "",
            ConfigDesc: "从我的卡券点击购买跳转至商品详情页的提示",
        },
        {
            //25
            ObjectId: "",
            ConfigKey: "mall.goods.onlymy",
            ConfigValue: "0",
            ConfigDesc: "【商城】在私有商城里是否只有自己的商品(0:不是)",
        },
    ],
    switch: false, //默认为关 开关(on:打开)
    version: "qyb",
    sid: "", //卖家账号
    shop_no: "", //店铺编号
    appsecret: "", //接口秘钥
    appkey: "", //接口账号
    deduct: "", //扣除比例
    InventorySwitch: false, //默认为关 开关(on:打开) 库存验证开启关闭判断(线下兑换)
    InventorySwitch1: false, //默认为关 开关(on:打开) 库存验证开启关闭判断(线上兑换)
    InventorySwitch2: false, //默认为关 开关(on:打开) 券商配置项：线下门店兑换券时，如果券设置了需要提前预约，是否需要校验(1:是)
    wxxcxKfSwitch: false, //默认为关 开关(on:打开)
    wxxcxKfNickname: "", //昵称
    wxxcxKfHeadimgUrl: "", //头像
    wxxcxKfBusinessId: "",
    wxxcxTicketBrokerSwitch: false, //是否启用券商私域小程序(1:是)

    shmcmpAk: "", //【上海市商务委单用途预付卡协同监管平台】AK
    shmcmpPrivatekey: "", //【上海市商务委单用途预付卡协同监管平台】私钥
    shmcmpSk: "", //【上海市商务委单用途预付卡协同监管平台】SK
    shmcmpSwitchDesc: false, //开关(on:打开)
    shmcmpUniqueNo: "", //【上海市商务委单用途预付卡协同监管平台】联网发行唯一标识
    mallSwitchDesc: false, //开关(on:打开)
    mallGoodsCategoryLevel: "", //商品分类等级
    deliverNotice: "", //快递发货通知
});
const InputSid = (value) => {
    formConfig.Configs[2].ConfigValue = value;
};
const InputShopNo = (value) => {
    formConfig.Configs[3].ConfigValue = value;
};
const InputAppkey = (value) => {
    formConfig.Configs[5].ConfigValue = value;
};
const InputAppsecret = (value) => {
    formConfig.Configs[4].ConfigValue = value;
};
const InputDeduct = (value) => {
    formConfig.Configs[6].ConfigValue = value;
};
const InputShmcmpAk = (value) => {
    formConfig.Configs[14].ConfigValue = value;
};
const InputShmcmpPrivatekey = (value) => {
    formConfig.Configs[15].ConfigValue = value;
};
const InputShmcmpSk = (value) => {
    formConfig.Configs[16].ConfigValue = value;
};
const InputShmcmpUniqueNo = (value) => {
    formConfig.Configs[18].ConfigValue = value;
};
const handleSave = async () => {
    // 保存逻辑...
    emit('success');
    handleClose();
}
const handleClose = () => emit('update:visible', false);
const GetUnitConfigsApi = async (ID) => {
    let res = await GetUnitConfigs({
        ObjectId: ID,
    })
    if (res.Code == 200) {
        res.DataMap.forEach((row) => {
            if (row.ConfigKey == "wdt.api.switch") {
                //是否开启
                formConfig.switch = row.ConfigValue == "on" ? true : false;
            }
            if (row.ConfigKey == "wdt.api.version") {
                //版本
                formConfig.version =
                    row.ConfigValue == ""
                        ? "qyb"
                        : row.ConfigValue == "qyb"
                            ? "qyb"
                            : "qjb";
            }
            if (row.ConfigKey == "wdt.api.sid") {
                //卖家账号
                formConfig.sid = row.ConfigValue;
                formConfig.Configs[2].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "wdt.api.shop_no") {
                //店铺编号
                formConfig.shop_no = row.ConfigValue;
                formConfig.Configs[3].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "wdt.api.appsecret") {
                //秘钥
                formConfig.appsecret = row.ConfigValue;
                formConfig.Configs[4].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "wdt.api.appkey") {
                //账号
                formConfig.appkey = row.ConfigValue;
                formConfig.Configs[5].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "order.fee.deduct.rate") {
                //缴费比例
                formConfig.deduct = row.ConfigValue;
                formConfig.Configs[6].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "check.goods.stock.when.exchange.in.shop") {
                //线下门店兑换券时，是否校验商品的库存(1:是)
                formConfig.InventorySwitch = row.ConfigValue == "1" ? true : false;
            }
            if (row.ConfigKey == "check.goods.stock.when.exchange.online") {
                //线上门店兑换券时，是否校验商品的库存(1:是)
                formConfig.InventorySwitch1 = row.ConfigValue == "1" ? true : false;
            }
            if (row.ConfigKey == "check.prebook.when.exchange.in.shop") {
                formConfig.InventorySwitch2 = row.ConfigValue == "1" ? true : false;
            }
            if (row.ConfigKey == "wxxcx.kf.nickname") {
                //昵称
                formConfig.wxxcxKfNickname = row.ConfigValue;
                formConfig.Configs[10].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "wxxcx.kf.headimg.url") {
                //头像URL
                formConfig.wxxcxKfHeadimgUrl = row.ConfigValue;
                formConfig.Configs[9].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "wxxcx.kf.switch") {
                //是否开启
                formConfig.wxxcxKfSwitch = row.ConfigValue == "on" ? true : false;
                formConfig.Configs[11].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey.indexOf("business_id") != -1) {
                if (formConfig.wxxcxKfBusinessId) {
                    formConfig.wxxcxKfBusinessId =
                        formConfig.wxxcxKfBusinessId + " ; " + row.ConfigValue;
                } else {
                    formConfig.wxxcxKfBusinessId = row.ConfigValue;
                }
            }
            if (row.ConfigKey == "wxxcx.ticket.broker") {
                formConfig.Configs[12].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "shmcmp.switch") {
                //开关(on:打开)
                formConfig.shmcmpSwitchDesc = row.ConfigValue == "on" ? true : false;
                formConfig.Configs[17].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "shmcmp.ak") {
                //AK
                formConfig.shmcmpAk = row.ConfigValue;
                formConfig.Configs[14].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "shmcmp.privatekey") {
                //私钥
                formConfig.shmcmpPrivatekey = row.ConfigValue;
                formConfig.Configs[15].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "shmcmp.sk") {
                //SK
                formConfig.shmcmpSk = row.ConfigValue;
                formConfig.Configs[16].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "shmcmp.uniqueno") {
                //联网发行唯一标识
                formConfig.shmcmpUniqueNo = row.ConfigValue;
                formConfig.Configs[18].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "deliver.notice") {
                //快递发货通知
                formConfig.deliverNotice = row.ConfigValue;
                formConfig.Configs[19].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "mall.switch") {
                ////商城开关(on:打开)
                formConfig.mallSwitchDesc = row.ConfigValue == "on" ? true : false;
                formConfig.Configs[20].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "mall.goods.category.level") {
                formConfig.Configs[21].ConfigValue = row.ConfigValue;
                formConfig.mallGoodsCategoryLevel = row.ConfigValue;
            }
            if (row.ConfigKey == "liniu.mall.hide") {
                formConfig.Configs[22].ConfigValue = row.ConfigValue;
            }
            if (row.ConfigKey == "mall.goods.stock.hide") {
                formConfig.Configs[23].ConfigValue = row.ConfigValue.toString();
            }
            if (row.ConfigKey == "ticket.buy.notice") {
                formConfig.Configs[24].ConfigValue = row.ConfigValue.toString();
            }
            if (row.ConfigKey == "mall.goods.onlymy") {
                formConfig.Configs[25].ConfigValue = row.ConfigValue.toString();
            }
        });
        ArrangeList(res.DataMap);
    }
}
const AllAccountList = ref([]);
const GetAllAccountApi = async () => {
    let res = await GetAllAccount({});
    if (res.Code == 200) {
        AllAccountList.value = res.DataMap;
    }
};
GetAllAccountApi();
const LabelList = ref([]);
//整理数组，把数据弄成新的数组
const ArrangeList = (ListPost) => {
    LabelList.value = [];
    for (let j = 0; j < AllAccountList.value.length; j++) {
        for (let i = 0; i < ListPost.length; i++) {
            if (
                ListPost[i].ConfigKey.indexOf(AllAccountList.value[j].AppId) != -1 &&
                ListPost[i].ConfigDesc == "【微信小程序客服】子商户ID"
            ) {
                //说明匹配上了appid
                LabelList.value.push({
                    labelDesc:
                        AllAccountList.value[j].AppName +
                        "子商户(" +
                        AllAccountList.value[j].AppId +
                        ")",
                    value: ListPost[i].ConfigValue,
                });
            }
        }
    }
};
// 监听弹窗显示状态
watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            GetUnitConfigsApi(props.unitId);
        }
    }
);
</script>