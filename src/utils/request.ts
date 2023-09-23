// 进行二次封装axios：使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 获取token,引入用户相关的仓库
import useUserStore from '@/store/modules/user'

//第一步:利用axios对象的create方法，去创建axios实例（其他的配置：基础路径、超时的时间）
const request = axios.create({
  // 基础路径 通过import.meta.env获取环境变量
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000, //超时的时间的设置
})

// 第二步:request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // 获取用户仓库的实例对象
  let userStore = useUserStore()
  // config配置对象,headers属性请求头,经常给服务器端携带公共参数
  config.headers.token = userStore.token
  // 必须返回配置对象
  return config
})

// 第三步:配置响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
  },
  (error) => {
    // 失败的回调:处理http网络错误
    // 定义一个变量,存储网络错误信息
    let message = ''
    // http状态码
    if (error.response && error.response.status) {
      const status = error.response.status
      // Check if response and status exist
      switch (status) {
        case 401:
          message = 'TOKEN过期'
          break
        case 403:
          '无权访问'
          break
        case 404:
          '请求地址错误'
          break
        case 500:
          '服务器出现问题'
          break
        default:
          '网络出现问题'
      }
      // 提示的错误信息
      ElMessage({
        type: 'error',
        message: message,
      })
    } else {
      ElMessage({
        type: 'error',
        message: error.message,
      })
    }
    return Promise.reject(error)
  },
)
// 对外暴露
export default request
