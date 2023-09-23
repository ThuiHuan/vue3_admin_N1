// ·····················获取用户信息·····················
// 响应数据
interface Response {
  code: number
  message: string
  ok: boolean
}
// records里的数据
export interface records {
  id?: number | string
  username?: string
  password?: string
  name?: string
  phone?: null
  roleName?: string
  updateTime?: string
}
// data中的数据
export interface UserData {
  records: records[]
  total: number
  size: number
  current: number
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: boolean
  pages: number
}
export interface ResponseData extends Response {
  data: UserData
}
// ························权限·························
//代表一个职位的ts类型 allRolesList
export interface RolesData {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
// 全部职位列表
export type AllRole = RolesData[]
// 获取全部职位返回的data
export interface AllRoleResponseData extends Response {
  data: {
    // 当前有的职位
    assignRoles: AllRole
    //  全部职位
    allRolesList: AllRole
  }
}
// 给用户分配职位接口携带参数的ts类型
export interface setRole {
  // 选中的权限id
  roleIdList: number[]
  userId: number
}
