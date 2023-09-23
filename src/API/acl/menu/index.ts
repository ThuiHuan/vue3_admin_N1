// 菜单管理的接口
import request from '@/utils/request'
import { AllPermission } from './type'
enum API {
  // 获取全部菜单与按钮标识的数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  //   新增菜单
  ADDPERMISSION_URL = '/admin/acl/permission/save/',
  //   修改菜单
  UPDATEPERMISSION_URL = '/admin/acl/permission/update/',
  REMOVEPERMISSION_URL = '/admin/acl/permission/remove/', //{id}
}

// 获取菜单的数据
export const reqGetPermission = () => {
  return request.get<any, AllPermission>(API.ALLPERMISSION_URL)
}
// 新增菜单
export const reqAddPermission = (data: any) => {
  // 有id就是修改
  if (data.id) return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  else {
    // 没用id是添加
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}
// 删除菜单
export const reqRemovePermission = (id: number) => {
  return request.delete(API.REMOVEPERMISSION_URL + id)
}
