import request from '@/utils/request' // 引入请求模块
import store from '@/store'
const CACHE_CHANNEL_V = 'hm-toutiao-mobile-v' // 代表登录用户
const CACHE_CHANNEL_T = 'hm-toutiao-mobile-t' // 代表游客
/***
 * 获取用户频道列表
 * 可以不登录 匿名用户返回后台默认的频道列表
 * **/

// 本地化处理
export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    // 判断是否有token区分游客和登录用户
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const str = localStorage.getItem(key) // 读取该key中代表的数据
    if (str) {
      // 如果有数据  直接给到channels
      resolve({ channels: JSON.parse(str) })
    } else {
      // 如果没有数据 请求接口拉取数据
      request({ url: '/user/channels' }).then(res => {
        localStorage.setItem(key, JSON.stringify(res.channels))
        // /***
        //  * 父组件中的方法
        //  * const res = await getMyChannels()
        //  * this.channels = res.channels
        //  * /
        // 将请求的结果给到父组件中执行成功的res
        resolve(res)
      })
    }
  }
  )
}
/******
 * 删除我的频道
 */
export function delMyChannels (id) {
  return new Promise(function (resolve, reject) {
    // 根据有没有token判断是游客删除还是登录用户删除
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 将key中的值取出来给到channels
    const channels = JSON.parse(localStorage.getItem(key))
    // 找到要删除的数据对应的索引
    const index = channels.findIndex(item => item.id === id)
    // 判断索引是否存在
    if (index > -1) {
      // 如果存在，就删除该条数据
      channels.splice(index, 1)
      // 将删除之后的数据写入本地
      localStorage.setItem(key, JSON.stringify(channels))
      // 执行成功进入resolve()
      resolve()
    } else {
      // 如果索引不存在 就报错
      reject(new Error('没有找到对应的频道'))
    }
  })
}

/*******
 * 添加我的频道
 *
 */
export function addMyChannels (channel) {
  return new Promise(function (resolve, reject) {
    // 根据有没有token判断是游客添加还是登录用户添加
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去除对应的key的数据  （登录用户还是游客）
    const channels = JSON.parse(localStorage.getItem(key))
    // 添加到我的频道中
    channels.push(channel)
    // 添加后的频道数据重新写入
    localStorage.setItem(key, JSON.stringify(channels))
    resolve() // 执行成功
  })
}

/*****
 * 获取全部频道
 */
export function getAllchannels () {
  return request({
    url: '/channels'
  })
}
