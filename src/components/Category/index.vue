<template>
  <el-card>
    <!-- 三级分类全局组件-->
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- 将id存储到仓库并双向绑定 -->
        <el-select
          :disabled="scene ? 'true' : false"
          v-model="categoryStore.c1Id"
          @change="c1Change"
        >
          <!-- :value是下拉菜单收集到的数据 返回给了select-->
          <el-option
            v-for="(item, _index) in categoryStore.c1Result"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          :disabled="scene ? 'true' : false"
          v-model="categoryStore.c2Id"
          @change="c2Change"
        >
          <el-option
            v-for="(item, _index) in categoryStore.c2Result"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          :disabled="scene ? 'true' : false"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(item, _index) in categoryStore.c3Result"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 引入分类相关仓库
import useCategoryStore from '@/store/modules/category.ts'
let categoryStore = useCategoryStore()
// 接收父组件传递的值
defineProps(['scene'])
// 分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的方法
let getC1 = () => {
  categoryStore.getC1()
}
// 获取二级分类的方法
let c1Change = () => {
  // 清空二级id和c3数据以及c3id
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Result = []
  categoryStore.getC2()
}
// 获取三级分类的方法
let c2Change = () => {
  // 清空三级id
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>

<style scoped></style>
@
