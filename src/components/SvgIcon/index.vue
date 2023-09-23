<template>
  <div>
    <!-- 测试SVG图标的使用 -->
    <!-- svg是图标外层标签 内部需要和use结合使用-->
    <svg :style="{ width, height }">
      <!-- xlink:href 执行用哪一个图标，属性值务必 # icon-图标名字 -->
      <!-- fill设置图标的颜色 -->
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传递过来的参数
defineProps({
  prefix: {
    // xlint:href属性值前缀
    type: String,
    default: '#icon-',
  },
  //   提供使用图标的名字
  name: String,
  //   接收父组件传递的颜色
  color: {
    type: String,
    default: '',
  },
  //   接收父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '16px',
  },
  //   接收父组件传递过来的高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
