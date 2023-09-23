// 响应的数据
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// data中的数据
export interface RolesList {
  id: number
  createTime: string
  updateTime: string
  pid: number | string
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: RolesList[]
  select: boolean
}
// 获取权限返回的数据
export interface AllPermission extends ResponseData {
  data: RolesList[]
}
