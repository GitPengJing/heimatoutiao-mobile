<template>
  <div class="container">
    <van-nav-bar title="编辑资料" right-text="保存" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link @click="showName=true" title="名称" :value="user.name" />
      <van-cell is-link @click="showGender=true" title="性别" :value="user.gender===0?'男':'女'" />
      <van-cell is-link @click="showDate" title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <van-cell is-link title="本地相册选择图片"></van-cell>
      <!-- 2 拍照 -->
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层 -->
    <!-- close-on-click-overlay控制点击遮罩层关闭弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message="nameMessage" v-model.trim="user.name" type='textarea' label="修改昵称:" rows="4"></van-field>
       <!-- 按钮确定修改 -->
       <van-button block type="info" @click="editName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet @select="selectGender" :actions="actions" v-model="showGender" cancel-text="取消">
    </van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthday" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthday=false"
          @confirm="clickOk"
         />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false, // 控制头像弹层的显示
      showName: false, // 控制昵称弹层的显示
      showGender: false, // 控制性别弹层的显示
      showBirthday: false, // 控制生日弹层的显示
      actions: [{ name: '男' }, { name: '女' }],
      currentDate: new Date(), // 当前时间
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 最大时间
      nameMessage: '', // 昵称提示信息
      user: {
        // 个人资料
        name: '', // 名字
        gender: 1, // 性别
        photo: '', // 头像
        birthday: '' // 生日
      }
    }
  },
  methods: {
    // 编辑昵称
    editName () {
      // 判断输入的昵称是否是1-7位
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMessage = '用户名长度应是1-7位'
        return
      }
      this.nameMessage = '' // 清空错误提示
      this.showName = false // 关闭昵称弹层
    },
    // 选择性别
    selectGender (item, index) {
      this.user.gender = index
      this.showGender = false
    },
    // 将用户生日显示到弹层的当前时间
    showDate () {
      this.showBirthday = true // 打开弹层
      this.currentDate = new Date(this.user.birthday) // 设置当前时间为用户生日
    },
    // 点击时间确定
    clickOk () {
      // 用户生日设置为当前选择的时间 当前选择时间是Date类型的 所以要转换
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthday = false // 关闭弹层
    },
    // 获取用户个人资料
    async getUserProfile () {
      this.user = await getUserProfile()
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
