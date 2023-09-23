// 封装一个函数获取时间结果
export const getTime = () => {
  var result = ''
  // 通过内置构造函数Date
  let hours = new Date().getHours()
  if (hours <= 9) {
    result = '早上好'
  } else if (hours < 14) {
    result = '中午好'
  } else if (hours <= 18) {
    result = '下午好'
  } else {
    result = '晚上好'
  }
  return result
}
