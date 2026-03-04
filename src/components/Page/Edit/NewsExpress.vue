<template>
  <div
    style="height: 100%; overflow-y: auto; overflow-y: overlay; display: block"
  >
    <div class="top-set">消息快报</div>
    <div class="css-title">
      <p class="tit">样式设置</p>
    </div>

    <el-form style="">
      <div class="info-content" style="padding-bottom: 0">
        <el-form-item label="内容">
          <el-input v-model="list.title"></el-input>
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-color-picker v-model="list.color" />
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="list.background" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NewsExpress",
  props: ["data"],
  data() {
    return {
      list: {},
    };
  },
  mounted() {
    this.list = this.data.data[0];
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.tit {
  text-align: left;
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.info-content {
  padding: 12px;
  .el-form-item {
    margin-bottom: 10px;
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
