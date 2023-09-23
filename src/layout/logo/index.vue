<template>
  <div class="logo">
    <img
      src="../../../public/logo.png"
      v-if="setting.logoHidden"
      :class="{ fold: LayOutSettingStore.fold }"
    />
    <h1 v-if="!LayOutSettingStore.fold">{{ setting.title }}</h1>
  </div>
</template>

<script setup lang="ts">
// 引入设置logo标题与logo图
import setting from '@/setting'
// 引入仓库
import useLayOut from '@/store/modules/setting'
let LayOutSettingStore = useLayOut()
</script>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: center;
  position: relative;

  .fold {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }
  img {
    width: 40px;
    height: 40px;
  }
  h1 {
    overflow: hidden;
    color: $base-menu-logo-fontcolor;
    font-size: 22px;
    font-weight: 800;
    font-size: $base-menu-logo-fontSize;
    margin-left: 10px;
  }
}
</style>
