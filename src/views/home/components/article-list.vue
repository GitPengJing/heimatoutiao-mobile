<template>
  <!-- 封装文章列表组件 -->
  <div class="scroll-wrapper">
    <!-- van-pull-refresh实现下拉刷新 -->
    <van-pull-refresh v-model="downloading" @refresh="onRefresh" :success-text="successText">
      <!-- van-list实现上拉加载数据 -->
      <van-list v-model="uploading" :finished="finished" @load="onload">
        <!-- 如果组件距离底部的距离超过了限定的值就会触发load事件 会把uploading变为true 表示加载完毕-->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item" :title="item"></van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploading: false, // 上拉加载状态
      finished: false, // 数据是否加载完毕
      downloading: false, // 下拉刷新状态
      articles: [], // 文章列表
      successText: '' // 刷新成功提示文本
    }
  },
  methods: {
    // 下拉加载 组件距离底部距离小于默认值触发
    onload () {
      console.log('开始加载数据')
      if (this.articles.length > 50) {
        // 文章有五十条则数据加载完毕
        this.finished = true // 加载完毕
      } else {
        const arr = Array.from(Array(15), (value, index) => {
          return this.articles.length + index + 1
        })
        // 把加载的数据从文章列表末尾追加
        this.articles.push(...arr)
        // 关闭加载状态
        this.uploading = false
      }
    },
    // 下拉刷新时触发
    onRefresh () {
      // 设置一秒后加载完成
      setTimeout(() => {
        //  新增的数组
        const arr = Array.from(Array(2), (value, index) => {
          return '新增' + (index + 1)
        })
        // 添加到文章列表的顶部
        this.articles.unshift(...arr)
        // 刷新完成
        this.downloading = false
        // 完成后提示的文本
        this.successText = '新增了两篇文章'
      }, 1000)
    }
  }
}
</script>

<style>
</style>
