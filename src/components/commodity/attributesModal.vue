<template>
  <el-dialog
    title="差异兑换模板"
    v-model="dialogVisible"
    width="68%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
  <div style="width:100%;height: 18px;"></div>
    <el-row>
      <el-col :span="20">
        <el-form-item label="属性名称" label-width="140px">
          <el-select
            v-model="GoodsPropertiesID"
            filterable
            style="width: 100%"
            placeholder="请选择属性"
            :disabled="isDisabled"
            @change="changeProperties($event)"
          >
            <el-option
              v-for="item in GoodsPropertiesList"
              :key="item.PropId"
              :label="item.PropName + ' - ' + item.PropDesc"
              :value="item.PropId"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="tranferbox">
          <el-row>
            <el-col :span="11">
              <el-table
                :data="dataLeftList"
                border
                height="400"
                class="table"
                ref="multipleTable"
                :header-cell-style="{ 'text-align': 'center' }"
                header-cell-class-name="table-header"
                style="width: 100%"
              >
                <el-table-column align="center" label="明细">
                  <template #default="scope">
                    {{ scope.row.PropDetailName }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="SKU数量" width="100">
                  <template #default="scope">
                    <div>
                      {{ scope.row.SkuCount }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <div class="button-mgl">
                      <el-button
                        class="button-op-del"
                        size="small"
                        @click="
                          handleLeft(scope.$index, scope.row.PropDetailId)
                        "
                        >添加
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="2">
              <div
                class="el-transfer__buttons flex-col justify-center items-center"
                style="height: 400px"
              >
                <div class="button-mgl">
                  <el-button
                    class="button-op-del"
                    size="small"
                    @click="handleLeftAll()"
                    >全增<el-icon>
                      <ArrowRightBold />
                    </el-icon>
                  </el-button>
                </div>
                <div class="button-mgl">
                  <el-button
                    class="button-op-del"
                    size="small"
                    @click="handleRightAll()"
                    >全删<el-icon>
                      <ArrowLeftBold />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="conbox">
                <div class="wordbox">
                  <el-table
                    :data="dataRightList"
                    border
                    height="400"
                    class="table"
                    ref="multipleTable"
                    :header-cell-style="{ 'text-align': 'center' }"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="PropDetailName"
                      align="center"
                      label="明细"
                    >
                      <template #default="scope">
                        {{ scope.row.PropDetailName }}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="SKU数量" width="100">
                      <template #default="scope">
                        <div>
                          {{ scope.row.SkuCount }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template #default="scope">
                        <div class="button-mgl">
                          <el-button
                            class="button-op-del"
                            size="small"
                            @click="
                              handleRight(scope.$index, scope.row.PropDetailId)
                            "
                            >删除
                          </el-button>
                          <el-icon
                            :size="20"
                            class="icon_top"
                            v-if="scope.$index > 0"
                            @click="handleModalAdTop(scope.row, scope.$index)"
                          >
                            <Top />
                          </el-icon>
                          <el-icon
                            :size="20"
                            class="icon_top"
                            v-if="scope.$index < dataRightList.length - 1"
                            @click="handleModalAdDown(scope.row, scope.$index)"
                          >
                            <Bottom />
                          </el-icon>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>

          <i class="el-icon-arrow-right"></i>&emsp;
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="button1"
          v-loading="saveLoading"
          @click="SavePropertiesBtn"
          >保 存</el-button
        >
        <el-button class="button2" @click="handleClose">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { GetPropertyList } from "@/api/goods.js";
import { ElMessage } from "element-plus";
const props = defineProps({
  visible: Boolean,
  PropertiesType: { type: String, default: "" },
  attributeId: { type: String, default: "" },
  specificationsList: { type: Array, default: [] }, //添加的规格数组
  goodID: {
    type: String,
    default: "",
  },
});
// Emits 定义
const emit = defineEmits(["onHandleClose", "onSave"]);
const GoodsPropertiesList = ref([]); //下拉数据
const dialogVisible = ref(false);
const isDisabled = ref(false);
const dataLeftList = ref([]); //左侧数据
const dataRightList = ref([]); //右侧数据
const GoodsPropertiesID = ref("");
const PropName = ref(""); //选择的属性描述整合
const saveLoading = ref(false);

// 初始化数据
const initData = async () => {
  let res = await GetPropertyList({
    SearchCondition: {
      get_prop_detail: 1,
      prop_detail_goods_id: props.goodID,
    },
  });
  if (res.Code == 200) {
    res.DataMap.forEach((row) => {
      if (row.SkuCount > 0) {
        row.PropName =
          row.PropName + "(有" + row.SkuCount + "个SKU引用了本属性)";
      }
    });
    GoodsPropertiesList.value = res.DataMap;

    // 先设置右侧数据
    dataRightList.value = props.specificationsList;

    // 找到对应的属性并设置左侧数据
    for (let i = 0; i < GoodsPropertiesList.value.length; i++) {
      const element = GoodsPropertiesList.value[i];
      if (element.PropId == props.attributeId) {
        PropName.value = element.PropName;
        // 过滤掉在右侧已存在的数据项
        dataLeftList.value = element.Details.filter(
          (leftItem) =>
            !dataRightList.value.some(
              (rightItem) => rightItem.PropDetailId === leftItem.PropDetailId
            )
        );
        break;
      }
    }
  }
};
const changeProperties = async (ID) => {
  for (let i = 0; i < GoodsPropertiesList.value.length; i++) {
    const element = GoodsPropertiesList.value[i];
    if (element.PropId == ID) {
      // 过滤掉在右侧已存在的数据项
      dataLeftList.value = element.Details.filter(
        (leftItem) =>
          !dataRightList.value.some(
            (rightItem) => rightItem.PropDetailId === leftItem.PropDetailId
          )
      );
      PropName.value = element.PropName;
      break;
    }
  }
};
const handleLeft = (index, id) => {
  // 找到要添加的数据项
  const item = dataLeftList.value.find((item) => item.PropDetailId === id);

  if (item) {
    // 检查右侧是否已存在该项（避免重复添加）
    const exists = dataRightList.value.some(
      (rightItem) => rightItem.PropDetailId === id
    );

    if (!exists) {
      // 添加到右侧列表
      dataRightList.value.push({ ...item });

      // 从左侧列表中移除
      dataLeftList.value.splice(index, 1);
    } else {
      ElMessage.warning("该项已存在于右侧列表中");
    }
  }
};
const handleRight = (index, id) => {
  // 找到要删除的数据项
  const item = dataRightList.value.find((item) => item.PropDetailId === id);

  if (item) {
    // 从右侧列表中移除
    dataRightList.value.splice(index, 1);

    // 添加回左侧列表
    dataLeftList.value.push({ ...item });
  }
};
// 全部添加（左侧所有数据移动到右侧）
const handleLeftAll = () => {
  // 过滤掉右侧已存在的数据，避免重复
  const newItems = dataLeftList.value.filter(
    (leftItem) =>
      !dataRightList.value.some(
        (rightItem) => rightItem.PropDetailId === leftItem.PropDetailId
      )
  );

  // 将所有新数据添加到右侧
  dataRightList.value.push(...newItems.map((item) => ({ ...item })));

  // 清空左侧列表
  dataLeftList.value = [];
};

// 全部删除（右侧所有数据移动到左侧）
const handleRightAll = () => {
  // 将右侧所有数据添加回左侧
  dataLeftList.value.push(...dataRightList.value.map((item) => ({ ...item })));

  // 清空右侧列表
  dataRightList.value = [];
};

const handleModalAdTop = async (key, index) => {
  dataRightList.value[index] = dataRightList.value.splice(
    index - 1,
    1,
    dataRightList.value[index]
  )[0];
};
const handleModalAdDown = async (key, index) => {
  if (index != dataRightList.value.length - 1) {
    dataRightList.value[index] = dataRightList.value.splice(
      index + 1,
      1,
      dataRightList.value[index]
    )[0];
  }
};
// 保存数据并传递到父组件
const SavePropertiesBtn = () => {
  // 验证是否选择了属性
  if (!GoodsPropertiesID.value) {
    ElMessage.warning("请先选择属性");
    return;
  }

  // 验证是否有右侧数据
  if (dataRightList.value.length === 0) {
    ElMessage.warning("请至少选择一个属性明细");
    return;
  }
  saveLoading.value = true;
  // 准备保存的数据
  const saveData = {
    id: GoodsPropertiesID.value,
    arr: dataRightList.value.map((item) => ({
      PropDetailId: item.PropDetailId,
      PropDetailName: item.PropDetailName,
      SkuCount: item.SkuCount,
    })),
    // 修复：生成所有右侧数据的描述
    desc:
      PropName.value +
      ":" +
      dataRightList.value.map((item) => item.PropDetailName).join(", "),
    leftDelList: dataLeftList.value,
  };
  saveLoading.value = false;
  // 发送数据到父组件
  emit("onSave", saveData);

  // 关闭弹窗
  handleClose();
};
const handleClose = () => {
  // 重置数据
  dataLeftList.value = [];
  dataRightList.value = [];
  GoodsPropertiesID.value = "";
  emit("onHandleClose", false);
};
// 组件挂载时加载数据
onMounted(() => {
  initData();
});
// 监听器
watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
    if (newValue) {
      initData();
    }
  }
);
watch(
  () => props.PropertiesType,
  (newValue) => {
    isDisabled.value = newValue === "Edit";
    if (newValue === "Edit") {
      GoodsPropertiesID.value = props.attributeId;
    } else {
      GoodsPropertiesID.value = "";
    }
  }
);
</script>
<style lang="less"></style>
