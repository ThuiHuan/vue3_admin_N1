<template>
  <!-- 刷新 -->
  <el-button
    size="default"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <!-- 全屏 -->
  <el-button
    size="default"
    icon="FullScreen"
    circle
    @click="FullScreen"
  ></el-button>
  <!-- 颜色转换 -->
  <el-popover placement="bottom" title="主题设置" :width="280" trigger="hover">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="主题颜色" style="margin-top: 20px">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式" style="margin-top: 10px">
        <el-switch
          v-model="value2"
          class="ml-2"
          active-icon="Moon"
          inactive-icon="Sunny"
          inline-prompt
          @change="modeChange"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="default" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <img
    :src="userStore.avatar"
    style="width: 31px; height: 31px; margin: 0 12px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <!-- dropDown菜单 -->
      <el-dropdown-menu>
        <el-dropdown-item @click="Logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 引入路由实例
import { useRouter, useRoute } from 'vue-router'
// 获取菜单仓库，来判断折叠与刷新
import useLayOut from '@/store/modules/setting'
// 获取用户仓库，来得到用户信息
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'

let $route = useRoute()
let $router = useRouter()
let layoutSettringStore = useLayOut()
let userStore = useUserStore()

// 暗黑模式的开关
const value2 = ref(false)
// 颜色组件的数据
const color = ref('rgba(30, 144, 255, 1)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 刷新业务
const updateRefsh = () => {
  layoutSettringStore.refsh = !layoutSettringStore.refsh
}
// 全屏业务
let FullScreen = () => {
  // 判断是否全屏
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 文档的根节点的requestFullscreen方法实现全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
// 退出登录
const Logout = async () => {
  // 1.向服务器发送请求[退出登录接口]
  // 2.清楚仓库中的数据
  await userStore.userLogout()
  // 3.跳转页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
// 暗黑模式事件
const modeChange = () => {
  // 获取html根节点
  let html = document.documentElement
  // 根据开关挂载类名
  value2.value ? (html.className = 'dark') : (html.className = '')
  console.log(value2.value)
}
// 主题颜色的设置
const setColor = () => {
  // 通过js修改根节点的样式属性与属性值
  const el = document.documentElement
  el.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
