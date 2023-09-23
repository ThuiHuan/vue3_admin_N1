//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
// 引入请求方法
import { reqC1, reqC2, reqC3 } from '@/API/product/attr/index'
// 引入ts类型
import type { GategoryResponse } from '@/API/product/attr/type'
import type { CategoryStore } from './types/type'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryStore => {
    return {
      // 一级数据
      c1Result: [],
      // 一级分类的id
      c1Id: '',
      //   二级数据
      c2Result: [],
      //   二级分类的id
      c2Id: '',
      //   三级数据
      c3Result: [],
      //   三级分类的id
      c3Id: '',
    }
  },
  actions: {
    // 获取一级数据
    async getC1() {
      let result: GategoryResponse = await reqC1()
      if (result.code == 200) {
        this.c1Result = result.data
      }
    },
    // 获取二级数据
    async getC2() {
      let result: GategoryResponse = await reqC2(this.c1Id as number)
      if (result.code == 200) {
        this.c2Result = result.data
      }
    },
    // 获取三级数据
    async getC3() {
      let result: GategoryResponse = await reqC3(this.c2Id as number)
      if (result.code == 200) {
        this.c3Result = result.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
