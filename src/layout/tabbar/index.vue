<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb></BreadCrumb>
    </div>

    <!-- 顶部右侧的静态 -->
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumb from './breadCrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // background-image: linear-gradient(
  //   to right,
  //   rgb(82, 226, 128),
  //   rgb(148, 232, 70),
  //   rgb(227, 239, 63)
  // );
  border-bottom: 1px #ccc solid;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>
