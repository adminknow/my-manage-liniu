<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#ffffff"
      text-color="#3c3b3b" active-text-color="#ec5656" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.SubRightes">
          <el-sub-menu :index="item.UrlPath + ''" :key="item.title">
            <template #title>
              <!-- <i :class="item.icon"></i> -->
              <img class="item-icon" :src="item.icon" />
              <span>&nbsp;{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.SubRightes">
              <el-menu-item v-if="subItem.SubRightes" :index="subItem.UrlPath + ''" :key="subItem.title">
                <template #title>
                  <!-- <i :class="subItem.icon"></i> -->
                  <img class="item-icon" :src="subItem.icon" />
                  <span>&nbsp;{{ subItem.title }}</span>
                </template>
                <el-menu-item v-for="(threeItem, i) in subItem.SubRightes" :key="i" :index="threeItem.UrlPath + ''">
                  {{ threeItem.title }}</el-menu-item>
              </el-menu-item>
              <el-menu-item v-else :index="subItem.UrlPath + ''" :key="subItem.title">
                <template #title>
                  <!-- <i :class="subItem.icon"></i> -->
                  <img class="item-icon" :src="subItem.icon" />
                  <span>&nbsp;{{ subItem.title }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.UrlPath + ''" :key="item.title">
            <!-- <i :class="item.icon"></i> -->
            <img class="item-icon" :src="item.icon" />
            <template #title>&nbsp;{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { GetMyMenuList } from "../api/index.js";
import { computed, watch, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    let items = ref([]);
    //获取我的权限菜单
    const getData = () => {
      GetMyMenuList({
        CascadeMenu: true,
      }).then((res) => {
        var itemlist = [];
        var Sublist = [];
        for (var i = 0; i < res.DataMap.length; i++) {
          var obj = {};
          if (res.DataMap[i].SubRightes) {
            Sublist = [];
            for (var j = 0; j < res.DataMap[i].SubRightes.length; j++) {
              var Sub = {};
              Sub.title = res.DataMap[i].SubRightes[j].RightName;
              Sub.UrlPath = res.DataMap[i].SubRightes[j].UrlPath;
              Sub.RightCode = res.DataMap[i].SubRightes[j].RightCode;
              Sub.icon = res.DataMap[i].SubRightes[j].IconPath;
              Sublist.push(Sub);
            }
          }
          obj.title = res.DataMap[i].RightName;
          obj.UrlPath =
            res.DataMap[i].UrlPath == "" || res.DataMap[i].UrlPath == undefined
              ? i + 1
              : res.DataMap[i].UrlPath;
          obj.icon = res.DataMap[i].IconPath;
          if (Sublist.length > 0) {
            obj.SubRightes = Sublist;
          }
          itemlist.push(obj);
        }
        items.value = itemlist;
      });
    };
    getData();
    const route = useRoute();
    const onRoutes = computed(() => {
      return route.path.replace("/", "");
    });
    const store = useStore();
    const collapse = computed(() => store.state.tags.collapse);

    return {
      items,
      onRoutes,
      collapse,
    };
  },
};
</script>

<style scoped>
.item-icon {
  width: 20px;
  height: 20px;
}

.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 80px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 190px;
}

.sidebar>ul {
  height: 100%;
}

.el-sub-menu .is-active {
  background-color: #fee9e9;
  border-right: solid 2px #f56c6c;
}

.el-sub-menu .el-menu-item {
  min-width: 179px;
}
</style>
