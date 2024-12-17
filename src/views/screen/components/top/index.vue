<template>
  <div class="top">
    <div class="left">
      <span @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">RunVue可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import moment from 'moment'
import { ref, onMounted, onBeforeMount } from 'vue'
// 获取路由器对象
let $router = useRouter()
const goHome = () => {
  // 释放cpu缓存
  echartsInstance. dispose()
  // 路由跳转
  $router.push('home')
}
// 存储当前时间
let time = ref(moment().format('YYYY年-MM月-DD日 HH:mm:ss'))
let timer = ref(0)
// 组件挂载完毕更新当前时间
onMounted(() => {
  setInterval(() => {
    time.value = moment().format('YYYY年-MM月-DD日 HH:mm:ss')
  }, 1000)
})
onBeforeMount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
$color: #04c9ff;
.top {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  .left {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    span {
      width: 150px;
      height: 40px;
      line-height: 40px;
      float: right;
      margin-right: -10px;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      text-align: center;
      color: #04c9ff;
      font-size: 20px;
    }
    span:hover {
      cursor: pointer;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: $color;
      font-size: 30px;
    }
  }
  .right {
    flex: 1;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      width: 150px;
      height: 40px;
      line-height: 40px;
      float: left;
      color: #04c9ff;
      font-size: 20px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    .rbtn:hover {
      cursor: pointer;
    }
    .time {
      font-size: 18px;
      color: $color;
      margin-right: 10px;
    }
  }
}
</style>
