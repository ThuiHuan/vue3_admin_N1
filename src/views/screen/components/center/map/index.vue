<template>
  <div class="title">
    <div class="image">
      <span id="font">省内物流信息</span>
    </div>
    <div class="warn">
      <span id="warn_text">平台高峰预警信息(5条)</span>
    </div>
  </div>
  <div class="box" ref="map"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import HuBeiJSON from './HuBei.json'

// 获取到dom节点
let map = ref()

// 流向线条的经纬度，可自定义样式
var point_line = [
  {
    coords: [
      [114.348204, 30.623025], // 初始点经纬度
      [115.077048, 30.220074], //目标点经纬度
    ],
    label: {
      start: '武汉',
      end: '黄石',
    },
  },
  {
    coords: [
      [115.02984, 29.925181],
      [110.787916, 32.646907],
    ],
    label: {
      start: '黄石',
      end: '十堰',
    },
  },
  {
    coords: [
      [110.446495, 32.45798],
      [114.298572, 30.584355],
    ],

    label: {
      start: '十堰',
      end: '武汉',
    },
  },
  {
    coords: [
      [112.204251, 31.03542],
      [114.298572, 30.584355],
    ],
    label: {
      start: '荆门',
      end: '武汉',
    },
  },
  {
    coords: [
      [109.48699, 30.283114],
      [114.298572, 30.584355],
    ],
    label: {
      start: '恩施',
      end: '武汉',
    },
  },
  {
    coords: [
      [113.429995, 31.828026],
      [114.298572, 30.584355],
    ],
    label: {
      start: '随州',
      end: '武汉',
    },
  },
  {
    coords: [
      [112.23813, 30.326857],
      [114.298572, 30.584355],
    ],
    label: {
      start: '荆州',
      end: '武汉',
    },
  },
  {
    coords: [
      [112.574526, 29.995051],
      [113.885608, 31.118116],
    ],
    label: {
      start: '荆州',
      end: '孝感',
    },
  },
  {
    coords: [
      [115.343867, 30.717343],
      [111.290843, 30.702636],
    ],
    label: {
      start: '黄冈',
      end: '宜昌',
    },
  },
]

// 注册湖北地图
echarts.registerMap('HuBei', HuBeiJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value)

  var option = {
    //  tooltip 该版本需在 option中定义才开启

    //  子图层可自定义内容
    geo: {
      map: 'HuBei',
      zoom: 1.1,
      roam: true,
      label: {
        show: true,
        color: '#fff',
      },
      //   layoutCenter: ['50%', '50%'],
      // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
      layoutSize: '100%',
      itemStyle: {
        borderWidth: 1,
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
            },
          ],
        },
        shadowColor: 'rgba(128, 217, 248, 1)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        borderColor: 'rgba(147, 235, 248, 1)',
      },

      emphasis: {
        //地图高亮
        itemStyle: {
          color: '#93EBF8',
        },
      },
    },
    series: [
      {
        type: 'lines',
        zlevel: 2,
        effect: {
          show: true,
          symbolSize: 5,
          color: '#E4AA0C',
          symbol: 'arrow',
        },
        lineStyle: {
          color: '#F56828',
          width: 1, //线条宽度
          curveness: 0.3,
        },

        data: point_line,
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        rippleEffect: {
          number: 2,
          scale: 3,
          brushType: 'stroke',
        },
        itemStyle: {
          color: '#F56828',
        },

        label: {
          show: true,
          offset: [40, 0],
          color: '#F56828',
        },
        data: '',
      }, //地图线的动画效果,
    ],
  }

  mychart.setOption(option)
})
</script>

<style scoped>
.box {
  width: 100%;
  height: 60%;
  margin-left: 25px;
}
.title {
  display: flex;
  justify-content: start;
  margin-left: 30px;

  .warn {
    margin-top: 30px;
    width: 100%;
    height: 50px;
    margin-left: 130px;
    background: url(../../../images/dataScreen-header-warn-bg.png) no-repeat;
    #warn_text {
      font-size: 18px;
      width: 100%;
      color: #fff;
      display: flex;
      justify-content: center;
      line-height: 45px;
      margin-left: -90px;
    }
  }
  .image {
    position: fixed;
    margin-top: 72px;
    background: url('../../../images/map-title-bg.png') no-repeat;
    width: 220px;
    height: 25px;
    #font {
      color: #fff;
      line-height: 25px;
      margin-left: 70px;
      letter-spacing: 2px;
    }
  }
}
</style>
