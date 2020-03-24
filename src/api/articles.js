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

/****
 * 不感兴趣文章
 */
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
/***
 * 取消对文章不喜欢
 */
// export function notDislikeArticle (artId) {
//   return request({
//     url: `/article/dislikes/${artId}`,
//     method: 'delete'
//   })
// }

/*****
 * 举报文章
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

/****
 * 搜索联想建议
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}

/***
 * 获取搜索结果
 */
export function searchArticles (params) {
  return request({
    url: '/search',
    params
  })
}

/****
 * 获取文章详情
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
