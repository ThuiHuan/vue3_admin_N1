// 引入仓库
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
export const isHasButton = (app: any) => {
  let userStore = useUserStore(pinia)
  // 全局的自定义指令
  app.directive('has', {
    // 代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行
    // el是当前的dom，option是配置项
    mounted(el: any, option: any) {
      //   console.log(option.value)
      //   console.log(userStore)
      if (!userStore.buttons.includes(option.value)) {
        // 如果仓库中没有这个按钮权限，则获取到父节点然后删掉当前dom
        console.log(el.parentNode)
        el.parentNode.removeChild(el)
      }
    },
  })
}
