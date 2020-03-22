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

/*****
 * 获取全部频道
 */
export function getAllchannels () {
  return request({
    url: '/channels'
  })
}
