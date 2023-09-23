<template>
  <div>
    <div class="box">
      <img src="../../assets/images/error_images/404.png" alt="" />
      <div class="btn">
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const goHome = () => {
  $router.push('home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-left: 350px;
    width: 900px;
    height: 500px;
  }
  .btn {
    margin-left: -50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
