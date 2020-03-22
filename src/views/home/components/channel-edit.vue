<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 我的频道显示列表 -->
      <van-grid class="van-hairline--left">
          <!-- 循环我的频道并进行数据渲染 -->
        <van-grid-item v-for="(item,index) in mychannel" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 判断×号的显示 1.推荐永远不显示 2.点击编辑显示-->
          <van-icon v-if="index&&editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{index}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
// 接收父组件传来的我的频道数据
  props: {
    mychannel: {
      required: true, // 该数据必传
      type: Array, // 传过来的数据类型
      default: () => [] // 默认传一个空数组
    }
  },
  data () {
    return {
      editing: false // 编辑状态
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
