<template>
  <div class="image-box" >
    <template v-if="data.data && data.data.length > 0">
      <a v-for="(item, index) in data.data" :key="index" :href="item.link">
        <img :src="item.url" style="width:100%" />
      </a>
    </template>
    <template v-else>
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
    </template>
  </div>
</template>

<script>
export default {
  name: "Images",
  props: ["data"],
};
</script>

<style lang="less" scoped>
.image-box {
  font-size: 0;
  img {
    width: 100%;
    max-width: 100%;

  }
  .image-null {
    background: #ffffff;
    height: 300px;
    font-size: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
    width: 100%;
  }
  a {
    display: block;
  }
  &.two {
    display: flex;
    flex-wrap: wrap;
    box-sizing: content-box;
    a {
      width: 50%;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      display: block;
      padding-bottom: 50%;
      background: #e4e4e4;
      img {
        position: absolute;
      }
    }
  }
  &.three {
    height: 100px;
    overflow-y: auto;
    white-space: nowrap;
    box-sizing: content-box;
    a {
      width: 100px;
      height: 100px;
      margin: 0 4px;
      display: inline-block;
      vertical-align: bottom;
      background: #e4e4e4;
    }
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
