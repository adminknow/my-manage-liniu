<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <el-form ref="formRef" :model="form" :rules="rules" label-width="180px">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="模板名称" prop="TemplateName">
                                <el-input v-model="form.TemplateName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="配送形式" prop="DeliverType">
                                <el-radio-group v-model="form.DeliverType">
                                    <el-radio label="0">可配送至</el-radio>
                                    <el-radio label="1">不可配送至</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="备注">
                                <el-input maxlength="100" :rows="4" show-word-limit type="textarea" v-model="form.TemplateRemark" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="18">
                            <div class="tranferbox">
                                <el-row>
                                    <el-col :span="10" :offset="2">
                                        <div class="conbox">
                                            <div class="titbox">
                                                <el-input placeholder="搜索省、市" v-model="filterText">
                                                </el-input>
                                            </div>
                                            <div class="wordbox">
                                                <el-tree @check="getData" show-checkbox class="filter-tree"
                                                    node-key="AreaId" :data="data" :props="defaultProps"
                                                    :filter-node-method="filterNode" ref="tree"></el-tree>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="11" :offset="1">
                                        <div class="conbox">
                                            <el-row>
                                                <el-col :span="19">
                                                    <div class="titbox">
                                                        <h2>已选择（{{ keyarr.length }}）</h2>
                                                    </div>
                                                </el-col>
                                                <el-col :span="4" :offset="1">
                                                    <el-link :underline="false" @click="handleDel()"
                                                        style="color: #f56c6c;margin-top:6px">
                                                        清空</el-link>
                                                </el-col>
                                            </el-row>

                                            <div class="wordbox">
                                                <ul id="nav">
                                                    <li v-for="(item, index) in keyarr" :key="index">
                                                        <div class="inli">
                                                            <span>{{ item.AreaName }}</span>
                                                            <i class="el-icon-mpguanbi" @click="removeData(item)"></i>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>

                                <i class="el-icon-arrow-right"></i>&emsp;

                            </div>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button class="button1" v-if="Type != 'view'" round :loading="btnLoading"
                            @click="onSubmit('formRef')">
                            &nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

    </div>

</template>
<script>
import common from "@/utils/common.js";
import { GetAreaList } from "@/api/common.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { SaveExpressTemplate, GetExpressTemplate } from "@/api/ticket.js";
import Cookie from "js-cookie";
export default {
    data() {
        return {
            Type: "",
            input3: "",
            checkList: [],
            keyarr: [],
            filterText: "",
            data: [

            ],
            defaultProps: {
                children: "SubAreas",
                label: "AreaName",
            },

            form: {
                TemplateId: "",
                TemplateName: "",//模板名称
                TemplateRemark: "",
                TemplateStatus: "",
                DeliverType: "0",//0:可配送;1:不可配送
                Details: []
            },
            rules: {
                TemplateName: [
                    { required: true, message: "请输入标题", trigger: "blur" },
                ],
            },
            btnLoading: false,
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.GetAreaListData()
        this.form.TemplateId = this.$route.query.ID ? this.$route.query.ID : "";
        if (this.form.TemplateId) {
            this.GetExpressTemplateByID(this.form.TemplateId)
        }
        this.Type = this.$route.query.Type ? this.$route.query.Type : "";
    },
    methods: {
        //关键词搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.AreaName.indexOf(value) !== -1;
        },
        getData() {
            this.keyarr = []
            this.checkList = this.$refs.tree.getCheckedNodes();
            if (this.checkList.length != 0) {
                for (var i = 0; i < this.checkList.length; i++) {
                    if (!this.checkList[i].children) {
                        this.keyarr.push(this.checkList[i])
                    }
                }

            } else {
                this.keyarr = []
            }
        },
        setCheckedNodes(arr) {
            this.$refs.tree.setCheckedNodes(arr);
        },
        removeData(data) {
            let checklist = this.keyarr;
            for (var i = 0; i < checklist.length; i++) {
                if (checklist[i].AreaName === data.AreaName) {
                    checklist.splice(i, 1);
                }
            }
            this.keyarr = checklist;
            this.setCheckedNodes(this.keyarr);
        },
        //表单提交
        onSubmit(form) {
            this.$refs[form].validate(async (valid) => {
                if (valid) {
                    var tree = this.$refs.tree.getCheckedKeys();
                    let Details = [];
                    tree.forEach(row => {
                        let objInfo = {
                            TemplateId: this.form.TemplateId,
                            DeliverType: this.form.DeliverType,
                            DeliverAreaId: row
                        };
                        Details.push(objInfo);
                    })
                    this.btnLoading = true;
                    let res = await SaveExpressTemplate({
                        ExpressTemplate: this.form
                    })
                    this.btnLoading = false;
                    if (res.Code == 200) {
                        ElMessage.success("保存成功");
                    }
                } else {
                    return false;
                }
            });
        },
        handleDel() {
            this.$refs.tree.setCheckedKeys([]);
            this.keyarr = []
        },
        async GetAreaListData() {
            let res = await GetAreaList({})
            if (res.Code == 200) {
                res.DataMap.forEach(row => {
                    let AreaList = {
                        AreaCode: "",
                        AreaId: "",
                        AreaName: "",
                        AreaNamePath: "",
                        AreaPinyin: "",
                        AreaType: "",
                        AreaTypeDesc: "",
                        ParentAreaId: "",
                        SubAreas: [],
                        WxCityId: ""
                    }
                    AreaList.AreaCode = row.AreaCode;
                    AreaList.AreaId = row.AreaId;
                    AreaList.AreaName = row.AreaName;
                    AreaList.AreaNamePath = row.AreaNamePath;
                    AreaList.AreaPinyin = row.AreaPinyin;
                    AreaList.AreaType = row.AreaType;
                    AreaList.AreaTypeDesc = row.AreaTypeDesc;
                    AreaList.ParentAreaId = row.ParentAreaId;
                    AreaList.WxCityId = row.WxCityId;
                    this.data.push(AreaList)
                })
            }
        },
        async GetExpressTemplateByID(ID) {
            let res = await GetExpressTemplate({
                ObjectId: ID
            });
            if (res.Code == 200) {
                let treeData = [];
                res.DataMap.Details.forEach(row => {
                    treeData.push(row.DeliverAreaId)
                    this.form.DeliverType = row.DeliverType.toString()
                })
                this.form.TemplateId = res.DataMap.TemplateId;
                this.form.TemplateName = res.DataMap.TemplateName;
                this.form.TemplateRemark = res.DataMap.TemplateRemark;
                setTimeout(() => {
                    this.$refs.tree.setCheckedKeys(treeData);
                    this.getData()
                }, 2000);

            }
        }
    },
};
</script>

<style scoped>
.conbox {
    padding: 10px;
    height: 400px;
    overflow-y: scroll;
    border: solid 1px rgb(233, 233, 233);
}

.wordbox {
    padding-left: 10px;

}

.titbox {
    font-size: 12px;
}

#nav {
    list-style-type: none;
    margin-top: 10px;
}
</style>