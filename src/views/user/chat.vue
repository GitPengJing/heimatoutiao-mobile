<template>
  <div class="container">
  <van-nav-bar fixed
  title="小智同学"
  left-arrow
  @click-left='$router.back()'></van-nav-bar>
  <div class="chat-list" ref="mylist">
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- name是xz 头像在左边 -->
        <van-image fit="cover" v-if="item.name==='xz'" round :src="xzIMG" />
        <div class="chat-pao">{{item.msg}}</div>
        <!-- name不是xz 头像在右边-->
        <van-image  fit="cover" v-if="item.name!=='xz'" round :src="photo" />
      </div>
      <!-- <div class="chat-item right"> -->
        <!-- <div class="chat-pao">ewqewq</div> -->
      <!-- </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:skyblue">提交</span>
      </van-field>
    </div>
</div>
</template>

<script>
import xzIMG from '@/assets/XZphoto.jpg' // 引入小智同学头像
import { mapState } from 'vuex' // 引入共享数据
import io from 'socket.io-client' // socket客户端
export default {
  computed: {
    ...mapState(['photo', 'user']) // 使用共享的变量
  },
  data () {
    return {
      value: '', // 输入的内容
      loading: false, // 加载状态
      list: [], // 聊天记录
      xzIMG // 小智同学头像
    }
  },
  // 初始化钩子函数
  created () {
    // 建立与websocket服务器的链接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 传入query参数，会拼接到地址后面
      query: {
        token: this.user.token
      }
    })
    // 监听链接成功
    this.socket.on('connect', () => {
      // name区分是谁说的话
      this.list.push({ msg: '你好,我是小智,请问有什么可以帮到您', name: 'xz' })
    })
    // 监听回复消息
    this.socket.on('message', data => {
      // 回复的消息都是小智说的
      this.list.push({ ...data, name: 'xz' })
      this.scroll()
    })
  },
  methods: {
    // 滚动到最底部
    scroll () {
      // 这个函数会在页面数据更新完成渲染之后执行
      // 是vue自带的
      // vue内部渲染是异步的 所以可能数据还没渲染到页面就执行了滚动函数 所以要用这个方法
      this.$nextTick(() => {
        this.$refs.mylist.scrollTop = this.$refs.mylist.scrollHeight
      })
    },
    // 发送信息
    async send () {
      // 判断是否输入内容
      if (!this.value) return false // 没有直接返回
      // 不为空
      // 打开加载状态 防止重复提交
      this.loading = true
      await this.$sleep(300) // 强制等待
      // 使用websocket发送消息
      // 第一个参数消息类型，第二个消息内容
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 时间戳
      }
      // 发送消息
      this.socket.emit('message', obj)
      this.list.push(obj) // 将发送的消息加入到消息列表
      this.value = '' // 清空输入框
      this.loading = false// 关闭加载状态
      this.scroll()
    }
  },
  // 页面销毁前执行的钩子函数
  beforeDestroy () {
    // 关闭小智聊天窗口后断开与websocket的链接
    this.socket.close()
    console.log('链接已关闭')
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
