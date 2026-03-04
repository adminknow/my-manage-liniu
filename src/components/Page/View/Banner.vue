<template>
  <div class="banner">
    <el-carousel height="176px" v-if="data.data && data.data.length > 0">
      <el-carousel-item v-for="(item, index) in data.data" :key="index">
        <el-image style="width: 100%;height: 176px;" :src="item.url" fit="scale-down" />
      </el-carousel-item>
    </el-carousel>
    <div v-else>
      <div class="demo-image__error">
        <div class="block">
          <el-image>
            <template #error>
              <div class="image-slot">
                <span class="el-icon-mpicon-"></span>
              </div>
            </template>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Banner",
  props: ["data"],
};
</script>

<style lang="less" scoped>
.banner {
  font-size: 0;
  img {
    width: 100%;
  }
  .el-carousel__indicator--horizontal {
    padding: 12px 4px;
  }
  .el-carousel__button {
    width: 12px;
  }
  .image-null {
    background: #ffffff;
    height: 176px;
    font-size: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
  }
}
.demo-image__error .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__error .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__error .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
  width: 100%;
  height: 200px;
}

.demo-image__error .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
</style>
