// plugin.js专门负责提供小函数以及vue中常用的过滤器及函数
export default {
  install (Vue) {
    Vue.prototype.$Pnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
