import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const home = () => import('@/views/home')
const routes = [
  {
    path: '/',
    component: home
  }
]

const router = new VueRouter({
  routes
})

export default router
