// 做路由鉴权，项目中的路由能不能被访问的设置（某个路由什么条件下能访问，什么条件不难访问）
import router from '@/router/index.ts'
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 引入pinia
import pinia from './store'
// 获取用户仓库，判断用户登录是否成功
import useUserStore from '@/store/modules/user'
import setting from './setting'

// 实例化用户仓库 在组件的外部，用同步的语法拿不到小仓库，所以得先引入大仓库
let userStore = useUserStore(pinia)
// 全局前置守卫_判断能不能访问路由|访问某个路由前触发的函数
router.beforeEach(async (to: any, _from: any, next: any) => {
  // 更改页面标题
  document.title = setting.title + '-' + to.meta.title
  nprogress.start()
  // to:将要访问哪个路由  from：从哪个路由来
  //   获取token
  let token = userStore.token
  //   用户登录的判断   之所以这样写是因为token会过期
  if (token) {
    // 获取用户名
    let username = userStore.username
    // 登录成功，不能访问login；指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功，访问其他路由
      // 有用户信息，放行
      if (username) next()
      else {
        // 没有用户信息，
        try {
          //  在守卫这发请求获取用户信息再放行
          await userStore.userInfo()
          // 万一刷新的时候是异步路由，有可能获取到用户信息、异步路由还没加载完毕
          next({ ...to })
        } catch (error) {
          // token过期或者用户手动修改本地存储的token
          // 退出登录、手动清楚数据并重定向
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //   用户未登录的判断 访问登录放行
    if (to.path == '/login') {
      next()
    } else {
      // 访问其他路由，不放行，跳转
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((_to: any, _from: any) => {
  nprogress.done()
})

// 1. 任意路由切换实现进度条业务----nprogress
// 2.路由鉴权（路由组件访问权限的设置）
// 全部路由组件：登录|404|任意录音|首页|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）

// 用户未登录：可以访问login，其余的六个路由不能访问（指向login）
// 登录成功：login不能访问[指向首页]，其余的路由可以访问
