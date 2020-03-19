// plugin.js专门负责提供小函数以及vue中常用的过滤器及函数
export default {
  install (Vue) {
    Vue.prototype.$Pnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 给原型属性添加方法
  }
}

// 休眠函数 不让用户拉取数据频繁
function sleep (time = 600) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
