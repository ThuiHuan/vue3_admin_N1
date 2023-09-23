import request from '@/utils/request'
import { AssignRespoens, GetRole } from './type'

// 角色管理接口文件
enum API {
  // 获取角色列表
  GETROLE_URL = '/admin/acl/role/', //{page}/{limit}
  // 新增职位名称
  ADDROLENAME_URL = '/admin/acl/role/save/',
  // 修改职位名称
  UPDATEROLENAME_RUL = '/admin/acl/role/update/',
  //删除单个职位
  DELETEROLE_URL = '/admin/acl/role/remove/', //{id}
  // 批量删除职位
  DELETEROLES_URL = '/admin/acl/role/batchRemove/',
  // 获取权限
  GETASSIGN_URL = '/admin/acl/permission/toAssign/', //{roleId}
  // 下发权限
  POSTASSIGN_URL = '/admin/acl/permission/doAssign/',
}
// 查询或获取角色列表
export const reqGetRole = (page: number, limit: number, rolename?: string) => {
  return rolename
    ? request.get<any, GetRole>(
        API.GETROLE_URL + `${page}/${limit}/?roleName=${rolename}`,
      )
    : request.get<any, GetRole>(API.GETROLE_URL + `${page}/${limit}`)
  //
}
export const reqAddOrUpdateRole = (data: any) => {
  // id存在就是修改
  return data.id
    ? request.put<any, any>(API.UPDATEROLENAME_RUL, data)
    : request.post<any, any>(API.ADDROLENAME_URL, data)
}
// 删除单个职位
export const reqRemoveRole = (id: number) => {
  return request.delete<any, any>(API.DELETEROLE_URL + id)
}
//批量删除
export const reqRemoveRoleList = (idList: number[]) => {
  return request.delete<any, any>(API.DELETEROLES_URL, { data: idList })
}
// 获取权限
export const reqAssign = (id: number) => {
  return request.get<any, AssignRespoens>(API.GETASSIGN_URL + id)
}
// 下发权限
export const reqPostAssign = (roleId: number, permissionId: number[]) => {
  return request.post<any, any>(
    API.POSTASSIGN_URL + `?roleId=${roleId}&permissionId=${permissionId}`,
  )
}
