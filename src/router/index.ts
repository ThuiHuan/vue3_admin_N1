// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
// (常量路由、异步路由、任意路由)
import { constantRoute } from './routes'
let router = createRouter({
  // 模式设置hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 根据用户的异步路由信息注册异步路由
  //   滚动行为 从其他路由回来不需要重新下拉查看列表
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
