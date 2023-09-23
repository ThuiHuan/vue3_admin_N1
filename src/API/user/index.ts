// 统一管理项目用户相关的接口
// 定义类型
import request from '@/utils/request'
import type { loginResponseData, loginFormData, userInfoData } from './type'

// 用户相关的请求地址   枚举接口地址
enum API {
  // 登录验证信息
  LOGIN_URL = '/admin/acl/index/login',
  //获取用户信息
  USERINFO_URL = '/admin/acl/index/info',
  // 退出登录
  USER_LOGOUT = '/admin/acl/index/logout',
}

// 对外暴露请求函数
// 登录的接口方法
export const reqLogin = (data: loginFormData) => {
  return request.post<any, loginResponseData>(API.LOGIN_URL, data)
}
// 获取用户信息的接口方法
export const reqUserInfo = () => {
  return request.get<any, userInfoData>(API.USERINFO_URL)
}
//退出登录的接口方法  明确指定返回类型为Promise对象  上面两个方法没有使用链式调用，所以不用指定
export const reqLogOut = (retryCount = 0): Promise<any> => {
  let MAX_RETRY_COUNT = 3
  return request
    .post<any, any>(API.USER_LOGOUT)
    .then((response) => {
      // // 刷新页面
      // location.reload()
      // 处理成功的响应
      return response
    })
    .catch(() => {
      // 重发请求小于三次
      if (retryCount < MAX_RETRY_COUNT) {
        retryCount++
        // 重试请求
        return reqLogOut(retryCount)
      } else {
        // 达到最大重试次数，处理错误
        throw new Error('请求超时且达到最大重试次数')
      }
    })
}
