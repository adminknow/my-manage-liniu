<template>
  <div class="container">
    <!-- 查询区域 -->
    <div class="handle-box" style="padding-bottom: 10px">
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input v-model="query.search.brand_name" clearable placeholder="输入品牌名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col style="text-align: right" :span="6" :offset="13">
            <div class="button-group">
              <el-button class="button1" round @click="handleSearch">
                <el-icon>
                  <Search />
                </el-icon>
                <span>查询</span>
              </el-button>
              <el-button class="button2" round @click="handleAdd">
                <span>新增</span>
              </el-button>
              <el-button class="button2" round @click="handleOut">
                导出
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" border class="table" v-loading="tableLoading" ref="multipleTable"
      :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header" style="width: 100%">
      <el-table-column align="center" label="图片" width="180">
        <template #default="scope">
          <el-image :src="scope.row.BrandLogo" style="width: 140px" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template #default="scope">
          <el-link :underline="false" @click="handleEdit(scope.row.BrandId, '0')" style="color: #f56c6c">
            {{ scope.row.BrandName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="CreateUnitName" align="center" label="创建单位">
      </el-table-column>
      <el-table-column prop="CreateUserName" label="创建人" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="button-mgl">
            <el-button class="button-op-edit" size="small" @click="handleEdit(scope.row.BrandId, '1')">编辑
            </el-button>
            <el-button v-if="scope.row.BrandStatus == 1" class="button-op-del" size="small"
              @click="handleStop(scope.row.BrandId)">停用
            </el-button>
            <el-button v-if="scope.row.BrandStatus == 0" class="button-op-enable" size="small"
              @click="handleEnable(scope.row.BrandId)">启用
            </el-button>
            <el-button v-if="scope.row.BrandStatus == 0" class="button-op-del" size="small"
              @click="handleDel(scope.row.BrandId)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <div class="pagination">
      <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount" :page-sizes="[15, 50, 100]" :total="pageTotal"
        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog :title="form.BrandId ? '编辑品牌' : '新增品牌'" v-model="EditVisible" width="38%" :show-close="false"
      :close-on-click-modal="false">
      <div style="width:100%;height: 18px;"></div>
      <el-row>
        <el-col :span="22">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item prop="BrandName" label="名称">
              <el-input v-model="form.BrandName" :disabled="!isEdit"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <el-row>
                <el-col :span="22">
                  <el-input v-model="form.BrandLogo" v-if="false"></el-input>
                  <el-upload class="brand-uploader" ref="upload" :show-file-list="false" action="#"
                    :http-request="SuccessImg1" :before-upload="beforeUpload" :auto-upload="true" :disabled="!isEdit">
                    <img v-if="form.BrandLogo" :src="form.BrandLogo" class="brand-uploader-avatar" fit="contain" />
                    <el-icon v-else>
                      <Plus />
                    </el-icon>
                  </el-upload>
                  <p class="text">
                    <span>品牌Logo，且不超过2M</span>
                    <el-button v-if="form.BrandLogo && isEdit" type="danger" size="small" link @click="clear">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      <span>删除</span>
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="button1" v-if="isEdit" :loading="btnLoading" @click="onSubmit">保 存</el-button>
          <el-button class="button2" @click="EditVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { UploadSingle } from "@/api/imgapi.js";
import {
  SearchBrands,
  EnableBrand,
  DisableBrand,
  GetBrand,
  SaveBrand,
  DeleteBrand,
} from "../../api/ticket.js";
import { useBrandExport } from "@/hooks/use-export.js";
// ===== 状态和引用 =====
const router = useRouter();
const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);
const formRef = ref(null);
const btnLoading = ref(false);
const isEdit = ref("");
const EditVisible = ref(false);

// ===== 查询参数 =====
const query = reactive({
  search: {
    brand_name: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

// ===== 表单数据 =====
const form = reactive({
  BrandId: "",
  BrandName: "",
  BrandLogo: "",
});

// ===== 表单验证规则 =====
const rules = {
  BrandName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  BrandLogo: [{ required: true, message: "请上传图片", trigger: "blur" }],
};
// ===== 生命周期钩子 =====
onMounted(() => {
  getData();
});
// ===== 数据加载方法 =====
const getData = async () => {
  tableLoading.value = true;
  try {
    const res = await SearchBrands({
      PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
      PageRowCount: query.PageRowCount,
      SearchCondition: query.search,
    });

    if (res.Code == 200) {
      tableData.value = res.DataMap.Data || [];
      pageTotal.value = res.DataMap.ToalCount;
    } else {
      ElMessage.warning(res.Message || "查询失败");
    }
  } catch (error) {
    console.error("获取数据出错:", error);
    ElMessage.error("获取数据出现异常");
  } finally {
    tableLoading.value = false;
  }
};
getData();

// ===== 查询与分页方法 =====
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};

const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};

const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
// ===== CRUD操作方法 =====
const handleAdd = () => {
  EditVisible.value = true;
  isEdit.value = true;
  form.BrandId = "";
  form.BrandName = "";
  form.BrandLogo = "";
  // 通过nextTick确保表单重置
  nextTick(() => {
    formRef.value?.resetFields();
  });
};

const handleEdit = (ID, type) => {
  EditVisible.value = true;
  isEdit.value = type == 1;
  form.BrandId = ID;
  getBrandByID(ID);
};
const getBrandByID = async (ID) => {
  try {
    const res = await GetBrand({
      ObjectId: ID,
    });
    if (res.Code == 200) {
      form.BrandLogo = res.DataMap.BrandLogo;
      form.BrandName = res.DataMap.BrandName;
    } else {
      ElMessage.error(res.Message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取品牌详情出错:", error);
    ElMessage.error("获取品牌详情出现异常");
  }
};

const handleStop = (ID) => handleOperation("stop", ID, "停用成功");
const handleEnable = (ID) => handleOperation("enable", ID, "启用成功");
const handleDel = (ID) => handleOperation("delete", ID, "删除成功");
// 操作确认与执行方法
const handleOperation = (operation, ID, successMsg) => {
  const operationMap = {
    stop: { title: "确定要停用吗？", action: DisableBrand },
    enable: { title: "确定要启用吗？", action: EnableBrand },
    delete: { title: "确定要删除吗？", action: DeleteBrand },
  };

  const { title, action } = operationMap[operation];

  ElMessageBox.confirm(title, "提示", {
    type: "warning",
    cancelButtonClass: "button2",
    confirmButtonClass: "button1",
  })
    .then(async () => {
      try {
        const res = await action({ ObjectId: ID });
        if (res.Code == 200) {
          query.PageStartRow = 1;
          getData();
          ElMessage.success(successMsg || "操作成功");
        } else {
          ElMessage.warning(res.Message || "操作失败");
        }
      } catch (error) {
        console.error("操作出错:", error);
        ElMessage.error("操作出现异常");
      }
    })
    .catch(() => { });
};
// ===== 表单提交方法 =====
const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    btnLoading.value = true;

    const res = await SaveBrand({ Brand: form });
    if (res.Code == 200) {
      ElMessage.success("保存成功");
      query.PageStartRow = 1;
      EditVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || "保存失败");
    }
  } catch (error) {
    // 验证失败或请求出错时的处理
    console.error("表单提交出错:", error);
  } finally {
    btnLoading.value = false;
  }
};
const SuccessImg1 = async (param) => {
  try {
    const fd = new FormData();
    fd.append("file", param.file);
    const res = await UploadSingle(fd);
    if (res.Code == 200) {
      form.BrandLogo = res.DataMap.HttpsUrl;
      // 手动触发表单验证
      formRef.value?.validateField("BrandLogo");
    } else {
      ElMessage.error(res.Message || "图片上传失败");
    }
  } catch (error) {
    console.error("上传图片出错:", error);
    ElMessage.error("上传图片出现异常");
  }
};
const beforeUpload = async (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG 和 PNG 格式!");
    return false;
  }

  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }

  return true;
};

const clear = () => {
  form.BrandLogo = "";
};

////////////////////////////////////////////////////////////////////////////////////////////////
// ===== 导出功能 =====
// 使用导出Hook
const { handleExport } = useBrandExport();
const handleOut = async () => {
  handleExport(query, tableLoading);
};
/////////////////////////////////////////////////////////////////////////////////
</script>

<style>
.brand-uploader {
  width: 200px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.brand-uploader .el-upload {
  width: 200px !important;
  height: 100px !important;
  line-height: 100px !important;
}

.brand-uploader-avatar {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
