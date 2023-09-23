<template>
  <div class="age">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    title: {
      show: true,
      text: '4366',
      subtext: '总人数',
      x: '39.5%',
      y: '43%',
      itemGap: 1,
      textStyle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '400',
        lineHeight: 18,
      },
      subtextStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 8,
      },
      textAlign: 'center',
    },
    legend: {
      orient: 'vertical',
      icon: 'diamond',
      textStyle: {
        color: '#f2f2f2',
        fontSize: '16px',
      },
      top: '5%',
      right: '1%',
      itemGap: 16,
      itemHeight: 16,
      itemWidth: 16,
      data: [
        { value: 220, name: '10岁及以下' },
        { value: 1180, name: '10-20岁' },
        { value: 1382, name: '20-30岁' },
        { value: 984, name: '30-50岁' },
        { value: 600, name: '50岁以上' },
      ],
    },
    series: [
      {
        name: '',
        type: 'pie',
        roundCap: true,
        radius: ['55%', '75%'],
        center: ['40%', '50%'],
        data: [
          { value: 220, name: '10岁及以下' },
          { value: 1180, name: '10-20岁' },
          { value: 1382, name: '20-30岁' },
          { value: 984, name: '30-50岁' },
          { value: 600, name: '50岁以上' },
        ],
        labelLine: {
          length: 8,
          length2: 16,
          lineStyle: {
            width: 1,
          },
        },
        label: {
          show: true,
          fontFamily: 'ysbth',
          position: 'outside',
          padding: [0, -4, 0, -4],
          color: '#fff',
          fontSize: '12px',
          lineHeight: 12,
        },
      },
      {
        type: 'pie',
        radius: ['47%', '49%'],
        center: ['40%', '50%'],
        animation: false,
        hoverAnimation: false,
        data: [
          {
            value: 4366,
          },
        ],
        label: {
          show: false,
        },
        itemStyle: {
          normal: {
            color: '#3BC5EF',
          },
        },
      },
      {
        name: '',
        type: 'pie',
        startAngle: 90,
        radius: '47%',
        animation: false,
        hoverAnimation: false,
        center: ['40%', '50%'],
        itemStyle: {
          normal: {
            labelLine: {
              show: false,
            },
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              {
                offset: 1,
                color: 'rgba(50,171,241, 0)',
              },
              {
                offset: 0.5,
                color: 'rgba(50,171,241, .4)',
              },
              {
                offset: 0,
                color: 'rgba(55,70,130, 0)',
              },
            ]),
            shadowBlur: 60,
          },
        },
        data: [
          {
            value: 4366,
          },
        ],
      },
    ],
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.age {
  margin-top: 30px;
  width: 100%;
  height: 100%;
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100%;
  .top {
    font-size: 20px;
    color: #fff;
    .bg {
      width: 68px;
      height: 7px;
      margin-top: 10px;
      background: url(../../../images/dataScreen-title.png);
    }
  }
}
.charts {
  margin-top: 10px;
  width: 100%;
  height: 250px;
}
</style>
