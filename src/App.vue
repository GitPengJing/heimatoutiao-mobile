<template>
  <div id="app">
    <keep-alive>
    <!-- 需要缓存的 -->
    <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
    <!-- 不需要缓存 -->
    <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
