<template>
  <div class="container">
    <!-- 头部标题 -->
  <van-nav-bar title="登录"
  left-arrow
  @click-left='$router.back()'></van-nav-bar>
  <!-- 输入框 -->
  <van-cell-group>
    <!-- 手机号 -->
    <van-field v-model.trim="loginForm.mobile"
    label="手机号"
    placeholder="请输入用户名"
    :error-message="errorMessage.mobile"
    @blur="checkMobile">
    </van-field>
    <!-- 验证码 -->
    <van-field v-model.trim="loginForm.code"
    label="验证码"
    placeholder="请输入验证码"
    :error-message="errorMessage.code"
    @blur="checkCode">
      <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
  </van-cell-group>
  <!-- 登录按钮 -->
  <div class="login-box">
    <van-button @click="login" type="info" size="small" round block>登录</van-button>
  </div>
</div>
</template>

<script>
import { login } from '@/api/user' // 引入登录方法
import { mapMutations } from 'vuex' // 引入mutations中的方法
export default {
  data () {
    return {
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      errorMessage: {
        mobile: '', // 手机号错误信息提示
        code: '' // 验证码错误信息提示
      }
    }
  },
  methods: {
    ...mapMutations(['reviseUser']),
    // 校验手机号
    checkMobile () {
      // 手机号不能为空
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false // 校验不通过
      }
      // 手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      this.errorMessage.mobile = '' // 通过没有提示消息
      return true
    },
    checkCode () {
      // 验证码不能为空
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false // 校验不通过
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码格式不正确'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 点击登录校验
    async login () {
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        try {
          // 如果校验通过请求接口
          const res = await login(this.loginForm)
          this.reviseUser({ user: res }) // 更新token
          // 判断是否需要跳转页面
          const { redirectUrl } = this.$route.query
          // 短路表达式 前面为ture取前面的值 否则取后面的值
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          // 错误提示信息
          this.$Pnotify({ message: '手机号或验证码错误' })
        }
      }
    }
  }
}
</script>

<style>
.login-box {
  padding: 20px
}
</style>
