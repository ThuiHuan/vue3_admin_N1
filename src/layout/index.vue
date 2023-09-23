<template>
  <div class="layout_container">
    <!-- 左侧菜单  动态绑定类名 -->
    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold }">
      <Logo></Logo>
      <!-- 滚动条导航 -->
      <el-scrollbar class="scrollbar">
        <!-- 展示菜单 -->
        <!-- <el-menu background-color="$base-menu-background" text-color="white">
          <el-menu-item index="1">数据大屏</el-menu-item>
          <el-menu-item index="2">首页</el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">用户管理</el-menu-item>
              <el-menu-item index="1-2">菜单管理</el-menu-item>
              <el-menu-item index="1-3">菜单管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu> -->
        <el-menu
          background-color="#001529"
          :collapse="LayOutSettingStore.fold"
          text-color="white"
          :default-active="$route.path"
        >
          <!-- 根据路由动态生成 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 获取用户相关的小仓库
import userUserStore from '@/store/modules/user'
// 引入二级路由组件
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入Tabbar组件
import Tabbar from './tabbar/index.vue'
// 引入仓库
import useLayOut from '@/store/modules/setting'

let LayOutSettingStore = useLayOut()
let $route = useRoute()
let userStore = userUserStore()
</script>
<script lang="ts">
export default {
  name: 'LayOut',
}
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
}
.layout_slider {
  width: $base-menu-width;
  height: 100vh;
  background-color: $base-menu-background;
  color: white;
  transition: all 0.2s;
  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-menu-logo-height);
    color: white;
    .el-menu {
      border-right: none;
    }
  }
  &.fold {
    width: $base-menu-min-width;
  }
}
.layout_tabbar {
  position: fixed;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  top: 0px;
  left: $base-menu-width;
  transition: all 0.2s;
  &.fold {
    width: calc(100% - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}
.layout_main {
  position: absolute;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  left: $base-menu-width;
  top: $base-tabbar-height;
  padding: 30px;
  //   滚动条
  overflow: auto;
  transition: all 0.2s;
  &.fold {
    left: $base-menu-min-width;
    width: calc(100% - $base-menu-min-width);
  }
}
</style>
