<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" @load="onload" finished-text="没有更多了">
        <!-- 渲染评论数据 -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <!-- 作者头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <!-- 作者名 -->
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <!-- 评论数量 -->
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <!-- 评论内容 -->
          <p>{{item.content}}</p>
          <p>
            <!-- 发布时间 -->
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <!-- 回复数量 -->
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 回复 -->
    <van-action-sheet v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="replys in reply.list" :key="replys.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="replys.aut_photo" />
          <div class="info">
            <p><span class="name">{{replys.aut_name}}</span></p>
            <p>{{replys.content}}</p>
            <p><span class="time">{{replys.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
    <!-- 发布评论 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>

</template>

<script>
import { getComments } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 评论数据
      comments: [],
      // 偏移量 是否分页 如果为null则表示第一页数据 第二页数据为第一页最后一个id
      // 以此类推 当前页最后一个id等于整个评论最后一个id 则表示数据加载完了
      offset: null,
      showReply: false, // 弹出层的显示隐藏
      reply: {
        commentId: null, // 获取评论的id
        loading: false, // 评论的回复的加载状态
        finished: false, // 评论的回复是否加载完成
        list: [], // 评论的回复的数据
        offset: null // 评论的回复的偏移量
      }
    }
  },
  methods: {
    openReply (commentId) {
      this.showReply = true // 显示回复层
      this.reply.commentId = commentId // 传评论的id
      this.reply.list = [] // 清空回复列表，保证每一次点开都是新的数据
      this.reply.offset = null // 表示数据从第一页开始
      this.reply.finished = false // 打开finished 因为上一次打开回复时可能为true 再次打开回复就得重新赋值
      this.reply.loading = true // 打开加载状态
      this.getReply() // 主动加载数据
    },
    // 获取评论回复
    async getReply () {
      const data = await getComments({
        type: 'c', // 评论的回复
        source: this.reply.commentId, // 评论的id
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false
      if (data.last_id === data.end_id) {
        this.reply.finished = true
      } else {
        this.reply.offset = data.last_id
      }
    },
    // 获取评论
    async onload () {
      const { artId } = this.$route.query // 得到文章id
      const data = await getComments({
        type: 'a', // a表示对文章评论，c表示对评论回复
        source: artId, // 对文章评论传文章id 对评论回复传作者id
        offset: this.offset
      })
      //  将评论追加到评论列表
      this.comments.push(...data.results)
      //   表示当前加载完毕
      this.loading = false
      if (data.last_id === data.end_id) {
        //   如果当前页最后一个id等于整个列表最后一个id，表示加载完成
        this.finished = true
      } else {
        // 否则将当前页最后一个id赋值给偏移量 表示加载第二页数据
        this.offset = data.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
