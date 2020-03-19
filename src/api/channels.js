/***
 * 获取用户频道列表
 * 可以不登录 匿名用户返回后台默认的频道列表
 * **/
import request from '@/utils/request' // 引入请求模块
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
