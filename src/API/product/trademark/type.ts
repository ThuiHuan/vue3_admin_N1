//书写品牌管理接口

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 已有品牌的数据类型
export interface TradeMark {
  // 新增的品牌没有id 修改得有id
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌数据的ts类型   类型别名
export type Records = TradeMark[]

export interface TradeMarkData {
  // 获取已有全部品牌的数据的ts类型
  records: Records
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

// 获取已有全部品牌的数据的ts类型
export interface TradeMarkResponseData extends ResponseData {
  data: TradeMarkData
}
