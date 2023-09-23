//Sku的ts数据类型
// 响应数据
export interface Response {
  code: number
  message: string
  ok: boolean
}
//record里的数据
export interface Record {
  id: number | string
  spuId: number
  price: number
  skuName: string
  skuDesc: null
  weight: string
  tmId: number | string
  category3Id: number | string
  skuDefaultImg: string
  isSale: number | string
  skuImageList: null
  skuAttrValueList: null
  skuSaleAttrValueList: null
}

// data里的数据
export interface GetSkuData {
  records: Record[]
  total: number | string
  size: number | string
  current: number | string
  orders: []
  optimizeCountSql: boolean
  hitCount: boolean
  countId: null
  maxLimit: null
  searchCount: true
  pages: number
}
export interface ResponseData extends Response {
  data: GetSkuData
}
