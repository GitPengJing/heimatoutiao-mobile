<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 搜索建议 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <!-- 如果有历史记录才显示 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon @click="clearHistory" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 点击搜索记录去搜索结果页 -->
        <van-cell @click="toSearchRes(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- .stop修饰符阻止冒泡事件 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hm-toutiao-mobile-history'
export default {
  data () {
    return {
      q: '', // 输入框输入的内容
      historyList: JSON.parse(localStorage.getItem(key) || '[]') // 存放搜索历史记录
    }
  },
  methods: {
    // 删除历史记录
    delHistory (index) {
      // 删除选中的记录
      this.historyList.splice(index, 1)
      // 删除之后同步到本地
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 跳到搜索结果页
    toSearchRes (text) {
      // query传参
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 回车搜索
    onSearch (q) {
      // 判断输入框是否输入了内容
      if (!this.q) return
      // 将搜索内容加到搜索历史列表
      this.historyList.push(this.q)
      // 去重
      // from通过给定的对象中创建一个数组。
      // new Set 去重方法
      this.historyList = Array.from(new Set(this.historyList))
      // 同步到本地
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转到搜索的内容页面
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    },
    // 清空搜索记录
    async clearHistory () {
      try {
        // 提示是否确定清楚历史记录
        await this.$dialog.confirm({
          title: '提示',
          message: '确定要清楚历史记录吗？'
        })
        // 清空历史记录列表
        this.historyList = []
        // 本地同步
        localStorage.setItem(key, '[]')
      } catch (error) {

      }
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
