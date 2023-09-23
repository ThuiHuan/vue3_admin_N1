// 角色管理类型文件
// 响应的数据
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Records {
  id: number | string
  createTime: string
  updateTime: string
  roleName: string
  remark: null
}
export interface Data {
  records: Records[]
  total: number
  size: number
  current: number
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: true
  pages: number
}
export interface GetRole extends ResponseData {
  data: Data
}
// ·······················权限模块的ts类型·························

// 权限列表
export interface RolesList {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: RolesList[]
  select: boolean
}
// 响应的数据
export interface AssignRespoens extends ResponseData {
  data: RolesList[]
}
