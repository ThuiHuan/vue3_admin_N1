// 路由对象的ts类型
import type { RouteRecordRaw } from 'vue-router'
// 引入分类数据类型
import type { GategoryObj } from '@/API/product/attr/type'
// interface UserInfo {
//   username: string
//   avatar: string //头像地址
// }
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 定义分类仓库state对象的ts类型
export interface CategoryStore {
  // 一级数据
  c1Result: GategoryObj[]
  // 一级分类的id
  c1Id: number | string
  c2Id: number | string
  c3Id: number | string
  c2Result: GategoryObj[]
  c3Result?: GategoryObj[]
}
