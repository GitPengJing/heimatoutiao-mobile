<template>
  <div class="container">
      <!-- 放置tabs组件 -->
      <!-- swipeable 手势滑动切换 -->
      <van-tabs swipeable v-model="activeIndex">
         <!-- 内部需要放置子 标签  title值为当前显示的内容-->
         <!-- van-tab是vant组件的样式  -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
           <!-- 将频道id传给文章列表组件 -->
           <!-- @showOperate 子组件传来的指令 -->
            <articleList @showOperate="openMoreOperate" :channel_id='item.id'/>
            <van-popup :style="{ width: '80%' }" v-model="showMoreOperate">
              <moreOperate @dislike="dislikeArticle" />
            </van-popup>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
  </div>
</template>

<script>
import moreOperate from './components/more-operate' // 引入弹窗内容组件
import articleList from './components/article-list' // 引入文章列表组件
import { getMyChannels } from '@/api/channels' // 引入获取频道方法
import { dislikeArticle } from '@/api/articles' // 引入不感兴趣文章接口
import eventBus from '@/utils/eventBus' // 引入公交车事件
export default {
  components: {
    articleList,
    moreOperate
  },
  data () {
    return {
      channels: [], // 频道数据
      showMoreOperate: false, // 控制弹窗的显示隐藏
      articleID: null, // 文章id
      activeIndex: 0 // 激活的频道
    }
  },
  methods: {
    // 不感兴趣文章
    async dislikeArticle () {
      try {
        await dislikeArticle({
          // 传入点击的文章id
          target: this.articleID
        })
        // 操作成功提示信息
        this.$Pnotify({
          type: 'success',
          message: '操作成功'
        })
        // 删除该条文章
        eventBus.$emit('delArticle', this.articleID, this.channels[this.activeIndex].id)
        // 关闭弹窗
        this.showMoreOperate = false
      } catch (error) {
        // 操作失败提示信息 默认是红色
        this.$Pnotify({
          message: '操作失败'
        })
      }
    },
    // 打开弹窗
    openMoreOperate (artId) {
      this.showMoreOperate = true // 打开弹窗
      this.articleID = artId // 给到文章id
      // console.log(artId)
    },
    // 获取频道
    async getMyChannels () {
      const res = await getMyChannels()
      this.channels = res.channels
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
