<template>
  <el-row>
    <el-col :span="23">
      <el-form-item label="规格属性">
        <el-button
          v-if="type != 'View'"
          class="button1"
          round
          @click="addPropertiesBtn"
        >
          &nbsp;&nbsp;添加&nbsp;&nbsp;
        </el-button>
      </el-form-item>
      <div style="padding-left: 140px" v-if="localGoodsProperties.length > 0">
        <div v-for="(item, index) in localGoodsProperties" :key="index">
          <el-row>
            <el-col :span="18">
              <div style="color: #606266; padding-bottom: 10px">
                {{ item.desc }}
              </div>
            </el-col>
            <el-col :span="3">
              <el-button
                class="button-op-edit"
                v-if="type != 'View'"
                size="small"
                @click="editPropertiesBtn(index, item.id)"
                >编辑
              </el-button>
            </el-col>
            <el-col :span="3">
              <el-button
                class="button-op-del"
                v-if="type != 'View'"
                size="small"
                @click="PropertiesDelBtn(index, item.id)"
                >删除
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
  <attributesModal
    :visible="visible"
    :PropertiesType="PropertiesType"
    :attributeId="attributeId"
    :goodID="goodID"
    :specificationsList="specificationsList"
    @onHandleClose="handleModalClose"
    @onSave="handleSaveProperties"
  ></attributesModal>
</template>

<script setup>
import { ElMessage } from "element-plus";
import attributesModal from "@/components/commodity/attributesModal.vue";
import { ref, toRefs, watch, onMounted } from "vue";
const props = defineProps({
  GoodsProperties: {
    type: Array,
    default: () => [],
  },
  goodID: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "Edit", // Edit, View
  },
});
// Emits 定义
const emit = defineEmits(["SaveProperties"]);
// 创建本地响应式数组，用于操作
const localGoodsProperties = ref([]);
const attributeId = ref("");
const PropertiesType = ref(""); //新增与修改
const specificationsList = ref([]);
const visible = ref(false);
// 初始化数据
const initData = () => {
  // 深拷贝父组件传来的数组
  localGoodsProperties.value = JSON.parse(
    JSON.stringify(props.GoodsProperties)
  );
  console.log("localGoodsProperties", localGoodsProperties.value);
};
// 从属性中解构
const {type} = toRefs(props);
const addPropertiesBtn = () => {
  PropertiesType.value = "Add";
  visible.value = true;
  specificationsList.value = [];
};
const editPropertiesBtn = (index, id) => {
  PropertiesType.value = "Edit";
  attributeId.value = id;
  visible.value = true;
  specificationsList.value = localGoodsProperties.value[index].arr;
};
const PropertiesDelBtn = (index, id) => {
  localGoodsProperties.value.splice(index, 1);
  emit("SaveProperties", localGoodsProperties.value);
  ElMessage.success("删除成功");
};
const handleModalClose = () => {
  visible.value = false;
  attributeId.value = "";
  PropertiesType.value = "";
};
const handleSaveProperties = (data) => {
  if (data) {
    if (PropertiesType.value === "Add") {
      // 检查是否已存在相同的属性ID或描述
      const existsById = localGoodsProperties.value.some(
        (item) => item.id === data.id
      );
      const existsByDesc = localGoodsProperties.value.some(
        (item) => item.desc === data.desc
      );
      if (existsByDesc) {
        ElMessage.warning("该属性配置已存在，请勿重复添加");
        return;
      }
      if (existsById) {
        ElMessage.warning("该属性ID已存在，请勿重复添加");
        return;
      }
      localGoodsProperties.value.push(data);
      ElMessage.success("添加成功");
    } else if (PropertiesType.value === "Edit") {
      const index = localGoodsProperties.value.findIndex(
        (item) => item.id === data.id
      );
      if (index !== -1) {
        localGoodsProperties.value[index] = data;
        ElMessage.success("编辑成功");
      } else {
        ElMessage.error("未找到要编辑的属性");
      }
    }
  }

  visible.value = false;
  attributeId.value = "";
  PropertiesType.value = "";
  console.log("保存的数据:", data);
  emit("SaveProperties", localGoodsProperties.value);
  // 处理保存的数据
  // data.PropId - 属性ID
  // data.PropDetails - 属性明细数组
};
// 组件挂载时加载数据
onMounted(() => {
  initData();
});

// 监听父组件传入的数组变化
watch(
  () => props.GoodsProperties,
  (newValue) => {
    localGoodsProperties.value = JSON.parse(JSON.stringify(newValue));
    console.log("localGoodsProperties", localGoodsProperties.value);
  },
  { deep: true, immediate: true }
);
</script>
