// 用vuex管理token状态
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 引入操作token方法

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存放需要共享的资源
    user: auth.getUser()
  },
  mutations: {
    // 在这里修改state中的数据
    // 修改token
    reviseUser (state, payload) {
      state.user = payload.user
      // 同步缓存
      auth.setUser(payload.user)
    },
    // 删除token
    deleteUser (state) {
      state.user = {}
      // 本地缓存同步删除
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
