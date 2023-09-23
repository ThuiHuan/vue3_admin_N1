// 属性相关的api文件
// 引入二次封装的axios
import request from '@/utils/request'
// 引入type数据类型
import type { GategoryResponse, AttrResponseData } from './type'
enum API {
  // 获取分类的一级接口地址
  GETC1_RUL = '/admin/product/getCategory1',
  // 获取分类的二级接口地址
  GETC2_RUL = '/admin/product/getCategory2/',
  // 获取分类的三级接口地址
  GETC3_RUL = '/admin/product/getCategory3/',
  // 获取商品属性的接口地址
  GETATTR_URL = '/admin/product/attrInfoList/',
  // 新增/修改属性的的接口地址
  POSTATTR_URL = '/admin/product/saveAttrInfo',
  // 删除属性的接口
  DELETE_URL = '/admin/product/deleteAttr/',
}
// 获取一级分类的接口方法
export const reqC1 = () => {
  return request.get<any, GategoryResponse>(API.GETC1_RUL)
}
// 获取二级分类的接口方法
export const reqC2 = (id: number) => {
  return request.get<any, GategoryResponse>(API.GETC2_RUL + id)
}
// 获取三级分类的接口方法
export const reqC3 = (id: number) => {
  return request.get<any, GategoryResponse>(API.GETC3_RUL + id)
}
// 获取商品属性的接口方法
export const reqAttrInfoList = (
  id1: number | string,
  id2: number | string,
  id3: number | string,
) => {
  return request.get<any, AttrResponseData>(
    API.GETATTR_URL + `${id1}/` + `${id2}/` + `${id3}`,
  )
}
// 新增/修改属性的接口方法
export const reqAddOrUpdateAttr = (data: Attr) => {
  return request.post<any, any>(API.POSTATTR_URL, data)
}
// 删除某个已有的接口方法
export const reqDeleteAttr = (id: number) => {
  return request.delete<any, AttrResponseData>(API.DELETE_URL + id)
}
