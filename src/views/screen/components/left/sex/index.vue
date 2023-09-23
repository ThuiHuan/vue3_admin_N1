<template>
  <div class="box">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <span>男士</span>
        <img src="../../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <span>女士</span>
        <img src="../../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士68%</p>
      <p>女士32%</p>
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
  //设置实例的配置项
  mycharts.setOption({
    title: {
      text: '',
      textStyle: {
        color: 'skyblue',
      },
      left: '40%',
    },
    //x轴组件
    xAxis: { show: false, min: 10, max: 100 },
    // y轴组件
    yAxis: {
      show: false,
      type: 'category',
    },
    //系列 每个系列通过 type 决定自己的图表类型:
    series: [
      {
        type: 'bar',
        data: [68],
        barWidth: 20,
        itemStyle: {
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        // 调整位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
        z: 1,
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
    width: 80%;
    height: 60px;
    display: flex;
    justify-content: center;
    left: 50%;
    transform: translate(-50%);
    position: relative;
  }
  .sex {
    margin-top: 40px;
    display: flex;
    height: 50%;
    justify-content: center;
    align-items: center;
    .man {
      margin: 20px;
      background: url(../../../images/man-bg.png) no-repeat;
      background-size: 100% 100%;
      width: 111px;
      height: 115px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span {
        margin: -22px 0 10px 0;
        font-size: 18px;
        color: #fff;
      }
    }
    .woman {
      margin: 20px;
      background: url(../../../images/woman-bg.png) no-repeat;
      background-size: 100% 100%;
      width: 111px;
      height: 115px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      span {
        margin: -22px 0 10px 0;
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .rate {
    display: flex;
    justify-content: space-around;
    p {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
