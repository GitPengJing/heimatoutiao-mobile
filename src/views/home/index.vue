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
              <moreOperate
              @dislike="dislikeORreport('dislike')"
              @report="dislikeORreport('report',$event)"/>
            </van-popup>
            <!-- 频道编辑弹层 -->
            <van-action-sheet
            v-model="showChannelEdit"
            :round="false"
            title="编辑频道">
              <!-- :mychannel将我的频道数据传给子组件channel-edit -->
              <!-- :activeIndex将激活的频道索引传给子组件channel-edit -->
              <!-- @accessChannel触发子组件channel-edit的自定义进入频道事件 -->
              <!-- @delChannels触发子组件channel-edit的自定义删除频道事件 -->
              <channelEdit
              @addMyChannels="addMyChannels"
              @delMyChannels="delMyChannels"
              :activeIndex="activeIndex"
              @accessChannel="accessChannel"
              :mychannel="channels"/>
            </van-action-sheet>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav' @click="showChannelEdit=true"></van-icon>
      </span>
  </div>
</template>

<script>
import moreOperate from './components/more-operate' // 引入弹窗内容组件
import articleList from './components/article-list' // 引入文章列表组件
import channelEdit from './components/channel-edit' // 引入频道编辑组件
import { getMyChannels, delMyChannels, addMyChannels } from '@/api/channels' // 引入获取频道方法
import { dislikeArticle, reportArticle } from '@/api/articles' // 引入不感兴趣文章接口
import eventBus from '@/utils/eventBus' // 引入公交车事件
export default {
  components: {
    articleList,
    moreOperate,
    channelEdit
  },
  data () {
    return {
      channels: [], // 频道数据
      showMoreOperate: false, // 控制弹窗的显示隐藏
      articleID: null, // 文章id
      activeIndex: 0, // 激活的频道
      showChannelEdit: false // 控制频道编辑页的显示隐藏
    }
  },
  methods: {
    // 添加我的频道
    async addMyChannels (channel) {
      await addMyChannels(channel)
      this.channels.push(channel)
    },
    // 删除我的频道
    async delMyChannels (id) {
      try {
        await delMyChannels(id)
        // 找到要删除的频道对应的索引
        const index = this.channels.findIndex(item => item.id === id)
        // 判断索引跟激活索引的关系
        if (index <= this.activeIndex) {
          // 如果要删除的频道索引小于激活的索引 则激活的索引要减一 填补空缺
          this.activeIndex--
        }
        // 删除频道
        this.channels.splice(index, 1)
      } catch (error) {
        // 删除失败报错
        this.$Pnotify({ message: '删除失败' })
      }
    },
    // 点击频道进入对应频道
    accessChannel (index) {
      this.activeIndex = index // 将点击的频道索引给激活的频道索引
      this.showChannelEdit = false // 关闭编辑频道弹层
    },
    // 不感兴趣文章
    async dislikeORreport (operateType, type) {
      try {
        operateType === 'dislike'
          ? await dislikeArticle({
          // 传入点击的文章id
            target: this.articleID
          }) : await reportArticle({
            target: this.articleID,
            type
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
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
