<template>
  <!-- 顶部左侧的静态 -->
  <el-icon style="margin-right: 20px" @click="changeIcon">
    <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>

  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展现路由名字与标题 -->
    <el-breadcrumb-item
      :to="item.path"
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
    >
      <!-- 图标组件 -->
      <el-icon style="vertical-align: top; margin: 0 3px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useRoute } from 'vue-router'
import useLayOut from '@/store/modules/setting.ts'
// 获取相关仓库
let layoutSettingStore = useLayOut()
let $router = useRoute()

// 点击图标
const changeIcon = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>
<script lang="ts">
export default {
  name: 'breadCrumb',
}
</script>

<style scoped></style>
