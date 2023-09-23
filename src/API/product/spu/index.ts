// SPU管理模块的接口文件

// 引入请求方法
import request from '@/utils/request'
// 引入ts类型
import {
  HasSpuResponeseData,
  spuImageList,
  SallAttrResponse,
  AllSallAttrResponse,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'
import type { TradeMarkResponseData } from '../trademark/type'
enum API {
  // spu基础数据
  GETSPU_URL = '/admin/product/', //{page}/{limit}
  // 品牌地址
  ALLTRIDERMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 图片地址
  SPUALLIMAGE_URL = '/admin/product/spuImageList/', //{spuId}
  // 销售属性
  SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/', //{spuId}
  // 获取整个项目全部的销售属性 [颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo/',
  // 更新已有的spu
  UPDATE_URL = '/admin/product/updateSpuInfo/',
  // 追加一个新的sku
  ADDSKU_URL = '/admin/product/saveSkuInfo/',
  // 查看某一个已有的spu下的全部sku
  GETSKU_URL = '/admin/product/findBySpuId/', //{spuId}
  // 删除sku
  REMOVESPU_URL = '/admin/product/deleteSpu/', //{spuId}
}

// 获取某一个三级分类下已有的spu数据
export const reqSpuData = (
  page: number,
  limit: number,
  category3Id: number | string,
) => {
  return request.get<any, HasSpuResponeseData>(
    API.GETSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
}
// 获取全部品牌的数据
export const reqAllTraderMark = () => {
  return request.get<any, TradeMarkResponseData>(API.ALLTRIDERMARK_URL)
}
// 获取某一个spu下全部的图片数据
export const reqAllImage = (spuid: number) => {
  return request.get<any, spuImageList>(API.SPUALLIMAGE_URL + spuid)
}
// 获取某一个spu下全部的销售属性
export const reqSallAttr = (spuid: number) => {
  return request.get<any, SallAttrResponse>(API.SPUSALEATTR_URL + spuid)
}
// 整个项目全部的销售属性
export const reqAllSallAttr = () => {
  return request.get<any, AllSallAttrResponse>(API.ALLSALEATTR_URL)
}
// 更新已有的spu
export const UpdateSpu = (data: SpuData) => {
  // 如果有id，则是修改请求
  if (data.id) return request.post<any, any>(API.UPDATE_URL, data)
  // 新增请求
  else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 追加一个新的sku
export const reqAddSku = (data: any) => {
  return request.post<any, SkuData>(API.ADDSKU_URL, data)
}
// 查看某一个已有的spu下的全部sku
export const reqGetSku = (id: number | string) => {
  return request.get<any, SkuInfoData>(API.GETSKU_URL + id)
}
// 删除一个已有的spu下的sku
export const reqRemoveSku = (id: number | string) => {
  return request.delete<any, any>(API.REMOVESPU_URL + id)
}
