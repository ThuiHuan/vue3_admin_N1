// 关于layout组件相关配置仓库
import { defineStore } from 'pinia'
let useLayOut = defineStore('SettringStore', {
  state: () => {
    return {
      fold: false, //用户控制菜单折叠还是收起控制
      // 控制刷新
      refsh: false,
    }
  },
})
export default useLayOut
