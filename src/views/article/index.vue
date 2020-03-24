<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-text="返回" @click-left="$router.back()"></van-nav-bar>
    <div class="detail">
      <!-- 文章标题 -->
      <h3 class="title">{{article.title}}</h3>
      <!-- 作者信息 -->
      <div class="author">
        <!-- 头像 -->
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <!-- 作者名 -->
          <p class="name">{{article.aut_name}}</p>
          <!-- 发布时间 -->
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <!-- 关注与否 -->
        <van-button
          @click="follow"
          round
          size="small"
          type="info"
        >{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <!-- 文章 -->
      <div class="content">
        <p>{{article.content}}</p>
      </div>
      <!-- 点赞或者不喜欢 -->
      <div class="zan">
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          :class="{active:article.attitude===0}"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
    </div>
    <!-- 评论组件 -->
    <comment/>
    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading">
      <!-- 加载进度条 -->
      <div class="loading-container">
        <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import comment from './components/comment' // 引入评论组件
import { getArticleInfo } from '@/api/articles' // 引入获取文章详情请求
import { followUser, unfollowUser } from '@/api/user' // 引入关注用户与取消关注用户请求
export default {
  components: {
    comment
  },
  data () {
    return {
      article: [], // 文章详情数据
      loading: false
    }
  },
  methods: {
    // 点击关注用户
    async follow () {
      try {
        if (this.article.is_followed) {
          // 如果为true 则点击为取消关注
          await unfollowUser(this.article.aut_id)
        } else {
          // 如果为false 则点击为关注
          await followUser({ target: this.article.aut_id })
        }

        // 将关注状态取反，页面显示
        this.article.is_followed = !this.article.is_followed
        this.$Pnotify({
          type: 'success',
          message: this.article.is_followed ? '关注成功' : '取消关注成功'
        })
      } catch (error) {
        // 失败报错
        this.$Pnotify({ message: '操作失败' })
      }
    },
    // 获取文章详情
    async getArticleInfo () {
      this.loading = true // 打开遮罩层
      // 取到路由参数中的文章id
      const { artId } = this.$route.query
      // 请求的数据赋值
      this.article = await getArticleInfo(artId)
      this.loading = false // 关闭遮罩层
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
