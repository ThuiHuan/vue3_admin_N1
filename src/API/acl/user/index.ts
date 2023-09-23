import request from '@/utils/request'
import type {
  AllRoleResponseData,
  ResponseData,
  records,
  setRole,
} from './type'
// 用户管理模块的APi
enum API {
  // 获取用户信息
  GETUSERS_URL = '/admin/acl/user/', //{page}/{limit}
  // 新增用户
  ADDUSER_URL = '/admin/acl/user/save/',
  // 修改用户信息
  UPDATEUSER_URL = '/admin/acl/user/update/',
  // 获取全部以及当前账号拥有的职位
  GETALLROLE_URL = '/admin/acl/user/toAssign/', //{adminId}
  // 分配职位
  SETROLE_URL = '/admin/acl/user/doAssignRole/',
  // 删除单个用户
  REMOVEUSER_URL = '/admin/acl/user/remove/', //{id}
  // 批量删除用户
  REMOVEUSERS_URL = '/admin/acl/user/batchRemove/',
}
// 获取用户信息 有username的话就是查询
export const reqGetUsers = (page: number, limit: number, username?: string) => {
  // 如果有username的话就是查询用户信息
  if (username) {
    return request.get<any, ResponseData>(
      API.GETUSERS_URL + `${page}/${limit}/?username=${username}`,
    )
  } else {
    // 获取用户信息
    return request.get<any, ResponseData>(API.GETUSERS_URL + `${page}/${limit}`)
  }
}
// 添加/修改用户信息
export const reqAddOrUpdateUSer = (data: records) => {
  if (data.id) {
    // 修改
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
// 获取全部以及当前账号拥有的职位
export const reqAllRole = (userId: number) => {
  return request.get<any, AllRoleResponseData>(API.GETALLROLE_URL + userId)
}
// 分配职位
export const reqSetUserRole = (data: any) => {
  return request.post<any, setRole>(API.SETROLE_URL, data)
}
// 删除单个用户
export const reqDeleteUser = (id: number | string) => {
  return request.delete<any, any>(API.REMOVEUSER_URL + id)
}
// 批量删除用户
export const reqDeleteUsers = (idList: number[]) => {
  return request.delete<any, any>(API.REMOVEUSERS_URL, { data: idList })
}
