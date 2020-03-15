/******
 * 改文件堆token进行操作
 * create by pengj 2020/3/15
 *
 * ****/
const USER_TOKEN = 'heima-toutiao-mobile' // 存储用户信息
// 设置用户token
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user)) // 对象转化为json字符串
}
// 获取用户token
export function getUser () {
  // JSON.parse()转化是括号内为空会报错
  // 如果||前为true 取前面的值 为false 取后面的值
  JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // json字符串转化为对象
}
// 删除用户token
export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
