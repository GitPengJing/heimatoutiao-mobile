<template>
  <div class="container">
    <!-- 顶部导航 fixed固定在顶部 如果路由地址是/user就没有van-nav-bar-->
    <van-nav-bar fixed
    title="黑马头条"
    right-text="搜索"
    v-if="$route.path!=='/user'"
    @click-right="$router.push('/search')">
    </van-nav-bar>
    <!-- 中间二级路由 如果地址是/user就没有padding-top-->
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
        <router-view></router-view>
    </div>
    <!-- 底部标签栏 route开启路由模式-->
    <van-tabbar route>
        <van-tabbar-item to='/' icon="wap-home-o">首页</van-tabbar-item>
        <van-tabbar-item to='/question' icon="question-o">问答</van-tabbar-item>
        <van-tabbar-item to='/video' icon="video-o">视频</van-tabbar-item>
        <van-tabbar-item to='/user' icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
