<template>
  <div class="container">
  <van-nav-bar fixed
  title="搜索结果"
  left-arrow
  @click-left='$router.back()'></van-nav-bar>
  <van-list v-model="uploading" :finished="finished" @load="onload" finished-text="没有了，没有奇迹了">
      <van-cell-group>
        <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
</div>
</template>

<script>
import { searchArticles } from '@/api/articles' // 引入搜索文章请求
export default {
  data () {
    return {
      uploading: false, // 上拉加载状态
      finished: false, // 数据是否请求完毕
      articles: [], // 搜索出来的文章
      page: {
        page: 1, // 当前页数
        per_page: 10 // 每页数量
      }
    }
  },
  methods: {
    // 滚动条滚动到底部执行
    async onload () {
      const { q } = this.$route.query // 获取query参数，关键词
      // 请求参数
      const data = await searchArticles({ ...this.page, q })
      // 将获取到的数据添加到文章列表变量
      this.articles.push(...data.results)
      // 关闭加载状态
      this.uploading = false
      // 判断是否还有数据
      if (data.results.length) {
        // 如果有 表示下一页有数据 将页码切换到下一页
        this.page.page++
      } else {
        // 如果没有 加载完毕
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
