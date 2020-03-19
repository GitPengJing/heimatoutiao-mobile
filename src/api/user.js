// 单独封装登录方法
import request from '@/utils/request' // 引入请求模块  相当于axios实例对象

export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data
  })
}
