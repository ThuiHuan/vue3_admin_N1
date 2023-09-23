// 品牌管理模块接口
// 引入二次封装的axios
import request from '@/utils/request'
// 引入type数据类型
import type { TradeMarkResponseData, TradeMark } from './type'
// 品牌管理模块的接口地址
enum API {
  // 获取已有的品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌的接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌的接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除品牌接口
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌的接口方法
// page:第几页；limit：获取多少条数据
export const reqHasTrademark = (page: number, limit: number) => {
  return request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )
}
// 添加和修改
export const reqAddOrUpdateTradeMark = (data: TradeMark) => {
  // 如果有id就是修改
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
// 删除
export const reqRemoveTrademark = (data: number) => {
  return request.delete<any, any>(API.DELETETRADEMARK_URL + data)
}
