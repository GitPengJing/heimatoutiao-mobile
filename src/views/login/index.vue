<template>
  <div class="container">
    <!-- 头部标题 -->
  <van-nav-bar title="登录"
  left-arrow
  @click-left='$router.back()'></van-nav-bar>
  <!-- 输入框 -->
  <van-cell-group>
    <van-field label="手机号" placeholder="请输入用户名"></van-field>
    <van-field label="验证码" placeholder="请输入验证码">
      <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
  </van-cell-group>
  <!-- 登录按钮 -->
  <div class="login-box">
    <van-button type="info" size="small" round block>登录</van-button>
  </div>
</div>
</template>

<script>
export default {

}
</script>

<style>
.login-box {
  padding: 20px
}
</style>
