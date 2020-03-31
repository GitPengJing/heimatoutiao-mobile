import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const layout = () => import('@/views/layout') // 按需加载 layout
const home = () => import('@/views/home') // 按需加载 home 二级路由
const question = () => import('@/views/question')// 按需加载 question 二级路由
const video = () => import('@/views/video')// 按需加载 video 二级路由
const user = () => import('@/views/user')// 按需加载 user 二级路由

const chat = () => import('@/views/user/chat') // 按需加载小智同学
const profile = () => import('@/views/user/profile') // 编辑资料
const article = () => import('@/views/article') // 文章详情
const login = () => import('@/views/login') // 登录
const search = () => import('@/views/search') // 搜索中心
const result = () => import('@/views/search/result') // 搜索结果
const routes = [
  {
    path: '/', // 布局组件
    component: layout,
    children: [
      {
        path: '', // 首页组件
        component: home,
        meta: { isAlive: true } // 是否缓存组件实例
      },
      {
        path: '/question', // 问答组件
        component: question
      },
      {
        path: '/video', // 视频组件
        component: video
      },
      {
        path: '/user', // 个人中心组件
        component: user
      }
    ]
  },
  {
    path: '/login', // 登录组件
    component: login
  },
  {
    path: '/user/chat', // 小智同学组件
    component: chat
  },
  {
    path: '/user/profile', // 编辑资料组件
    component: profile
  },
  {
    path: '/article', // 文章详情组件
    component: article
  },
  {
    path: '/search', // 搜索中心组件
    component: search
  },
  {
    path: '/search/result', // 搜索结果组件
    component: result
  }
]

const router = new VueRouter({
  routes
})

export default router
