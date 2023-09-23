import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogOut } from '@/API/user/index'
// 引入类型
import { loginResponseData, loginFormData, userInfoData } from '@/API/user/type'
// 引入ts类型
import { UserState } from './types/type'
// 引入本地存储相关方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由、异步路由、任意路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户需要展现的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    // 过滤一级路由
    if (routes.includes(item.name)) {
      // 递归过滤子路由
      if (item.children && item.children.length > 0) {
        // 二次赋值（覆盖）
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户相关的小仓库
let useUserStore = defineStore('User', {
  // 存数据
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //存储用户的唯一标识
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组（路由）
      username: '', //定义用户名
      avatar: '', //定义用户头像
      // 存储当前用户是否含有某个按钮
      buttons: [],
    }
  },
  // 逻辑处理的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      let result: loginResponseData = await reqLogin(data)
      // 请求成功=>挑战到首页
      if (result.code === 200) {
        // 在pinia中存储token
        this.token = result.data as string
        // 由于pinia|vuex存储数据其实利用js对象
        // 本地存储持久化存储一份，因为关闭页面状态里的数据会消失
        SET_TOKEN(result.data as string)
        return '成功'
      } else {
        // 请求失败=>弹出信息
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息存储在仓库中
      let result: userInfoData = await reqUserInfo()
      // 如果获取成功
      if (result.code == 200) {
        // 存储按钮
        this.buttons = result.data.buttons
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 对比菜单权限，计算当前菜单需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 菜单的数据,但此处还没注册路由，只是修改的展示的导航数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // //动态追加异步路由:
        this.menuRoutes.forEach((element: any) => {
          router.addRoute(element)
        })
        // console.log(router.getRoutes())

        // 返回一个成功的promise对象
        return 'ok'
      }
      // 如果获取用户信息失败 返回失败Promise结果
      else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      //发送请求，销毁token
      let result: any = await reqLogOut()

      // 退出成功
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        // 清空本地缓存
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
