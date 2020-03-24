<template>
  <!-- 封装文章列表组件 -->
  <div class="scroll-wrapper">
    <!-- van-pull-refresh实现下拉刷新 -->
    <van-pull-refresh v-model="downloading" @refresh="onRefresh" :success-text="successText">
      <!-- van-list实现上拉加载数据 -->
      <van-list v-model="uploading" :finished="finished" @load="onload">
        <!-- 如果组件距离底部的距离超过了限定的值就会触发load事件 会把uploading变为true 表示加载完毕-->
        <van-cell-group>
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 根据封面类型决定是三图type===3 单图type===1 还是无图 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{item.pubdate|relTime}}</span>
                <!-- 根据有无token来判断×的显示 -->
                <!-- $emit('showOperate')给父组件传送指令 -->
                <span @click.stop="$emit('showOperate',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles' // 引入获取文章方法
import { mapState } from 'vuex' // 引入共享数据
import eventBus from '@/utils/eventBus'
export default {
  computed: {
    ...mapState(['user'])
  },
  props: {
    //   接收父组件传的频道id
    channel_id: {
      required: true, // 表示必须传值
      type: Number, // 表示传过来的值的类型
      default: null // 默认值，不传就用默认值
    }
  },
  data () {
    return {
      uploading: false, // 上拉加载状态
      finished: false, // 数据是否加载完毕
      downloading: false, // 下拉刷新状态
      articles: [], // 文章列表
      successText: '', // 刷新成功提示文本
      timeStamp: null // 存放时间戳
    }
  },
  created () {
    // 监听delArticle事件
    eventBus.$on('delArticle', (artId, channelId) => {
      // 判断点击的文章所在频道 是否是自己所在的频道
      if (channelId === this.channel_id) {
        // 如果是 找到该条文章 返回下标
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          // 删除对应的文章
          this.articles.splice(index, 1)
        }
        // 如果删完了数据列表
        if (this.articles.length === 0) {
          // 再次请求文章
          this.onload()
        }
      }
    })
  },
  methods: {
    // 下拉加载 组件距离底部距离小于默认值触发
    async onload () {
      await this.$sleep()
      //   请求接口 获取文章数据
      //   channel_id为父组件传来的频道id
      //   timeStamp 表示时间戳 请求历史推荐传历史时间戳
      //   如果有指定的历史时间戳就用 没有就存入当前的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timeStamp || Date.now()
      })
      //   把获取到的文章追加到尾部
      this.articles.push(...data.results)
      //   加载状态设为false 表示加载完毕
      this.uploading = false
      //   如果有历史时间戳 表示数据还能继续加载
      if (data.pre_timestamp) {
        this.timeStamp = data.pre_timestamp
      } else {
        //  如果没有 表示数据加载完毕
        this.finished = true
      }
    },
    // 下拉刷新时触发
    async onRefresh () {
      await this.$sleep()
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 请求新的数据传当前时间戳
      })
      //   该函数执行会自动将downloading变为true
      //   所以请求数据回来以后需要手动关闭刷新状态
      this.downloading = false
      //   如果下拉刷新还有数据
      if (data.results.length) {
        //   刷新到的数据加到原数据的顶部 为非feed信息流模式
        //  将原数据全部覆盖 feed信息流模式
        this.articles = data.results
        // 因为是新的一波数据,所以带来了新的历史时间戳
        if (data.pre_timestamp) {
          // 要将下拉加载的完成状态关闭 可以继续下拉加载数据
          this.finished = false
          this.timeStamp = data.pre_timestamp // 将时间戳给变量 ,给上拉加载用
        }
        this.successText = `为您更新了${data.results.length}条数据`
      } else {
        //   如果没有新数据
        this.successText = '当前数据已是最新'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
