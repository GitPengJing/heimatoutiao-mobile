// plugin.js专门负责提供小函数以及vue中常用的过滤器及函数
import dayjs from 'dayjs' // 引入dayjs插件
import 'dayjs/locale/zh-cn' // 引入语言格式
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
dayjs.extend(relativeTime) // 使用相对时间
export default {
  install (Vue) {
    Vue.prototype.$Pnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 给原型属性添加方法
    Vue.filter('relTime', relTime) // 全局注册过滤器处理时间
  }
}

// 休眠函数 不让用户拉取数据频繁
function sleep (time = 600) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}

// 处理时间格式函数
function relTime (data) {
  // 返回传入值的相对时间
  return dayjs().locale('zh-cn').from(data)
}
