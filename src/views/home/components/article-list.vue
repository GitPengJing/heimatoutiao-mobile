<template>
  <!-- 封装文章列表组件 -->
  <div class="scroll-wrapper">
      <!-- van-list实现上拉加载数据 -->
    <van-list v-model="uploading"
    :finished="finished"
    @load="onload">
    <!-- 如果组件距离底部的距离超过了限定的值就会触发load事件 会把uploading变为true 表示加载完毕-->
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploading: false, // 加载状态
      finished: false // 数据是否加载完毕
    }
  },
  methods: {
    onload () {
      console.log('加载完毕')
      setTimeout(() => {
        this.finished = true
      }, 1000)
    }
  }
}
</script>

<style>

</style>
