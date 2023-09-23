<!-- 封装菜单信息 -->
<template>
  <!-- <p>{{ menuList }}</p> -->
  <!-- 遍历路由 -->
  <template v-for="item in menuList" :key="item.path">
    <template v-if="!item.children">
      <!-- 一级路由 -->
      <el-menu-item
        @click="goRoute"
        v-if="!item.meta.hidden"
        :index="item.path"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有一个子路由 -->
    <!-- :index="item.children[0].path" -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        @click="goRoute"
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
      >
        <el-icon color="white">
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有多个子路由——多级路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 递归组件 -->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 获取父组件传递过来的全部路由数据
import { useRouter } from 'vue-router'
defineProps(['menuList'])

let $router = useRouter()

const goRoute = (vc: any) => {
  //路由地址
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped lang="scss"></style>
