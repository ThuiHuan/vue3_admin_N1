// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagation from './Pagation/index.vue'
import Category from './Category/index.vue'
// 引入全部element图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局注册element-plus的icon图标

// 全局对象
const allGloablComponent = { SvgIcon, Pagation, Category }
// 得到对象的所有的key，放在数组里

// 对外暴露插件对象
export default {
  // 务必叫install方法
  install(app: any) {
    // 注册项目的全部全局组件
    Object.keys(allGloablComponent).forEach((key) => {
      //  注册为全局组件
      //@ts-ignore
      app.component(key, allGloablComponent[key])
    })
    // 将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
