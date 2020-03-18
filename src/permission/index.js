/*******
 *导航守卫
****/
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex的实例对象store
// 路由发生变化就会执行
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 如果要去的地址开头为/user 并且没有token
    // 去登录
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    })
  } else {
    //   去的地址不是/user
    //   去的是/user 但是有token
    // 直接放过
    next()
  }
})
