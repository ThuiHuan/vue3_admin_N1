import { createApp } from 'vue'
import App from '@/App.vue'
// 引入插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus的国际化
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

// svg插件需要的配置代码
import 'virtual:svg-icons-register'

// 将Svgicon注册成全局组件
// import SvgIcon from '@/components/SvgIcon/index.vue'
// app.component('SvgIcon', SvgIcon)

// 引入自定义插件对象：注册整个项目的全局组件
import gloablComponent from '@/components'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入路由配置
import router from './router'
// 引入仓库
import pinia from './store/index'
// 引入路由鉴权文件
import './permission'

// 实例化
const app = createApp(App)
// 国际化
app.use(ElementPlus, {
  locale: zhCn,
})
import { isHasButton } from './directive/has.ts'
// 引入自定义指令文件
isHasButton(app)
// 注册全局组件
app.use(gloablComponent)
// 注册路由
app.use(router)
// 安装pinia
app.use(pinia)

app.mount('#app')
