/*****
 * 获取文章
 * 处理文章模块的请求数据
 */
import request from '@/utils/request' // 引入请求模块
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
