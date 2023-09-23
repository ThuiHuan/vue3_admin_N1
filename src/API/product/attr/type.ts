// 分类的ts数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 分类的ts数据类型
export interface GategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
// 相应的分类接口返回数据的类型
export interface GategoryResponse extends ResponseData {
  data: GategoryObj[]
}

// 属性与属性值的ts类型

// 属性值对象的ts类型
export interface AttrValue {
  id?: number //属性值的id
  valueName: string //属性值的name
  attrId?: number //归属的属性的id
}
//  属性值对象数组的ts类型
export type AttrValueList = AttrValue[]

// 响应属性对象data类型
export interface Attr {
  id?: number | string //属性的id
  attrName: string //属性的name
  categoryId?: number | string //三级分类的id
  categoryLevel: number //几级分类
  attrValueList: AttrValueList //属性值对象
}
// 响应属性对象dataList类型
export type AttrList = Attr[]

// 属性响应对象的ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[] //返回的数据
}
