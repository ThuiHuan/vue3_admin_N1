// sku的相关接口地址
// 引入请求方法
import request from '@/utils/request'
// 引入ts类型
import { GetSkuData } from './type'
enum API {
  // 获取sku数据的地址
  SKUGET_URL = '/admin/product/list/', //{page}/{limit}
  // 商品上架
  ONSALE_URL = '/admin/product/onSale/', //{skuId}
  // 商品下架
  CANCELSALE_URL = '/admin/product/cancelSale/', ///{skuId}
  // 获取商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/', //{skuId}
  // 删除商品
  DELETE_URL = '/admin/product/deleteSku/', //{skuId}
}
// 获取Sku数据
export const reqSkuGet = (page: number, limit: number) => {
  return request.get<any, GetSkuData>(API.SKUGET_URL + `${page}/${limit}`)
}
// 商品上架
export const reqOnSale = (skuid: number | string) => {
  return request.get<any, any>(API.ONSALE_URL + skuid)
}
// 商品下架
export const reqCancelSale = (skuid: number | string) => {
  return request.get<any, any>(API.CANCELSALE_URL + skuid)
}
// 商品详情
export const reqGetSkuInfo = (skuid: number | string) => {
  return request.get<any, any>(API.SKUINFO_URL + skuid)
}
// 删除商品
export const reqDeleteSku = (skuid: number | string) => {
  return request.delete<any, any>(API.DELETE_URL + skuid)
}
