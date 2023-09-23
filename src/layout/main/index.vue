<template>
  <!-- 路由组件内容展示区域 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div>
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag"></component>
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
// 拿刷新板块的数据
import useLayOut from '@/store/modules/setting'
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
let layoutSettringStore = useLayOut()
// 控制是否销毁
let flag = ref(true)
// 监听仓库内部数据是否发生变化
watch(
  // 监听刷新的状态
  () => layoutSettringStore.refsh,
  () => {
    // 销毁内容组件
    flag.value = false
    // 清楚仓库的数据
    categoryStore.$reset()
    // 保证响应式数据
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
