<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li class="tags-li" v-for="(item, index) in tagsList" :class="{ active: isActive(item.path) }" :key="index">
        <router-link :to="item.path" class="tags-li-title">{{
            item.title
        }}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-mpguanbi"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-button size="large" @click="handleTags('other')" class="button1">关闭所有</el-button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import Cookie from "js-cookie";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isActive = (path) => {
      return path === route.fullPath;
    };

    const store = useStore();
    const tagsList = computed(() => store.state.tags.tagsList);
    const showTags = computed(() => tagsList.value.length > 0);

    // 关闭单个标签
    const closeTags = (index) => {
      const delItem = tagsList.value[index];
      if (tagsList.value.length == 1) {
        return;
      }
      store.commit("tags/delTagsItem", { index });
      const item = tagsList.value[index]
        ? tagsList.value[index]
        : tagsList.value[index - 1];
      if (item) {
        delItem.path === route.fullPath && router.push(item.path);
      } else {
        router.push("/404");
      }
    };
    // 设置标签
    const setTags = (route) => {
      const isExist = tagsList.value.some((item, index) => {
        return item.path === route.fullPath;
      });
      
      if (!isExist) {
        if (tagsList.value.length >= 8) {
          store.commit("tags/delTagsItem", { index: 0 });
        }
        tagsList.value.forEach((item, index) => {
          if (item.title == route.meta.title) {
            closeTags(index)
          }
        })
        store.commit("tags/setTagsItem", {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath,
        });
      }
    };
    setTags(route);
    onBeforeRouteUpdate((to) => {
      setTags(to);
    });

    // 关闭全部标签
    const closeAll = () => {
      store.commit("tags/clearTags");
      router.push("/");
    };
    // 关闭其他标签
    const closeOther = () => {
      const curItem = tagsList.value.filter((item) => {
        return item.path === route.fullPath;
      });
      store.commit("tags/closeTagsOther", curItem);
    };
    const handleTags = (command) => {
      command === "other" ? closeOther() : closeAll();
    };

    // 关闭当前页面的标签页
    // store.commit("closeCurrentTag", {
    //     $router: router,
    //     $route: route
    // });

    return {
      isActive,
      tagsList,
      showTags,
      closeTags,
      handleTags,
    };
  },
};
</script>

<style>
.tags {
  position: relative;
  height: 34px;
  overflow: hidden;
  padding-right: 120px;
  padding-left: 5px;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 5px 5px 2px 3px;
  border-radius: 3px;
  font-size: 14px;
  /* width: 91px; */
  min-width: 45px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  height: 30px;
  line-height: 26px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  /* float: left; */
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 120px;
  top: 4px;
  text-align: center;
  line-height: 26px;
  width: 1px;
  height: 32px;
  z-index: 10;
  background-color: #f56c6c;
  border-radius: 3px;
}

.tags-close-box .button1 {
  /* padding-top: 10px; */
  height: 34px;
}
</style>
