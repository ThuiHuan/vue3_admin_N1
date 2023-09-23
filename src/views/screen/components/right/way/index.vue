<template>
  <div class="age">
    <div class="top">
      <p class="title">访问渠道数据统计</p>
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
  var data = [
    { value: 666, name: '天猫' },
    { value: 193, name: '京东' },
    { value: 300, name: '淘宝' },
    { value: 200, name: '抖音' },
    { value: 100, name: '其他' },
  ]
  var color = ['#146de0', '#27ef5e', '#ffc140', '#d151d8', 'red']
  // 设置配置项
  var option = {
    color: color,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: '#fff',
      formatter: function (params: any) {
        return (
          params.name +
          '<br/>' +
          params.marker +
          '<span style="color:' +
          params.color +
          '">' +
          params.data['name'] +
          '\n' +
          params.data['value'] +
          '</span>'
        )
      },
    },
    legend: {
      orient: 'vertical',
      icon: 'circle',
      left: '7.2%',
      top: '14.2%',
      itemWidth: 14,
      itemGap: 17,
      textStyle: {
        rich: {
          a: {
            color: '#fff',
            fontSize: 16,
            padding: [0, 10, 0, 0],
          },
          b: {
            color: '#fff',
            fontSize: 16,
            padding: [0, 10, 0, 10],
          },
        },
      },
      formatter: function (name: any) {
        var target
        for (var i = 0, l = data.length; i < l; i++) {
          if (data[i].name == name) {
            target = data[i].value
          }
        }
        return `{a| ${name}}{b|${target}}`
      },
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['27%', '75%'],
        center: ['68%', '45%'],
        avoidLabelOverlap: true,
        label: {
          normal: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            textStyle: {
              align: 'center',
              baseline: 'middle',
              fontSize: 16,
              fontWeight: '100',
              color: '#fff',
            },
          },
        },
        labelLine: {
          show: false,
        },

        data: data,
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
  background-size: 100% 90%;
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
