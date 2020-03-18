/*********
 * 设置基地址
 * 处理大数字类型
 * 统一注入token
 * 拦截器
 * 解构响应回来的数据
 */
import axios from 'axios' // 引入axios
import JSONbig from 'json-bigint' // 引入大数字插件
import store from '@/store'
// axios.create()等于new了一个实例对象
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基地址
  // 处理大数字类型
  transformResponse: [function (data) {
    //   如果返回有数据处理 没有返回空对象
    return data ? JSONbig.parse(data) : {}
  }]

})
// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 如果成功  注入token
  if (store.state.user.token) {
    //   config是请求的所有配置信息
    // 如果成功并且存在token给请求头注入token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // 失败返回失败信息
  return Promise.reject(error)
})
// 响应拦截器 响应回来的时候拦截
instance.interceptors.response.use(function (response) {
//   解构回来的响应体
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  return Promise.reject(error)
})
export default instance // 导出新实例
