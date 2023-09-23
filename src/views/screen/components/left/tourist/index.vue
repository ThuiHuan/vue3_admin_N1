<template>
  <div class="box">
    <div class="top">
      <p class="title">实时访客统计</p>
      <p class="bg"></p>
      <p class="total">
        最高峰值
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 引入水球图
import 'echarts-liquidfill'
let people = ref('51690人')
// 获取目标节点
let charts = ref()
onMounted(() => {
  // 获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  //设置实例的配置项
  mycharts.setOption({
    //x轴组件
    xAxis: { show: false },
    // y轴组件
    yAxis: { show: false },
    //系列 每个系列通过 type 决定自己的图表类型:
    series: [
      {
        type: 'liquidFill',
        data: [0.5, 0.4, 0.3, 0.2],
        shape: 'container',
        outline: {
          show: false,
        },
        backgroundStyle: {
          borderWidth: 5,
          borderColor: '#10134B',
          color: '#10134B',
        },
      },
    ],
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
$color: #08a0ca;
// #08a0ca
.box {
  background: url('../../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 15px;
  overflow: hidden;
  .top {
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url('../../../images/dataScreen-title.png');
      margin-top: 10px;
    }
    .total {
      float: right;
      color: white;
      font-size: 18px;
      margin-top: 10px;
      margin-right: 10px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 40px;
    display: flex;
    padding: 15px;
    span {
      flex: 1;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: url(../../../images/total.png);
      background-size: 100% 100%;
      color: $color;
    }
  }
  .charts {
    margin-top: -10px;
    width: 100%;
    margin-left: 1px;
    height: 185px;
  }
}
</style>
