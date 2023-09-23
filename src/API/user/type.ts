// 登录接口需要携带的参数ts类型
export interface loginFormData {
  username: string
  password: string
}

// 定义全部接口返回数据都拥有的ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 登录接口返回的数据类型 继承全部接口
export interface loginResponseData extends ResponseData {
  //token
  data: string
}

// 定义服务器返回用户信息相关数据类型
export interface userInfoData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
