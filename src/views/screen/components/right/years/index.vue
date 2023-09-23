<template>
  <div class="box">
    <div class="top">
      <p class="title">年度访客量对比</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 引入水球图
// 获取目标节点
let charts = ref()
onMounted(() => {
  // 获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
  //设置实例的配置项
  var option = {
    legend: {
      data: ['2021年', '2022年', '2023年'],
      x: 'center',
      y: '10%',
      itemWidth: 12,
      itemHeight: 12,
      icon: 'rect',
      textStyle: {
        color: '#fff',
        fontSize: '14',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.63)', //设置背景颜色
      textStyle: {
        color: '#fff',
      },
      transitionDuration: 0,
      borderColor: 'rgba(255,255,255, .5)',
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '10%',
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#26367A',
          },
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: 14,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: ['08-04', '08-05', '08-06', '08-07', '08-08', '08-09'],
        // boundaryGap: ['10%', '10%']
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: '14',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
      {
        type: 'value',
        position: 'right',
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: '14',
          },
          formatter: '{value}',
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '2021年',
        type: 'line',
        data: [40, 30, 20, 542, 45, 33, 27],
        symbolSize: 1,
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: colorList[1],
        },
        itemStyle: {
          normal: {
            color: colorList[1],
            borderColor: colorList[1],
          },
        },
      },
      {
        name: '2022年',
        type: 'line',
        data: [550, 620, 250, 260, 630, 250, 180],
        symbolSize: 1,
        yAxisIndex: 1,
        symbol: 'circle',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#9E87FF',
        },
        itemStyle: {
          normal: {
            color: '#9E87FF',
            borderColor: 'rgba(0, 168, 255, 1)',
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 168, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(0, 168, 255, 0.1)',
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      {
        name: '2023年',
        type: 'line',
        data: [250, 450, 550, 270, 140, 530, 530],
        symbolSize: 1,
        yAxisIndex: 1,
        symbol: 'circle',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: 'orange',
        },
        itemStyle: {
          normal: {
            color: 'orange',
            borderColor: 'orange',
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 168, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(0, 168, 255, 0.1)',
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
$color: #08a0ca;
.box {
  background: url('../../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 30px;
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
  }
  .charts {
    width: 100%;
    height: 250px;
    margin-top: 20px;
  }
}
</style>
