<template>
  <div class="box">
    <div class="line">
      <div class="top">
        <span id="test">近30天收入趋势图</span>
        <p id="bg"></p>
      </div>
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取实例
let charts = ref()
// 随机数据
const data = new Array(12).fill(null).map((_item: any) => {
  return {
    value: Math.ceil(Math.random() * 600) + 100,
  }
})
// 配置
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  var option = {
    color: ['#1890FF'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        boundaryGap: false,
        axisTick: {
          show: false, // 不显示坐标轴刻度线
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(230, 247, 255, 0.50)',
          fontSize: 14,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        //y右侧文字
        axisLabel: {
          color: 'rgba(230, 247, 255, 0.50)',
          fontSize: 16,
        },
        // y轴的分割线
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: 'rgba(230, 247, 255, 0.20)',
          },
        },
      },
    ],
    series: [
      {
        name: '收入统计',
        type: 'line',
        smooth: true,
        symbol: 'none', // 不显示连接点
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        lineStyle: {
          width: 3,
          shadowColor: '#1890FF',
          shadowBlur: 20,
        },
        areaStyle: {
          opacity: 1,
          //右下左上
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 144, 255, .5)',
            },
            {
              offset: 0.3,
              color: 'rgba(24, 144, 255, 0.2)',
            },
            {
              offset: 1,
              color: 'rgba(24, 144, 255, 0)',
            },
          ]),
        },
        data: data,
      },
    ],
  }

  mycharts.setOption(option)
})
// 初始化
</script>

<style scoped>
.box {
  padding: 0 25px 33px 25px;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  .line {
    width: 100%;
    height: 100%;
    background: url('../../../images/dataScreen-main-cb.png') no-repeat;
    background-size: 100% 100%;
    .top {
      #test {
        color: #fff;
        font-size: 20px;
      }
      #bg {
        width: 68px;
        height: 7px;
        background: url('../../../images/dataScreen-title.png');
        margin-top: 10px;
      }
    }
  }
  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
