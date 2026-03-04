<template>
  <div class="container">
    <el-row style="margin-top: 20px; padding-bottom: 100px">
      <el-col :span="24">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="180px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="模板名称" prop="TemplateName">
                <el-input v-model="form.TemplateName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注">
                <el-input
                  maxlength="100"
                  :rows="2"
                  show-word-limit
                  type="textarea"
                  v-model="form.TemplateRemark"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="免配送费">
                <el-radio-group v-model="form.HasFee">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="tranferbox">
                <el-row>
                  <el-col :span="12" :offset="1" style="">
                    <div class="conbox">
                      <el-row>
                        <el-col :span="7">
                          <el-form-item label="配送形式" label-width="auto">
                            <el-select
                              v-model="detail.DeliverType"
                              placeholder="费用类型"
                            >
                              <el-option label="可配送" value="0"> </el-option>
                              <el-option label="不可配送" value="1">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="7"
                          :offset="1"
                          v-if="form.HasFee == 1 && detail.DeliverType == 0"
                        >
                          <el-form-item label="费用类型" label-width="auto">
                            <el-select
                              v-model="detail.FeeType"
                              placeholder="费用类型"
                            >
                              <el-option label="免费" value="0"> </el-option>
                              <el-option label="每张券" value="1"> </el-option>
                              <el-option label="每张配送单" value="2">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>

                        <el-col
                          :span="7"
                          :offset="1"
                          v-if="
                            form.HasFee == 1 &&
                            detail.DeliverType == 0 &&
                            detail.FeeType != 0
                          "
                        >
                          <el-form-item label="快递费" label-width="auto">
                            <el-input v-model="detail.Fee" clearable
                              ><template #append>元</template></el-input
                            >
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div class="titbox">
                        <el-input placeholder="搜索省、市" v-model="filterText">
                        </el-input>
                      </div>
                      <div class="wordbox">
                        <el-tree
                          show-checkbox
                          class="filter-tree"
                          node-key="AreaId"
                          :data="data"
                          :props="defaultProps"
                          :filter-node-method="filterNode"
                          ref="tree"
                        ></el-tree>
                      </div>
                    </div>
                  </el-col>
                  <el-col
                    :span="2"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <div style="display: flex; flex-direction: column">
                      <el-button
                        class="button-op-edit button-float "
                        round
                        @click="getData()"
                      >添加<el-icon><Right /></el-icon>
                      </el-button>
                      <el-button
                        style="margin-left: 3px"
                        class="button2 button-float"
                        round
                        @click="delData()"
                        ><el-icon><Back /></el-icon>删除
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="conbox">
                      <el-row style="display: none">
                        <el-col :span="19">
                          <div class="titbox">
                            <h2>已选择（{{ keyarr.length }}）</h2>
                          </div>
                        </el-col>
                        <el-col :span="4" :offset="1">
                          <el-link
                            :underline="false"
                            @click="handleDel()"
                            style="color: #f56c6c; margin-top: 6px"
                          >
                            清空</el-link
                          >
                        </el-col>
                      </el-row>
                      <div class="wordbox">
                        <!-- <el-table
                          :data="keyarr"
                          border
                          class="table"
                          :header-cell-style="{ 'text-align': 'center' }"
                          header-cell-class-name="table-header"
                          style="width: 100%"
                        >
                          <el-table-column align="center" label="配送区域">
                            <template #default="scope">
                              <div>{{ scope.row.info.AreaName }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column label="配送形式">
                            <template #default="scope">
                              {{ scope.row.DeliverTypeDesc }}
                            </template>
                          </el-table-column>
                          <el-table-column label="费用类型">
                            <template #default="scope">
                              {{ scope.row.FeeTypeDesc }}
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="配送价格(元)">
                            <template #default="scope">
                              {{ scope.row.Fee }}
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="操作">
                            <template #default="scope">
                              <div class="button-mgl">
                                <el-button
                                  class="button-op-del"
                                  size="small"
                                  @click="removeData(scope.row)"
                                  >删除
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table> -->
                        <ul id="nav">
                          <li v-for="(item, index) in keyarr" :key="index">
                            <div
                              class="inli"
                              style="display: flex; align-items: center"
                            >
                              <span>{{ item.DeliverTypeDesc }}至</span>
                              <span>{{ item.info.AreaName }},</span>
                              <span v-if="item.DeliverType != 1">{{
                                item.FeeTypeDesc
                              }}</span>
                              <span
                                v-if="
                                  item.Fee > 0 &&
                                  item.DeliverType != 1 &&
                                  item.FeeType != 0
                                "
                                >{{ item.Fee }}元</span
                              >
                              <i
                                class="el-icon-mpguanbi"
                                style="color: red; margin-left: 6px"
                                @click="removeData(item)"
                              ></i>
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
            <el-button
              class="button1"
              v-if="Type != 'view'"
              round
              :loading="btnLoading"
              @click="onSubmit('formRef')"
            >
              &nbsp;&nbsp;保&nbsp;&nbsp;存&nbsp;&nbsp;
            </el-button>
            <el-button class="button2" round @click="onReturn"
              >&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import common from "@/utils/common.js";
import { useStore } from "vuex";
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
      data: [],
      defaultProps: {
        children: "SubAreas",
        label: "AreaName",
      },

      form: {
        TemplateId: "",
        TemplateName: "", //模板名称
        TemplateRemark: "",
        TemplateStatus: "",
        DeliverType: "0", //0:可配送;1:不可配送
        HasFee: "0", //是否有快递费 0没有 1有
        Details: [],
      },
      detail: {
        DeliverType: "0", //0:可配送;1:不可配送
        FeeType: "0", //费用类型(0:免费;1:每张券;2:每张配送单)
        Fee: "0",
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
    },
  },
  mounted() {
    this.GetAreaListData();
    this.form.TemplateId = this.$route.query.ID ? this.$route.query.ID : "";
    if (this.form.TemplateId) {
      this.GetExpressTemplateByID(this.form.TemplateId);
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
      //把选中的添加到右边
      // 把选中的添加到右边
      const selectedNodes = JSON.parse(
        JSON.stringify(this.$refs.tree.getCheckedNodes())
      );

      selectedNodes.forEach((node) => {
        // 检查是否已经存在相同的 AreaId
        const exists = this.keyarr.some((item) => item.AreaId === node.AreaId);
        if (!exists) {
          let FeeTypeDesc = "";
          let FeeValue = 0;
          let FeeTypeValue = 0;
          //免费配送==0       //不免配送费，并且免费用
          if (
            this.form.HasFee == 0 ||
            (this.form.HasFee == 1 && this.detail.FeeType == 0)
          ) {
            FeeTypeDesc = "免费";
            FeeValue = 0;
            FeeTypeValue = 0;
          } else {
            FeeTypeDesc = this.detail.FeeType == 1 ? "每张券" : "每张配送单";
            FeeValue = this.detail.Fee;
            FeeTypeValue = this.detail.FeeType;
          }
          let object = {
            info: node,
            AreaId: node.AreaId,
            DeliverType: this.detail.DeliverType, // 0:可配送;1:不可配送
            FeeType: FeeTypeValue, // 费用类型(0:免费;1:每张券;2:每张配送单)
            Fee: FeeValue, // 费用(分)
            DeliverTypeDesc:
              this.detail.DeliverType === "0" ? "可配送" : "不可配送", // 0:可配送;1:不可配送
            FeeTypeDesc: FeeTypeDesc, // 费用类型(0:免费;1:每张券;2:每张配送单)
          };
          this.keyarr.push(object);
        }
      });
      console.log(this.keyarr);
    },
    delData(){
      this.keyarr=[];
    },
    setRightData(pData) {
      pData.forEach((row) => {
        let FeeTypeDesc = "";
        let FeeValue = 0;
        let FeeTypeValue = 0;
        //免费配送==0
        if (
          this.form.HasFee == 0 ||
          (this.form.HasFee == 1 && row.FeeType == 0)
        ) {
          FeeTypeDesc = "免费";
          FeeValue = 0;
          FeeTypeValue = 0;
        } else {
          FeeTypeDesc = row.FeeType == 1 ? "每张券" : "每张配送单";
          FeeValue = (row.Fee / 100).toFixed(2);
          FeeTypeValue = row.FeeType;
        }
        this.keyarr.push({
          AreaId: row.DeliverAreaId,
          info: { AreaName: row.DeliverAreaName, AreaId: row.DeliverAreaId },
          DeliverType: row.DeliverType.toString(), //0:可配送;1:不可配送
          DeliverTypeDesc:
            row.DeliverType.toString() == 0 ? "可配送" : "不可配送", //0:可配送;1:不可配送
          FeeType: FeeTypeValue, //费用类型(0:免费;1:每张券;2:每张配送单)
          FeeTypeDesc: FeeTypeDesc, //费用类型(0:免费;1:每张券;2:每张配送单)
          Fee: FeeValue, //费用(分)
        });
      });
    },
    setCheckedNodes(arr) {
      this.$refs.tree.setCheckedNodes(arr);
    },
    removeData(data) {
      let checklist = this.keyarr;
      for (var i = 0; i < checklist.length; i++) {
        if (checklist[i].info.AreaName === data.info.AreaName) {
          checklist.splice(i, 1);
        }
      }
      this.keyarr = checklist;
      // this.setCheckedNodes(this.keyarr);
    },
    //表单提交
    onSubmit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          let Details = [];
          this.keyarr.forEach((row) => {
            let objInfo = {
              TemplateId: this.form.TemplateId,
              DeliverType: row.DeliverType,
              AreaId: row.info.AreaId,
              DeliverAreaId: row.info.AreaId,
              FeeType: row.FeeType,
              Fee: Number((row.Fee * 100).toFixed(2)),
            };
            //0:可配送;1:不可配送
            if (
              row.DeliverType == 1 ||
              (row.DeliverType == 0 && row.FeeType == 0)
            ) {
              //不可配送的时候 都设置为0 或者可配送但是费用又是0
              objInfo.Fee = 0;
              objInfo.FeeType = 0;
            }
            Details.push(objInfo);
          });
          if (this.form.HasFee == 1) {
            //如果你是选择了有快递费
          }
          this.btnLoading = true;
          this.form.Details = Details;
          let res = await SaveExpressTemplate({
            ExpressTemplate: this.form,
          });
          this.btnLoading = false;
          if (res.Code == 200) {
            common.ClosePageTag("配送模板");
            ElMessage.success("保存成功");
            let _this = this;
            _this.$store.commit("tags/setPageSaerch", {
              Search: 1,
              titlePage: "模板列表",
            });
            setTimeout(() => {
              _this.$router.push({ path: "/d_template" });
            }, 2000);
          } else {
            ElMessage.error(res.Message);
          }
        } else {
          return false;
        }
      });
    },
    handleDel() {
      this.$refs.tree.setCheckedKeys([]);
      this.keyarr = [];
    },
    onReturn() {
      common.ClosePageTag("配送模板");
      this.$router.back();
    },
    async GetAreaListData() {
      let res = await GetAreaList({});
      if (res.Code == 200) {
        res.DataMap.forEach((row) => {
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
            WxCityId: "",
          };
          AreaList.AreaCode = row.AreaCode;
          AreaList.AreaId = row.AreaId;
          AreaList.AreaName = row.AreaName;
          AreaList.AreaNamePath = row.AreaNamePath;
          AreaList.AreaPinyin = row.AreaPinyin;
          AreaList.AreaType = row.AreaType;
          AreaList.AreaTypeDesc = row.AreaTypeDesc;
          AreaList.ParentAreaId = row.ParentAreaId;
          AreaList.WxCityId = row.WxCityId;
          this.data.push(AreaList);
        });
      }
    },
    async GetExpressTemplateByID(ID) {
      let res = await GetExpressTemplate({
        ObjectId: ID,
      });
      if (res.Code == 200) {
        let treeData = [];
        res.DataMap.Details.forEach((row) => {
          treeData.push(row.DeliverAreaId);
          this.form.DeliverType = row.DeliverType.toString();
        });
        this.form.TemplateId = res.DataMap.TemplateId;
        this.form.HasFee = res.DataMap.HasFee.toString();
        this.form.TemplateName = res.DataMap.TemplateName;
        this.form.TemplateRemark = res.DataMap.TemplateRemark;
        this.setRightData(res.DataMap.Details);
        setTimeout(() => {
          // this.$refs.tree.setCheckedKeys(treeData);
          // this.getData()
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.conbox {
  padding: 10px;
  height: 480px;
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
::-webkit-scrollbar {
  display: none;
}
</style>
