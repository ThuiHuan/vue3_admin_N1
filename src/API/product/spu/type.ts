//SPU的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// ---------------------------Spu_BASEDATA----------------------------------
// SPU数据的ts类型
export interface Records {
  id?: number | string
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string //品牌id
  spuSaleAttrList: null //Spu的销售属性
  spuImageList: null //图片属性
}
// 定义获取已有的spu接口返回的数据ts类型
export interface HasSpuResponeseData extends ResponseData {
  data: {
    records: Records[]
    total: number //多少个已有的spu
    size: number //当前页有多少已有的spu
    current: number //第几页
    searchCount: boolean
    pages: number //一共多少页
  }
}
// ----------------------------SPU图片----------------------------------
//图片对象的ts类型
export interface SpuImage {
  id?: number
  name?: string
  url?: string
  spuId?: number
  imgName: string
  imgUrl: string
}
// 图片响应数据的ts类型
export interface spuImageList extends ResponseData {
  data: SpuImage[]
}
// ---------------------------销售属性----------------------------------
//销售属性对象的ts类型
export interface SallAttrList {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SallAttrValueList[]
}
// 销售属性值对象数组的ts类型
export interface SallAttrValueList {
  id?: number
  spuId: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName: string
  isChecked: null
}
// 销售属性响应数据对象的ts类型
export interface SallAttrResponse extends ResponseData {
  data: SallAttrList[]
}
// ---------------------------全部销售属性----------------------------------
// 销售属性对象
export interface AllSallAttr {
  id: number
  name: string
}
// 全部销售属性响应对象
export interface AllSallAttrResponse extends ResponseData {
  data: AllSallAttr[]
}
// ---------------------------spuData属性----------------------------------
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string //品牌id
  spuImageList: null | SpuImage[]
  spuSaleAttrList: null | SallAttrList[]
}
// ---------------------------添加sku----------------------------------
// 平台属性
export interface SkuAttr {
  attrId?: number | string
  valueId?: number | string //属性值的id
}
// 销售属性
export interface SkuSaleAttr {
  saleAttrId?: number | string
  saleAttrValueId?: number | string
}
export interface SkuData {
  category3Id: number | string
  spuId?: number | string //目标spuid
  tmId?: number | string //品牌id
  skuName: string
  price: number | string
  weight: number | string
  description: string
  // 平台属性
  skuAttrValueList?: Attr[]
  // 销售属性
  skuSaleAttrValueList?: SkuSaleAttr[]
  // skuImageList: []
  // sku图片地址
  skuDefaultImg: string
}
// ---------------------------获取sku----------------------------------
export interface SkuInfoData extends Response {
  data: []
}
