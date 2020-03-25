import request from '@/utils/request' // 引入请求模块  相当于axios实例对象

// 单独封装登录方法
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data
  })
}

/***
 * 关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

/***
 * 取消关注用户
 */
export function unfollowUser (autId) {
  return request({
    url: `/user/followings/${autId}`,
    method: 'delete'
  })
}

/***
 * 获取自己的信息
 */
export function getMyInfo () {
  return request({
    url: '/user'
  })
}
