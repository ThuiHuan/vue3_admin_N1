<template>
  <div class="box">
    <div class="top">
      <p class="title">归属地排行</p>
      <p class="bg"></p>
    </div>
    <div class="number">
      <span>排名</span>
      <span>数据量</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 获取目标节点
let charts = ref()

onMounted(() => {
  // 获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  var option = {
    tooltip: {
      show: true,
      trigger: 'item',
      padding: [8, 15],
      backgroundColor: 'rgba(12, 51, 115,0.8)',
      borderColor: 'rgba(3, 11, 44, 0.5)',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: '2%',
      right: '2%',
      top: '5%',
      bottom: '3%',
    },
    xAxis: [
      {
        splitLine: {
          show: false,
        },
        type: 'value',
        show: false,
        axisLine: {
          //x轴坐标轴，false为隐藏，true为显示
          show: false,
        },
      },
    ],
    yAxis: [
      {
        show: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        type: 'category',
        axisTick: {
          show: false,
        },
        inverse: true,
        axisLabel: {
          show: false,
        },
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          inside: true,
          verticalAlign: 'bottom',
          lineHeight: 34,
          margin: 2, //刻度标签与轴线之间的距离
          show: true,
          textStyle: {
            color: 'rgba(255, 255, 255, 1)',
            fontFamily: 'SourceHanSansCN-Normal',
            fontSize: 15,
          },
          formatter: function (value: any) {
            return value + '万人'
          },
        },
        data: [100, 90, 80, 70, 60, 50, 40, 30],
      },
    ],
    series: [
      {
        show: true,
        name: '',
        type: 'bar',
        data: [
          { name: '武汉', value: 100 },
          { name: '十堰', value: 90 },
          { name: '宜昌', value: 80 },
          { name: '黄冈', value: 70 },
          { name: '荆州', value: 60 },
          { name: '随州', value: 50 },
          { name: '黄石', value: 40 },
          { name: '孝感', value: 30 },
        ],
        barWidth: 20, // 柱子宽度
        showBackground: true,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(5, 31, 81, 1)',
              },
              {
                offset: 1,
                color: 'rgba(21, 78, 138, 1)',
              },
            ],
          },
        },
        label: {
          show: true,
          color: 'rgba(255, 255, 255, 1)',
          fontFamily: 'SourceHanSansCN-Normal',
          fontSize: 22,
          fontWeight: 500,
          position: 'left',
          align: 'left',
          formatter: function (params: any) {
            return params.data.name
          },
        },
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(80, 179, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(93, 160, 236, 1)',
              },
            ],
          },
        },
      },
      {
        name: '外圆',
        type: 'scatter',
        emphasis: {
          scale: false,
        },
        symbol: 'rect',
        symbolSize: [5, 26], // 进度条白点
        itemStyle: {
          show: true,
          barBorderRadius: [10, 10, 10, 10],
          color: '#FFF',
          shadowColor: 'rgba(255, 255, 255, 0.5)',
          shadowBlur: 5,
          borderWidth: 1,
          opacity: 1,
        },
        z: 2,
        data: [
          { name: '武汉', value: 100 },
          { name: '十堰', value: 90 },
          { name: '宜昌', value: 80 },
          { name: '黄冈', value: 70 },
          { name: '荆州', value: 60 },
          { name: '随州', value: 50 },
          { name: '黄石', value: 40 },
          { name: '孝感', value: 30 },
        ],
        animationDelay: 500,
      },
    ],
    dataZoom: [
      {
        yAxisIndex: [0, 1], // 这里是从X轴的0刻度开始
        show: false, // 是否显示滑动条，不影响使用
        type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 1, // 从头开始。
        endValue: 5, // 展示到第几个。
      },
    ],
  }
  setInterval(() => {
    if (option.dataZoom[0].endValue >= 9) {
      option.dataZoom[0].endValue = 4
      option.dataZoom[0].startValue = 0
    } else {
      option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1
      option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1
    }
    mycharts.setOption(option)
  }, 3000)
  //设置实例的配置项
  mycharts.setOption(option)
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
    background: url('../../../images/rankingChart-bg.png') no-repeat;
    background-size: 100% 90%;
    margin: 31px 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    height: 30px;
    span {
      weight: 400;
      margin: 0 10px;
      color: orange;
      height: 30px;
      line-height: 30px;
    }
  }
  .charts {
    margin-top: -10px;
    width: 100%;
    margin-left: 1px;
    height: 230px;
  }
}
</style>
