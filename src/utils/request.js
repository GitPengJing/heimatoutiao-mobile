/*********
 * 设置基地址
 * 处理大数字类型
 * 统一注入token
 * 拦截器
 * 解构响应回来的数据
 */
import axios from 'axios' // 引入axios
import JSONbig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象 替代this.$store
import router from '@/router' // 引入router对象
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
}, async function (error) {
  // 边界判断 如果不加error.response
  // error.response不存在的话，error.response.status就会报错
  // 例var a={} , a.b为undefined  a.b.c就会报错
  if (error.response && error.response.status === 401) {
    // 如果状态码是401则token失效
    // path传对象形式 ，从哪失败回哪里
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullpath // 当前路由的完整地址
      }
    }
    // 如果有refresh_token调用接口去更新token
    if (store.state.user.refresh_token) {
      try {
        const res = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // 请求成功，更新vuex中的数据
        store.commit('reviseUser', {
          user: {
            token: res.data.data.token, // 新token
            refresh_token: store.state.user.refresh_token // 用来交换的refresh_token
          }
        })
        //  更新完之后再次发送之前的错误请求,但是token已经更新的就不会再请求错误
        //  让用户感觉不到已经更换了token
        return instance(error.config)
      } catch (error) {
        // 如果请求失败 说明refresh_token也失效了 只能回去重新登录
        // 删除失效的token
        store.commit('deleteUser')
        // 回到登录页
        router.push(path)
      }
    } else {
      // 如果没有refresh_token
      // 删除token 直接回到登录页
      store.commit('deleteUser')
      router.push(path)
    }
  }
  // 直接返回错误
  return Promise.reject(error)
})
export default instance // 导出新实例
