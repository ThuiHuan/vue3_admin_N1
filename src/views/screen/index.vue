<template>
  <div>
    <div class="container">
      <!-- 内容区域 -->
      <div class="screen" ref="screen">
        <div class="top" >
          <Top :deleteItem="deleteItem"></Top>
        </div>
        <div class="bottom">
          <div class="left">
            <Tourist class="tourist"></Tourist>
            <Sex class="sex" />
            <Age class="age" />
          </div>
          <div class="center">
            <Map class="map"></Map>
            <Line class="line"></Line>
          </div>
          <div class="right">
            <Hot class="hot"></Hot>
            <Years class="years" />
            <Way class="way"></Way>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// 引入顶部子组件
import Top from './components/top/index.vue'
// 引入左侧子组件
import Sex from './components/left/sex/index.vue'
import Age from './components/left/age/index.vue'
import Tourist from './components/left/tourist/index.vue'
// 引入中间子组件
import Map from './components/center/map/index.vue'
import Line from './components/center/line/index.vue'
// 引入右侧子组件
import Hot from './components/right/hot/index.vue'
import Years from './components/right/years/index.vue'
import Way from './components/right/way/index.vue'
import * as echarts from 'echarts'
 
/**
 * 删除图表
 *
 * 初始化并销毁给定的图表实例
 */
const delet=()=>{
    var myChart = echarts.init(screen.value);
    myChart.dispose()
  }
  // 调用子组件的回调
const deleteItem = ()=>{
    delet()
  }
// 获取DOM
let screen = ref()


onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
// 定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
// 监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
}
.screen {
  width: 1920px;
  height: 1080px;
  transform-origin: left top;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate();
  .top {
    width: 100%;
    height: 40px;
  }
}
.bottom {
  // 使用一比二比一
  display: flex;
  .right {
    flex: 1;
    height: 1040px;
    display: flex;
    flex-direction: column;
    .hot {
      flex: 1;
    }
    .way {
      flex: 1;
    }
    .years {
      flex: 1;
    }
  }

  .left {
    flex: 1;
    height: 1040px;
    display: flex;
    flex-direction: column;
    .tourist {
      flex: 1;
    }
    .sex {
      flex: 1;
    }
    .age {
      flex: 1;
    }
  }
  .center {
    flex: 2;
    display: flex;
    flex-direction: column;
    .map {
      margin-top: 45px;
      flex: 2;
    }
    .line {
      margin-top: 10px;
      flex: 1;
    }
  }
}
</style>
